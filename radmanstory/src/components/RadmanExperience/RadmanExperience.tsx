"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { ArrowDown, ArrowUpRight, Volume2, VolumeX } from "lucide-react";
import "./RadmanExperience.css";

gsap.registerPlugin(ScrollTrigger);

const hero = "/memory/radman-and-me.png";

const archive = [
  ["/memories/memory-01.JPG", "01", "BEGINNING", "The first chapter"],
  ["/memories/memory-02.JPG", "02", "BEGINNING", "A day to remember"],
  ["/memories/memory-03.JPG", "03", "GROWING", "Little moments"],
  ["/memory/radman-main.JPG", "04", "GROWING", "Becoming"],
  ["/memory/radman-second.JPG", "05", "TOGETHER", "Side by side"],
  ["/memory/radman-sit.jpeg", "06", "MEMORY", "A quiet frame"],
  ["/memory/world/radman-forest-cinematic.jpg", "07", "THE WORLD", "Into the light"],
  ["/memory/radman-and-me.png", "08", "FOREVER", "Us, in one frame"],
].map(([file, number, tag, title]) => ({ file, number, tag, title }));

const chapters = [
  {
    number: "01",
    eyebrow: "BEGINNING / THE FIRST CHAPTER",
    title: "Before there were milestones, there were moments.",
    copy: "The story opens with the ordinary photographs that later become extraordinary simply because they were lived.",
    images: [archive[0], archive[1]],
  },
  {
    number: "02",
    eyebrow: "GROWING / THE WORLD OPENS",
    title: "A childhood is built from a thousand small discoveries.",
    copy: "Faces, places, gestures and tiny details become the visual language of a life as it grows.",
    images: [archive[2], archive[3]],
  },
  {
    number: "03",
    eyebrow: "TOGETHER / TWO PEOPLE",
    title: "Some photographs are really about the distance between two people.",
    copy: "The frame becomes a record of connection: where we were, how we stood, and everything that existed between us.",
    images: [archive[4], archive[5]],
  },
  {
    number: "04",
    eyebrow: "FOREVER / THE ARCHIVE",
    title: "The photograph ends. The memory does not.",
    copy: "The final chapter is deliberately open. New frames can be added without changing the story that came before them.",
    images: [archive[6], archive[7]],
  },
];

