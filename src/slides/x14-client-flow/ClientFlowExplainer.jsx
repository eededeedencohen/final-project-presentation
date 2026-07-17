import { ExplainerStage, HexStation, Pipe, InfoCard, SparkBurst, Callout, LayerAnchor, LayerBracket } from '../../components/Explainer/Explainer.jsx'
import Icon from '../../components/Icon/Icon.jsx'
import axiosLogo from '../../assets/tech/axios.png'
import reactLogo from '../../assets/tech/react.png'
import './styles.css'

/* ============================================================
   שקף 14 — שכבת הקליינט. כל לחיצה = מעבר אחד בדיוק:
   או תחנה שנדלקת עם ההסבר שלה, או חבילה אחת שנוסעת בצינור אחד.

   0  פתיחה — האפליקציה (React) נדלקת
   1  נסיעה: שרת ← השליח (חבילת "תשובה")
   2  הסבר: השליח (Axios)
   3  נסיעה: השליח ← המזכירה ("חומר גולמי")
   4  הסבר: המזכירה (Service)
   5  נסיעה: המזכירה ← לוח המודעות ("מידע מסודר")
   6  הסבר: לוח המודעות (Context)
   7  נסיעה: לוח המודעות ← המומחים ("עדכון")
   8  הסבר: המומחים (Hooks)
   9  נסיעה אחת רצופה: המומחים ← אבני הבניין ← העמוד
   10 נסיעה: העמוד ← האפליקציה (ה-Router בוחר עמוד)
   11 סיום: טבלת ההשוואה על המסך + ניצוצות
   ============================================================ */

const CAPTIONS = [
  <>זו <em>שכבת הקליינט</em> — מה שרואים על המסך. הכול חי בתוך <em>אפליקציית React אחת</em>: מהכפתור הקטן ועד העמוד השלם.</>,
  <>מהשרת יוצאת <em>תשובה</em> — למשל: איזו רשת הכי זולה לעגלה שלכם — והיא נוסעת אל <em>השליח</em>.</>,
  <><em>השליח</em> (Axios) הוא היחיד שמדבר עם העולם שבחוץ: שולח את הבקשה, ממתין, וחוזר עם <em>התשובה הגולמית</em> ביד.</>,
  <>השליח לא מפענח כלום — הוא מוסר את <em>החומר הגולמי</em>, בדיוק כפי שהגיע, אל <em>המזכירה</em>.</>,
  <><em>המזכירה</em> (Service) הופכת תשובה גולמית ל<em>מידע מוכן לתצוגה</em> — שאר המסך לא צריך להכיר שרתים בכלל.</>,
  <>המידע המסודר נוסע אל <em>לוח המודעות</em> — הזיכרון המשותף של כל האפליקציה.</>,
  <><em>לוח המודעות</em> (Context): לוח נפרד לכל נושא — <em>עגלה, מחירים, העדפות</em> — וכל מי שעוקב אחרי הלוח מתעדכן מיד.</>,
  <>הלוח מכריז: <em>"יש עדכון!"</em> — וההודעה יוצאת אל <em>המומחים</em>.</>,
  <><em>המומחים</em> (Hooks): מומחה העגלה יודע לחשב סה״כ, להוסיף ולהסיר — כותבים אותו <em>פעם אחת</em>, וכל המסכים נהנים.</>,
  <>המידע זורם ל<em>חלקי המסך</em> — וכל אחד מצייר מחדש <em>רק את עצמו</em>, לא את כל המסך.</>,
  <>ה-<em>Router</em> בוחר איזה עמוד מציגים — <em>עגלה, השוואה או סטטיסטיקות</em> — והכול בתוך אפליקציה אחת.</>,
  <>המסך התעדכן <em>בלי רענון אחד</em> — מהמחסן ועד <em>העין של המשתמש</em>.</>,
]

/* שבע תחנות, משמאל לימין (סצנה 1920x700) — הגאומטריה נשמרת */
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
  /* נתיב אחד רצוף: המומחים ← אבני הבניין ← העמוד (חבילה אחת, נסיעה אחת) */
  expertToPage: 'M 1125 190 C 1160 150, 1195 150, 1228 190 C 1262 232, 1316 232, 1350 190 C 1385 150, 1420 150, 1453 190',
  pageToApp: 'M 1575 190 C 1610 150, 1648 150, 1683 190',
}

