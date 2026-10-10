"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, ArrowUpRight, Check, ChevronDown, Eye, Image as ImageIcon,
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
};
type StorySlide = { eyebrow:string; title:string; lead:string; body:string; image:string; label:string };
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
};

const fieldMeta: Record<keyof Omit<HeroConfig, "image" | "persianFont" | "story" | "memorySignal">, { label: string; hint: string }> = {
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
  const [activeSection, setActiveSection] = useState<"dashboard" | "hero" | "story" | "memory" | "library" | "trash">("dashboard");
  const [editingStory, setEditingStory] = useState<number | null>(null);
  const [editingMemory, setEditingMemory] = useState<string | null>(null);
  const [selectedMemoryKeys, setSelectedMemoryKeys] = useState<string[]>([]);
  const [selectedStoryIndexes, setSelectedStoryIndexes] = useState<number[]>([]);
  const [trashItems, setTrashItems] = useState<TrashItem[]>([]);
  const [selectedTrashIds, setSelectedTrashIds] = useState<string[]>([]);
  const [memoryNameDraft, setMemoryNameDraft] = useState("");

  const goToSection = (section: "dashboard" | "hero" | "story" | "memory" | "library" | "trash") => {
    setActiveSection(section);
    try {
      const params = new URLSearchParams(window.location.search);
      if (section === "dashboard") params.delete("section"); else params.set("section", section);
      if (section !== "story") params.delete("story");
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
      if (section === "dashboard" || section === "hero" || section === "story" || section === "memory" || section === "library" || section === "trash") setActiveSection(section);
      const story = params.get("story");
      if (story !== null && story !== "") {
        const n = Number(story);
        if (Number.isInteger(n) && n >= 0) setEditingStory(n);
      }
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
  const addStorySlide = () => {
    if (config.story.length >= 8) { setError("حداکثر ۸ اسلاید برای Story قابل تعریف است."); return; }
    setSaved(false); setError("");
    setConfig(c => ({ ...c, story: [...c.story, { eyebrow:"NEW CHAPTER", title:"A new memory / begins here.", lead:"متن اصلی این اسلاید را وارد کنید.", body:"توضیحات این اسلاید را وارد کنید.", image:c.image, label:"NEW MEMORY" }] }));
  };
  const uploadImage = async (file: File, section: "hero" | "story", apply?: (src: string) => void) => {
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
      const src = String(data.image);
      if (section === "hero") setHeroImages(current => current.includes(src) ? current : [src, ...current]);
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
          <p className="admin-kicker">PRIVATE ARCHIVE / ADMIN</p>
          <h1>مدیریت آرشیو</h1>
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
        <button type="button" className={`admin-nav ${activeSection === "memory" ? "admin-nav--active" : ""}`} onClick={() => goToSection("memory")}><ImageIcon size={16} /><span>Memory Signal / رسانه‌ها</span><i>LIVE</i></button>
        <button type="button" className={`admin-nav ${activeSection === "trash" ? "admin-nav--active" : ""}`} onClick={() => goToSection("trash")}><ArchiveRestore size={16} /><span>سطل آشغال</span><i>{trashItems.length}</i></button>
        <button type="button" className={`admin-nav ${activeSection === "library" ? "admin-nav--active" : ""}`} onClick={() => goToSection("library")}><ImageIcon size={16} /><span>Media Library / کتابخانه</span><i>{allMedia.length}</i></button>
        <div className="admin-nav" aria-disabled="true"><ImageIcon size={16} /><span>Chapters / فصل‌ها</span><small>SOON</small></div>
        <div className="admin-nav" aria-disabled="true"><ImageIcon size={16} /><span>Archive / آرشیو</span><small>SOON</small></div>
        <div className="admin-sidebar__bottom">
          <div><ShieldCheck size={15} /> پنل خصوصی</div>
          <button onClick={logout}><LogOut size={14} /> خروج</button>
        </div>
      </aside>

      <section className="admin-content">
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
              <div className="admin-dashboard__card admin-dashboard__card--stat">
                <span>ACTIVE MODULE</span><strong>HERO</strong><p>تنها ماژول قابل ویرایش فعلی در پنل.</p>
              </div>
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
            <header className="admin-header"><div><span className="admin-kicker">04 / MEDIA LIBRARY</span><h1>کتابخانه <em>Media</em></h1><p>تمام تصاویر و ویدیوهای سایت را از یک آرشیو واحد ببین و برای هر بخش انتخاب کن.</p></div></header>
            {error && <div className="admin-error admin-error--wide">{error}</div>}
            <section className="admin-library">
              <div className="admin-library__toolbar"><div><span>MASTER MEDIA ARCHIVE</span><h2>{allMedia.length} رسانه</h2><small>رسانه‌ها بر اساس فولدر بخش سایت گروه‌بندی شده‌اند.</small></div>
                <div className="admin-library__controls">
                  <label className="admin-primary" style={{display:"inline-flex",alignItems:"center",cursor:"pointer"}}>+ افزودن فایل<input type="file" accept="image/*,video/*" hidden onChange={async e=>{const input=e.currentTarget;const file=input.files?.[0];if(!file)return;const isVideo=file.type.startsWith("video/");const form=new FormData();form.append("file",file);form.append("section","memory");setUploading(true);setError("");try{const res=await fetch("/api/admin/memory",{method:"POST",body:form});const data=await res.json();if(!res.ok)throw new Error(data?.error||"آپلود انجام نشد");const src=String(data.src||(isVideo?data.video:data.image));const key=isVideo?"video:"+src:src;setAllMedia(cur=>cur.includes(key)?cur:[key,...cur]);if(isVideo)setVideos(cur=>cur.includes(src)?cur:[src,...cur]);else setImages(cur=>cur.includes(src)?cur:[src,...cur]);}catch(err){setError(err instanceof Error?err.message:"آپلود انجام نشد");}finally{setUploading(false);input.value="";}}}/></label>
                  <input value={librarySearch} onChange={e=>setLibrarySearch(e.target.value)} placeholder="جستجوی نام فایل..." /><button onClick={()=>setLibraryFilter("all")}>همه</button><button onClick={()=>setLibraryFilter("image")}>تصاویر</button><button onClick={()=>setLibraryFilter("video")}>ویدیوها</button>
                </div>
              </div>
              {Array.from(new Set(filteredLibrary.map(item=>{const src=item.startsWith("video:")?item.slice(6):item;const parts=src.split("/").filter(Boolean);return parts.length>2?parts[parts.length-2]:"root";}))).map(folder=><div className="admin-library__folder" key={folder}><h3>📁 {folder==="root"?"فایل‌های بدون فولدر":folder}</h3><div className="admin-library__grid">
                {filteredLibrary.filter(item=>{const src=item.startsWith("video:")?item.slice(6):item;const parts=src.split("/").filter(Boolean);return (parts.length>2?parts[parts.length-2]:"root")===folder;}).map(item=>{const isVideo=item.startsWith("video:"),src=isVideo?item.slice(6):item;return <div key={item} className="admin-library__item"><button type="button" onClick={()=>openLibrary({type:"hero"})} style={{all:"unset",display:"block",cursor:"pointer",width:"100%"}}><div className="admin-library__media">{isVideo?<video src={mediaUrl(src)} muted playsInline preload="metadata"/>:<img src={mediaUrl(src)} alt="" />}{isVideo&&<i>▶</i>}</div><div className="admin-library__meta"><strong>{src.split("/").pop()}</strong><span>{isVideo?"VIDEO":"IMAGE"}</span></div></button><button type="button" className="admin-bulkDeleteButton" onClick={async()=>{if(!window.confirm("فایل به سطل آشغال منتقل شود؟"))return;try{const res=await fetch("/api/admin/memory",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({src})});const data=await res.json();if(!res.ok)throw new Error(data?.error||"حذف انجام نشد");setAllMedia(cur=>cur.filter(x=>x!==item));setImages(cur=>cur.filter(x=>x!==src));setVideos(cur=>cur.filter(x=>x!==src));}catch(err){setError(err instanceof Error?err.message:"حذف انجام نشد");}}}>حذف</button></div>})}
              </div></div>)}
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
                    <ChevronDown size={15} className={imageOpen ? "admin-rotate" : ""} />
                  </button>
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
