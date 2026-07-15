/* ============================================================
   extract.js — מפרק את קבצי ה-XML של שקפי ה-PPTX למבנה JSON
   שממנו ייווצרו קומפוננטות React נאמנות למקור.
   תומך ב: custGeom (כ-SVG), blipFill (תמונות), קבוצות מסובבות,
   קווים, מלבנים וטקסט מלא.
   הרצה: node extract.js <pptxDir> <outJson>
   ============================================================ */
const fs = require('fs');
const path = require('path');
const { XMLParser } = require('fast-xml-parser');

const PPTX = process.argv[2];
const OUT = process.argv[3];
const EMU = 9525; // EMU לפיקסל ב-96dpi

const parser = new XMLParser({
  preserveOrder: true,
  ignoreAttributes: false,
  attributeNamePrefix: '',
  parseTagValue: false,
  trimValues: false,
});

const tagOf = (node) => Object.keys(node).find((k) => k !== ':@');
const attrs = (node) => node[':@'] || {};
const kids = (node) => node[tagOf(node)] || [];
const findChild = (node, tag) => kids(node).find((c) => tagOf(c) === tag);
const findChildren = (node, tag) => kids(node).filter((c) => tagOf(c) === tag);

const px = (emu) => Math.round((Number(emu) / EMU) * 100) / 100;

/* בוליאנים ב-OOXML מגיעים גם כ-"1" וגם כ-"true" */
const isTrue = (v) => v === '1' || v === 'true';

function readFill(fillNode) {
  if (!fillNode) return null;
  const srgb = findChild(fillNode, 'a:srgbClr');
  if (!srgb) return null;
  const hex = '#' + attrs(srgb).val.toLowerCase();
  const alphaNode = findChild(srgb, 'a:alpha');
  const alpha = alphaNode ? Number(attrs(alphaNode).val) / 100000 : 1;
  return { color: hex, alpha };
}

/* מילוי גרדיאנט ליניארי → {ang, stops:[{pos,color,alpha}]} */
function readGradient(node) {
  const g = findChild(node, 'a:gradFill');
  if (!g) return null;
  const gsLst = findChild(g, 'a:gsLst');
  if (!gsLst) return null;
  const stops = findChildren(gsLst, 'a:gs')
    .map((gs) => {
      const srgb = findChild(gs, 'a:srgbClr');
      const alphaNode = srgb ? findChild(srgb, 'a:alpha') : null;
      return {
        pos: Number(attrs(gs).pos || 0) / 100000,
        color: srgb ? '#' + attrs(srgb).val.toLowerCase() : '#000000',
        alpha: alphaNode ? Number(attrs(alphaNode).val) / 100000 : 1,
      };
    })
    .sort((a, b) => a.pos - b.pos);
  const lin = findChild(g, 'a:lin');
  const ang = lin && attrs(lin).ang ? Number(attrs(lin).ang) / 60000 : 0;
  return { ang, stops };
}

function readXfrm(xfrmNode) {
  if (!xfrmNode) return null;
  const a = attrs(xfrmNode);
  const off = findChild(xfrmNode, 'a:off');
  const ext = findChild(xfrmNode, 'a:ext');
  const chOff = findChild(xfrmNode, 'a:chOff');
  const chExt = findChild(xfrmNode, 'a:chExt');
  return {
    x: off ? Number(attrs(off).x) : 0,
    y: off ? Number(attrs(off).y) : 0,
    w: ext ? Number(attrs(ext).cx) : 0,
    h: ext ? Number(attrs(ext).cy) : 0,
    rot: a.rot ? Number(a.rot) / 60000 : 0,
    flipH: isTrue(a.flipH),
    flipV: isTrue(a.flipV),
    chX: chOff ? Number(attrs(chOff).x) : null,
    chY: chOff ? Number(attrs(chOff).y) : null,
    chW: chExt ? Number(attrs(chExt).cx) : null,
    chH: chExt ? Number(attrs(chExt).cy) : null,
  };
}

