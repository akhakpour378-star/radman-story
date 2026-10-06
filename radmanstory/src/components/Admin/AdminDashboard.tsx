"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Image as ImageIcon,
  LayoutDashboard,
  RotateCcw,
  Save,
  Settings2,
  Sparkles,
  UserRound,
} from "lucide-react";
import {
  DEFAULT_HERO_CONFIG,
  HeroConfig,
  HERO_CONFIG_STORAGE_KEY,
  readHeroConfig,
  writeHeroConfig,
} from "@/lib/site-config";
import "./AdminDashboard.css";

const navItems = [
  { id: "overview", label: "Overview", fa: "نمای کلی", icon: LayoutDashboard },
  { id: "hero", label: "Hero", fa: "صفحه آغازین", icon: Sparkles },
];

const fieldLabels: Record<keyof HeroConfig, string> = {
  photo: "Hero image path",
  photoAlt: "Image description",
  dateMonth: "Birth month",
  dateDay: "Birth day",
  dateYear: "Birth year",
  time: "Birth time",
  weight: "Birth weight",
  height: "Birth height",
  place: "Birth place",
  city: "City",
  country: "Country",
  ctaLabel: "CTA label",
};

export default function AdminDashboard() {
  const [active, setActive] = useState("hero");
  const [form, setForm] = useState<HeroConfig>(DEFAULT_HERO_CONFIG);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(readHeroConfig());
  }, []);

  const previewSrc = useMemo(() => {
    if (!form.photo) return "";
    if (form.photo.startsWith("/memory/")) {
      return `/api/memory?file=${encodeURIComponent(form.photo.slice(1))}`;
    }
    return form.photo;
  }, [form.photo]);

  const update = (key: keyof HeroConfig, value: string) => {
    setSaved(false);
    setForm((current) => ({ ...current, [key]: value }));
  };

  const save = () => {
    writeHeroConfig(form);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2400);
  };

  const reset = () => {
    if (!window.confirm("Reset Hero settings to the original values?")) return;
    writeHeroConfig(DEFAULT_HERO_CONFIG);
    setForm(DEFAULT_HERO_CONFIG);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2400);
  };

  const renderField = (key: keyof HeroConfig, type = "text") => (
    <label className="admin-field" key={key}>
      <span>{fieldLabels[key]}</span>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => update(key, e.target.value)}
        dir={key === "photo" || key === "photoAlt" || key === "ctaLabel" ? "ltr" : "auto"}
      />
    </label>
  );

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand__mark">R</div>
          <div>
            <strong>RADMAN</strong>
            <span>MEMORY CMS</span>
          </div>
        </div>

        <div className="admin-sidebar__label">CONTENT</div>
        <nav>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={active === item.id ? "is-active" : ""}
                onClick={() => setActive(item.id)}
              >
                <Icon size={17} />
                <span><b>{item.label}</b><small>{item.fa}</small></span>
                <ChevronRight size={14} />
              </button>
            );
          })}
        </nav>

        <div className="admin-sidebar__bottom">
          <button className="admin-side-link"><Settings2 size={16} /> Settings</button>
          <a className="admin-side-link" href="/"><ArrowLeft size={16} /> Back to story</a>
        </div>
      </aside>

      <section className="admin-main">
        <header className="admin-header">
          <div>
            <span className="admin-eyebrow">RADMAN / CONTENT MANAGEMENT</span>
            <h1>{active === "hero" ? "Hero Editor" : "Dashboard"}</h1>
            <p>مدیریت محتوای سایت یادبود رادمان</p>
          </div>
          <div className="admin-header__actions">
            <a href="/" target="_blank" rel="noreferrer" className="admin-ghost">
              <ArrowLeft size={15} /> Preview site
            </a>
            {active === "hero" && (
              <button className="admin-save" onClick={save}>
                {saved ? <Check size={16} /> : <Save size={16} />}
                {saved ? "Saved" : "Save changes"}
              </button>
            )}
          </div>
        </header>

        {active === "hero" ? (
          <div className="admin-content">
            <div className="admin-toolbar">
              <div>
                <span>01 / HERO</span>
                <strong>صفحه‌ی اول و اطلاعات تولد</strong>
              </div>
              <button className="admin-reset" onClick={reset}><RotateCcw size={14} /> Reset</button>
            </div>

            <div className="admin-grid">
              <section className="admin-card admin-card--form">
                <div className="admin-card__head">
                  <div className="admin-card__icon"><Sparkles size={18} /></div>
                  <div>
                    <h2>Hero content</h2>
                    <p>اطلاعاتی که در سمت راست تصویر نمایش داده می‌شود.</p>
                  </div>
                </div>

                <div className="admin-section-title"><UserRound size={14} /> Birth information</div>
                <div className="admin-fields admin-fields--three">
                  {renderField("dateMonth")}
                  {renderField("dateDay")}
                  {renderField("dateYear")}
                </div>
                <div className="admin-fields admin-fields--two">
                  {renderField("time")}
                  {renderField("weight")}
                  {renderField("height")}
                </div>
                <div className="admin-fields admin-fields--two">
                  {renderField("place")}
                  {renderField("city")}
                  {renderField("country")}
                </div>

                <div className="admin-section-title"><ImageIcon size={14} /> Visual</div>
                {renderField("photo")}
                {renderField("photoAlt")}

                <div className="admin-section-title"><Sparkles size={14} /> Interaction</div>
                {renderField("ctaLabel")}
              </section>

              <aside className="admin-preview-card">
                <div className="admin-preview-card__top">
                  <span>LIVE PREVIEW</span>
                  <i />
                </div>
                <div className="admin-preview">
                  {previewSrc ? (
                    <img src={previewSrc} alt={form.photoAlt} />
                  ) : (
                    <div className="admin-preview__empty">No image</div>
                  )}
                  <div className="admin-preview__shade" />
                  <div className="admin-preview__data">
                    <div><small>DATE OF BIRTH</small><b>{form.dateMonth} / {form.dateDay} / {form.dateYear}</b></div>
                    <div><small>TIME OF BIRTH</small><b>{form.time}</b></div>
                    <div><small>BIRTH WEIGHT</small><b>{form.weight} <em>kg</em></b></div>
                    <div><small>BIRTH HEIGHT</small><b>{form.height} <em>cm</em></b></div>
                    <div><small>PLACE OF BIRTH</small><b>{form.place}</b><em>{form.city} · {form.country}</em></div>
                  </div>
                  <div className="admin-preview__cta">{form.ctaLabel}<span /></div>
                </div>
                <div className="admin-preview-card__note">
                  <span>STATUS</span>
                  <strong><i /> Local preview</strong>
                  <small>Changes are stored in this browser and are applied to the public story after refresh.</small>
                </div>
              </aside>
            </div>
          </div>
        ) : (
          <div className="admin-empty">
            <Sparkles size={26} />
            <h2>Content dashboard</h2>
            <p>Hero is the first editable module. Sections will be added here as they are completed.</p>
            <button onClick={() => setActive("hero")}>Open Hero editor</button>
          </div>
        )}
      </section>
    </main>
  );
}
