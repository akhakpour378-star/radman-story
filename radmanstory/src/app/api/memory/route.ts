import { NextRequest, NextResponse } from "next/server";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

const mime: Record<string, string> = {
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
  ".webp": "image/webp", ".avif": "image/avif", ".gif": "image/gif",
  ".mp4": "video/mp4", ".webm": "video/webm", ".mov": "video/quicktime",
  ".m4v": "video/x-m4v", ".mp3": "audio/mpeg",
};

const isInside = (root: string, candidate: string) =>
  candidate === root || candidate.startsWith(root + path.sep);

async function findFile(root: string, relative: string): Promise<string | null> {
  const candidate = path.resolve(root, relative);
  if (!isInside(root, candidate)) return null;
  try {
    if ((await stat(candidate)).isFile()) return candidate;
  } catch {}
  return null;
}

async function listFiles(root: string, folder: string, relative = ""): Promise<string[]> {
  const out: string[] = [];
  let entries;
  try { entries = await readdir(folder, { withFileTypes: true }); } catch { return out; }
  for (const entry of entries) {
    if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
    const absolute = path.join(folder, entry.name);
    const rel = relative ? `${relative}/${entry.name}` : entry.name;
    if (entry.isDirectory()) out.push(...await listFiles(root, absolute, rel));
    else out.push(rel);
  }
  return out;
}

export async function GET(request: NextRequest) {
  const projectRoot = process.cwd();
  const workspaceRoot = path.resolve(projectRoot, "..");
  const mediaRoots = [
    path.resolve(workspaceRoot, "memory"),
    path.resolve(projectRoot, "public", "memory"),
    path.resolve(projectRoot, "memory"),
  ];
  const list = request.nextUrl.searchParams.get("list");

  if (list === "1") {
    const names = (await Promise.all(mediaRoots.map(async (root) =>
      (await listFiles(root, root)).map((name) => name.replace(/\\/g, "/"))
    ))).flat();
    const unique = [...new Set(names)];
    const images = unique.filter((name) => /\\.(jpe?g|png|webp|avif|gif)$/i.test(name)).map((name) => `/memory/${name}`);
    const videos = unique.filter((name) => /\\.(mp4|webm|mov|m4v)$/i.test(name)).map((name) => `/memory/${name}`);
    const bySection = (section: string, items: string[]) => items.filter((src) => src.startsWith(`/memory/${section}/`));
    return NextResponse.json({
      images, videos,
      heroImages: bySection("hero", images), heroVideos: bySection("hero", videos),
      storyImages: bySection("story", images), storyVideos: bySection("story", videos),
      memoryImages: images.filter((src) => !/^\\/memory\\/(hero|story)\\//.test(src)),
      memoryVideos: videos.filter((src) => !/^\\/memory\\/(hero|story)\\//.test(src)),
    }, { headers: { "Cache-Control": "no-store" } });
  }

  const raw = request.nextUrl.searchParams.get("file");
  if (!raw) return NextResponse.json({ error: "Missing file" }, { status: 400 });
  const clean = raw.replace(/^[/\\\\]+/, "").replace(/\\\\/g, "/");
  if (!clean.startsWith("memory/") || clean.split("/").some((part) => part === ".." || part === ".")) {
    return NextResponse.json({ error: "Invalid file" }, { status: 400 });
  }
  const relative = clean.slice("memory/".length);
  for (const root of mediaRoots) {
    const found = await findFile(root, relative);
    if (!found) continue;
    try {
      const data = await readFile(found);
      const ext = path.extname(found).toLowerCase();
      return new NextResponse(data, {
        headers: {
          "Content-Type": mime[ext] ?? "application/octet-stream",
          "Cache-Control": "no-store, max-age=0",
          "X-Content-Type-Options": "nosniff",
        },
      });
    } catch {}
  }
  return NextResponse.json({ error: "Media file not found", file: clean }, { status: 404 });
}
