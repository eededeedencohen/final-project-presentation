/* ============================================================
   generate.js — הופך את slides.json לקומפוננטות React נאמנות
   למקור: pXX/SlideXX.jsx + styles.css לכל שקף.
   הרצה: node generate.js <slidesJson> <projectSrcDir>
   ============================================================ */
const fs = require('fs');
const path = require('path');

const SLIDES = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const SRC = process.argv[3];

const PT = 4 / 3; // pt → px ב-96dpi

/* פונטים מקוריים → ערימות ווב (עברית נופלת ל-Heebo כשאין תמיכה) */
const FONT_MAP = {
  'Open Sans Bold':            { fam: "'Open Sans', 'Heebo Variable', sans-serif", w: 700 },
  'Open Sans':                 { fam: "'Open Sans', 'Heebo Variable', sans-serif", w: 400 },
  'TT Norms':                  { fam: "'Inter', 'Heebo Variable', sans-serif", w: 400 },
  'TT Norms Bold':             { fam: "'Inter', 'Heebo Variable', sans-serif", w: 700 },
  'Canva Sans Bold':           { fam: "'Inter', 'Heebo Variable', sans-serif", w: 700 },
  'Canva Sans':                { fam: "'Inter', 'Heebo Variable', sans-serif", w: 400 },
  'Liberation Sans':           { fam: "Arial, 'Liberation Sans', 'Heebo Variable', sans-serif", w: 400 },
  'Liberation Sans Bold':      { fam: "Arial, 'Liberation Sans', 'Heebo Variable', sans-serif", w: 700 },
  'Montserrat Semi-Bold':      { fam: "'Montserrat', 'Heebo Variable', sans-serif", w: 600 },
  'Montserrat Semi-Bold Italics': { fam: "'Montserrat', 'Heebo Variable', sans-serif", w: 600, i: true },
  'League Spartan':            { fam: "'League Spartan', 'Heebo Variable', sans-serif", w: 400 },
  'Helvetica World Bold':      { fam: "Arial, Helvetica, 'Heebo Variable', sans-serif", w: 700 },
  'Heebo Bold':                { fam: "'Heebo Variable', 'Heebo', sans-serif", w: 700 },
  'Heebo':                     { fam: "'Heebo Variable', 'Heebo', sans-serif", w: 400 },
};
const FONT_FALLBACK = { fam: "'Open Sans', 'Heebo Variable', sans-serif", w: 400 };

/* תמונות רקע לבנות שמוחלפות ברקע הממותג שלנו */
const SKIP_BG_IMAGES = new Set(['image91.jpeg', 'image160.jpeg']);
const STAGE_W = 1920;
const STAGE_H = 1080;

const LABELS = {
  1: 'פתיחה', 2: 'הבעיה', 3: 'מוטיבציה', 4: 'פתרונות קיימים', 5: 'הפער בפתרונות',
  6: 'מטרות יעד', 7: 'טכנולוגיות', 8: 'שכבת ה-Data', 9: 'Data Flow', 10: 'Server/API',
  11: 'Server Flow', 12: 'AI Services', 13: 'Client/SPA', 14: 'Client Flow',
  15: 'פיצ׳רים — תפעול קנייה', 16: 'פיצ׳רים — AI', 17: 'אתגרים', 18: 'שיפורים פוטנציאלים',
  19: 'מסקנות והשפעה', 20: 'תודה',
};

/* התאמות טקסט נקודתיות כדי לשחזר את שבירות השורה של הרנדור המקורי
   (הפונטים המסחריים של Canva רחבים מעט מהתחליפים החופשיים) */
