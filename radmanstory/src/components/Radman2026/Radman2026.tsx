"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Volume2, VolumeX, ArrowDown, ArrowUpRight } from "lucide-react";
import "./Radman2026.css";

gsap.registerPlugin(ScrollTrigger);

const frames = [
  { src: "/memory/radman-and-me.png", label: "WITH DAD", chapter: "TOGETHER" },
  { src: "/memory/radman-main.JPG", label: "RADMAN", chapter: "BEGINNING" },
  { src: "/memories/memory-01.JPG", label: "FIRST LAUGH", chapter: "GROWING" },
  { src: "/memories/memory-02.JPG", label: "FIRST STEPS", chapter: "GROWING" },
  { src: "/memories/memory-03.JPG", label: "A NEW WORLD", chapter: "DISCOVERY" },
  { src: "/memory/radman-second.JPG", label: "PORTRAIT", chapter: "GROWING" },
  { src: "/memory/radman-sit.jpeg", label: "QUIET FRAME", chapter: "MEMORY" },
  { src: "/memory/world/radman-forest-cinematic.jpg", label: "THE WORLD", chapter: "DISCOVERY" },
  { src: "/memory/world/radman-main.JPG", label: "ANOTHER DAY", chapter: "MEMORY" },
];

const chapters = [
  { n: "01", title: "The beginning.", text: "Before the years had names, there was a face, a laugh, and a new reason for everything.", frame: 1 },
  { n: "02", title: "Becoming.", text: "Childhood is not one event. It is thousands of tiny changes, preserved here as photographs.", frame: 2 },
  { n: "03", title: "Together.", text: "Some frames are about the person in them. Others are about who was standing beside them.", frame: 0 },
  { n: "04", title: "The world opens.", text: "Every new place becomes part of the archive. The story gets wider without losing its center.", frame: 7 },
];

