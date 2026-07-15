import SlideFrame from '../../components/SlideFrame/SlideFrame.jsx'
import Icon from '../../components/Icon/Icon.jsx'
import './styles.css'

const FEATURES = [
  { icon: 'bell', title: 'התראות חכמות על מבצעים', soon: true },
  { icon: 'phone', title: 'אפליקציה סלולרית ייעודית', soon: true },
  { icon: 'trend-up', title: 'חיזוי קניות וקופונים מותאמים', soon: true },
  { icon: 'handshake', title: 'שיתופי פעולה עם רשתות ויצרנים' },
  { icon: 'gift', title: 'מועדון לקוחות והחזר כספי' },
  { icon: 'apple', title: 'מודול המלצות תזונה' },
  { icon: 'cloud', title: 'פריסה בענן מבוזר' },
  { icon: 'dashboard', title: 'לוח מחוונים אנליטי לחברות' },
]

export default function ImprovementsSlide() {
  return (
    <SlideFrame
      kicker="ROADMAP"
      title={
        <>
          לאן <span className="grad">ממשיכים מכאן</span>
        </>
      }
    >
      <div className="imp-wrap">
        <div className="imp-grid">
          {FEATURES.map((f, i) => (
            <article
              key={f.title}
              className="card imp-tile fx fx-zoom"
              style={{ '--d': 300 + i * 85 }}
            >
              {f.soon && <span className="imp-soon">בקרוב</span>}
              <div className="imp-chip">
                <Icon name={f.icon} />
              </div>
              <h3 className="imp-title">{f.title}</h3>
            </article>
          ))}
        </div>

        <div className="imp-punch fx fx-fade" style={{ '--d': 1000 }}>
          <Icon name="sparkles" />
          <p>
            מהשוואת סל חד־פעמית — <strong>לעוזר צרכנות אישי ומתמשך</strong>
          </p>
        </div>
      </div>
    </SlideFrame>
  )
}
