import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

export const dynamic = "force-dynamic";

const ALLOWED = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/avif", ".avif"],
  ["video/mp4", ".mp4"],
  ["video/webm", ".webm"],
  ["video/quicktime", ".mov"],
  ["video/x-m4v", ".m4v"],
]);

const authorized = (req: NextRequest) =>
  req.cookies.get("radman_admin")?.value === "authenticated";

export async function POST(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const form = await req.formData();
    const file = form.get("file");
    const sectionValue = String(form.get("section") || "memory").toLowerCase();
    const section = ["hero", "story", "memory"].includes(sectionValue) ? sectionValue : "memory";

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "فایل تصویر ارسال نشده است." }, { status: 400 });
    }

    const ext = ALLOWED.get(file.type);
    if (!ext) return NextResponse.json({ error: "فرمت مجاز تصویر: JPG، PNG، WEBP، AVIF — ویدیو: MP4، WEBM، MOV، M4V." }, { status: 400 });
    const isVideo = file.type.startsWith("video/");
    if (file.size > (isVideo ? 100 : 15) * 1024 * 1024) return NextResponse.json({ error: isVideo ? "حجم ویدیو نباید بیشتر از ۱۰۰ مگابایت باشد." : "حجم تصویر نباید بیشتر از ۱۵ مگابایت باشد." }, { status: 400 });

    const original = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-").slice(0, 80);
    const base = original.replace(/\.[^.]+$/, "").replace(/^radman[-_]?/i, "") || "media";
    const buffer = Buffer.from(await file.arrayBuffer());
    const hash = crypto.createHash("sha256").update(buffer).digest("hex");

    const root = path.resolve(process.cwd(), "..");
    // هر بخش پوشه مستقل خودش را دارد: /memory/hero ، /memory/story ، /memory/memory
    // تصویر و ویدیوهای یک بخش مستقیماً داخل همان پوشه قرار می‌گیرند.
    const dir = path.join(root, "memory", section);
    await fs.mkdir(dir, { recursive: true });

    let filename = "";
    let duplicate = false;
    const existing = await fs.readdir(dir).catch(() => [] as string[]);
    for (const name of existing) {
      const candidate = path.join(dir, name);
      try {
        const existingHash = crypto.createHash("sha256").update(await fs.readFile(candidate)).digest("hex");
        if (existingHash === hash) { filename = name; duplicate = true; break; }
      } catch {}
    }
    if (!filename) {
      const stamp = Date.now().toString(36);
      filename = `radman-${section}-${base}-${stamp}${ext}`;
      await fs.writeFile(path.join(dir, filename), buffer);
    }

    const src = `/memory/${section}/${filename}`;
    return NextResponse.json({
      image: isVideo ? undefined : src,
      video: isVideo ? src : undefined,
      src,
      duplicate,
      filename,
      size: file.size,
    }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "آپلود رسانه انجام نشد." }, { status: 400 });
  }
}


