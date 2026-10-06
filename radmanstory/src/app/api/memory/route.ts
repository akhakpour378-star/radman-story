import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { readdir } from "node:fs/promises";

const mime: Record<string,string> = {
  ".jpg":"image/jpeg",".jpeg":"image/jpeg",".png":"image/png",".webp":"image/webp",".avif":"image/avif",".mp4":"video/mp4",".webm":"video/webm",".mov":"video/quicktime",".m4v":"video/x-m4v",".mp3":"audio/mpeg"
};

export async function GET(request: NextRequest) {
  const list = request.nextUrl.searchParams.get("list");
  const root = path.resolve(process.cwd(), "..");
  if (list === "1") {
    try {
      const dir = path.join(root, "memory");
      const walk = async (folder: string, relative = ""): Promise<string[]> => {
        const entries = await readdir(folder, { withFileTypes: true });
        const files: string[] = [];
        for (const entry of entries) {
          const absolute = path.join(folder, entry.name);
          const rel = relative ? `${relative}/${entry.name}` : entry.name;
          if (entry.isDirectory()) files.push(...await walk(absolute, rel));
          else files.push(rel);
        }
        return files;
      };
      const names = await walk(dir);
      const images = names.filter((name) => /\.(jpe?g|png|webp|avif)$/i.test(name)).map((name) => `/memory/${name}`);
      const videos = names.filter((name) => /\.(mp4|webm|mov|m4v)$/i.test(name)).map((name) => `/memory/${name}`);
      const bySection = (section: string, type: "images" | "videos") =>
        (type === "images" ? images : videos).filter((src) => src.startsWith(`/memory/${section}/`));
      return NextResponse.json({
        images, videos,
        heroImages: bySection("hero", "images"),
        heroVideos: bySection("hero", "videos"),
        storyImages: bySection("story", "images"),
        storyVideos: bySection("story", "videos"),
        memoryImages: images.filter((src) => !src.startsWith("/memory/hero/") && !src.startsWith("/memory/story/")),
        memoryVideos: videos.filter((src) => !src.startsWith("/memory/hero/") && !src.startsWith("/memory/story/")),
      }, { headers: { "Cache-Control": "no-store" } });
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
    return new NextResponse(data, { headers: { "Content-Type": mime[ext] ?? "application/octet-stream", "Cache-Control":"no-store, max-age=0" } });
  } catch {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }
}