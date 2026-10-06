"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, ArrowUpRight, Check, ChevronDown, Eye, Image as ImageIcon,
  LayoutDashboard, LogOut, Save, ShieldCheck, Sparkles, LoaderCircle, Upload, Pencil, Trash2,
} from "lucide-react";
import "./admin.css";

type HeroConfig = {
  image: string; date: string; time: string; weight: string;
  height: string; place: string; city: string; cta: string;
  persianFont: "iranyekan" | "iransans";
  story: StorySlide[];
  memorySignal?: string[];
};
type StorySlide = { eyebrow:string; title:string; lead:string; body:string; image:string; label:string };

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
  const [activeSection, setActiveSection] = useState<"dashboard" | "hero" | "story" | "memory">("dashboard");
  const [editingStory, setEditingStory] = useState<number | null>(null);
  const [editingMemory, setEditingMemory] = useState<string | null>(null);

  const dirty = JSON.stringify(config) !== JSON.stringify(savedConfig);
  const preview = useMemo(() => mediaUrl(config.image), [config.image]);

  useEffect(() => {
    let alive = true;
    Promise.all([
      fetch("/api/admin/auth", { cache: "no-store" }),
      fetch("/api/admin/hero", { cache: "no-store" }),
      fetch("/api/memory?list=1", { cache: "no-store" }),
    ])
      .then(async ([authRes, heroRes, mediaRes]) => {
        if (!alive) return;
        let heroData: HeroConfig = defaults;
        const auth = authRes.ok ? await authRes.json() : { authenticated: false };
        if (heroRes.ok) {
          heroData = { ...defaults, ...(await heroRes.json()) };
          setConfig(heroData); setSavedConfig(heroData);
        }
        if (mediaRes.ok) {
          const media = await mediaRes.json();
          setImages(Array.isArray(media.images) ? media.images : []);
          setVideos(Array.isArray(media.videos) ? media.videos : []);
          if (!Array.isArray(heroData.memorySignal) || !heroData.memorySignal.length) {
            const initialSignal = [...(Array.isArray(media.images) ? media.images.slice(0, 7) : []), ...(Array.isArray(media.videos) ? media.videos.slice(0, 2).map((v: string) => "video:" + v) : [])];
            setConfig(current => ({ ...current, memorySignal: initialSignal }));
            setSavedConfig(current => ({ ...current, memorySignal: initialSignal }));
          }
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
    setConfig({ ...defaults, ...data }); setSavedConfig({ ...defaults, ...data });
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
  const uploadImage = async (file: File, apply?: (src: string) => void) => {
    if (!file.type.startsWith("image/")) { setError("فقط فایل تصویری قابل آپلود است."); return; }
    if (file.size > 15 * 1024 * 1024) { setError("حجم تصویر نباید بیشتر از ۱۵ مگابایت باشد."); return; }
    setUploading(true); setError(""); setSaved(false);
    try {
      const form = new FormData();
      form.append("file", file);
      const r = await fetch("/api/admin/memory", { method: "POST", body: form });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "آپلود تصویر انجام نشد.");
      const src = String(data.image);
      setImages(current => current.includes(src) ? current : [src, ...current]);
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
      const form = new FormData(); form.append("file", file);
      const r = await fetch("/api/admin/memory", { method: "POST", body: form }); const data = await r.json();
      if (!r.ok) throw new Error(data?.error || `آپلود ${prefix} انجام نشد.`);
      const src = String(data.src || (isVideo ? data.video : data.image));
      if (isVideo) setVideos(current => current.includes(src) ? current : [src, ...current]); else setImages(current => current.includes(src) ? current : [src, ...current]);
      setConfig(current => ({ ...current, memorySignal: [...(current.memorySignal || []), ...(isVideo ? ["video:" + src] : [src])] }));
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
        body: JSON.stringify({ src: item.src }),
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
      setConfig({ ...defaults, ...saveData });
      setSavedConfig({ ...defaults, ...saveData });
      if (editingMemory === item.key) setEditingMemory(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "حذف رسانه انجام نشد.");
    }
  };

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
        <button type="button" className={`admin-nav ${activeSection === "dashboard" ? "admin-nav--active" : ""}`} onClick={() => setActiveSection("dashboard")}><LayoutDashboard size={16} /><span>داشبورد</span><i>HOME</i></button>
        <button type="button" className={`admin-nav ${activeSection === "hero" ? "admin-nav--active" : ""}`} onClick={() => setActiveSection("hero")}><ImageIcon size={16} /><span>Hero / صفحه آغازین</span><i>LIVE</i></button>
        <button type="button" className={`admin-nav ${activeSection === "story" ? "admin-nav--active" : ""}`} onClick={() => setActiveSection("story")}><Sparkles size={16} /><span>Story / معرفی</span><i>LIVE</i></button>
        <button type="button" className={`admin-nav ${activeSection === "memory" ? "admin-nav--active" : ""}`} onClick={() => setActiveSection("memory")}><ImageIcon size={16} /><span>Memory Signal / رسانه‌ها</span><i>LIVE</i></button>
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
              <button className="admin-dashboard__card admin-dashboard__card--hero" onClick={() => setActiveSection("hero")}>
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
              <button onClick={() => setActiveSection("hero")}><ImageIcon size={15} /> ویرایش Hero <ArrowLeft size={14} /></button>
              <a href="/" target="_blank" rel="noreferrer"><Eye size={15} /> مشاهده سایت <ArrowUpRight size={13} /></a>
            </div>
          </div>
        ) : activeSection === "story" ? (
          <>
            <header className="admin-header">
              <div><span className="admin-kicker">02 / STORY CONTROL</span><h1>ویرایش <em>Story</em></h1><p>متن، عنوان و تصویر هر اسلاید بخش داستان را مستقیم از پنل مدیریت کن.</p></div>
              <div className="admin-header__actions"><a href="/#story" target="_blank" rel="noreferrer" className="admin-secondary"><Eye size={15}/> مشاهده Story <ArrowUpRight size={13}/></a><button className="admin-primary" onClick={save} disabled={saving || loading || !dirty}>{saving ? "در حال ذخیره..." : saved ? "ذخیره شد" : "ذخیره تغییرات"}</button></div>
            </header>
            {error && <div className="admin-error admin-error--wide">{error}</div>}
            <div className="admin-storyToolbar"><div><span>STORY SLIDES</span><small>{config.story.length} / 8 اسلاید فعال</small></div><div className="admin-storyToolbar__actions"><div className="admin-storyFontPicker"><span>فونت فارسی</span>{(Object.keys(fontMeta) as Array<keyof typeof fontMeta>).map((font) => (<button type="button" key={font} className={config.persianFont === font ? "is-selected" : ""} onClick={() => update("persianFont", font)}>{fontMeta[font].label}</button>))}</div><button className="admin-addStory" type="button" onClick={addStorySlide} disabled={saving || loading || config.story.length >= 8}>+ افزودن اسلاید</button></div></div>
            <div className="admin-storyTableWrap">
              <table className="admin-storyTable">
                <thead><tr><th>#</th><th>تصویر</th><th>عنوان اسلایدر</th><th>برچسب</th><th>عملیات</th></tr></thead>
                <tbody>
                  {config.story.map((slide,index) => (
                    <tr key={index} className={editingStory === index ? "is-editing" : ""} onClick={() => setEditingStory(index)}>
                      <td className="admin-storyTable__index">{String(index + 1).padStart(2, "0")}</td>
                      <td><img className="admin-storyTable__thumb" src={mediaUrl(slide.image)} alt="" /></td>
                      <td><div className="admin-storyTable__title">{slide.title}</div><small>{slide.eyebrow}</small></td>
                      <td>{slide.label}</td>
                      <td>
                        <div className="admin-storyTable__actions" onClick={(e) => e.stopPropagation()}>
                          <button type="button" title="ویرایش" aria-label="ویرایش" onClick={() => setEditingStory(index)}><Pencil size={15}/></button>
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
                  <button type="button" onClick={() => setEditingStory(null)}>بستن</button>
                </div>
                <div className="admin-storyEditPanel__body">
                  <div className="admin-storyCard__image admin-storyEditVisual"><img src={mediaUrl(config.story[editingStory].image)} alt="" /><div className="admin-storyEditVisual__veil" /><div className="admin-storyEditVisual__meta"><span>RADMAN / STORY</span><i /></div><div className="admin-storyEditVisual__label">MEMORY FRAME</div></div>
                  <div className="admin-storyCard__fields">
                    {(["eyebrow","label","title","lead","body","image"] as const).map((key) => {
                      const slide = config.story[editingStory];
                      return <label className={`admin-field ${key === "image" ? "admin-field--image" : ""}`} key={key}><span>{key === "eyebrow" ? "برچسب بالا" : key === "label" ? "برچسب تصویر" : key === "title" ? "تیتر" : key === "lead" ? "متن اصلی" : key === "body" ? "متن توضیحی" : "مسیر تصویر"}</span>{key === "image" ? (<div className="admin-imagePathRow"><input value={slide[key]} onChange={e => updateStory(editingStory,key,e.target.value)} /><label className="admin-uploadMini"><Upload size={13} /> آپلود تصویر<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={uploading} onChange={(e) => { const f = e.target.files?.[0]; if (f) void uploadImage(f, (src) => updateStory(editingStory, "image", src)); e.currentTarget.value = ""; }} /></label></div>) : (<input value={slide[key]} onChange={e => updateStory(editingStory,key,e.target.value)} />)}</label>;
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
              <div className="admin-memoryManager__toolbar"><div><span>MEDIA LIBRARY</span><h2>لیست تصاویر و ویدیوها</h2><small>{images.length + videos.length} رسانه در آرشیو · {config.memorySignal?.length || 0} مورد فعال</small></div><div className="admin-memoryUploadActions"><label className="admin-memoryUploadButton admin-memoryUploadButton--image"><Upload size={14}/> {memoryUploadType === "image" ? "در حال آپلود..." : "افزودن تصویر"}<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={memoryUploadType !== null} onChange={(e) => { const f=e.target.files?.[0]; if(f) void uploadMemoryMedia(f,"image"); e.currentTarget.value=""; }}/></label><label className="admin-memoryUploadButton admin-memoryUploadButton--video"><Upload size={14}/> {memoryUploadType === "video" ? "در حال آپلود..." : "افزودن ویدیو"}<input type="file" accept="video/mp4,video/webm,video/quicktime,video/x-m4v" disabled={memoryUploadType !== null} onChange={(e) => { const f=e.target.files?.[0]; if(f) void uploadMemoryMedia(f,"video"); e.currentTarget.value=""; }}/></label></div></div>
              <div className="admin-memoryTableWrap">
                <table className="admin-memoryTable">
                  <thead><tr><th>#</th><th>پیش‌نمایش</th><th>نام فایل</th><th>نوع</th><th>وضعیت</th><th>عملیات</th></tr></thead>
                  <tbody>
                    {[...images.map((src) => ({ key: src, src, type: "image" as const })), ...videos.map((src) => ({ key: "video:" + src, src, type: "video" as const }))].map((item, index) => {
                      const selected = (config.memorySignal || []).includes(item.key);
                      return <tr key={item.key} className={editingMemory === item.key ? "is-editing" : ""}><td className="admin-memoryTable__index">{String(index + 1).padStart(2, "0")}</td><td><div className="admin-memoryTable__thumb">{item.type === "video" ? <video src={mediaUrl(item.src)} muted playsInline preload="metadata" /> : <img src={mediaUrl(item.src)} alt="" />}{item.type === "video" && <i>▶</i>}</div></td><td><div className="admin-memoryTable__name">{item.src.replace("/memory/", "")}</div></td><td><span className={`admin-memoryType admin-memoryType--${item.type}`}>{item.type === "video" ? "VIDEO" : "IMAGE"}</span></td><td><span className={`admin-memoryStatus ${selected ? "is-active" : ""}`}>{selected ? "نمایش در سایت" : "غیرفعال"}</span></td><td><div className="admin-memoryTable__actions"><button type="button" className="admin-memoryEditButton" onClick={() => setEditingMemory(item.key)}><Pencil size={14}/> ویرایش</button><button type="button" className="admin-memoryDeleteButton" title="حذف رسانه" aria-label="حذف رسانه" onClick={() => void deleteMemoryMedia(item)}><Trash2 size={14}/></button></div></td></tr>;
                    })}
                    {images.length + videos.length === 0 && <tr><td colSpan={6}><div className="admin-memoryEmpty">هنوز تصویر یا ویدیویی در آرشیو وجود ندارد.</div></td></tr>}
                  </tbody>
                </table>
              </div>
            </section>
            {editingMemory !== null && (() => {
              const all = [...images.map((src) => ({ key: src, src, type: "image" as const })), ...videos.map((src) => ({ key: "video:" + src, src, type: "video" as const }))];
              const item = all.find((x) => x.key === editingMemory);
              if (!item) return null;
              const list = config.memorySignal || [];
              const selected = list.includes(item.key);
              const position = list.indexOf(item.key);
              const toggle = () => { setSaved(false); setError(""); setConfig(current => { const currentList = current.memorySignal || []; return { ...current, memorySignal: selected ? currentList.filter(x => x !== item.key) : [...currentList, item.key] }; }); };
              const move = (direction: -1 | 1) => { if (position < 0) return; setSaved(false); setError(""); setConfig(current => { const next = [...(current.memorySignal || [])]; const target = position + direction; if (target < 0 || target >= next.length) return current; [next[position], next[target]] = [next[target], next[position]]; return { ...current, memorySignal: next }; }); };
              return <section className="admin-memoryEditPanel">
                <div className="admin-memoryEditPanel__head"><div><span>EDIT MEDIA / {item.type.toUpperCase()}</span><h2>ویرایش رسانه</h2></div><div className="admin-memoryEditPanel__headActions"><button type="button" className="admin-memoryDeleteButton admin-memoryDeleteButton--panel" onClick={() => void deleteMemoryMedia(item)}><Trash2 size={14}/> حذف رسانه</button><button type="button" onClick={() => setEditingMemory(null)}>بستن</button></div></div>
                <div className="admin-memoryEditPanel__body"><div className="admin-memoryEditPanel__visual">{item.type === "video" ? <video src={mediaUrl(item.src)} controls muted playsInline /> : <img src={mediaUrl(item.src)} alt="" />}{item.type === "video" && <i>PLAY</i>}</div>
                  <div className="admin-memoryEditPanel__fields"><label className="admin-field"><span>نام فایل</span><input value={item.src.replace("/memory/", "")} readOnly /></label><div className="admin-memoryEditPanel__type"><span>نوع رسانه</span><strong>{item.type === "video" ? "VIDEO / ویدیو" : "IMAGE / تصویر"}</strong></div>
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
                  <button className="admin-mediaButton" onClick={() => setImageOpen((v) => !v)} disabled={loading}>
                    <span><ImageIcon size={15} /> انتخاب از آرشیو</span>
                    <ChevronDown size={15} className={imageOpen ? "admin-rotate" : ""} />
                  </button>
                  <label className="admin-uploadButton admin-uploadButton--hero">
                    <Upload size={15} /> {uploading ? "در حال آپلود..." : "افزودن تصویر"}
                    <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={uploading || loading} onChange={(e) => { const f = e.target.files?.[0]; if (f) void uploadImage(f, (src) => update("image", src)); e.currentTarget.value = ""; }} />
                  </label>
                </div>
                {imageOpen && (
                  <div className="admin-mediaMenu">
                    {images.length ? images.map((src) => (
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
    </main>
  );
}
