"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Maximize2,
  CalendarDays,
  Clock3,
  Scale,
  Ruler,
  MapPin,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import "./RadmanUltimate.css";

gsap.registerPlugin(ScrollTrigger);

type Memory = {
  src: string;
  no: string;
  title: string;
  tag: string;
};

const fallback: Memory[] = [
  { src: "/memory/radman-main.JPG", no: "01", title: "The Beginning", tag: "ORIGIN" },
  { src: "/memory/radman-second.JPG", no: "02", title: "First Light", tag: "EARLY YEARS" },
  { src: "/memory/radman-01.JPG", no: "03", title: "Little Days", tag: "CHILDHOOD" },
  { src: "/memory/radman-02.JPG", no: "04", title: "Growing", tag: "CHILDHOOD" },
  { src: "/memory/radman-03.JPG", no: "05", title: "Discovery", tag: "DISCOVERY" },
  { src: "/memory/radman-sit.jpeg", no: "06", title: "Quiet Frame", tag: "MEMORY" },
  { src: "/memory/radman-and-me.png", no: "07", title: "Together", tag: "FAMILY" },
];

const asset = (src: string) =>
  src.startsWith("/memory/")
    ? `/api/memory?file=${encodeURIComponent(src.slice(1))}`
    : src;

const prettyTitle = (file: string, index: number) => {
  const clean = file
    .replace(/^\/memory\//, "")
    .replace(/\.[^.]+$/, "")
    .replace(/\s*\(\d+\)\s*$/, "")
    .replace(/[-_]+/g, " ")
    .trim();
  if (!clean || /^radman$/i.test(clean)) return `Memory ${String(index + 1).padStart(2, "0")}`;
  return clean.replace(/\b\w/g, (c) => c.toUpperCase());
};

export default function RadmanUltimate() {
  const root = useRef<HTMLElement>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  const [sound, setSound] = useState(false);
  const [memories, setMemories] = useState<Memory[]>(fallback);
  const [selected, setSelected] = useState<number | null>(null);

  const particleCanvas = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = particleCanvas.current;
    const hero = canvas?.parentElement;
    if (!canvas || !hero) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let last = 0;

    type Particle = {
      x:number; y:number; vx:number; vy:number;
      size:number; alpha:number; phase:number;
    };

    let particles: Particle[] = [];

    const resize = () => {
      const rect = hero.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(460, Math.max(220, Math.floor((width * height) / 4300)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 18,
        vy: (Math.random() - 0.5) * 14,
        size: Math.random() < 0.86 ? 0.8 : 1.45,
        alpha: 0.14 + Math.random() * 0.34,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const frame = (time: number) => {
      if (!last) last = time;
      const dt = Math.min((time - last) / 1000, 0.04);
      last = time;

      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.phase += dt * 0.22;

        // Slow autonomous floating motion — deliberately visible, never mouse-dependent.
        p.x += (p.vx + Math.cos(p.phase) * 2.4) * dt;
        p.y += (p.vy + Math.sin(p.phase * 0.82) * 1.9) * dt;

        if (p.x < -12) p.x = width + 12;
        if (p.x > width + 12) p.x = -12;
        if (p.y < -12) p.y = height + 12;
        if (p.y > height + 12) p.y = -12;

        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = "rgba(225,238,237,1)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      raf = window.requestAnimationFrame(frame);
    };

    resize();
    window.addEventListener("resize", resize);
    raf = window.requestAnimationFrame(frame);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    let alive = true;
    fetch("/api/memory?list=1")
      .then((r) => r.json())
      .then((data: { images?: string[] }) => {
        if (!alive || !Array.isArray(data.images) || !data.images.length) return;
        const files = data.images.filter((x) => /\.(jpe?g|png|webp|avif)$/i.test(x));
        const next = files.map((src, index) => ({
          src,
          no: String(index + 1).padStart(2, "0"),
          title: prettyTitle(src, index),
          tag: index < 2 ? "ORIGIN" : index < 8 ? "CHILDHOOD" : "ARCHIVE",
        }));
        setMemories(next);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const selectedMemory = selected === null ? null : memories[selected];

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const intro = gsap.timeline({ defaults: { ease: "power4.out" } });
      intro
        .from(".u-hero__panelTop span", { y: 14, opacity: 0, stagger: 0.08, duration: 0.7, delay: 0.15 })
        .from(".u-hero__titleLine", { yPercent: 105, opacity: 0, duration: 1.1, stagger: 0.1 }, "-=.3")
        .from(".u-hero__lead", { y: 18, opacity: 0, duration: 0.75 }, "-=.4")
        .from(".u-hero__cta", { y: 12, opacity: 0, duration: 0.65 }, "-=.45")
        .from(".u-birthData__item", { y: 14, opacity: 0, stagger: 0.07, duration: 0.5 }, "-=.45")
        .from(".u-hero__tattoo", { opacity: 0, duration: 0.6 }, "-=.3");

      gsap.to(".u-hero__photo img", {
        scale: 1.17,
        yPercent: 8,
        ease: "none",
        scrollTrigger: { trigger: ".u-hero", start: "top top", end: "bottom top", scrub: 1.4 },
      });
      gsap.to(".u-hero__copy", {
        yPercent: -28,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: ".u-hero", start: "top top", end: "65% top", scrub: 1 },
      });
      gsap.to(".u-orb", {
        xPercent: 75,
        yPercent: -25,
        rotation: 120,
        ease: "none",
        scrollTrigger: { trigger: ".u-hero", start: "top top", end: "bottom top", scrub: 1.5 },
      });

      gsap.utils.toArray<HTMLElement>(".u-reveal").forEach((node) => {
        gsap.fromTo(
          node,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power4.out",
            scrollTrigger: { trigger: node, start: "top 86%" },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>(".u-chapter__image").forEach((box) => {
        gsap.fromTo(
          box,
          { clipPath: "inset(10% 10% 10% 10%)", scale: 1.06 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            scale: 1,
            duration: 1.25,
            ease: "power4.out",
            scrollTrigger: { trigger: box, start: "top 80%" },
          },
        );
        gsap.to(box.querySelector("img"), {
          yPercent: -8,
          scale: 1.08,
          ease: "none",
          scrollTrigger: { trigger: box, start: "top bottom", end: "bottom top", scrub: 1 },
        });
      });

      gsap.utils.toArray<HTMLElement>(".u-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 50 + (i % 3) * 18, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power4.out",
            scrollTrigger: { trigger: card, start: "top 92%" },
          },
        );
      });

      gsap.to(".u-progress i", {
        scaleX: 1,
        transformOrigin: "left",
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.1 },
      });
    }, el);
    return () => ctx.revert();
  }, [memories.length]);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      document.documentElement.style.setProperty("--mx", `${e.clientX}px`);
      document.documentElement.style.setProperty("--my", `${e.clientY}px`);
    };
    const cards = Array.from(document.querySelectorAll<HTMLElement>(".u-card button, .u-chapter__image, .u-hero__cta, .u-manifesto__enter"));
    const tilt = (e: MouseEvent) => {
      const el = e.currentTarget as HTMLElement;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      el.style.setProperty("--rx", `${(-y * 5).toFixed(2)}deg`);
      el.style.setProperty("--ry", `${(x * 7).toFixed(2)}deg`);
      el.style.setProperty("--px", `${(x * 18).toFixed(1)}px`);
      el.style.setProperty("--py", `${(y * 18).toFixed(1)}px`);
    };
    const reset = (e: MouseEvent) => {
      const el = e.currentTarget as HTMLElement;
      el.style.setProperty("--rx", "0deg"); el.style.setProperty("--ry", "0deg");
      el.style.setProperty("--px", "0px"); el.style.setProperty("--py", "0px");
    };
    window.addEventListener("mousemove", move, { passive: true });
    cards.forEach((el) => { el.addEventListener("mousemove", tilt); el.addEventListener("mouseleave", reset); });
    return () => {
      window.removeEventListener("mousemove", move);
      cards.forEach((el) => { el.removeEventListener("mousemove", tilt); el.removeEventListener("mouseleave", reset); });
    };
  }, [memories.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (selected === null) return;
      if (e.key === "Escape") setSelected(null);
      if (e.key === "ArrowRight") setSelected((v) => (v === null ? 0 : (v + 1) % memories.length));
      if (e.key === "ArrowLeft") setSelected((v) => (v === null ? 0 : (v - 1 + memories.length) % memories.length));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = selected !== null ? "hidden" : "";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selected, memories.length]);

  const toggleSound = () => {
    if (!audio.current) {
      audio.current = new Audio(asset("/memory/memory-audio.mp3"));
      audio.current.loop = true;
      audio.current.volume = 0.22;
    }
    if (sound) {
      audio.current.pause();
      setSound(false);
    } else {
      audio.current.play().catch(() => {});
      setSound(true);
    }
  };

  const chapters = useMemo(() => {
    const pick = (index: number) => memories[index % Math.max(memories.length, 1)] ?? fallback[index];
    return [
      ["01", "THE BEGINNING", "A face arrives and an ordinary life becomes a story.", pick(0)],
      ["02", "THE LITTLE YEARS", "The years move quickly. The archive keeps what time cannot.", pick(2)],
      ["03", "BECOMING", "Hundreds of ordinary moments slowly become a childhood.", pick(Math.min(7, memories.length - 1))],
      ["04", "TOGETHER", "Some memories are not about a place. They are about who was there.", memories.find((m) => /together|and-me/i.test(m.src)) ?? pick(0)],
    ] as const;
  }, [memories]);

  return (
    <main ref={root} className="u">
      <div className="u-cursorLight" aria-hidden="true" />
      <div className="u-cursorDot" aria-hidden="true" />
      <div className="u-progress"><i /></div>

      <nav className="u-nav">
        <a href="#top" className="u-logo" aria-label="Radman">
          <span className="u-logo__mark" aria-hidden="true"><span className="u-logo__r" aria-hidden="true">R</span></span>
          
        </a>
        <div className="u-nav__center">
          <a href="#story">STORY</a>
          <a href="#chapters">CHAPTERS</a>
          <a href="#archive">ARCHIVE</a>
        </div>
        <button className="u-nav__sound" onClick={toggleSound} aria-label="Toggle ambient sound">
          {sound ? <Volume2 size={13} /> : <VolumeX size={13} />}<span>{sound ? "ON" : "SOUND"}</span>
        </button>
      </nav>

      <section id="top" className="u-hero u-hero--editorial"><canvas ref={particleCanvas} className="u-hero__particles" aria-hidden="true" />
        <div className="u-hero__frame">
          <div className="u-hero__photo">
            <img src={asset("/memory/radman-and-me.png")} alt="Radman and his father — archive photograph" />
          </div>
          <div className="u-hero__photoShade" />
          <div className="u-hero__halo" aria-hidden="true" />
          <div className="u-hero__ghost" aria-hidden="true">R</div>
          
        </div>
        <div className="u-hero__panel">
          <div className="u-hero__birthData" aria-label="Radman birth details">
            <div className="u-birthData__item u-birthData__date">
              <small><CalendarDays size={11} /> DATE OF BIRTH</small>
              <strong>DEC <span>/</span> 01 <span>/</span> 2022</strong>
            </div>
            <div className="u-birthData__item u-birthData__time">
              <small><Clock3 size={11} /> TIME OF BIRTH</small>
              <strong>14<span>:</span>15</strong>
            </div>
            <div className="u-birthData__item u-birthData__weight">
              <small><Scale size={11} /> BIRTH WEIGHT</small>
              <strong>3.100 <i>kg</i></strong>
            </div>
            <div className="u-birthData__item u-birthData__height">
              <small><Ruler size={11} /> BIRTH HEIGHT</small>
              <strong>49 <i>cm</i></strong>
            </div>
            <div className="u-birthData__item u-birthData__place">
              <small><MapPin size={11} /> PLACE OF BIRTH</small>
              <strong>NIKAN AQDASIEH</strong>
              <em>Tehran · Iran</em>
            </div>
          </div>
        </div>
        <a className="u-hero__cta" href="#story" aria-label="Enter Radman's story">
          <span>ENTER THE STORY</span>
          <ArrowDown size={13} />
        </a>
        <div className="u-orb" />
        <div className="u-grain" />
      </section>

      <section id="story" className="u-manifesto">
        <div className="u-manifesto__ambient" aria-hidden="true" />
        <div className="u-manifesto__top u-reveal">
          <span className="u-kicker">00 / THE ARCHIVE</span>
          <span className="u-manifesto__index">A PRIVATE VISUAL BIOGRAPHY</span>
        </div>
        <div className="u-manifesto__copy u-reveal">
          <p className="u-manifesto__eyebrow">A STORY IS BUILT FROM SMALL MOMENTS.</p>
          <h2>Not a gallery.<br /><em>A living archive.</em></h2>
          <p>هر تصویر فقط یک عکس نیست؛ یک نشانه از زمانی است که دیگر تکرار نمی‌شود. اینجا عکس‌ها با ریتم، فاصله، نور و حرکت کنار هم قرار می‌گیرند تا داستان آرام‌آرام شکل بگیرد.</p>
          <a className="u-manifesto__enter" href="#chapters"><span>EXPLORE THE STORY</span><ArrowDown size={14} /></a>
        </div>
        <div className="u-manifesto__side u-reveal">
          <div className="u-manifesto__quote">A moment is small.<br /><em>Memory is not.</em></div>
          <div className="u-manifesto__numbers">
            <div><b>{String(memories.length).padStart(2, "0")}</b><span>ORIGINAL FRAMES</span></div>
            <div><b>04</b><span>CHAPTERS</span></div>
            <div><b>∞</b><span>UNFINISHED STORY</span></div>
          </div>
        </div>
        <div className="u-manifesto__line" aria-hidden="true" />
      </section>

      <section className="u-reel" aria-label="Selected memories">
        <div className="u-reel__head">
          <span className="u-kicker">00.5 / MEMORY SIGNAL</span>
          <p>Twenty photographs. One childhood. No two frames carry the same weight.</p>
        </div>
        <div className="u-reel__track">
          {memories.slice(0, Math.min(8, memories.length)).map((m, i) => (
            <button className="u-reel__item" key={m.src} onClick={() => setSelected(i)} aria-label={m.title}>
              <span>{m.no}</span><img src={asset(m.src)} alt={m.title} loading="lazy" /><b>{m.title}</b>
            </button>
          ))}
        </div>
      </section>

      <section id="chapters" className="u-chapters">
        {chapters.map(([num, title, copy, m]) => (
          <article className="u-chapter" key={num}>
            <div className="u-chapter__top"><b>{num}</b><span>{m.tag}</span><small>STORY / 04</small></div>
            <div className="u-chapter__layout">
              <button className="u-chapter__image" onClick={() => setSelected(memories.indexOf(m))} aria-label={`Open ${m.title}`}>
                <img src={asset(m.src)} alt={m.title} />
                <span>{m.no}</span>
                <i><Maximize2 size={13} /></i>
              </button>
              <div className="u-chapter__copy u-reveal">
                <p className="u-kicker">{m.tag} / {m.no}</p>
                <h2>{title}</h2>
                <p>{copy}</p>
                <div className="u-rule" />
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="u-timeline">
        <div className="u-timeline__head u-reveal">
          <span className="u-kicker">01 / THE YEARS</span>
          <h2>Time leaves traces.<br /><em>We keep them.</em></h2>
          <p>هر تصویر یک نقطه روی خط زمان است؛ اما وقتی کنار تصویر بعدی قرار می‌گیرد، تبدیل به روایت می‌شود.</p>
        </div>
        <div className="u-line" />
        <div className="u-timeline__steps">
          {memories.slice(0, 8).map((m, i) => (
            <button className="u-step u-reveal" key={m.src} onClick={() => setSelected(i)}>
              <span>{m.no}</span><b>{m.title}</b><small>{m.tag}</small>
              <i><ArrowUpRight size={12} /></i>
            </button>
          ))}
        </div>
      </section>

      <section id="archive" className="u-archive">
        <div className="u-archive__head u-reveal">
          <div><span className="u-kicker">02 / THE COMPLETE ARCHIVE</span><h2>Small moments.<br /><em>Kept forever.</em></h2></div>
          <p>{memories.length} قاب از آرشیو واقعی رادمان؛ با اندازه‌های کنترل‌شده و نسبت تصویر طبیعی تا هر عکس مثل یک اثر مستقل دیده شود.</p>
        </div>
        <div className="u-archive__grid">
          {memories.map((m, i) => (
            <figure className={"u-card u-card--" + (i % 4)} key={m.src}>
              <button onClick={() => setSelected(i)} aria-label={`Open ${m.title}`}>
                <img src={asset(m.src)} alt={m.title} loading={i < 5 ? "eager" : "lazy"} />
                <span>{m.no}</span>
                <i><Maximize2 size={12} /></i>
              </button>
              <figcaption><small>{m.tag}</small><b>{m.title}</b><em>{m.no}</em></figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="u-film">
        <div className="u-film__copy u-reveal">
          <span className="u-kicker">03 / MOVING MEMORY</span>
          <h2>Photos hold time.<br /><em>Film holds breath.</em></h2>
          <p>در این بخش عکس به حرکت تبدیل می‌شود؛ یک فریم آرام، سپس ویدئویی که لحظه را دوباره زنده می‌کند.</p>
        </div>
        <div className="u-film__media u-reveal">
          <img src={asset("/memory/radman-sit.jpeg")} alt="Radman seated from behind" />
          <span>QUIET FRAME / RADMAN</span>
        </div>
        <div className="u-video u-reveal">
          <video src={asset("/memory/memory-video.mp4")} controls playsInline preload="metadata" />
          <small>ORIGINAL MEDIA / PLAY</small>
        </div>
      </section>

      <section className="u-finale">
        <div className="u-finale__glow" />
        <div className="u-finale__copy u-reveal">
          <span className="u-kicker">04 / THE STORY CONTINUES</span>
          <h2>There is no<br /><em>final frame.</em></h2>
          <p>آرشیو با هر تصویر تازه، فصل تازه‌ای پیدا می‌کند.</p>
          <a href="#top">RETURN TO BEGINNING <ArrowUpRight size={14} /></a>
        </div>
      </section>

      <footer className="u-footer"><b>RADMAN<span>.</span></b><span>VISUAL BIOGRAPHY / 2026</span><small>FOREVER, MY SON.</small></footer>

      {selectedMemory && (
        <div className="u-lightbox" role="dialog" aria-modal="true" aria-label={selectedMemory.title}>
          <button className="u-lightbox__close" onClick={() => setSelected(null)} aria-label="Close"><X /></button>
          <button className="u-lightbox__prev" onClick={() => setSelected((selected! - 1 + memories.length) % memories.length)} aria-label="Previous"><ArrowLeft /></button>
          <div className="u-lightbox__image"><img src={asset(selectedMemory.src)} alt={selectedMemory.title} /></div>
          <div className="u-lightbox__info"><span>{selectedMemory.no} / {String(memories.length).padStart(2, "0")}</span><b>{selectedMemory.title}</b><small>{selectedMemory.tag}</small></div>
          <button className="u-lightbox__next" onClick={() => setSelected((selected! + 1) % memories.length)} aria-label="Next"><ArrowRight /></button>
        </div>
      )}
    </main>
  );
}
