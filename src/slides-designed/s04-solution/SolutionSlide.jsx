import SlideFrame from '../../components/SlideFrame/SlideFrame.jsx'
import Icon from '../../components/Icon/Icon.jsx'
import './styles.css'

const CAPABILITIES = [
  {
    icon: 'type',
    title: 'טקסט חופשי לבניית עגלת קניות',
    text: 'כותבים רשימת קניות בשפה חופשית — והמערכת מזהה את המוצרים ובונה עגלה מסודרת.',
  },
  {
    icon: 'scale',
    title: 'משווה מחירי עגלות',
    text: 'אותה עגלה בדיוק מתומחרת בכל רשת — וההפרש מוצג ברור, בשקלים.',
  },
  {
    icon: 'filter',
    title: 'פילטרים לסינון סופרמרקטים',
    text: 'מסננים לפי רשת, מיקום והעדפות — ומשווים רק בין החנויות שרלוונטיות באמת.',
  },
]

const STORES = [
  { name: 'רשת א׳', price: '₪142', width: 76, delay: 750, best: true },
  { name: 'רשת ב׳', price: '₪156', width: 84, delay: 900, best: false },
  { name: 'רשת ג׳', price: '₪171', width: 92, delay: 1050, best: false },
]

export default function SolutionSlide() {
  return (
    <SlideFrame
      kicker="THE SOLUTION"
      title={
        <>
          מה <span dir="ltr">Smart Cart</span> <span className="grad">עושה?</span>
        </>
      }
    >
      <div className="sol-layout">
        {/* עמודה ימנית — שלוש היכולות */}
        <div className="sol-caps">
          {CAPABILITIES.map((c, i) => (
            <article
              key={c.icon}
              className="card sol-cap fx fx-slide-start"
              style={{ '--d': 320 + i * 150 }}
            >
              <div className="icon-chip">
                <Icon name={c.icon} />
              </div>
              <div className="sol-cap-text">
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </div>
            </article>
          ))}
        </div>

        {/* עמודה שמאלית — חלון אפליקציה מדומה */}
        <div className="sol-panel fx fx-slide-end" style={{ '--d': 480 }}>
          <div className="sol-window">
            <div className="sol-chrome">
              <span className="sol-dot sol-dot-a" />
              <span className="sol-dot sol-dot-b" />
              <span className="sol-dot sol-dot-c" />
              <span className="sol-chrome-title" dir="ltr">Smart Cart</span>
            </div>

            <div className="sol-window-body">
              <div className="sol-input">
                <p>
                  2 חלב, לחם מלא, תריסר ביצים...
                  <span className="sol-caret" aria-hidden="true" />
                </p>
                <Icon name="sparkles" className="sol-input-spark" />
              </div>

              <div className="sol-compare-label">
                <span className="sol-live-dot" aria-hidden="true" />
                השוואת מחירים בזמן אמת
              </div>

              <div className="sol-bars">
                {STORES.map((s) => (
                  <div key={s.name} className={`sol-bar-row ${s.best ? 'best' : ''}`}>
                    <span className="sol-bar-name">{s.name}</span>
                    <div className="sol-bar-track">
                      <div
                        className="sol-bar-fill"
                        style={{ width: `${s.width}%`, '--bd': `${s.delay}ms` }}
                      />
                      {s.best && (
                        <span className="sol-best-badge fx fx-zoom" style={{ '--d': 1250 }}>
                          הכי משתלם
                        </span>
                      )}
                    </div>
                    <span className="sol-bar-price" dir="ltr">{s.price}</span>
                  </div>
                ))}
              </div>

              <div className="sol-saving fx fx-fade" style={{ '--d': 1380 }}>
                <Icon name="zap" />
                <p>
                  אותה עגלה בדיוק — <strong>חיסכון של ₪29</strong> בקנייה אחת.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SlideFrame>
  )
}
