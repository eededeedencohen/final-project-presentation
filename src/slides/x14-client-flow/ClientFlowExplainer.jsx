import { ExplainerStage, HexStation, Pipe, InfoCard, SparkBurst, Callout, LayerAnchor, LayerBracket } from '../../components/Explainer/Explainer.jsx'
import Icon from '../../components/Icon/Icon.jsx'
import axiosLogo from '../../assets/tech/axios.png'
import reactLogo from '../../assets/tech/react.png'
import './styles.css'

/* ============================================================
   שקף 14 — שכבת הקליינט: התשובה נכנסת משכבת השרת, עוברת
   סידור (Service), מעדכנת את הזיכרון המשותף (Context), נמסרת
   דרך המומחים (Hooks) לאבני הבניין (Components), והעמוד (Pages)
   מוצג בתוך אפליקציית React אחת. משקף את הארכיטקטורה בפועל:
   index.js עוטף הכול ב-Providers, App מכיל את הניווט והעמודים.
   ============================================================ */

const CAPTIONS = [
  <>זו <em>שכבת הקליינט</em> — והכול חי בתוך <em>אפליקציית React אחת</em>: מהכפתור הקטן ועד העמוד השלם.</>,
  <>התשובה מגיעה מהשרת אל <em>השליח</em> (Axios) — הקשר היחיד של המסך עם העולם שבחוץ.</>,
  <><em>המזכירה</em> (Service) הופכת תשובה גולמית ל<em>מידע מוכן לתצוגה</em> — אף אחד אחר לא צריך להכיר שרתים.</>,
  <><em>לוח המודעות</em> (Context) מעדכן את הזיכרון המשותף. אצלנו יש לוח לכל נושא — <em>עגלה, מחירים, העדפות</em>.</>,
  <><em>המומחים</em> (Hooks) — כל חלק במסך שואל את המומחה שלו ומקבל <em>בדיוק את מה שהוא צריך</em>, מוכן לשימוש.</>,
  <><em>אבני הבניין</em> (Components) מרכיבות מחדש <em>רק את מה שהשתנה</em> — לא את כל המסך.</>,
  <>ה-Router בוחר את <em>העמוד</em> — עגלה, השוואה, סטטיסטיקות — והכול מוצג בתוך <em>האפליקציה</em>, בלי רענון אחד.</>,
]

/* שבע תחנות, משמאל לימין (סצנה 1920x700) */
const ST = {
  messenger: { x: 330, y: 130, size: 118 },
  secretary: { x: 555, y: 130, size: 118 },
  board: { x: 780, y: 130, size: 118 },
  expert: { x: 1005, y: 130, size: 118 },
  blocks: { x: 1230, y: 130, size: 118 },
  page: { x: 1455, y: 130, size: 118 },
  app: { x: 1685, y: 124, size: 130 },
}

const P = {
  serverToMessenger: 'M 228 185 C 270 148, 292 148, 327 190',
  messengerToSecretary: 'M 450 190 C 485 150, 520 150, 553 190',
  secretaryToBoard: 'M 675 190 C 710 150, 745 150, 778 190',
  boardToExpert: 'M 900 190 C 935 150, 970 150, 1003 190',
  expertToBlocks: 'M 1125 190 C 1160 150, 1195 150, 1228 190',
  blocksToPage: 'M 1350 190 C 1385 150, 1420 150, 1453 190',
  pageToApp: 'M 1575 190 C 1610 150, 1648 150, 1683 190',
}

