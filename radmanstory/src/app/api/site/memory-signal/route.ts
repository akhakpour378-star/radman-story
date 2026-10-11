import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-dynamic";

const file = path.join(process.cwd(), "src", "data", "hero.json");

export async function GET() {
  try {
    const config = JSON.parse(await fs.readFile(file, "utf8"));
    const items = Array.isArray(config.memorySignal)
      ? config.memorySignal.filter((entry: unknown) =>
          typeof entry === "string" &&
          (entry.startsWith("/memory/") || entry.startsWith("video:/memory/")) &&
          !entry.includes("..")
        )
      : [];
    return NextResponse.json({ items: [...new Set(items)] }, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch {
    return NextResponse.json({ items: [] }, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  }
}
