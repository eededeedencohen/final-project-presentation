import { ExplainerStage, HexStation, Pipe, InfoCard, SparkBurst, Callout, LayerAnchor, LayerBracket } from '../../components/Explainer/Explainer.jsx'
import Icon from '../../components/Icon/Icon.jsx'
import mongodbLogo from '../../assets/tech/mongodb.png'
import mongooseLogo from '../../assets/tech/mongoose.png'
import './styles.css'

/* ============================================================
   שקף 9 — שכבת הנתונים: בקשה נכנסת משכבת השרת (עוגן כללי
   מימין, בלי לפרט אותה), עוברת את בקר האיכות, מתורגמת,
   מאותרת במחסן — וחוזרת לשרת. כל לחיצה = שלב.
   ============================================================ */

const CAPTIONS = [
  <>זו <em>שכבת הנתונים</em> — הספרייה של Smart Cart. מימין: שכבת השרת, שממנה מגיעות הבקשות. איך זה עובד?</>,
  <>משכבת השרת נכנסת בקשה: <em>״כל מחירי החלב, מהזול ליקר״</em>. עוד לא משנה מה קורה בשרת — נגיע לזה בהמשך.</>,
  <>ראשון מקבל אותה <em>בקר האיכות</em> (Model): לכל מוצר חייבים שם, מחיר וברקוד תקינים. מה שלא תקין — לא עובר.</>,
  <><em>המתרגם</em> (Mongoose) ממיר את הבקשה לשפה שהמחסן מבין, ושומר על קו פתוח איתו.</>,
  <><em>המחסן</em> (MongoDB) מחזיק מיליוני מחירים — ובזכות מפתוח חכם מוצא את החלב <em>בשבריר שנייה</em>.</>,
  <>הממצאים חוזרים, וכל פריט מקבל בדרך <em>תעודת תקינות</em> מבקר האיכות — אפשר לסמוך על כל מספר.</>,
  <>התשובה יוצאת חזרה אל <em>שכבת השרת</em>. מה קורה איתה שם? <em>זה בדיוק השקף הבא</em>.</>,
]

const ST = {
  mongo: { x: 140, y: 130 },
  mongoose: { x: 560, y: 130 },
  model: { x: 980, y: 130 },
}

const P = {
  reqServerToModel: 'M 1590 200 C 1470 150, 1290 150, 1140 195',
  reqModelToMoose: 'M 975 195 C 880 145, 760 145, 715 195',
  reqMooseToMongo: 'M 555 195 C 460 145, 340 145, 295 195',
  resMongoToMoose: 'M 295 280 C 340 330, 460 330, 555 280',
  resMooseToModel: 'M 715 280 C 760 330, 880 330, 975 280',
  resModelToServer: 'M 1140 285 C 1290 335, 1470 320, 1600 250',
}

export default function DataFlowExplainer({ step = 0 }) {
  return (
    <ExplainerStage kicker="BEHIND THE SCENES · 01" title="שכבת הנתונים — הספרייה של המערכת" step={step} captions={CAPTIONS}>
      <Pipe path={P.reqServerToModel} lit={step === 1} done={step > 1} packetLabel="בקשה" />
      <Pipe path={P.reqModelToMoose} lit={step === 2} done={step > 2} packetLabel="בקשה מאושרת" />
      <Pipe path={P.reqMooseToMongo} lit={step === 3} done={step > 3} packetLabel="בשפת המחסן" />
      <Pipe path={P.resMongoToMoose} lit={step === 5} done={step > 5} packetColor="#e8a33d" packetLabel="ממצאים" />
      <Pipe path={P.resMooseToModel} lit={step === 5} done={step > 5} packetColor="#e8a33d" packetLabel="מאומתים" delay={1500} />
      <Pipe path={P.resModelToServer} lit={step === 6} done={step > 6} packetColor="#e8a33d" packetLabel="תשובה" />

      {/* עוגן שכבת השרת — כללי, בלי פירוט */}
      <LayerAnchor x={1610} y={110} icon={<Icon name="server" />} label="שכבת השרת" sub="משם מגיעות הבקשות" lit={step === 1 || step >= 6} />

      {/* תחנות שכבת הנתונים */}
      <HexStation {...ST.mongo} logo={mongodbLogo} label="המחסן" sub="MongoDB · כל המחירים של כל הרשתות" state={step === 4 ? 'active' : step > 4 ? 'done' : 'idle'} />
      <HexStation {...ST.mongoose} logo={mongooseLogo} label="המתרגם" sub="Mongoose · מדבר בשפת המחסן" state={step === 3 || step === 5 ? 'active' : step > 5 ? 'done' : 'idle'} />
      <HexStation {...ST.model} icon={<Icon name="shield" size={64} className="x09-ic" />} label="בקר האיכות" sub="Model · שום נתון פגום לא עובר" state={step === 2 || step === 5 ? 'active' : step > 5 ? 'done' : 'idle'} />

      {/* סוגר: שלוש התחנות = שכבת הנתונים */}
      <LayerBracket x={110} y={430} w={1050} label="שכבת הנתונים" />

      {/* שלב 1: מה יש בבקשה */}
      <InfoCard x={1290} y={385} w={300} title="הבקשה שנכנסה" show={step === 1} items={[
        '🥛 כל מחירי החלב 3%',
        '↕ מסודרים מהזול ליקר',
        '🏪 מכל הרשתות',
      ]} />

      {/* שלב 2: בדיקת האיכות */}
      <InfoCard x={900} y={490} w={310} title="בדיקת איכות" show={step === 2} checklist items={[
        'יש שם מוצר ברור',
        'המחיר הוא מספר תקין',
        'הברקוד קיים ומזוהה',
        'ידוע לאיזו רשת שייך',
      ]} />

      {/* שלב 3: התרגום */}
      <InfoCard x={460} y={490} w={330} title="תרגום הבקשה" show={step === 3} items={[
        '״כל מחירי החלב״ ⟵ שפת המחסן',
        'הוראה מדויקת, בלי אי-הבנות.',
      ]} />

      {/* שלב 4: איתור במחסן */}
      <InfoCard x={40} y={490} w={370} title="איתור במחסן" show={step === 4} scan items={[
        '🔍 מפתוח חכם — בלי לעבור מדף-מדף',
        'חלב 3% טרה · רמי לוי · ₪5.40',
        'חלב 3% תנובה · שופרסל · ₪5.90',
      ]} />

      {/* שלב 5: תעודת תקינות */}
      <Callout x={680} y={400} w={310} show={step === 5}>
        כל פריט שחוזר עובר שוב את <strong>בקר האיכות</strong> ומקבל תעודת תקינות.
      </Callout>

      {/* שלב 6: התשובה יוצאת לשרת */}
      <SparkBurst x={1700} y={190} show={step === 6} />
      <Callout x={1330} y={400} w={300} show={step === 6}>
        תשובה מסודרת ומאומתת יוצאת מהשכבה — <strong>המשך המסע בשקף הבא</strong>.
      </Callout>
    </ExplainerStage>
  )
}

DataFlowExplainer.steps = CAPTIONS.length - 1
