import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-dynamic";

const file = path.join(process.cwd(), "src", "data", "hero.json");

type HeroConfig = {
  image: string;
  date: string;
  time: string;
  weight: string;
  height: string;
  place: string;
  city: string;
  cta: string;
  persianFont: "iranyekan" | "iransans";
  story: StorySlide[];
  memorySignal?: string[];
  memoryTitles?: Record<string, string>;
};

type StorySlide = { eyebrow: string; title: string; lead: string; body: string; image: string; label: string };

const defaults: HeroConfig = {
  image: "/memory/radman-and-me.png",
  date: "DEC / 01 / 2022",
  time: "14:15",
  weight: "3.100 kg",
  height: "49 cm",
  place: "NIKAN AQDASIEH",
  city: "Tehran · Iran",
  cta: "ENTER THE STORY",
  persianFont: "iranyekan",
  story: [
    { eyebrow: "THE BEGINNING", title: "Some days / become a lifetime.", lead: "رادمان فقط یک نام در تقویم نیست؛ شروع بخشی از زندگی من است که از همان اولین لحظه، معنای تازه‌ای پیدا کرد.", body: "این داستان از یک روز خاص شروع می‌شود؛ از لحظه‌ای که حضور کوچک او، تمام جهان را برای من تغییر داد.", image: "/memory/radman-main.JPG", label: "THE FIRST FRAME" },
    { eyebrow: "THE LITTLE YEARS", title: "A childhood / made of moments.", lead: "روزهای کودکی از کنارمان آرام عبور می‌کنند؛ اما بعضی لحظه‌ها آن‌قدر عمیق می‌شوند که سال‌ها بعد هم زنده می‌مانند.", body: "لبخندها، بازی‌ها، نگاه‌ها و همان اتفاق‌های ساده، امروز بخشی از بزرگ‌ترین خاطرات من هستند.", image: "/memory/radman-01.JPG", label: "LITTLE DAYS" },
    { eyebrow: "GROWING", title: "Watching you / become yourself.", lead: "هر روز چیزی تازه در تو شکل می‌گرفت؛ یک نگاه، یک عادت، یک لبخند و جهانی که کم‌کم مخصوص خودت می‌شد.", body: "این قاب‌ها فقط عکس نیستند؛ نشانه‌هایی هستند از اینکه چطور زمان، آرام و بی‌صدا، تو را بزرگ‌تر کرد.", image: "/memory/radman-02.JPG", label: "GROWING" },
    { eyebrow: "TOGETHER", title: "Some memories / never leave.", lead: "بعضی لحظه‌ها تمام نمی‌شوند. فقط شکلشان عوض می‌شود و جایی عمیق‌تر درون ما ادامه پیدا می‌کنند.", body: "این آرشیو برای نگه داشتن همان لحظه‌هاست؛ برای اینکه هر بار که برمی‌گردیم، هنوز چیزی از آن روزها پیدا کنیم.", image: "/memory/radman-and-me.png", label: "TOGETHER" },
  ],
};

const authorized = (req: NextRequest) =>
  req.cookies.get("radman_admin")?.value === "authenticated";

async function readHero(): Promise<HeroConfig> {
  try {
    return { ...defaults, ...JSON.parse(await fs.readFile(file, "utf8")) };
  } catch {
    return defaults;
  }
}

export async function GET() {
  const data = await readHero();
  return NextResponse.json(data, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

export async function PUT(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const current = await readHero();

    const clean = {
      image: String(body.image || current.image).trim(),
      date: String(body.date || current.date).trim().slice(0, 80),
      time: String(body.time || current.time).trim().slice(0, 30),
      weight: String(body.weight || current.weight).trim().slice(0, 40),
      height: String(body.height || current.height).trim().slice(0, 40),
      place: String(body.place || current.place).trim().slice(0, 100),
      city: String(body.city || current.city).trim().slice(0, 100),
      cta: String(body.cta || current.cta).trim().slice(0, 60),
      persianFont: body.persianFont === "iransans" ? "iransans" : "iranyekan",
      memorySignal: Array.from(new Set(
        (Array.isArray(body.memorySignal) ? body.memorySignal : (current.memorySignal || []))
          .filter((item: unknown) => typeof item === "string" && (item.startsWith("/memory/") || item.startsWith("video:/memory/")))
      )).slice(0, 100),
      memoryTitles: Object.fromEntries(Object.entries(body.memoryTitles && typeof body.memoryTitles === "object" ? body.memoryTitles : (current.memoryTitles || {}))
        .filter(([key, value]) => typeof key === "string" && (key.startsWith("/memory/") || key.startsWith("video:/memory/")) && typeof value === "string")
        .map(([key, value]) => [key, String(value).trim().slice(0, 100)])),
      story: Array.isArray(body.story) ? body.story.slice(0, 8).map((slide: any) => ({
        eyebrow: String(slide.eyebrow || "").trim().slice(0, 60),
        title: String(slide.title || "").trim().slice(0, 120),
        lead: String(slide.lead || "").trim().slice(0, 500),
        body: String(slide.body || "").trim().slice(0, 500),
        image: String(slide.image || "").trim(),
        label: String(slide.label || "").trim().slice(0, 80),
      })) : current.story || [],
    };

    if (!clean.image.startsWith("/memory/")) {
      return NextResponse.json({ error: "تصویر باید از پوشه memory انتخاب شود." }, { status: 400 });
    }

    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, JSON.stringify(clean, null, 2) + "\n", "utf8");

    return NextResponse.json(clean, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch {
    return NextResponse.json({ error: "ذخیره اطلاعات انجام نشد." }, { status: 400 });
  }
}
