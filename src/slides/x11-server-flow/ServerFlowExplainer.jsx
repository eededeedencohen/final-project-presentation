import { ExplainerStage, HexStation, Pipe, InfoCard, SparkBurst, Callout, LayerAnchor, LayerBracket } from '../../components/Explainer/Explainer.jsx'
import Icon from '../../components/Icon/Icon.jsx'
import expressLogo from '../../assets/tech/express.png'
import nodejsLogo from '../../assets/tech/nodejs.png'
import './styles.css'

/* ============================================================
   שקף 11 — שכבת השרת: מרכז התיאום.
   כלל ברזל: כל לחיצה = מעבר אחד בדיוק.
   שלב-קצה = חבילה אחת נוסעת בצינור אחד;
   שלב-תחנה = תחנה אחת נדלקת עם ההסבר שלה.
   גם מסע החזרה מפורק צעד-צעד: כל תחנה נדלקת שוב
   עם הסבר חדש על מה שקורה בה בדרך החוצה.
   ============================================================ */

const CAPTIONS = [
  /* 0 */ <>זו <em>שכבת השרת</em> — מרכז התיאום: משמאל <em>המחסן</em> (שכבת הנתונים) שכבר הכרנו, ומימין <em>המסך</em> של המשתמש. נעקוב אחרי בקשה אחת, צעד-צעד.</>,
  /* 1 */ <>המשתמש לחץ <em>״השוו לי את הסל״</em> — והבקשה יוצאת מהמסך אל השרת.</>,
  /* 2 */ <>ראשון מקבל אותה <em>המנוע</em> (Node.js): הוא שמריץ את השרת כולו, ומסוגל להחזיק <em>אלפי פניות בו-זמנית</em> בלי לעצור לרגע.</>,
  /* 3 */ <>המנוע מעביר את הבקשה אל <em>שומר הסף</em> שעומד בדלת הראשית.</>,
  /* 4 */ <>שומר הסף עורך <em>שלוש בדיקות</em> לפני שהבקשה נכנסת: מאיפה הגעת? נרשמת ביומן? ומה בדיוק ביקשת?</>,
  /* 5 */ <>הבדיקות עברו — הדלת נפתחת, והבקשה ממשיכה אל <em>המוקדן</em>.</>,
  /* 6 */ <>לכל נושא <em>דלפק משלו</em> — ככה שום פנייה לא הולכת לאיבוד. הבקשה שלנו מנותבת ל<em>דלפק ההשוואות</em>.</>,
  /* 7 */ <>מהדלפק — ישר אל <em>המנהל</em>: זה שמקבל כאן את ההחלטות.</>,
  /* 8 */ <>ה<em>מנהל</em> הוא היחיד שחושב כאן — לא שומר נתונים ולא מצייר מסכים, <em>רק מקבל החלטות</em>.</>,
  /* 9 */ <>כדי להשוות, המנהל שולח <em>שאלת מחירים</em> אל המחסן — וזה בדיוק המסע שראינו בשקף הקודם.</>,
  /* 10 */ <>ה<em>ממצאים</em> חוזרים מהמחסן — מחיר לכל פריט, בכל רשת — ונוחתים על שולחנו של המנהל.</>,
  /* 11 */ <>עכשיו המנהל עובד: בונה את <em>טבלת ההשוואה</em> — מסדר את הרשתות מהזולה ליקרה, מסמן את <em>המנצחת</em>, ואורז הכול לתשובה אחת מסודרת.</>,
  /* 12 */ <>ה<em>תשובה המוכנה</em> יוצאת מהמנהל לדרך חזרה — תחנה ראשונה: <em>המוקדן</em>.</>,
  /* 13 */ <>המוקדן זוכר מאיזה דלפק הבקשה יצאה — והדלפק מחזיר את התשובה <em>בדיוק לכתובת שממנה הגיעה הבקשה</em>.</>,
  /* 14 */ <>מהדלפק ממשיכה התשובה אל <em>שומר הסף</em> שבדלת הראשית.</>,
  /* 15 */ <>שומר הסף רושם ביומן ש<em>הטיפול הושלם</em> — והדלת נפתחת החוצה.</>,
  /* 16 */ <>עוד צעד אחד החוצה — התשובה מגיעה אל <em>המנוע</em>.</>,
  /* 17 */ <>המנוע כבר עסוק ב<em>בקשות הבאות</em> — התשובה שלנו רק <em>חולפת דרכו</em> בדרכה החוצה.</>,
  /* 18 */ <>והתשובה עוזבת את השרת — <em>בדרך אל המסך</em> של המשתמש.</>,
  /* 19 */ <><em>מהקליק ועד התשובה — פחות משנייה</em>. ומה המסך עושה עם זה? זה בדיוק השקף הבא.</>,
]