/* custGeom → מחרוזת path של SVG + מידות מערכת הצירים */
function readCustGeom(custGeom, extW, extH) {
  const pathLst = findChild(custGeom, 'a:pathLst');
  if (!pathLst) return null;
  let d = '';
  let vbW = 0;
  let vbH = 0;
  for (const p of findChildren(pathLst, 'a:path')) {
    const pa = attrs(p);
    vbW = Math.max(vbW, Number(pa.w || extW || 1));
    vbH = Math.max(vbH, Number(pa.h || extH || 1));
    for (const cmd of kids(p)) {
      const t = tagOf(cmd);
      const pts = findChildren(cmd, 'a:pt').map((pt) => `${attrs(pt).x} ${attrs(pt).y}`);
      if (t === 'a:moveTo') d += `M ${pts[0]} `;
      else if (t === 'a:lnTo') d += `L ${pts[0]} `;
      else if (t === 'a:cubicBezTo') d += `C ${pts.join(' ')} `;
      else if (t === 'a:quadBezTo') d += `Q ${pts.join(' ')} `;
      else if (t === 'a:close') d += 'Z ';
    }
  }
  return d ? { d: d.trim(), vbW, vbH } : null;
}

function readTxBody(txBody) {
  const bodyPrNode = findChild(txBody, 'a:bodyPr');
  const bp = bodyPrNode ? attrs(bodyPrNode) : {};
  const body = {
    anchor: bp.anchor || 't',
    insets: {
      l: bp.lIns !== undefined ? px(bp.lIns) : 9.6,
      t: bp.tIns !== undefined ? px(bp.tIns) : 4.8,
      r: bp.rIns !== undefined ? px(bp.rIns) : 9.6,
      b: bp.bIns !== undefined ? px(bp.bIns) : 4.8,
    },
    wrap: bp.wrap || 'square',
    paras: [],
  };

  for (const p of findChildren(txBody, 'a:p')) {
    const pPr = findChild(p, 'a:pPr');
    const pa = pPr ? attrs(pPr) : {};
    let lineSpacing = null;
    let spcBef = 0;
    if (pPr) {
      const lnSpc = findChild(pPr, 'a:lnSpc');
      if (lnSpc) {
        const pct = findChild(lnSpc, 'a:spcPct');
        if (pct) lineSpacing = Number(attrs(pct).val) / 100000;
        const pts = findChild(lnSpc, 'a:spcPts');
        if (pts) lineSpacing = { pts: Number(attrs(pts).val) / 100 };
      }
      const bef = findChild(pPr, 'a:spcBef');
      if (bef) {
        const pts = findChild(bef, 'a:spcPts');
        if (pts) spcBef = Number(attrs(pts).val) / 100;
      }
    }
    const para = { align: pa.algn || 'l', rtl: isTrue(pa.rtl), lineSpacing, spcBef, runs: [] };

    for (const child of kids(p)) {
      const t = tagOf(child);
      if (t === 'a:r') {
        const rPr = findChild(child, 'a:rPr');
        const ra = rPr ? attrs(rPr) : {};
        const latin = rPr ? findChild(rPr, 'a:latin') : null;
        const cs = rPr ? findChild(rPr, 'a:cs') : null;
        const fill = rPr ? readFill(findChild(rPr, 'a:solidFill')) : null;
        const tNode = findChild(child, 'a:t');
        let text = '';
        if (tNode) {
          const inner = kids(tNode).find((c) => tagOf(c) === '#text');
          text = inner ? String(inner['#text']) : '';
        }
        para.runs.push({
          text,
          sizePt: ra.sz ? Number(ra.sz) / 100 : 18,
          bold: isTrue(ra.b),
          italic: isTrue(ra.i),
          underline: !!ra.u && ra.u !== 'none',
          spc: ra.spc ? Number(ra.spc) / 100 : 0,
          font: latin ? attrs(latin).typeface : cs ? attrs(cs).typeface : null,
          color: fill ? fill.color : null,
          alpha: fill ? fill.alpha : 1,
        });
      } else if (t === 'a:br') {
        para.runs.push({ br: true });
      } else if (t === 'a:endParaRPr' && para.runs.length === 0) {
        const ra = attrs(child);
        para.endSizePt = ra.sz ? Number(ra.sz) / 100 : 18;
      }
    }
    body.paras.push(para);
  }
  return body;
}

