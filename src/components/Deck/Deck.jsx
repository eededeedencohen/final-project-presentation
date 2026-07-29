import { useCallback, useEffect, useRef, useState } from "react";
import Recorder from "../Recorder/Recorder.jsx";
import LaserPointer from "../LaserPointer/LaserPointer.jsx";
import NotesOverlay from "../NotesOverlay/NotesOverlay.jsx";
import "./styles.css";

const STAGE_W = 1920;
const STAGE_H = 1080;

const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

function readHash(count) {
  const m = window.location.hash.match(/\d+/);
  if (!m) return 0;
  return clamp(parseInt(m[0], 10) - 1, 0, count - 1);
}

/**
 * מנוע המצגת: ניווט מקלדת/מגע, סנכרון hash, סרגל התקדמות,
 * מצב "מבט-על" (Esc/G), מסך מלא (F) ועזרה (?).
 */
export default function Deck({ slides }) {
  const count = slides.length;
  const [index, setIndex] = useState(() => readHash(count));
  const [step, setStep] = useState(0);
  const [overview, setOverview] = useState(false);
  const [help, setHelp] = useState(false);
  const [scale, setScale] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const touchStart = useRef(null);

  /* --- מסך מלא: מעקב מצב + כפתור (בנוסף לקיצור F).
     כולל קידומות webkit — ספארי באייפד --- */
  useEffect(() => {
    const onFs = () =>
      setFullscreen(
        Boolean(document.fullscreenElement || document.webkitFullscreenElement),
      );
    document.addEventListener("fullscreenchange", onFs);
    document.addEventListener("webkitfullscreenchange", onFs);
    return () => {
      document.removeEventListener("fullscreenchange", onFs);
      document.removeEventListener("webkitfullscreenchange", onFs);
    };
  }, []);

  const toggleFullscreen = useCallback(() => {
    const doc = document;
    const el = doc.documentElement;
    try {
      if (doc.fullscreenElement || doc.webkitFullscreenElement) {
        (doc.exitFullscreen || doc.webkitExitFullscreen)?.call(doc);
      } else {
        (el.requestFullscreen || el.webkitRequestFullscreen)?.call(el);
      }
    } catch {
      /* דפדפן בלי Fullscreen API (אייפון) — מתעלמים בשקט */
    }
  }, []);

  const go = useCallback(
    (target) =>
      setIndex((i) =>
        clamp(typeof target === "function" ? target(i) : target, 0, count - 1),
      ),
    [count],
  );

  /* שקף יכול להצהיר על שלבי אנימציה פנימיים דרך Component.steps -
     לחיצה/חץ מקדמים שלב לפני שעוברים לשקף הבא */
  const totalSteps = slides[index]?.Component?.steps || 0;
  useEffect(() => setStep(0), [index]);

  const next = useCallback(() => {
    if (step < totalSteps) setStep(step + 1);
    else go((i) => i + 1);
  }, [step, totalSteps, go]);

  const prev = useCallback(() => {
    if (step > 0) setStep(step - 1);
    else go((i) => i - 1);
  }, [step, go]);

  /* --- התאמת קנה מידה של הבמה לחלון ---
     נמדד מול ה-layout viewport (עמיד לזום-צביטה של iOS), ומחושב מחדש
     גם אחרי סיבוב מסך, כניסה/יציאה ממסך מלא ושינויי סרגלים בספארי */
  useEffect(() => {
    const fit = () => {
      const w = document.documentElement.clientWidth || window.innerWidth;
      const h = document.documentElement.clientHeight || window.innerHeight;
      setScale(Math.min(w / STAGE_W, h / STAGE_H));
    };
    fit();
    /* ספארי מעדכן מידות באיחור אחרי סיבוב/מסך מלא — מרעננים גם בהשהיה */
    const fitSoon = () => {
      fit();
      setTimeout(fit, 350);
    };
    window.addEventListener("resize", fitSoon);
    window.addEventListener("orientationchange", fitSoon);
    document.addEventListener("fullscreenchange", fitSoon);
    document.addEventListener("webkitfullscreenchange", fitSoon);
    window.visualViewport?.addEventListener("resize", fitSoon);
    return () => {
      window.removeEventListener("resize", fitSoon);
      window.removeEventListener("orientationchange", fitSoon);
      document.removeEventListener("fullscreenchange", fitSoon);
      document.removeEventListener("webkitfullscreenchange", fitSoon);
      window.visualViewport?.removeEventListener("resize", fitSoon);
    };
  }, []);

  /* --- סנכרון hash דו-כיווני --- */
  useEffect(() => {
    const want = `#/${index + 1}`;
    if (window.location.hash !== want) history.replaceState(null, "", want);
  }, [index]);

  useEffect(() => {
    const onHash = () => go(readHash(count));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [count, go]);

  /* --- מקלדת --- */
  useEffect(() => {
    const onKey = (e) => {
      /* Enter/רווח כשכפתור בפוקוס - מפעילים את הכפתור בלבד, לא את
         ניווט המצגת (אחרת לחיצה כפולה: גם הכפתור וגם מעבר שקף) */
      if (
        (e.key === "Enter" || e.key === " ") &&
        e.target instanceof Element &&
        e.target.closest("button, a, input, select, textarea")
      ) {
        return;
      }
      /* פקד קלט ממוקד (למשל סליידר השקיפות של הפתקים) — החיצים שלו
         מכווננים את הערך, לא מנווטים בין שקפים */
      if (
        e.target instanceof Element &&
        e.target.closest("input, select, textarea")
      ) {
        return;
      }
      if (
        ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown", " "].includes(e.key)
      ) {
        e.preventDefault();
      }
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case "PageDown":
        case " ":
        case "Enter":
          if (overview && e.key === "Enter") setOverview(false);
          else next();
          break;
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
        case "Backspace":
          prev();
          break;
        case "Home":
          go(0);
          break;
        case "End":
          go(count - 1);
          break;
        case "f":
        case "F":
          if (document.fullscreenElement) document.exitFullscreen();
          else document.documentElement.requestFullscreen();
          break;
        case "Escape":
          /* אם חלון העזרה פתוח - רק סוגרים אותו; במסך מלא הדפדפן
             ממילא יוצא ממסך מלא, לא פותחים גם מבט-על */
          if (help) {
            setHelp(false);
            break;
          }
          if (document.fullscreenElement) break;
          setOverview((v) => !v);
          break;
        case "g":
        case "G":
        case "o":
        case "O":
          setHelp(false);
          setOverview((v) => !v);
          break;
        case "?":
          setHelp((v) => !v);
          break;
        default:
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [count, go, next, prev, overview, help]);

  /* --- החלקות מגע --- */
  const onTouchStart = (e) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
      dx < 0 ? next() : prev();
    }
    touchStart.current = null;
  };

  const Active = slides[index].Component;

  return (
    <div className="deck" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {/* אזור הלכידה: בזמן הקלטה נלכד רק מה שבתוכו (Element Capture),
          כך שפתקי הדובר שמחוצה לו לא נכנסים לסרטון */}
      <div className="deck-capture" id="deck-capture-root">
      <div className="deck-viewport" onClick={next}>
        <div
          className="deck-stage"
          style={{
            width: STAGE_W,
            height: STAGE_H,
            transform: `translate(-50%, -50%) scale(${scale})`,
          }}
        >
          <div className="deck-slide-in" key={index}>
            <Active step={step} />
          </div>
        </div>
      </div>

      {/* --- כרום המצגת --- */}
      <div className="deck-progress" dir="ltr">
        <div
          className="deck-progress-fill"
          style={{ width: `${((index + 1) / count) * 100}%` }}
        />
      </div>

      <div className="deck-counter" dir="ltr">
        <span className="deck-counter-now">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="deck-counter-sep">/</span>
        <span>{String(count).padStart(2, "0")}</span>
      </div>

      <div className="deck-nav">
        <button
          aria-label="הקודם"
          onClick={prev}
          disabled={index === 0 && step === 0}
        >
          <svg viewBox="0 0 24 24">
            <path
              d="M9 5l7 7-7 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          aria-label="הבא"
          onClick={next}
          disabled={index === count - 1 && step >= totalSteps}
        >
          <svg viewBox="0 0 24 24">
            <path
              d="M15 5l-7 7 7 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          aria-label={fullscreen ? "יציאה ממסך מלא" : "מסך מלא"}
          title={fullscreen ? "יציאה ממסך מלא (F)" : "מסך מלא (F)"}
          onClick={toggleFullscreen}
        >
          {fullscreen ? (
            <svg viewBox="0 0 24 24">
              <path
                d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24">
              <path
                d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>

      {/* מצלמה + הקלטת המצגת */}
      <Recorder />

      {/* מצביע לייזר עם דיו נעלם — מיתוג בקליק ימני */}
      <LaserPointer />

      <div className="deck-brand" dir="ltr">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M3 4h2.4l2.2 11.2a1.6 1.6 0 0 0 1.6 1.3h8.6a1.6 1.6 0 0 0 1.6-1.2L21.5 8H6.1"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="10" cy="20.2" r="1.4" fill="currentColor" />
          <circle cx="17.6" cy="20.2" r="1.4" fill="currentColor" />
        </svg>
        <span>SMART CART</span>
      </div>

      {/* --- מבט-על --- */}
      {overview && (
        <div className="deck-overview" onClick={() => setOverview(false)}>
          <div
            className="deck-overview-grid"
            onClick={(e) => e.stopPropagation()}
          >
            {slides.map((s, i) => {
              const Mini = s.Component;
              return (
                <button
                  key={s.id}
                  className={`deck-mini ${i === index ? "active" : ""}`}
                  onClick={() => {
                    go(i);
                    setOverview(false);
                  }}
                >
                  <div className="deck-mini-stage">
                    <Mini step={s.Component.steps || 0} />
                  </div>
                  <span className="deck-mini-label" dir="rtl">
                    {i + 1} · {s.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* --- עזרה --- */}
      {help && (
        <div className="deck-help" onClick={() => setHelp(false)}>
          <div className="deck-help-panel" dir="rtl">
            <h3>קיצורי מקלדת</h3>
            <dl>
              <dt>→ / רווח</dt>
              <dd>השקף הבא</dd>
              <dt>←</dt>
              <dd>השקף הקודם</dd>
              <dt>G / Esc</dt>
              <dd>מבט-על של כל השקפים</dd>
              <dt>F</dt>
              <dd>מסך מלא</dd>
              <dt>Home / End</dt>
              <dd>קפיצה להתחלה / סוף</dd>
              <dt>A / D</dt>
              <dd>פתקי הדובר — הבא / הקודם (לא נראים בהקלטה)</dd>
              <dt>לחיצת גלגלת</dt>
              <dd>מיקום וגודל של הפתק המוצג</dd>
              <dt>?</dt>
              <dd>החלון הזה</dd>
            </dl>
          </div>
        </div>
      )}
      </div>

      {/* פתקי הדובר — מחוץ לאזור הלכידה, לכן לא נכנסים להקלטה */}
      <NotesOverlay />
    </div>
  );
}
