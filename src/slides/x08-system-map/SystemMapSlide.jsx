import CircuitBackground from '../../components/CircuitBackground/CircuitBackground.jsx'
import mongodbLogo from '../../assets/tech/mongodb.png'
import mongooseLogo from '../../assets/tech/mongoose.png'
import nodeLogo from '../../assets/tech/nodejs.png'
import expressLogo from '../../assets/tech/express.png'
import reactLogo from '../../assets/tech/react.png'
import axiosLogo from '../../assets/tech/axios.png'
import openaiLogo from '../../assets/tech/openai.png'
import visionLogo from '../../assets/tech/google-vision.png'
import elevenLogo from '../../assets/tech/elevenlabs.png'
import './styles.css'

/* ============================================================
   מפת המערכת — שקף תמונה-מלאה אחד לפני הצלילה לשכבות:
   נתונים (מסד) · שרת (ארון) · קליינט (מובייל), עם בקשה ותשובה
   שנוסעות ביניהם בלולאה מתמדת, ושירותי ה-AI כלוויין מעל השרת.
   ============================================================ */

/* נתיבי הנסיעה (במת 1920x1080): בקשה למעלה (ימין⟵שמאל), תשובה למטה */
const REQ_PATH = 'M 1395 520 C 1250 455, 1210 455, 1085 515 L 1082 515 C 940 455, 620 455, 480 515'
const RES_PATH = 'M 480 600 C 620 665, 940 665, 1082 605 L 1085 605 C 1210 665, 1250 665, 1395 600'

export default function SystemMapSlide() {
  return (
    <section className="smap" dir="rtl">
      <CircuitBackground tone="light" />

      <header className="smap-head fx fx-rise" style={{ '--d': 0 }}>
        <h2 className="smap-title">מפת המערכת — התמונה המלאה</h2>
        <div className="smap-kicker">SYSTEM OVERVIEW</div>
      </header>

      {/* ---- שכבת הקליינט: מובייל (ימין) ---- */}
      <div className="smap-zone smap-client fx fx-rise" style={{ '--d': 150 }}>
        <div className="smap-phone">
          <div className="smap-phone-notch" />
          <div className="smap-phone-screen">
            <div className="smap-ui-head">Smart Cart</div>
            <div className="smap-ui-row"><span>חלב 3% טרה</span><b>₪5.40</b></div>
            <div className="smap-ui-row"><span>לחם מלא</span><b>₪8.90</b></div>
            <div className="smap-ui-row"><span>ביצים L</span><b>₪12.60</b></div>
            <div className="smap-ui-total"><span>סה״כ</span><b>₪26.90</b></div>
          </div>
          <div className="smap-phone-home" />
        </div>
        <div className="smap-zone-name">שכבת הקליינט</div>
        <div className="smap-zone-sub">המסך של המשתמש · אפליקציית SPA</div>
        <div className="smap-chips">
          <span className="smap-chip"><img src={reactLogo} alt="" />React</span>
          <span className="smap-chip"><img src={axiosLogo} alt="" />Axios</span>
        </div>
      </div>

      {/* ---- שכבת השרת: ארון שרתים (מרכז) ---- */}
      <div className="smap-zone smap-server fx fx-rise" style={{ '--d': 300 }}>
        <div className="smap-rack">
          {[0, 1, 2].map((i) => (
            <div className="smap-rack-unit" key={i}>
              <span className="smap-led" />
              <span className="smap-led dim" />
              <span className="smap-slot" />
              <span className="smap-dots">···</span>
            </div>
          ))}
        </div>
        <div className="smap-zone-name">שכבת השרת</div>
        <div className="smap-zone-sub">מרכז התיאום · הלוגיקה העסקית</div>
        <div className="smap-chips">
          <span className="smap-chip"><img src={nodeLogo} alt="" />Node.js</span>
          <span className="smap-chip"><img src={expressLogo} alt="" />Express</span>
        </div>
      </div>

      {/* ---- שכבת הנתונים: מסד (שמאל) ---- */}
      <div className="smap-zone smap-data fx fx-rise" style={{ '--d': 450 }}>
        <div className="smap-db">
          <div className="smap-db-top" />
          <div className="smap-db-band" />
          <div className="smap-db-band" />
          <div className="smap-db-band last" />
        </div>
        <div className="smap-zone-name">שכבת הנתונים</div>
        <div className="smap-zone-sub">כל המחירים של כל הרשתות</div>
        <div className="smap-chips">
          <span className="smap-chip"><img src={mongodbLogo} alt="" />MongoDB</span>
          <span className="smap-chip"><img src={mongooseLogo} alt="" />Mongoose</span>
        </div>
      </div>

      {/* ---- לוויין שירותי ה-AI ---- */}
      <div className="smap-ai fx fx-fade" style={{ '--d': 650 }}>
        <div className="smap-ai-box">
          <img src={openaiLogo} alt="OpenAI" />
          <img src={visionLogo} alt="Google Vision" />
          <img src={elevenLogo} alt="ElevenLabs" />
        </div>
        <div className="smap-ai-label">שירותי AI חיצוניים</div>
      </div>
      <svg className="smap-ai-link fx fx-fade" style={{ '--d': 700 }} viewBox="0 0 1920 1080" preserveAspectRatio="none" aria-hidden="true">
        <path d="M 960 315 L 960 405" />
      </svg>

      {/* ---- נתיבי בקשה/תשובה עם חבילות בלולאה ---- */}
      <svg className="smap-lanes fx fx-fade" style={{ '--d': 550 }} viewBox="0 0 1920 1080" preserveAspectRatio="none" aria-hidden="true">
        <path className="smap-lane req" d={REQ_PATH} />
        <path className="smap-lane res" d={RES_PATH} />
      </svg>
      <div className="smap-packet smap-pk-req" style={{ offsetPath: `path('${REQ_PATH}')` }}>
        <span className="smap-pk-label">בקשה</span>
      </div>
      <div className="smap-packet smap-pk-res" style={{ offsetPath: `path('${RES_PATH}')` }}>
        <span className="smap-pk-label">תשובה</span>
      </div>

      {/* תגיות פרוטוקול על הקווים */}
      <span className="smap-pill fx fx-fade" style={{ '--d': 800, left: 1130, top: 420 }} dir="ltr">REST API</span>
      <span className="smap-pill fx fx-fade" style={{ '--d': 880, left: 640, top: 420 }} dir="ltr">Mongoose ODM</span>

      {/* שורת גשר לשקפים הבאים */}
      <div className="smap-footer fx fx-rise" style={{ '--d': 1000 }}>
        שלוש שכבות, שיחה אחת מתמדת — <em>ובשקפים הבאים נצלול לכל אחת מהן, צעד אחר צעד</em>
      </div>
    </section>
  )
}
