import SlideFrame from '../../components/SlideFrame/SlideFrame.jsx'
import Icon from '../../components/Icon/Icon.jsx'
import './styles.css'

const PROBLEMS = [
  {
    icon: 'grid',
    num: '01',
    title: 'עודף אפשרויות',
    text: 'אלפי מוצרים, עשרות רשתות ומאות מבצעים — הצרכן מוצף ולא באמת מסוגל להשוות.',
  },
  {
    icon: 'eye-off',
    num: '02',
    title: 'מידע מטושטש',
    text: 'המחירים משתנים בין סניפים, אתרים ואפליקציות — אי אפשר לדעת כמה הסל באמת עולה.',
  },
  {
    icon: 'refresh',
    num: '03',
    title: 'כוח ההרגל',
    text: 'קונים באותה רשת "כי ככה תמיד", גם כשאותו סל בדיוק זול משמעותית במקום אחר.',
  },
]

export default function ProblemSlide() {
  return (
    <SlideFrame
      kicker="THE PROBLEM"
      title={
        <>
          קנייה חכמה? <span className="grad">כמעט בלתי אפשרית</span>
        </>
      }
    >
      <div className="problem-grid">
        {PROBLEMS.map((p, i) => (
          <article key={p.num} className="card problem-card fx fx-rise" style={{ '--d': 350 + i * 180 }}>
            <span className="problem-ghost" aria-hidden="true">{p.num}</span>
            <div className="icon-chip">
              <Icon name={p.icon} />
            </div>
            <h3>{p.title}</h3>
            <p>{p.text}</p>
          </article>
        ))}
      </div>

      <div className="problem-punch fx fx-rise" style={{ '--d': 1000 }}>
        <Icon name="coins" />
        <p>
          התוצאה: משקי בית משלמים <strong>מאות שקלים מיותרים</strong> בכל חודש — בלי לדעת בכלל.
        </p>
      </div>
    </SlideFrame>
  )
}
