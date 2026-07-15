import SlideFrame from '../../components/SlideFrame/SlideFrame.jsx'
import Icon from '../../components/Icon/Icon.jsx'
import './styles.css'

const CHALLENGES = [
  {
    num: '01',
    icon: 'data-collect',
    title: 'איסוף נתונים',
    text: 'מחירונים של עשרות רשתות בפורמטים שונים ומשתנים.',
  },
  {
    num: '02',
    icon: 'broom',
    title: 'ניקוי ותיקוף',
    text: 'נרמול שמות מוצרים, ברקודים וכפילויות.',
  },
  {
    num: '03',
    icon: 'message',
    title: 'NLP בעברית + UX',
    text: 'הבנת כוונה מטקסט חופשי בעברית — ועטיפתה בחוויה פשוטה.',
  },
  {
    num: '04',
    icon: 'plug',
    title: 'אינטגרציית AI API',
    text: 'עלויות, זמני תגובה ואמינות של שירותים חיצוניים.',
  },
  {
    num: '05',
    icon: 'zap',
    title: 'ביצועים',
    text: 'השוואת אלפי מחירים במקביל בזמן־אמת.',
  },
]

export default function ChallengesSlide() {
  return (
    <SlideFrame
      kicker="CHALLENGES"
      title={
        <>
          האתגרים <span className="grad">שבדרך</span>
        </>
      }
    >
      <div className="chal-wrap">
        <div className="chal-row">
          {/* קו מקווקו שמחבר בין האתגרים — נגלה בפערים שבין הכרטיסים */}
          <div className="chal-line fx fx-fade" style={{ '--d': 260 }} aria-hidden="true" />
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={`chal-dot-wrap chal-dot-${i + 1} fx fx-fade`}
              style={{ '--d': 620 + i * 90 }}
              aria-hidden="true"
            >
              <span className="chal-dot" style={{ animationDelay: `${i * 0.45}s` }} />
            </span>
          ))}

          {CHALLENGES.map((c, i) => (
            <article
              key={c.num}
              className="card chal-card fx fx-rise"
              style={{ '--d': 320 + i * 120 }}
            >
              <span className="chal-ghost" aria-hidden="true">{c.num}</span>
              <div className="icon-chip">
                <Icon name={c.icon} />
              </div>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </article>
          ))}
        </div>

        <div className="chal-punch fx fx-rise" style={{ '--d': 1000 }}>
          <Icon name="puzzle" />
          <p>
            כל אתגר תורגם ל<strong>החלטה הנדסית</strong> — וביחד הם עיצבו את
            הארכיטקטורה של <span dir="ltr">Smart Cart</span>.
          </p>
        </div>
      </div>
    </SlideFrame>
  )
}
