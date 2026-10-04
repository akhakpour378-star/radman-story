import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { readdir } from "node:fs/promises";

const mime: Record<string,string> = {
  ".jpg":"image/jpeg",".jpeg":"image/jpeg",".png":"image/png",".webp":"image/webp",".avif":"image/avif",".mp4":"video/mp4",".mp3":"audio/mpeg"
};

export async function GET(request: NextRequest) {
  const list = request.nextUrl.searchParams.get("list");
  const root = path.resolve(process.cwd(), "..");
  if (list === "1") {
    try {
      const dir = path.join(root, "memory");
      const names = (await readdir(dir)).filter((name) => /\\.(jpe?g|png|webp|avif)$/i.test(name));
      return NextResponse.json({ images: names.map((name) => `/memory/${name}`) }, { headers: { "Cache-Control": "no-store" } });
    } catch { return NextResponse.json({ images: [] }); }
  }
  const file = request.nextUrl.searchParams.get("file");
  if (!file) return NextResponse.json({ error: "Missing file" }, { status: 400 });
  const clean = file.replace(/^[/\\]+/,"").replace(/\\/g,"/");
  if (!clean.startsWith("memory/") || clean.includes("..")) return NextResponse.json({ error:"Invalid file" }, {status:400});
  try {
    const target = path.join(root, clean);
    const data = await readFile(target);
    const ext = path.extname(target).toLowerCase();
    return new NextResponse(data, { headers: { "Content-Type": mime[ext] ?? "application/octet-stream", "Cache-Control":"public,max-age=31536000,immutable" } });
  } catch {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }
}