export async function DELETE(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const normalizeSrc = (value: unknown) => {
    let raw = typeof value === "string" ? value.trim() : "";
    if (raw.startsWith("video:")) raw = raw.slice(6);
    if (!raw) throw new Error("رسانه‌ای برای حذف انتخاب نشده است.");

    // بعضی رکوردهای قدیمی ممکن است URL کامل یا URL-encoded باشند.
    try {
      if (/^https?:\/\//i.test(raw)) raw = new URL(raw).pathname;
    } catch {}
    raw = raw.split(/[?#]/, 1)[0];
    try { raw = decodeURIComponent(raw); } catch {}
    raw = "/" + raw.replace(/^[/\\]+/, "").replace(/\\/g, "/");

    if (!raw.startsWith("/memory/")) {
      raw = "/memory/" + raw.replace(/^memory\//, "");
    }

    const relative = raw.slice("/memory/".length);
    const parts = relative.split("/").filter(Boolean);
    if (!parts.length || parts.length > 30 || parts.some((part) =>
      part === "." ||
      part === ".." ||
      part.includes("..") ||
      /[\u0000-\u001F\u007F]/.test(part)
    )) {
      throw new Error("مسیر رسانه نامعتبر است.");
    }

    return { src: raw, relative, parts, fileName: parts[parts.length - 1] };
  };

  try {
    const body = await req.json().catch(() => ({}));
    const requested = Array.isArray(body?.srcs) ? body.srcs : [body?.src];
    const values = requested.filter((value: unknown) => typeof value === "string" && value.trim());
    if (!values.length) return NextResponse.json({ error: "رسانه‌ای برای حذف انتخاب نشده است." }, { status: 400 });

    const projectRoot = path.resolve(process.cwd());
    const roots = [
      path.join(projectRoot, "memory"),
      path.join(projectRoot, "public", "memory"),
      path.join(projectRoot, "..", "memory"),
    ].map((root) => path.resolve(root));

    const trashRoot = path.resolve(projectRoot, "..", ".radman-trash");
    await fs.mkdir(trashRoot, { recursive: true });

    const moved: Array<{ src: string; trashId: string; original: string }> = [];
    const missing: string[] = [];

    const findFile = async (parts: string[], fileName: string) => {
      // ابتدا مسیر دقیق را امتحان می‌کنیم.
      for (const root of roots) {
        const candidate = path.resolve(root, ...parts);
        if (!candidate.startsWith(root + path.sep)) continue;
        try {
          if ((await fs.stat(candidate)).isFile()) return { candidate, root };
        } catch {}
      }

      // برای فایل‌های قدیمی که مسیر پوشه‌شان تغییر کرده، با نام فایل جستجو می‌کنیم.
      const walk = async (dir: string): Promise<string> => {
        let entries: Array<{ name: string; isDirectory(): boolean; isFile(): boolean }> = [];
        try { entries = await fs.readdir(dir, { withFileTypes: true }); } catch { return ""; }
        for (const entry of entries) {
          if (entry.name === ".radman-trash") continue;
          const full = path.join(dir, entry.name);
          if (entry.isFile() && entry.name.toLowerCase() === fileName.toLowerCase()) return full;
          if (entry.isDirectory()) {
            const hit = await walk(full);
            if (hit) return hit;
          }
        }
        return "";
      };

      for (const root of roots) {
        const hit = await walk(root);
        if (hit) return { candidate: hit, root };
      }
      return null;
    };

    for (const value of values) {
      let normalized: ReturnType<typeof normalizeSrc>;
      try {
        normalized = normalizeSrc(value);
      } catch (error) {
        // یک رکورد خراب نباید حذف دسته‌جمعی را متوقف کند.
        missing.push(String(value));
        continue;
      }

      const found = await findFile(normalized.parts, normalized.fileName);
      if (!found) {
        missing.push(normalized.src);
        continue;
      }

      const stamp = Date.now().toString(36);
      const random = crypto.randomBytes(5).toString("hex");
      const trashId = stamp + "-" + random;
      const ext = path.extname(found.candidate) || path.extname(normalized.fileName);
      const trashFile = path.join(trashRoot, trashId + ext);
      await fs.rename(found.candidate, trashFile);
      const original = path.relative(found.root, found.candidate).replace(/\\/g, "/");
      moved.push({ src: normalized.src, trashId, original });
    }

    const manifestPath = path.join(trashRoot, "index.json");
    let manifest: Array<{ id:string; src:string; original:string; trashedAt:string; file:string }> = [];
    try {
      const parsed = JSON.parse(await fs.readFile(manifestPath, "utf8"));
      if (Array.isArray(parsed)) manifest = parsed;
    } catch {}

    const now = new Date().toISOString();
    for (const item of moved) {
      manifest.unshift({
        id: item.trashId,
        src: item.src,
        original: item.original,
        trashedAt: now,
        file: item.trashId + (path.extname(item.original) || ""),
      });
    }
    await fs.writeFile(manifestPath, JSON.stringify(manifest.slice(0, 500), null, 2) + "\n", "utf8");

    return NextResponse.json({
      ok: true,
      deleted: moved.map((item) => item.src),
      missing,
      trashed: moved.length,
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "حذف رسانه انجام نشد.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}


export async function PATCH(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json().catch(() => ({}));
    let raw = String(body?.src || "").trim();
    let newName = String(body?.name || "").trim();
    if (raw.startsWith("video:")) raw = raw.slice(6);
    if (!raw.startsWith("/memory/")) raw = "/memory/" + raw.replace(/^memory\//, "");
    raw = "/" + raw.replace(/^[/\\]+/, "").replace(/\\/g, "/");
    try { raw = decodeURIComponent(raw); } catch {}
    const parts = raw.slice("/memory/".length).split("/").filter(Boolean);
    if (!parts.length || parts.some((part) => part === "." || part === ".." || part.includes("..") || /[\u0000-\u001F\u007F]/.test(part))) {
      return NextResponse.json({ error: "مسیر رسانه نامعتبر است." }, { status: 400 });
    }
    if (!newName) return NextResponse.json({ error: "نام فایل را وارد کنید." }, { status: 400 });
    newName = newName.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-").replace(/^[-.]+|[-.]+$/g, "").slice(0, 90);
    if (!newName) return NextResponse.json({ error: "نام فایل نامعتبر است." }, { status: 400 });
    const oldName = parts[parts.length - 1];
    const ext = path.extname(oldName).toLowerCase();
    if (!path.extname(newName)) newName += ext;
    if (path.extname(newName).toLowerCase() !== ext) return NextResponse.json({ error: "پسوند فایل نباید تغییر کند." }, { status: 400 });
    const projectRoot = path.resolve(process.cwd());
    const roots = [
      path.join(projectRoot, "memory"),
      path.join(projectRoot, "public", "memory"),
      path.join(projectRoot, "..", "memory"),
    ].map((root) => path.resolve(root));
    let oldPath = "";
    let foundRoot = "";
    for (const candidateRoot of roots) {
      const candidate = path.resolve(candidateRoot, ...parts);
      if (!candidate.startsWith(candidateRoot + path.sep)) continue;
      if (await fs.stat(candidate).then(s => s.isFile()).catch(() => false)) {
        oldPath = candidate; foundRoot = candidateRoot; break;
      }
    }
    if (!oldPath) {
      const filename = parts[parts.length - 1].toLowerCase();
      const walk = async (dir: string): Promise<string> => {
        const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
        for (const entry of entries) {
          if (entry.name === ".radman-trash") continue;
          const full = path.join(dir, entry.name);
          if (entry.isFile() && entry.name.toLowerCase() === filename) return full;
          if (entry.isDirectory()) { const hit = await walk(full); if (hit) return hit; }
        }
        return "";
      };
      for (const root of roots) { const hit = await walk(root); if (hit) { oldPath = hit; foundRoot = root; break; } }
    }
    if (!oldPath) return NextResponse.json({ error: "فایل رسانه پیدا نشد." }, { status: 404 });
    const dir = path.dirname(oldPath);
    const newPath = path.join(dir, newName);
    if (oldPath === newPath) return NextResponse.json({ ok: true, src: raw, filename: newName });
    if (await fs.stat(newPath).then(() => true).catch(() => false)) return NextResponse.json({ error: "فایلی با این نام از قبل وجود دارد." }, { status: 409 });
    await fs.rename(oldPath, newPath);
    const relative = path.relative(foundRoot, newPath).replace(/\\/g, "/");
    const src = "/memory/" + relative;

    // Rename is persisted together with every Hero/Memory Signal reference.
    // This makes the operation durable even if the admin page is refreshed
    // immediately after saving the filename.
    try {
      const heroFile = path.join(projectRoot, "src", "data", "hero.json");
      const heroRaw = await fs.readFile(heroFile, "utf8");
      const hero = JSON.parse(heroRaw);
      const oldSrc = raw;
      if (typeof hero.image === "string" && hero.image === oldSrc) hero.image = src;
      if (Array.isArray(hero.memorySignal)) {
        hero.memorySignal = hero.memorySignal.map((entry: unknown) => {
          if (typeof entry !== "string") return entry;
          const video = entry.startsWith("video:");
          const value = video ? entry.slice(6) : entry;
          return value === oldSrc ? (video ? "video:" + src : src) : entry;
        });
      }
      if (Array.isArray(hero.story)) {
        hero.story = hero.story.map((slide: any) =>
          slide && typeof slide === "object" && slide.image === oldSrc ? { ...slide, image: src } : slide
        );
      }
      await fs.writeFile(heroFile, JSON.stringify(hero, null, 2) + "\n", "utf8");
    } catch {
      // The physical rename succeeded; the admin PUT will retry persistence.
    }

    return NextResponse.json({ ok: true, src, filename: newName }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "ویرایش نام فایل انجام نشد." }, { status: 400 });
  }
}
