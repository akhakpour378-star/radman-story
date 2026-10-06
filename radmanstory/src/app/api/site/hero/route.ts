import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

const file = path.join(process.cwd(), "src", "data", "hero.json");

const fallback = {
  image: "/memory/radman-and-me.png",
  date: "DEC / 01 / 2022",
  time: "14:15",
  weight: "3.100 kg",
  height: "49 cm",
  place: "NIKAN AQDASIEH",
  city: "Tehran · Iran",
  cta: "ENTER THE STORY",
};

export async function GET() {
  try {
    const data = JSON.parse(await fs.readFile(file, "utf8"));
    return NextResponse.json({ ...fallback, ...data }, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch {
    return NextResponse.json(fallback, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  }
}
