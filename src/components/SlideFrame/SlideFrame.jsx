import CircuitBackground from '../CircuitBackground/CircuitBackground.jsx'
import './styles.css'

/**
 * מסגרת אחידה לשקף תוכן: כותרת עליונה (kicker באנגלית + כותרת בעברית
 * + פס הדגשה), רקע מעגלים עדין, ואזור תוכן גמיש.
 *
 * props:
 *  - kicker: תווית אנגלית קטנה מעל הכותרת (למשל "THE PROBLEM")
 *  - title: כותרת בעברית; אפשר JSX עם <span className="grad"> להדגשה
 *  - dark: שקף כהה (חוצץ/טכני)
 *  - center: מרכוז אנכי של התוכן
 *  - dir: 'rtl' (ברירת מחדל) או 'ltr' לשקפים טכניים באנגלית
 */
export default function SlideFrame({
  kicker,
  title,
  dark = false,
  center = false,
  dir = 'rtl',
  circuit = true,
  children,
}) {
  return (
    <section className={`slide-frame ${dark ? 'dark' : ''}`} dir={dir}>
      {circuit && <CircuitBackground tone={dark ? 'dark' : 'light'} />}
      {(kicker || title) && (
        <header className="sf-head">
          {kicker && (
            <div className="kicker fx fx-fade" style={{ '--d': 0 }}>
              {kicker}
            </div>
          )}
          {title && (
            <h2 className="slide-title fx fx-rise" style={{ '--d': 90 }}>
              {title}
            </h2>
          )}
          <div className="title-accent fx fx-slide-start" style={{ '--d': 240 }} />
        </header>
      )}
      <div className={`sf-body ${center ? 'center' : ''}`}>{children}</div>
    </section>
  )
}