/* צורה בודדת (sp/pic/cxnSp) → אלמנט */
function shapeToElement(node, ctx, rels, warnings) {
  const tag = tagOf(node);
  const spPr = findChild(node, tag === 'p:pic' ? 'p:spPr' : 'p:spPr');
  if (!spPr) return null;
  const xf = readXfrm(findChild(spPr, 'a:xfrm'));
  if (!xf) return null;

  const el = {
    x: px(ctx.offX + xf.x * ctx.scaleX),
    y: px(ctx.offY + xf.y * ctx.scaleY),
    w: px(xf.w * ctx.scaleX),
    h: px(xf.h * ctx.scaleY),
    rot: Math.round(xf.rot * 100) / 100,
    flipH: xf.flipH,
    flipV: xf.flipV,
    textScale: Math.round(ctx.scaleX * 1000) / 1000,
  };

  const geomNode = findChild(spPr, 'a:prstGeom');
  const geom = geomNode ? attrs(geomNode).prst : null;
  const custGeom = findChild(spPr, 'a:custGeom');
  el.fill = readFill(findChild(spPr, 'a:solidFill'));
  el.gradient = readGradient(spPr);

  const ln = findChild(spPr, 'a:ln');
  if (ln) {
    const lnFill = readFill(findChild(ln, 'a:solidFill'));
    const noFill = findChild(ln, 'a:noFill');
    if (lnFill && !noFill) {
      el.stroke = { ...lnFill, w: attrs(ln).w ? px(attrs(ln).w) : 1 };
    }
  }

  /* מילוי תמונה — כך Canva מטמיעה את כל התמונות */
  const blipFill = findChild(spPr, 'a:blipFill') || findChild(node, 'p:blipFill');
  if (blipFill) {
    const blip = findChild(blipFill, 'a:blip');
    const rid = blip ? attrs(blip)['r:embed'] : null;
    el.kind = 'pic';
    el.img = rid && rels[rid] ? path.basename(rels[rid]) : null;
    if (blip) {
      /* שקיפות ברמת התמונה */
      const amf = findChild(blip, 'a:alphaModFix');
      if (amf) el.opacity = Number(attrs(amf).amt) / 100000;
      /* אם קיימת גרסת SVG חדה — נעדיף אותה */
      const extLst = findChild(blip, 'a:extLst');
      if (extLst) {
        for (const ext of findChildren(extLst, 'a:ext')) {
          const svgBlip = kids(ext).find((c) => tagOf(c).endsWith('svgBlip'));
          if (svgBlip) {
            const srid = attrs(svgBlip)['r:embed'];
            if (srid && rels[srid]) el.img = path.basename(rels[srid]);
          }
        }
      }
    }
    if (!el.img) warnings.push('image without resolvable rel');
    const stretch = findChild(blipFill, 'a:stretch');
    const fr = stretch ? findChild(stretch, 'a:fillRect') : null;
    if (fr) {
      const fa = attrs(fr);
      const f = {
        l: Number(fa.l || 0) / 100000,
        t: Number(fa.t || 0) / 100000,
        r: Number(fa.r || 0) / 100000,
        b: Number(fa.b || 0) / 100000,
      };
      if (f.l || f.t || f.r || f.b) el.fillRect = f;
    }
    /* אם הצורה אינה מלבן — נשמור גם את הנתיב בשביל מסכת חיתוך */
    if (custGeom) {
      const geo = readCustGeom(custGeom, xf.w, xf.h);
      if (geo) el.clipPath = geo;
    }
    return el;
  }

  if (tag === 'p:cxnSp' || geom === 'line' || geom === 'straightConnector1') {
    el.kind = 'line';
    return el;
  }

  if (custGeom) {
    const geo = readCustGeom(custGeom, xf.w, xf.h);
    if (geo && (el.fill || el.stroke || el.gradient)) {
      el.kind = 'svg';
      el.path = geo;
    } else {
      el.kind = 'box'; // custGeom בלי מילוי — כנראה קופסת טקסט
    }
  } else {
    el.kind = 'box';
  }

  const txBody = findChild(node, 'p:txBody');
  if (txBody) {
    const text = readTxBody(txBody);
    if (text.paras.some((p) => p.runs.some((r) => r.text && r.text.length))) el.text = text;
    else if (text.paras.length) el.text = text; // גם פסקאות ריקות תופסות גובה
  }

  /* קופסה בלי מילוי, בלי מסגרת ובלי טקסט — לא מייצרת כלום */
  if (el.kind === 'box' && !el.fill && !el.gradient && !el.stroke && !el.text) return null;
  return el;
}

