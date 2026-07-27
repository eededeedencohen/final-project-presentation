import SlideFrame from "../../components/SlideFrame/SlideFrame.jsx";
import Icon from "../../components/Icon/Icon.jsx";
import chpLogo from "../../assets/brand/chp.png";
import "./styles.css";

/* שקף 05 - מה קיים היום: השוואה ״טיפשה״ מול הגישה של Smart Cart */

const PAINS = [
  { icon: "lock", text: "פורמט מאוד מוגדר ולא גמיש" },
  {
    icon: "clone",
    text: "משווה בין הסופרמרקטים שמכילים בדיוק את אותם המוצרים",
  },
];

const WINS = [
  "טקסט חופשי בשפה טבעית",
  "משלים מוצרים חסרים עם תחליפים דומים",
  "משווה את הסל האמיתי שלך - לא סל תיאורטי",
];

export default function ExistingSlide() {
  return (
    <SlideFrame
      kicker="EXISTING SOLUTIONS"
      title={
        <>
          הפתרונות של היום: השוואה <span className="grad">״טיפשה״</span>
        </>
      }
    >
      <div className="exi-duel">
        {/* עמודה ימנית - הגישה הקיימת (מעומעמת) */}
        <article
          className="card exi-col exi-old fx fx-slide-start"
          style={{ "--d": 350 }}
        >
          <header className="exi-head">
            <div className="exi-logo-card">
              <img src={chpLogo} alt="CHP" />
            </div>
            <div className="exi-head-text">
              <h3>הגישה הקיימת</h3>
              <p className="exi-sub">CHP והשוואתוני מחירים דומים</p>
            </div>
          </header>

          <ul className="exi-list">
            {PAINS.map((p, i) => (
              <li
                key={p.icon}
                className="exi-pain fx fx-fade"
                style={{ "--d": 560 + i * 130 }}
              >
                <span className="exi-pain-chip">
                  <Icon name={p.icon} />
                  <span className="exi-pain-x">
                    <Icon name="x" />
                  </span>
                </span>
                <p>{p.text}</p>
              </li>
            ))}
          </ul>
        </article>

        {/* עמודת אמצע - תג VS */}
        <div className="exi-vs-col fx fx-zoom" style={{ "--d": 820 }}>
          <span className="exi-vs-line exi-vs-line-top" aria-hidden="true" />
          <span className="exi-vs">VS</span>
          <span className="exi-vs-line exi-vs-line-bottom" aria-hidden="true" />
        </div>

        {/* עמודה שמאלית - הגישה של Smart Cart (המנצחת) */}
        <div className="exi-win-wrap fx fx-slide-end" style={{ "--d": 480 }}>
          <article className="card exi-col exi-win">
            <header className="exi-head">
              <div className="icon-chip solid">
                <Icon name="cart-check" />
              </div>
              <div className="exi-head-text">
                <h3>הגישה של Smart Cart</h3>
                <p className="exi-sub">השוואה חכמה שמבינה אותך</p>
              </div>
            </header>

            <ul className="exi-list">
              {WINS.map((w, i) => (
                <li
                  key={w}
                  className="exi-pro fx fx-fade"
                  style={{ "--d": 650 + i * 130 }}
                >
                  <span className="exi-pro-check">
                    <Icon name="check" />
                  </span>
                  <p>{w}</p>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </SlideFrame>
  );
}
