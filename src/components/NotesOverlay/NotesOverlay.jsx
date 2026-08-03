import { useEffect, useMemo, useRef, useState } from "react";
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

/* פריסות ברירת-מחדל שנשמרו כקובץ בפרויקט (מסונכרן בעבודה מקומית) */
import layoutDefaults from "../../notes/layout.json";

/* --- סנכרון לקבצים בפרויקט: פעיל רק מול שרת מקומי (dev/preview).
   באתר בענן ה-endpoint לא קיים והקריאות פשוט נבלעות --- */
const localSync = fetch("/__notes/ping")
  .then((r) => r.ok)
  .catch(() => false);

const postJson = (url, obj) =>
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obj),
  }).then((r) => r.ok);

const blobToDataUrl = (blob) =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(blob);
  });

/* שם קובץ תקני לפתק (פתקים ישנים נשמרו בלי סיומת) */
const fileNameOf = (name) =>
  /\.(png|jpe?g|webp|gif)$/i.test(name) ? name : `${name}.png`;

const stem = (s) => s.replace(/\.[^.]+$/, "");

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
      /* try/catch + onabort: בלעדיהם שגיאת מכסה (quota) או מסד פגום
         משאירות promise תלוי לנצח וחיבור מסד דולף */
      try {
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
        tx.onabort = () => {
          db.close();
          reject(tx.error || new Error("transaction aborted"));
        };
      } catch (e) {
        db.close();
        reject(e);
      }
    };
  });
}
const idbAll = () => withStore("readonly", (s) => s.getAll());
const idbPut = (rec) => withStore("readwrite", (s) => s.put(rec));
const idbDel = (id) => withStore("readwrite", (s) => s.delete(id));

/* הפתקים המובנים זמינים סינכרונית — נטענים מיד, בלי לחכות למסד */
const builtinNotes = () => {
  const deleted = new Set(readJson(DELETED_KEY, []));
  return Object.keys(builtinModules)
    .sort()
    .map((p) => ({ name: p.split("/").pop(), url: builtinModules[p], builtin: true }))
    .filter((n) => !deleted.has(n.name));
};

