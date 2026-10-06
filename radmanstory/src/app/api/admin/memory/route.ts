import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-dynamic";

const ALLOWED = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/avif", ".avif"],
]);

const authorized = (req: NextRequest) =>
  req.cookies.get("radman_admin")?.value === "authenticated";

export async function POST(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "فایل تصویر ارسال نشده است." }, { status: 400 });
    }

    const ext = ALLOWED.get(file.type);
    if (!ext) {
      return NextResponse.json({ error: "فرمت مجاز: JPG، PNG، WEBP یا AVIF." }, { status: 400 });
    }
    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json({ error: "حجم تصویر نباید بیشتر از ۱۵ مگابایت باشد." }, { status: 400 });
    }

    const original = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-").slice(0, 80);
    const base = original.replace(/\.[^.]+$/, "") || "radman-image";
    const stamp = Date.now().toString(36);
    const filename = `${base}-${stamp}${ext}`;

    const root = path.resolve(process.cwd(), "..");
    const dir = path.join(root, "memory");
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, filename), Buffer.from(await file.arrayBuffer()));

    return NextResponse.json({
      image: `/memory/${filename}`,
      filename,
      size: file.size,
    }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "آپلود تصویر انجام نشد." }, { status: 400 });
  }
}
