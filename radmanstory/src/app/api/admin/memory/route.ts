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
    const base = original.replace(/\.[^.]+$/, "") || "radman-image";
    const buffer = Buffer.from(await file.arrayBuffer());
    const hash = crypto.createHash("sha256").update(buffer).digest("hex");

    const root = path.resolve(process.cwd(), "..");
    const typeDir = isVideo ? "videos" : "images";
    const dir = path.join(root, "memory", section, typeDir);
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
      filename = `${base}-${stamp}${ext}`;
      await fs.writeFile(path.join(dir, filename), buffer);
    }

    const src = `/memory/${section}/${typeDir}/${filename}`;
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
    let src = typeof value === "string" ? value.trim() : "";
    if (src.startsWith("video:")) src = src.slice(6);
    src = "/" + src.replace(/^[/\\]+/, "").replace(/\\/g, "/");
    if (!src.startsWith("/memory/")) throw new Error("مسیر رسانه نامعتبر است.");

    const relative = src.slice("/memory/".length);
    const parts = relative.split("/").filter(Boolean);
    if (
      parts.length < 2 ||
      parts.length > 20 ||
      parts.some((part) => part === "." || part === ".." || part.includes("\\0") || part.includes("..")) ||
      parts.some((part) => !/^[a-zA-Z0-9._-]+$/.test(part))
    ) {
      throw new Error("نام فایل نامعتبر است.");
    }

    const fileName = parts[parts.length - 1];
    const typeDir = parts[parts.length - 2];
    if (!fileName || !/^(images|videos)$/i.test(typeDir)) {
      throw new Error("نام فایل نامعتبر است.");
    }
    return { src, relative, parts };
  };

  try {
    const body = await req.json();
    const requested = Array.isArray(body?.srcs) ? body.srcs : [body?.src];
    const values = requested.filter((value: unknown) => typeof value === "string" && value.trim());
    if (!values.length) return NextResponse.json({ error: "رسانه‌ای برای حذف انتخاب نشده است." }, { status: 400 });

    const projectRoot = path.resolve(process.cwd());
    const roots = [
      path.join(projectRoot, "memory"),
      path.join(projectRoot, "public", "memory"),
      path.join(path.resolve(projectRoot, ".."), "memory"),
    ];

    const trashRoot = path.join(path.resolve(projectRoot, ".."), ".radman-trash");
    await fs.mkdir(trashRoot, { recursive: true });

    const moved: Array<{ src: string; trashId: string; original: string }> = [];
    const missing: string[] = [];

    for (const value of values) {
      const { src, relative, parts } = normalizeSrc(value);
      const candidates = roots.map((root) => path.resolve(root, ...parts));
      let found = "";
      for (const candidate of candidates) {
        try {
          if ((await fs.stat(candidate)).isFile()) { found = candidate; break; }
        } catch {}
      }

      if (!found) {
        missing.push(src);
        continue;
      }

      const stamp = Date.now().toString(36);
      const random = crypto.randomBytes(5).toString("hex");
      const trashId = stamp + "-" + random;
      const trashFile = path.join(trashRoot, trashId + path.extname(found));
      await fs.rename(found, trashFile);
      moved.push({ src, trashId, original: relative });
    }

    const manifestPath = path.join(trashRoot, "index.json");
    let manifest: Array<{ id:string; src:string; original:string; trashedAt:string; file:string }> = [];
    try { manifest = JSON.parse(await fs.readFile(manifestPath, "utf8")); } catch {}
    const now = new Date().toISOString();
    for (const item of moved) {
      manifest.unshift({ id:item.trashId, src:item.src, original:item.original, trashedAt:now, file:item.trashId + path.extname(item.original) });
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
