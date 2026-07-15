import CircuitBackground from '../CircuitBackground/CircuitBackground.jsx'
import Icon from '../Icon/Icon.jsx'
import './styles.css'

/**
 * שקף חוצץ כהה בין פרקי הארכיטקטורה.
 *
 * props:
 *  - number: מספר הפרק ("01")
 *  - title: שם הפרק באנגלית ("DATA")
 *  - subtitle: תיאור קצר בעברית
 *  - icon: שם אייקון מספריית Icon
 *  - chips: מערך תוויות טכנולוגיה קטנות (אופציונלי)
 */
export default function SectionDivider({ number, title, subtitle, icon = 'chip', chips = [] }) {
  return (
    <section className="divider" dir="ltr">
      <CircuitBackground tone="dark" />
      <div className="divider-ghost fx fx-fade" style={{ '--d': 100 }} aria-hidden="true">
        {number}
      </div>

      <div className="divider-content">
        <div className="divider-icon fx fx-zoom" style={{ '--d': 150 }}>
          <Icon name={icon} />
        </div>
        <div className="kicker fx fx-fade" style={{ '--d': 250 }}>
          SMART CART · ARCHITECTURE
        </div>
        <h2 className="divider-title fx fx-rise" style={{ '--d': 350 }}>
          {title}
        </h2>
        <div className="divider-line fx fx-slide-end" style={{ '--d': 500 }} />
        <p className="divider-subtitle fx fx-rise" style={{ '--d': 600 }} dir="rtl">
          {subtitle}
        </p>
        {chips.length > 0 && (
          <div className="divider-chips">
            {chips.map((c, i) => (
              <span key={c} className="divider-chip fx fx-rise" style={{ '--d': 750 + i * 110 }}>
                {c}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