export default function ClientFlowExplainer({ step = 0 }) {
  return (
    <ExplainerStage kicker="BEHIND THE SCENES · 03" title="שכבת הקליינט — מה שרואים על המסך" step={step} captions={CAPTIONS}>
      <Pipe path={P.serverToMessenger} lit={step === 1} done={step > 1} packetColor="#e8a33d" packetLabel="תשובה" />
      <Pipe path={P.messengerToSecretary} lit={step === 2} done={step > 2} packetColor="#e8a33d" packetLabel="חומר גולמי" />
      <Pipe path={P.secretaryToBoard} lit={step === 3} done={step > 3} packetColor="#e8a33d" packetLabel="מידע מסודר" />
      <Pipe path={P.boardToExpert} lit={step === 4} done={step > 4} packetLabel="עדכון" />
      <Pipe path={P.expertToBlocks} lit={step === 5} done={step > 5} packetLabel="בדיוק מה שצריך" />
      <Pipe path={P.blocksToPage} lit={step === 6} done={step > 6} packetLabel="תצוגה" />
      <Pipe path={P.pageToApp} lit={step === 6} done={step > 6} packetLabel="" delay={1500} />

      {/* עוגן שכבת השרת */}
      <LayerAnchor x={40} y={110} icon={<Icon name="server" />} label="שכבת השרת" sub="משם הגיעה התשובה" lit={step === 1} />

      {/* תחנות שכבת הקליינט */}
      <div className="x14-row">
        <HexStation {...ST.messenger} logo={axiosLogo} label="השליח" sub="Axios · הקשר עם השרת" state={step === 1 ? 'active' : step > 1 ? 'done' : 'idle'} />
        <HexStation {...ST.secretary} icon={<Icon name="page" size={52} className="x14-ic" />} label="המזכירה" sub="Service · מנסחת ומסדרת" state={step === 2 ? 'active' : step > 2 ? 'done' : 'idle'} />
        <HexStation {...ST.board} icon={<Icon name="users" size={52} className="x14-ic" />} label="לוח המודעות" sub="Context · הזיכרון המשותף" state={step === 3 ? 'active' : step > 3 ? 'done' : 'idle'} />
        <HexStation {...ST.expert} icon={<Icon name="hook" size={52} className="x14-ic" />} label="המומחים" sub="Hooks · חוכמה לכל נושא" state={step === 4 ? 'active' : step > 4 ? 'done' : 'idle'} />
        <HexStation {...ST.blocks} icon={<Icon name="puzzle" size={52} className="x14-ic" />} label="אבני הבניין" sub="Components · חלקי המסך" state={step === 5 ? 'active' : step > 5 ? 'done' : 'idle'} />
        <HexStation {...ST.page} icon={<Icon name="layout" size={52} className="x14-ic" />} label="העמוד" sub="Pages · Router בוחר מה מציגים" state={step === 6 ? 'active' : 'idle'} />
        <HexStation {...ST.app} logo={reactLogo} label="האפליקציה" sub="React · App — הבית של הכול" state={step === 0 || step === 6 ? 'active' : 'idle'} />
      </div>

      {/* סוגר: כל התחנות = שכבת הקליינט */}
      <LayerBracket x={310} y={365} w={1530} label="שכבת הקליינט — אפליקציית React אחת" />

      {/* שלב 3: לוח לכל נושא — כמו פירמידת ה-Providers בקוד */}
      <InfoCard x={640} y={470} w={330} title="לוח מודעות לכל נושא" show={step === 3} items={[
        '🛒 עגלת הקניות',
        '💰 מחירים והשוואות',
        '⚙️ העדפות והגדרות תצוגה',
      ]} />

      {/* שלב 4: מומחה העגלה — כמו appHooks בקוד */}
      <Callout x={900} y={470} w={320} show={step === 4}>
        <strong>מומחה העגלה</strong> יודע לחשב סה״כ, להוסיף ולהסיר — כותבים פעם אחת, וכל המסכים נהנים.
      </Callout>

      {/* שלב 5: מה מורכב מחדש */}
      <InfoCard x={1140} y={470} w={310} title="מה מצטייר מחדש?" show={step === 5} checklist items={[
        'כרטיס המוצר שהשתנה',
        'שורת הסה״כ',
        'זה הכול — השאר נשאר',
      ]} />

      {/* שלב 6: העמוד באפליקציה + חגיגה */}
      <div className={`x14-ui ${step === 6 ? 'show' : ''}`} dir="rtl">
        <div className="x14-ui-head">Smart Cart — העגלה שלי</div>
        <div className="x14-ui-row best"><span>רמי לוי · סה״כ</span><b>₪142</b><i>הכי משתלם</i></div>
        <div className="x14-ui-row"><span>שופרסל · סה״כ</span><b>₪151</b></div>
      </div>
      <SparkBurst x={1750} y={185} show={step === 6} />
    </ExplainerStage>
  )
}

ClientFlowExplainer.steps = CAPTIONS.length - 1
