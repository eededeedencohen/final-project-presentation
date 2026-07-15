import { ExplainerStage, HexStation, Pipe, InfoCard, SparkBurst, Callout } from '../../components/Explainer/Explainer.jsx'
import Icon from '../../components/Icon/Icon.jsx'
import axiosLogo from '../../assets/tech/axios.png'
import expressLogo from '../../assets/tech/express.png'
import mongodbLogo from '../../assets/tech/mongodb.png'
import './styles.css'

/* ============================================================
   שקף 11 — צד השרת כסיפור אנושי (לקהל לא-טכני):
   השליח יוצא עם מעטפה, שומר הסף בודק בכניסה, המוקדן מפנה
   לדלפק הנכון, המנהל מפעיל את הלוגיקה, המחסן מאתר —
   והתשובה חוזרת בענבר עד המסך. כל לחיצה = שלב, ובכל שלב
   משהו זז: חבילה נוסעת, וי נחתם, קרן סורקת או ניצוצות.
   ============================================================ */

const CAPTIONS = [
  <>המשתמש לחץ על <em>"השוו לי את העגלה"</em> — ומאותו רגע מתחיל מסע קצר ומהיר. בואו נלווה אותו, תחנה אחרי תחנה.</>,
  <><em>השליח</em> יוצא לדרך עם מעטפה מסודרת: בפנים רשימת הקניות — ושום דבר מיותר.</>,
  <>בדלת השרת עומד <em>שומר הסף</em>: מוודא שהפנייה ממקור מוכר, רושם אותה ביומן ובודק שהתוכן קריא — ורק אז פותח את הדלת.</>,
  <><em>המוקדן</em> מציץ במעטפה ומיד יודע לאן להפנות: לכל סוג פנייה יש דלפק משלה — והמעטפה שלנו עוברת ישר לדלפק ההשוואות.</>,
  <><em>המנהל</em> יודע בדיוק מה לעשות: לחשב כמה עולה הסל בכל רשת ולסדר מהזול ליקר. בשביל זה הוא שולח שאלה אל <em>המחסן</em>.</>,
  <>המחסן מאתר את כל המחירים <em>בן-רגע</em> — והתשובה יוצאת לדרך חזרה, תחנה אחרי תחנה, אל השליח.</>,
  <>מהקליק ועד המסך — <em>פחות משנייה</em>: המשתמש רואה מיד באיזו רשת העגלה שלו הכי משתלמת.</>,
]

/* צירי התחנות בסצנה (1920x700), משמאל לימין */
const ST = {
  courier: { x: 100, y: 150 },
  guard: { x: 460, y: 150 },
  desk: { x: 820, y: 150 },
  manager: { x: 1180, y: 150 },
  store: { x: 1540, y: 150 },
}

/* צינורות: קשת עליונה = הבקשה (ימינה), קשת תחתונה = התשובה (שמאלה) */
const P = {
  reqCourierToGuard: 'M 255 210 C 320 160, 390 160, 455 210',
  reqGuardToDesk: 'M 615 210 C 680 160, 750 160, 815 210',
  reqDeskToManager: 'M 975 210 C 1040 160, 1110 160, 1175 210',
  reqManagerToStore: 'M 1335 210 C 1400 160, 1470 160, 1535 210',
  resStoreToManager: 'M 1535 300 C 1470 355, 1400 355, 1335 300',
  resManagerToDesk: 'M 1175 300 C 1110 355, 1040 355, 975 300',
  resDeskToGuard: 'M 815 300 C 750 355, 680 355, 615 300',
  resGuardToCourier: 'M 455 300 C 390 355, 320 355, 255 300',
}

const stateOf = (step, activeAt) => (step === activeAt ? 'active' : step > activeAt ? 'done' : 'idle')

