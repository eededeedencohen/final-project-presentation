import SlideFrame from '../../components/SlideFrame/SlideFrame.jsx'
import Icon from '../../components/Icon/Icon.jsx'
import axiosLogo from '../../assets/tech/axios.png'
import expressLogo from '../../assets/tech/express.png'
import mongodbLogo from '../../assets/tech/mongodb.png'
import corsLogo from '../../assets/tech/cors.png'
import morganLogo from '../../assets/tech/morgan.png'
import './styles.css'

/* תחנות המסע של הבקשה — משמאל לימין (כיוון טכני LTR) */
const STATIONS = [
  {
    num: '01',
    name: 'Axios',
    logo: axiosLogo,
    text: 'ספריית HTTP בצד הלקוח — שולחת את הבקשה ומקבלת את התשובה הסופית',
  },
  {
    num: '02',
    name: 'Express',
    logo: expressLogo,
    text: 'תשתית השרת — מנהל את קבלת הבקשות והגשת התשובות',
    middleware: true,
  },
  {
    num: '03',
    name: 'Routes',
    icon: 'route',
    text: 'מגדיר את נתיבי ה-API ומחזיר את התשובה כפלט של הכתובת',
  },
  {
    num: '04',
    name: 'Controller',
    icon: 'gear',
    text: 'הלוגיקה העסקית — מעבד נתונים ומכין תשובת JSON',
  },
  {
    num: '05',
    name: 'Model',
    icon: 'database',
    text: 'מייצג את הנתונים במסד — שליפה, שמירה, עדכון ומחיקה',
  },
]

export default function ServerFlowSlide() {
  return (
    <SlideFrame
      center
      kicker="ARCHITECTURE · 02 — SERVER/API"
      title={
        <>
          Server / API <span className="grad">Flow</span>
        </>
      }
    >
      <div className="sflow-wrap">
        {/* צינור הזרימה כולו LTR — הבקשה נוסעת קדימה, התשובה חוזרת */}
        <div className="sflow-flow" dir="ltr">
          {/* נתיב הבקשה — קדימה */}
          <div className="sflow-lane sflow-lane-req fx fx-slide-start" style={{ '--d': 260 }}>
            <span className="sflow-lane-label" dir="rtl">בקשה</span>
            <div className="sflow-track">
              <span className="sflow-dot" />
            </div>
            <span className="sflow-head sflow-head-fwd" />
          </div>

          {/* שורת התחנות */}
          <div className="sflow-row">
            {STATIONS.map((s, i) => (
              <article
                key={s.name}
                className="card sflow-station fx fx-rise"
                style={{ '--d': 340 + i * 110 }}
              >
                <span className="sflow-ghost" aria-hidden="true">{s.num}</span>
                <div className="sflow-logo">
                  {s.logo ? <img src={s.logo} alt="" /> : <Icon name={s.icon} />}
                </div>
                <h3 className="sflow-name">{s.name}</h3>
                <p className="sflow-desc" dir="rtl">{s.text}</p>
                {s.middleware && (
                  <div className="sflow-mws-wrap">
                    <span className="sflow-mw-label">MIDDLEWARE</span>
                    <div className="sflow-mws">
                      <span className="sflow-mw">
                        <img src={corsLogo} alt="" />
                        CORS
                      </span>
                      <span className="sflow-mw">
                        <img src={morganLogo} alt="" />
                        Morgan
                      </span>
                    </div>
                  </div>
                )}
              </article>
            ))}

            {/* תחנה סופית — מסד הנתונים */}
            <aside className="sflow-mongo fx fx-zoom" style={{ '--d': 890 }}>
              <div className="sflow-mongo-logo">
                <img src={mongodbLogo} alt="" />
              </div>
              <span className="sflow-mongo-name">MongoDB</span>
              <span className="sflow-mongo-sub" dir="rtl">מסד הנתונים</span>
            </aside>
          </div>

          {/* נתיב התשובה — חזרה */}
          <div className="sflow-lane sflow-lane-res fx fx-slide-end" style={{ '--d': 960 }}>
            <span className="sflow-head sflow-head-back" />
            <div className="sflow-track">
              <span className="sflow-dot" />
            </div>
            <span className="sflow-lane-label" dir="rtl">תשובה</span>
          </div>
        </div>

        {/* שורת סיכום */}
        <div className="sflow-note fx fx-rise" style={{ '--d': 1080 }}>
          <Icon name="refresh" />
          <p>
            מחזור חיים מלא של בקשה: מלחיצת כפתור בלקוח ועד מסד הנתונים —{' '}
            <strong>והתשובה חוזרת באותו המסלול</strong>, בכיוון ההפוך, כתשובת{' '}
            <span dir="ltr">JSON</span>.
          </p>
        </div>
      </div>
    </SlideFrame>
  )
}
