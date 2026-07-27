import "./styles.css";

/* ============================================================
   ספריית אייקוני קו אחידה (stroke, 24x24).
   שימוש: <Icon name="cart" />  - הצבע נלקח מ-currentColor.
   ============================================================ */

const PATHS = {
  cart: (
    <>
      <path d="M3 4h2.4l2.2 11.2a1.6 1.6 0 0 0 1.6 1.3h8.6a1.6 1.6 0 0 0 1.6-1.2L21.5 8H6.1" />
      <circle cx="10" cy="20.2" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="17.6" cy="20.2" r="1.4" fill="currentColor" stroke="none" />
    </>
  ),
  "cart-check": (
    <>
      <path d="M3 4h2.4l2.2 11.2a1.6 1.6 0 0 0 1.6 1.3h8.6a1.6 1.6 0 0 0 1.6-1.2L21.5 8H6.1" />
      <path d="M10.5 11l2 2 3.5-3.5" />
      <circle cx="10" cy="20.2" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="17.6" cy="20.2" r="1.4" fill="currentColor" stroke="none" />
    </>
  ),
  sparkles: (
    <>
      <path d="M12 3l1.8 4.6L18.4 9.4l-4.6 1.8L12 15.8l-1.8-4.6L5.6 9.4l4.6-1.8L12 3z" />
      <path d="M18.5 15.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1z" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2.5" />
    </>
  ),
  coins: (
    <>
      <ellipse cx="9" cy="7" rx="6" ry="2.6" />
      <path d="M3 7v5c0 1.4 2.7 2.6 6 2.6s6-1.2 6-2.6V7" />
      <path d="M3 12v5c0 1.4 2.7 2.6 6 2.6s6-1.2 6-2.6v-5" />
      <path d="M18 10.5c1.9.4 3 1.2 3 2.1v5c0 1.3-2.2 2.4-5 2.6" />
    </>
  ),
  wallet: (
    <>
      <path d="M3.5 7.5A2.5 2.5 0 0 1 6 5h11.5A2.5 2.5 0 0 1 20 7.5v9a2.5 2.5 0 0 1-2.5 2.5H6a2.5 2.5 0 0 1-2.5-2.5v-9z" />
      <path d="M15 12h5.5v4H15a2 2 0 0 1 0-4z" />
      <circle cx="16.6" cy="14" r="0.8" fill="currentColor" stroke="none" />
    </>
  ),
  wand: (
    <>
      <path d="M4 20L15.5 8.5" />
      <path d="M15 3l.9 2.3L18.2 6.2l-2.3.9L15 9.4l-.9-2.3-2.3-.9 2.3-.9L15 3z" />
      <path d="M20 11l.6 1.5 1.4.6-1.4.6L20 15l-.6-1.3-1.4-.7 1.4-.6L20 11z" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.8" />
      <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
    </>
  ),
  grid: (
    <>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </>
  ),
  "eye-off": (
    <>
      <path d="M4 4l16 16" />
      <path d="M10.6 6.3A9.6 9.6 0 0 1 12 6c5 0 8.6 4 9.5 6-.4.9-1.4 2.3-2.9 3.5M7.2 7.4C5 8.8 3.4 10.9 2.5 12c.9 2 4.5 6 9.5 6 1.2 0 2.4-.2 3.4-.7" />
      <path d="M9.9 10a3 3 0 0 0 4.2 4.2" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 12a8 8 0 1 1-2.3-5.6" />
      <path d="M20 3.5V7h-3.5" />
    </>
  ),
  type: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="M7 15.5V9l2.5 3.5L12 9v6.5" />
      <path d="M15.5 9v6.5M14 9h3" />
    </>
  ),
  scale: (
    <>
      <path d="M12 4v16M8 20h8" />
      <path d="M5 7l14-2" />
      <path d="M5 7l-2.4 5.2a3 3 0 0 0 4.8 0L5 7zM19 5l-2.4 5.2a3 3 0 0 0 4.8 0L19 5z" />
    </>
  ),
  filter: (
    <>
      <path d="M4 5h16l-6.2 7.4v5.2L10.2 20v-7.6L4 5z" />
    </>
  ),
  zap: <path d="M13 2L5 13.5h5.5L10 22l8-11.5h-5.5L13 2z" />,
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20.5c1.2-3.6 4-5.5 7.5-5.5s6.3 1.9 7.5 5.5" />
    </>
  ),
  "chart-line": (
    <>
      <path d="M3.5 4v15.5a1 1 0 0 0 1 1H21" />
      <path d="M7 15l3.5-4 3 2.5L18.5 8" />
      <path d="M18.5 11.5V8H15" />
    </>
  ),
  flag: (
    <>
      <path d="M5.5 21V4" />
      <path d="M5.5 4.5c2-.9 4-1.3 6.5 0s4.5 1 6.5.2V13c-2 .9-4 1.1-6.5-.2s-4.5-.9-6.5 0" />
    </>
  ),
  layout: (
    <>
      <rect x="3.5" y="4" width="17" height="16" rx="2.5" />
      <path d="M3.5 9.5h17M9.5 9.5V20" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10.5" width="14" height="9.5" rx="2.5" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
      <circle cx="12" cy="15.2" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  clone: (
    <>
      <rect x="8.5" y="8.5" width="12" height="12" rx="2" />
      <path d="M15.5 5.5v-1a2 2 0 0 0-2-2h-9a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h1" />
    </>
  ),
  check: <path d="M4.5 12.5l5 5L19.5 7" />,
  x: <path d="M6 6l12 12M18 6L6 18" />,
  database: (
    <>
      <ellipse cx="12" cy="5.5" rx="7.5" ry="2.8" />
      <path d="M4.5 5.5v6.5c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8V5.5" />
      <path d="M4.5 12v6.5c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8V12" />
    </>
  ),
  server: (
    <>
      <rect x="3.5" y="4" width="17" height="7" rx="2" />
      <rect x="3.5" y="13" width="17" height="7" rx="2" />
      <circle cx="7.5" cy="7.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="7.5" cy="16.5" r="1" fill="currentColor" stroke="none" />
      <path d="M12 7.5h5M12 16.5h5" />
    </>
  ),
  chip: (
    <>
      <rect x="6.5" y="6.5" width="11" height="11" rx="2" />
      <rect x="10" y="10" width="4" height="4" rx="0.8" />
      <path d="M9 3.5v3M15 3.5v3M9 17.5v3M15 17.5v3M3.5 9h3M3.5 15h3M17.5 9h3M17.5 15h3" />
    </>
  ),
  cloud: (
    <>
      <path d="M7 18.5a4.5 4.5 0 0 1-.4-9A6 6 0 0 1 18.2 11a3.8 3.8 0 0 1-.7 7.5H7z" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.5 2.3 3.8 5.2 3.8 8.5s-1.3 6.2-3.8 8.5c-2.5-2.3-3.8-5.2-3.8-8.5s1.3-6.2 3.8-8.5z" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7.5 2.8v5.4c0 4.6-3.2 8-7.5 9.8-4.3-1.8-7.5-5.2-7.5-9.8V5.8L12 3z" />
      <path d="M8.8 12l2.2 2.2 4.2-4.4" />
    </>
  ),
  route: (
    <>
      <rect x="9.5" y="3" width="5" height="4.5" rx="1" />
      <rect x="3" y="16.5" width="5" height="4.5" rx="1" />
      <rect x="16" y="16.5" width="5" height="4.5" rx="1" />
      <path d="M12 7.5v4M5.5 16.5v-2.5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v2.5" />
    </>
  ),
  window: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
      <path d="M3.5 9h17" />
      <circle cx="6.5" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="9.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path
        d="M12 2.8l1 2.6a7 7 0 0 1 2.4 1l2.6-1 1.6 2.8-1.6 2.2a7 7 0 0 1 0 2.6l1.6 2.2-1.6 2.8-2.6-1a7 7 0 0 1-2.4 1l-1 2.6h-1.9l-1-2.6a7 7 0 0 1-2.4-1l-2.6 1-1.6-2.8 1.6-2.2a7 7 0 0 1 0-2.6L2.5 8.2l1.6-2.8 2.6 1a7 7 0 0 1 2.4-1l1-2.6h1.9z"
        strokeWidth="1.5"
      />
    </>
  ),
  plug: (
    <>
      <path d="M9 2.5v5M15 2.5v5" />
      <path d="M6.5 7.5h11v3.5a5.5 5.5 0 0 1-11 0V7.5z" />
      <path d="M12 16.5v2.5a2.5 2.5 0 0 1-2.5 2.5" />
    </>
  ),
  broom: (
    <>
      <path d="M19.5 3.5l-7 7" />
      <path d="M12.8 10.2L9 9l-5.5 8c2 2.5 5.5 3.7 9 3l1.5-6.5-1.2-3.3z" />
      <path d="M6.5 14.5l3.5 4" />
    </>
  ),
  "data-collect": (
    <>
      <path d="M12 3v10M12 13l-3.5-3.5M12 13l3.5-3.5" />
      <path d="M4 15v3a2.5 2.5 0 0 0 2.5 2.5h11A2.5 2.5 0 0 0 20 18v-3" />
    </>
  ),
  message: (
    <>
      <path d="M4 5.5h16v11H12l-4.5 3.5v-3.5H4v-11z" />
      <path d="M8 9.5h8M8 12.5h5" />
    </>
  ),
  phone: (
    <>
      <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
      <path d="M10.5 18.7h3" />
    </>
  ),
  bell: (
    <>
      <path d="M12 3a6 6 0 0 1 6 6c0 4 1.2 5.7 2 6.5H4c.8-.8 2-2.5 2-6.5a6 6 0 0 1 6-6z" />
      <path d="M9.8 19a2.3 2.3 0 0 0 4.4 0" />
    </>
  ),
  handshake: (
    <>
      <path d="M2.5 7L7 5l5 2 5-2 4.5 2v7.5L16 18.5a2.2 2.2 0 0 1-3-.1l-4.6-4.6" />
      <path d="M12 7L8.2 10.8a1.8 1.8 0 0 0 2.5 2.5L13 11l4.5 4.2" />
    </>
  ),
  dashboard: (
    <>
      <path d="M4 19V10M9.3 19V5M14.7 19v-8M20 19V8" />
      <path d="M3 21h18" strokeWidth="1.5" />
    </>
  ),
  gift: (
    <>
      <rect x="4" y="9" width="16" height="4" rx="1" />
      <path d="M5.5 13v6.5a1.5 1.5 0 0 0 1.5 1.5h10a1.5 1.5 0 0 0 1.5-1.5V13M12 9v12" />
      <path d="M12 9C10 9 7.5 8.3 7.5 6.2 7.5 4.4 9.3 4 10.3 4.8 11.4 5.7 12 9 12 9zM12 9c2 0 4.5-.7 4.5-2.8C16.5 4.4 14.7 4 13.7 4.8 12.6 5.7 12 9 12 9z" />
    </>
  ),
  apple: (
    <>
      <path d="M12 8c-1-2.5-3.5-3-5.3-1.8C4 8 3.8 12.6 6 16.4c1.5 2.6 3.4 4 5 3.4.4-.2.7-.2 1 0 1.6.6 3.5-.8 5-3.4 2.2-3.8 2-8.4-.7-10.2C14.5 5 13 5.5 12 8z" />
      <path d="M12 7.5c0-2 1-3.5 3-4" />
    </>
  ),
  "trend-up": (
    <>
      <path d="M3.5 17.5L9.5 11l3.5 3.5 7-7.5" />
      <path d="M20 11V7h-4" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8.5" r="3.5" />
      <path d="M2.8 19.5c1-3 3.3-4.7 6.2-4.7s5.2 1.7 6.2 4.7" />
      <path d="M15.5 5.4a3.5 3.5 0 0 1 0 6.2M17.8 14.9c1.7.8 3 2.3 3.6 4.6" />
    </>
  ),
  brain: (
    <>
      <path d="M9.5 3.5A2.8 2.8 0 0 0 6.7 6.3 3.2 3.2 0 0 0 4 9.5c0 .8.3 1.5.7 2A3.4 3.4 0 0 0 4 13.7a3.3 3.3 0 0 0 2.7 3.2A2.9 2.9 0 0 0 9.6 20.5c1.4 0 2.4-.9 2.4-2.4V5.8c0-1.4-1-2.3-2.5-2.3z" />
      <path d="M14.5 3.5a2.8 2.8 0 0 1 2.8 2.8A3.2 3.2 0 0 1 20 9.5c0 .8-.3 1.5-.7 2a3.4 3.4 0 0 1 .7 2.2 3.3 3.3 0 0 1-2.7 3.2 2.9 2.9 0 0 1-2.9 3.6c-1.4 0-2.4-.9-2.4-2.4V5.8c0-1.4 1-2.3 2.5-2.3z" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.5 15.5L20.5 20.5" />
    </>
  ),
  receipt: (
    <>
      <path d="M6 3h12v18l-2-1.4L14 21l-2-1.4L10 21l-2-1.4L6 21V3z" />
      <path d="M9 7.5h6M9 11h6M9 14.5h3.5" />
    </>
  ),
  mic: (
    <>
      <rect x="9" y="2.5" width="6" height="11" rx="3" />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12C3.4 10 7 6 12 6s8.6 4 9.5 6c-.9 2-4.5 6-9.5 6s-8.6-4-9.5-6z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  puzzle: (
    <>
      <path
        d="M9.5 4a1.8 1.8 0 0 1 3.6 0V5H16a1.5 1.5 0 0 1 1.5 1.5v2.9h1a1.8 1.8 0 0 1 0 3.6h-1v3.5A1.5 1.5 0 0 1 16 18h-2.9v1a1.8 1.8 0 0 1-3.6 0v-1H6.5A1.5 1.5 0 0 1 5 16.5v-3h1a1.8 1.8 0 0 0 0-3.6H5v-3A1.5 1.5 0 0 1 6.5 5.4h3V4z"
        strokeWidth="1.5"
      />
    </>
  ),
  hook: (
    <>
      <path d="M12 3v10a4.5 4.5 0 0 1-9 .5" />
      <circle cx="12" cy="3.8" r="1.6" />
      <path d="M12 13a4.5 4.5 0 0 0 9 0" />
    </>
  ),
  page: (
    <>
      <path d="M6 2.5h8l4 4V21.5H6V2.5z" />
      <path d="M14 2.5v4h4" />
      <path d="M9 12h6M9 15.5h6M9 8.5h2" />
    </>
  ),
  "arrow-flow": <path d="M4 12h14M14 7l5 5-5 5" />,
};

export const ICON_NAMES = Object.keys(PATHS);

export default function Icon({ name, className = "", size }) {
  const glyph = PATHS[name];
  if (!glyph) {
    console.warn(`Icon "${name}" לא קיים - נפל חזרה ל-sparkles`);
  }
  return (
    <svg
      className={`icon ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={size ? { width: size, height: size } : undefined}
      aria-hidden="true"
    >
      {glyph || PATHS.sparkles}
    </svg>
  );
}