export default function NotesOverlay({ slides = [], current = 0 }) {
  const [notes, setNotes] = useState(builtinNotes);
  const [idx, setIdx] = useState(-1); /* ‎-1 = מוסתר */
  const [edit, setEdit] = useState(false);
  const [layouts, setLayouts] = useState(() => readJson(STORE_KEY, {}));
  const [unsafeRec, setUnsafeRec] = useState(false);
  const [organize, setOrganize] = useState(false);
  /* בזמן גרירה בפאנל הסידור: סדר זמני חי + מי נגרר + מיקום רוח הרפאים */
  const [tempOrder, setTempOrder] = useState(null);
  const [dragName, setDragName] = useState(null);
  const [dragPos, setDragPos] = useState(null);
  /* שיוך-בהמתנה בזמן גרירה: undefined=ללא שינוי, null=כללי, מספר=שקף */
  const [dragSlide, setDragSlide] = useState(undefined);
  const notesRef = useRef(notes);
  notesRef.current = notes;
  const idxRef = useRef(idx);
  idxRef.current = idx;
  const editRef = useRef(edit);
  editRef.current = edit;
  const unsafeRef = useRef(unsafeRec);
  unsafeRef.current = unsafeRec;
  /* נכתב לקובץ רק אחרי שינוי יזום — טעינה סתם לא דורסת את layout.json */
  const dirtyRef = useRef(false);

  /* --- סדר תצוגה: לפי שדה ord בפריסה (localStorage > layout.json),
     פתקים בלי ord שומרים על הסדר הבסיסי, בסוף --- */
  const ordered = useMemo(() => {
    const ordOf = (n) => {
      const local = layouts[n.name];
      if (local && typeof local.ord === "number") return local.ord;
      const bundled = layoutDefaults[fileNameOf(n.name)];
      if (bundled && typeof bundled.ord === "number") return bundled.ord;
      return Infinity;
    };
    return notes
      .map((n, i) => [n, ordOf(n), i])
      .sort((a, b) => a[1] - b[1] || a[2] - b[2])
      .map((x) => x[0]);
  }, [notes, layouts]);
  const orderedRef = useRef(ordered);
  orderedRef.current = ordered;
  const organizeRef = useRef(organize);
  organizeRef.current = organize;
  const tempOrderRef = useRef(tempOrder);
  tempOrderRef.current = tempOrder;
  const dragSlideRef = useRef(dragSlide);
  dragSlideRef.current = dragSlide;

  /* --- שיוך פתק לשקף: מספר שקף (1-based), או null = כללי --- */
  const slideOf = (name) => {
    const local = layouts[name];
    if (local && Number.isFinite(local.slide)) return local.slide;
    const bundled = layoutDefaults[fileNameOf(name)];
    if (bundled && Number.isFinite(bundled.slide)) return bundled.slide;
    return null;
  };
  const slideOfRef = useRef(slideOf);
  slideOfRef.current = slideOf;

  /* הפתקים של השקף הנוכחי: המשויכים אליו + הכלליים, בסדר הגלובלי */
  const currentSlide = current + 1;
  const visible = useMemo(
    () =>
      ordered.filter((n) => {
        const s = slideOf(n.name);
        return s === null || s === currentSlide;
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ordered, layouts, currentSlide],
  );
  const visibleRef = useRef(visible);
  visibleRef.current = visible;
  const currentSlideRef = useRef(currentSlide);
  currentSlideRef.current = currentSlide;

  /* מעבר שקף מסתיר את הפתק — לכל שקף הפתקים שלו.
     נשמר prev כדי שריצה-חוזרת של האפקט (HMR בפיתוח) לא תסתיר סתם */
  const prevSlideRef = useRef(current);
  useEffect(() => {
    if (prevSlideRef.current === current) return;
    prevSlideRef.current = current;
    setIdx(-1);
    setEdit(false);
  }, [current]);

  /* סגירת מצב עריכה סוגרת גם את פאנל הסידור */
  useEffect(() => {
    if (!edit) setOrganize(false);
  }, [edit]);

  /* Escape סוגר את הפאנל — בשלב הלכידה, כדי שה-Deck לא יפתח מבט-על */
  useEffect(() => {
    const onEsc = (e) => {
      if (e.key !== "Escape" || !organizeRef.current) return;
      e.stopPropagation();
      /* גם מאזינים אחרים על window (מקלדת ה-Deck) לא יקבלו את האירוע */
      e.stopImmediatePropagation();
      setOrganize(false);
    };
    window.addEventListener("keydown", onEsc, true);
    return () => window.removeEventListener("keydown", onEsc, true);
  }, []);

  /* השלמה אסינכרונית: פתקים מודבקים מ-IndexedDB. מיזוג פונקציונלי
     עם סינון כפילויות — הדבקה שקרתה בזמן הטעינה לא נדרסת */
  useEffect(() => {
    let dead = false;
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
        /* פתק שנשמר כקובץ ונבנה כבר מגיע כמובנה — לא מציגים כפול */
        setNotes((cur) => [
          ...cur,
          ...pasted.filter((p) => !cur.some((n) => stem(n.name) === stem(p.name))),
        ]);
        /* עבודה מקומית: מייצאים לקבצים גם פתקים שהודבקו בעבר */
        localSync.then((ok) => {
          if (!ok) return;
          (recs || []).forEach(async (r) => {
            try {
              const dataUrl = await blobToDataUrl(r.blob);
              await postJson("/__notes/save-image", {
                name: fileNameOf(r.id),
                dataUrl,
              });
            } catch {
              /* ייצוא הוא נוחות — לא חוסמים על כישלון */
            }
          });
        });
      })
      .catch(() => {
        /* מסד לא זמין — נשארים עם המובנים שכבר על המסך */
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

  /* עבודה מקומית: כל שינוי פריסה נשמר (בהשהיה קצרה) לקובץ
     src/notes/layout.json — מיקום, גודל ושקיפות לכל פתק */
  useEffect(() => {
    if (!dirtyRef.current) return undefined;
    const t = setTimeout(() => {
      localSync.then((ok) => {
        if (!ok) return;
        const map = {};
        for (const n of notes) {
          /* נשלחים רק פתקים שיש להם נתונים מקומיים — השרת ממזג,
             וכך לקוח עם build ישן לא דורס ערכים שהוא לא מכיר */
          if (!layouts[n.name]) continue;
          map[fileNameOf(n.name)] = {
            x: 24,
            y: 24,
            w: 420,
            o: 1,
            ...(layoutDefaults[fileNameOf(n.name)] || {}),
            ...(layouts[n.name] || {}),
          };
        }
        if (Object.keys(map).length) {
          postJson("/__notes/save-layout", map).catch(() => {});
        }
      });
    }, 800);
    return () => clearTimeout(t);
  }, [layouts, notes]);

  /* כשההקלטה לוכדת את כל הטאב (דפדפן בלי הגבלת אלמנט, או שנבחר
     מסך/חלון במקום הטאב) — הפתקים מוסתרים כדי שלא ייכנסו לסרטון */
  useEffect(() => {
    const onCap = (e) => {
      const unsafe = Boolean(e.detail.recording && !e.detail.restricted);
      setUnsafeRec(unsafe);
      /* כשהפתקים נעלמים — סוגרים גם את מצב העריכה, שלא יישאר חמוש
         בלתי-נראה (Delete היה מוחק פתק בלי שום משוב על המסך) */
      if (unsafe) setEdit(false);
    };
    window.addEventListener("rec:capture-state", onCap);
    return () => window.removeEventListener("rec:capture-state", onCap);
  }, []);

  /* מקשים פיזיים A/D — עובדים גם כשפריסת המקלדת בעברית.
     רווח = D + חץ-ימינה ביחד: ה-Deck מקדם שקף/שלב במאזין שלו, וכאן
     מתקדם גם הפתק. כשהפוקוס על פקד, הרווח מפעיל את הפקד בלבד — אותו
     כלל כמו במקלדת ה-Deck, אחרת לחיצה אחת הייתה עושה שלושה דברים */
  useEffect(() => {
    const onKey = (e) => {
      if (unsafeRef.current) return; /* פתקים מוסתרים בהקלטה — מקשים כבויים */
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      if (e.code !== "KeyA" && e.code !== "KeyD" && e.code !== "Space") return;
      if (
        e.code === "Space" &&
        e.target instanceof Element &&
        e.target.closest("button, a, input, select, textarea")
      ) {
        return;
      }
      const len = visibleRef.current.length;
      if (!len) return;
      const dir = e.code === "KeyA" ? -1 : 1;
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
      if (e.button !== 1 || unsafeRef.current) return;
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
      if (unsafeRef.current) return;
      if (!editRef.current && notesRef.current.length > 0) return;
      const item = [...(e.clipboardData?.items || [])].find((i) =>
        i.type.startsWith("image/"),
      );
      if (!item) return;
      e.preventDefault();
      const blob = item.getAsFile();
      if (!blob) return;
      const ext = { "image/jpeg": "jpg", "image/webp": "webp", "image/gif": "gif" }[blob.type] || "png";
      const id = `paste-${Date.now()}.${ext}`;
      idbPut({ id, blob, ts: Date.now() }).catch(() => {
        /* אחסון נכשל — הפתק יחיה עד רענון */
      });
      const url = URL.createObjectURL(blob);
      const newIndex = visibleRef.current.length;
      dirtyRef.current = true;
      setNotes((ns) => [...ns, { name: id, url, builtin: false }]);
      /* פתק חדש משתייך אוטומטית לשקף שעומדים עליו */
      setLayouts((all) => ({
        ...all,
        [id]: { ...(all[id] || {}), slide: currentSlideRef.current },
      }));
      setIdx(newIndex);
      setEdit(true);
      /* עבודה מקומית: התמונה נכתבת גם כקובץ בפרויקט (src/notes) */
      localSync.then(async (ok) => {
        if (!ok) return;
        try {
          const dataUrl = await blobToDataUrl(blob);
          await postJson("/__notes/save-image", { name: id, dataUrl });
        } catch {
          /* לא חוסמים על כישלון ייצוא */
        }
      });
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, []);

  /* מחיקת הפתק הנוכחי: מודבק — נמחק מהאחסון; מובנה — מוסתר לצמיתות */
  const deleteCurrent = () => {
    if (unsafeRef.current) return;
    const i = idxRef.current;
    const note = visibleRef.current[i];
    if (!note) return;
    /* כפתור ה-✕ נשאר ממוקד אחרי לחיצה — בלי blur, רווח/Enter הבאים
       היו מפעילים אותו שוב ומוחקים פתק נוסף במקום להתקדם בשקפים */
    document.activeElement?.blur?.();
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
    dirtyRef.current = true;
    /* עבודה מקומית: מוחקים גם את הקובץ מהפרויקט אם קיים */
    localSync.then((ok) => {
      if (!ok) return;
      postJson("/__notes/delete-image", { name: fileNameOf(note.name) }).catch(
        () => {},
      );
    });
    setLayouts(({ [note.name]: _gone, ...rest }) => rest);
    setNotes((ns) => ns.filter((n) => n.name !== note.name));
    /* נשארים על הפתק הבא; אם לא נשארו — נסתרים */
    setIdx((cur) => Math.min(cur, visibleRef.current.length - 2));
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

  if (!visible.length || idx < 0 || idx >= visible.length || unsafeRec)
    return null;

  const markDirty = () => {
    dirtyRef.current = true;
  };

  /* קיבוע סדר חדש מלא (ואופציונלית שיוך-שקף לפתק אחד): ord לפי מיקום
     ברשימה הגלובלית; idx מכוון מחדש לפי הרשימה הנראית החזויה */
  const commitOrder = (names, assign) => {
    markDirty();
    const currentName = visibleRef.current[idxRef.current]?.name;
    const slideAfter = (name) =>
      assign && assign.name === name ? assign.slide : slideOfRef.current(name);
    setLayouts((all) => {
      const next = { ...all };
      names.forEach((name, k) => {
        const entry = { ...(next[name] || {}), ord: k };
        if (assign && assign.name === name) {
          if (assign.slide === null) delete entry.slide;
          else entry.slide = assign.slide;
        }
        next[name] = entry;
      });
      return next;
    });
    /* הרשימה הנראית אחרי השינוי — כדי שהפתק המוצג יישאר מסומן נכון */
    if (currentName) {
      const nextVisible = names.filter((name) => {
        const s = slideAfter(name);
        return s === null || s === currentSlideRef.current;
      });
      setIdx(nextVisible.indexOf(currentName));
    }
  };

  /* הזזת הפתק הנוכחי צעד אחד בסדר, בתוך הפתקים הנראים בשקף הזה */
  const moveCurrent = (delta) => {
    const vis = visibleRef.current;
    const i = idxRef.current;
    const j = i + delta;
    if (i < 0 || j < 0 || j >= vis.length) return;
    const names = orderedRef.current.map((n) => n.name);
    const a = names.indexOf(vis[i].name);
    const b = names.indexOf(vis[j].name);
    if (a < 0 || b < 0) return;
    [names[a], names[b]] = [names[b], names[a]];
    commitOrder(names);
    setIdx(j);
  };

  /* גרירת אריח בפאנל: רוח רפאים של התמונה נצמדת לסמן ("מחזיקים" אותה),
     הרשימה מסתדרת חי, וקליק קצר = בחירה */
  const onTileDown = (e, name) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const grip = {
      dx: e.clientX - rect.left,
      dy: e.clientY - rect.top,
      w: rect.width,
    };
    const startX = e.clientX;
    const startY = e.clientY;
    let moved = false;
    setTempOrder(orderedRef.current.map((n) => n.name));
    const move = (ev) => {
      if (
        !moved &&
        Math.abs(ev.clientX - startX) + Math.abs(ev.clientY - startY) > 6
      ) {
        moved = true;
        setDragName(name);
      }
      if (!moved) return;
      setDragPos({ x: ev.clientX, y: ev.clientY, ...grip });
      /* גלילה אוטומטית כשנגררים קרוב לקצה הפאנל */
      const body = document.querySelector(".notes-organizer-body");
      if (body) {
        const r = body.getBoundingClientRect();
        if (ev.clientY < r.top + 70) body.scrollTop -= 22;
        else if (ev.clientY > r.bottom - 70) body.scrollTop += 22;
      }
      const hit = document.elementFromPoint(ev.clientX, ev.clientY);
      const tile = hit?.closest("[data-note]");
      if (tile) {
        const over = tile.getAttribute("data-note");
        if (over && over !== name) {
          /* מעל אריח אחר: נכנסים למקומו ומאמצים את השקף שלו */
          const sec = tile.closest("[data-slide]");
          if (sec) {
            const v = sec.getAttribute("data-slide");
            setDragSlide(v === "" ? null : Number(v));
          }
          setTempOrder((cur) => {
            if (!cur) return cur;
            const from = cur.indexOf(name);
            const to = cur.indexOf(over);
            if (from < 0 || to < 0 || from === to) return cur;
            const next = [...cur];
            next.splice(from, 1);
            next.splice(to, 0, name);
            return next;
          });
        }
        return;
      }
      /* מעל מקטע (כותרת/אזור ריק): רק משייכים לשקף שלו */
      const sec = hit?.closest("[data-slide]");
      if (sec) {
        const v = sec.getAttribute("data-slide");
        setDragSlide(v === "" ? null : Number(v));
      }
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      const finalOrder = tempOrderRef.current;
      if (moved && finalOrder) {
        const pendingSlide = dragSlideRef.current;
        commitOrder(
          finalOrder,
          pendingSlide === undefined ? undefined : { name, slide: pendingSlide },
        );
      } else {
        /* קליק בלי גרירה — בחירת הפתק כנוכחי (אם הוא נראה בשקף הזה) */
        const ni = visibleRef.current.findIndex((n) => n.name === name);
        if (ni >= 0) setIdx(ni);
      }
      setTempOrder(null);
      setDragName(null);
      setDragPos(null);
      setDragSlide(undefined);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const note = visible[idx];
  /* סדר עדיפויות: התאמות מקומיות (localStorage) > קובץ layout.json > ברירת מחדל */
  const lay = {
    x: 24,
    y: 24,
    w: 420,
    o: 1,
    ...(layoutDefaults[fileNameOf(note.name)] || {}),
    ...(layouts[note.name] || {}),
  };
  const save = (patch) => {
    markDirty();
    setLayouts((all) => ({ ...all, [note.name]: { ...lay, ...patch } }));
  };

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

  const gridList = tempOrder
    ? tempOrder.map((nm) => ordered.find((n) => n.name === nm)).filter(Boolean)
    : ordered;

  /* קיבוץ לפאנל הסידור: "כללי" ואז מקטע לכל שקף. בזמן גרירה, הפתק
     הנגרר מוצג לפי השיוך-בהמתנה — משוב חי */
  const effSlideOf = (name) =>
    name === dragName && dragSlide !== undefined ? dragSlide : slideOf(name);
  const groups = [
    { slide: null, title: "כללי — מוצג בכל השקפים", items: [] },
    ...slides.map((s, i) => ({
      slide: i + 1,
      title: `שקף ${i + 1} · ${s.label}`,
      items: [],
    })),
  ];
  for (const n of gridList) {
    const s = effSlideOf(n.name);
    const g = s === null ? groups[0] : groups[s] || groups[0];
    g.items.push(n);
  }

  return (
    <>
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
          {/* פס כלים בתוך גבולות הפתק — נשאר נגיש גם כשהפתק בקצה המסך */}
          <div
            className="notes-toolbar"
            dir="rtl"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <button
              className="notes-delete"
              title="מחיקת הפתק (Delete)"
              onClick={deleteCurrent}
            >
              ✕
            </button>
            <button
              className="notes-chip notes-organize-btn"
              onClick={(e) => {
                e.currentTarget.blur();
                setOrganize((v) => !v);
              }}
            >
              🗂 כל התמונות
            </button>
            {/* שיוך הפתק הנוכחי לשקף — כללי או שקף יחיד */}
            <div className="notes-chip notes-slide-pick">
              <span>שקף</span>
              <select
                value={slideOf(note.name) ?? ""}
                onChange={(e) => {
                  markDirty();
                  const v = e.target.value;
                  setLayouts((all) => {
                    const entry = { ...(all[note.name] || {}) };
                    if (v === "") delete entry.slide;
                    else entry.slide = Number(v);
                    return { ...all, [note.name]: entry };
                  });
                }}
              >
                <option value="">כללי</option>
                {slides.map((s, i) => (
                  <option key={s.id} value={i + 1}>
                    {i + 1} · {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="notes-chip notes-opacity">
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
          </div>
          <div
            className="notes-chip notes-count"
            dir="ltr"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <button
              className="notes-ord"
              title="מוקדם יותר בסדר"
              onClick={(e) => {
                e.currentTarget.blur();
                moveCurrent(-1);
              }}
            >
              ↑
            </button>
            <span>
              {idx + 1}/{visible.length}
            </span>
            <button
              className="notes-ord"
              title="מאוחר יותר בסדר"
              onClick={(e) => {
                e.currentTarget.blur();
                moveCurrent(1);
              }}
            >
              ↓
            </button>
          </div>
          <div className="notes-handle" onPointerDown={startResize} />
        </>
      )}
    </div>

    {/* פאנל סידור: כל התמונות בגריד, גרירה משנה סדר, לחיצה בוחרת */}
    {edit && organize && (
      <div className="notes-organizer" dir="rtl">
        <div className="notes-organizer-head">
          <span>
            גרירה לתוך מקטע של שקף משייכת אליו · גרירה על אריח משנה סדר ·
            לחיצה בוחרת · Esc סוגר
          </span>
          <button
            className="notes-organizer-close"
            title="סגירה (Esc)"
            onClick={() => setOrganize(false)}
          >
            ✕
          </button>
        </div>
        <div className="notes-organizer-body">
          {groups.map((g) => (
            <section
              key={g.slide ?? "global"}
              className={`notes-section ${
                g.slide === currentSlide ? "on-slide" : ""
              } ${g.items.length === 0 ? "empty" : ""}`}
              data-slide={g.slide ?? ""}
            >
              <header className="notes-section-head">
                {g.title}
                <span className="notes-section-count" dir="ltr">
                  {g.items.length}
                </span>
              </header>
              <div className="notes-section-grid">
                {g.items.map((n) => (
                  <div
                    key={n.name}
                    data-note={n.name}
                    className={`notes-tile ${
                      n.name === note.name ? "current" : ""
                    } ${n.name === dragName ? "dragging" : ""}`}
                    onPointerDown={(e) => onTileDown(e, n.name)}
                  >
                    <span className="notes-tile-num" dir="ltr">
                      {gridList.indexOf(n) + 1}
                    </span>
                    <img src={n.url} alt="" draggable={false} />
                  </div>
                ))}
                {g.items.length === 0 && (
                  <div className="notes-section-drop">גרור לכאן</div>
                )}
              </div>
            </section>
          ))}
        </div>
        {/* רוח הרפאים הנגררת — התמונה "ביד" של הסמן */}
        {dragName && dragPos && (
          <div
            className="notes-drag-ghost"
            style={{
              left: dragPos.x - dragPos.dx,
              top: dragPos.y - dragPos.dy,
              width: dragPos.w,
            }}
          >
            <img
              src={ordered.find((n) => n.name === dragName)?.url}
              alt=""
              draggable={false}
            />
          </div>
        )}
      </div>
    )}
    </>
  );
}
