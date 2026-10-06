import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-dynamic";

const authorized = (req: NextRequest) =>
  req.cookies.get("radman_admin")?.value === "authenticated";

type TrashItem = {
  id: string;
  src: string;
  original: string;
  trashedAt: string;
  file: string;
};

const root = () => path.join(path.resolve(process.cwd(), ".."), ".radman-trash");
const manifestPath = () => path.join(root(), "index.json");

async function readManifest(): Promise<TrashItem[]> {
  try {
    const data = JSON.parse(await fs.readFile(manifestPath(), "utf8"));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function writeManifest(items: TrashItem[]) {
  await fs.mkdir(root(), { recursive: true });
  await fs.writeFile(manifestPath(), JSON.stringify(items, null, 2) + "\n", "utf8");
}

function safeOriginal(value: string) {
  const clean = String(value || "").replace(/\\/g, "/").replace(/^\/+/, "");
  const parts = clean.split("/").filter(Boolean);
  if (!parts.length || parts.length > 20 || parts.some(p => p === "." || p === ".." || p.includes("..") || !/^[a-zA-Z0-9._-]+$/.test(p))) {
    throw new Error("مسیر بازیابی نامعتبر است.");
  }
  return parts;
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const items = await readManifest();
  const existing = [];
  for (const item of items) {
    try {
      await fs.stat(path.join(root(), item.file));
      existing.push(item);
    } catch {}
  }
  if (existing.length !== items.length) await writeManifest(existing);
  return NextResponse.json({ items: existing }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const action = String(body?.action || "");
    const ids = Array.isArray(body?.ids) ? body.ids.filter((x: unknown) => typeof x === "string") : [body?.id];
    const selected = ids.filter((x: unknown) => typeof x === "string" && x.trim());
    if (!selected.length) return NextResponse.json({ error: "موردی انتخاب نشده است." }, { status: 400 });

    let manifest = await readManifest();
    const trashDir = root();

    if (action === "restore") {
      const restored: string[] = [];
      for (const id of selected) {
        const item = manifest.find(x => x.id === id);
        if (!item) continue;
        const parts = safeOriginal(item.original);
        const destination = path.join(path.resolve(process.cwd(), ".."), "memory", ...parts);
        await fs.mkdir(path.dirname(destination), { recursive: true });
        try { await fs.stat(destination); return NextResponse.json({ error: "فایل مقصد از قبل وجود دارد. ابتدا نام یا فایل مقصد را بررسی کنید." }, { status: 409 }); } catch {}
        await fs.rename(path.join(trashDir, item.file), destination);
        restored.push(id);
      }
      manifest = manifest.filter(item => !restored.includes(item.id));
      await writeManifest(manifest);
      return NextResponse.json({ ok: true, restored });
    }

    if (action === "permanent") {
      const removed: string[] = [];
      for (const id of selected) {
        const item = manifest.find(x => x.id === id);
        if (!item) continue;
        try { await fs.unlink(path.join(trashDir, item.file)); } catch {}
        removed.push(id);
      }
      manifest = manifest.filter(item => !removed.includes(item.id));
      await writeManifest(manifest);
      return NextResponse.json({ ok: true, removed });
    }

    return NextResponse.json({ error: "عملیات نامعتبر است." }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "عملیات سطل آشغال انجام نشد." }, { status: 400 });
  }
}