/* תחנות השרת בסצנה (1920x700), משמאל לימין — הגיאומטריה נשמרת */
const ST = {
  manager: { x: 400, y: 130 },
  desk: { x: 740, y: 130 },
  guard: { x: 1080, y: 130 },
  engine: { x: 1420, y: 130 },
}

/* צינורות: קשת עליונה = הבקשה (ימין→שמאל), צעד אחד בכל שלב.
   קשת תחתונה = החזרה (שמאל→ימין), מפורקת לצינור נפרד לכל
   קפיצה — אותם קטעים בדיוק של הנתיב הארוך הישן. */
const P = {
  reqClientToEngine: 'M 1690 190 C 1648 148, 1600 148, 1558 192',
  reqEngineToGuard: 'M 1414 194 C 1360 148, 1265 148, 1216 194',
  reqGuardToDesk: 'M 1074 194 C 1020 148, 925 148, 876 194',
  reqDeskToManager: 'M 734 194 C 680 148, 585 148, 536 194',
  reqManagerToData: 'M 394 194 C 350 150, 272 150, 232 190',
  resDataToManager: 'M 232 262 C 272 320, 350 322, 394 276',
  retManagerToDesk: 'M 536 276 C 585 324, 680 324, 734 276',
  retDeskToGuard: 'M 876 276 C 925 324, 1020 324, 1074 276',
  retGuardToEngine: 'M 1216 276 C 1265 324, 1360 324, 1414 276',
  retEngineToClient: 'M 1558 276 C 1602 326, 1652 316, 1692 262',
}

/* תחנה עם שני ביקורים: פעילה בכל אחד מהם, 'בוצע' בין ואחרי */
const stateOf = (step, firstVisit, secondVisit) =>
  step === firstVisit || step === secondVisit ? 'active' : step > firstVisit ? 'done' : 'idle'

