import { ExplainerStage, HexStation, Pipe } from '../../components/Explainer/Explainer.jsx'
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
   מפת המערכת — שקף בנייה: כל לחיצה מוסיפה בדיוק שחקן אחד
   לתמונה (שכבה, טכנולוגיה או חיבור) עם הסבר בגובה העיניים,
   שגם מי שלא מבין בתוכנה יבין. בלי דילוגים, בלי כפילויות.
   ============================================================ */

const CAPTIONS = [
  <>בואו נבנה יחד את התמונה המלאה — <em>חלק אחר חלק</em>. כל לחיצה מוסיפה שחקן אחד לסיפור.</>,
  <>הכול מתחיל כאן — <em>במסך שביד של המשתמש</em>: כאן כותבים רשימת קניות, סורקים מוצרים ורואים מחירים.</>,
  <><em>React</em> הוא הצייר של המסך: כשמשהו משתנה, הוא מצייר מחדש <em>רק את הפינה שהשתנתה</em> — לכן הכול מרגיש מיידי.</>,
  <><em>Axios</em> הוא השליח: כשהמסך צריך משהו שאין לו — השליח יוצא לדרך. <em>המסך עצמו אף פעם לא יוצא החוצה</em>.</>,
  <>לחצנו ״השוו מחירים״ — והשליח יוצא עם <em>הבקשה</em> אל השרת. תראו אותה נוסעת.</>,
  <>הבקשה הגיעה אל <em>השרת — מרכז התיאום</em>: הוא מקבל כל פנייה, בודק אותה, ומחליט מי מטפל בה.</>,
  <><em>Node.js</em> הוא המנוע של השרת — מחזיק <em>אלפי פניות בו-זמנית</em> בלי להתבלבל ובלי שאף אחד יחכה.</>,
  <><em>Express</em> הוא שומר הסף: מוודא שכל פנייה מגיעה ממקור מוכר, ומפנה אותה <em>בדיוק לדלפק הנכון</em>.</>,
  <>כדי לענות, השרת שולח שאלה אל מחסן הנתונים: <em>״כמה עולה כל מוצר, בכל רשת?״</em></>,
  <>וזה <em>מחסן הנתונים</em> — הספרייה של המערכת: כל מחיר, של כל מוצר, בכל רשת — שמור כאן ומעודכן.</>,
  <><em>MongoDB</em> הוא המדפים של המחסן — בנוי לשמור <em>מיליוני פריטים</em> ולשלוף כל אחד מהם בשבריר שנייה.</>,
  <><em>Mongoose</em> הוא בקר האיכות בדלת המחסן — <em>שום נתון פגום לא נכנס</em>, ושום תשובה לא יוצאת בלי בדיקה.</>,
  <>ומעל כולם — <em>שלושה עוזרים חכמים</em>: אחד מבין משפטים חופשיים, אחד קורא קבלות מצולמות, ואחד עונה בקול אנושי.</>,
  <>והרגע הכי יפה: <em>התשובה</em> עושה את כל הדרך חזרה — מהמחסן, דרך השרת, עד המסך. <em>הכול בפחות משנייה</em>.</>,
  <>זו כל המערכת — <em>שלוש שכבות שמדברות ביניהן בלי הפסקה</em>. עכשיו נצלול לכל אחת מהן מקרוב.</>,
]

/* סדר הבנייה: 1 קליינט · 2 React · 3 Axios · 4 חיבור⟵שרת · 5 שרת ·
   6 Node · 7 Express · 8 חיבור⟵מחסן · 9 מחסן · 10 MongoDB ·
   11 Mongoose · 12 עוזרי AI · 13 התשובה חוזרת · 14 סיום */

const REQ_CLIENT_TO_SERVER = 'M 1495 265 C 1400 205, 1250 205, 1150 258'
const REQ_SERVER_TO_DATA = 'M 775 258 C 680 200, 520 200, 430 258'
const RES_DATA_TO_CLIENT = 'M 430 335 C 525 398, 690 398, 800 338 L 1120 338 C 1240 398, 1400 398, 1500 335'

const stationState = (step, k) => (step === k ? 'active' : step > k ? 'done' : 'idle')