function walkShapes(nodes, ctx, out, rels, warnings) {
  for (const node of nodes) {
    const tag = tagOf(node);

    if (tag === 'p:grpSp') {
      const grpSpPr = findChild(node, 'p:grpSpPr');
      const xf = readXfrm(grpSpPr ? findChild(grpSpPr, 'a:xfrm') : null);
      if (!xf) continue;
      const scaleX = xf.chW ? xf.w / xf.chW : 1;
      const scaleY = xf.chH ? xf.h / xf.chH : 1;
      const shapeKids = kids(node).filter((c) =>
        ['p:sp', 'p:pic', 'p:grpSp', 'p:cxnSp'].includes(tagOf(c)),
      );

      if (xf.rot !== 0 || xf.flipH || xf.flipV) {
        /* קבוצה מסובבת: הופכת לקונטיינר עם ילדים יחסיים */
        const group = {
          kind: 'group',
          x: px(ctx.offX + xf.x * ctx.scaleX),
          y: px(ctx.offY + xf.y * ctx.scaleY),
          w: px(xf.w * ctx.scaleX),
          h: px(xf.h * ctx.scaleY),
          rot: Math.round(xf.rot * 100) / 100,
          flipH: xf.flipH,
          flipV: xf.flipV,
          children: [],
        };
        walkShapes(
          shapeKids,
          {
            offX: -(xf.chX || 0) * scaleX * ctx.scaleX,
            offY: -(xf.chY || 0) * scaleY * ctx.scaleY,
            scaleX: ctx.scaleX * scaleX,
            scaleY: ctx.scaleY * scaleY,
          },
          group.children,
          rels,
          warnings,
        );
        out.push(group);
      } else {
        walkShapes(
          shapeKids,
          {
            offX: ctx.offX + (xf.x - (xf.chX || 0) * scaleX) * ctx.scaleX,
            offY: ctx.offY + (xf.y - (xf.chY || 0) * scaleY) * ctx.scaleY,
            scaleX: ctx.scaleX * scaleX,
            scaleY: ctx.scaleY * scaleY,
          },
          out,
          rels,
          warnings,
        );
      }
      continue;
    }

    if (!['p:sp', 'p:pic', 'p:cxnSp'].includes(tag)) continue;
    const el = shapeToElement(node, ctx, rels, warnings);
    if (el) out.push(el);
  }
}

/* --- ריצה --- */
const slideDir = path.join(PPTX, 'ppt', 'slides');
const files = fs.readdirSync(slideDir).filter((f) => /^slide\d+\.xml$/.test(f))
  .sort((a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]));

const slides = [];
for (const f of files) {
  const num = parseInt(f.match(/\d+/)[0], 10);
  const xml = fs.readFileSync(path.join(slideDir, f), 'utf8');
  const relsPath = path.join(slideDir, '_rels', f + '.rels');
  const rels = {};
  if (fs.existsSync(relsPath)) {
    const rx = parser.parse(fs.readFileSync(relsPath, 'utf8'));
    const relRoot = rx.find((n) => tagOf(n) === 'Relationships');
    for (const r of kids(relRoot)) {
      if (tagOf(r) === 'Relationship') rels[attrs(r).Id] = attrs(r).Target;
    }
  }

  const tree = parser.parse(xml);
  const sld = tree.find((n) => tagOf(n) === 'p:sld');
  const cSld = findChild(sld, 'p:cSld');

  let bg = null;
  const bgNode = findChild(cSld, 'p:bg');
  if (bgNode) {
    const bgPr = findChild(bgNode, 'p:bgPr');
    if (bgPr) bg = readFill(findChild(bgPr, 'a:solidFill'));
  }

  const spTree = findChild(cSld, 'p:spTree');
  const elements = [];
  const warnings = [];
  walkShapes(
    kids(spTree).filter((c) => ['p:sp', 'p:pic', 'p:grpSp', 'p:cxnSp'].includes(tagOf(c))),
    { offX: 0, offY: 0, scaleX: 1, scaleY: 1 },
    elements,
    rels,
    warnings,
  );

  const flat = [];
  const countKinds = (els) => {
    for (const e of els) {
      if (e.kind === 'group') countKinds(e.children);
      else flat.push(e.kind);
    }
  };
  countKinds(elements);

  slides.push({ num, bg, elements, warnings });
  console.log(
    `slide ${num}: ${flat.length} shapes — ` +
    ['pic', 'svg', 'box', 'line'].map((k) => `${k}:${flat.filter((x) => x === k).length}`).join(' ') +
    (warnings.length ? ` WARN: ${[...new Set(warnings)].join('; ')}` : ''),
  );
}

fs.writeFileSync(OUT, JSON.stringify(slides, null, 1));
console.log(`written: ${OUT}`);
