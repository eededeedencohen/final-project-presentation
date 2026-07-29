import { useCallback, useEffect, useRef, useState } from "react";
import fixWebmDuration from "fix-webm-duration";
import "./styles.css";

/* ============================================================
   Recorder - חלון מצלמה צף (בסגנון זום) + הקלטת המצגת.
   ההקלטה תופסת את המסך המשותף (בחר את הטאב של המצגת) יחד עם
   קול מהמיקרופון; חלון הפנים מוצג על המסך ולכן נכלל בהקלטה.
   ============================================================ */

/* פורמט ההקלטה הנתמך הראשון בדפדפן הנוכחי.
   WebM/VP8 קודם — אותו פורמט בדיוק שממירי וידאו מייצרים והוכח שמתנגן
   חלק אצל המשתמש; אחרי העצירה הקובץ נארז מחדש עם משך ואינדקס דילוגים.
   MP4/H.264 נשאר כגיבוי לדפדפנים בלי הקלטת WebM */
function pickMimeType() {
  if (typeof MediaRecorder === "undefined") return "";
  return (
    [
      "video/webm;codecs=vp8,opus",
      "video/webm;codecs=vp9,opus",
      "video/webm",
      "video/mp4;codecs=avc1.64002A,mp4a.40.2",
      "video/mp4;codecs=avc1.4D402A,mp4a.40.2",
      "video/mp4;codecs=avc1.42E02A,mp4a.40.2",
      "video/mp4",
    ].find((t) => MediaRecorder.isTypeSupported(t)) || ""
  );
}

const two = (n) => String(n).padStart(2, "0");

/* רוחבי חלון המצלמה (הגובה נגזר ביחס 3:2). המינימום משאיר שוליים
   לשורת הפקדים (4 כפתורים = 160px) בלי חיתוך בפינות המעוגלות */
const SIZES = [176, 240, 336, 448];

