import SlideFrame from '../../components/SlideFrame/SlideFrame.jsx'
import Icon from '../../components/Icon/Icon.jsx'
import reactLogo from '../../assets/tech/react.png'
import axiosLogo from '../../assets/tech/axios.png'
import nodejsLogo from '../../assets/tech/nodejs.png'
import expressLogo from '../../assets/tech/express.png'
import mongodbLogo from '../../assets/tech/mongodb.png'
import mongooseLogo from '../../assets/tech/mongoose.png'
import openaiLogo from '../../assets/tech/openai.png'
import googleVisionLogo from '../../assets/tech/google-vision.png'
import elevenlabsLogo from '../../assets/tech/elevenlabs.png'
import './styles.css'

const GROUPS = [
  {
    id: 'client',
    icon: 'layout',
    tag: 'CLIENT',
    title: 'לקוח',
    items: [
      { name: 'React', img: reactLogo },
      { name: 'Axios', img: axiosLogo },
    ],
  },
  {
    id: 'server',
    icon: 'server',
    tag: 'SERVER',
    title: 'שרת',
    items: [
      { name: 'Node.js', img: nodejsLogo },
      { name: 'Express', img: expressLogo },
    ],
  },
  {
    id: 'data',
    icon: 'database',
    tag: 'DATA',
    title: 'נתונים',
    items: [
      { name: 'MongoDB', img: mongodbLogo },
      { name: 'Mongoose', img: mongooseLogo },
    ],
  },
  {
    id: 'ai',
    icon: 'chip',
    tag: 'AI',
    title: 'בינה מלאכותית',
    items: [
      { name: 'OpenAI', img: openaiLogo },
      { name: 'Google Cloud Vision', img: googleVisionLogo },
      { name: 'ElevenLabs', img: elevenlabsLogo },
    ],
  },
]

export default function TechSlide() {
  return (
    <SlideFrame
      kicker="TECH STACK"
      title={
        <>
          הכלים שמאחורי <span className="grad">Smart Cart</span>
        </>
      }
    >
      <div className="tech-grid">
        {GROUPS.map((g, gi) => {
          const panelDelay = 320 + gi * 110
          return (
            <section
              key={g.id}
              className={`tech-group ${g.id === 'ai' ? 'tech-group-ai' : ''} fx fx-rise`}
              style={{ '--d': panelDelay }}
            >
              <header className="tech-group-head">
                <div className="icon-chip tech-chip">
                  <Icon name={g.icon} />
                </div>
                <div className="tech-group-titles">
                  <span className="tech-group-tag">
                    {g.id === 'ai' && <i className="tech-ai-dot" aria-hidden="true" />}
                    {g.tag}
                  </span>
                  <h3>{g.title}</h3>
                </div>
              </header>

              {g.items.map((item, i) => (
                <div
                  key={item.name}
                  className="card tech-card fx fx-zoom"
                  style={{ '--d': panelDelay + 160 + i * 110 }}
                >
                  <img className="tech-logo" src={item.img} alt={item.name} />
                  <span className="tech-name" dir="ltr">{item.name}</span>
                </div>
              ))}
            </section>
          )
        })}
      </div>
    </SlideFrame>
  )
}
