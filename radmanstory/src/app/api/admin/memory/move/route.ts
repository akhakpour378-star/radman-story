import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-dynamic";
const allowed = new Set(["hero", "story", "signal"]);
const authorized = (req: NextRequest) => req.cookies.get("radman_admin")?.value === "authenticated";

export async function POST(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const items: unknown[] = Array.isArray(body.items) ? body.items : [];
    const target = String(body.target || "").toLowerCase();
    if (!allowed.has(target) || !items.length || items.length > 100) {
      return NextResponse.json({ error: "فولدر مقصد یا فایل‌ها معتبر نیستند." }, { status: 400 });
    }
    const projectRoot = path.resolve(process.cwd());
    const roots = [path.join(projectRoot, "memory"), path.join(projectRoot, "public", "memory"), path.join(projectRoot, "..", "memory")].map((root) => path.resolve(root));
    const moved: Array<{from:string;to:string}> = [];
    for (const rawValue of items) {
      if (typeof rawValue !== "string") continue;
      const raw = rawValue.startsWith("video:") ? rawValue.slice(6) : rawValue;
      let decoded = raw;
      try { decoded = decodeURIComponent(decoded); } catch {}
      const normalized = decoded.replace(/\\/g, "/").replace(/^\/+/, "");
      const parts = normalized.split("/").filter(Boolean);
      if (parts[0] !== "memory" || parts.length < 2 || parts.some(x => x === "." || x === ".." || x.includes(".."))) continue;
      const filename = parts[parts.length - 1];
      let source = "";
      for (const root of roots) {
        const candidate = path.resolve(root, ...parts.slice(1));
        if (!candidate.startsWith(root + path.sep)) continue;
        if (await fs.stat(candidate).then(x => x.isFile()).catch(() => false)) { source = candidate; break; }
      }
      if (!source) continue;
      const targetDir = path.join(path.dirname(source).includes(path.join("memory", "signal")) || path.dirname(source).includes(path.join("memory", "story")) || path.dirname(source).includes(path.join("memory", "hero")) ? path.dirname(path.dirname(source)) : path.dirname(source), target);
      await fs.mkdir(targetDir, { recursive: true });
      let dest = path.join(targetDir, filename);
      if (await fs.stat(dest).then(() => true).catch(() => false)) {
        const ext = path.extname(filename), base = path.basename(filename, ext);
        dest = path.join(targetDir, base + "-" + Date.now().toString(36) + ext);
      }
      await fs.rename(source, dest);
      const relative = path.relative(roots.find(r => dest.startsWith(r + path.sep)) || roots[2], dest).replace(/\\/g, "/");
      moved.push({ from: "/" + normalized, to: "/memory/" + relative });
    }
    const configPath = path.join(projectRoot, "src", "data", "hero.json");
    try {
      const config = JSON.parse(await fs.readFile(configPath, "utf8"));
      const map = new Map(moved.map(x => [x.from, x.to]));
      if (typeof config.image === "string" && map.has(config.image)) config.image = map.get(config.image);
      if (Array.isArray(config.memorySignal)) config.memorySignal = config.memorySignal.map((x: unknown) => {
        if (typeof x !== "string") return x;
        const video = x.startsWith("video:");
        const key = video ? x.slice(6) : x;
        return map.has(key) ? (video ? "video:" : "") + map.get(key) : x;
      });
      if (Array.isArray(config.story)) config.story = config.story.map((x: any) => x && map.has(x.image) ? { ...x, image: map.get(x.image) } : x);
      await fs.writeFile(configPath, JSON.stringify(config, null, 2) + "\n", "utf8");
    } catch {}
    return NextResponse.json({ ok: true, moved }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "انتقال فایل ناموفق بود." }, { status: 400 });
  }
}