export default function Recorder() {
  const [camOn, setCamOn] = useState(false);
  const [recState, setRecState] =
    useState("idle"); /* idle | recording | paused */
  const [seconds, setSeconds] = useState(0);
  const [sizeIdx, setSizeIdx] = useState(1);
  const [pos, setPos] = useState(null); /* null = מיקום ברירת המחדל מה-CSS */
  const [error, setError] = useState("");

  const videoRef = useRef(null);
  const bubbleRef = useRef(null);
  const camStreamRef = useRef(null);
  const displayStreamRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const dragRef = useRef(null);
  const openingRef = useRef(false);
  /* מדידת משך מדויקת — נדרשת לתיקון כותרת ה-WebM (בלעדיה אין דילוג בנגן) */
  const startTsRef = useRef(0);
  const pausedMsRef = useRef(0);
  const pauseTsRef = useRef(0);
  const isPausedRef = useRef(false);

  /* --- מצלמה + מיקרופון --- */
  const openCamera = async () => {
    /* חסימת לחיצה כפולה בזמן שחלון ההרשאות פתוח - אחרת נפתחים שני
       streams והראשון דולף (נורית המצלמה נשארת דולקת) */
    if (openingRef.current || camStreamRef.current) return;
    openingRef.current = true;
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      camStreamRef.current = stream;
      setCamOn(true);
      /* פתיחת מצלמה = כוונה להקליט — מחממים את מנוע האריזה מראש,
         כדי שהשמירה בסוף ההקלטה לא תחכה להורדת הקוד */
      import("./normalizeRecording.js").catch(() => {});
    } catch {
      setError("אין גישה למצלמה או למיקרופון - אשר הרשאות בדפדפן ונסה שוב");
    } finally {
      openingRef.current = false;
    }
  };

  useEffect(() => {
    if (camOn && videoRef.current && camStreamRef.current) {
      videoRef.current.srcObject = camStreamRef.current;
    }
  }, [camOn]);

  const closeCamera = () => {
    if (recState !== "idle") return;
    camStreamRef.current?.getTracks().forEach((t) => t.stop());
    camStreamRef.current = null;
    setCamOn(false);
    setPos(null);
    setSizeIdx(1);
  };

  /* --- הקלטה --- */
  const stopRecording = useCallback(() => {
    const rec = recorderRef.current;
    if (rec && rec.state !== "inactive") rec.stop();
  }, []);

  const startRecording = async () => {
    setError("");
    let display;
    try {
      display = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: { ideal: 60, max: 60 } },
        audio: false,
        /* כרום: מציע קודם את הטאב הנוכחי - הבחירה הנכונה להקלטת המצגת */
        preferCurrentTab: true,
        selfBrowserSurface: "include",
      });
    } catch {
      setError("ההקלטה לא התחילה - יש לבחור מסך או טאב בחלון השיתוף");
      return;
    }
    /* הגבלת הלכידה לאזור המצגת (Element Capture) — פתקי הדובר שמחוץ
       לאזור לא נכנסים לסרטון. אם ההגבלה לא זמינה (דפדפן ישן, או
       שנבחר מסך/חלון במקום הטאב) — הפתקים יוסתרו בזמן ההקלטה */
    let restricted = false;
    try {
      const el = document.getElementById("deck-capture-root");
      const track = display.getVideoTracks()[0];
      if (el && window.RestrictionTarget?.fromElement && track?.restrictTo) {
        const target = await window.RestrictionTarget.fromElement(el);
        await track.restrictTo(target);
        restricted = true;
      }
    } catch {
      restricted = false;
    }
    window.dispatchEvent(
      new CustomEvent("rec:capture-state", {
        detail: { recording: true, restricted },
      }),
    );
    document.documentElement.dataset.recCapture = restricted
      ? "restricted"
      : "full";
    try {
      displayStreamRef.current = display;
      const mixed = new MediaStream([
        ...display.getVideoTracks(),
        ...(camStreamRef.current?.getAudioTracks() ?? []),
      ]);
      const mime = pickMimeType();
      const rec = new MediaRecorder(
        mixed,
        mime ? { mimeType: mime, videoBitsPerSecond: 12_000_000 } : undefined,
      );
      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      rec.onstop = async () => {
        const type = mime || "video/webm";
        let blob = new Blob(chunksRef.current, { type });
        chunksRef.current = [];
        /* אם נעצר בזמן השהיה — לסגור את חלון ההשהיה האחרון */
        if (isPausedRef.current) {
          pausedMsRef.current += performance.now() - pauseTsRef.current;
          isPausedRef.current = false;
        }
        const durationMs = Math.max(
          0,
          performance.now() - startTsRef.current - pausedMsRef.current,
        );
        /* כרום שומר קבצים "לא גמורים" (WebM בלי משך ו-Cues, MP4 מפורק) —
           אריזה מחדש הופכת אותם לקובץ תקני שנפתח בכל נגן, בלי קידוד
           מחדש. המודול נטען עצל — צופים במצגת לא מורידים אותו בכלל */
        const kind = type.includes("mp4") ? "mp4" : "webm";
        try {
          const { default: normalizeRecording } = await import(
            "./normalizeRecording.js"
          );
          blob = await normalizeRecording(blob, kind);
        } catch {
          /* אם האריזה נכשלה — לפחות מטביעים משך ב-WebM כדי לאפשר דילוג */
          if (kind === "webm" && durationMs > 0) {
            try {
              blob = await fixWebmDuration(blob, durationMs, { logger: false });
            } catch {
              /* שומרים את המקור */
            }
          }
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        const d = new Date();
        const ext = type.includes("mp4") ? "mp4" : "webm";
        a.href = url;
        a.download = `smart-cart-recording-${d.getFullYear()}-${two(d.getMonth() + 1)}-${two(d.getDate())}-${two(d.getHours())}${two(d.getMinutes())}.${ext}`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 10_000);
        displayStreamRef.current?.getTracks().forEach((t) => t.stop());
        displayStreamRef.current = null;
        recorderRef.current = null;
        setRecState("idle");
        /* ההקלטה נגמרה — הפתקים חופשיים להופיע שוב */
        window.dispatchEvent(
          new CustomEvent("rec:capture-state", {
            detail: { recording: false, restricted: false },
          }),
        );
        delete document.documentElement.dataset.recCapture;
      };
      /* המשתמש עצר את השיתוף מסרגל הדפדפן - מסיימים ושומרים */
      display.getVideoTracks()[0]?.addEventListener("ended", stopRecording);
      rec.start(1000);
      recorderRef.current = rec;
      startTsRef.current = performance.now();
      pausedMsRef.current = 0;
      isPausedRef.current = false;
      setSeconds(0);
      setRecState("recording");
      /* הפוקוס נשאר על הכפתור הממוחזר ו-focus-within היה משאיר את
         התג גלוי — ואז הוא נצרב בסרטון */
      document.activeElement?.blur?.();
    } catch {
      display.getTracks().forEach((t) => t.stop());
      displayStreamRef.current = null;
      setError("הדפדפן לא תומך בהקלטה בפורמט הנדרש");
      window.dispatchEvent(
        new CustomEvent("rec:capture-state", {
          detail: { recording: false, restricted: false },
        }),
      );
      delete document.documentElement.dataset.recCapture;
    }
  };

  const togglePause = () => {
    const rec = recorderRef.current;
    if (!rec) return;
    if (rec.state === "recording") {
      rec.pause();
      pauseTsRef.current = performance.now();
      isPausedRef.current = true;
      setRecState("paused");
    } else if (rec.state === "paused") {
      rec.resume();
      pausedMsRef.current += performance.now() - pauseTsRef.current;
      isPausedRef.current = false;
      setRecState("recording");
      document.activeElement?.blur?.();
    }
  };

  /* בזמן הקלטה הטיימר מוצג גם בכותרת הטאב — היא לא נלכדת בסרטון,
     כך שהתג בעמוד יכול להישאר נסתר והסרטון השמור נקי */
  useEffect(() => {
    if (recState === "idle") {
      document.title = "Smart Cart — מצגת";
      return;
    }
    const t = `${two(Math.floor(seconds / 60))}:${two(seconds % 60)}`;
    document.title = `${recState === "paused" ? "⏸" : "●"} ${t} — הקלטה`;
  }, [recState, seconds]);

  /* טיימר רץ רק בזמן הקלטה פעילה */
  useEffect(() => {
    if (recState !== "recording") return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [recState]);

  /* שגיאה נעלמת לבד אחרי כמה שניות */
  useEffect(() => {
    if (!error) return;
    const id = setTimeout(() => setError(""), 7000);
    return () => clearTimeout(id);
  }, [error]);

  /* ניקוי מלא ביציאה */
  useEffect(
    () => () => {
      camStreamRef.current?.getTracks().forEach((t) => t.stop());
      displayStreamRef.current?.getTracks().forEach((t) => t.stop());
      if (recorderRef.current && recorderRef.current.state !== "inactive") {
        recorderRef.current.stop();
      }
    },
    [],
  );

  /* --- גרירת החלון --- */
  const onPointerDown = (e) => {
    const b = bubbleRef.current.getBoundingClientRect();
    dragRef.current = { dx: e.clientX - b.left, dy: e.clientY - b.top };
    bubbleRef.current.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!dragRef.current) return;
    const el = bubbleRef.current;
    setPos({
      x: Math.max(
        8,
        Math.min(
          e.clientX - dragRef.current.dx,
          window.innerWidth - el.offsetWidth - 8,
        ),
      ),
      y: Math.max(
        8,
        Math.min(
          e.clientY - dragRef.current.dy,
          window.innerHeight - el.offsetHeight - 8,
        ),
      ),
    });
  };
  const onPointerUp = () => {
    dragRef.current = null;
  };

  const stopAll = (e) => {
    e.stopPropagation();
  };

  return (
    <>
      {error && (
        <div className="rec-error" dir="rtl" onClick={() => setError("")}>
          {error}
        </div>
      )}

      {!camOn ? (
        <button
          className="rec-launch"
          onClick={openCamera}
          title="מצלמה והקלטה"
          aria-label="פתח מצלמה להקלטה"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2.5" y="6.5" width="13" height="11" rx="2.5" />
            <path d="M15.5 10.5 21 7.8v8.4l-5.5-2.7" />
          </svg>
        </button>
      ) : (
        <div
          className={`rec-bubble ${recState}`}
          ref={bubbleRef}
          style={{
            width: SIZES[sizeIdx],
            height: Math.round(SIZES[sizeIdx] * 0.66),
            ...(pos
              ? { left: pos.x, top: pos.y, right: "auto", bottom: "auto" }
              : null),
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onTouchStart={stopAll}
          onTouchEnd={stopAll}
          title="גרור להזזה"
        >
          <video ref={videoRef} autoPlay playsInline muted />

          {recState !== "idle" && (
            <div
              className={`rec-badge ${recState === "paused" ? "paused" : ""}`}
            >
              <span className="dot" />
              {two(Math.floor(seconds / 60))}:{two(seconds % 60)}
            </div>
          )}

          <div
            className="rec-controls"
            dir="rtl"
            onPointerDown={stopAll}
            onDoubleClick={stopAll}
          >
            <button
              className="rec-btn"
              onClick={() =>
                setSizeIdx((i) => Math.min(i + 1, SIZES.length - 1))
              }
              disabled={sizeIdx === SIZES.length - 1}
              title="הגדל חלון"
              aria-label="הגדל חלון"
            >
              ＋
            </button>
            <button
              className="rec-btn"
              onClick={() => setSizeIdx((i) => Math.max(i - 1, 0))}
              disabled={sizeIdx === 0}
              title="הקטן חלון"
              aria-label="הקטן חלון"
            >
              −
            </button>
            {recState === "idle" ? (
              <>
                <button
                  className="rec-btn rec-start"
                  onClick={startRecording}
                  title="התחל הקלטה - בחלון שייפתח בחר את הטאב של המצגת"
                  aria-label="התחל הקלטה"
                >
                  ●
                </button>
                <button
                  className="rec-btn"
                  onClick={closeCamera}
                  title="סגור מצלמה"
                  aria-label="סגור מצלמה"
                >
                  ✕
                </button>
              </>
            ) : (
              <>
                <button
                  className="rec-btn"
                  onClick={togglePause}
                  title={recState === "paused" ? "המשך הקלטה" : "השהה הקלטה"}
                  aria-label={
                    recState === "paused" ? "המשך הקלטה" : "השהה הקלטה"
                  }
                >
                  {recState === "paused" ? "▶" : "⏸"}
                </button>
                <button
                  className="rec-btn rec-stop"
                  onClick={stopRecording}
                  title="עצור ושמור קובץ"
                  aria-label="עצור ושמור"
                >
                  ■
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
