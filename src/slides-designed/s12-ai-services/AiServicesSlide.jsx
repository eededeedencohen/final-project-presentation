import SlideFrame from '../../components/SlideFrame/SlideFrame.jsx'
import Icon from '../../components/Icon/Icon.jsx'
import openaiLogo from '../../assets/tech/openai.png'
import visionLogo from '../../assets/tech/google-vision.png'
import elevenlabsLogo from '../../assets/tech/elevenlabs.png'
import './styles.css'

const SERVICES = [
  {
    name: 'OpenAI',
    logo: openaiLogo,
    icon: 'message',
    text: 'מנוע השפה: הופך טקסט חופשי בעברית לעגלת קניות מובנית',
  },
  {
    name: 'Google Cloud Vision',
    logo: visionLogo,
    icon: 'eye',
    text: 'ראייה ממוחשבת: זיהוי מוצרים ומחירים מתוך תמונות',
  },
  {
    name: 'ElevenLabs',
    logo: elevenlabsLogo,
    icon: 'mic',
    text: 'קול: ממשק דיבור טבעי לבניית עגלה בדיבור',
  },
]

const PILLS = ['LLM · NLP', 'Computer Vision', 'Text-to-Speech']

export default function AiServicesSlide() {
  return (
    <SlideFrame
      dark
      kicker="ARCHITECTURE · AI"
      title={
        <>
          שירותי <span className="grad">AI</span> במערכת
        </>
      }
    >
      <div className="ai-stage">
        {/* --- ליבת ה-AI הזוהרת --- */}
        <div className="ai-hub-wrap fx fx-zoom" style={{ '--d': 280 }}>
          <div className="ai-hub">
            <Icon name="brain" />
          </div>
          <span className="ai-hub-label">AI CORE</span>
        </div>

        {/* --- קווי חיבור מהליבה אל שלושת השירותים --- */}
        <svg className="ai-wires" viewBox="0 0 1144 62" aria-hidden="true">
          <path
            className="ai-wire fx fx-draw"
            style={{ '--d': 480, '--dash': 480, strokeDasharray: 480 }}
            d="M572 2 C572 46 962 14 962 58"
          />
          <path
            className="ai-wire fx fx-draw"
            style={{ '--d': 580, '--dash': 70, strokeDasharray: 70 }}
            d="M572 2 L572 58"
          />
          <path
            className="ai-wire fx fx-draw"
            style={{ '--d': 680, '--dash': 480, strokeDasharray: 480 }}
            d="M572 2 C572 46 182 14 182 58"
          />
          <g className="fx fx-fade" style={{ '--d': 1100 }}>
            {[182, 572, 962].map((x, i) => (
              <circle
                key={x}
                className="ai-dot"
                style={{ animationDelay: `${i * 0.45}s` }}
                cx={x}
                cy="58"
                r="4"
              />
            ))}
          </g>
        </svg>

        {/* --- שלושת כרטיסי השירות --- */}
        <div className="ai-cards">
          {SERVICES.map((s, i) => (
            <article
              key={s.name}
              className="card ai-card fx fx-zoom"
              style={{ '--d': 700 + i * 160 }}
            >
              <div className="ai-card-head">
                <div className="ai-logo-chip">
                  <img src={s.logo} alt={s.name} />
                </div>
                <h3 dir="ltr">{s.name}</h3>
                <div className="ai-mini">
                  <Icon name={s.icon} />
                </div>
              </div>
              <p>{s.text}</p>
            </article>
          ))}
        </div>

        {/* --- גלולות יכולת בתחתית --- */}
        <div className="ai-pills">
          {PILLS.map((pill, i) => (
            <span
              key={pill}
              dir="ltr"
              className="ai-pill fx fx-rise"
              style={{ '--d': 1150 + i * 110 }}
            >
              {pill}
            </span>
          ))}
        </div>
      </div>
    </SlideFrame>
  )
}
