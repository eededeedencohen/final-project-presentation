import CircuitBackground from "../../components/CircuitBackground/CircuitBackground.jsx";
import "./styles.css";

/* קווי החיבור של רשת הנוירונים בתוך סל העגלה */
const NET_EDGES = [
  [172, 78, 200, 66],
  [200, 66, 232, 74],
  [232, 74, 252, 96],
  [172, 78, 194, 100],
  [194, 100, 232, 74],
  [194, 100, 224, 112],
  [224, 112, 252, 96],
  [224, 112, 248, 130],
  [194, 100, 186, 128],
  [186, 128, 224, 112],
  [186, 128, 214, 142],
  [214, 142, 248, 130],
  [172, 78, 186, 128],
  [200, 66, 224, 112],
];

const NET_NODES = [
  [172, 78, 5],
  [200, 66, 6],
  [232, 74, 5],
  [252, 96, 7],
  [194, 100, 8],
  [224, 112, 6],
  [248, 130, 5],
  [186, 128, 6],
  [214, 142, 5],
];

/**
 * שקף פתיחה: הלוגו של Smart Cart משוחזר כ-SVG חי -
 * עגלת קניות שהחצי שלה מתפרק לרשת נוירונים זוהרת.
 */
export default function TitleSlide() {
  return (
    <section className="title-slide" dir="ltr">
      <CircuitBackground tone="dark" />

      <div className="title-emblem fx fx-zoom" style={{ "--d": 100 }}>
        <svg viewBox="0 0 320 240" aria-label="Smart Cart logo">
          {/* שלד העגלה */}
          <g className="ts-cart">
            <path className="ts-stroke" d="M28 40 h26 l10 14" />
            <path
              className="ts-stroke"
              d="M64 54 h196 l-22 96 H86 L64 54 z"
              strokeDasharray="620"
              style={{ "--dash": 620 }}
            />
            {/* רשת הסל - רק בצד שנשאר "פיזי" */}
            <path
              className="ts-grid"
              d="M104 54 l8 96 M144 54 l4 96 M64 86 h96 M72 120 h92"
            />
            {/* רגל + גלגלים */}
            <path className="ts-stroke" d="M86 150 l-8 34 h128" />
            <circle className="ts-wheel" cx="112" cy="200" r="13" />
            <circle className="ts-wheel" cx="216" cy="200" r="13" />
          </g>

          {/* רשת הנוירונים המחליפה את חצי הסל */}
          <g className="ts-net">
            {NET_EDGES.map(([x1, y1, x2, y2], i) => (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                className="ts-edge fx fx-fade"
                style={{ "--d": 700 + i * 60 }}
              />
            ))}
            {NET_NODES.map(([cx, cy, r], i) => (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={r}
                className="ts-node"
                style={{ animationDelay: `${(i % 5) * 0.5}s` }}
              />
            ))}
          </g>
        </svg>
      </div>

      <h1 className="title-name fx fx-rise" style={{ "--d": 350 }}>
        SMART <span>CART</span>
      </h1>

      <p className="title-tag fx fx-fade" style={{ "--d": 650 }}>
        INTELLIGENT RETAIL SOLUTIONS
      </p>

      <div className="title-meta fx fx-rise" style={{ "--d": 900 }}>
        <span className="title-chip">EDEN COHEN</span>
        <span className="title-dot" />
        <span className="title-chip">2026</span>
      </div>
    </section>
  );
}
