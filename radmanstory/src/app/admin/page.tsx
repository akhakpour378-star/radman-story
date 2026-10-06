"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, ArrowUpRight, Check, ChevronDown, Eye, Image as ImageIcon,
  LayoutDashboard, LogOut, Save, ShieldCheck, Sparkles, LoaderCircle,
} from "lucide-react";
import "./admin.css";

type HeroConfig = {
  image: string; date: string; time: string; weight: string;
  height: string; place: string; city: string; cta: string;
  persianFont: "iranyekan" | "iransans";
  story: StorySlide[];
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

const fieldMeta: Record<keyof Omit<HeroConfig, "image" | "persianFont" | "story">, { label: string; hint: string }> = {
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
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState<"dashboard" | "hero" | "story">("dashboard");

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
        const auth = authRes.ok ? await authRes.json() : { authenticated: false };
        if (heroRes.ok) {
          const data = { ...defaults, ...(await heroRes.json()) };
          setConfig(data); setSavedConfig(data);
        }
        if (mediaRes.ok) {
          const media = await mediaRes.json();
          setImages(Array.isArray(media.images) ? media.images : []);
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
            <div className="admin-storyToolbar"><div><span>STORY SLIDES</span><small>{config.story.length} / 8 اسلاید فعال</small></div><button className="admin-addStory" type="button" onClick={addStorySlide} disabled={saving || loading || config.story.length >= 8}>+ افزودن اسلاید</button></div>\n            <div className="admin-storyEditor">
              {config.story.map((slide,index) => (
                <article className="admin-storyCard" key={index}>
                  <div className="admin-storyCard__image"><img src={mediaUrl(slide.image)} alt="" /><span>{String(index + 1).padStart(2, "0")}</span><button className="admin-removeStory" type="button" onClick={() => removeStorySlide(index)} disabled={config.story.length <= 1} aria-label="حذف اسلاید">حذف</button></div>
                  <div className="admin-storyCard__fields">
                    {(["eyebrow","label","title","lead","body","image"] as const).map((key) => (
                      <label className="admin-field" key={key}><span>{key === "eyebrow" ? "برچسب بالا" : key === "label" ? "برچسب تصویر" : key === "title" ? "تیتر" : key === "lead" ? "متن اصلی" : key === "body" ? "متن توضیحی" : "مسیر تصویر"}</span><input value={slide[key]} onChange={e => updateStory(index,key,e.target.value)} /></label>
                    ))}
                  </div>
                </article>
              ))}
            </div>
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
                <button className="admin-mediaButton" onClick={() => setImageOpen((v) => !v)} disabled={loading}>
                  <span><ImageIcon size={15} /> انتخاب تصویر اصلی</span>
                  <ChevronDown size={15} className={imageOpen ? "admin-rotate" : ""} />
                </button>
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