export default function ServerFlowExplainer({ step = 0 }) {
  return (
    <ExplainerStage kicker="BEHIND THE SCENES · 02" title="שכבת השרת — מרכז התיאום" step={step} captions={CAPTIONS}>
      {/* קשת הבקשה — חבילה אחת, צינור אחד, שלב אחד */}
      <Pipe path={P.reqClientToEngine} lit={step === 1} done={step > 1} packetLabel="בקשה" />
      <Pipe path={P.reqEngineToGuard} lit={step === 3} done={step > 3} packetLabel="הבקשה" />
      <Pipe path={P.reqGuardToDesk} lit={step === 5} done={step > 5} packetLabel="אושרה להיכנס" />
      <Pipe path={P.reqDeskToManager} lit={step === 7} done={step > 7} packetLabel="אל דלפק ההשוואות" />
      <Pipe path={P.reqManagerToData} lit={step === 9} done={step > 9} packetLabel="שאלת מחירים" />

      {/* חזרה מהמחסן אל המנהל — חבילת ענבר אחת */}
      <Pipe path={P.resDataToManager} lit={step === 10} done={step > 10} packetColor="#e8a33d" packetLabel="ממצאים" />

      {/* מסע החזרה — קפיצה-קפיצה, בנתיב התחתון */}
      <Pipe path={P.retManagerToDesk} lit={step === 12} done={step > 12} packetColor="#e8a33d" packetLabel="תשובה" />
      <Pipe path={P.retDeskToGuard} lit={step === 14} done={step > 14} packetColor="#e8a33d" packetLabel="התשובה" />
      <Pipe path={P.retGuardToEngine} lit={step === 16} done={step > 16} packetColor="#e8a33d" packetLabel="בדרך החוצה" />
      <Pipe path={P.retEngineToClient} lit={step === 18} done={step > 18} packetColor="#e8a33d" packetLabel="תשובה" />

      {/* עוגני השכבות השכנות */}
      <LayerAnchor x={40} y={110} icon={<Icon name="database" />} label="שכבת הנתונים" sub="המחסן שראינו קודם" lit={step === 0 || step === 9 || step === 10} />
      <LayerAnchor x={1680} y={110} icon={<Icon name="layout" />} label="שכבת הקליינט" sub="המסך של המשתמש" lit={step === 0 || step === 1 || step === 18 || step === 19} />

      {/* תחנות שכבת השרת — כל תחנה נדלקת פעמיים: בדרך פנימה ובדרך החוצה */}
      <HexStation {...ST.manager} size={130} icon={<Icon name="user" size={56} className="x11-ic" />} label="המנהל" sub="Controller · מקבל ההחלטות" state={stateOf(step, 8, 11)} />
      <HexStation {...ST.desk} size={130} icon={<Icon name="route" size={56} className="x11-ic" />} label="המוקדן" sub="Routes · מנתב כל פנייה" state={stateOf(step, 6, 13)} />
      <HexStation {...ST.guard} size={130} logo={expressLogo} label="שומר הסף" sub="Express · הדלת הראשית" state={stateOf(step, 4, 15)} />
      <HexStation {...ST.engine} size={130} logo={nodejsLogo} label="המנוע" sub="Node.js · מריץ את הכול" state={stateOf(step, 2, 17)} />

      {/* סוגר: ארבע התחנות = שכבת השרת */}
      <LayerBracket x={380} y={390} w={1190} label="שכבת השרת" />

      {/* שלב 0: הסבר פתיחה — רכיב ערכה, פינות חדות */}
      <Callout x={660} y={480} w={600} show={step === 0}>
        בקשה נכנסת מימין, עוברת תחנה אחר תחנה, והתשובה חוזרת החוצה באותו מסלול. <strong>כל לחיצה מקדמת צעד אחד.</strong>
      </Callout>

      {/* שלב 2: המנוע */}
      <InfoCard x={1400} y={430} w={370} title="המנוע — Node.js" show={step === 2} items={[
        'מריץ את קוד השרת סביב השעון',
        'מחזיק אלפי פניות בו-זמנית',
        'אף לקוח לא מחכה בתור',
      ]} />

      {/* שלב 4: שומר הסף — שלוש הבדיקות האמיתיות, וי אחרי וי */}
      <InfoCard x={1010} y={430} w={370} title="הבדיקה בכניסה — שלוש חותמות" show={step === 4} checklist items={[
        'הפנייה הגיעה ממקור מוכר (CORS)',
        'נרשמה ביומן הפניות (Morgan)',
        'התוכן נקרא והובן (JSON)',
      ]} />

      {/* שלב 6: המוקדן — כ-20 דלפקים אמיתיים */}
      <InfoCard x={620} y={430} w={400} title="אולם הדלפקים — כ-20 נושאים" show={step === 6} items={[
        'מוצרים · מחירים · עגלות',
        'עוזר קולי · היסטוריה · סופרמרקטים',
        'מוצרים חלופיים · AI · סורק מחירונים',
        'הבקשה שלנו ← דלפק ההשוואות',
      ]} />

      {/* שלב 8: המנהל — הלב. מה הוא באמת עושה, שלב אחר שלב */}
      <InfoCard x={300} y={425} w={440} title="מה המנהל באמת עושה?" show={step === 8} checklist items={[
        'מקבל את רשימת הקניות — ברקוד וכמות לכל פריט',
        'מזמין מהמחסן את המחירים של כל פריט בכל רשת',
        'מחשב לכל רשת את עלות הסל המלא — כולל מבצעים',
        'בוחר את הזולה ומרכיב תשובה אחת מסודרת',
      ]} />

      {/* שלב 11: המנהל שוב — הממצאים הפכו לטבלת השוואה */}
      <InfoCard x={300} y={430} w={440} title="טבלת ההשוואה נבנית" show={step === 11} checklist items={[
        'מסדר את הרשתות — מהזולה ליקרה',
        'מסמן את הרשת המנצחת 🏆',
        'אורז הכול לתשובה אחת מסודרת',
      ]} />

      {/* שלב 19: סיום — התוצאה ליד המסך + ניצוצות */}
      <InfoCard x={1520} y={420} w={340} title="מה חזר למסך?" show={step === 19} items={[
        '🏆 רמי לוי · ₪142 — הסל הזול ביותר',
        'שופרסל · ₪151',
        'ויקטורי · ₪159',
      ]} />
      <SparkBurst x={1775} y={185} show={step === 19} />
    </ExplainerStage>
  )
}

ServerFlowExplainer.steps = CAPTIONS.length - 1
