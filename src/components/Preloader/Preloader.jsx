import { useEffect, useState } from "react";
import "./styles.css";

/* ============================================================
   Preloader — מסך טעינה בכניסה למצגת.
   מקדים-טוען ומפענח את כל תמונות השקפים והפתקים + ממתין לפונטים,
   כדי שאף שקף לא "יתקע" בפעם הראשונה שמגיעים אליו (במיוחד בהקלטה).
   נעלם בדעיכה כשהכול מוכן; חסם עליון של 20 שניות ליתר ביטחון.
   ============================================================ */

const imageModules = import.meta.glob(
  [
    "../../assets/**/*.{png,jpg,jpeg,webp,gif}",
    "../../notes/*.{png,jpg,jpeg,webp,gif}",
  ],
  { eager: true, query: "?url", import: "default" },
);
const URLS = [...new Set(Object.values(imageModules))];

export default function Preloader() {
  const [done, setDone] = useState(0);
  const [fading, setFading] = useState(false);
  const [gone, setGone] = useState(false);
  const total = URLS.length + 1; /* ‎+1 על הפונטים */

  useEffect(() => {
    let live = true;
    let count = 0;
    const bump = () => {
      count += 1;
      if (live) setDone(count);
    };
    const jobs = URLS.map((u) => {
      const img = new Image();
      img.src = u;
      /* decode מבטיח שהתמונה מפוענחת בזיכרון, לא רק הורדה */
      const p = img.decode ? img.decode() : Promise.resolve();
      return p.catch(() => {}).then(bump);
    });
    jobs.push(
      (document.fonts?.ready || Promise.resolve())
        .catch(() => {})
        .then(bump),
    );
    const cap = new Promise((r) => setTimeout(r, 20000));
    Promise.race([Promise.all(jobs), cap]).then(() => {
      if (!live) return;
      setFading(true);
      setTimeout(() => live && setGone(true), 600);
    });
    return () => {
      live = false;
    };
  }, []);

  if (gone) return null;
  const pct = Math.min(100, Math.round((done / total) * 100));

  return (
    <div className={`preloader ${fading ? "out" : ""}`} dir="rtl">
      <svg viewBox="0 0 24 24" aria-hidden="true" className="preloader-cart">
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
      <div className="preloader-title">SMART CART</div>
      <div className="preloader-text">טוען את המצגת…</div>
      <div className="preloader-bar" dir="ltr">
        <div className="preloader-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="preloader-pct" dir="ltr">
        {pct}%
      </div>
    </div>
  );
}
