import { ExplainerStage, HexStation, Pipe, InfoCard, SparkBurst, Callout, LayerAnchor, LayerBracket } from '../../components/Explainer/Explainer.jsx'
import Icon from '../../components/Icon/Icon.jsx'
import axiosLogo from '../../assets/tech/axios.png'
import './styles.css'

/* ============================================================
   שקף 14 — שכבת הקליינט: התשובה נכנסת משכבת השרת (עוגן כללי
   משמאל, בלי לפרט אותה), עוברת סידור, מעדכנת את הזיכרון,
   משודרת לכל המנויים — ומורכבת לעמוד שהמשתמש רואה.
   כל לחיצה = שלב.
   ============================================================ */

const CAPTIONS = [
  <>זו <em>שכבת הקליינט</em> — כל מה שהמשתמש רואה קורה כאן, <em>בדפדפן</em>. משמאל: שכבת השרת, שממנה הגענו.</>,
  <>מ<em>שכבת השרת</em> מגיעה התשובה — כל המחירים, מסודרים ובדוקים. ראשון לקבל אותה: <em>השליח</em> (Axios).</>,
  <><em>המזכירה</em> (Service) מסדרת את החומר: הופכת תשובה גולמית מהשרת ל<em>מידע מוכן לתצוגה</em>.</>,
  <><em>המומחה</em> (Hooks) מעדכן את <em>הזיכרון</em> של המסך. מהרגע הזה — יש חדשות, וכולם עומדים לשמוע עליהן.</>,
  <><em>לוח המודעות</em> (Context) משדר לכל מי שמנוי — <em>בלי טלפון שבור</em>: כולם מקבלים את אותו עדכון, באותו רגע.</>,
  <><em>אבני הבניין</em> (Components) מרכיבות את התצוגה: כרטיס מחיר, טבלה, כפתורים — כל אבן עושה <em>דבר אחד</em>, וטוב.</>,
  <><em>העמוד</em> מוצג למשתמש: המסך התעדכן <em>בלי רענון</em> — וזה כל הקסם. <em>המסע הושלם</em> — מהמחסן ועד המסך.</>,
]

/* שש תחנות הקליינט, משמאל לימין (סצנה 1920x700) */
const ST = {
  messenger: { x: 370, y: 130, size: 125 },
  secretary: { x: 630, y: 130, size: 125 },
  board: { x: 890, y: 130, size: 125 },
  expert: { x: 1150, y: 130, size: 125 },
  blocks: { x: 1410, y: 130, size: 125 },
  page: { x: 1670, y: 130, size: 125 },
}

const P = {
  serverToMessenger: 'M 228 185 C 275 150, 320 150, 365 192',
  messengerToSecretary: 'M 498 190 C 538 148, 588 148, 628 190',
  secretaryToExpert: 'M 745 152 C 880 42, 1060 42, 1170 152',
  expertToBoard: 'M 1147 190 C 1107 148, 1058 148, 1018 190',
  boardToBlocks: 'M 1000 158 C 1120 48, 1300 48, 1420 158',
  boardToPage: 'M 988 146 C 1180 8, 1520 8, 1692 148',
}

