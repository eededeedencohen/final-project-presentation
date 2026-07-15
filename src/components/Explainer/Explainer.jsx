import CircuitBackground from '../CircuitBackground/CircuitBackground.jsx'
import './styles.css'

/* ============================================================
   ערכת "מאחורי הקלעים" — רכיבים משותפים לשקפי ההסבר המונפשים
   (Data / Server / Client). כל שקף מקבל step מה-Deck ומצייר
   את הסצנה לפי השלב הנוכחי.
   ============================================================ */

/* עטיפת שקף כהה עם כותרת, פס קריינות ונקודות שלבים */
export function ExplainerStage({ kicker, title, step, captions, children }) {
  const total = captions.length - 1
  return (
    <section className="xp-stage" dir="ltr">
      <CircuitBackground tone="dark" />
      <header className="xp-head">
        <div className="xp-kicker">{kicker}</div>
        <h2 className="xp-title">{title}</h2>
      </header>

      <div className="xp-scene">{children}</div>

      <footer className="xp-footer">
        <div className="xp-dots" dir="ltr">
          {captions.map((_, i) => (
            <span key={i} className={`xp-dot ${i === step ? 'on' : ''} ${i < step ? 'past' : ''}`} />
          ))}
        </div>
        <div className="xp-narration" dir="rtl" key={step}>
          {captions[Math.min(step, total)]}
        </div>
        <div className="xp-hint" dir="rtl">
          {step < total ? 'לחיצה / חץ ← לשלב הבא' : 'סוף — לחיצה נוספת לשקף הבא'}
        </div>
      </footer>
    </section>
  )
}

/* תחנת משושה: פאה לבנה עם לוגו/אייקון, מסגרת זוהרת כשהיא פעילה.
   state: 'idle' | 'active' | 'done' */
export function HexStation({ x, y, size = 150, logo, icon, label, sub, state = 'idle' }) {
  return (
    <div
      className={`xp-hex xp-${state}`}
      style={{ left: x, top: y, width: size, height: size * 1.05 }}
    >
      <div className="xp-hex-ring" />
      <div className="xp-hex-face">
        {logo ? <img src={logo} alt="" /> : icon}
      </div>
      <div className="xp-hex-label">{label}</div>
      {sub && <div className="xp-hex-sub" dir="rtl">{sub}</div>}
    </div>
  )
}

/* צינור בין תחנות: קו SVG מקווקו שנדלק, עם חבילת מידע שנוסעת עליו.
   packet מוצג רק כשהוא lit; הכיוון נקבע ע"י הנתיב עצמו. */
export function Pipe({ path, lit = false, done = false, packetColor = 'var(--c-aqua)', packetLabel }) {
  return (
    <>
      <svg className="xp-pipe-svg" viewBox="0 0 1920 700" preserveAspectRatio="none" aria-hidden="true">
        <path className={`xp-pipe ${lit || done ? 'lit' : ''}`} d={path} />
      </svg>
      {lit && (
        <div className="xp-packet" style={{ offsetPath: `path('${path}')`, '--pk': packetColor }}>
          {packetLabel && <span className="xp-packet-label" dir="ltr">{packetLabel}</span>}
        </div>
      )}
    </>
  )
}

/* כרטיס קוד/טרמינל שמופיע ליד תחנה כשהיא פעילה */
export function CodeChip({ x, y, w = 330, title, lines, show = false, tone = 'code' }) {
  return (
    <div
      className={`xp-code xp-tone-${tone} ${show ? 'show' : ''}`}
      style={{ left: x, top: y, width: w }}
      dir="ltr"
    >
      {title && <div className="xp-code-title">{title}</div>}
      {lines.map((l, i) => (
        <div key={i} className="xp-code-line" style={{ '--i': i }}>
          {l}
        </div>
      ))}
    </div>
  )
}

/* כרטיס מידע אנושי (בלי קוד): כותרת + שורות; שורות מסוג check
   נחתמות ב-וי אחת-אחת */
export function InfoCard({ x, y, w = 300, title, items = [], show = false, checklist = false, scan = false }) {
  return (
    <div
      className={`xp-info ${scan ? 'xp-scan' : ''} ${show ? 'show' : ''}`}
      style={{ left: x, top: y, width: w }}
    >
      {title && <div className="xp-info-title">{title}</div>}
      {items.map((it, i) => (
        <div key={i} className={checklist ? 'xp-check' : 'xp-info-line'} style={{ '--i': i }}>
          {it}
        </div>
      ))}
    </div>
  )
}

/* התפרצות ניצוצות סביב נקודה — לשלב סיום חגיגי */
export function SparkBurst({ x, y, show = false, count = 10 }) {
  return (
    <div className={show ? 'xp-burst' : ''} style={{ position: 'absolute', left: x, top: y }}>
      {show &&
        Array.from({ length: count }, (_, i) => {
          const ang = (i / count) * Math.PI * 2
          return (
            <span
              key={i}
              className="xp-spark"
              style={{ '--i': i, '--dx': `${Math.cos(ang) * 90}px`, '--dy': `${Math.sin(ang) * 90}px` }}
            />
          )
        })}
    </div>
  )
}

/* תג הסבר קטן בעברית שצץ ליד אלמנט */
export function Callout({ x, y, w = 260, children, show = false, arrow = 'up' }) {
  return (
    <div className={`xp-callout xp-arrow-${arrow} ${show ? 'show' : ''}`} style={{ left: x, top: y, width: w }} dir="rtl">
      {children}
    </div>
  )
}