export default function ServerFlowExplainer({ step = 0 }) {
  return (
    <ExplainerStage kicker="BEHIND THE SCENES · 02" title="מהקליק ועד התשובה" step={step} captions={CAPTIONS}>
      {/* קשת הבקשה (אקווה) — חבילה יוצאת מהתחנה הפעילה קדימה */}
      <Pipe path={P.reqCourierToGuard} lit={step === 1} done={step > 1} packetLabel="הזמנה" />
      <Pipe path={P.reqGuardToDesk} lit={step === 2} done={step > 2} packetLabel="אושר להיכנס" />
      <Pipe path={P.reqDeskToManager} lit={step === 3} done={step > 3} packetLabel="אל המנהל" />
      <Pipe path={P.reqManagerToStore} lit={step === 4} done={step > 4} packetLabel="שאילתה" />

      {/* קשת התשובה (ענבר) — חוזרת דרך כל התחנות */}
      <Pipe path={P.resStoreToManager} lit={step === 5} done={step > 5} packetColor="#ffd98a" packetLabel="ממצאים" />
      <Pipe path={P.resManagerToDesk} lit={step === 5} done={step > 5} packetColor="#ffd98a" packetLabel="תשובה" />
      <Pipe path={P.resDeskToGuard} lit={step === 5} done={step > 5} packetColor="#ffd98a" />
      <Pipe path={P.resGuardToCourier} lit={step === 6} done={step > 6} packetColor="#ffd98a" packetLabel="אל המסך" />

      {/* תחנות */}
      <HexStation {...ST.courier} logo={axiosLogo} label="השליח" sub="Axios · מוסר בקשות ותשובות" state={step === 1 || step === 6 ? 'active' : step > 1 ? 'done' : 'idle'} />
      <HexStation {...ST.guard} logo={expressLogo} label="שומר הסף" sub="Express · הדלת הראשית של השרת" state={stateOf(step, 2)} />
      <HexStation {...ST.desk} icon={<Icon name="route" size={64} className="x11-ic" />} label="המוקדן" sub="Routes · מנתב כל פנייה לגורם הנכון" state={stateOf(step, 3)} />
      <HexStation {...ST.manager} icon={<Icon name="user" size={64} className="x11-ic" />} label="המנהל" sub="Controller · הלוגיקה העסקית" state={stateOf(step, 4)} />
      <HexStation {...ST.store} logo={mongodbLogo} label="המחסן" sub="MongoDB · כל המחירים של כל הרשתות" state={stateOf(step, 5)} />

      {/* שלב 0: הקליק שמתחיל הכול — כפתור עם אדוות ואצבע מקישה */}
      <div className={`x11-btn ${step === 0 ? 'show' : ''}`} dir="rtl">
        <div className="x11-btn-pill">
          השוו לי את העגלה
          <span className="x11-btn-hand">👆</span>
        </div>
      </div>

      {/* שלב 1: מה יש במעטפה של השליח */}
      <InfoCard x={40} y={385} w={350} title="מה יש במעטפה?" show={step === 1} items={[
        '🛒 רשימת הקניות — 12 מוצרים',
        '🏷️ זיהוי מדויק לכל מוצר',
        '🚫 בלי פרטים מיותרים',
      ]} />

      {/* שלב 2: בדיקת שומר הסף — וי-ים נחתמים אחד-אחד */}
      <InfoCard x={380} y={385} w={330} title="בדיקת הכניסה" show={step === 2} checklist items={[
        'הפנייה הגיעה ממקור מוכר',
        'נרשמה ביומן הכניסות',
        'התוכן קריא ומובן',
      ]} />
      <div className={`x11-mw-tag ${step >= 2 ? 'show' : ''} ${step === 2 ? 'hot' : ''}`} dir="ltr">CORS · Morgan</div>

      {/* שלב 3: המוקדן מפנה לדלפק הנכון */}
      <Callout x={755} y={390} w={310} show={step === 3} arrow="up">
        לכל סוג פנייה יש <strong>דלפק ייעודי</strong> — השוואת עגלה, חיפוש מוצר, עדכון מחירים. אף מעטפה לא מסתובבת אבודה במסדרונות.
      </Callout>

      {/* שלב 4: תוכנית העבודה של המנהל */}
      <InfoCard x={1085} y={385} w={350} title="תוכנית העבודה" show={step === 4} items={[
        '🧮 לחשב את עלות הסל בכל רשת',
        '↕ לסדר מהזול ליקר',
        '📨 קודם כול — שאלה אל המחסן',
      ]} />

      {/* שלב 5: המחסן מאתר — קרן סריקה חולפת על הכרטיס */}
      <InfoCard x={1435} y={385} w={360} title="איתור במחסן" show={step === 5} scan items={[
        '🔍 בלי לעבור מדף-מדף — ישר למקום הנכון',
        '📦 כל המחירים של כל הפריטים ברשימה',
      ]} />

      {/* שלב 6: התוצאה על המסך + ניצוצות */}
      <div className={`x11-ui ${step === 6 ? 'show' : ''}`} dir="rtl">
        <div className="x11-ui-head">השוואת עגלה · 12 מוצרים</div>
        <div className="x11-ui-row best"><span>רמי לוי</span><b>₪142</b><i>הכי משתלם</i></div>
        <div className="x11-ui-row"><span>שופרסל</span><b>₪151</b></div>
        <div className="x11-ui-row"><span>ויקטורי</span><b>₪159</b></div>
      </div>
      <SparkBurst x={235} y={430} show={step === 6} />
    </ExplainerStage>
  )
}

ServerFlowExplainer.steps = CAPTIONS.length - 1
