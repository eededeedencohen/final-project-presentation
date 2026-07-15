import SlideFrame from '../../components/SlideFrame/SlideFrame.jsx'
import Icon from '../../components/Icon/Icon.jsx'
import axiosLogo from '../../assets/tech/axios.png'
import reactLogo from '../../assets/tech/react.png'
import './styles.css'

/* שבעת אבני הבניין של ה-SPA — סדר ה-DOM הוא סדר הרשת (4 עמודות):
   שורה 1: App → Context → Pages → Components (זרימה ימינה)
   שורה 2: [React badge] ← Axios ← Service ← Hooks (הזרימה ממשיכה שמאלה) */
const TILES = [
  { num: '1', icon: 'layout', title: 'App', desc: 'Root container rendering entire SPA', d: 300 },
  { num: '2', icon: 'globe', title: 'Context & Provider', desc: 'Distributes global state and actions', d: 400 },
  { num: '3', icon: 'page', title: 'Pages', desc: 'Route-specific screens with layouts', d: 500 },
  { num: '4', icon: 'puzzle', title: 'Components', desc: 'Composable UI building puzzle pieces', d: 600 },
  null, /* תא React badge */
  { num: '7', logo: axiosLogo, title: 'Axios', desc: 'HTTP client for API calls', d: 900 },
  { num: '6', icon: 'gear', title: 'Service', desc: 'Encapsulates API and business logic', d: 800 },
  { num: '5', icon: 'hook', title: 'Hooks', desc: 'Reusable stateful logic and testing', d: 700 },
]

/* מרכזי עמודות/שורות בקואורדינטות הדיאגרמה (1144x424) */
const SPINE_D = 'M133 95 H1011 V329 H426'

export default function ClientFlowSlide() {
  return (
    <SlideFrame
      kicker="ARCHITECTURE · 03 — CLIENT"
      title={
        <>
          Client <span className="grad">SPA Flow</span>
        </>
      }
      dir="ltr"
    >
      <div className="cflow-diagram">
        {/* עמוד השדרה של הזרימה — מאחורי הכרטיסים, נחשף במרווחים */}
        <svg
          className="cflow-spine"
          viewBox="0 0 1144 424"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id="cflowGrad"
              gradientUnits="userSpaceOnUse"
              x1="133"
              y1="95"
              x2="1011"
              y2="329"
            >
              <stop offset="0%" style={{ stopColor: 'var(--c-teal)' }} />
              <stop offset="55%" style={{ stopColor: 'var(--c-cyan)' }} />
              <stop offset="100%" style={{ stopColor: 'var(--c-aqua)' }} />
            </linearGradient>
          </defs>

          <path
            className="cflow-spine-base fx fx-draw"
            style={{ '--d': 450, '--dash': 1700 }}
            d={SPINE_D}
            pathLength="1700"
          />

          <g className="fx fx-fade" style={{ '--d': 1150 }}>
            <path className="cflow-march" d={SPINE_D} />
          </g>

          <g className="fx fx-fade" style={{ '--d': 900 }}>
            {/* חצים ימינה — שורה 1 */}
            <path className="cflow-arrow" d="M-5 -6 L5 0 L-5 6" transform="translate(280 95)" />
            <path className="cflow-arrow" d="M-5 -6 L5 0 L-5 6" transform="translate(572 95)" style={{ animationDelay: '0.45s' }} />
            <path className="cflow-arrow" d="M-5 -6 L5 0 L-5 6" transform="translate(864 95)" style={{ animationDelay: '0.9s' }} />
            {/* חץ למטה — הפנייה בין השורות */}
            <path className="cflow-arrow" d="M-6 -5 L0 5 L6 -5" transform="translate(1011 212)" style={{ animationDelay: '1.35s' }} />
            {/* חצים שמאלה — שורה 2 */}
            <path className="cflow-arrow" d="M5 -6 L-5 0 L5 6" transform="translate(864 329)" style={{ animationDelay: '1.8s' }} />
            <path className="cflow-arrow" d="M5 -6 L-5 0 L5 6" transform="translate(572 329)" style={{ animationDelay: '2.25s' }} />
          </g>
        </svg>

        <div className="cflow-grid">
          {TILES.map((t) =>
            t === null ? (
              <div key="react-badge" className="cflow-react fx fx-zoom" style={{ '--d': 1050 }}>
                <img src={reactLogo} alt="React" className="cflow-react-logo" />
                <div className="cflow-react-text">
                  <span>Powered by</span>
                  <strong>React</strong>
                </div>
              </div>
            ) : (
              <article key={t.num} className="card cflow-tile fx fx-rise" style={{ '--d': t.d }}>
                <span className="cflow-step">{t.num}</span>
                {t.logo ? (
                  <div className="cflow-logo-box">
                    <img src={t.logo} alt={t.title} />
                  </div>
                ) : (
                  <div className="icon-chip cflow-chip">
                    <Icon name={t.icon} />
                  </div>
                )}
                <h3>{t.title}</h3>
                <p>{t.desc}</p>
              </article>
            )
          )}
        </div>
      </div>
    </SlideFrame>
  )
}
