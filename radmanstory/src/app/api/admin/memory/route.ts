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
  try {
    const body = await req.json();
    const src = typeof body?.src === "string" ? body.src : "";
    if (!src.startsWith("/memory/")) return NextResponse.json({ error: "مسیر رسانه نامعتبر است." }, { status: 400 });
    const relative = src.slice("/memory/".length).replace(/\\/g, "/");
    if (!relative || relative.includes("..") || relative.startsWith("/") || !/^([a-z]+)\/(images|videos)\/[^/]+$/i.test(relative)) return NextResponse.json({ error: "نام فایل نامعتبر است." }, { status: 400 });
    const filePath = path.join(path.resolve(process.cwd(), ".."), "memory", relative);
    await fs.unlink(filePath);
    return NextResponse.json({ ok: true, src }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const code = error && typeof error === "object" && "code" in error ? String((error as { code?: unknown }).code) : "";
    return NextResponse.json({ error: code === "ENOENT" ? "فایل پیدا نشد." : "حذف رسانه انجام نشد." }, { status: code === "ENOENT" ? 404 : 400 });
  }
}
