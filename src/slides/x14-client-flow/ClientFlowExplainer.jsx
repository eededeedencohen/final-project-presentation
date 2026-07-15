import { ExplainerStage, HexStation, Pipe, InfoCard, SparkBurst, Callout } from '../../components/Explainer/Explainer.jsx'
import Icon from '../../components/Icon/Icon.jsx'
import axiosLogo from '../../assets/tech/axios.png'
import './styles.css'

/* ============================================================
   שקף 14 — מה קורה על המסך (לקהל לא-טכני):
   מימין "המסך" — האפליקציה, לוח המודעות ושתי קומפוננטות;
   משמאל צוות העובדים — המומחה, המזכירה והשליח.
   עוקבים אחרי הקלדה אחת של ״חלב״ עד שהטבלה מתעדכנת,
   בלי לרענן את הדף. כל לחיצה = שלב עם אנימציה משלו.
   ============================================================ */

const CAPTIONS = [
  <>המשתמש מקליד <em>״חלב״</em> בתיבת החיפוש. בואו נראה איך המסך מתעדכן — <em>בלי לרענן את הדף</em> אפילו פעם אחת.</>,
  <><em>תיבת החיפוש</em> לא מכירה שרתים ולא מחירים. כל מה שהיא עושה: מוסרת את הבקשה <em>למומחה</em> — וחוזרת לעבודתה.</>,
  <><em>המומחה</em> (Hooks) זוכר בדיוק מה קורה על המסך ויודע למי לפנות — מהרגע הזה <em>הבקשה בידיים טובות</em>.</>,
  <><em>המזכירה</em> (Service) מנסחת פנייה רשמית אחת וברורה, ו<em>השליח</em> (Axios) יוצא איתה לדרך — אל השרת שמחוץ למסך.</>,
  <>השליח חזר עם <em>תשובה</em>! המומחה מעדכן את הזיכרון — ועכשיו יש למסך <em>חדשות טריות</em> לספר.</>,
  <><em>לוח המודעות</em> (Context) משדר את החדשות לכל מי שמנוי עליו — כולם מקבלים את אותו עדכון, <em>בלי טלפון שבור</em>.</>,
  <>והקסם: המסך מצייר מחדש <em>רק את מה שהשתנה</em> — טבלת ההשוואה בלבד. לכן הכול מרגיש <em>מהיר וחלק</em>.</>,
]

/* תחנות: המסך מימין, צוות העובדים משמאל (סצנה 1920x700) */
const ST = {
  app: { x: 1393, y: 20, size: 110 },
  board: { x: 1373, y: 195, size: 150 },
  search: { x: 1180, y: 400, size: 110 },
  compare: { x: 1590, y: 400, size: 110 },
  expert: { x: 880, y: 150, size: 150 },
  secretary: { x: 560, y: 150, size: 150 },
  messenger: { x: 240, y: 150, size: 150 },
}

/* צינורות: בקשות בקשת העליונה (אקווה), תשובות בתחתונה (ענבר) */
const P = {
  searchToExpert: 'M 1180 450 C 1110 420, 1070 350, 1020 295',
  expertToSec: 'M 875 210 C 800 160, 715 160, 640 210',
  secToMessenger: 'M 555 210 C 500 160, 445 160, 395 210',
  messengerOut: 'M 235 210 C 150 210, 60 210, -40 210',
  backToMessenger: 'M -40 270 C 60 270, 150 270, 235 270',
  messengerToSec: 'M 395 300 C 445 350, 500 350, 555 300',
  secToExpert: 'M 640 300 C 715 350, 800 350, 875 300',
  expertToBoard: 'M 1010 175 C 1140 60, 1310 85, 1395 245',
  boardToSearch: 'M 1420 350 C 1380 400, 1310 395, 1245 405',
  boardToCompare: 'M 1476 350 C 1516 400, 1586 395, 1651 405',
}

/* קווי מבנה סטטיים של המסך: האפליקציה → הלוח → שתי הקומפוננטות */
const TREE_LINES = ['M 1448 138 L 1448 193', P.boardToSearch, P.boardToCompare]