export default function ClientFlowExplainer({ step = 0 }) {
  return (
    <ExplainerStage kicker="BEHIND THE SCENES · 03" title="שכבת הקליינט — מה שרואים על המסך" step={step} captions={CAPTIONS}>
      {/* מסלול התשובה פנימה (אקווה) */}
      <Pipe path={P.serverToMessenger} lit={step === 1} done={step > 1} packetLabel="תשובה" />
      <Pipe path={P.messengerToSecretary} lit={step === 2} done={step > 2} packetLabel="תשובה גולמית" />
      <Pipe path={P.secretaryToExpert} lit={step === 3} done={step > 3} packetLabel="מידע מוכן" />

      {/* השידור (ענבר): מהמומחה ללוח, ומהלוח לכל המנויים */}
      <Pipe path={P.expertToBoard} lit={step === 4} done={step > 4} packetColor="#ffd98a" packetLabel="יש חדשות!" />
      <Pipe path={P.boardToBlocks} lit={step === 4} done={step > 4} packetColor="#ffd98a" packetLabel="עדכון" />
      <Pipe path={P.boardToPage} lit={step === 4} done={step > 4} packetColor="#ffd98a" />

      {/* עוגן שכבת השרת — כללי, בלי פירוט */}
      <LayerAnchor x={40} y={110} icon={<Icon name="server" />} label="שכבת השרת" sub="משם הגיעה התשובה" lit={step === 1} />

      {/* תחנות שכבת הקליינט */}
      <div className="x14-row">
        <HexStation {...ST.messenger} logo={axiosLogo} label="השליח" sub="Axios · הקשר עם השרת"
          state={step === 1 ? 'active' : step > 1 ? 'done' : 'idle'} />
        <HexStation {...ST.secretary} icon={<Icon name="page" size={56} className="x14-ic" />} label="המזכירה" sub="Service · מנסחת ומקבלת פניות"
          state={step === 2 ? 'active' : step > 2 ? 'done' : 'idle'} />
        <HexStation {...ST.board} icon={<Icon name="users" size={56} className="x14-ic" />} label="לוח המודעות" sub="Context · משדר לכל מי שמנוי"
          state={step === 4 ? 'active' : step > 4 ? 'done' : 'idle'} />
        <HexStation {...ST.expert} icon={<Icon name="hook" size={56} className="x14-ic" />} label="המומחה" sub="Hooks · הזיכרון והחוכמה"
          state={step === 3 ? 'active' : step > 3 ? 'done' : 'idle'} />
        <HexStation {...ST.blocks} icon={<Icon name="puzzle" size={56} className="x14-ic" />} label="אבני הבניין" sub="Components · חלקי המסך"
          state={step === 5 ? 'active' : step > 5 ? 'done' : 'idle'} />
        <HexStation {...ST.page} icon={<Icon name="layout" size={56} className="x14-ic" />} label="העמוד" sub="Pages · מה שהמשתמש רואה"
          state={step === 6 ? 'active' : 'idle'} />
      </div>

      {/* סוגר: שש התחנות = שכבת הקליינט */}
      <LayerBracket x={345} y={358} w={1480} label="שכבת הקליינט" />

      {/* שלב 0: מבוא */}
      <Callout x={830} y={436} w={430} show={step === 0}>
        שש תחנות, תפקיד אחד: להפוך נתונים יבשים למסך ש<strong>נעים להשתמש בו</strong> — הכול אצל המשתמש, בדפדפן.
      </Callout>

      {/* שלב 2: המזכירה מסדרת את החומר — קרן סריקה */}
      <InfoCard x={520} y={420} w={340} title="סידור החומר" show={step === 2} scan items={[
        '📥 נכנס: תשובה גולמית מהשרת',
        '🗂️ ממוין: לפי מחיר ולפי רשת',
        '📤 יוצא: מידע מוכן לתצוגה',
      ]} />

      {/* שלב 3: המומחה מעדכן את הזיכרון */}
      <Callout x={1090} y={430} w={310} show={step === 3}>
        <strong>המומחה</strong> מחליף בזיכרון ישן בחדש — ומכריז: יש חדשות למסך!
      </Callout>

      {/* שלב 4: טבעות שידור סביב לוח המודעות */}
      {step === 4 && (
        <>
          <div className="x14-ring" />
          <div className="x14-ring x14-ring2" />
        </>
      )}

      {/* שלב 5: אבני הבניין — רשימה שנחתמת בוי אחד-אחד */}
      <InfoCard x={1330} y={420} w={300} title="הרכבת התצוגה" show={step === 5} checklist items={[
        'כרטיס המחיר מוכן',
        'טבלת ההשוואה מוכנה',
        'הכפתורים מחוברים',
      ]} />

      {/* שלב 6: העמוד על המסך — מיני-ממשק + ניצוצות */}
      <div className={`x14-ui ${step === 6 ? 'show' : ''}`} dir="rtl">
        <div className="x14-ui-head">Smart Cart — תוצאות ״חלב״</div>
        <div className="x14-ui-row best" style={{ '--i': 0 }}><span>רמי לוי · טרה</span><b>₪5.40</b><i>הכי זול</i></div>
        <div className="x14-ui-row" style={{ '--i': 1 }}><span>שופרסל · תנובה</span><b>₪5.90</b></div>
        <div className="x14-ui-row" style={{ '--i': 2 }}><span>ויקטורי · יטבתה</span><b>₪6.20</b></div>
      </div>
      <SparkBurst x={1732} y={196} show={step === 6} />
    </ExplainerStage>
  )
}

ClientFlowExplainer.steps = CAPTIONS.length - 1
