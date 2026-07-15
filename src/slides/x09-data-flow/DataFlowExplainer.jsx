import { ExplainerStage, HexStation, Pipe, InfoCard, SparkBurst, Callout } from '../../components/Explainer/Explainer.jsx'
import Icon from '../../components/Icon/Icon.jsx'
import mongodbLogo from '../../assets/tech/mongodb.png'
import mongooseLogo from '../../assets/tech/mongoose.png'
import './styles.css'

/* ============================================================
   שקף 9 — שכבת הנתונים כסיפור אנושי (לקהל לא-טכני):
   המנהל מבקש, בקר האיכות בודק, המתרגם ממיר, המחסן מאתר —
   והתשובה חוזרת. כל לחיצה = שלב, לכל שלב אנימציה משלו.
   ============================================================ */

const CAPTIONS = [
  <>איך המערכת יודעת כמה עולה חלב בכל רשת? <em>בואו נציץ מאחורי הקלעים</em> — צעד אחר צעד.</>,
  <><em>המנהל</em> (Controller) מקבל את המשימה: "תביא לי את כל מחירי החלב, מהזול ליקר" — ושולח בקשה מסודרת.</>,
  <><em>בקר האיכות</em> (Model) עוצר הכול: לכל מוצר חייבים להיות שם, מחיר וברקוד תקינים. מה שלא תקין — לא עובר.</>,
  <><em>המתרגם</em> (Mongoose) ממיר את הבקשה לשפה שהמחסן מבין, ושומר על קו פתוח איתו.</>,
  <><em>המחסן</em> (MongoDB) מחזיק מיליוני מחירים — ובזכות מפתוח חכם מוצא את החלב <em>בשבריר שנייה</em>.</>,
  <>הממצאים חוזרים, וכל פריט מקבל בדרך <em>תעודת תקינות</em> — עכשיו אפשר לסמוך על כל מספר.</>,
  <><em>המנהל</em> מרכיב תשובה אחת ברורה — מוכנה לצאת למסך של המשתמש. <em>מהר יותר מהרף עין</em>.</>,
]

const ST = {
  mongo: { x: 130, y: 150 },
  mongoose: { x: 570, y: 150 },
  model: { x: 1010, y: 150 },
  controller: { x: 1450, y: 150 },
}

const P = {
  reqCtrlToModel: 'M 1445 210 C 1350 160, 1255 160, 1165 210',
  reqModelToMoose: 'M 1005 210 C 910 160, 815 160, 725 210',
  reqMooseToMongo: 'M 565 210 C 470 160, 375 160, 285 210',
  resMongoToMoose: 'M 285 300 C 375 350, 470 350, 565 300',
  resMooseToModel: 'M 725 300 C 815 350, 910 350, 1005 300',
  resModelToCtrl: 'M 1165 300 C 1255 350, 1350 350, 1445 300',
}

export default function DataFlowExplainer({ step = 0 }) {
  return (
    <ExplainerStage kicker="BEHIND THE SCENES · 01" title="מסע של בקשה אחת" step={step} captions={CAPTIONS}>
      <Pipe path={P.reqCtrlToModel} lit={step === 1} done={step > 1} packetLabel="בקשה" />
      <Pipe path={P.reqModelToMoose} lit={step === 2} done={step > 2} packetLabel="בקשה מאושרת" />
      <Pipe path={P.reqMooseToMongo} lit={step === 3} done={step > 3} packetLabel="בשפת המחסן" />
      <Pipe path={P.resMongoToMoose} lit={step === 5} done={step > 5} packetColor="#ffd98a" packetLabel="ממצאים" />
      <Pipe path={P.resMooseToModel} lit={step === 5} done={step > 5} packetColor="#ffd98a" packetLabel="מאומתים" />
      <Pipe path={P.resModelToCtrl} lit={step === 6} done={step > 6} packetColor="#ffd98a" packetLabel="תשובה" />

      <HexStation {...ST.mongo} logo={mongodbLogo} label="המחסן" sub="MongoDB · כל המחירים של כל הרשתות" state={step === 4 ? 'active' : step > 4 ? 'done' : 'idle'} />
      <HexStation {...ST.mongoose} logo={mongooseLogo} label="המתרגם" sub="Mongoose · מדבר בשפת המחסן" state={step === 3 || step === 5 ? 'active' : step > 5 ? 'done' : 'idle'} />
      <HexStation {...ST.model} icon={<Icon name="shield" size={64} className="x09-ic" />} label="בקר האיכות" sub="Model · שום נתון פגום לא עובר" state={step === 2 || step === 5 ? 'active' : step > 5 ? 'done' : 'idle'} />
      <HexStation {...ST.controller} icon={<Icon name="user" size={64} className="x09-ic" />} label="המנהל" sub="Controller · מחליט ומרכיב תשובות" state={step === 1 || step === 6 ? 'active' : step > 6 ? 'done' : 'idle'} />

      {/* שלב 1: פתק הבקשה של המנהל */}
      <InfoCard x={1350} y={385} w={340} title="הבקשה" show={step === 1} items={[
        '🥛 כל מחירי החלב 3%',
        '↕ מסודרים מהזול ליקר',
        '🏪 מכל הרשתות',
      ]} />

      {/* שלב 2: רשימת הבדיקה — וי-ים נחתמים אחד-אחד */}
      <InfoCard x={920} y={385} w={310} title="בדיקת איכות" show={step === 2} checklist items={[
        'יש שם מוצר ברור',
        'המחיר הוא מספר תקין',
        'הברקוד קיים ומזוהה',
        'ידוע לאיזו רשת שייך',
      ]} />

      {/* שלב 3: התרגום */}
      <InfoCard x={470} y={385} w={330} title="תרגום הבקשה" show={step === 3} items={[
        '״כל מחירי החלב״ ⟵ שפת המחסן',
        'המחסן מקבל הוראה מדויקת,',
        'בלי מקום לאי-הבנות.',
      ]} />

      {/* שלב 4: סריקת המדפים */}
      <InfoCard x={40} y={385} w={370} title="איתור במחסן" show={step === 4} scan items={[
        '🔍 מפתוח חכם — בלי לעבור מדף-מדף',
        'חלב 3% טרה · רמי לוי · ₪5.40',
        'חלב 3% תנובה · שופרסל · ₪5.90',
      ]} />

      {/* שלב 5: תעודת תקינות בדרך חזרה */}
      <Callout x={700} y={415} w={310} show={step === 5}>
        כל פריט שחוזר עובר שוב את <strong>בקר האיכות</strong> ומקבל תעודת תקינות — אפשר לסמוך על המספרים.
      </Callout>

      {/* שלב 6: התשובה הסופית + ניצוצות */}
      <div className={`x09-ui ${step === 6 ? 'show' : ''}`} dir="rtl">
        <div className="x09-ui-head">השוואת מחירים — חלב 3%</div>
        <div className="x09-ui-row best"><span>רמי לוי · טרה</span><b>₪5.40</b><i>הכי זול</i></div>
        <div className="x09-ui-row"><span>שופרסל · תנובה</span><b>₪5.90</b></div>
      </div>
      <SparkBurst x={1590} y={430} show={step === 6} />
    </ExplainerStage>
  )
}

DataFlowExplainer.steps = CAPTIONS.length - 1
