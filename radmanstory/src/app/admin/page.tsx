"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, ArrowUpRight, Check, ChevronDown, Eye, Image as ImageIcon, Play,
  LayoutDashboard, LogOut, Save, ShieldCheck, Sparkles, LoaderCircle, Upload, Pencil, Trash2, RotateCcw, ArchiveRestore,
} from "lucide-react";
import "./admin.css";

type HeroConfig = {
  image: string; date: string; time: string; weight: string;
  height: string; place: string; city: string; cta: string;
  persianFont: "iranyekan" | "iransans";
  story: StorySlide[];
  memorySignal?: string[];
  memoryTitles?: Record<string, string>;
  movingMemory?: string[];
  chapters: Chapter[];
  years: string[];
  yearsTitles: Record<string, string>;
};
type StorySlide = { eyebrow:string; title:string; lead:string; body:string; image:string; label:string };
type Chapter = { id:string; period:string; title:string; description:string; image:string; gallery?: string[] };
type TrashItem = { id:string; src:string; original:string; trashedAt:string; file:string };

const defaults: HeroConfig = {
  image: "/memory/radman-and-me.png",
  date: "DEC / 01 / 2022", time: "14:15", weight: "3.100 kg",
  height: "49 cm", place: "NIKAN AQDASIEH", city: "Tehran · Iran",
  cta: "ENTER THE STORY",
  persianFont: "iranyekan",
  story: [
    { eyebrow:"THE BEGINNING", title:"Some days / become a lifetime.", lead:"رادمان فقط یک نام در تقویم نیست؛ شروع بخشی از زندگی من است که از همان اولین لحظه، معنای تازه‌ای پیدا کرد.", body:"این داستان از یک روز خاص شروع می‌شود؛ از لحظه‌ای که حضور کوچک او، تمام جهان را برای من تغییر داد.", image:"/memory/radman-main.JPG", label:"THE FIRST FRAME" },
    { eyebrow:"THE LITTLE YEARS", title:"A childhood / made of moments.", lead:"روزهای کودکی از کنارمان آرام عبور می‌کنند؛ اما بعضی لحظه‌ها آن‌قدر عمیق می‌شوند که سال‌ها بعد هم زنده می‌مانند.", body:"لبخندها، بازی‌ها، نگاه‌ها و همان اتفاق‌های ساده، امروز بخشی از بزرگ‌ترین خاطرات من هستند.", image:"/memory/radman-01.JPG", label:"LITTLE DAYS" },
    { eyebrow:"GROWING", title:"Watching you / become yourself.", lead:"هر روز چیزی تازه در تو شکل می‌گرفت؛ یک نگاه، یک عادت، یک لبخند و جهانی که کم‌کم مخصوص خودت می‌شد.", body:"این قاب‌ها فقط عکس نیستند؛ نشانه‌هایی هستند از اینکه چطور زمان، آرام و بی‌صدا، تو را بزرگ‌تر کرد.", image:"/memory/radman-02.JPG", label:"GROWING" },
    { eyebrow:"TOGETHER", title:"Some memories / never leave.", lead:"بعضی لحظه‌ها تمام نمی‌شوند. فقط شکلشان عوض می‌شود و جایی عمیق‌تر درون ما ادامه پیدا می‌کنند.", body:"این آرشیو برای نگه داشتن همان لحظه‌هاست؛ برای اینکه هر بار که برمی‌گردیم، هنوز چیزی از آن روزها پیدا کنیم.", image:"/memory/radman-and-me.png", label:"TOGETHER" },
  ],
  chapters: [
    { id:"birth", period:"CHAPTER 01 / THE ARRIVAL", title:"روزی که جهانم تغییر کرد", description:"از لحظه تولد و اولین دیدار تا ثبت جزئیات روزی که آغاز قصه رادمان شد.", image:"/memory/radman-main.JPG" },
    { id:"first-months", period:"CHAPTER 02 / FIRST MONTHS", title:"روزهای اول کنار تو", description:"نگاه‌های تازه، آغوش‌های طولانی و لحظه‌های کوچک ماه‌های نخست زندگی.", image:"/memory/radman-second.JPG" },
    { id:"first-steps", period:"CHAPTER 03 / FIRST STEPS", title:"اولین قدم‌ها", description:"از تلاش‌های کوچک برای ایستادن تا قدم‌هایی که هر بار دنیای تازه‌ای باز می‌کردند.", image:"/memory/radman-01.JPG" },
    { id:"words-and-play", period:"CHAPTER 04 / WORDS & PLAY", title:"کلمات، بازی‌ها و کشف‌ها", description:"واژه‌های تازه، بازی‌های دوست‌داشتنی و شکل گرفتن دنیای مخصوص خودت.", image:"/memory/radman-02.JPG" },
    { id:"kindergarten", period:"CHAPTER 05 / A NEW WORLD", title:"شروع ماجرای مهدکودک", description:"تجربه محیطی تازه، آشنایی‌ها، بازی‌های گروهی و قدم‌های نخست در دنیای بیرون از خانه.", image:"/memory/radman-03.JPG" },
    { id:"little-discoveries", period:"CHAPTER 06 / DISCOVERY", title:"ماجراجویی‌های کوچک", description:"جاهای تازه، کنجکاوی‌های کودکانه و خاطراتی که از یک روز معمولی، روزی ماندگار می‌سازند.", image:"/memory/radman-sit.jpeg" },
    { id:"together", period:"CHAPTER 07 / TOGETHER", title:"قصه‌ای که ادامه دارد", description:"لحظه‌های کنار هم بودن؛ خاطراتی برای نگه داشتن و فصل‌هایی که هنوز نوشته نشده‌اند.", image:"/memory/radman-and-me.png" },
  ],
  years: ["/memory/radman-main.JPG", "/memory/radman-second.JPG", "/memory/radman-01.JPG", "/memory/radman-02.JPG", "/memory/radman-03.JPG", "/memory/radman-sit.jpeg", "/memory/radman-and-me.png"],
  yearsTitles: {},
};

const fieldMeta: Record<keyof Omit<HeroConfig, "image" | "persianFont" | "story" | "memorySignal" | "memoryTitles">, { label: string; hint: string }> = {
  date: { label: "تاریخ تولد", hint: "DEC / 01 / 2022" },
  time: { label: "ساعت تولد", hint: "14:15" },
  weight: { label: "وزن هنگام تولد", hint: "3.100 kg" },
  height: { label: "قد هنگام تولد", hint: "49 cm" },
  place: { label: "محل تولد", hint: "NIKAN AQDASIEH" },
  city: { label: "شهر / کشور", hint: "Tehran · Iran" },
  cta: { label: "متن دکمه ورود", hint: "ENTER THE STORY" },
};

const fontMeta = {
  iranyekan: { label: "ایران یکان", description: "برای متن‌های فارسی مدرن و مینیمال" },
  iransans: { label: "ایران سنس", description: "برای متن‌های فارسی رسمی و خوانا" },
} as const;

function mediaUrl(src: string) {
  return src.startsWith("/memory/")
    ? `/api/memory?file=${encodeURIComponent(src.slice(1))}`
    : src;
}