const TEXT_BREAKS = {
  4: [{ find: 'פתרונות קיימים בשוק', to: 'פתרונות\nקיימים בשוק' }],
  5: [{ find: 'הפער הפתרוןנות הקיימים', to: 'הפער\nהפתרוןנות\nהקיימים' }],
  6: [
    { find: 'מטרות יעד', to: 'מטרות\nיעד' },
    { find: 'בניית עגלת קניות במהירות', to: 'בניית עגלת קניות\nבמהירות' },
    { find: 'אלגוריתם סיבוכיות נמוכה להשוואת עגלות', to: 'אלגוריתם סיבוכיות\nנמוכה להשוואת\nעגלות' },
    { find: 'אינטגרציית מודל שפה (', to: 'אינטגרציית מודל\nשפה (' },
    { find: ') כעוזר אקטיבי', to: ') כעוזר\nאקטיבי' },
    { find: ' לאיסוף אוטומטי מקבלות', to: ' לאיסוף\nאוטומטי מקבלות' },
  ],
  8: [{ find: 'שכבת ה-', to: 'שכבת\nה-' }],
  17: [{ find: 'עיבוד שפה טבעית עברית ', to: 'עיבוד שפה טבעית\nעברית ' }],
};

/* פסקאות שבמקור נשארו בשורה אחת — נכפה עליהן לא להישבר */
const NOWRAP = {
  9: ['routes requests, coordinates logic', 'schema-based ODM layer'],
};

const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
   .replace(/\{/g, '&#123;').replace(/\}/g, '&#125;');

