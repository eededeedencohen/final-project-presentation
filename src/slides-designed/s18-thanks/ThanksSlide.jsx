import CircuitBackground from "../../components/CircuitBackground/CircuitBackground.jsx";
import Icon from "../../components/Icon/Icon.jsx";
import "./styles.css";

/* נקודות זוהר מרחפות ברקע - מיקום, גודל וקצב שונים לכל אחת */
const DOTS = [
  { top: "14%", left: "12%", s: 7, pd: "2.6s", fd: "5.4s", dl: "0s" },
  { top: "26%", left: "22%", s: 4, pd: "3.4s", fd: "6.8s", dl: "0.7s" },
  { top: "68%", left: "9%", s: 6, pd: "2.9s", fd: "5.9s", dl: "1.2s" },
  { top: "80%", left: "24%", s: 5, pd: "3.8s", fd: "7.2s", dl: "0.3s" },
  { top: "46%", left: "16%", s: 3, pd: "3.1s", fd: "6.2s", dl: "1.8s" },
  { top: "12%", left: "84%", s: 6, pd: "2.7s", fd: "5.6s", dl: "0.9s" },
  { top: "30%", left: "90%", s: 4, pd: "3.6s", fd: "6.6s", dl: "1.5s" },
  { top: "62%", left: "86%", s: 7, pd: "3s", fd: "5.2s", dl: "0.5s" },
  { top: "82%", left: "76%", s: 5, pd: "3.3s", fd: "7s", dl: "1.1s" },
  { top: "48%", left: "93%", s: 3, pd: "2.8s", fd: "6.4s", dl: "2s" },
  { top: "8%", left: "58%", s: 4, pd: "3.5s", fd: "6s", dl: "1.4s" },
];

/**
 * שקף סיום: תודה + שאלות - כהה, ממורכז, זוהר.
 */
export default function ThanksSlide() {
  return (
    <section className="thx-slide" dir="rtl">
      <CircuitBackground tone="dark" />

      <div
        className="thx-dots fx fx-fade"
        style={{ "--d": 500 }}
        aria-hidden="true"
      >
        {DOTS.map((d, i) => (
          <span
            key={i}
            className="thx-dot"
            style={{
              top: d.top,
              left: d.left,
              "--s": `${d.s}px`,
              "--pd": d.pd,
              "--fd": d.fd,
              "--dl": d.dl,
            }}
          />
        ))}
      </div>

      <div className="thx-content">
        <div className="fx fx-zoom" style={{ "--d": 100 }}>
          <div className="thx-icon">
            <Icon name="cart" />
          </div>
        </div>

        <h1 className="thx-title fx fx-rise" style={{ "--d": 320 }} dir="rtl">
          תודה!
        </h1>

        <p className="thx-sub fx fx-rise" style={{ "--d": 560 }}>
          שאלות?
        </p>

        <div className="thx-line fx fx-zoom" style={{ "--d": 740 }} />

        <div className="thx-chips fx fx-rise" style={{ "--d": 900 }} dir="ltr">
          <span className="thx-chip">EDEN COHEN</span>
          <span className="thx-chip-dot" />
          <span className="thx-chip">SMART CART · FEB 2026</span>
        </div>
      </div>
    </section>
  );
}
