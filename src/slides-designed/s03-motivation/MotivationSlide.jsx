import SlideFrame from '../../components/SlideFrame/SlideFrame.jsx'
import Icon from '../../components/Icon/Icon.jsx'
import './styles.css'

const MOTIVATIONS = [
  {
    icon: 'clock',
    num: '01',
    title: 'חיסכון בזמן',
    text: 'בניית סל שלם בדקות — במקום שעות של השוואות ידניות.',
  },
  {
    icon: 'wallet',
    num: '02',
    title: 'חיסכון משמעותי לכיס',
    text: 'אותו סל בדיוק, במחיר הנמוך ביותר שיש בשוק.',
  },
  {
    icon: 'wand',
    num: '03',
    title: 'פשטות',
    text: 'בלי טפסים נוקשים — כותבים מה צריך ומקבלים עגלה מוכנה.',
  },
  {
    icon: 'cart-check',
    num: '04',
    title: 'עגלה אופטימלית',
    text: 'הרכב מנצח של מחיר, זמינות ומרחק מהבית.',
  },
]

export default function MotivationSlide() {
  return (
    <SlideFrame
      kicker="MOTIVATION"
      title={
        <>
          ארבעה רווחים, <span className="grad">עגלה אחת חכמה</span>
        </>
      }
    >
      <div className="mot-rail">
        {/* ציר ההטבות — קו גרדיאנט שנמתח לרוחב השקף */}
        <div className="mot-track" aria-hidden="true">
          <span className="mot-track-line" />
          <span className="mot-track-cap fx fx-fade" style={{ '--d': 950 }} />
        </div>

        <div className="mot-stations">
          {MOTIVATIONS.map((m, i) => (
            <div
              key={m.num}
              className={`mot-station ${i % 2 === 0 ? 'mot-up' : 'mot-down'} fx fx-rise`}
              style={{ '--d': 480 + i * 170 }}
            >
              <article className="card mot-card">
                <div className="mot-card-head">
                  <div className="icon-chip">
                    <Icon name={m.icon} />
                  </div>
                  <h3>{m.title}</h3>
                </div>
                <p>{m.text}</p>
              </article>
              <span className="mot-stem" aria-hidden="true" />
              <span className="mot-node">
                <span className="mot-num">{m.num}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </SlideFrame>
  )
}