export default function AdminPage() {
  const [config, setConfig] = useState<HeroConfig>(defaults);
  const [savedConfig, setSavedConfig] = useState<HeroConfig>(defaults);
  const [images, setImages] = useState<string[]>([]);
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [allMedia, setAllMedia] = useState<string[]>([]);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [libraryTarget, setLibraryTarget] = useState<{ type: "hero" | "story"; index?: number } | null>(null);
  const [libraryFilter, setLibraryFilter] = useState<"all" | "image" | "video">("all");
  const [librarySearch, setLibrarySearch] = useState("");
  const [libraryFolder, setLibraryFolder] = useState<string | null>(null);
  const [selectedLibraryItems, setSelectedLibraryItems] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [memoryUploadType, setMemoryUploadType] = useState<"image" | "video" | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState<"dashboard" | "hero" | "story" | "years" | "chapters" | "memory" | "moving" | "library" | "trash">("dashboard");
  const [editingStory, setEditingStory] = useState<number | null>(null);
  const [editingChapter, setEditingChapter] = useState<number>(0);
  const [editingMemory, setEditingMemory] = useState<string | null>(null);
  const [selectedMemoryKeys, setSelectedMemoryKeys] = useState<string[]>([]);
  const [selectedStoryIndexes, setSelectedStoryIndexes] = useState<number[]>([]);
  const [trashItems, setTrashItems] = useState<TrashItem[]>([]);
  const [selectedTrashIds, setSelectedTrashIds] = useState<string[]>([]);
  const [memoryNameDraft, setMemoryNameDraft] = useState("");

  const goToSection = (section: "dashboard" | "hero" | "story" | "years" | "chapters" | "memory" | "moving" | "library" | "trash") => {
    setActiveSection(section);
    try {
      const params = new URLSearchParams(window.location.search);
      if (section === "dashboard") params.delete("section"); else params.set("section", section);
      if (section !== "story") params.delete("story");
      if (section !== "chapters") params.delete("chapter");
      if (section !== "memory") params.delete("memory");
      const query = params.toString();
      window.history.replaceState(null, "", query ? "/admin?" + query : "/admin");
    } catch {}
  };

  const openStoryEditor = (index: number) => {
    goToSection("story"); setEditingStory(index);
    try {
      const params = new URLSearchParams(window.location.search);
      params.set("section", "story"); params.set("story", String(index)); params.delete("memory");
      window.history.replaceState(null, "", "/admin?" + params.toString());
    } catch {}
  };

  const openMemoryEditor = (key: string) => {
    goToSection("memory"); setEditingMemory(key); setMemoryNameDraft(key.split("/").pop()?.replace(/^video:/, "") || "");
    try {
      const params = new URLSearchParams(window.location.search);
      params.set("section", "memory"); params.set("memory", key); params.delete("story");
      window.history.replaceState(null, "", "/admin?" + params.toString());
    } catch {}
  };

  const dirty = JSON.stringify(config) !== JSON.stringify(savedConfig);
  const preview = useMemo(() => mediaUrl(config.image), [config.image]);

  const restoreAdminRoute = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const section = params.get("section");
      if (section === "dashboard" || section === "hero" || section === "story" || section === "years" || section === "chapters" || section === "memory" || section === "moving" || section === "library" || section === "trash") setActiveSection(section);
      const story = params.get("story");
      if (story !== null && story !== "") {
        const n = Number(story);
        if (Number.isInteger(n) && n >= 0) setEditingStory(n);
      }
      const chapter = params.get("chapter");
      if (chapter !== null && chapter !== "") { const n = Number(chapter); if (Number.isInteger(n) && n >= 0) setEditingChapter(n); }
      const memory = params.get("memory");
      if (memory) setEditingMemory(memory);
    } catch {}
  };

  useEffect(() => {
    restoreAdminRoute();
  }, []);

  useEffect(() => {
    let alive = true;
    Promise.all([
      fetch("/api/admin/auth", { cache: "no-store" }),
      fetch("/api/admin/hero", { cache: "no-store" }),
      fetch("/api/memory?list=1", { cache: "no-store" }),
      fetch("/api/admin/trash", { cache: "no-store" }),
    ])
      .then(async ([authRes, heroRes, mediaRes, trashRes]) => {
        if (!alive) return;
        let heroData: HeroConfig = defaults;
        const auth = authRes.ok ? await authRes.json() : { authenticated: false };
        if (heroRes.ok) {
          heroData = { ...defaults, ...(await heroRes.json()) };
          heroData.memorySignal = Array.from(new Set(heroData.memorySignal || []));
        }
        if (mediaRes.ok) {
          const media = await mediaRes.json();
          const memoryImages = Array.isArray(media.memoryImages) ? media.memoryImages : (Array.isArray(media.images) ? media.images : []);
          const memoryVideos = Array.isArray(media.memoryVideos) ? media.memoryVideos : (Array.isArray(media.videos) ? media.videos : []);
          const availableMemory = new Set<string>([
            ...memoryImages,
            ...memoryVideos.map((v: string) => "video:" + v),
          ]);
          const normalizedSignal = (heroData.memorySignal || []).filter((key) => availableMemory.has(key));
          const cleanedHero = { ...heroData, memorySignal: normalizedSignal };
          setConfig(cleanedHero);
          setSavedConfig(cleanedHero);
          setImages(memoryImages);
          setVideos(memoryVideos);
          setHeroImages(Array.isArray(media.heroImages) ? media.heroImages : []);
          setAllMedia([...(Array.isArray(media.images) ? media.images : []), ...(Array.isArray(media.videos) ? media.videos.map((v: string) => "video:" + v) : [])]);

          // پاک‌سازی ارجاع‌های قدیمی که فایل فیزیکی آن‌ها دیگر وجود ندارد.
          if (normalizedSignal.length !== (heroData.memorySignal || []).length) {
            void fetch("/api/admin/hero", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(cleanedHero),
            });
          }
        } else {
          setConfig(heroData);
          setSavedConfig(heroData);
        }
        if (trashRes.ok) {
          const trash = await trashRes.json();
          setTrashItems(Array.isArray(trash.items) ? trash.items : []);
        }
        setAuthenticated(Boolean(auth.authenticated));
      })
      .catch(() => setError("اتصال به سرور برقرار نشد."))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, []);

  const update = <K extends keyof HeroConfig>(key: K, value: HeroConfig[K]) => {
    setSaved(false); setError("");
    setConfig((current) => ({ ...current, [key]: value }));
  };

  const login = async (e: FormEvent) => {
    e.preventDefault(); setError("");
    const r = await fetch("/api/admin/auth", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!r.ok) { setError("رمز ورود صحیح نیست."); return; }
    const data = await fetch("/api/admin/hero", { cache: "no-store" }).then((x) => x.json());
    const nextData = { ...defaults, ...data, memorySignal: Array.from(new Set(data?.memorySignal || [])) };
    setConfig(nextData); setSavedConfig(nextData);
    setAuthenticated(true); setPassword("");
  };

  const save = async () => {
    if (!dirty) return;
    setSaving(true); setSaved(false); setError("");
    try {
      const r = await fetch("/api/admin/hero", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "ذخیره انجام نشد.");
      const next = { ...defaults, ...data };
      setConfig(next); setSavedConfig(next); setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "ذخیره انجام نشد.");
    } finally { setSaving(false); }
  };

  const reset = () => { setConfig(savedConfig); setSaved(false); setError(""); };
  const restoreDefaults = () => { setConfig(defaults); setSaved(false); setError(""); };
  const updateStory = (index: number, key: keyof StorySlide, value: string) => { setSaved(false); setError(""); setConfig(c => ({ ...c, story: c.story.map((slide,i) => i === index ? { ...slide, [key]: value } : slide) })); };
  const updateChapter = (index: number, key: keyof Chapter, value: string) => { setSaved(false); setError(""); setConfig(c => ({ ...c, chapters: (c.chapters || []).map((chapter,i) => i === index ? { ...chapter, [key]: value } : chapter) })); };
  const addChapter = () => {
    if ((config.chapters || []).length >= 20) { setError("حداکثر ۲۰ فصل قابل تعریف است."); return; }
    const index = (config.chapters || []).length;
    const chapter: Chapter = { id:"chapter-" + Date.now().toString(36), period:"CHAPTER " + String(index + 1).padStart(2,"0") + " / NEW MEMORY", title:"عنوان فصل جدید", description:"روایت این فصل را اینجا بنویس.", image: config.image, gallery: [] };
    setConfig(c => ({ ...c, chapters:[...(c.chapters || []), chapter] })); setEditingChapter(index); setSaved(false); setError("");
  };
  const uploadChapterMedia = async (file: File, type: "image" | "video") => {
    const isVideo = type === "video";
    if (isVideo ? !file.type.startsWith("video/") : !file.type.startsWith("image/")) {
      setError(isVideo ? "فقط فایل ویدیویی قابل آپلود است." : "فقط فایل تصویری قابل آپلود است.");
      return;
    }
    if (file.size > (isVideo ? 100 : 15) * 1024 * 1024) {
      setError(isVideo ? "حجم ویدیو نباید بیشتر از ۱۰۰ مگابایت باشد." : "حجم تصویر نباید بیشتر از ۱۵ مگابایت باشد.");
      return;
    }
    setUploading(true); setSaved(false); setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("section", "chapters");
      const response = await fetch("/api/admin/memory", { method: "POST", body: form });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "آپلود رسانه انجام نشد.");
      const src = String(data.src || (isVideo ? data.video : data.image));
      const key = isVideo ? "video:" + src : src;
      setConfig(current => ({
        ...current,
        chapters: (current.chapters || []).map((chapter, index) =>
          index === editingChapter
            ? { ...chapter, gallery: Array.from(new Set([...(chapter.gallery || []), key])) }
            : chapter
        ),
      }));
      if (isVideo) setVideos(current => current.includes(src) ? current : [src, ...current]);
      else setImages(current => current.includes(src) ? current : [src, ...current]);
      setAllMedia(current => current.includes(key) ? current : [key, ...current]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "آپلود رسانه انجام نشد.");
    } finally {
      setUploading(false);
    }
  };

  const removeChapterGalleryItem = (chapterIndex: number, key: string) => {
    setSaved(false); setError("");
    setConfig(current => ({
      ...current,
      chapters: (current.chapters || []).map((chapter, index) =>
        index === chapterIndex
          ? { ...chapter, gallery: (chapter.gallery || []).filter(item => item !== key) }
          : chapter
      ),
    }));
  };

  const removeChapter = (index: number) => {
    if ((config.chapters || []).length <= 1) { setError("حداقل یک فصل باید باقی بماند."); return; }
    setConfig(c => ({ ...c, chapters:(c.chapters || []).filter((_,i) => i !== index) }));
    setEditingChapter(Math.max(0, Math.min(index, (config.chapters || []).length - 2))); setSaved(false); setError("");
  };
  const moveChapter = (index: number, direction: -1 | 1) => {
    setConfig(c => { const next=[...(c.chapters || [])]; const target=index+direction; if(target<0 || target>=next.length) return c; [next[index],next[target]]=[next[target],next[index]]; return {...c,chapters:next}; }); setEditingChapter(index+direction); setSaved(false); setError("");
  };
  const addStorySlide = () => {
    if (config.story.length >= 8) { setError("حداکثر ۸ اسلاید برای Story قابل تعریف است."); return; }
    setSaved(false); setError("");
    setConfig(c => ({ ...c, story: [...c.story, { eyebrow:"NEW CHAPTER", title:"A new memory / begins here.", lead:"متن اصلی این اسلاید را وارد کنید.", body:"توضیحات این اسلاید را وارد کنید.", image:c.image, label:"NEW MEMORY" }] }));
  };
  const uploadImage = async (file: File, section: "hero" | "story" | "chapters", apply?: (src: string) => void) => {
    if (!file.type.startsWith("image/")) { setError("فقط فایل تصویری قابل آپلود است."); return; }
    if (file.size > 15 * 1024 * 1024) { setError("حجم تصویر نباید بیشتر از ۱۵ مگابایت باشد."); return; }
    setUploading(true); setError(""); setSaved(false);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("section", section);
      const r = await fetch("/api/admin/memory", { method: "POST", body: form });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "آپلود تصویر انجام نشد.");
      const src = String(data.image);      if (section === "hero") setHeroImages(current => current.includes(src) ? current : [src, ...current]);
      else setImages(current => current.includes(src) ? current : [src, ...current]);
      if (apply) apply(src);
    } catch (e) {
      setError(e instanceof Error ? e.message : "آپلود تصویر انجام نشد.");
    } finally {
      setUploading(false);
    }
  };

  const uploadMemoryMedia = async (file: File, type: "image" | "video") => {
    const isVideo = type === "video"; const prefix = isVideo ? "ویدیو" : "تصویر";
    if (isVideo ? !file.type.startsWith("video/") : !file.type.startsWith("image/")) { setError(`فقط فایل ${prefix} قابل آپلود است.`); return; }
    if (file.size > 100 * 1024 * 1024) { setError(`حجم ${prefix} نباید بیشتر از ۱۰۰ مگابایت باشد.`); return; }
    setMemoryUploadType(type); setError(""); setSaved(false);
    try {
      const form = new FormData(); form.append("file", file); form.append("section", "memory");
      const r = await fetch("/api/admin/memory", { method: "POST", body: form }); const data = await r.json();
      if (!r.ok) throw new Error(data?.error || `آپلود ${prefix} انجام نشد.`);
      const src = String(data.src || (isVideo ? data.video : data.image));
      if (isVideo) setVideos(current => current.includes(src) ? current : [src, ...current]); else setImages(current => current.includes(src) ? current : [src, ...current]);
      const mediaKey = isVideo ? "video:" + src : src;
      const next = { ...config, memorySignal: Array.from(new Set([...(config.memorySignal || []), mediaKey])) };
      const saveRes = await fetch("/api/admin/hero", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(next) });
      const saveData = await saveRes.json();
      if (!saveRes.ok) throw new Error(saveData?.error || "اعمال رسانه روی سایت انجام نشد.");
      const persisted = { ...defaults, ...saveData };
      setConfig(persisted); setSavedConfig(persisted);
      setAllMedia(current => current.includes(isVideo ? "video:" + src : src) ? current : [isVideo ? "video:" + src : src, ...current]);
    } catch (e) { setError(e instanceof Error ? e.message : `آپلود ${prefix} انجام نشد.`); }
    finally { setMemoryUploadType(null); }
  };

  const uploadMovingMemoryVideo = async (file: File) => {
    if (!file.type.startsWith("video/")) { setError("برای MOVING MEMORY فقط فایل ویدیویی قابل آپلود است."); return; }
    if (file.size > 100 * 1024 * 1024) { setError("حجم ویدیو نباید بیشتر از ۱۰۰ مگابایت باشد."); return; }
    setUploading(true); setSaved(false); setError("");
    try { const form = new FormData(); form.append("file", file); form.append("section", "moving-memory"); const response = await fetch("/api/admin/memory", { method: "POST", body: form }); const data = await response.json(); if (!response.ok) throw new Error(data?.error || "آپلود ویدیو انجام نشد."); const src = String(data.src || data.video || ""); if (!src.startsWith("/memory/")) throw new Error("مسیر ویدیوی برگشتی معتبر نیست."); const key = "video:" + src; setVideos(current => current.includes(src) ? current : [src, ...current]); setAllMedia(current => current.includes(key) ? current : [key, ...current]); setConfig(current => ({ ...current, movingMemory: Array.from(new Set([...(current.movingMemory || []), key])) })); }
    catch (e) { setError(e instanceof Error ? e.message : "آپلود ویدیو انجام نشد."); } finally { setUploading(false); }
  };
  const toggleMovingMemory = (key: string) => { setSaved(false); setError(""); setConfig(current => { const items = current.movingMemory || []; return { ...current, movingMemory: items.includes(key) ? items.filter(item => item !== key) : [...items, key] }; }); };

  const uploadYearsImage = async (file: File) => {
    if (!file.type.startsWith("image/")) { setError("برای THE YEARS فقط فایل تصویری قابل آپلود است."); return; }
    if (file.size > 15 * 1024 * 1024) { setError("حجم تصویر نباید بیشتر از ۱۵ مگابایت باشد."); return; }
    setUploading(true); setError(""); setSaved(false);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("section", "years");
      const response = await fetch("/api/admin/memory", { method: "POST", body: form });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "آپلود تصویر انجام نشد.");
      const src = String(data.src || data.image || "");
      if (!src.startsWith("/memory/")) throw new Error("مسیر تصویر برگشتی معتبر نیست.");
      setImages(current => current.includes(src) ? current : [src, ...current]);
      setAllMedia(current => current.includes(src) ? current : [src, ...current]);
      setConfig(current => ({ ...current, years: Array.from(new Set([...(current.years || []), src])), yearsTitles: { ...(current.yearsTitles || {}), [src]: current.yearsTitles?.[src] || "" } }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "آپلود تصویر انجام نشد.");
    } finally { setUploading(false); }
  };

  const removeYearsImage = (src: string) => {
    setConfig(current => ({ ...current, years: (current.years || []).filter(item => item !== src), yearsTitles: Object.fromEntries(Object.entries(current.yearsTitles || {}).filter(([key]) => key !== src)) }));
    setSaved(false); setError("");
  };

  const moveYearsImage = (index: number, direction: -1 | 1) => {
    setConfig(current => {
      const next = [...(current.years || [])];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...current, years: next };
    });
    setSaved(false); setError("");
  };

  const deleteMemoryMedia = async (item: { key: string; src: string; type: "image" | "video" }) => {
    if (!window.confirm(`آیا از حذف این رسانه مطمئن هستید؟ این فایل از آرشیو نیز حذف می‌شود.`)) return;
    setError(""); setSaved(false);
    try {
      const r = await fetch("/api/admin/memory", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ src: item.src.startsWith("video:") ? item.src.slice(6) : item.src }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "حذف رسانه انجام نشد.");
      if (item.type === "video") setVideos(current => current.filter(src => src !== item.src));
      else setImages(current => current.filter(src => src !== item.src));
      const next = {
        ...config,
        memorySignal: (config.memorySignal || []).filter(x => x !== item.key),
      };
      const saveRes = await fetch("/api/admin/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      const saveData = await saveRes.json();
      if (!saveRes.ok) throw new Error(saveData?.error || "اعمال حذف روی سایت انجام نشد.");
      const persisted = { ...defaults, ...saveData, memorySignal: Array.from(new Set(saveData?.memorySignal || [])) };
      setConfig(persisted);
      setSavedConfig(persisted);
      setSelectedMemoryKeys(current => current.filter(x => x !== item.key));
      await refreshTrash();
      if (editingMemory === item.key) { setEditingMemory(null); goToSection("memory"); }
    } catch (e) {
      setError(e instanceof Error ? e.message : "حذف رسانه انجام نشد.");
    }
  };

  const renameMemoryMedia = async (item: { key: string; src: string; type: "image" | "video" }, name: string) => {
    const clean = name.trim();
    if (!clean) { setError("نام فایل را وارد کنید."); return; }
    setError(""); setSaved(false);
    try {
      const r = await fetch("/api/admin/memory", { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({src:item.src,name:clean}) });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "ویرایش نام فایل انجام نشد.");
      const nextSrc = String(data.src);
      const oldKey = item.key;
      const nextKey = item.type === "video" ? "video:" + nextSrc : nextSrc;
      const next = { ...config, memorySignal: (config.memorySignal || []).map(x => x === oldKey ? nextKey : x) };
      const saveRes = await fetch("/api/admin/hero", { method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify(next) });
      const saveData = await saveRes.json();
      if (!saveRes.ok) throw new Error(saveData?.error || "نام جدید روی سایت اعمال نشد.");
      const persisted = { ...defaults, ...saveData, memorySignal:Array.from(new Set(saveData?.memorySignal || [])) };
      setConfig(persisted); setSavedConfig(persisted);
      setSelectedMemoryKeys(current => current.map(x => x === oldKey ? nextKey : x));
      setEditingMemory(nextKey);
      setMemoryNameDraft(nextKey.split("/").pop() || "");
      await new Promise<void>(resolve => setTimeout(resolve, 0));
    } catch(e) { setError(e instanceof Error ? e.message : "ویرایش نام فایل انجام نشد."); }
  };

  const replaceMemoryImage = async (item: { key: string; src: string; type: "image" | "video" }, file: File) => {
    if (item.type !== "image") return;
    if (!file.type.startsWith("image/")) { setError("فقط فایل تصویری قابل آپلود است."); return; }
    if (file.size > 15 * 1024 * 1024) { setError("حجم تصویر نباید بیشتر از ۱۵ مگابایت باشد."); return; }
    setUploading(true); setError(""); setSaved(false);
    try {
      const form = new FormData(); form.append("file", file); form.append("section", "memory");
      const r = await fetch("/api/admin/memory", { method: "POST", body: form });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "آپلود تصویر انجام نشد.");
      const src = String(data.src || data.image);
      const oldKey = item.key;
      const next = { ...config, memorySignal: Array.from(new Set((config.memorySignal || []).map(x => x === oldKey ? src : x))) };
      const saveRes = await fetch("/api/admin/hero", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(next) });
      const saveData = await saveRes.json();
      if (!saveRes.ok) throw new Error(saveData?.error || "اعمال تصویر جدید انجام نشد.");
      const delRes = await fetch("/api/admin/memory", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ src: item.src.startsWith("video:") ? item.src.slice(6) : item.src }) });
      if (!delRes.ok) throw new Error("تصویر قبلی حذف نشد.");
      const persisted = { ...defaults, ...saveData };
      setConfig(persisted); setSavedConfig(persisted);
      setImages(current => [src, ...current.filter(x => x !== item.src)]);
      setSelectedMemoryKeys(current => current.map(x => x === oldKey ? src : x));
      setEditingMemory(src);
    } catch (e) { setError(e instanceof Error ? e.message : "جایگزینی تصویر انجام نشد."); }
    finally { setUploading(false); }
  };

  const bulkDeleteMemory = async () => {
    if (!selectedMemoryKeys.length) return;
    if (!window.confirm(`آیا از حذف ${selectedMemoryKeys.length} رسانه انتخاب‌شده مطمئن هستید؟`)) return;
    setError(""); setSaved(false);
    try {
      // انتخاب‌ها را مستقیماً از Memory Signal می‌گیریم؛ حتی اگر فایل فیزیکی قبلاً حذف شده باشد.
      // API در این حالت آن را از سطل زباله صرفاً به‌عنوان فایل موجود منتقل نمی‌کند،
      // اما ارجاع قدیمی از تنظیمات حذف می‌شود و کل عملیات موفق تلقی می‌شود.
      const items = selectedMemoryKeys.map((key) => {
        const isVideo = key.startsWith("video:");
        return { key, src: isVideo ? key.slice(6) : key, type: isVideo ? ("video" as const) : ("image" as const) };
      });
      const r = await fetch("/api/admin/memory", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ srcs: items.map(item => item.src) }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data?.error || "حذف رسانه‌ها انجام نشد.");
      const keys = new Set(items.map(x => x.key));
      const next = { ...config, memorySignal: Array.from(new Set(config.memorySignal || [])).filter(x => !keys.has(x)) };
      const saveRes = await fetch("/api/admin/hero", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(next) });
      const saveData = await saveRes.json();
      if (!saveRes.ok) throw new Error(saveData?.error || "اعمال حذف‌ها روی سایت انجام نشد.");
      setImages(current => current.filter(x => !items.some(i => i.type === "image" && i.src === x)));
      setVideos(current => current.filter(x => !items.some(i => i.type === "video" && i.src === x)));
      setConfig({ ...defaults, ...saveData, memorySignal: Array.from(new Set(saveData?.memorySignal || [])) });
      setSavedConfig({ ...defaults, ...saveData, memorySignal: Array.from(new Set(saveData?.memorySignal || [])) });
      setSelectedMemoryKeys([]); setEditingMemory(null); goToSection("memory");
      await refreshTrash();
    } catch (e) { setError(e instanceof Error ? e.message : "حذف گروهی انجام نشد."); }
  };

  const refreshTrash = async () => {
    const r = await fetch("/api/admin/trash", { cache: "no-store" });
    if (r.ok) {
      const data = await r.json();
      setTrashItems(Array.isArray(data.items) ? data.items : []);
    }
  };

  const restoreTrash = async (ids: string[]) => {
    if (!ids.length) return;
    setError("");
    try {
      const r = await fetch("/api/admin/trash", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({action:"restore",ids}) });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "بازیابی انجام نشد.");
      await refreshTrash();
      setSelectedTrashIds([]);
      setSaved(false);
      const media = await fetch("/api/memory?list=1", {cache:"no-store"}).then(x=>x.json());
      setImages(Array.isArray(media.memoryImages) ? media.memoryImages : []);
      setVideos(Array.isArray(media.memoryVideos) ? media.memoryVideos : []);
      setAllMedia([...(Array.isArray(media.images) ? media.images : []), ...(Array.isArray(media.videos) ? media.videos.map((v:string)=>"video:"+v) : [])]);
    } catch(e) { setError(e instanceof Error ? e.message : "بازیابی انجام نشد."); }
  };

  const permanentDeleteTrash = async (ids: string[]) => {
    if (!ids.length || !window.confirm("این موارد برای همیشه حذف شوند؟ این عملیات قابل بازگشت نیست.")) return;
    setError("");
    try {
      const r = await fetch("/api/admin/trash", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({action:"permanent",ids}) });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "حذف دائمی انجام نشد.");
      await refreshTrash();
      setSelectedTrashIds([]);
    } catch(e) { setError(e instanceof Error ? e.message : "حذف دائمی انجام نشد."); }
  };

  const bulkDeleteStory = () => {
    if (!selectedStoryIndexes.length) return;
    if (config.story.length - selectedStoryIndexes.length < 1) { setError("حداقل یک اسلاید باید باقی بماند."); return; }
    if (!window.confirm(`آیا از حذف ${selectedStoryIndexes.length} اسلاید انتخاب‌شده مطمئن هستید؟`)) return;
    setConfig(current => ({ ...current, story: current.story.filter((_, i) => !selectedStoryIndexes.includes(i)) }));
    setSelectedStoryIndexes([]); setEditingStory(null); goToSection("story"); setSaved(false); setError("");
  };

  const openLibrary = (target: { type: "hero" | "story"; index?: number }) => {
    setLibraryTarget(target); setLibraryFilter("all"); setLibrarySearch(""); setLibraryOpen(true);
  };
  const selectLibraryMedia = (value: string) => {
    if (!libraryTarget) return;
    const src = value.startsWith("video:") ? value.slice(6) : value;
    if (libraryTarget.type === "hero") update("image", src);
    else if (libraryTarget.index !== undefined) updateStory(libraryTarget.index, "image", src);
    setLibraryOpen(false); setLibraryTarget(null);
  };
  const filteredLibrary = allMedia.filter((item) => {
    const isVideo = item.startsWith("video:");
    const src = isVideo ? item.slice(6) : item;
    const matchesType = libraryFilter === "all" || (libraryFilter === "video" ? isVideo : !isVideo);
    const matchesSearch = !librarySearch.trim() || src.toLowerCase().includes(librarySearch.trim().toLowerCase());
    return matchesType && matchesSearch;
  });
  const removeStorySlide = (index: number) => {
    if (config.story.length <= 1) { setError("حداقل یک اسلاید باید باقی بماند."); return; }
    setSaved(false); setError("");
    setConfig(c => ({ ...c, story: c.story.filter((_, i) => i !== index) }));
  };

  const logout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setAuthenticated(false);
  };

  if (!authenticated) {
    return (
      <main className="admin-login" dir="rtl">
        <div className="admin-login__glow" />
        <form className="admin-login__card" onSubmit={login}>
          <div className="admin-brand"><span>R</span><b>RADMAN</b></div>
          <p className="admin-kicker">RADMAN / CONTENT STUDIO</p>
          <h1>مدیریت محتوا</h1>
          <p>برای ورود به پنل مدیریت، رمز عبور را وارد کنید.</p>
          <label>رمز عبور<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus /></label>
          {error && <div className="admin-error">{error}</div>}
          <button className="admin-primary" type="submit">ورود به پنل <ArrowLeft size={15} /></button>
        </form>
      </main>
    );
  }

  return (
    <main className="admin-shell" dir="rtl">
      <aside className="admin-sidebar">
        <div className="admin-brand"><span>R</span><b>RADMAN</b></div>
        <div className="admin-sidebar__label">CONTROL CENTER</div>
        <button type="button" className={`admin-nav ${activeSection === "dashboard" ? "admin-nav--active" : ""}`} onClick={() => goToSection("dashboard")}><LayoutDashboard size={16} /><span>داشبورد</span><i>HOME</i></button>
        <button type="button" className={`admin-nav ${activeSection === "hero" ? "admin-nav--active" : ""}`} onClick={() => goToSection("hero")}><ImageIcon size={16} /><span>Hero / صفحه آغازین</span><i>LIVE</i></button>
        <button type="button" className={`admin-nav ${activeSection === "story" ? "admin-nav--active" : ""}`} onClick={() => goToSection("story")}><Sparkles size={16} /><span>Story / معرفی</span><i>LIVE</i></button>
        <button type="button" className={`admin-nav ${activeSection === "years" ? "admin-nav--active" : ""}`} onClick={() => goToSection("years")}><ImageIcon size={16} /><span>THE YEARS / خط زمان</span><i>{config.years?.length || 0}</i></button>
        <button type="button" className={`admin-nav ${activeSection === "memory" ? "admin-nav--active" : ""}`} onClick={() => goToSection("memory")}><ImageIcon size={16} /><span>Memory Signal / رسانه‌ها</span><i>LIVE</i></button>
        <button type="button" className={`admin-nav ${activeSection === "moving" ? "admin-nav--active" : ""}`} onClick={() => goToSection("moving")}><Play size={16} /><span>MOVING MEMORY / ویدیوها</span><i>{config.movingMemory?.length || 0}</i></button>
        <button type="button" className={`admin-nav ${activeSection === "trash" ? "admin-nav--active" : ""}`} onClick={() => goToSection("trash")}><ArchiveRestore size={16} /><span>سطل آشغال</span><i>{trashItems.length}</i></button>
        <button type="button" className={`admin-nav ${activeSection === "library" ? "admin-nav--active" : ""}`} onClick={() => goToSection("library")}><ImageIcon size={16} /><span>Media Library / کتابخانه</span><i>{allMedia.length}</i></button>
        <button type="button" className={`admin-nav ${activeSection === "chapters" ? "admin-nav--active" : ""}`} onClick={() => goToSection("chapters")}><ImageIcon size={16} /><span>Chapters / فصل‌ها</span><i>{config.chapters?.length || 0}</i></button>
        <div className="admin-sidebar__bottom">
          <div><ShieldCheck size={15} /> پنل خصوصی</div>
          <button onClick={logout}><LogOut size={14} /> خروج</button>
        </div>
      </aside>

      <section className={`admin-content ${["hero", "story", "memory", "moving", "trash"].includes(activeSection) ? "admin-content--studio" : ""}`}>
        {activeSection === "dashboard" ? (
          <div className="admin-dashboard">
            <header className="admin-dashboard__hero">
              <div>
                <span className="admin-kicker">RADMAN / CONTENT SYSTEM</span>
                <h1>خوش آمدی به <em>داشبورد</em></h1>
                <p>مرکز مدیریت و کنترل محتوای داستان رادمان.</p>
              </div>
              <div className="admin-dashboard__status"><i /> SYSTEM ONLINE</div>
            </header>
            <div className="admin-dashboard__grid">
              <button className="admin-dashboard__card admin-dashboard__card--hero" onClick={() => goToSection("hero")}>
                <div className="admin-dashboard__icon"><ImageIcon size={19} /></div>
                <span>01 / MODULE</span>
                <h2>Hero</h2>
                <p>ویرایش تصویر، تاریخ، ساعت، وزن، قد، محل تولد و متن ورود به داستان.</p>
                <b>EDIT HERO <ArrowLeft size={14} /></b>
              </button>
              <div className="admin-dashboard__card admin-dashboard__card--stat">
                <span>PUBLIC STATUS</span><strong>LIVE</strong><p>سایت عمومی فعال و متصل به سیستم مدیریت است.</p>
              </div>
              <button className="admin-dashboard__card" onClick={() => goToSection("chapters")}><div className="admin-dashboard__icon"><Sparkles size={19} /></div><span>02 / MODULE</span><h2>Chapters</h2><p>مدیریت فصل‌های زندگی رادمان؛ ترتیب، عنوان، روایت و تصویر هر فصل.</p><b>EDIT CHAPTERS <ArrowLeft size={14} /></b></button>
              <div className="admin-dashboard__card admin-dashboard__card--stat"><span>ACTIVE MODULES</span><strong>{(config.chapters || []).length + 3}</strong><p>بخش‌های محتوایی متصل به پنل مدیریت.</p></div>
            </div>
            <div className="admin-dashboard__footer">
              <span>QUICK ACCESS</span>
              <button onClick={() => goToSection("hero")}><ImageIcon size={15} /> ویرایش Hero <ArrowLeft size={14} /></button>
              <a href="/" target="_blank" rel="noreferrer"><Eye size={15} /> مشاهده سایت <ArrowUpRight size={13} /></a>
            </div>
          </div>
        ) : activeSection === "trash" ? (
          <>
            <header className="admin-header">
              <div>
                <span className="admin-kicker">05 / RECYCLE BIN</span>
                <h1>سطل <em>آشغال</em></h1>
                <p>رسانه‌های حذف‌شده موقتاً اینجا نگهداری می‌شوند و هر زمان خواستی قابل بازیابی هستند.</p>
              </div>
              <div className="admin-header__actions">
                <button className="admin-secondary" type="button" onClick={() => void refreshTrash()}><RotateCcw size={14}/> بروزرسانی</button>
              </div>
            </header>
            {error && <div className="admin-error admin-error--wide">{error}</div>}
            <section className="admin-trashManager">
              <div className="admin-trashManager__toolbar">
                <div>
                  <span>RECOVERABLE MEDIA</span>
                  <h2>{trashItems.length} مورد در سطل آشغال</h2>
                  <small>حذف‌های جدید ابتدا به اینجا منتقل می‌شوند و حذف دائمی جداگانه انجام می‌شود.</small>
                </div>
                <div className="admin-trashManager__actions">
                  <button type="button" onClick={() => setSelectedTrashIds(trashItems.map(item => item.id))} disabled={!trashItems.length}>انتخاب همه</button>
                  <button type="button" onClick={() => setSelectedTrashIds([])} disabled={!selectedTrashIds.length}>لغو انتخاب</button>
                  <button type="button" onClick={() => void restoreTrash(selectedTrashIds)} disabled={!selectedTrashIds.length}><RotateCcw size={13}/> بازیابی</button>
                  <button type="button" className="admin-trashPermanent" onClick={() => void permanentDeleteTrash(selectedTrashIds)} disabled={!selectedTrashIds.length}>حذف دائمی</button>
                </div>
              </div>
              <div className="admin-trashTableWrap">
                <table className="admin-memoryTable admin-trashTable">
                  <thead><tr>
                    <th><input type="checkbox" checked={trashItems.length > 0 && selectedTrashIds.length === trashItems.length} onChange={(e) => setSelectedTrashIds(e.target.checked ? trashItems.map(item => item.id) : [])}/></th>
                    <th>#</th><th>پیش‌نمایش</th><th>نام فایل</th><th>مسیر اصلی</th><th>تاریخ حذف</th><th>عملیات</th>
                  </tr></thead>
                  <tbody>
                    {trashItems.map((item,index) => {
                      const preview = "/api/admin/trash?file=" + encodeURIComponent(item.file);
                      const isVideo = /\.(mp4|webm|mov|m4v)$/i.test(item.file);
                      return <tr key={item.id}>
                        <td><input type="checkbox" checked={selectedTrashIds.includes(item.id)} onChange={(e) => setSelectedTrashIds(current => e.target.checked ? [...current,item.id] : current.filter(id => id !== item.id))}/></td>
                        <td className="admin-memoryTable__index">{String(index + 1).padStart(2,"0")}</td>
                        <td><div className="admin-memoryTable__thumb">{isVideo ? <video src={preview} muted playsInline preload="metadata"/> : <img src={preview} alt=""/>}</div></td>
                        <td><div className="admin-memoryTable__name">{item.file}</div></td>
                        <td><div className="admin-memoryTable__name">{item.original}</div></td>
                        <td><span className="admin-trashDate">{new Date(item.trashedAt).toLocaleString("fa-IR")}</span></td>
                        <td><div className="admin-memoryTable__actions">
                          <button type="button" className="admin-memoryEditButton" onClick={() => void restoreTrash([item.id])}><RotateCcw size={14}/> بازیابی</button>
                          <button type="button" className="admin-memoryDeleteButton" title="حذف دائمی" aria-label="حذف دائمی" onClick={() => void permanentDeleteTrash([item.id])}><Trash2 size={14}/></button>
                        </div></td>
                      </tr>;
                    })}
                    {!trashItems.length && <tr><td colSpan={7}><div className="admin-memoryEmpty">سطل آشغال خالی است.</div></td></tr>}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        ) : activeSection === "library" ? (
          <>
            <header className="admin-header"><div><span className="admin-kicker">04 / MEDIA LIBRARY</span><h1>کتابخانه <em>Media</em></h1><p>تمام تصاویر و ویدیوهای سایت را از یک کتابخانه واحد ببین و برای هر بخش انتخاب کن.</p></div></header>
            {error && <div className="admin-error admin-error--wide">{error}</div>}
            <section className="admin-library">
<div className="admin-library__toolbar"><div><span>RADMAN FILE MANAGER</span><h2>{libraryFolder ? "📁 "+libraryFolder : "کتابخانه رسانه"}</h2><small>{libraryFolder ? "فایل‌های این فولدر" : "برای دیدن فایل‌ها وارد فولدر شوید."}</small></div><div className="admin-library__controls">{libraryFolder&&<button type="button" onClick={()=>{setLibraryFolder(null);setSelectedLibraryItems([])}}>← فولدرها</button>}{libraryFolder&&<label className="admin-primary">+ افزودن فایل<input hidden type="file" accept="image/*,video/*" onChange={async e=>{const input=e.currentTarget;const file=input.files?.[0];if(!file)return;const form=new FormData();form.append("file",file);form.append("section",libraryFolder==="root"?"signal":libraryFolder);try{const res=await fetch("/api/admin/memory",{method:"POST",body:form});const data=await res.json();if(!res.ok)throw new Error(data.error||"آپلود ناموفق");const src=String(data.src);setAllMedia(cur=>cur.includes(data.video?"video:"+src:src)?cur:[data.video?"video:"+src:src,...cur]);}catch(err){setError(err instanceof Error?err.message:"آپلود ناموفق")}finally{input.value=""}}}/></label>}<input value={librarySearch} onChange={e=>setLibrarySearch(e.target.value)} placeholder="جستجو..." />{libraryFolder&&selectedLibraryItems.length>0&&<button type="button" onClick={async()=>{if(!confirm("فایل‌های انتخاب‌شده حذف شوند؟"))return;const srcs=selectedLibraryItems.map(x=>x.startsWith("video:")?x.slice(6):x);const res=await fetch("/api/admin/memory",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({srcs})});const data=await res.json();if(!res.ok){setError(data.error||"حذف ناموفق");return}if(!data.trashed){setError("هیچ فایلی به سطل زباله منتقل نشد. فایل‌ها در فهرست باقی ماندند.");return}setAllMedia(cur=>cur.filter(x=>!data.deleted?.some((src:string)=>{const raw=src.startsWith("video:")?src.slice(6):src;const current=x.startsWith("video:")?x.slice(6):x;return current===raw||current==="/"+(raw.startsWith("/")?raw.slice(1):raw)})));setSelectedLibraryItems([])}}>حذف انتخاب‌شده‌ها ({selectedLibraryItems.length})</button>}</div></div>
{!libraryFolder?<div className="admin-library__folders">{Array.from(new Set(["hero","story","signal",...allMedia.map(item=>{const src=item.startsWith("video:")?item.slice(6):item;const p=src.split("/").filter(Boolean);return p.length>2?p[1]:"root"})])).sort().map(folder=><button type="button" key={folder} className="admin-library__folderCard" onClick={()=>{setLibraryFolder(folder);setSelectedLibraryItems([])}}><span>📁</span><strong>{folder==="root"?"ریشه":folder}</strong><small>{allMedia.filter(item=>{const src=item.startsWith("video:")?item.slice(6):item;const p=src.split("/").filter(Boolean);return (p.length>2?p[1]:"root")===folder}).length} فایل</small></button>)}</div>:<><div className="admin-library__grid">{filteredLibrary.filter(item=>{const src=item.startsWith("video:")?item.slice(6):item;const p=src.split("/").filter(Boolean);return (p.length>2?p[1]:"root")===libraryFolder}).map(item=>{const video=item.startsWith("video:"),src=video?item.slice(6):item;return <div key={item} className="admin-library__item"><label className="admin-library__select"><input type="checkbox" checked={selectedLibraryItems.includes(item)} onChange={e=>setSelectedLibraryItems(cur=>e.target.checked?[...cur,item]:cur.filter(x=>x!==item))}/> انتخاب</label><div className="admin-library__media">{video?<video src={mediaUrl(src)} muted playsInline preload="metadata"/>:<img src={mediaUrl(src)} alt=""/>}{video&&<i>▶</i>}</div><div className="admin-library__meta"><strong>{src.split("/").pop()}</strong><span>{video?"VIDEO":"IMAGE"}</span></div><button type="button" className="admin-bulkDeleteButton" onClick={async()=>{if(!confirm("این فایل حذف شود؟"))return;const res=await fetch("/api/admin/memory",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({src})});const data=await res.json();if(!res.ok){setError(data.error||"حذف ناموفق");return}if(!data.trashed){setError("فایل به سطل زباله منتقل نشد و از فهرست حذف نشد.");return}setAllMedia(cur=>cur.filter(x=>x!==item));setSelectedLibraryItems(cur=>cur.filter(x=>x!==item))}}>حذف</button></div>})}</div><div className="admin-library__move"><label>انتقال به فولدر دیگر</label><select id="radman-move-target" defaultValue=""><option value="">انتخاب مقصد</option>{["hero","story","signal"].filter(x=>x!==libraryFolder).map(x=><option key={x} value={x}>{x}</option>)}</select><button type="button" disabled={!selectedLibraryItems.length} onClick={async()=>{const target=(document.getElementById("radman-move-target") as HTMLSelectElement).value;if(!target||!selectedLibraryItems.length)return;const res=await fetch("/api/admin/memory/move",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({items:selectedLibraryItems,target})});const data=await res.json();if(!res.ok){setError(data.error||"انتقال ناموفق");return}if(!Array.isArray(data.moved)||!data.moved.length){setError("هیچ فایلی منتقل نشد؛ فهرست بدون تغییر باقی ماند.");return}setAllMedia(cur=>cur.map(x=>{const video=x.startsWith("video:");const src=video?x.slice(6):x;const moved=(data.moved as Array<{from:string;to:string}>).find((entry)=>entry.from===src||entry.from==="/"+(src.startsWith("/")?src.slice(1):src));return moved?(video?"video:":"")+moved.to:x}).filter(x=>{const src=x.startsWith("video:")?x.slice(6):x;return !selectedLibraryItems.some(sel=>{const original=sel.startsWith("video:")?sel.slice(6):sel;return original===src})}));setSelectedLibraryItems([]);setLibraryFolder(target)}}>انتقال فایل‌ها</button></div></>}
</section>
          </>
        ) : activeSection === "story" ? (
          <>
            <header className="admin-header">
              <div><span className="admin-kicker">02 / STORY CONTROL</span><h1>ویرایش <em>Story</em></h1><p>متن، عنوان و تصویر هر اسلاید بخش داستان را مستقیم از پنل مدیریت کن.</p></div>
              <div className="admin-header__actions"><a href="/#story" target="_blank" rel="noreferrer" className="admin-secondary"><Eye size={15}/> مشاهده Story <ArrowUpRight size={13}/></a><button className="admin-primary" onClick={save} disabled={saving || loading || !dirty}>{saving ? "در حال ذخیره..." : saved ? "ذخیره شد" : "ذخیره تغییرات"}</button></div>
            </header>
            {error && <div className="admin-error admin-error--wide">{error}</div>}
            <div className="admin-storyToolbar"><div><span>STORY SLIDES</span><small>{config.story.length} / 8 اسلاید فعال</small></div><div className="admin-storyToolbar__actions"><div className="admin-storyFontPicker"><span>فونت فارسی</span>{(Object.keys(fontMeta) as Array<keyof typeof fontMeta>).map((font) => (<button type="button" key={font} className={config.persianFont === font ? "is-selected" : ""} onClick={() => update("persianFont", font)}>{fontMeta[font].label}</button>))}</div><button className="admin-bulkDeleteButton" type="button" onClick={bulkDeleteStory} disabled={!selectedStoryIndexes.length}>حذف انتخاب‌شده ({selectedStoryIndexes.length})</button><button className="admin-addStory" type="button" onClick={addStorySlide} disabled={saving || loading || config.story.length >= 8}>+ افزودن اسلاید</button></div></div>
            <div className="admin-storyTableWrap">
              <table className="admin-storyTable">
                <thead><tr><th><input type="checkbox" checked={selectedStoryIndexes.length === config.story.length && config.story.length > 0} onChange={(e) => setSelectedStoryIndexes(e.target.checked ? config.story.map((_,i) => i) : [])} /></th><th>#</th><th>تصویر</th><th>عنوان اسلایدر</th><th>برچسب</th><th>عملیات</th></tr></thead>
                <tbody>
                  {config.story.map((slide,index) => (
                    <tr key={index} className={editingStory === index ? "is-editing" : ""} onClick={() => openStoryEditor(index)}><td onClick={(e) => e.stopPropagation()}><input type="checkbox" checked={selectedStoryIndexes.includes(index)} onChange={(e) => setSelectedStoryIndexes(current => e.target.checked ? [...current,index] : current.filter(x => x !== index))} /></td>
                      <td className="admin-storyTable__index">{String(index + 1).padStart(2, "0")}</td>
                      <td><img className="admin-storyTable__thumb" src={mediaUrl(slide.image)} alt="" /></td>
                      <td><div className="admin-storyTable__title">{slide.title}</div><small>{slide.eyebrow}</small></td>
                      <td>{slide.label}</td>
                      <td>
                        <div className="admin-storyTable__actions" onClick={(e) => e.stopPropagation()}>
                          <button type="button" title="ویرایش" aria-label="ویرایش" onClick={() => openStoryEditor(index)}><Pencil size={15}/></button>
                          <button type="button" title="حذف" aria-label="حذف" onClick={() => removeStorySlide(index)} disabled={config.story.length <= 1}><Trash2 size={15}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {editingStory !== null && config.story[editingStory] && (
              <div className="admin-storyEditPanel">
                <div className="admin-storyEditPanel__head">
                  <div><span>EDIT STORY / {String(editingStory + 1).padStart(2, "0")}</span><h2>ویرایش اسلاید</h2></div>
                  <button type="button" onClick={() => { setEditingStory(null); goToSection("story"); }}>بستن</button>
                </div>
                <div className="admin-storyEditPanel__body">
                  <div className="admin-storyCard__image admin-storyEditVisual"><img src={mediaUrl(config.story[editingStory].image)} alt="" /><div className="admin-storyEditVisual__veil" /><div className="admin-storyEditVisual__meta"><span>RADMAN / STORY</span><i /></div><div className="admin-storyEditVisual__label">MEMORY FRAME</div></div>
                  <div className="admin-storyCard__fields">
                    {(["eyebrow","label","title","lead","body","image"] as const).map((key) => {
                      const slide = config.story[editingStory];
                      return <label className={`admin-field ${key === "image" ? "admin-field--image" : ""}`} key={key}><span>{key === "eyebrow" ? "برچسب بالا" : key === "label" ? "برچسب تصویر" : key === "title" ? "تیتر" : key === "lead" ? "متن اصلی" : key === "body" ? "متن توضیحی" : "مسیر تصویر"}</span>{key === "image" ? (<div className="admin-imagePathRow"><input value={slide[key]} onChange={e => updateStory(editingStory,key,e.target.value)} /><button type="button" className="admin-libraryMini" onClick={() => openLibrary({type:"story",index:editingStory})}>انتخاب از Library</button><label className="admin-uploadMini"><Upload size={13} /> آپلود تصویر<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={uploading} onChange={(e) => { const f = e.target.files?.[0]; if (f) void uploadImage(f, "story", (src) => updateStory(editingStory, "image", src)); e.currentTarget.value = ""; }} /></label></div>) : (<input value={slide[key]} onChange={e => updateStory(editingStory,key,e.target.value)} />)}</label>;
                    })}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : activeSection === "years" ? (
          <>
            <header className="admin-header">
              <div><span className="admin-kicker">05 / EDITORIAL TIMELINE</span><h1>مدیریت مستقل <em>THE YEARS</em></h1><p>تصاویر خط زمان را انتخاب، اضافه، حذف و مرتب کن. ترتیب این فهرست مستقیماً ترتیب کارت‌ها روی خط زمان سایت را تعیین می‌کند.</p></div>
              <div className="admin-header__actions"><a href="/" target="_blank" rel="noreferrer" className="admin-secondary"><Eye size={15}/> مشاهده سایت <ArrowUpRight size={13}/></a><button className="admin-primary" onClick={save} disabled={saving || loading || !dirty}>{saving ? "در حال ذخیره..." : saved ? "ذخیره شد" : "ذخیره تغییرات"}</button></div>
            </header>
            {error && <div className="admin-error admin-error--wide">{error}</div>}
            <section className="admin-yearsStudio">
              <div className="admin-yearsStudio__intro">
                <div><span>THE YEARS / VISUAL TIMELINE</span><h2>گالری تصویری خط زمان</h2><p>هر کارت یک قاب از مسیر رشد رادمان است. از دکمه‌های جابه‌جایی برای تنظیم ترتیب راست‌به‌چپ استفاده کن؛ تغییرات پس از ذخیره منتشر می‌شوند.</p></div>
                <div className="admin-yearsStudio__count"><strong>{String((config.years || []).length).padStart(2,"0")}</strong><span>FRAMES</span></div>
              </div>
              <div className="admin-yearsStudio__toolbar">
                <div><b>قاب‌های انتخاب‌شده</b><span>شماره‌ها بر اساس ترتیب فعلی‌اند؛ برای هر تصویر عنوانی بنویس تا در کارت و مدال سایت نمایش داده شود.</span></div>
                <label className="admin-memoryUploadButton admin-memoryUploadButton--image"><Upload size={14}/>{uploading ? "در حال آپلود..." : "افزودن تصویر"}<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={uploading} onChange={e => { const file=e.target.files?.[0]; if(file) void uploadYearsImage(file); e.currentTarget.value=""; }}/></label>
              </div>
              {(config.years || []).length ? (
                <div className="admin-yearsGrid">
                  {(config.years || []).map((src,index) => (
                    <article className="admin-yearsCard" key={src}>
                      <div className="admin-yearsCard__media"><img src={mediaUrl(src)} alt={src.split("/").pop() || "THE YEARS"} /><span>{String(index+1).padStart(2,"0")}</span><i>THE YEARS</i></div>
                      <div className="admin-yearsCard__info"><label htmlFor={`years-title-${index}`}>عنوان نمایشی روی سایت</label><input id={`years-title-${index}`} value={config.yearsTitles?.[src] || ""} onChange={e => { const value=e.target.value; setConfig(current => ({ ...current, yearsTitles: { ...(current.yearsTitles || {}), [src]: value } })); setSaved(false); setError(""); }} placeholder={`عنوان قاب ${String(index+1).padStart(2,"0")}`} maxLength={120} /><small>{src}</small></div>
                      <div className="admin-yearsCard__actions">
                        <button type="button" onClick={() => moveYearsImage(index,-1)} disabled={index===0} aria-label="انتقال به ابتدای خط زمان" title="انتقال به راست / قبلی">←</button>
                        <button type="button" onClick={() => moveYearsImage(index,1)} disabled={index===(config.years || []).length-1} aria-label="انتقال به انتهای خط زمان" title="انتقال به چپ / بعدی">→</button>
                        <button type="button" className="is-delete" onClick={() => removeYearsImage(src)} aria-label="حذف از THE YEARS" title="حذف از خط زمان"><Trash2 size={14}/></button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : <div className="admin-yearsEmpty"><ImageIcon size={28}/><strong>خط زمان هنوز تصویری ندارد</strong><span>با «افزودن تصویر» اولین قاب را اضافه کن؛ بدون تصویر انتخاب‌شده، کارت خط زمانی نمایش داده نمی‌شود.</span></div>}
              <div className="admin-yearsStudio__note"><ShieldCheck size={16}/><p><strong>پیش‌نمایش زنده‌ی چیدمان</strong> این پنل فقط رسانه‌های انتخاب‌شده برای THE YEARS را نمایش می‌دهد؛ فایل‌های Media Library به‌تنهایی وارد خط زمان نمی‌شوند.</p></div>
            </section>
          </>
        ) : activeSection === "chapters" ? (
          <>
            <header className="admin-header">
              <div><span className="admin-kicker">04 / CHAPTERS CONTENT STUDIO</span><h1>مدیریت <em>فصل‌های زندگی</em></h1><p>ترتیب فصل‌ها، عنوان فارسی، برچسب، روایت و تصویر هر فصل را مدیریت کن. تغییرات پس از ذخیره روی سایت منتشر می‌شوند.</p></div>
              <div className="admin-header__actions"><a href="/#chapters" target="_blank" rel="noreferrer" className="admin-secondary"><Eye size={15}/> مشاهده فصل‌ها <ArrowUpRight size={13}/></a><button className="admin-primary" onClick={save} disabled={saving || loading || !dirty}>{saving ? "در حال ذخیره..." : saved ? "ذخیره شد" : "ذخیره تغییرات"}</button></div>
            </header>
            {error && <div className="admin-error admin-error--wide">{error}</div>}
            <section className="admin-chaptersStudio">
              <div className="admin-chaptersStudio__intro"><div><span>EDITORIAL TIMELINE / RADMAN</span><h2>فصل‌ها به روایت تو</h2><p>هر فصل یک نقطه عطف است. عنوان و متن را متناسب با خاطرات واقعی تنظیم کن؛ لازم نیست همه فصل‌ها حتماً بازه سنی داشته باشند.</p></div><div className="admin-chaptersStudio__count"><strong>{String((config.chapters || []).length).padStart(2,"0")}</strong><span>CHAPTERS</span></div></div>
              <div className="admin-chaptersStudio__grid">
                <div className="admin-chaptersStudio__list">
                  {(config.chapters || []).map((chapter,index) => <button type="button" key={chapter.id} className={"admin-chapterRow" + (editingChapter === index ? " is-active" : "")} onClick={() => { setEditingChapter(index); try { const p=new URLSearchParams(window.location.search); p.set("section","chapters"); p.set("chapter",String(index)); window.history.replaceState(null,"","/admin?"+p.toString()); } catch {} }}>
                    <span className="admin-chapterRow__num">{String(index+1).padStart(2,"0")}</span><span className="admin-chapterRow__thumb"><img src={mediaUrl(chapter.image)} alt=""/></span><span className="admin-chapterRow__copy"><small>{chapter.period || "CHAPTER"}</small><strong>{chapter.title || "بدون عنوان"}</strong><em>{chapter.description || "بدون توضیح"}</em></span><span className="admin-chapterRow__chevron">←</span>
                  </button>)}
                  <button type="button" className="admin-chaptersStudio__add" onClick={addChapter}>＋ افزودن فصل جدید</button>
                </div>
                {config.chapters?.[editingChapter] ? <div className="admin-chapterEditor">
                  <div className="admin-chapterEditor__head"><div><span>CHAPTER / {String(editingChapter+1).padStart(2,"0")}</span><h2>ویرایش محتوای فصل</h2><p>عنوان و روایت در سایت نمایش داده می‌شوند؛ برچسب برای هویت بصری و دسته‌بندی فصل است.</p></div><div className="admin-chapterEditor__order"><button type="button" onClick={() => moveChapter(editingChapter,-1)} disabled={editingChapter<=0}>↑ بالاتر</button><button type="button" onClick={() => moveChapter(editingChapter,1)} disabled={editingChapter >= (config.chapters || []).length-1}>↓ پایین‌تر</button></div></div>
                  <div className="admin-chapterEditor__preview"><img src={mediaUrl(config.chapters[editingChapter].image)} alt="پیش‌نمایش فصل"/><div><span>{config.chapters[editingChapter].period}</span><h3>{config.chapters[editingChapter].title}</h3><p>{config.chapters[editingChapter].description}</p></div></div>
                  <div className="admin-chapterEditor__fields">
                    <label className="admin-field"><span>برچسب فصل / دوره</span><input maxLength={80} value={config.chapters[editingChapter].period} onChange={e => updateChapter(editingChapter,"period",e.target.value)} placeholder="مثلاً CHAPTER 01 / THE ARRIVAL"/></label>
                    <label className="admin-field"><span>عنوان اصلی فصل</span><input maxLength={120} value={config.chapters[editingChapter].title} onChange={e => updateChapter(editingChapter,"title",e.target.value)} placeholder="عنوان فارسی و احساسی"/></label>
                    <label className="admin-field"><span>روایت فصل</span><textarea rows={4} maxLength={600} value={config.chapters[editingChapter].description} onChange={e => updateChapter(editingChapter,"description",e.target.value)} placeholder="شرح کوتاه این دوره از زندگی رادمان"/></label>
                    <label className="admin-field"><span>مسیر تصویر</span><div className="admin-imagePathRow"><input value={config.chapters[editingChapter].image} onChange={e => updateChapter(editingChapter,"image",e.target.value)} placeholder="/memory/chapters/..." /><label className="admin-uploadMini"><Upload size={13}/> آپلود تصویر<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={uploading} onChange={e => { const f=e.target.files?.[0]; if(f) void uploadImage(f,"chapters",src => updateChapter(editingChapter,"image",src)); e.currentTarget.value=""; }}/></label></div><small>تصویر در پوشه اختصاصی Chapters ذخیره می‌شود. بهتر است برای هر فصل عکس مرتبط با همان خاطره انتخاب شود.</small></label>
                  </div>
                  <section className="admin-chapterGallery">
                    <div className="admin-chapterGallery__head">
                      <div><span>CHAPTER MEDIA / PRIVATE COLLECTION</span><h3>گالری اختصاصی این فصل</h3><p>تصاویر و ویدیوهای اینجا فقط در گالری همین فصل نمایش داده می‌شوند.</p></div>
                      <strong>{config.chapters[editingChapter].gallery?.length || 0} رسانه</strong>
                    </div>
                    <div className="admin-chapterGallery__uploads">
                      <label className="admin-memoryUploadButton admin-memoryUploadButton--image"><Upload size={14}/>{uploading ? "در حال آپلود..." : "آپلود تصویر"}<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={uploading} onChange={e => { const file=e.target.files?.[0]; if(file) void uploadChapterMedia(file,"image"); e.currentTarget.value=""; }}/></label>
                      <label className="admin-memoryUploadButton admin-memoryUploadButton--video"><Upload size={14}/>{uploading ? "در حال آپلود..." : "آپلود ویدیو"}<input type="file" accept="video/mp4,video/webm,video/quicktime,video/x-m4v" disabled={uploading} onChange={e => { const file=e.target.files?.[0]; if(file) void uploadChapterMedia(file,"video"); e.currentTarget.value=""; }}/></label>
                    </div>
                    {(config.chapters[editingChapter].gallery || []).length ? <div className="admin-chapterGallery__grid">
                      {(config.chapters[editingChapter].gallery || []).map(key => {
                        const isVideo = key.startsWith("video:");
                        const src = isVideo ? key.slice(6) : key;
                        return <div className="admin-chapterGallery__item" key={key}>
                          <div className="admin-chapterGallery__media">{isVideo ? <video src={mediaUrl(src)} muted playsInline preload="metadata" /> : <img src={mediaUrl(src)} alt="" />}{isVideo && <i>VIDEO</i>}</div>
                          <div className="admin-chapterGallery__itemFoot"><span>{isVideo ? "ویدیو" : "تصویر"} · {src.split("/").pop()}</span><button type="button" onClick={() => removeChapterGalleryItem(editingChapter,key)} aria-label="حذف از گالری این فصل" title="حذف از گالری این فصل"><Trash2 size={14}/></button></div>
                        </div>;
                      })}
                    </div> : <div className="admin-chapterGallery__empty">هنوز رسانه‌ای برای این فصل اضافه نشده است. با آپلود تصویر یا ویدیو، گالری این فصل ساخته می‌شود.</div>}
                  </section>
                  <div className="admin-chapterEditor__foot"><span>شناسه داخلی: {config.chapters[editingChapter].id}</span><button type="button" className="admin-chapterDeleteButton" onClick={() => removeChapter(editingChapter)} disabled={(config.chapters || []).length<=1}><Trash2 size={14}/> حذف این فصل</button></div>
                </div> : <div className="admin-chapterEditor admin-chapterEditor--empty">برای شروع، یک فصل از فهرست انتخاب کن یا فصل تازه‌ای بساز.</div>}
              </div>
              <div className="admin-chaptersStudio__note"><ShieldCheck size={16}/><p><strong>کنترل انتشار با شماست.</strong> ویرایش‌ها تا زمان زدن «ذخیره تغییرات» پیش‌نویس می‌مانند. برای نتیجه نهایی، پیش‌نمایش سایت را هم بررسی کن.</p></div>
            </section>
          </>
        ) : activeSection === "moving" ? (
          <>
            <header className="admin-header"><div><span className="admin-kicker">03 / MOVING MEMORY CONTROL</span><h1>مدیریت <em>MOVING MEMORY</em></h1><p>ویدیوهای منتخب این بخش را بارگذاری یا از کتابخانه انتخاب کن. فقط رسانه‌های انتخاب‌شده در سایت نمایش داده می‌شوند.</p></div><div className="admin-header__actions"><a href="/#moving-memory" target="_blank" rel="noreferrer" className="admin-secondary"><Eye size={15}/> مشاهده بخش <ArrowUpRight size={13}/></a><button className="admin-primary" onClick={save} disabled={saving || loading || !dirty}>{saving ? "در حال ذخیره..." : saved ? "ذخیره شد" : "ذخیره تغییرات"}</button></div></header>
            {error && <div className="admin-error admin-error--wide">{error}</div>}
            <section className="admin-movingStudio"><div className="admin-movingStudio__toolbar"><div><span>03 / MOVING MEMORY STUDIO</span><h2>گالری خاطرات متحرک</h2><small>{(config.movingMemory || []).length} ویدیوی انتخاب‌شده برای نمایش در سایت</small></div><label className="admin-memoryUploadButton admin-memoryUploadButton--video"><Upload size={14}/>{uploading ? "در حال آپلود..." : "بارگذاری ویدیوی جدید"}<input type="file" accept="video/mp4,video/webm,video/quicktime,video/x-m4v" disabled={uploading} onChange={e => { const file=e.target.files?.[0]; if(file) void uploadMovingMemoryVideo(file); e.currentTarget.value=""; }}/></label></div>
              <div className="admin-movingStudio__grid">{(config.movingMemory || []).map((key,index) => { const src=key.startsWith("video:") ? key.slice(6) : key; return <article className="admin-movingCard" key={key}><video src={mediaUrl(src)} controls playsInline preload="metadata"/><div><span>FILM / {String(index+1).padStart(2,"0")}</span><b title={src.split("/").pop()}>{src.split("/").pop()}</b><button type="button" onClick={() => toggleMovingMemory(key)}>حذف از بخش</button></div></article>; })}{!(config.movingMemory || []).length && <div className="admin-movingEmpty"><Play size={22}/><b>هنوز ویدیویی انتخاب نشده</b><span>از دکمه بارگذاری استفاده کن یا از کتابخانه رسانه‌های موجود را اضافه کن.</span></div>}</div>
              <div className="admin-movingLibrary"><div><h3>انتخاب از Media Library</h3><p>فقط ویدیوهای موجود نمایش داده می‌شوند؛ انتخاب‌ها با ذخیره تغییرات روی سایت منتشر خواهند شد.</p></div><div className="admin-movingLibrary__items">{allMedia.filter(item => item.startsWith("video:")).map(key => <label key={key} className={"admin-movingLibrary__item" + ((config.movingMemory || []).includes(key) ? " is-selected" : "")}><input type="checkbox" checked={(config.movingMemory || []).includes(key)} onChange={() => toggleMovingMemory(key)}/><span>{key.replace(/^video:/, "").split("/").pop()}</span></label>)}{!allMedia.some(item => item.startsWith("video:")) && <small>کتابخانه هنوز ویدیویی ندارد.</small>}</div></div>
              <div className="admin-movingNote"><ShieldCheck size={16}/><p><strong>انتشار کنترل‌شده:</strong> تنها ویدیوهای فهرست انتخاب‌شده پس از ذخیره در بخش عمومی نمایش داده می‌شوند.</p></div></section>
          </>
        ) : activeSection === "memory" ? (
          <>
            <header className="admin-header">
              <div><span className="admin-kicker">03 / MEMORY SIGNAL CONTROL</span><h1>مدیریت <em>Memory Signal</em></h1><p>تصاویر و ویدیوهای بخش پایین Story را انتخاب، ویرایش و برای نمایش در سایت مرتب کن.</p></div>
              <div className="admin-header__actions"><a href="/#story" target="_blank" rel="noreferrer" className="admin-secondary"><Eye size={15}/> مشاهده بخش <ArrowUpRight size={13}/></a><button className="admin-primary" onClick={save} disabled={saving || loading || !dirty}>{saving ? "در حال ذخیره..." : saved ? "ذخیره شد" : "ذخیره تغییرات"}</button></div>
            </header>
            {error && <div className="admin-error admin-error--wide">{error}</div>}
            <section className="admin-memoryManager">
              <div className="admin-memoryManager__toolbar"><div><span>MEMORY SIGNAL</span><h2>رسانه‌های استفاده‌شده</h2><small>{config.memorySignal?.length || 0} رسانه فعال در سایت</small></div><div className="admin-memoryUploadActions"><button type="button" className="admin-bulkDeleteButton" onClick={bulkDeleteMemory} disabled={!selectedMemoryKeys.length}>حذف انتخاب‌شده ({selectedMemoryKeys.length})</button><label className="admin-memoryUploadButton admin-memoryUploadButton--image"><Upload size={14}/> {memoryUploadType === "image" ? "در حال آپلود..." : "افزودن تصویر"}<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={memoryUploadType !== null} onChange={(e) => { const f=e.target.files?.[0]; if(f) void uploadMemoryMedia(f,"image"); e.currentTarget.value=""; }}/></label><label className="admin-memoryUploadButton admin-memoryUploadButton--video"><Upload size={14}/> {memoryUploadType === "video" ? "در حال آپلود..." : "افزودن ویدیو"}<input type="file" accept="video/mp4,video/webm,video/quicktime,video/x-m4v" disabled={memoryUploadType !== null} onChange={(e) => { const f=e.target.files?.[0]; if(f) void uploadMemoryMedia(f,"video"); e.currentTarget.value=""; }}/></label></div></div>
              <div className="admin-memoryTableWrap">
                <table className="admin-memoryTable">
                  <thead><tr><th><input type="checkbox" checked={(config.memorySignal || []).length > 0 && selectedMemoryKeys.length === (config.memorySignal || []).length} onChange={(e) => setSelectedMemoryKeys(e.target.checked ? (config.memorySignal || []) : [])} /></th><th>#</th><th>پیش‌نمایش</th><th>نام فایل</th><th>نوع</th><th>وضعیت</th><th>عملیات</th></tr></thead>
                  <tbody>
                    {(config.memorySignal || []).map((key) => { const isVideo = key.startsWith("video:"); const src = isVideo ? key.slice(6) : key; const item = { key, src, type: isVideo ? ("video" as const) : ("image" as const) }; const index = (config.memorySignal || []).indexOf(key);
                      const selected = selectedMemoryKeys.includes(item.key);
                      return <tr key={item.key} className={editingMemory === item.key ? "is-editing" : ""}><td onClick={(e) => e.stopPropagation()}><input type="checkbox" checked={selectedMemoryKeys.includes(item.key)} onChange={(e) => setSelectedMemoryKeys(current => e.target.checked ? [...current,item.key] : current.filter(x => x !== item.key))} /></td><td className="admin-memoryTable__index">{String(index + 1).padStart(2, "0")}</td><td><div className="admin-memoryTable__thumb">{item.type === "video" ? <video src={mediaUrl(item.src)} muted playsInline preload="metadata" /> : <img src={mediaUrl(item.src)} alt="" />}{item.type === "video" && <i>▶</i>}</div></td><td><div className="admin-memoryTable__name">{item.src.replace("/memory/", "")}</div></td><td><span className={`admin-memoryType admin-memoryType--${item.type}`}>{item.type === "video" ? "VIDEO" : "IMAGE"}</span></td><td><span className="admin-memoryStatus is-active">نمایش در سایت</span></td><td><div className="admin-memoryTable__actions"><button type="button" className="admin-memoryEditButton" onClick={() => openMemoryEditor(item.key)}><Pencil size={14}/> ویرایش</button><button type="button" className="admin-memoryDeleteButton" title="حذف رسانه" aria-label="حذف رسانه" onClick={() => void deleteMemoryMedia(item)}><Trash2 size={14}/></button></div></td></tr>;
                    })}
                    {(config.memorySignal || []).length === 0 && <tr><td colSpan={7}><div className="admin-memoryEmpty">هنوز تصویر یا ویدیویی در آرشیو وجود ندارد.</div></td></tr>}
                  </tbody>
                </table>
              </div>
            </section>
            {editingMemory !== null && (() => {
              const all = (config.memorySignal || []).map((key) => { const isVideo = key.startsWith("video:"); return { key, src: isVideo ? key.slice(6) : key, type: isVideo ? ("video" as const) : ("image" as const) }; });
              const item = all.find((x) => x.key === editingMemory);
              if (!item) return null;
              const list = config.memorySignal || [];
              const selected = list.includes(item.key);
              const position = list.indexOf(item.key);
              const toggle = () => { setSaved(false); setError(""); setConfig(current => { const currentList = current.memorySignal || []; return { ...current, memorySignal: selected ? currentList.filter(x => x !== item.key) : [...currentList, item.key] }; }); };
              const move = (direction: -1 | 1) => { if (position < 0) return; setSaved(false); setError(""); setConfig(current => { const next = [...(current.memorySignal || [])]; const target = position + direction; if (target < 0 || target >= next.length) return current; [next[position], next[target]] = [next[target], next[position]]; return { ...current, memorySignal: next }; }); };
              return <section className="admin-memoryEditPanel">
                <div className="admin-memoryEditPanel__head"><div><span>EDIT MEDIA / {item.type.toUpperCase()}</span><h2>ویرایش رسانه</h2></div><div className="admin-memoryEditPanel__headActions"><button type="button" className="admin-memoryDeleteButton admin-memoryDeleteButton--panel" onClick={() => void deleteMemoryMedia(item)}><Trash2 size={14}/> حذف رسانه</button><button type="button" onClick={() => { setEditingMemory(null); goToSection("memory"); }}>بستن</button></div></div>
                <div className="admin-memoryEditPanel__body"><div className="admin-memoryEditPanel__visual">{item.type === "video" ? <video src={mediaUrl(item.src)} controls muted playsInline /> : <img src={mediaUrl(item.src)} alt="" />}{item.type === "video" && <i>PLAY</i>}</div>
                  <div className="admin-memoryEditPanel__fields"><label className="admin-field"><span>عنوان نمایشی در مدال</span><input value={config.memoryTitles?.[item.key] || ""} placeholder="مثلاً یک روز به‌یادماندنی" maxLength={100} onChange={(e) => update("memoryTitles", { ...(config.memoryTitles || {}), [item.key]: e.target.value })} /><small>این عنوان در سمت راست مدال نمایش داده می‌شود و نام فایل نیست.</small></label><label className="admin-field"><span>نام فایل</span><div className="admin-memoryNameRow"><input value={memoryNameDraft || item.src.split("/").pop() || ""} onChange={(e) => setMemoryNameDraft(e.target.value)} onKeyDown={(e) => { if(e.key === "Enter"){ e.preventDefault(); void renameMemoryMedia(item, memoryNameDraft); } }} /><button type="button" className="admin-memoryNameSave" onClick={() => void renameMemoryMedia(item, memoryNameDraft)} disabled={!memoryNameDraft.trim() || memoryNameDraft.trim() === (item.src.split("/").pop() || "")}><Check size={14}/> ذخیره نام</button></div><small>نام فایل قابل ویرایش است؛ پسوند فایل حفظ می‌شود.</small></label>{item.type === "image" && <label className="admin-uploadMini admin-memoryEditUpload"><Upload size={13}/> آپلود تصویر جدید<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={uploading} onChange={(e) => { const f=e.target.files?.[0]; if(f) void replaceMemoryImage(item,f); e.currentTarget.value=""; }}/></label>}<div className="admin-memoryEditPanel__type"><span>نوع رسانه</span><strong>{item.type === "video" ? "VIDEO / ویدیو" : "IMAGE / تصویر"}</strong></div>
                    <button type="button" className={`admin-memoryToggle ${selected ? "is-active" : ""}`} onClick={toggle}><i>{selected ? "✓" : "+"}</i><div><strong>{selected ? "در Memory Signal قرار دارد" : "افزودن به Memory Signal"}</strong><small>{selected ? "این رسانه در سایت عمومی نمایش داده می‌شود." : "برای نمایش این رسانه در بخش پایین Story کلیک کن."}</small></div></button>
                    {selected && <div className="admin-memoryOrder"><span>جایگاه نمایش</span><strong>{String(position + 1).padStart(2, "0")}</strong><div><button type="button" onClick={() => move(-1)} disabled={position <= 0}>↑ بالاتر</button><button type="button" onClick={() => move(1)} disabled={position < 0 || position >= list.length - 1}>↓ پایین‌تر</button></div></div>}
                  </div>
                </div>
              </section>;
            })()}
          </>
        ) : (
          <>\n        <header className="admin-header">
          <div>
            <span className="admin-kicker">01 / HERO CONTROL</span>
            <h1>کنترل <em>Hero</em></h1>
            <p>محتوای صفحه آغازین را مدیریت کن؛ طراحی و انیمیشن اصلی سایت دست‌نخورده باقی می‌ماند.</p>
          </div>
          <div className="admin-header__actions">
            <a href="/" target="_blank" rel="noreferrer" className="admin-secondary"><Eye size={15} /> مشاهده سایت <ArrowUpRight size={13} /></a>
            <button className="admin-primary" onClick={save} disabled={saving || loading || !dirty}>
              {saving ? <LoaderCircle className="admin-spin" size={15} /> : saved ? <Check size={15} /> : <Save size={15} />}
              {saving ? "در حال ذخیره..." : saved ? "ذخیره شد" : dirty ? "ذخیره تغییرات" : "بدون تغییر"}
            </button>
          </div>
        </header>

        {error && <div className="admin-error admin-error--wide">{error}</div>}

        <div className="admin-workspace">
          <section id="hero-editor" className="admin-card admin-card--form">
            <div className="admin-card__head">
              <div><span>HERO CONTENT / 01</span><h2>اطلاعات اصلی</h2></div>
              <span className="admin-live"><i /> CONNECTED</span>
            </div>

            <div className="admin-fields">
              {(Object.keys(fieldMeta) as Array<keyof typeof fieldMeta>).map((key) => (
                <label className={`admin-field ${key === "place" || key === "city" || key === "cta" ? "admin-field--wide" : ""}`} key={key}>
                  <span>{fieldMeta[key].label}</span>
                  <input value={config[key]} onChange={(e) => update(key, e.target.value)} placeholder={fieldMeta[key].hint} maxLength={key === "cta" ? 60 : 180} disabled={loading} />
                  <small>{fieldMeta[key].hint}</small>
                </label>
              ))}
            </div>

            <div className="admin-fontBlock">
              <div className="admin-subhead"><span>PERSIAN TYPOGRAPHY</span><small>PUBLIC SITE / LIVE</small></div>
              <div className="admin-fontOptions">
                {(Object.keys(fontMeta) as Array<keyof typeof fontMeta>).map((font) => (
                  <button type="button" key={font} className={config.persianFont === font ? "is-selected" : ""} onClick={() => update("persianFont", font)}>
                    <strong>{fontMeta[font].label}</strong><span>{fontMeta[font].description}</span>{config.persianFont === font && <Check size={14} />}
                  </button>
                ))}
              </div>
            </div>

            <div className="admin-mediaBlock">
              <div className="admin-subhead"><span>HERO MEDIA</span><small>{config.image.replace("/memory/", "")}</small></div>
              <div className="admin-mediaPicker">
                <div className="admin-mediaActions">
                  <button className="admin-mediaButton" onClick={() => openLibrary({type:"hero"})} disabled={loading}>
                    <span><ImageIcon size={15} /> انتخاب از آرشیو</span>
                    <ChevronDown size={15} className={imageOpen ? "admin-rotate" : ""} />                  </button>
                  <label className="admin-uploadButton admin-uploadButton--hero">
                    <Upload size={15} /> {uploading ? "در حال آپلود..." : "افزودن تصویر"}
                    <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={uploading || loading} onChange={(e) => { const f = e.target.files?.[0]; if (f) void uploadImage(f, "hero", (src) => update("image", src)); e.currentTarget.value = ""; }} />
                  </label>
                </div>
                {false && imageOpen && (
                  <div className="admin-mediaMenu">
                    {heroImages.length ? heroImages.map((src) => (
                      <button key={src} className={src === config.image ? "is-selected" : ""} onClick={() => { update("image", src); setImageOpen(false); }}>
                        <img src={mediaUrl(src)} alt="" /><span>{src.replace("/memory/", "")}</span>{src === config.image && <Check size={14} />}
                      </button>
                    )) : <div className="admin-empty">تصویری در آرشیو پیدا نشد.</div>}
                  </div>
                )}
              </div>
            </div>

            <div className="admin-card__footer">
              <div><span className="admin-dirty"><i className={dirty ? "is-dirty" : ""} /> {dirty ? "UNSAVED CHANGES" : "SYNCED WITH SITE"}</span><small>ذخیره خودکار خاموش است تا کنترل انتشار دست شما بماند.</small></div>
              <div className="admin-footerActions">
                <button onClick={restoreDefaults} disabled={saving}>بازگردانی پیش‌فرض</button>
                <button onClick={reset} disabled={!dirty || saving}>لغو تغییرات</button>
              </div>
            </div>
          </section>

          <aside className="admin-card admin-card--preview">
            <div className="admin-card__head">
              <div><span>LIVE PREVIEW</span><h2>نمایش Hero</h2></div>
              <span className="admin-live"><i /> DRAFT</span>
            </div>
            <div className="admin-preview">
              <img src={preview} alt="" />
              <div className="admin-preview__shade" />
              <div className="admin-preview__top"><span>RADMAN / MEMORY</span><span>ARCHIVE</span></div>
              <div className="admin-preview__data">
                <small>DATE OF BIRTH</small><strong>{config.date}</strong>
                <small>TIME OF BIRTH</small><strong>{config.time}</strong>
                <small>BIRTH WEIGHT</small><strong>{config.weight}</strong>
                <small>BIRTH HEIGHT</small><strong>{config.height}</strong>
                <small>PLACE OF BIRTH</small><strong>{config.place}</strong><em>{config.city}</em>
              </div>
              <div className="admin-preview__cta">{config.cta}<span>↓</span></div>
              <b className="admin-preview__draft">DRAFT / UNSAVED</b>
            </div>
            <div className="admin-preview__note"><span>PUBLIC CONNECTION</span><p>این پیش‌نمایش از همان داده‌ای استفاده می‌کند که Hero اصلی سایت از API دریافت می‌کند.</p></div>
          </aside>
        </div>

        <footer className="admin-bottom"><span>RADMAN / CONTENT SYSTEM</span><span>HERO MODULE <b>CONNECTED</b></span></footer>
          </>
        )}
      </section>
      {libraryOpen && <div className="admin-libraryModal" onMouseDown={(e)=>{if(e.currentTarget===e.target){setLibraryOpen(false);setLibraryTarget(null)}}}><div className="admin-libraryModal__card"><div className="admin-libraryModal__head"><div><span>MEDIA LIBRARY / SELECT</span><h2>انتخاب رسانه</h2></div><button onClick={()=>{setLibraryOpen(false);setLibraryTarget(null)}}>بستن</button></div><div className="admin-library__controls"><input value={librarySearch} onChange={e=>setLibrarySearch(e.target.value)} placeholder="جستجو..." /><button onClick={()=>setLibraryFilter("all")}>همه</button><button onClick={()=>setLibraryFilter("image")}>تصاویر</button><button onClick={()=>setLibraryFilter("video")}>ویدیو</button></div><div className="admin-library__grid">{filteredLibrary.map(item=>{const isVideo=item.startsWith("video:"),src=isVideo?item.slice(6):item;return <button key={item} className="admin-library__item" onClick={()=>selectLibraryMedia(item)}><div className="admin-library__media">{isVideo?<video src={mediaUrl(src)} muted playsInline preload="metadata"/>:<img src={mediaUrl(src)} alt="" />}{isVideo&&<i>▶</i>}</div><div className="admin-library__meta"><strong>{src.replace("/memory/","")}</strong><span>{isVideo?"VIDEO":"IMAGE"}</span></div></button>})}</div></div></div>}
    </main>
  );
}