export default function SystemMapSlide({ step = 0 }) {
  const el = (k) => `smap-el ${step >= k ? 'on' : ''} ${step === k ? 'now' : ''}`

  return (
    <ExplainerStage kicker="SYSTEM OVERVIEW" title="מפת המערכת — התמונה המלאה" step={step} captions={CAPTIONS}>
      {/* --- חיבורים --- */}
      <Pipe path={REQ_CLIENT_TO_SERVER} lit={step === 4} done={step > 4} packetLabel="בקשה" />
      <Pipe path={REQ_SERVER_TO_DATA} lit={step === 8} done={step > 8} packetLabel="שאלה למחסן" />
      <Pipe path={RES_DATA_TO_CLIENT} lit={step === 13} done={step > 13} packetColor="#e8a33d" packetLabel="תשובה" />

      {/* --- שכבת הקליינט: מובייל --- */}
      <div className={el(1)} style={{ left: 1510, top: 40 }}>
        <div className="smap-phone">
          <div className="smap-phone-notch" />
          <div className="smap-phone-screen">
            <div className="smap-ui-head">Smart Cart</div>
            <div className="smap-ui-row"><span>חלב 3% טרה</span><b>₪5.40</b></div>
            <div className="smap-ui-row"><span>לחם מלא</span><b>₪8.90</b></div>
            <div className="smap-ui-total"><span>סה״כ</span><b>₪14.30</b></div>
          </div>
        </div>
        <div className="smap-name">שכבת הקליינט</div>
      </div>
      <HexStation x={1490} y={505} size={100} logo={reactLogo} label="React" sub="הצייר של המסך" state={stationState(step, 2)} />
      <HexStation x={1680} y={505} size={100} logo={axiosLogo} label="Axios" sub="השליח" state={stationState(step, 3)} />

      {/* --- שכבת השרת: ארון --- */}
      <div className={el(5)} style={{ left: 785, top: 130 }}>
        <div className="smap-rack">
          {[0, 1, 2].map((i) => (
            <div className="smap-rack-unit" key={i}>
              <span className="smap-led" />
              <span className="smap-led dim" />
              <span className="smap-slot" />
            </div>
          ))}
        </div>
        <div className="smap-name">שכבת השרת</div>
      </div>
      <HexStation x={790} y={505} size={100} logo={nodeLogo} label="Node.js" sub="המנוע" state={stationState(step, 6)} />
      <HexStation x={980} y={505} size={100} logo={expressLogo} label="Express" sub="שומר הסף" state={stationState(step, 7)} />

      {/* --- שכבת הנתונים: מסד --- */}
      <div className={el(9)} style={{ left: 105, top: 95 }}>
        <div className="smap-db">
          <div className="smap-db-top" />
          <div className="smap-db-band" />
          <div className="smap-db-band last" />
        </div>
        <div className="smap-name">שכבת הנתונים</div>
      </div>
      <HexStation x={95} y={505} size={100} logo={mongodbLogo} label="MongoDB" sub="המדפים" state={stationState(step, 10)} />
      <HexStation x={285} y={505} size={100} logo={mongooseLogo} label="Mongoose" sub="בקר האיכות" state={stationState(step, 11)} />

      {/* --- עוזרי ה-AI: שלושה עיגולים מעל השרת --- */}
      <div className={`smap-ai-trio ${step >= 12 ? 'on' : ''} ${step === 12 ? 'now' : ''}`}>
        <div className="smap-ai-circle"><img src={openaiLogo} alt="OpenAI" /></div>
        <div className="smap-ai-circle"><img src={visionLogo} alt="Google Cloud Vision" /></div>
        <div className="smap-ai-circle"><img src={elevenLogo} alt="ElevenLabs" /></div>
        <div className="smap-ai-caption">עוזרי הבינה המלאכותית</div>
      </div>
      <svg className={`smap-ai-link ${step >= 12 ? 'on' : ''}`} viewBox="0 0 1920 700" preserveAspectRatio="none" aria-hidden="true">
        <path d="M 960 96 L 960 128" />
      </svg>
    </ExplainerStage>
  )
}

SystemMapSlide.steps = CAPTIONS.length - 1
