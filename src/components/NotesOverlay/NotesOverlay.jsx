import { useEffect, useRef, useState } from "react";
import "./styles.css";

/* ============================================================
   NotesOverlay — פתקי עזר צפים לדובר (תמונות טקסט מ-src/notes).
   נראים רק על המסך: ההקלטה מוגבלת לאזור המצגת (Element Capture),
   כך שהפתקים לעולם לא נכנסים לסרטון השמור. אם אי-אפשר להגביל —
   הפתקים מוסתרים אוטומטית בזמן הקלטה.
   A = הפתק הבא · D = הקודם · לחיצת גלגלת = מצב הגדרות (מיקום/גודל)
   ============================================================ */

const noteModules = import.meta.glob("../../notes/*.{png,jpg,jpeg,webp,gif}", {
  eager: true,
  query: "?url",
  import: "default",
});
const NOTES = Object.keys(noteModules)
  .sort()
  .map((p) => ({ name: p.split("/").pop(), url: noteModules[p] }));

const STORE_KEY = "smart-cart-notes-layout";
const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

function loadLayouts() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY)) || {};
  } catch {
    return {};
  }
}

export default function NotesOverlay() {
  const [idx, setIdx] = useState(-1); /* ‎-1 = מוסתר */
  const [edit, setEdit] = useState(false);
  const [layouts, setLayouts] = useState(loadLayouts);
  const [unsafeRec, setUnsafeRec] = useState(false);
  const idxRef = useRef(idx);
  idxRef.current = idx;

  useEffect(() => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(layouts));
    } catch {
      /* אחסון חסום — הפריסה פשוט לא תישמר בין ריצות */
    }
  }, [layouts]);

  /* כשההקלטה לוכדת את כל הטאב (דפדפן בלי הגבלת אלמנט, או שנבחר
     מסך/חלון במקום הטאב) — הפתקים מוסתרים כדי שלא ייכנסו לסרטון */
  useEffect(() => {
    const onCap = (e) =>
      setUnsafeRec(Boolean(e.detail.recording && !e.detail.restricted));
    window.addEventListener("rec:capture-state", onCap);
    return () => window.removeEventListener("rec:capture-state", onCap);
  }, []);

  /* מקשים פיזיים A/D — עובדים גם כשפריסת המקלדת בעברית */
  useEffect(() => {
    if (!NOTES.length) return;
    const onKey = (e) => {
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      if (e.code !== "KeyA" && e.code !== "KeyD") return;
      const dir = e.code === "KeyA" ? 1 : -1;
      /* מחזור שכולל מצב "מוסתר": מוסתר → פתק 1 → פתק 2 → מוסתר */
      const n = NOTES.length + 1;
      setIdx((i) => ((i + 1 + dir + n) % n) - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* לחיצת גלגלת: פתיחה/סגירה של מצב ההגדרות.
     האזנה בשלב הלכידה + preventDefault — מבטל גם autoscroll */
  useEffect(() => {
    const onMid = (e) => {
      if (e.button !== 1) return;
      e.preventDefault();
      if (idxRef.current >= 0) setEdit((v) => !v);
    };
    window.addEventListener("mousedown", onMid, true);
    return () => window.removeEventListener("mousedown", onMid, true);
  }, []);

  if (!NOTES.length || idx < 0 || unsafeRec) return null;

  const note = NOTES[idx];
  const lay = { x: 24, y: 24, w: 420, ...(layouts[note.name] || {}) };
  const save = (patch) =>
    setLayouts((all) => ({ ...all, [note.name]: { ...lay, ...patch } }));

  const dragWith = (onMove) => (e) => {
    /* רק לחצן שמאלי גורר; לחצן הגלגלת חייב להמשיך לאירוע ה-mousedown
       הגלובלי (preventDefault כאן היה בולע אותו ומונע סגירת הגדרות) */
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    const move = (ev) => onMove(ev);
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const startDrag = (e) => {
    const sx = e.clientX - lay.x;
    const sy = e.clientY - lay.y;
    dragWith((ev) =>
      save({
        x: clamp(ev.clientX - sx, -lay.w + 80, window.innerWidth - 80),
        y: clamp(ev.clientY - sy, 0, window.innerHeight - 60),
      }),
    )(e);
  };

  const startResize = (e) => {
    const sx = e.clientX;
    const sw = lay.w;
    dragWith((ev) =>
      save({ w: clamp(sw + (ev.clientX - sx), 180, window.innerWidth - 40) }),
    )(e);
  };

  const onWheel = (e) =>
    save({
      w: clamp(lay.w * (e.deltaY < 0 ? 1.07 : 0.93), 180, window.innerWidth - 40),
    });

  return (
    <div
      className={`notes-overlay ${edit ? "edit" : ""}`}
      style={{ left: lay.x, top: lay.y, width: lay.w }}
      onPointerDown={edit ? startDrag : undefined}
      onWheel={edit ? onWheel : undefined}
    >
      <img src={note.url} alt="" draggable={false} />
      {edit && (
        <>
          <div className="notes-chip notes-hint" dir="rtl">
            גרירה מזיזה · גלגלת משנה גודל · לחיצת גלגלת סוגרת
          </div>
          <div className="notes-chip notes-count" dir="ltr">
            {idx + 1}/{NOTES.length}
          </div>
          <div className="notes-handle" onPointerDown={startResize} />
        </>
      )}
    </div>
  );
}