export default function ClientFlowExplainer({ step = 0 }) {
  return (
    <ExplainerStage kicker="BEHIND THE SCENES · 03" title="שכבת הקליינט — מה שרואים על המסך" step={step} captions={CAPTIONS}>
      {/* צינורות — כל צינור נדלק בדיוק בשלב הנסיעה שלו */}
      <Pipe path={P.serverToMessenger} lit={step === 1} done={step > 1} packetColor="#e8a33d" packetLabel="תשובה" />
      <Pipe path={P.messengerToSecretary} lit={step === 3} done={step > 3} packetColor="#e8a33d" packetLabel="חומר גולמי" />
      <Pipe path={P.secretaryToBoard} lit={step === 5} done={step > 5} packetColor="#e8a33d" packetLabel="מידע מסודר" />
      <Pipe path={P.boardToExpert} lit={step === 7} done={step > 7} packetLabel="עדכון" />
      <Pipe path={P.expertToPage} lit={step === 9} done={step > 9} packetLabel="בדיוק מה שצריך" />
      <Pipe path={P.pageToApp} lit={step === 10} done={step > 10} packetLabel="העמוד הנבחר" />

      {/* עוגן שכבת השרת */}
      <LayerAnchor x={40} y={110} icon={<Icon name="server" />} label="שכבת השרת" sub="משם הגיעה התשובה" lit={step === 1} />

      {/* תחנות שכבת הקליינט — כל תחנה נדלקת בשלב ההסבר שלה */}
      <div className="x14-row">
        <HexStation {...ST.messenger} logo={axiosLogo} label="השליח" sub="Axios · הקשר עם השרת" state={step === 2 ? 'active' : step > 2 ? 'done' : 'idle'} />
        <HexStation {...ST.secretary} icon={<Icon name="page" size={52} className="x14-ic" />} label="המזכירה" sub="Service · מנסחת ומסדרת" state={step === 4 ? 'active' : step > 4 ? 'done' : 'idle'} />
        <HexStation {...ST.board} icon={<Icon name="users" size={52} className="x14-ic" />} label="לוח המודעות" sub="Context · הזיכרון המשותף" state={step === 6 ? 'active' : step > 6 ? 'done' : 'idle'} />
        <HexStation {...ST.expert} icon={<Icon name="hook" size={52} className="x14-ic" />} label="המומחים" sub="Hooks · חוכמה לכל נושא" state={step === 8 ? 'active' : step > 8 ? 'done' : 'idle'} />
        <HexStation {...ST.blocks} icon={<Icon name="puzzle" size={52} className="x14-ic" />} label="אבני הבניין" sub="Components · חלקי המסך" state={step > 9 ? 'done' : 'idle'} />
        <HexStation {...ST.page} icon={<Icon name="layout" size={52} className="x14-ic" />} label="העמוד" sub="Pages · Router בוחר מה מציגים" state={step > 9 ? 'done' : 'idle'} />
        <HexStation {...ST.app} logo={reactLogo} label="האפליקציה" sub="React · App — הבית של הכול" state={step === 0 || step === 11 ? 'active' : step > 9 ? 'done' : 'idle'} />
      </div>

      {/* סוגר: כל התחנות = שכבת הקליינט */}
      <LayerBracket x={310} y={365} w={1530} label="שכבת הקליינט — אפליקציית React אחת" />

      {/* שלב 2 — השליח: מה בעצם יש בתשובה שהגיעה מהשרת */}
      <InfoCard x={210} y={450} w={330} title="מה יש בתשובה מהשרת?" show={step === 2} items={[
        'הרשת הזולה ביותר לעגלה שלכם',
        'המחיר הכולל — כולל מבצעים',
        'פירוט מחיר לכל מוצר ברשימה',
      ]} />

      {/* שלב 4 — המזכירה: תרגום מחומר גולמי למידע מוכן */}
      <Callout x={490} y={455} w={340} show={step === 4}>
        <strong>המזכירה</strong> לוקחת את החומר הגולמי ומכינה ממנו מידע קריא: שמות ברורים, מחירים בשקלים, שורות מסודרות. חלקי המסך מקבלים הכול מוכן — ולא יודעים בכלל שיש שרת.
      </Callout>

      {/* שלב 6 — לוח המודעות: לוח לכל נושא, כמו בקוד האמיתי */}
      <InfoCard x={720} y={450} w={350} title="לוח מודעות נפרד לכל נושא" show={step === 6} items={[
        '🛒 עגלת הקניות',
        '💰 מחירים והשוואות',
        '⚙️ העדפות והגדרות תצוגה',
        'בקוד האמיתי: עשרות לוחות עוטפים את האפליקציה',
      ]} />

      {/* שלב 8 — המומחים: מומחה העגלה */}
      <Callout x={950} y={455} w={340} show={step === 8}>
        <strong>מומחה העגלה</strong> יודע לחשב סה״כ, להוסיף מוצר ולהסיר מוצר. כותבים את החוכמה הזו פעם אחת — וכל מסך שצריך עגלה פשוט שואל אותו.
      </Callout>

      {/* שלב 11 — הסיום: טבלת ההשוואה שהמשתמש רואה על המסך */}
      <div className="x14-result">
        <InfoCard x={1490} y={430} w={350} title="העגלה שלי — איפה הכי זול?" show={step === 11} items={[
          <><span>רמי לוי — הכי משתלם</span><b>₪142</b></>,
          <><span>שופרסל</span><b>₪151</b></>,
          <><span>ויקטורי</span><b>₪158</b></>,
        ]} />
      </div>
      <SparkBurst x={1750} y={190} show={step === 11} />
    </ExplainerStage>
  )
}

ClientFlowExplainer.steps = CAPTIONS.length - 1
