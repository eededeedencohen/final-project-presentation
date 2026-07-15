import './styles.css'

/* מסילות מעגל חשמלי פרושות על במה של 1280x720 — בהשראת לוגו Smart Cart */
const TRACES = [
  'M -20 96 H 210 L 268 154 H 420',
  'M -20 620 H 150 L 214 556 H 340 L 396 612',
  'M 90 -20 V 130 L 152 192 V 300',
  'M 1300 150 H 1080 L 1018 88 H 880',
  'M 1300 560 H 1150 L 1086 624 H 950 L 894 568 V 470',
  'M 1190 740 V 600 L 1128 538 V 430',
  'M 300 740 V 640 L 362 578 H 470',
  'M 640 -20 V 60 L 700 120 H 810',
  'M 470 -20 V 40 L 410 100 V 170',
  'M 980 -20 V 90 L 1040 150 V 240',
  'M -20 350 H 90 L 148 408 V 500',
  'M 1300 350 H 1210 L 1152 292 V 210',
]

const NODES = [
  [420, 154], [340, 556], [152, 300], [880, 88], [894, 470], [1128, 430],
  [470, 578], [810, 120], [410, 170], [1040, 240], [148, 500], [1152, 210],
  [268, 154], [214, 556], [1018, 88], [1086, 624], [700, 120], [148, 408],
]

/**
 * רקע מעגלים מודפסים עדין. tone='light' לשקפי תוכן בהירים,
 * tone='dark' לשקפי חוצץ כהים (עם נקודות זוהרות).
 */
export default function CircuitBackground({ tone = 'light', className = '' }) {
  return (
    <div className={`circuit-bg circuit-${tone} ${className}`} aria-hidden="true">
      <svg viewBox="0 0 1280 720" preserveAspectRatio="xMidYMid slice">
        {TRACES.map((d, i) => (
          <path key={i} className="circuit-trace" d={d} />
        ))}
        {NODES.map(([x, y], i) => (
          <circle
            key={i}
            className="circuit-node"
            cx={x}
            cy={y}
            r="5"
            style={{ animationDelay: `${(i % 6) * 0.7}s` }}
          />
        ))}
      </svg>
    </div>
  )
}
