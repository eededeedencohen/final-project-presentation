import { useEffect, useRef, useState } from "react";
import "./styles.css";

/* ============================================================
   NotesOverlay — פתקי עזר צפים לדובר (תמונות טקסט).
   מקורות: תמונות מובנות מ-src/notes + תמונות שהודבקו מהלוח
   (Ctrl+V במצב עריכה, נשמרות ב-IndexedDB וזמינות גם אחרי רענון).
   נראים רק על המסך: ההקלטה מוגבלת לאזור המצגת (Element Capture),
   כך שהפתקים לעולם לא נכנסים לסרטון השמור. אם אי-אפשר להגביל —
   הפתקים מוסתרים אוטומטית בזמן הקלטה.
   A = הפתק הבא · D = הקודם · לחיצת גלגלת = מצב הגדרות
   במצב הגדרות: גרירה, גלגלת/ידית לגודל, Ctrl+V מדביק, Delete/✕ מוחק
   ============================================================ */

const builtinModules = import.meta.glob("../../notes/*.{png,jpg,jpeg,webp,gif}", {
  eager: true,
  query: "?url",
  import: "default",
});

const STORE_KEY = "smart-cart-notes-layout";
const DELETED_KEY = "smart-cart-notes-deleted";
const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

const readJson = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

/* --- IndexedDB לפתקים מודבקים (גדולים מדי ל-localStorage) --- */
const DB_NAME = "smart-cart-notes";
function withStore(mode, fn) {
  return new Promise((resolve, reject) => {
    const open = indexedDB.open(DB_NAME, 1);
    open.onupgradeneeded = () =>
      open.result.createObjectStore("images", { keyPath: "id" });
    open.onerror = () => reject(open.error);
    open.onsuccess = () => {
      const db = open.result;
      const tx = db.transaction("images", mode);
      const req = fn(tx.objectStore("images"));
      tx.oncomplete = () => {
        db.close();
        resolve(req?.result);
      };
      tx.onerror = () => {
        db.close();
        reject(tx.error);
      };
    };
  });
}
const idbAll = () => withStore("readonly", (s) => s.getAll());
const idbPut = (rec) => withStore("readwrite", (s) => s.put(rec));
const idbDel = (id) => withStore("readwrite", (s) => s.delete(id));

