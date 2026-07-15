import { ExplainerStage, HexStation, Pipe, InfoCard, SparkBurst, Callout, LayerAnchor, LayerBracket } from '../../components/Explainer/Explainer.jsx'
import Icon from '../../components/Icon/Icon.jsx'
import expressLogo from '../../assets/tech/express.png'
import nodejsLogo from '../../assets/tech/nodejs.png'
import './styles.css'

/* ============================================================
   שקף 11 — שכבת השרת: מרכז התיאום בין שכבת הנתונים (עוגן
   כללי משמאל) לשכבת הקליינט (עוגן כללי מימין). בקשה נכנסת
   מהקליינט, עוברת מנוע → שומר סף → מוקדן → מנהל, המנהל
   מתקשר לשכבת הנתונים — והתשובה חוזרת בשרשרת החוצה.
   כל לחיצה = שלב.
   ============================================================ */

const CAPTIONS = [
  <>זו <em>שכבת השרת</em> — מרכז התיאום: משמאל שכבת הנתונים שכבר הכרנו, מימין שכבת הקליינט. השרת יושב באמצע ומתאם ביניהן.</>,
  <>משכבת הקליינט נכנסת <em>בקשה</em>: ״השוו לי את העגלה״. ראשון מקבל אותה <em>המנוע</em> — הוא שמריץ את השרת כולו, וכל פנייה עוברת דרכו.</>,
  <>בכניסה עומד <em>שומר הסף</em>: מוודא שהפנייה ממקור מוכר, רושם אותה ביומן ובודק שהתוכן קריא — ורק אז פותח את הדלת.</>,
  <><em>המוקדן</em> מציץ בבקשה ומפנה אותה לדלפק הנכון: לכל סוג פנייה יש דלפק משלה — ושלנו הולכת לדלפק ההשוואות.</>,
  <>וכאן <em>המנהל</em> — המקשר: כדי לענות, הוא שולח בקשה אל <em>שכבת הנתונים</em>. זה בדיוק המסע שראינו בשקף הקודם.</>,
  <>ה<em>ממצאים</em> חוזרים מהנתונים, המנהל אורז אותם לתשובה מסודרת — והיא עוברת חזרה בשרשרת, תחנה אחרי תחנה.</>,
  <>ה<em>תשובה</em> יוצאת אל שכבת הקליינט. מה המסך של המשתמש עושה איתה? <em>זה בדיוק השקף הבא</em>.</>,
]

/* תחנות השרת בסצנה (1920x700), משמאל לימין */
const ST = {
  manager: { x: 400, y: 130 },
  desk: { x: 740, y: 130 },
  guard: { x: 1080, y: 130 },
  engine: { x: 1420, y: 130 },
}

/* צינורות: קשת עליונה = הבקשה (ימין→שמאל), קשת תחתונה = התשובה (שמאל→ימין) */
const P = {
  reqClientToEngine: 'M 1690 190 C 1648 148, 1600 148, 1558 192',
  reqEngineToGuard: 'M 1414 194 C 1360 148, 1265 148, 1216 194',
  reqGuardToDesk: 'M 1074 194 C 1020 148, 925 148, 876 194',
  reqDeskToManager: 'M 734 194 C 680 148, 585 148, 536 194',
  reqManagerToData: 'M 394 194 C 350 150, 272 150, 232 190',
  resDataToManager: 'M 232 262 C 272 320, 350 322, 394 276',
  resManagerToDesk: 'M 536 276 C 585 324, 680 324, 734 276',
  resDeskToGuard: 'M 876 276 C 925 324, 1020 324, 1074 276',
  resGuardToEngine: 'M 1216 276 C 1265 324, 1360 324, 1414 276',
  resEngineToClient: 'M 1558 278 C 1602 326, 1652 316, 1692 262',
}

const stateOf = (step, activeAt) => (step === activeAt ? 'active' : step > activeAt ? 'done' : 'idle')

