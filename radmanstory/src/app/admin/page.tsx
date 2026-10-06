"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, ArrowUpRight, Check, ChevronDown, Eye, Image as ImageIcon,
  LogOut, Save, ShieldCheck, Sparkles, LoaderCircle,
} from "lucide-react";
import "./admin.css";

type HeroConfig = {
  image: string; date: string; time: string; weight: string;
  height: string; place: string; city: string; cta: string;
};

const defaults: HeroConfig = {
  image: "/memory/radman-and-me.png",
  date: "DEC / 01 / 2022", time: "14:15", weight: "3.100 kg",
  height: "49 cm", place: "NIKAN AQDASIEH", city: "Tehran · Iran",
  cta: "ENTER THE STORY",
};

const fieldMeta: Record<keyof Omit<HeroConfig, "image">, { label: string; hint: string }> = {
  date: { label: "تاریخ تولد", hint: "DEC / 01 / 2022" },
  time: { label: "ساعت تولد", hint: "14:15" },
  weight: { label: "وزن هنگام تولد", hint: "3.100 kg" },
  height: { label: "قد هنگام تولد", hint: "49 cm" },
  place: { label: "محل تولد", hint: "NIKAN AQDASIEH" },
  city: { label: "شهر / کشور", hint: "Tehran · Iran" },
  cta: { label: "متن دکمه ورود", hint: "ENTER THE STORY" },
};

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

  const update = (key: keyof HeroConfig, value: string) => {
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
        <div className="admin-sidebar__label">CONTENT MANAGEMENT</div>
        <button type="button" className="admin-nav admin-nav--active" onClick={() => document.getElementById("hero-editor")?.scrollIntoView({ behavior: "smooth", block: "start" })}><ImageIcon size={16} /><span>Hero / صفحه آغازین</span><i>LIVE</i></button>
        <div className="admin-nav" aria-disabled="true"><Sparkles size={16} /><span>Story / معرفی</span><small>SOON</small></div>
        <div className="admin-nav" aria-disabled="true"><ImageIcon size={16} /><span>Chapters / فصل‌ها</span><small>SOON</small></div>
        <div className="admin-nav" aria-disabled="true"><ImageIcon size={16} /><span>Archive / آرشیو</span><small>SOON</small></div>
        <div className="admin-sidebar__bottom">
          <div><ShieldCheck size={15} /> پنل خصوصی</div>
          <button onClick={logout}><LogOut size={14} /> خروج</button>
        </div>
      </aside>

      <section className="admin-content">
        <header className="admin-header">
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
      </section>
    </main>
  );
}