export default function ClientFlowExplainer({ step = 0 }) {
  return (
    <ExplainerStage kicker="BEHIND THE SCENES · 03" title="מה קורה על המסך" step={step} captions={CAPTIONS}>
      {/* שלד המסך — קווים סטטיים עדינים */}
      <svg className="x14-treelines" viewBox="0 0 1920 700" preserveAspectRatio="none" aria-hidden="true">
        {TREE_LINES.map((d, i) => <path key={i} d={d} />)}
      </svg>

      {/* מסלול הבקשה (אקווה) */}
      <Pipe path={P.searchToExpert} lit={step === 2} done={step > 2} packetLabel="הבקשה" />
      <Pipe path={P.expertToSec} lit={step === 3} done={step > 3} />
      <Pipe path={P.secToMessenger} lit={step === 3} done={step > 3} />
      <Pipe path={P.messengerOut} lit={step === 3} done={step > 3} packetLabel="בקשה" />

      {/* מסלול התשובה (ענבר) + השידור מהלוח */}
      <Pipe path={P.backToMessenger} lit={step === 4} done={step > 4} packetColor="#ffd98a" packetLabel="תשובה" />
      <Pipe path={P.messengerToSec} lit={step === 4} done={step > 4} packetColor="#ffd98a" />
      <Pipe path={P.secToExpert} lit={step === 4} done={step > 4} packetColor="#ffd98a" />
      <Pipe path={P.expertToBoard} lit={step === 5} done={step > 5} packetColor="#ffd98a" packetLabel="עדכון" />
      <Pipe path={P.boardToSearch} lit={step === 5} done={step > 5} packetColor="#ffd98a" />
      <Pipe path={P.boardToCompare} lit={step === 5} done={step > 5} packetColor="#ffd98a" />

      {/* שלט קטן: הדרך אל השרת, מחוץ למסך */}
      <div className="x14-offstage" dir="rtl">⇄ אל השרת ובחזרה</div>

      {/* צוות העובדים (שמאל) */}
      <HexStation {...ST.expert} icon={<Icon name="hook" size={64} className="x14-ic" />} label="המומחה" sub="Hooks · יודע בדיוק מה לעשות"
        state={step === 2 || step === 4 ? 'active' : step > 4 ? 'done' : 'idle'} />
      <HexStation {...ST.secretary} icon={<Icon name="page" size={64} className="x14-ic" />} label="המזכירה" sub="Service · מנסחת פניות החוצה"
        state={step === 3 ? 'active' : step > 3 ? 'done' : 'idle'} />
      <HexStation {...ST.messenger} logo={axiosLogo} label="השליח" sub="Axios · רץ אל השרת ובחזרה"
        state={step === 3 || step === 4 ? 'active' : step > 4 ? 'done' : 'idle'} />

      {/* המסך (ימין): לוח המודעות במרכז העץ */}
      <HexStation {...ST.board} icon={<Icon name="users" size={64} className="x14-ic" />} label="לוח המודעות" sub="Context · משדר לכל מי שמנוי"
        state={step === 5 ? 'active' : step > 5 ? 'done' : 'idle'} />
      <div className="x14-tree">
        <HexStation {...ST.app} icon={<Icon name="layout" size={44} className="x14-ic-sm" />} label="האפליקציה" sub="App"
          state={step === 0 ? 'active' : 'done'} />
        <HexStation {...ST.search} icon={<Icon name="puzzle" size={44} className="x14-ic-sm" />} label="תיבת החיפוש" sub="Component"
          state={step === 1 ? 'active' : step > 1 ? 'done' : 'idle'} />
        <HexStation {...ST.compare} icon={<Icon name="puzzle" size={44} className="x14-ic-sm" />} label="טבלת ההשוואה" sub="Component"
          state={step === 6 ? 'active' : step >= 5 ? 'done' : 'idle'} />
      </div>

      {/* טבעות שידור סביב לוח המודעות (שלב 5) */}
      {step === 5 && (
        <>
          <div className="x14-ring" />
          <div className="x14-ring x14-ring2" />
        </>
      )}

      {/* שלבים 0–1: המשתמש מקליד ״חלב״ — תיבה חיה עם סמן מהבהב */}
      <div className={`x14-input ${step <= 1 ? 'show' : ''}`} dir="rtl">
        <Icon name="search" size={20} className="x14-input-ic" />
        <span className="x14-ch" style={{ '--i': 0 }}>ח</span>
        <span className="x14-ch" style={{ '--i': 1 }}>ל</span>
        <span className="x14-ch" style={{ '--i': 2 }}>ב</span>
        <span className="x14-caret" />
      </div>

      {/* שלב 1: התיבה רק מוסרת הלאה */}
      <Callout x={880} y={455} w={300} show={step === 1} arrow="up">
        תיבת החיפוש <strong>לא יודעת כלום על שרתים</strong> — היא רק מוסרת את הבקשה הלאה, למומחה.
      </Callout>

      {/* שלב 2: המומחה — רשימה שנחתמת בוי אחד-אחד */}
      <InfoCard x={770} y={385} w={330} title="המומחה זוכר" show={step === 2} checklist items={[
        'מה המשתמש חיפש הרגע',
        'מה כבר מוצג על המסך',
        'למי מעבירים את הבקשה',
      ]} />

      {/* שלב 3: המזכירה מנסחת מכתב — קרן סריקה עוברת עליו */}
      <InfoCard x={430} y={385} w={350} title="הפנייה הרשמית" show={step === 3} scan items={[
        '📄 נושא: מחירי חלב מכל הרשתות',
        '🏷️ נמען: השרת של המערכת',
        '✍️ חתימה: האפליקציה',
      ]} />

      {/* שלב 4: המומחה מעדכן את הזיכרון */}
      <InfoCard x={770} y={385} w={340} title="עדכון הזיכרון" show={step === 4} items={[
        '📬 הגיעה תשובה עם כל המחירים',
        '🧠 המומחה מחליף ישן בחדש',
        '📣 ומכריז: יש חדשות למסך!',
      ]} />

      {/* שלב 6: רק טבלת ההשוואה מצוירת מחדש */}
      <div className={`x14-ui ${step === 6 ? 'show' : ''}`} dir="rtl">
        <div className="x14-ui-head">טבלת ההשוואה — ״חלב״</div>
        <div className="x14-ui-row best" style={{ '--i': 0 }}><span>רמי לוי · טרה</span><b>₪5.40</b><i>הכי זול</i></div>
        <div className="x14-ui-row" style={{ '--i': 1 }}><span>שופרסל · תנובה</span><b>₪5.90</b></div>
      </div>
      <SparkBurst x={1720} y={215} show={step === 6} />
      <Callout x={1565} y={315} w={310} show={step === 6} arrow="up">
        המסך מצייר מחדש <strong>רק את מה שהשתנה</strong> — לא את כל הדף. לכן זה מהיר.
      </Callout>
    </ExplainerStage>
  )
}

ClientFlowExplainer.steps = CAPTIONS.length - 1
