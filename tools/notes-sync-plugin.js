import fs from "node:fs";
import path from "node:path";

/* ============================================================
   notes-sync — שמירת פתקי הדובר כקבצים בפרויקט (בעבודה מקומית).
   הדפדפן שולח לכאן את התמונות שהודבקו ואת נתוני הפריסה
   (מיקום/גודל/שקיפות), והם נכתבים ל-src/notes/ + layout.json —
   כך שאחרי push הם חיים גם באתר בענן, מובנים במצגת.
   פעיל רק בשרתים מקומיים (dev/preview) — באתר האמיתי אין endpoint.
   ============================================================ */

const NOTES_DIR = path.resolve(process.cwd(), "src/notes");
const LAYOUT_FILE = path.join(NOTES_DIR, "layout.json");
const SAFE_NAME = /^[\w-]+\.(png|jpe?g|webp|gif)$/i;
const MAX_BODY = 40 * 1024 * 1024;

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (c) => {
      size += c.length;
      if (size > MAX_BODY) {
        reject(new Error("body too large"));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function json(res, code, obj) {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(obj));
}

function attach(middlewares) {
  middlewares.use("/__notes", async (req, res, next) => {
    try {
      if (req.method === "GET" && req.url === "/ping") {
        return json(res, 200, { ok: true });
      }
      if (req.method !== "POST") return next();
      const body = JSON.parse((await readBody(req)).toString("utf8"));

      if (req.url === "/save-image") {
        const { name, dataUrl } = body;
        if (!SAFE_NAME.test(name || "")) return json(res, 400, { error: "bad name" });
        const m = /^data:image\/[\w+.-]+;base64,(.+)$/s.exec(dataUrl || "");
        if (!m) return json(res, 400, { error: "bad dataUrl" });
        fs.mkdirSync(NOTES_DIR, { recursive: true });
        fs.writeFileSync(path.join(NOTES_DIR, name), Buffer.from(m[1], "base64"));
        return json(res, 200, { ok: true });
      }

      if (req.url === "/save-layout") {
        const incoming = body && typeof body === "object" ? body : {};
        fs.mkdirSync(NOTES_DIR, { recursive: true });
        /* מיזוג פר-מפתח על הקיים — לקוח שלא מכיר פתק מסוים לא ימחק
           את הפריסה שלו; מפתחות נמחקים רק דרך delete-image */
        let existing = {};
        try {
          existing = JSON.parse(fs.readFileSync(LAYOUT_FILE, "utf8"));
        } catch {
          existing = {};
        }
        const merged = { ...existing, ...incoming };
        fs.writeFileSync(LAYOUT_FILE, JSON.stringify(merged, null, 2) + "\n", "utf8");
        return json(res, 200, { ok: true });
      }

      if (req.url === "/delete-image") {
        const { name } = body;
        if (!SAFE_NAME.test(name || "")) return json(res, 400, { error: "bad name" });
        const file = path.join(NOTES_DIR, name);
        if (fs.existsSync(file)) fs.unlinkSync(file);
        /* מנקים גם את רשומת הפריסה של הקובץ */
        try {
          const layouts = JSON.parse(fs.readFileSync(LAYOUT_FILE, "utf8"));
          if (name in layouts) {
            delete layouts[name];
            fs.writeFileSync(LAYOUT_FILE, JSON.stringify(layouts, null, 2) + "\n", "utf8");
          }
        } catch {
          /* אין קובץ פריסות — אין מה לנקות */
        }
        return json(res, 200, { ok: true });
      }

      return next();
    } catch (e) {
      return json(res, 500, { error: String(e.message || e) });
    }
  });
}

export default function notesSyncPlugin() {
  return {
    name: "notes-sync",
    configureServer(server) {
      attach(server.middlewares);
    },
    configurePreviewServer(server) {
      attach(server.middlewares);
    },
  };
}
