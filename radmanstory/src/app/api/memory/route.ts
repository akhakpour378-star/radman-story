import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";

const mime: Record<string,string> = {
  ".jpg":"image/jpeg",".jpeg":"image/jpeg",".png":"image/png",".webp":"image/webp",".avif":"image/avif"
};

export async function GET(request: NextRequest) {
  const file = request.nextUrl.searchParams.get("file");
  if (!file) return NextResponse.json({ error: "Missing file" }, { status: 400 });
  const clean = file.replace(/^[/\\]+/,"").replace(/\\/g,"/");
  if (!clean.startsWith("memory/") || clean.includes("..")) return NextResponse.json({ error:"Invalid file" }, {status:400});
  try {
    const root = path.resolve(process.cwd(), "..");
    const target = path.join(root, clean);
    const data = await readFile(target);
    const ext = path.extname(target).toLowerCase();
    return new NextResponse(data, { headers: { "Content-Type": mime[ext] ?? "application/octet-stream", "Cache-Control":"public,max-age=31536000,immutable" } });
  } catch {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }
}