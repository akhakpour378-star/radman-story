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
        .from(".u-hero__title .word span", { yPercent: 120, opacity: 0, duration: 1.15, stagger: 0.08 }, "-=.3")
        .from(".u-hero__lead", { y: 20, opacity: 0, duration: 0.8 }, "-=.65")
        .from(".u-hero__cta", { y: 14, opacity: 0, duration: 0.7 }, "-=.5")
        .from(".u-hero__meta div", { y: 16, opacity: 0, stagger: 0.08, duration: 0.6 }, "-=.4");

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
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, []);

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
        <a href="#top" className="u-logo">R<span>.</span></a>
        <div className="u-nav__center"><span>RADMAN</span><i /><span>VISUAL BIOGRAPHY</span></div>
        <button onClick={toggleSound} aria-label="Toggle ambient sound">
          {sound ? <Volume2 size={14} /> : <VolumeX size={14} />} {sound ? "SOUND ON" : "SOUND"}
        </button>
      </nav>

      <section id="top" className="u-hero u-hero--editorial">
        <div className="u-hero__frame">
          <div className="u-hero__photo">
            <img src={asset("/memory/radman-and-me.png")} alt="Radman and his father — archive photograph" />
          </div>
          <div className="u-hero__photoShade" />
          <div className="u-hero__frameNo">RADMAN &amp; DAD <i /> 01</div>
        </div>

        <div className="u-hero__panel">
          <div className="u-hero__panelTop"><span>RADMAN</span><span>VISUAL BIOGRAPHY / 2026</span></div>
          <div className="u-hero__copy">
            <p className="u-kicker"><span />THE ARCHIVE / A LIFE IN FRAMES</p>
            <h1 className="u-hero__title">
              <span className="word"><span>RADMAN</span></span>
              <span className="word"><em>A LIFE</em><br /><span>IN FRAMES.</span></span>
            </h1>
            <p className="u-hero__lead">از اولین نفس تا سال‌هایی که هنوز نیامده‌اند؛ یک روایت تصویری از رشد، خنده، خانواده و خاطراتی که زمان نمی‌تواند پاکشان کند.</p>
            <a className="u-hero__cta" href="#story"><span>ENTER THE STORY</span><ArrowDown size={14} /></a>
          </div>
          <div className="u-hero__meta">
            <div><small>ORIGINAL FRAMES</small><b>{memories.length}</b></div>
            <div><small>CHAPTERS</small><b>04</b></div>
            <div><small>STORY</small><b>∞</b></div>
          </div>
          <div className="u-hero__panelBottom"><span>MEMORY / 001</span><span>ARCHIVE / 2026</span></div>
        </div>
        <div className="u-orb" /><div className="u-grain" />
        <div className="u-scroll"><ArrowDown size={14} /><span>SCROLL TO ENTER</span></div>
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
        <div className="u-timeline__head u-reveal"><span className="u-kicker">01 / THE YEARS</span><h2>From first breath<br /><em>to becoming.</em></h2></div>
        <div className="u-line" />
        <div className="u-timeline__steps">
          {memories.slice(0, 8).map((m) => <div className="u-step u-reveal" key={m.src}><span>{m.no}</span><b>{m.title}</b><small>{m.tag}</small></div>)}
        </div>
      </section>

      <section className="u-archive">
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
