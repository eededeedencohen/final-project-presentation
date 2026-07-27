import { useEffect, useRef, useState } from "react";
import "./styles.css";

/* ============================================================
   LaserPointer — מצביע לייזר אדום עם דיו נעלם.
   קליק ימני מחליף בין עכבר רגיל למצביע; בגרירה מציירים על המסך,
   וכל נקודה חיה TTL מילישניות — מה שצויר ראשון נעלם ראשון.
   ============================================================ */

const TTL = 1200; /* אורך חיי קו על המסך — מחיקה מהירה */
const FADE = 180; /* ריכוך קצר בקצה הנמחק — שאר הקו נשאר במלוא העוצמה */
const COLOR = "255, 45, 45";

export default function LaserPointer() {
  const [on, setOn] = useState(false);
  const canvasRef = useRef(null);
  const pointsRef = useRef([]);
  const strokeRef = useRef(0);
  const drawingRef = useRef(false);
  const mouseRef = useRef({ x: -100, y: -100 });

  /* קליק ימני = מיתוג מצב (במקום תפריט ההקשר) */
  useEffect(() => {
    const onCtx = (e) => {
      e.preventDefault();
      setOn((v) => !v);
    };
    window.addEventListener("contextmenu", onCtx);
    return () => window.removeEventListener("contextmenu", onCtx);
  }, []);

  /* לולאת ציור — רצה רק כשהמצביע פעיל */
  useEffect(() => {
    if (!on) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const loop = () => {
      const now = performance.now();
      const pts = pointsRef.current;
      /* FIFO: הנקודה הוותיקה ביותר נמחקת ראשונה */
      while (pts.length && now - pts[0].t > TTL) pts.shift();

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = 5;
      ctx.shadowColor = `rgba(${COLOR}, 0.8)`;
      ctx.shadowBlur = 8;
      /* החלקת עקומות: כל מפרק מצויר כקשת בזייה דרך נקודות האמצע —
         עיגול נראה עגול, לא מצולע. האלפא נשמר פר-קטע (זנב המחק) */
      for (let i = 1; i < pts.length; i++) {
        const prev = pts[i - 1];
        const cur = pts[i];
        if (prev.s !== cur.s) continue; /* לא מחברים בין משיכות שונות */
        /* "מחק שרודף אחרי הציור": הקו נשאר במלוא העוצמה, ורק הקצה
           שהגיע זמנו נמחק — באותו סדר ובאותו קצב שבו צויר */
        const age = now - cur.t;
        const alpha = age < TTL - FADE ? 1 : Math.max(0, (TTL - age) / FADE);
        ctx.strokeStyle = `rgba(${COLOR}, ${alpha})`;
        ctx.beginPath();
        const m1 = { x: (prev.x + cur.x) / 2, y: (prev.y + cur.y) / 2 };
        const next = pts[i + 1];
        if (i === 1 || pts[i - 2]?.s !== prev.s) {
          /* תחילת משיכה — מתחילים מהנקודה עצמה */
          ctx.moveTo(prev.x, prev.y);
          ctx.lineTo(m1.x, m1.y);
        } else {
          ctx.moveTo(m1.x, m1.y);
        }
        if (next && next.s === cur.s) {
          const m2 = { x: (cur.x + next.x) / 2, y: (cur.y + next.y) / 2 };
          ctx.quadraticCurveTo(cur.x, cur.y, m2.x, m2.y);
        } else {
          ctx.lineTo(cur.x, cur.y); /* סוף משיכה */
        }
        ctx.stroke();
      }

      /* נקודת הלייזר עצמה במיקום העכבר */
      const m = mouseRef.current;
      ctx.shadowBlur = 14;
      ctx.fillStyle = `rgba(${COLOR}, 0.95)`;
      ctx.beginPath();
      ctx.arc(m.x, m.y, 6, 0, Math.PI * 2);
      ctx.fill();

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      pointsRef.current = [];
      drawingRef.current = false;
    };
  }, [on]);

  const down = (e) => {
    if (e.button !== 0) return;
    drawingRef.current = true;
    strokeRef.current += 1;
    mouseRef.current = { x: e.clientX, y: e.clientY };
    pointsRef.current.push({
      x: e.clientX,
      y: e.clientY,
      t: performance.now(),
      s: strokeRef.current,
    });
  };

  const move = (e) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
    if (drawingRef.current) {
      /* דוגמים גם את נקודות הביניים שהדפדפן צבר בין פריימים —
         דגימה צפופה = קימור חלק בלי זוויות */
      const events = e.nativeEvent.getCoalescedEvents?.() ?? [e.nativeEvent];
      const t = performance.now();
      for (const ev of events) {
        pointsRef.current.push({
          x: ev.clientX,
          y: ev.clientY,
          t,
          s: strokeRef.current,
        });
      }
    }
  };

  const up = () => {
    drawingRef.current = false;
  };

  if (!on) return null;
  return (
    <canvas
      ref={canvasRef}
      className="laser-canvas"
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerLeave={up}
    />
  );
}
