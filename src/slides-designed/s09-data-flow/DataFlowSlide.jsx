import { Fragment } from "react";
import SlideFrame from "../../components/SlideFrame/SlideFrame.jsx";
import Icon from "../../components/Icon/Icon.jsx";
import mongodbLogo from "../../assets/tech/mongodb.png";
import mongooseLogo from "../../assets/tech/mongoose.png";
import "./styles.css";

/* תחנות הצינור - משמאל לימין: מהאחסון ועד למסך */
const STATIONS = [
  {
    num: "01",
    name: "MongoDB",
    logo: mongodbLogo,
    desc: (
      <>
        מסד נתונים מבוסס מסמכים <span dir="ltr">(NoSQL)</span>
      </>
    ),
  },
  {
    num: "02",
    name: "Mongoose",
    logo: mongooseLogo,
    desc: (
      <>
        שכבת <span dir="ltr">ODM</span> מבוססת סכמות
      </>
    ),
  },
  {
    num: "03",
    name: "Controller",
    icon: "gear",
    desc: "מנתב בקשות ומרכז את הלוגיקה העסקית",
  },
  {
    num: "04",
    name: "Modal",
    icon: "window",
    desc: "חלון אינטראקטיבי שמציג את המידע למשתמש",
  },
];

/* תוויות זעירות על המחברים שבין התחנות */
const CONNECTORS = ["schema", "query", "JSON"];

export default function DataFlowSlide() {
  return (
    <SlideFrame
      dark
      center
      dir="ltr"
      kicker="ARCHITECTURE · 01 - DATA"
      title={
        <span className="dflow-title">
          Data <span className="grad">Flow</span>
        </span>
      }
    >
      <div className="dflow-wrap">
        <div className="dflow-pipeline">
          {STATIONS.map((s, i) => (
            <Fragment key={s.name}>
              {i > 0 && (
                <div
                  className="dflow-connector fx fx-fade"
                  style={{
                    "--d": 820 + (i - 1) * 110,
                    "--pd": `${(i - 1) * 0.75}s`,
                  }}
                  aria-hidden="true"
                >
                  <span className="dflow-conn-label">{CONNECTORS[i - 1]}</span>
                  <div className="dflow-conn-track">
                    <span className="dflow-conn-dot" />
                  </div>
                </div>
              )}

              <article
                className="dflow-station fx fx-rise"
                style={{ "--d": 320 + i * 120 }}
              >
                <span className="dflow-ghost" aria-hidden="true">
                  {s.num}
                </span>
                <div
                  className={`dflow-chip ${s.logo ? "dflow-chip-light" : "dflow-chip-glow"}`}
                >
                  {s.logo ? (
                    <img src={s.logo} alt={s.name} />
                  ) : (
                    <Icon name={s.icon} />
                  )}
                </div>
                <h3 className="dflow-name">{s.name}</h3>
                <p className="dflow-desc" dir="rtl">
                  {s.desc}
                </p>
              </article>
            </Fragment>
          ))}
        </div>

        <div
          className="dflow-note fx fx-rise"
          style={{ "--d": 1180 }}
          dir="rtl"
        >
          <Icon name="data-collect" />
          <p>
            מסלול אחד עקבי לכל בקשה -{" "}
            <strong>מהמסמך במסד הנתונים ועד לחלון שמוצג למשתמש</strong>.
          </p>
        </div>
      </div>
    </SlideFrame>
  );
}
