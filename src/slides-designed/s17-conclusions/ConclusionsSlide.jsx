import SlideFrame from "../../components/SlideFrame/SlideFrame.jsx";
import Icon from "../../components/Icon/Icon.jsx";
import "./styles.css";

const TAKEAWAYS = [
  {
    icon: "target",
    title: "השוואה אוטומטית מותאמת אישית",
    text: "המערכת משווה עבורך את הסל האמיתי שלך - לא סל גנרי.",
  },
  {
    icon: "database",
    title: "מאגר מחירים בזמן-אמת",
    text: "עדכון שוטף מכל הרשתות, מרוכז במקום אחד.",
  },
  {
    icon: "puzzle",
    title: "מודולריות גמישה",
    text: "ארכיטקטורה שמאפשרת להוסיף יכולות חדשות במהירות.",
  },
  {
    icon: "shield",
    title: "שובר פרמיית מותג, מחזק קונים",
    text: "שקיפות מלאה שמחזירה את הכוח לצרכן.",
  },
];

export default function ConclusionsSlide() {
  return (
    <SlideFrame
      dark
      kicker="CONCLUSIONS"
      title={
        <>
          מה <span className="grad">למדנו</span>
        </>
      }
    >
      <div className="conc-rule fx fx-slide-start" style={{ "--d": 260 }} />

      <div className="conc-grid">
        {TAKEAWAYS.map((t, i) => (
          <article
            key={t.icon}
            className="conc-card fx fx-rise"
            style={{ "--d": 380 + i * 160 }}
          >
            <span className="conc-num" aria-hidden="true">
              {i + 1}
            </span>
            <div className="conc-chip">
              <Icon name={t.icon} />
            </div>
            <div className="conc-copy">
              <h3>{t.title}</h3>
              <p>{t.text}</p>
            </div>
          </article>
        ))}
      </div>
    </SlideFrame>
  );
}