const rgba = (fill) => {
  if (!fill) return null;
  if (fill.alpha >= 0.999) return fill.color;
  const n = parseInt(fill.color.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${Math.round(fill.alpha * 1000) / 1000})`;
};

/* מקטין קואורדינטות path מ-EMU לפיקסלים של האלמנט (בשביל clip-path) */
function scalePathD(d, fx, fy) {
  let isX = true;
  return d.replace(/-?\d+(\.\d+)?/g, (num) => {
    const v = parseFloat(num) * (isX ? fx : fy);
    isX = !isX;
    return String(Math.round(v * 100) / 100);
  });
}

/* האם הנתיב הוא סתם מלבן מלא (ואז אין צורך ב-clip) */
function isFullRect(p) {
  const nums = (p.d.match(/-?\d+(\.\d+)?/g) || []).map(Number);
  if (nums.length > 10) return false;
  const xs = nums.filter((_, i) => i % 2 === 0);
  const ys = nums.filter((_, i) => i % 2 === 1);
  const near = (a, b, ref) => Math.abs(a - b) < ref * 0.02;
  return (
    xs.every((x) => near(x, 0, p.vbW) || near(x, p.vbW, p.vbW)) &&
    ys.every((y) => near(y, 0, p.vbH) || near(y, p.vbH, p.vbH))
  );
}

function transformOf(el) {
  const t = [];
  if (el.rot) t.push(`rotate(${el.rot}deg)`);
  if (el.flipH) t.push('scaleX(-1)');
  if (el.flipV) t.push('scaleY(-1)');
  return t.length ? t.join(' ') : null;
}

function genSlide(slide) {
  const id = `p${String(slide.num).padStart(2, '0')}`;
  const jsx = [];
  const css = [];
  const imports = new Map(); // imgFile -> varName
  let elIdx = 0;
  const runClassMap = new Map(); // styleKey -> className
  let runIdx = 0;

  const imgVar = (file) => {
    if (!imports.has(file)) {
      imports.set(file, `img${imports.size}`);
    }
    return imports.get(file);
  };

  const runClass = (r, textScale) => {
    const f = FONT_MAP[r.font] || FONT_FALLBACK;
    const sizePx = Math.round(r.sizePt * PT * (textScale || 1) * 100) / 100;
    const weight = r.bold ? Math.max(700, f.w) : f.w;
    const italic = r.italic || f.i;
    const color = r.color || '#000000';
    const key = [f.fam, sizePx, weight, italic, r.underline, r.spc, color, r.alpha].join('|');
    if (!runClassMap.has(key)) {
      const cls = `${id}-t${runIdx++}`;
      runClassMap.set(key, cls);
      const lines = [
        `.${cls} {`,
        `  font-family: ${f.fam};`,
        `  font-size: ${sizePx}px;`,
        `  font-weight: ${weight};`,
      ];
      if (italic) lines.push('  font-style: italic;');
      if (r.underline) lines.push('  text-decoration: underline;');
      if (r.spc) lines.push(`  letter-spacing: ${Math.round(r.spc * PT * 100) / 100}px;`);
      lines.push(`  color: ${rgba({ color, alpha: r.alpha ?? 1 })};`);
      lines.push('}');
      css.push(lines.join('\n'));
    }
    return runClassMap.get(key);
  };

  const emitText = (el, cls, pad) => {
    const out = [];
    const anchorJustify = el.text.anchor === 'ctr' ? 'center' : el.text.anchor === 'b' ? 'flex-end' : 'flex-start';
    css.push(
      `.${cls}-tx {\n  position: absolute;\n  inset: 0;\n  display: flex;\n  flex-direction: column;\n  justify-content: ${anchorJustify};\n  padding: ${el.text.insets.t}px ${el.text.insets.r}px ${el.text.insets.b}px ${el.text.insets.l}px;\n}`,
    );
    /* ל-Heebo מטריקות שורה גבוהות בדפדפן — מהדקים כמו ב-PowerPoint */
    const allHeebo = el.text.paras.every((p) =>
      p.runs.every((r) => !r.text || (r.font || '').startsWith('Heebo')),
    );
    if (allHeebo && el.text.paras.some((p) => p.runs.some((r) => r.text))) {
      css.push(`.${cls}-tx .pp {\n  line-height: 1.2;\n}`);
    }
    out.push(`${pad}<div className="${cls}-tx">`);
    slideParas: for (const [pi, para] of el.text.paras.entries()) {
      const align = { l: 'left', ctr: 'center', r: 'right', just: 'justify' }[para.align] || 'left';
      const lh = typeof para.lineSpacing === 'number' ? para.lineSpacing * 1.22 : null;
      const styleBits = [`textAlign: '${align}'`];
      if (lh) styleBits.push(`lineHeight: ${Math.round(lh * 100) / 100}`);
      if (para.spcBef) styleBits.push(`marginTop: '${Math.round(para.spcBef * PT * 100) / 100}px'`);

      /* התאמות שבירת שורה נקודתיות מול הרנדור המקורי */
      const paraText = para.runs.map((r) => r.text || '').join('');
      for (const r of para.runs) {
        /* רצפי רווחים מרובים ממקור ה-Canva — מתנהגים כרווח יחיד כמו ברנדור */
        if (r.text) r.text = r.text.replace(/ {3,}/g, ' ');
      }
      for (const rule of TEXT_BREAKS[slide.num] || []) {
        for (const r of para.runs) {
          if (r.text && r.text.includes(rule.find)) r.text = r.text.replace(rule.find, rule.to);
        }
      }
      if ((NOWRAP[slide.num] || []).some((s) => paraText.includes(s))) {
        styleBits.push(`whiteSpace: 'nowrap'`);
      }
      const hasText = para.runs.some((r) => r.text && r.text.length);
      if (!hasText) {
        const sz = Math.round((para.endSizePt || 18) * PT * (el.textScale || 1) * 100) / 100;
        out.push(`${pad}  <p className="pp" dir="auto" style={{ ${styleBits.join(', ')}, fontSize: '${sz}px' }}>{'\\u00A0'}</p>`);
        continue slideParas;
      }
      const spans = para.runs.map((r) => {
        if (r.br) return `<br />`;
        if (!r.text) return '';
        return `<span className="${runClass(r, el.textScale)}">${esc(r.text).replace(/\n/g, '<br />')}</span>`;
      }).join('');
      out.push(`${pad}  <p className="pp" dir="auto" style={{ ${styleBits.join(', ')} }}>${spans}</p>`);
    }
    out.push(`${pad}</div>`);
    return out;
  };

  const emitEl = (el, depth, parent) => {
    const cls = `${id}-e${elIdx++}`;
    const pad = '      ' + '  '.repeat(depth);
    const out = [];
    const style = [
      `  left: ${el.x}px;`,
      `  top: ${el.y}px;`,
      `  width: ${Math.max(el.w, 0.5)}px;`,
      `  height: ${Math.max(el.h, 0.5)}px;`,
    ];
    const tf = transformOf(el);
    if (tf) style.push(`  transform: ${tf};`);

    if (el.kind === 'group') {
      css.push(`.${cls} {\n${style.join('\n')}\n}`);
      out.push(`${pad}<div className="${cls} pel">`);
      for (const child of el.children) out.push(...emitEl(child, depth + 1, cls));
      out.push(`${pad}</div>`);
      return out;
    }

    if (el.kind === 'pic') {
      if (!el.img) return out;
      /* תמונת רקע לבנה מלאה — הרקע שלנו מחליף אותה */
      if (
        SKIP_BG_IMAGES.has(el.img) && !parent &&
        el.w * el.h > STAGE_W * STAGE_H * 0.5
      ) {
        elIdx--; // לא נוצר אלמנט
        return out;
      }
      const v = imgVar(el.img);
      if (el.opacity !== undefined && el.opacity < 0.999) {
        style.push(`  --o: ${el.opacity};`);
        style.push(`  opacity: ${el.opacity};`);
      }
      /* צורת חיתוך לא-מלבנית (משושים וכד') */
      if (el.clipPath && !isFullRect(el.clipPath)) {
        const cp = scalePathD(el.clipPath.d, el.w / el.clipPath.vbW, el.h / el.clipPath.vbH);
        style.push(`  clip-path: path('${cp}');`);
      }
      if (el.fillRect) {
        const f = el.fillRect;
        css.push(`.${cls} {\n${style.join('\n')}\n  overflow: hidden;\n}`);
        css.push(
          `.${cls} img {\n  position: absolute;\n  left: ${Math.round(f.l * 10000) / 100}%;\n  top: ${Math.round(f.t * 10000) / 100}%;\n  width: ${Math.round((1 - f.l - f.r) * 10000) / 100}%;\n  height: ${Math.round((1 - f.t - f.b) * 10000) / 100}%;\n}`,
        );
        out.push(`${pad}<div className="${cls} pel"><img src={${v}} alt="" /></div>`);
      } else {
        css.push(`.${cls} {\n${style.join('\n')}\n  object-fit: fill;\n}`);
        out.push(`${pad}<img className="${cls} pel" src={${v}} alt="" />`);
      }
      return out;
    }

    if (el.kind === 'svg') {
      css.push(`.${cls} {\n${style.join('\n')}\n}`);
      const p = el.path;
      let fill = el.fill ? rgba(el.fill) : 'none';
      let defs = '';
      if (el.gradient) {
        /* גרדיאנט ליניארי: זווית OOXML 0° = משמאל לימין */
        const rad = (el.gradient.ang * Math.PI) / 180;
        const x2 = Math.round(Math.cos(rad) * 100) / 100;
        const y2 = Math.round(Math.sin(rad) * 100) / 100;
        const stops = el.gradient.stops
          .map((s) => `<stop offset="${Math.round(s.pos * 1000) / 10}%" stopColor="${s.color}" stopOpacity="${s.alpha}" />`)
          .join('');
        defs = `<defs><linearGradient id="${cls}-g" x1="0" y1="0" x2="${Math.max(x2, 0)}" y2="${Math.max(y2, 0)}">${stops}</linearGradient></defs>`;
        fill = `url(#${cls}-g)`;
      }
      const strokeAttr = el.stroke
        ? ` stroke="${rgba(el.stroke)}" strokeWidth="${(el.stroke.w * p.vbW) / Math.max(el.w, 1)}"`
        : '';
      out.push(
        `${pad}<svg className="${cls} pel" viewBox="0 0 ${p.vbW} ${p.vbH}" preserveAspectRatio="none">${defs}<path d="${p.d}" fill="${fill}"${strokeAttr} /></svg>`,
      );
      if (el.text) out.push(`${pad}{/* טקסט בתוך צורת SVG */}`);
      return out;
    }

    if (el.kind === 'line') {
      css.push(`.${cls} {\n${style.join('\n')}\n  overflow: visible;\n}`);
      const w = Math.max(el.w, 0.01);
      const h = Math.max(el.h, 0.01);
      const stroke = el.stroke || { color: '#000000', alpha: 1, w: 1 };
      /* הקו תמיד מצויר מפינה לפינה — ההיפוכים מטופלים ב-transform של ה-CSS */
      out.push(
        `${pad}<svg className="${cls} pel" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><line x1="0" y1="0" x2="${w}" y2="${h}" stroke="${rgba(stroke)}" strokeWidth="${stroke.w}" vectorEffect="non-scaling-stroke" /></svg>`,
      );
      return out;
    }

    /* box */
    if (el.gradient) {
      const cssAng = Math.round((el.gradient.ang + 90) * 100) / 100;
      const stops = el.gradient.stops
        .map((s) => `${rgba({ color: s.color, alpha: s.alpha })} ${Math.round(s.pos * 1000) / 10}%`)
        .join(', ');
      style.push(`  background: linear-gradient(${cssAng}deg, ${stops});`);
    } else if (el.fill) style.push(`  background: ${rgba(el.fill)};`);
    if (el.stroke) style.push(`  border: ${Math.max(el.stroke.w, 1)}px solid ${rgba(el.stroke)};`);
    css.push(`.${cls} {\n${style.join('\n')}\n}`);
    out.push(`${pad}<div className="${cls} pel">`);
    if (el.text) out.push(...emitText(el, cls, pad + '  '));
    out.push(`${pad}</div>`);
    return out;
  };

  const body = [];
  for (const [i, el] of slide.elements.entries()) {
    const lines = emitEl(el, 0, null);
    if (!lines.length) continue;
    /* אנימציית כניסה עדינה מדורגת לאלמנטים העליונים */
    const d = Math.min(i * 40, 900);
    lines[0] = lines[0].replace('className="', `style={{ '--d': ${d} }} className="fx fx-fade `);
    body.push(...lines);
  }

  const importLines = ['import CircuitBackground from \'../../components/CircuitBackground/CircuitBackground.jsx\''];
  for (const [file, v] of imports) {
    importLines.push(`import ${v} from '../../assets/media/${file}'`);
  }
  importLines.push("import './styles.css'");

  /* רקע: אם לשקף הוגדר צבע רקע כהה נשמר אותו, אחרת הרקע הממותג שלנו */
  let bgClass = '';
  if (slide.bg && slide.bg.color) {
    const n = parseInt(slide.bg.color.slice(1), 16);
    const lum = ((n >> 16) & 255) * 0.299 + ((n >> 8) & 255) * 0.587 + (n & 255) * 0.114;
    if (lum < 200) bgClass = ' pslide-dark';
  }

  const comp = `/* נוצר אוטומטית מתוך שקף ${slide.num} של המצגת המקורית.
   הטקסטים והמיקומים נאמנים ל-PPTX; הרקע — מהעיצוב הממותג של הגרסה הזו. */
${importLines.join('\n')}

export default function Slide${String(slide.num).padStart(2, '0')}() {
  return (
    <section className="pslide ${id}${bgClass}" dir="ltr">
      <CircuitBackground tone="${bgClass ? 'dark' : 'light'}" />
${body.join('\n')}
    </section>
  )
}
`;

  const cssOut = `/* ============================================================
   ${id} — ${LABELS[slide.num] || ''} (נוצר אוטומטית משקף ${slide.num})
   מיקומים וגדלים נאמנים למקור. עריכה ידנית: חופשי,
   אבל הרצה חוזרת של המחולל תדרוס את הקובץ.
   ============================================================ */

${css.join('\n\n')}
`;

  const dir = path.join(SRC, 'slides', id);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `Slide${String(slide.num).padStart(2, '0')}.jsx`), comp);
  fs.writeFileSync(path.join(dir, 'styles.css'), cssOut);
  return { id, comp: `Slide${String(slide.num).padStart(2, '0')}`, label: LABELS[slide.num] || `שקף ${slide.num}` };
}

const entries = SLIDES.map(genSlide);

/* רישום השקפים */
const reg = `/* ============================================================
   רישום השקפים — נוצר אוטומטית מהמצגת המקורית (20 שקפים).
   הסדר כאן קובע את סדר המצגת.
   ============================================================ */

${entries.map((e) => `import ${e.comp} from './${e.id}/${e.comp}.jsx'`).join('\n')}

export const SLIDES = [
${entries.map((e) => `  { id: '${e.id}', label: '${e.label.replace(/'/g, "\\'")}', Component: ${e.comp} },`).join('\n')}
]
`;
fs.writeFileSync(path.join(SRC, 'slides', 'index.jsx'), reg);
console.log(`generated ${entries.length} slides + registry`);
