import SlideFrame from '../../components/SlideFrame/SlideFrame.jsx'
import Icon from '../../components/Icon/Icon.jsx'
import './styles.css'

const GOALS = [
  {
    icon: 'zap',
    num: '01',
    title: 'בניית עגלת קניות במהירות',
    text: 'הרכבת סל שלם בכמה הקלקות — בלי חיפושים מיותרים.',
  },
  {
    icon: 'brain',
    num: '02',
    title: 'למידת צרכי המשתמש',
    text: 'המערכת לומדת הרגלים והעדפות ומתאימה את עצמה אליך.',
  },
  {
    icon: 'coins',
    num: '03',
    title: 'עלות קנייה מינימלית',
    text: 'השוואת מחירים אוטומטית שמוצאת את הסל הזול ביותר.',
  },
  {
    icon: 'chart-line',
    num: '04',
    title: 'מעקב הוצאות',
    text: 'תמונת מצב ברורה של ההוצאות שלך לאורך זמן.',
  },
  {
    icon: 'flag',
    num: '05',
    title: 'מטרות יעד',
    text: 'הגדרת תקציב ויעדי חיסכון — והמערכת עוזרת לעמוד בהם.',
  },
  {
    icon: 'layout',
    num: '06',
    title: 'ממשק משתמש נוח',
    text: 'חוויית שימוש פשוטה, נקייה ואינטואיטיבית לכל אחד.',
  },
]

export default function GoalsSlide() {
  return (
    <SlideFrame
      kicker="GOALS"
      title={
        <>
          מה <span className="grad">רצינו להשיג</span>
        </>
      }
    >
      <div className="goal-grid">
        {GOALS.map((g, i) => (
          <article
            key={g.num}
            className="card goal-tile fx fx-rise"
            style={{ '--d': 330 + i * 120 }}
          >
            <span className="goal-ghost" aria-hidden="true">{g.num}</span>
            <div className="goal-head">
              <div className="icon-chip goal-chip">
                <Icon name={g.icon} />
              </div>
              <h3>{g.title}</h3>
            </div>
            <p>{g.text}</p>
          </article>
        ))}
      </div>
    </SlideFrame>
  )
}