export default function Radman2026() {
  const root = useRef<main>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  const [sound, setSound] = useState(false);
  const [archiveFrames, setArchiveFrames] = useState(frames);

  useEffect(() => {
    let alive = true;
    fetch("/api/memory?list=1").then((response) => response.json()).then((data: { images?: string[] }) => {
      if (!alive || !Array.isArray(data.images) || data.images.length === 0) return;
      const known = new Map(frames.map((frame) => [frame.src, frame]));
      const dynamic = data.images.map((src, index) => known.get(src) ?? ({ src, label: "MEMORY " + String(index + 1).padStart(2, "0"), chapter: "ARCHIVE" }));
      setArchiveFrames(dynamic);
    }).catch(() => {});
    return () => { alive = false; };
  }, []);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const intro = gsap.timeline({ defaults: { ease: "power4.out" } });
      intro
        .from(".r26-hero__kicker", { y: 24, opacity: 0, duration: .8, delay: .2 })
        .from(".r26-hero__title .line > span", { yPercent: 110, opacity: 0, duration: 1.1, stagger: .08 }, "-=.4")
        .from(".r26-hero__description", { y: 24, opacity: 0, duration: .8 }, "-=.65")
        .from(".r26-hero__image", { opacity: 0, scale: 1.08, duration: 1.8 }, "-=1")
        .from(".r26-hero__meta", { opacity: 0, x: 20, duration: .8 }, "-=.8");

      gsap.to(".r26-hero__image img", {
        scale: 1.18, yPercent: 8, ease: "none",
        scrollTrigger: { trigger: ".r26-hero", start: "top top", end: "bottom top", scrub: 1.4 }
      });
      gsap.to(".r26-hero__copy", {
        yPercent: -34, opacity: 0, ease: "none",
        scrollTrigger: { trigger: ".r26-hero", start: "top top", end: "72% top", scrub: 1 }
      });
      gsap.to(".r26-hero__orb", {
        xPercent: 80, yPercent: -25, rotation: 100, ease: "none",
        scrollTrigger: { trigger: ".r26-hero", start: "top top", end: "bottom top", scrub: 1.5 }
      });
      gsap.to(".r26-hero__grain", {
        backgroundPosition: "120% 20%", ease: "none",
        scrollTrigger: { trigger: ".r26-hero", start: "top top", end: "bottom top", scrub: 1 }
      });

      gsap.utils.toArray<HTMLElement>(".r26-reveal").forEach((node) => {
        gsap.fromTo(node, { y: 65, opacity: 0 }, {
          y: 0, opacity: 1, duration: 1, ease: "power4.out",
          scrollTrigger: { trigger: node, start: "top 86%", toggleActions: "play none none reverse" }
        });
      });

      gsap.utils.toArray<HTMLElement>(".r26-chapter").forEach((chapter) => {
        const image = chapter.querySelector(".r26-chapter__image");
        gsap.fromTo(image, { clipPath: "inset(10% 10% 10% 10%)", scale: 1.08 }, {
          clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 1.3, ease: "power4.out",
          scrollTrigger: { trigger: chapter, start: "top 78%", toggleActions: "play none none reverse" }
        });
        gsap.to(image?.querySelector("img") as Element, {
          yPercent: -8, scale: 1.1, ease: "none",
          scrollTrigger: { trigger: chapter, start: "top bottom", end: "bottom top", scrub: 1.2 }
        });
      });

      gsap.to(".r26-archive__track", {
        xPercent: -10, ease: "none",
        scrollTrigger: { trigger: ".r26-archive", start: "top bottom", end: "bottom top", scrub: 1.2 }
      });

      gsap.to(".r26-progress i", {
        scaleX: 1, transformOrigin: "left", ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: .1 }
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const toggleSound = () => {
    if (!audio.current) {
      audio.current = new Audio("/api/memory?file=memory/memory-audio.mp3");
      audio.current.loop = true;
      audio.current.volume = .25;
    }
    if (sound) {
      audio.current.pause();
      setSound(false);
    } else {
      audio.current.play().catch(() => {});
      setSound(true);
    }
  };

  return (
    <main ref={root} className="r26">
      <div className="r26-progress"><i /></div>
      <header className="r26-nav">
        <a href="#top" className="r26-logo">R<span>.</span></a>
        <span className="r26-nav__center">RADMAN / VISUAL BIOGRAPHY</span>
        <button onClick={toggleSound} aria-label="Toggle sound">
          {sound ? <Volume2 size={15} /> : <VolumeX size={15} />}
          <span>{sound ? "SOUND ON" : "SOUND"}</span>
        </button>
      </header>

      <section id="top" className="r26-hero">
        <div className="r26-hero__background" />
        <div className="r26-hero__orb" />
        <div className="r26-hero__light" />
        <div className="r26-hero__grain" />
        <div className="r26-hero__image"><img src="/memory/radman-and-me.png" alt="Radman and his father" /></div>
        <div className="r26-hero__veil" />
        <div className="r26-hero__copy">
          <p className="r26-hero__kicker"><span />A LIFE IN FRAMES · 2026</p>
          <h1 className="r26-hero__title"><span className="line"><span>RADMAN</span></span><span className="line"><em>A STORY</em><span>IN MOTION.</span></span></h1>
          <p className="r26-hero__description">یک زندگی، ثبت‌شده در لحظه‌هایی که ارزش ماندن دارند.</p>
        </div>
        <div className="r26-hero__meta"><span>01 / 04</span><b>MEMORY<br/>MOTION<br/>TIME</b></div>
        <div className="r26-hero__scroll"><ArrowDown size={14} /><span>SCROLL TO ENTER</span></div>
      </section>

      <section className="r26-statement r26-reveal">
        <span className="r26-index">00 / THE IDEA</span>
        <h2>A biography should feel<br/><i>like a memory.</i></h2>
        <p>نه یک گالری تکراری، نه یک صفحه‌ی عکس. این سایت روایت تصویری زندگی رادمان است؛ هر بخش با ریتم، عمق و حرکت خودش.</p>
      </section>

      <section className="r26-chapters">
        {chapters.map((chapter) => {
          const frame = archiveFrames[chapter.frame] ?? frames[chapter.frame];
          return (
            <article className="r26-chapter" key={chapter.n}>
              <div className="r26-chapter__number">{chapter.n}</div>
              <div className="r26-chapter__image"><img src={frame.src} alt={frame.label} loading="lazy" /></div>
              <div className="r26-chapter__copy r26-reveal">
                <span>{frame.chapter} / {frame.label}</span>
                <h2>{chapter.title}</h2>
                <p>{chapter.text}</p>
                <i />
              </div>
            </article>
          );
        })}
      </section>

      <section className="r26-archive">
        <div className="r26-archive__heading r26-reveal">
          <span className="r26-index">THE ARCHIVE / ORIGINAL FRAMES</span>
          <h2>Every frame<br/><i>has a place.</i></h2>
        </div>
        <div className="r26-archive__track">
          {archiveFrames.map((frame, index) => (
            <figure key={frame.src} className={"r26-card r26-card--" + ((index % 5) + 1)}>
              <div><img src={frame.src} alt={frame.label} loading="lazy" /></div>
              <figcaption><span>0{index + 1}</span><b>{frame.label}</b><small>{frame.chapter}</small></figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="r26-film">
        <div className="r26-film__copy r26-reveal">
          <span className="r26-index">MOVING MEMORY / 05</span>
          <h2>Still images<br/><i>begin to breathe.</i></h2>
          <p>ویدئو بخشی از آرشیو است؛ حرکت، صدا و لحظه‌هایی که نمی‌شود در یک فریم نگه داشت.</p>
        </div>
        <div className="r26-film__screen r26-reveal">
          <video src="/memory/memory-video.mp4" controls playsInline preload="metadata" />
        </div>
      </section>

      <section className="r26-last">
        <div className="r26-last__glow" />
        <div className="r26-last__copy r26-reveal">
          <span className="r26-index">THE ARCHIVE CONTINUES</span>
          <h2>There is no<br/><i>final frame.</i></h2>
          <p>داستان رادمان با هر تصویر تازه، یک فصل دیگر پیدا می‌کند.</p>
          <a href="#top">RETURN TO BEGINNING <ArrowUpRight size={14}/></a>
        </div>
      </section>

      <footer className="r26-footer"><b>RADMAN<span>.</span></b><span>VISUAL BIOGRAPHY / 2026</span><small>FOREVER, MY SON.</small></footer>
    </main>
  );
}
