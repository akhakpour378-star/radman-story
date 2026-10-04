import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const IMAGE_EXTENSIONS = new Set([".jpg",".jpeg",".png",".webp",".avif"]);

async function walk(dir: string, root: string): Promise<{src:string;hash:string}[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: {src:string;hash:string}[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full, root));
    else if (IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      const buffer = await readFile(full);
      const hash = createHash("sha1").update(buffer).digest("hex");
      files.push({
        src: "/" + path.relative(root, full).split(path.sep).join("/"),
        hash,
      });
    }
  }
  return files;
}

export async function GET() {
  const publicDir = path.join(process.cwd(), "public");
  const memoryDir = path.join(publicDir, "memory");
  try {
    const files = await walk(memoryDir, publicDir);
    const seen = new Set<string>();
    const unique = files.filter((file) => {
      if (seen.has(file.hash)) return false;
      seen.add(file.hash);
      return true;
    });
    return NextResponse.json({ images: unique.map(({ src }) => src) }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json({ images: [] }, { status: 200 });
  }
}