export default function ServerFlowExplainer({ step = 0 }) {
  return (
    <ExplainerStage kicker="BEHIND THE SCENES · 02" title="שכבת השרת — מרכז התיאום" step={step} captions={CAPTIONS}>
      {/* קשת הבקשה (אקווה) — מהקליינט פנימה, תחנה אחרי תחנה */}
      <Pipe path={P.reqClientToEngine} lit={step === 1} done={step > 1} packetLabel="בקשה" />
      <Pipe path={P.reqEngineToGuard} lit={step === 2} done={step > 2} packetLabel="לבדיקה בכניסה" />
      <Pipe path={P.reqGuardToDesk} lit={step === 3} done={step > 3} packetLabel="אושרה להיכנס" />
      <Pipe path={P.reqDeskToManager} lit={step === 4} done={step > 4} packetLabel="אל דלפק ההשוואות" />
      <Pipe path={P.reqManagerToData} lit={step === 4} done={step > 4} packetLabel="בקשה לנתונים" />

      {/* קשת התשובה (ענבר) — מהנתונים חזרה החוצה */}
      <Pipe path={P.resDataToManager} lit={step === 5} done={step > 5} packetColor="#ffd98a" packetLabel="ממצאים" />
      <Pipe path={P.resManagerToDesk} lit={step === 5} done={step > 5} packetColor="#ffd98a" packetLabel="תשובה מוכנה" />
      <Pipe path={P.resDeskToGuard} lit={step === 5} done={step > 5} packetColor="#ffd98a" />
      <Pipe path={P.resGuardToEngine} lit={step === 5} done={step > 5} packetColor="#ffd98a" />
      <Pipe path={P.resEngineToClient} lit={step === 6} done={step > 6} packetColor="#ffd98a" packetLabel="תשובה" />

      {/* עוגני השכבות השכנות — כלליים, בלי פירוט פנימי */}
      <LayerAnchor x={40} y={110} icon={<Icon name="database" />} label="שכבת הנתונים" sub="המחסן שראינו קודם" lit={step === 0 || step === 4 || step === 5} />
      <LayerAnchor x={1680} y={110} icon={<Icon name="layout" />} label="שכבת הקליינט" sub="המסך של המשתמש" lit={step === 0 || step === 1 || step === 6} />

      {/* תחנות שכבת השרת */}
      <HexStation {...ST.manager} size={130} icon={<Icon name="user" size={56} className="x11-ic" />} label="המנהל" sub="Controller · המקשר לשכבת הנתונים" state={step === 4 || step === 5 ? 'active' : step > 5 ? 'done' : 'idle'} />
      <HexStation {...ST.desk} size={130} icon={<Icon name="route" size={56} className="x11-ic" />} label="המוקדן" sub="Routes · מנתב כל פנייה" state={stateOf(step, 3)} />
      <HexStation {...ST.guard} size={130} logo={expressLogo} label="שומר הסף" sub="Express · הדלת הראשית" state={stateOf(step, 2)} />
      <HexStation {...ST.engine} size={130} logo={nodejsLogo} label="המנוע" sub="Node.js · מריץ את הכול" state={step === 1 || step === 6 ? 'active' : step > 1 ? 'done' : 'idle'} />

      {/* סוגר: ארבע התחנות = שכבת השרת */}
      <LayerBracket x={380} y={390} w={1190} label="שכבת השרת" />

      {/* שלב 0: תג תיאום עם חצים לשני הכיוונים */}
      <div className={`x11-coord ${step === 0 ? 'show' : ''}`} dir="rtl">
        <span className="x11-coord-arrow x11-to-left">⟵</span>
        מתאם בין השכבות: בקשות נכנסות, תשובות יוצאות
        <span className="x11-coord-arrow x11-to-right">⟶</span>
      </div>

      {/* שלב 1: מה המנוע עושה */}
      <InfoCard x={1440} y={430} w={340} title="המנוע — Node.js" show={step === 1} items={[
        '⚙️ מריץ את קוד השרת סביב השעון',
        '📥 כל פנייה נכנסת דרכו',
        '⚡ מהיר, ולא עוצר לרגע',
      ]} />

      {/* שלב 2: בדיקת שומר הסף — וי-ים נחתמים אחד-אחד */}
      <InfoCard x={1040} y={430} w={330} title="בדיקת הכניסה" show={step === 2} checklist items={[
        'הפנייה הגיעה ממקור מוכר',
        'נרשמה ביומן הכניסות',
        'התוכן קריא ומובן',
      ]} />

      {/* שלב 3: המוקדן מפנה לדלפק הנכון */}
      <Callout x={670} y={430} w={310} show={step === 3} arrow="up">
        לכל סוג פנייה יש <strong>דלפק ייעודי</strong> — השוואת עגלה, חיפוש מוצר, עדכון מחירים. אף בקשה לא מסתובבת אבודה.
      </Callout>

      {/* שלב 4: המנהל שולח אל שכבת הנתונים */}
      <Callout x={100} y={430} w={310} show={step === 4} arrow="up">
        המנהל שולח בקשה אל <strong>שכבת הנתונים</strong> — זה בדיוק המסע שראינו בשקף הקודם.
      </Callout>

      {/* שלב 5: המנהל אורז את התשובה — קרן סריקה חולפת על הכרטיס */}
      <InfoCard x={360} y={430} w={340} title="המנהל אורז את התשובה" show={step === 5} scan items={[
        '🧮 עלות הסל בכל רשת',
        '↕ מסודר מהזול ליקר',
        '📦 ארוז ומוכן לדרך חזרה',
      ]} />

      {/* שלב 6: התשובה יוצאת לקליינט + ניצוצות */}
      <InfoCard x={1540} y={420} w={310} title="מה יוצא אל הקליינט?" show={step === 6} items={[
        '🏆 רמי לוי · ₪142 — הכי משתלם',
        '🏪 שופרסל · ₪151',
        '🏪 ויקטורי · ₪159',
      ]} />
      <SparkBurst x={1775} y={185} show={step === 6} />
    </ExplainerStage>
  )
}

ServerFlowExplainer.steps = CAPTIONS.length - 1