export default function RadmanExperience() {
  const root = useRef<HTMLDivElement>(null);
  const [sound, setSound] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => () => {
    audio.current?.pause();
    audio.current = null;
  }, []);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    const lenis = new Lenis({ duration: 1.05, smoothWheel: true, touchMultiplier: 1.05 });
    let raf = 0;
    const tick = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);

      gsap.timeline({ defaults: { ease: "power4.out" } })
        .from(q(".rx-hero__eyebrow"), { y: 28, opacity: 0, duration: 0.9, delay: 0.25 })
        .from(q(".rx-hero__title .word"), { yPercent: 120, opacity: 0, stagger: 0.08, duration: 1.15 }, "-=.45")
        .from(q(".rx-hero__lead"), { y: 25, opacity: 0, duration: 0.9 }, "-=.65")
        .from(q(".rx-hero__aside"), { x: 35, opacity: 0, duration: 0.9 }, "-=.65")
        .from(q(".rx-hero__portrait"), { y: 40, opacity: 0, scale: 0.92, duration: 1 }, "-=.7")
        .from(q(".rx-hero__scroll"), { y: 20, opacity: 0, duration: 0.8 }, "-=.5");

      gsap.to(q(".rx-hero__media img"), {
        scale: 1.16,
        yPercent: 7,
        ease: "none",
        scrollTrigger: { trigger: q(".rx-hero"), start: "top top", end: "bottom top", scrub: 1.5 },
      });

      gsap.to(q(".rx-hero__portrait"), {
        yPercent: -28,
        xPercent: 7,
        rotate: 2,
        ease: "none",
        scrollTrigger: { trigger: q(".rx-hero"), start: "top top", end: "bottom top", scrub: 1.2 },
      });

      gsap.to(q(".rx-hero__orb"), {
        xPercent: 45,
        yPercent: 28,
        rotation: 80,
        ease: "none",
        scrollTrigger: { trigger: q(".rx-hero"), start: "top top", end: "bottom top", scrub: 1.2 },
      });

      gsap.to(q(".rx-hero__title"), {
        yPercent: -22,
        ease: "none",
        scrollTrigger: { trigger: q(".rx-hero"), start: "top top", end: "bottom top", scrub: 1 },
      });

      gsap.utils.toArray<HTMLElement>(q(".rx-reveal")).forEach((node) => {
        gsap.fromTo(node, { y: 70, opacity: 0 }, {
          y: 0, opacity: 1, duration: 1.05, ease: "power4.out",
          scrollTrigger: { trigger: node, start: "top 84%", toggleActions: "play none none reverse" },
        });
      });

      gsap.utils.toArray<HTMLElement>(q(".rx-chapter")).forEach((chapter) => {
        const mosaic = chapter.querySelector(".rx-chapter__mosaic");
        const copy = chapter.querySelector(".rx-chapter__copy");
        gsap.fromTo(mosaic, { clipPath: "inset(12% 10% 12% 10%)", scale: 1.06 }, {
          clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 1.35, ease: "power4.out",
          scrollTrigger: { trigger: chapter, start: "top 78%", toggleActions: "play none none reverse" },
        });
        gsap.fromTo(copy, { y: 55, opacity: 0 }, {
          y: 0, opacity: 1, duration: 1.1, ease: "power4.out",
          scrollTrigger: { trigger: chapter, start: "top 72%", toggleActions: "play none none reverse" },
        });
      });

      gsap.utils.toArray<HTMLElement>(q(".rx-memory-card")).forEach((card, i) => {
        gsap.fromTo(card, { y: 90 + (i % 3) * 20, opacity: 0, rotate: (i % 2 ? 1.5 : -1.5) }, {
          y: 0, opacity: 1, rotate: 0, duration: 1.05, ease: "power4.out",
          scrollTrigger: { trigger: card, start: "top 91%", toggleActions: "play none none reverse" },
        });
      });

      gsap.to(q(".rx-memory__rail"), {
        xPercent: -8,
        ease: "none",
        scrollTrigger: { trigger: q(".rx-memory"), start: "top bottom", end: "bottom top", scrub: 1.2 },
      });

      gsap.to(q(".rx-film__media img"), {
        scale: 1.13, yPercent: 6, ease: "none",
        scrollTrigger: { trigger: q(".rx-film"), start: "top bottom", end: "bottom top", scrub: 1.2 },
      });

      gsap.to(q(".rx-progress__bar"), {
        scaleX: 1, transformOrigin: "left", ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.1 },
      });

      const cursor = q(".rx-cursor")[0] as HTMLElement | undefined;
      const glow = q(".rx-cursor-glow")[0] as HTMLElement | undefined;
      let mouseX = 0, mouseY = 0, currentX = 0, currentY = 0, cursorFrame = 0;
      const move = (event: MouseEvent) => { mouseX = event.clientX; mouseY = event.clientY; };
      const cursorTick = () => {
        currentX += (mouseX - currentX) * 0.14;
        currentY += (mouseY - currentY) * 0.14;
        if (cursor) cursor.style.transform = "translate3d(" + currentX + "px," + currentY + "px,0)";
        if (glow) glow.style.transform = "translate3d(" + (mouseX - 190) + "px," + (mouseY - 190) + "px,0)";
        cursorFrame = requestAnimationFrame(cursorTick);
      };
      window.addEventListener("mousemove", move);
      cursorFrame = requestAnimationFrame(cursorTick);

      return () => {
        window.removeEventListener("mousemove", move);
        cancelAnimationFrame(cursorFrame);
      };
    }, el);

    return () => {
      ctx.revert();
      lenis.destroy();
      cancelAnimationFrame(raf);
    };
  }, []);

  const toggleSound = () => {
    if (!audio.current) {
      audio.current = new Audio("/memory/memory-audio.mp3");
      audio.current.loop = true;
      audio.current.volume = 0.28;
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
    <main ref={root} className="rx">
      <div className="rx-progress"><i className="rx-progress__bar" /></div>
      <div className="rx-cursor" />
      <div className="rx-cursor-glow" />

      <header className="rx-nav">
        <a href="#top" className="rx-brand">R<span>.</span></a>
        <div className="rx-nav__center"><span>RADMAN / VISUAL BIOGRAPHY</span><i /><span>8 ORIGINAL FRAMES</span></div>
        <button className="rx-sound" onClick={toggleSound}>
          {sound ? <Volume2 size={14} /> : <VolumeX size={14} />}
          <span>{sound ? "SOUND ON" : "SOUND"}</span>
        </button>
      </header>

      <section id="top" className="rx-hero">
        <div className="rx-hero__media"><img src={hero} alt="Radman and his father" /></div>
        <div className="rx-hero__veil" />
        <div className="rx-hero__orb" />
        <div className="rx-hero__grid" />
        <div className="rx-hero__grain" />

        <div className="rx-hero__eyebrow">
          <span>THE LIFE OF RADMAN</span><span>ARCHIVE / 2026</span><span>ORIGINAL PHOTOGRAPHS</span>
        </div>

        <div className="rx-hero__content">
          <div className="rx-hero__title">
            <span className="word">A LIFE</span>
            <span className="word"><em>IN</em> FRAMES.</span>
          </div>
          <p className="rx-hero__lead">A visual biography built from real photographs, moving memory and the quiet details that make a life impossible to reduce to a single portrait.</p>
        </div>

        <figure className="rx-hero__portrait">
          <img src="/memory/radman-second.JPG" alt="Radman — archive portrait" />
          <figcaption><span>ARCHIVE / 05</span><b>ONE LIFE, MANY FRAMES</b></figcaption>
        </figure>

        <div className="rx-hero__aside">
          <span>RADMAN</span>
          <b>FOREVER,<br />MY SON.</b>
          <small>SCROLL TO ENTER</small>
        </div>

        <div className="rx-hero__scroll"><ArrowDown size={15} /><span>BEGIN THE STORY</span></div>
      </section>

      <section className="rx-manifesto">
        <div className="rx-manifesto__ghost">08</div>
        <div className="rx-manifesto__label rx-reveal">THE ARCHIVE / 01</div>
        <div className="rx-manifesto__copy rx-reveal">
          <h2>Not a gallery.<br /><em>A living archive.</em></h2>
          <p>Every frame has its own place in the story. The page changes scale, rhythm and depth so the photographs never feel like a repeated grid.</p>
        </div>
        <div className="rx-manifesto__stats rx-reveal">
          <span><b>08</b> ORIGINAL FRAMES</span>
          <span><b>04</b> STORY CHAPTERS</span>
          <span><b>∞</b> MEMORIES</span>
        </div>
      </section>

      <section className="rx-chapters">
        {chapters.map((chapter, chapterIndex) => (
          <article className="rx-chapter" key={chapter.number}>
            <div className="rx-chapter__top">
              <span>{chapter.number}</span><small>{chapter.eyebrow}</small><i>{String(chapterIndex + 1).padStart(2, "0")} / 04</i>
            </div>
            <div className="rx-chapter__mosaic rx-chapter__mosaic--pair">
              <div className="rx-mosaic__main"><img src={chapter.images[0].file} alt={chapter.images[0].title} /><span>{chapter.images[0].number}</span></div>
              <div className="rx-mosaic__wide"><img src={chapter.images[1].file} alt={chapter.images[1].title} /><span>{chapter.images[1].number}</span></div>
            </div>
            <div className="rx-chapter__copy">
              <span className="rx-kicker">{chapter.eyebrow}</span>
              <h2>{chapter.title}</h2>
              <p>{chapter.copy}</p>
              <div className="rx-chapter__meta"><span>RADMAN ARCHIVE</span><span>04 / STORY</span></div>
            </div>
          </article>
        ))}
      </section>

      <section className="rx-memory">
        <div className="rx-memory__head">
          <span className="rx-kicker">THE MEMORY FIELD / 08 FRAMES</span>
          <h2>Every image has<br /><em>its own gravity.</em></h2>
          <p>The complete 20-photo archive can drop into this field as soon as the remaining twelve files are committed to GitHub. No image is duplicated here.</p>
        </div>
        <div className="rx-memory__rail">
          {archive.map((item, i) => (
            <figure className={"rx-memory-card rx-memory-card--" + ((i % 4) + 1)} key={item.number}>
              <div className="rx-memory-card__image">
                <img src={item.file} alt={item.title} loading={i < 4 ? "eager" : "lazy"} />
                <div className="rx-memory-card__shine" />
                <span className="rx-memory-card__number">{item.number}</span>
              </div>
              <figcaption><small>{item.tag}</small><b>{item.title}</b></figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="rx-film">
        <div className="rx-film__copy rx-reveal">
          <span className="rx-kicker">MOVING MEMORY / FILM</span>
          <h2>Still frames<br /><em>start breathing.</em></h2>
          <p>The photographs hold the years. The film holds the movement between them.</p>
        </div>
        <div className="rx-film__media rx-reveal">
          <img src="/memory/radman-sit.jpeg" alt="Radman seated from behind" />
          <div className="rx-film__scan" /><div className="rx-film__label">RADMAN / QUIET FRAME</div>
        </div>
        <div className="rx-film__video rx-reveal">
          <video src="/memory/memory-video.mp4" controls playsInline preload="metadata" />
          <span>HOME MOVIE / ORIGINAL MEDIA</span>
        </div>
      </section>

      <section className="rx-ending">
        <div className="rx-ending__glow" />
        <div className="rx-ending__copy rx-reveal">
          <span className="rx-kicker">THE ARCHIVE CONTINUES</span>
          <h2>There is no<br /><em>final frame.</em></h2>
          <p>New photographs can change the archive without changing what came before.</p>
          <a href="#top">RETURN TO BEGINNING <ArrowUpRight size={15} /></a>
        </div>
        <div className="rx-ending__mark">R<span>.</span></div>
      </section>

      <footer className="rx-footer">
        <strong>RADMAN<span>.</span></strong><span>VISUAL BIOGRAPHY / 2026</span><small>FOREVER, MY SON.</small>
      </footer>
    </main>
  );
}