export default function NotesOverlay() {
  const [notes, setNotes] = useState([]);
  const [idx, setIdx] = useState(-1); /* ‎-1 = מוסתר */
  const [edit, setEdit] = useState(false);
  const [layouts, setLayouts] = useState(() => readJson(STORE_KEY, {}));
  const [unsafeRec, setUnsafeRec] = useState(false);
  const notesRef = useRef(notes);
  notesRef.current = notes;
  const idxRef = useRef(idx);
  idxRef.current = idx;
  const editRef = useRef(edit);
  editRef.current = edit;

  /* טעינה: מובנים (מלבד מה שנמחק) + מודבקים מ-IndexedDB */
  useEffect(() => {
    let dead = false;
    const deleted = new Set(readJson(DELETED_KEY, []));
    const builtin = Object.keys(builtinModules)
      .sort()
      .map((p) => ({ name: p.split("/").pop(), url: builtinModules[p], builtin: true }))
      .filter((n) => !deleted.has(n.name));
    idbAll()
      .then((recs) => {
        if (dead) return;
        const pasted = (recs || [])
          .sort((a, b) => a.ts - b.ts)
          .map((r) => ({
            name: r.id,
            url: URL.createObjectURL(r.blob),
            builtin: false,
          }));
        setNotes([...builtin, ...pasted]);
      })
      .catch(() => {
        if (!dead) setNotes(builtin);
      });
    return () => {
      dead = true;
    };
  }, []);

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
    const onKey = (e) => {
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      if (e.code !== "KeyA" && e.code !== "KeyD") return;
      const len = notesRef.current.length;
      if (!len) return;
      const dir = e.code === "KeyA" ? 1 : -1;
      /* מחזור שכולל מצב "מוסתר": מוסתר → פתק 1 → ... → מוסתר */
      const n = len + 1;
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

  /* Ctrl+V במצב עריכה: תמונה מהלוח נוספת כפתק חדש ונשמרת.
     (וגם כשאין אף פתק — כדי שתמיד תהיה דרך להוסיף) */
  useEffect(() => {
    const onPaste = (e) => {
      if (!editRef.current && notesRef.current.length > 0) return;
      const item = [...(e.clipboardData?.items || [])].find((i) =>
        i.type.startsWith("image/"),
      );
      if (!item) return;
      e.preventDefault();
      const blob = item.getAsFile();
      if (!blob) return;
      const id = `paste-${Date.now()}`;
      idbPut({ id, blob, ts: Date.now() }).catch(() => {
        /* אחסון נכשל — הפתק יחיה עד רענון */
      });
      const url = URL.createObjectURL(blob);
      const newIndex = notesRef.current.length;
      setNotes((ns) => [...ns, { name: id, url, builtin: false }]);
      setIdx(newIndex);
      setEdit(true);
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, []);

  /* מחיקת הפתק הנוכחי: מודבק — נמחק מהאחסון; מובנה — מוסתר לצמיתות */
  const deleteCurrent = () => {
    const i = idxRef.current;
    const note = notesRef.current[i];
    if (!note) return;
    if (note.builtin) {
      try {
        const del = new Set(readJson(DELETED_KEY, []));
        del.add(note.name);
        localStorage.setItem(DELETED_KEY, JSON.stringify([...del]));
      } catch {
        /* בלי אחסון המחיקה תחזיק עד רענון */
      }
    } else {
      idbDel(note.name).catch(() => {});
      URL.revokeObjectURL(note.url);
    }
    setLayouts(({ [note.name]: _gone, ...rest }) => rest);
    setNotes((ns) => ns.filter((_, k) => k !== i));
    /* נשארים על הפתק הבא; אם לא נשארו — נסתרים */
    setIdx((cur) => Math.min(cur, notesRef.current.length - 2));
  };
  const deleteRef = useRef(deleteCurrent);
  deleteRef.current = deleteCurrent;

  /* מקש Delete במצב עריכה */
  useEffect(() => {
    const onKey = (e) => {
      if (e.code !== "Delete" || !editRef.current) return;
      deleteRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!notes.length || idx < 0 || idx >= notes.length || unsafeRec) return null;

  const note = notes[idx];
  const lay = { x: 24, y: 24, w: 420, o: 1, ...(layouts[note.name] || {}) };
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

  const onWheel = (e) => {
    /* גלגלת = גודל; עם Shift = שקיפות */
    if (e.shiftKey) {
      save({ o: clamp(lay.o + (e.deltaY < 0 ? 0.05 : -0.05), 0.2, 1) });
    } else {
      save({
        w: clamp(lay.w * (e.deltaY < 0 ? 1.07 : 0.93), 180, window.innerWidth - 40),
      });
    }
  };

  return (
    <div
      className={`notes-overlay ${edit ? "edit" : ""}`}
      style={{ left: lay.x, top: lay.y, width: lay.w }}
      onPointerDown={edit ? startDrag : undefined}
      onWheel={edit ? onWheel : undefined}
    >
      <img src={note.url} alt="" draggable={false} style={{ opacity: lay.o }} />
      {edit && (
        <>
          <div className="notes-chip notes-hint" dir="rtl">
            גרירה מזיזה · גלגלת גודל · Ctrl+V מדביק · Delete מוחק
          </div>
          <div
            className="notes-chip notes-opacity"
            dir="rtl"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <span>שקיפות</span>
            <input
              type="range"
              min="0.2"
              max="1"
              step="0.05"
              value={lay.o}
              onChange={(e) => save({ o: Number(e.target.value) })}
            />
          </div>
          <div className="notes-chip notes-count" dir="ltr">
            {idx + 1}/{notes.length}
          </div>
          <button
            className="notes-delete"
            title="מחיקת הפתק (Delete)"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={deleteCurrent}
          >
            ✕
          </button>
          <div className="notes-handle" onPointerDown={startResize} />
        </>
      )}
    </div>
  );
}
