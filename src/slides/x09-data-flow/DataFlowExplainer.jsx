import { ExplainerStage, HexStation, Pipe, InfoCard, Callout, LayerAnchor, LayerBracket } from '../../components/Explainer/Explainer.jsx'
import Icon from '../../components/Icon/Icon.jsx'
import mongodbLogo from '../../assets/tech/mongodb.png'
import mongooseLogo from '../../assets/tech/mongoose.png'
import './styles.css'

/* ============================================================
   שקף 9 — שכבת הנתונים: בקשה נכנסת משכבת השרת (עוגן כללי
   מימין), עוברת את בקר האיכות, מתורגמת, מאותרת במחסן —
   וחוזרת לשרת. כל לחיצה = מעבר אחד בדיוק:
   או חבילה אחת על צינור אחד, או תחנה אחת שנדלקת עם הסבר.
   ============================================================ */

const CAPTIONS = [
  /* 0 — פתיחה */
  <>זו <em>שכבת הנתונים</em> — המחסן והספרייה של Smart Cart. מימין: שכבת השרת, שממנה מגיעות הבקשות. נלווה בקשה אחת מההתחלה ועד הסוף.</>,
  /* 1 — מעבר: שרת ← בקר האיכות */
  <>משכבת השרת נכנסת <em>בקשה</em>: ״כל מחירי החלב, מהזול ליקר״. תחנה ראשונה בדרכה — בקר האיכות.</>,
  /* 2 — הסבר: בקר האיכות */
  <><em>בקר האיכות</em> (Model) הוא ספר חוקים שכתוב בקוד — כל נתון נמדד מולו, ומה שלא עומד בחוקים <em>נדחה על הסף</em>.</>,
  /* 3 — מעבר: בקר האיכות ← המתרגם */
  <>הבקשה עמדה בכל החוקים, וממשיכה <em>מאושרת</em> אל התחנה הבאה — המתרגם.</>,
  /* 4 — הסבר: המתרגם */
  <><em>המתרגם</em> (Mongoose) הופך בקשה בשפה שלנו ל<em>הוראה מדויקת בשפת המחסן</em> — בלי מקום לאי-הבנות.</>,
  /* 5 — מעבר: המתרגם ← המחסן */
  <>ההוראה המתורגמת יוצאת לדרך — היישר אל <em>המחסן</em> עצמו.</>,
  /* 6 — הסבר: המחסן */
  <><em>המחסן</em> (MongoDB) מחזיק מיליוני מחירים — ובזכות מפתוח חכם, כמו מדפים ממוספרים, הוא שולף את החלב <em>בשבריר שנייה</em>.</>,
  /* 7 — מעבר חזרה: המחסן ← המתרגם */
  <><em>הממצאים</em> יוצאים מהמחסן לדרך חזרה. תחנה ראשונה — המתרגם, שמחזיר אותם לשפה שלנו.</>,
  /* 8 — מעבר חזרה: המתרגם ← בקר האיכות */
  <>בדרך חזרה כל פריט <em>נבדק שוב</em> אצל בקר האיכות ומקבל <em>תעודת תקינות</em> — אפשר לסמוך על כל מספר.</>,
  /* 9 — מעבר: בקר האיכות ← שכבת השרת */
  <><em>התשובה</em> המסודרת יוצאת חזרה אל שכבת השרת. מה קורה איתה שם? <em>זה בדיוק השקף הבא</em>.</>,
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
      {/* צינורות — כל שלב מעבר מדליק צינור אחד וחבילה אחת בלבד */}
      <Pipe path={P.reqServerToModel} lit={step === 1} done={step > 1} packetLabel="בקשה" />
      <Pipe path={P.reqModelToMoose} lit={step === 3} done={step > 3} packetLabel="בקשה מאושרת" />
      <Pipe path={P.reqMooseToMongo} lit={step === 5} done={step > 5} packetLabel="בשפת המחסן" />
      <Pipe path={P.resMongoToMoose} lit={step === 7} done={step > 7} packetColor="#e8a33d" packetLabel="ממצאים" />
      <Pipe path={P.resMooseToModel} lit={step === 8} done={step > 8} packetColor="#e8a33d" packetLabel="מאומתים" />
      <Pipe path={P.resModelToServer} lit={step === 9} done={step > 9} packetColor="#e8a33d" packetLabel="תשובה" />

      {/* עוגן שכבת השרת — כללי, בלי פירוט */}
      <LayerAnchor x={1610} y={110} icon={<Icon name="server" />} label="שכבת השרת" sub="משם מגיעות הבקשות" lit={step === 1 || step === 9} />

      {/* תחנות שכבת הנתונים — כל תחנה נדלקת בשלב ההסבר שלה בלבד */}
      <HexStation {...ST.mongo} logo={mongodbLogo} label="המחסן" sub="MongoDB · כל המחירים של כל הרשתות" state={step === 6 ? 'active' : step > 6 ? 'done' : 'idle'} />
      <HexStation {...ST.mongoose} logo={mongooseLogo} label="המתרגם" sub="Mongoose · מדבר בשפת המחסן" state={step === 4 ? 'active' : step > 4 ? 'done' : 'idle'} />
      <HexStation {...ST.model} icon={<Icon name="shield" size={64} className="x09-ic" />} label="בקר האיכות" sub="Model · שום נתון פגום לא עובר" state={step === 2 ? 'active' : step > 2 ? 'done' : 'idle'} />

      {/* סוגר: שלוש התחנות = שכבת הנתונים */}
      <LayerBracket x={110} y={430} w={1050} label="שכבת הנתונים" />

      {/* שלב 2: ספר החוקים האמיתי של בקר האיכות (חוקי הסכימה) */}
      <InfoCard x={880} y={480} w={370} title="ספר החוקים של המוצר" show={step === 2} checklist items={[
        'שם מוצר חובה — בין 2 ל-100 תווים',
        'ברקוד חובה — ואין שניים כמוהו במערכת',
        'יחידת מידה מוכרת בלבד: גרם / ק״ג / מ״ל / ליטר / יחידה',
        'קטגוריה + ״שם כללי״ — כך נמצא תחליף (שמן זית מחליף שמן זית)',
      ]} />

      {/* שלב 4: שולחן התרגום */}
      <InfoCard x={470} y={490} w={350} title="שולחן התרגום" show={step === 4} items={[
        '״כל מחירי החלב 3%״ — בקשה בשפה שלנו',
        '⟵ הוראה מדויקת בשפת המחסן, צעד-צעד',
      ]} />

      {/* שלב 6: איתור במחסן — עם שורות מחירים אמיתיות */}
      <InfoCard x={40} y={490} w={370} title="איתור במחסן" show={step === 6} scan items={[
        '🔍 מפתוח חכם — בלי לעבור מדף-מדף',
        'חלב 3% טרה · רמי לוי · ₪5.40',
        'חלב 3% תנובה · שופרסל · ₪5.90',
      ]} />

      {/* שלב 8: תג שמסביר את המעבר עצמו — תעודת התקינות בדרך חזרה */}
      <Callout x={680} y={400} w={320} show={step === 8}>
        בדרך חזרה כל פריט עובר שוב את <strong>בקר האיכות</strong> ומקבל <strong>תעודת תקינות</strong>.
      </Callout>
    </ExplainerStage>
  )
}

DataFlowExplainer.steps = CAPTIONS.length - 1
