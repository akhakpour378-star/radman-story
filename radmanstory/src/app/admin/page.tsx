"use client";

import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, Check, Eye, Image as ImageIcon, LogOut, Save, ShieldCheck } from "lucide-react";
import "./admin.css";

type HeroConfig = {
  image: string;
  date: string;
  time: string;
  weight: string;
  height: string;
  place: string;
  city: string;
  cta: string;
};

const emptyConfig: HeroConfig = {
  image: "/memory/radman-and-me.png",
  date: "DEC / 01 / 2022",
  time: "14:15",
  weight: "3.100 kg",
  height: "49 cm",
  place: "NIKAN AQDASIEH",
  city: "Tehran · Iran",
  cta: "ENTER THE STORY",
};

export default function AdminPage() {
  const [config, setConfig] = useState<HeroConfig>(emptyConfig);
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/hero")
      .then(async (r) => {
        if (r.status === 401) return setAuthenticated(false);
        if (!r.ok) throw new Error("LOAD_FAILED");
        setAuthenticated(true);
        setConfig(await r.json());
      })
      .catch(() => {});
  }, []);

  const login = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const r = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!r.ok) return setError("رمز ورود صحیح نیست.");
    setAuthenticated(true);
    setPassword("");
    const data = await fetch("/api/admin/hero").then((x) => x.json());
    setConfig(data);
  };

  const save = async () => {
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const r = await fetch("/api/admin/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (!r.ok) throw new Error();
      setConfig(await r.json());
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("ذخیره انجام نشد. تنظیمات سرور را بررسی کنید.");
    } finally {
      setSaving(false);
    }
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
        <div className="admin-sidebar__label">CONTENT MANAGEMENT</div>
        <button className="admin-nav admin-nav--active"><ImageIcon size={16} /><span>Hero / صفحه آغازین</span></button>
        <button className="admin-nav" disabled>Story / معرفی</button>
        <button className="admin-nav" disabled>Chapters / فصل‌ها</button>
        <button className="admin-nav" disabled>Archive / آرشیو</button>
        <div className="admin-sidebar__bottom">
          <div><ShieldCheck size={15} /> پنل خصوصی</div>
          <button onClick={logout}><LogOut size={14} /> خروج</button>
        </div>
      </aside>

      <section className="admin-content">
        <header className="admin-header">
          <div>
            <span className="admin-kicker">01 / HERO CONTROL</span>
            <h1>صفحه آغازین</h1>
            <p>اطلاعات و تصویر بخش Hero را بدون دست‌زدن به طراحی اصلی مدیریت کنید.</p>
          </div>
          <div className="admin-header__actions">
            <a href="/" target="_blank" rel="noreferrer" className="admin-secondary"><Eye size={15} /> مشاهده سایت</a>
            <button className="admin-primary" onClick={save} disabled={saving}><Save size={15} /> {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}</button>
          </div>
        </header>

        {saved && <div className="admin-success"><Check size={16} /> تغییرات با موفقیت ذخیره شد.</div>}
        {error && <div className="admin-error admin-error--wide">{error}</div>}

        <div className="admin-grid">
          <section className="admin-card admin-card--image">
            <div className="admin-card__head"><div><span>HERO MEDIA</span><h2>تصویر اصلی</h2></div><ImageIcon size={18} /></div>
            <div className="admin-preview"><img src={config.image} alt="" /><div>LIVE PREVIEW</div></div>
            <label>مسیر تصویر<input value={config.image} onChange={(e) => setConfig({...config, image:e.target.value})} /></label>
            <small className="admin-help">مسیر فایل موجود در پوشه public / memory را وارد کنید.</small>
          </section>

          <section className="admin-card">
            <div className="admin-card__head"><div><span>RADMAN DATA</span><h2>اطلاعات تولد</h2></div></div>
            <div className="admin-fields">
              <label>تاریخ تولد<input value={config.date} onChange={(e) => setConfig({...config, date:e.target.value})} /></label>
              <label>ساعت تولد<input value={config.time} onChange={(e) => setConfig({...config, time:e.target.value})} /></label>
              <label>وزن تولد<input value={config.weight} onChange={(e) => setConfig({...config, weight:e.target.value})} /></label>
              <label>قد هنگام تولد<input value={config.height} onChange={(e) => setConfig({...config, height:e.target.value})} /></label>
              <label>محل تولد<input value={config.place} onChange={(e) => setConfig({...config, place:e.target.value})} /></label>
              <label>شهر / کشور<input value={config.city} onChange={(e) => setConfig({...config, city:e.target.value})} /></label>
              <label className="admin-field--full">متن دکمه ورود<input value={config.cta} onChange={(e) => setConfig({...config, cta:e.target.value})} /></label>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
