import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

const file = path.join(process.cwd(), "src", "data", "hero.json");
const authorized = (req: NextRequest) => req.cookies.get("radman_admin")?.value === "authenticated";

export async function GET(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = JSON.parse(await fs.readFile(file, "utf8"));
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const clean = {
    image: String(body.image || "/memory/radman-and-me.png").trim(),
    date: String(body.date || "").trim(),
    time: String(body.time || "").trim(),
    weight: String(body.weight || "").trim(),
    height: String(body.height || "").trim(),
    place: String(body.place || "").trim(),
    city: String(body.city || "").trim(),
    cta: String(body.cta || "ENTER THE STORY").trim(),
  };
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(clean, null, 2) + "\n", "utf8");
  return NextResponse.json(clean);
}
