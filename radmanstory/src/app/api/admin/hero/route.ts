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
  heroTitle: string;
  heroTitleAccent: string;
  heroLead: string;
  siteBackground?: string;
  siteAccent?: string;
  favicon?: string;
  movingMemoryTitle?: string;
  movingMemoryEyebrow?: string;
  movingMemoryDescription?: string;
  persianFont: "iranyekan" | "iransans";
  story: StorySlide[];
  memorySignal?: string[];
  memoryTitles?: Record<string, string>;
  movingMemory?: string[];
  chapters: Chapter[];
  years: string[];
  yearsTitles: Record<string, string>;
};

type StorySlide = { eyebrow: string; title: string; lead: string; body: string; image: string; label: string };
type Chapter = { id:string; period:string; title:string; description:string; image:string };

const defaults: HeroConfig = {
  image: "/memory/radman-and-me.png",
  date: "DEC / 01 / 2022",
  time: "14:15",
  weight: "3.100 kg",
  height: "49 cm",
  place: "NIKAN AQDASIEH",
  city: "Tehran · Iran",
  cta: "ENTER THE STORY",
  heroTitle: "Radman",
  heroTitleAccent: "Forever.",
  heroLead: "تو آغاز قصه‌ای هستی که در قلب من هرگز تمام نمی‌شود.",
  movingMemoryTitle: "Photos hold time. Film holds breath.",
  movingMemoryEyebrow: "03 / MOVING MEMORY",
  movingMemoryDescription: "لحظه‌هایی که در قاب عکس جا نمی‌شوند؛ صدا، حرکت و خاطراتی که دوباره جان می‌گیرند.",
  persianFont: "iranyekan",
  story: [
    { eyebrow: "THE BEGINNING", title: "Some days / become a lifetime.", lead: "رادمان فقط یک نام در تقویم نیست؛ شروع بخشی از زندگی من است که از همان اولین لحظه، معنای تازه‌ای پیدا کرد.", body: "این داستان از یک روز خاص شروع می‌شود؛ از لحظه‌ای که حضور کوچک او، تمام جهان را برای من تغییر داد.", image: "/memory/radman-main.JPG", label: "THE FIRST FRAME" },
    { eyebrow: "THE LITTLE YEARS", title: "A childhood / made of moments.", lead: "روزهای کودکی از کنارمان آرام عبور می‌کنند؛ اما بعضی لحظه‌ها آن‌قدر عمیق می‌شوند که سال‌ها بعد هم زنده می‌مانند.", body: "لبخندها، بازی‌ها، نگاه‌ها و همان اتفاق‌های ساده، امروز بخشی از بزرگ‌ترین خاطرات من هستند.", image: "/memory/radman-01.JPG", label: "LITTLE DAYS" },
    { eyebrow: "GROWING", title: "Watching you / become yourself.", lead: "هر روز چیزی تازه در تو شکل می‌گرفت؛ یک نگاه، یک عادت، یک لبخند و جهانی که کم‌کم مخصوص خودت می‌شد.", body: "این قاب‌ها فقط عکس نیستند؛ نشانه‌هایی هستند از اینکه چطور زمان، آرام و بی‌صدا، تو را بزرگ‌تر کرد.", image: "/memory/radman-02.JPG", label: "GROWING" },
    { eyebrow: "TOGETHER", title: "Some memories / never leave.", lead: "بعضی لحظه‌ها تمام نمی‌شوند. فقط شکلشان عوض می‌شود و جایی عمیق‌تر درون ما ادامه پیدا می‌کنند.", body: "این آرشیو برای نگه داشتن همان لحظه‌هاست؛ برای اینکه هر بار که برمی‌گردیم، هنوز چیزی از آن روزها پیدا کنیم.", image: "/memory/radman-and-me.png", label: "TOGETHER" },
  ],
  years: ["/memory/radman-main.JPG", "/memory/radman-second.JPG", "/memory/radman-01.JPG", "/memory/radman-02.JPG", "/memory/radman-03.JPG", "/memory/radman-sit.jpeg", "/memory/radman-and-me.png"],
  yearsTitles: {},
  chapters: [
    { id:"birth", period:"CHAPTER 01 / THE ARRIVAL", title:"روزی که جهانم تغییر کرد", description:"از لحظه تولد و اولین دیدار تا ثبت جزئیات روزی که آغاز قصه رادمان شد.", image:"/memory/radman-main.JPG" },
    { id:"first-months", period:"CHAPTER 02 / FIRST MONTHS", title:"روزهای اول کنار تو", description:"نگاه‌های تازه، آغوش‌های طولانی و لحظه‌های کوچک ماه‌های نخست زندگی.", image:"/memory/radman-second.JPG" },
    { id:"first-steps", period:"CHAPTER 03 / FIRST STEPS", title:"اولین قدم‌ها", description:"از تلاش‌های کوچک برای ایستادن تا قدم‌هایی که هر بار دنیای تازه‌ای باز می‌کردند.", image:"/memory/radman-01.JPG" },
    { id:"words-and-play", period:"CHAPTER 04 / WORDS & PLAY", title:"کلمات، بازی‌ها و کشف‌ها", description:"واژه‌های تازه، بازی‌های دوست‌داشتنی و شکل گرفتن دنیای مخصوص خودت.", image:"/memory/radman-02.JPG" },
    { id:"kindergarten", period:"CHAPTER 05 / A NEW WORLD", title:"شروع ماجرای مهدکودک", description:"تجربه محیطی تازه، آشنایی‌ها، بازی‌های گروهی و قدم‌های نخست در دنیای بیرون از خانه.", image:"/memory/radman-03.JPG" },
    { id:"little-discoveries", period:"CHAPTER 06 / DISCOVERY", title:"ماجراجویی‌های کوچک", description:"جاهای تازه، کنجکاوی‌های کودکانه و خاطراتی که از یک روز معمولی، روزی ماندگار می‌سازند.", image:"/memory/radman-sit.jpeg" },
    { id:"together", period:"CHAPTER 07 / TOGETHER", title:"قصه‌ای که ادامه دارد", description:"لحظه‌های کنار هم بودن؛ خاطراتی برای نگه داشتن و فصل‌هایی که هنوز نوشته نشده‌اند.", image:"/memory/radman-and-me.png" },
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
      heroTitle: String(body.heroTitle ?? current.heroTitle ?? "Radman").trim().slice(0, 80) || "Radman",
      heroTitleAccent: String(body.heroTitleAccent ?? current.heroTitleAccent ?? "Forever.").trim().slice(0, 80) || "Forever.",
      heroLead: String(body.heroLead ?? current.heroLead ?? "تو آغاز قصه‌ای هستی که در قلب من هرگز تمام نمی‌شود.").trim().slice(0, 300),
      movingMemoryTitle: String(body.movingMemoryTitle ?? current.movingMemoryTitle ?? "Photos hold time. Film holds breath.").trim().slice(0, 120) || "Photos hold time. Film holds breath.",
      movingMemoryEyebrow: String(body.movingMemoryEyebrow ?? current.movingMemoryEyebrow ?? "03 / MOVING MEMORY").trim().slice(0, 80) || "03 / MOVING MEMORY",
      movingMemoryDescription: String(body.movingMemoryDescription ?? current.movingMemoryDescription ?? "لحظه‌هایی که در قاب عکس جا نمی‌شوند؛ صدا، حرکت و خاطراتی که دوباره جان می‌گیرند.").trim().slice(0, 300),
      persianFont: body.persianFont === "iransans" ? "iransans" : "iranyekan",
      years: Array.from(new Set((Array.isArray(body.years) ? body.years : (current.years || defaults.years)).filter((item: unknown) => typeof item === "string" && item.startsWith("/memory/")))).slice(0, 50),
      yearsTitles: Object.fromEntries(Object.entries(body.yearsTitles && typeof body.yearsTitles === "object" ? body.yearsTitles : (current.yearsTitles || {})).filter(([key, value]) => typeof key === "string" && key.startsWith("/memory/") && typeof value === "string").map(([key, value]) => [key, String(value).trim().slice(0, 120)])),
      memorySignal: Array.from(new Set(
        (Array.isArray(body.memorySignal) ? body.memorySignal : (current.memorySignal || []))
          .filter((item: unknown) => typeof item === "string" && (item.startsWith("/memory/") || item.startsWith("video:/memory/")))
      )).slice(0, 100),
      movingMemory: Array.from(new Set((Array.isArray(body.movingMemory) ? body.movingMemory : (current.movingMemory || [])).filter((item: unknown) => typeof item === "string" && item.startsWith("video:/memory/")))).slice(0, 60),
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
      chapters: Array.isArray(body.chapters) ? body.chapters.slice(0, 20).map((chapter: any, index: number) => ({
        id: String(chapter.id || "chapter-" + (index + 1)).trim().slice(0, 80),
        period: String(chapter.period || "").trim().slice(0, 80),
        title: String(chapter.title || "").trim().slice(0, 120),
        description: String(chapter.description || "").trim().slice(0, 600),
        image: String(chapter.image || "").trim().startsWith("/memory/") ? String(chapter.image).trim() : "/memory/radman-main.JPG",
        gallery: Array.from(new Set((Array.isArray(chapter.gallery) ? chapter.gallery : []).filter((item: unknown) => typeof item === "string" && (item.startsWith("/memory/") || item.startsWith("video:/memory/")))).values()).slice(0, 200),
      })) : current.chapters || defaults.chapters,
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
