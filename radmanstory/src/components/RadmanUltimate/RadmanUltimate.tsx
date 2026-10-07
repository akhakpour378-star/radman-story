"use client";

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Maximize2,
  Play,
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

type HeroConfig = {
  image: string;
  date: string;
  time: string;
  weight: string;
  height: string;
  place: string;
  city: string;
  cta: string;
  persianFont: "iranyekan" | "iransans";
  story?: Array<{ eyebrow:string; title:string; lead:string; body:string; image:string; label:string }>;
  memorySignal?: string[];
};

type Memory = {
  src: string;
  no: string;
  title: string;
  tag: string;
};

const defaultHeroConfig: HeroConfig = {
  image: "/memory/radman-and-me.png",
  date: "DEC / 01 / 2022",
  time: "14:15",
  weight: "3.100 kg",
  height: "49 cm",
  place: "NIKAN AQDASIEH",
  city: "Tehran · Iran",
  cta: "ENTER THE STORY",
  persianFont: "iranyekan",
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

const defaultStorySlides = [
  { eyebrow:"THE BEGINNING", title:"Some days / become a lifetime.", lead:"رادمان فقط یک نام در تقویم نیست؛ شروع بخشی از زندگی من است که از همان اولین لحظه، معنای تازه‌ای پیدا کرد.", body:"این داستان از یک روز خاص شروع می‌شود؛ از لحظه‌ای که حضور کوچک او، تمام جهان را برای من تغییر داد.", image:"/memory/radman-main.JPG", label:"THE FIRST FRAME" },
  { eyebrow:"THE LITTLE YEARS", title:"A childhood / made of moments.", lead:"روزهای کودکی از کنارمان آرام عبور می‌کنند؛ اما بعضی لحظه‌ها آن‌قدر عمیق می‌شوند که سال‌ها بعد هم زنده می‌مانند.", body:"لبخندها، بازی‌ها، نگاه‌ها و همان اتفاق‌های ساده، امروز بخشی از بزرگ‌ترین خاطرات من هستند.", image:"/memory/radman-01.JPG", label:"LITTLE DAYS" },
  { eyebrow:"GROWING", title:"Watching you / become yourself.", lead:"هر روز چیزی تازه در تو شکل می‌گرفت؛ یک نگاه، یک عادت، یک لبخند و جهانی که کم‌کم مخصوص خودت می‌شد.", body:"این قاب‌ها فقط عکس نیستند؛ نشانه‌هایی هستند از اینکه چطور زمان، آرام و بی‌صدا، تو را بزرگ‌تر کرد.", image:"/memory/radman-02.JPG", label:"GROWING" },
  { eyebrow:"TOGETHER", title:"Some memories / never leave.", lead:"بعضی لحظه‌ها تمام نمی‌شوند. فقط شکلشان عوض می‌شود و جایی عمیق‌تر درون ما ادامه پیدا می‌کنند.", body:"این آرشیو برای نگه داشتن همان لحظه‌هاست؛ برای اینکه هر بار که برمی‌گردیم، هنوز چیزی از آن روزها پیدا کنیم.", image:"/memory/radman-and-me.png", label:"TOGETHER" },
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
  const reelDrag = useRef({ active: false, startX: 0, offset: 0, lastOffset: 0 });
  const reelManual = useRef(false);
  const [sound, setSound] = useState(false);
  const [memories, setMemories] = useState<Memory[]>(fallback);
  const [heroConfig, setHeroConfig] = useState<HeroConfig>({
    image: "/memory/radman-and-me.png",
    date: "DEC / 01 / 2022",
    time: "14:15",
    weight: "3.100 kg",
    height: "49 cm",
    place: "NIKAN AQDASIEH",
    city: "Tehran · Iran",
    cta: "ENTER THE STORY",
    persianFont: "iranyekan",
  });
  const [selected, setSelected] = useState<number | null>(null);
  const [selectedMemorySrc, setSelectedMemorySrc] = useState<string | null>(null);
  const [videos, setVideos] = useState<string[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [storySlide, setStorySlide] = useState(0);
  const [storyDirection, setStoryDirection] = useState<1 | -1>(1);
  const storySlides = heroConfig.story?.length ? heroConfig.story : defaultStorySlides;
  useEffect(() => {
    const timer = window.setInterval(() => {
      setStoryDirection(1);
      setStorySlide((s) => (s + 1) % storySlides.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [storySlides.length]);

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
        vx: (Math.random() - 0.5) * 30,
        vy: (Math.random() - 0.5) * 23,
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
        p.x += (p.vx + Math.cos(p.phase) * 4.0) * dt;
        p.y += (p.vy + Math.sin(p.phase * 0.82) * 3.2) * dt;

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
    fetch("/api/admin/hero")
      .then((r) => r.ok ? r.json() : null)
      .then((data: HeroConfig | null) => {
        if (alive && data) setHeroConfig(data);
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    let alive = true;
    fetch("/api/site/hero")
      .then((r) => r.json())
      .then((data: HeroConfig) => {
        if (alive && data) setHeroConfig({ ...defaultHeroConfig, ...data });
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;
    fetch("/api/memory?list=1")
      .then((r) => r.json())
      .then((data: { images?: string[]; videos?: string[] }) => {
        if (!alive || !Array.isArray(data.images) || !data.images.length) return;
        if (Array.isArray(data.videos)) setVideos(data.videos);
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

  const selectedMemory = selectedMemorySrc
    ? memories.find((m) => m.src === selectedMemorySrc) || {
        src: selectedMemorySrc,
        no: "—",
        title: prettyTitle(selectedMemorySrc, 0),
        tag: "MEMORY SIGNAL",
      }
    : selected === null ? null : memories[selected];

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
          { y: 50 + (i % 3) * 30, opacity: 0 },
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
    const storyMedia = Array.from(document.querySelectorAll<HTMLElement>(".radman-story-slider__media"));
    const storyMove = (e: MouseEvent) => {
      const el = e.currentTarget as HTMLElement;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--story-x", ((e.clientX - r.left) / r.width * 100) + "%");
      el.style.setProperty("--story-y", ((e.clientY - r.top) / r.height * 100) + "%");
    };
    const storyReset = (e: MouseEvent) => {
      const el = e.currentTarget as HTMLElement;
      el.style.setProperty("--story-x", "50%");
      el.style.setProperty("--story-y", "50%");
    };
    storyMedia.forEach((el) => { el.addEventListener("mousemove", storyMove); el.addEventListener("mouseleave", storyReset); });

    const move = (e: MouseEvent) => {
      document.documentElement.style.setProperty("--mx", `${e.clientX}px`);
      document.documentElement.style.setProperty("--my", `${e.clientY}px`);
    };
    const cards = Array.from(document.querySelectorAll<HTMLElement>(".u-card button, .u-chapter__image, .u-manifesto__enter"));
    const tilt = (e: MouseEvent) => {
      const el = e.currentTarget as HTMLElement;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      el.style.setProperty("--rx", `${(-y * 5).toFixed(2)}deg`);
      el.style.setProperty("--ry", `${(x * 7).toFixed(2)}deg`);
      el.style.setProperty("--px", `${(x * 30).toFixed(1)}px`);
      el.style.setProperty("--py", `${(y * 30).toFixed(1)}px`);
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
      storyMedia.forEach((el) => { el.removeEventListener("mousemove", storyMove); el.removeEventListener("mouseleave", storyReset); });
    };
  }, [memories.length]);

  useEffect(() => {
    const reel = document.querySelector<HTMLElement>(".u-reel");
    const track = reel?.querySelector<HTMLElement>(".u-reel__track");
    if (!reel || !track) return;

    const drag = reelDrag.current;
    const getOffset = () => {
      const transform = getComputedStyle(track).transform;
      if (!transform || transform === "none") return drag.lastOffset;
      const match = transform.match(/matrix\(([^)]+)\)/);
      if (!match) return drag.lastOffset;
      const values = match[1].split(",").map(Number);
      return Number.isFinite(values[4]) ? values[4] : drag.lastOffset;
    };

    const pause = () => {
      if (!drag.active) track.style.animationPlayState = "paused";
    };
    const resume = () => {
      if (!drag.active) track.style.animationPlayState = "running";
    };
    const down = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      drag.active = true;
      drag.startX = e.clientX;
      drag.offset = getOffset();
      drag.lastOffset = drag.offset;
      reelManual.current = true;
      track.style.animationPlayState = "paused";
      track.style.animation = "none";
      track.style.transform = `translate3d(${drag.offset}px,0,0)`;
      reel.setPointerCapture?.(e.pointerId);
      reel.classList.add("is-dragging");
    };
    const move = (e: PointerEvent) => {
      if (!drag.active) return;
      const next = drag.offset + (e.clientX - drag.startX);
      drag.lastOffset = next;
      track.style.transform = `translate3d(${next}px,0,0)`;
    };
    const up = (e: PointerEvent) => {
      if (!drag.active) return;
      drag.active = false;
      reelManual.current = false;
      const finalOffset = drag.lastOffset;
      // Continue from the exact dragged position instead of restarting from x=0.
      track.style.setProperty("--reel-start", `${finalOffset}px`);
      track.style.transform = "";
      track.style.animation = "reelDriftFromCurrent 35s linear infinite";
      track.style.animationPlayState = reel.matches(":hover") ? "paused" : "running";
      reel.releasePointerCapture?.(e.pointerId);
      reel.classList.remove("is-dragging");
    };

    reel.addEventListener("mouseenter", pause);
    reel.addEventListener("mouseleave", resume);
    reel.addEventListener("pointerdown", down);
    reel.addEventListener("pointermove", move);
    reel.addEventListener("pointerup", up);
    reel.addEventListener("pointercancel", up);
    return () => {
      reel.removeEventListener("mouseenter", pause);
      reel.removeEventListener("mouseleave", resume);
      reel.removeEventListener("pointerdown", down);
      reel.removeEventListener("pointermove", move);
      reel.removeEventListener("pointerup", up);
      reel.removeEventListener("pointercancel", up);
    };
  }, [heroConfig.memorySignal?.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (selected === null) return;
      if (e.key === "Escape") { setSelected(null); setSelectedVideo(null); }
      if (e.key === "ArrowRight") setSelected((v) => (v === null ? 0 : (v + 1) % memories.length));
      if (e.key === "ArrowLeft") setSelected((v) => (v === null ? 0 : (v - 1 + memories.length) % memories.length));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = (selected !== null || selectedVideo !== null) ? "hidden" : "";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selected, selectedVideo, memories.length]);

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
    const used = new Set<string>();
    const pick = (preferred: number[], matcher?: (m: Memory) => boolean) => {
      const ordered = [
        ...(matcher ? memories.filter(matcher) : []),
        ...preferred.map(i => memories[i]).filter(Boolean),
        ...memories,
      ];
      const found = ordered.find(m => !used.has(m.src));
      if (found) used.add(found.src);
      return found ?? memories[0] ?? fallback[0];
    };

    return [
      ["01", "THE BEGINNING", "A face arrives and an ordinary life becomes a story.", pick([0])],
      ["02", "THE LITTLE YEARS", "The years move quickly. The archive keeps what time cannot.", pick([2, 3])],
      ["03", "BECOMING", "Hundreds of ordinary moments slowly become a childhood.", pick([7, 4, 5])],
      ["04", "TOGETHER", "Some memories are not about a place. They are about who was there.", pick([], m => /together|and-me/i.test(m.src))],
    ] as const;
  }, [memories]);

  return (
    <main ref={root} className={"u u-font-" + heroConfig.persianFont}>
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
            <img src={asset(heroConfig.image)} alt="Radman and his father — archive photograph" />
          </div>
          <div className="u-hero__photoShade" />
          <div className="u-hero__halo" aria-hidden="true" />
          <div className="u-hero__ghost" aria-hidden="true">R</div>
          
        </div>
        <div className="u-hero__panel">
          <div className="u-hero__birthData" aria-label="Radman birth details">
            <div className="u-birthData__item u-birthData__date">
              <small><CalendarDays size={11} /> DATE OF BIRTH</small>
              <strong>{heroConfig.date.split(" / ").map((part, index) => <React.Fragment key={index}>{index > 0 && <span> / </span>}{part}</React.Fragment>)}</strong>
            </div>
            <div className="u-birthData__item u-birthData__time">
              <small><Clock3 size={11} /> TIME OF BIRTH</small>
              <strong>{heroConfig.time.split(":").map((part, index) => <React.Fragment key={index}>{index > 0 && <span>:</span>}{part}</React.Fragment>)}</strong>
            </div>
            <div className="u-birthData__item u-birthData__weight">
              <small><Scale size={11} /> BIRTH WEIGHT</small>
              <strong>{heroConfig.weight.replace(/\s*kg$/i, "")} <i>kg</i></strong>
            </div>
            <div className="u-birthData__item u-birthData__height">
              <small><Ruler size={11} /> BIRTH HEIGHT</small>
              <strong>{heroConfig.height.replace(/\s*cm$/i, "")} <i>cm</i></strong>
            </div>
            <div className="u-birthData__item u-birthData__place">
              <small><MapPin size={11} /> PLACE OF BIRTH</small>
              <strong>{heroConfig.place}</strong>
              <em>{heroConfig.city}</em>
            </div>
          </div>
        </div>
        <div className="u-hero__fade" aria-hidden="true" />
        <a className="u-hero__cta" href="#story" aria-label="Enter Radman's story">
          <span>{heroConfig.cta}</span>
          <ArrowDown size={13} />
          <i className="u-hero__ctaLine" aria-hidden="true" />
        </a>
        <div className="u-orb" />
        <div className="u-grain" />
      </section>

      <section id="story" className="u-storyCinema">
        <div className="u-storyCinema__noise" aria-hidden="true" />
        <div className="u-storyCinema__glow" aria-hidden="true" />
        <div className="radman-story-slider">
          <div className="radman-story-slider__media">
            {storySlides.map((slide, i) => (
              <img key={slide.image} className={i === storySlide ? "is-active" : ""} src={asset(slide.image)} alt={slide.label} />
            ))}
            <div className="radman-story-slider__shade" />
            <div className="radman-story-slider__meta">
              <span>RADMAN / STORY</span>
              <i aria-hidden="true" />
              <b>{storySlides[storySlide].label}</b>
            </div>
          </div>

          <div className="radman-story-slider__content">
            <div className="radman-story-slider__slides">
              {storySlides.map((slide, i) => (
                <article key={slide.eyebrow} className={i === storySlide ? "is-active" : ""}>
                  <span className="u-storyCinema__eyebrow">{slide.eyebrow}</span>
                  <h2>{slide.title}</h2>
                  <p className="u-storyCinema__lead">{slide.lead}</p>
                  <p className="u-storyCinema__body">{slide.body}</p>
                </article>
              ))}
            </div>

            <div className="radman-story-slider__nav">
              <button type="button" onClick={() => { setStoryDirection(-1); setStorySlide(s => (s - 1 + storySlides.length) % storySlides.length); }} aria-label="Previous slide"><ArrowLeft /></button>
              <div className="radman-story-slider__dots">
                {storySlides.map((slide, i) => (
                  <button key={slide.eyebrow} type="button" className={i === storySlide ? "is-active" : ""} onClick={() => { setStoryDirection(i > storySlide ? 1 : -1); setStorySlide(i); }} aria-label={`Go to slide ${i + 1}`} />
                ))}
              </div>
              <button type="button" onClick={() => { setStoryDirection(1); setStorySlide(s => (s + 1) % storySlides.length); }} aria-label="Next slide"><ArrowRight /></button>
              <span>{String(storySlide + 1).padStart(2, "0")} / {String(storySlides.length).padStart(2, "0")}</span>
            </div>
            <div className="radman-story-slider__progress"><i key={storySlide} /></div>
          </div>
        </div>
      </section>
      <section className="u-reel" aria-label="Selected memories">
        <div className="u-reel__track">
          {(heroConfig.memorySignal || []).map((src, i) => {
            const isVideo = src.startsWith("video:");
            const media = isVideo ? src.slice(6) : src;
            const memoryIndex = memories.findIndex((m) => m.src === media);
            return isVideo ? (
              <button className="u-reel__item u-reel__item--video" key={src} onClick={() => setSelectedVideo(media)} aria-label="Play memory video">
                <video src={asset(media)} muted playsInline preload="metadata" />
                <i className="u-mediaPlay" aria-hidden="true"><Play size={17} fill="currentColor" /></i>
              </button>
            ) : (
              <button className="u-reel__item" key={src} onClick={() => {
                  setSelectedMemorySrc(media);
                  if (memoryIndex >= 0) setSelected(memoryIndex);
                }} aria-label={memories[memoryIndex]?.title || "Memory"}>
                <img src={asset(media)} alt={memories[memoryIndex]?.title || "Memory"} loading="lazy" />
              </button>
            );
          })}
        </div>
      </section>

      <section id="chapters" className="u-chapters">
        {chapters.map(([num, title, copy, m]) => (
          <article className="u-chapter" key={num}>
            <div className="u-chapter__top"><span>{m.tag}</span><small>STORY / 04</small></div>
            <div className="u-chapter__layout">
              <button className="u-chapter__image" onClick={() => setSelected(memories.indexOf(m))} aria-label={`Open ${m.title}`}>
                <img src={asset(m.src)} alt={m.title} />
                <div className="u-chapter__imageFrame" aria-hidden="true"><span>RADMAN / ARCHIVE</span><i /></div>
                <div className="u-chapter__imageMeta"><b>{m.tag}</b><small>{m.title}</small></div>
                <i className="u-chapter__imageOpen"><Maximize2 size={13} /></i>
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
        <div className="u-lightbox" role="dialog" aria-modal="true" aria-label={selectedMemory.title} onClick={() => { setSelected(null); setSelectedMemorySrc(null); }}>
          <button className="u-lightbox__close" onClick={() => { setSelected(null); setSelectedMemorySrc(null); }} aria-label="Close"><X /></button>
          <button className="u-lightbox__prev" onClick={() => {
              const next = (selected === null ? 0 : selected - 1 + memories.length) % memories.length;
              setSelected(next);
              setSelectedMemorySrc(memories[next]?.src || null);
            }} aria-label="Previous"><ArrowLeft /></button>
          <div className="u-lightbox__shell" onClick={(e) => e.stopPropagation()}>
            <div className="u-lightbox__image"><img src={asset(selectedMemory.src)} alt={selectedMemory.title} /></div>
            <div className="u-lightbox__info"><span>{selectedMemory.no} / {String(memories.length).padStart(2, "0")}</span><b>{selectedMemory.title}</b><small>{selectedMemory.tag}</small></div>
          </div>
          <button className="u-lightbox__next" onClick={() => {
              const next = (selected === null ? 0 : selected + 1) % memories.length;
              setSelected(next);
              setSelectedMemorySrc(memories[next]?.src || null);
            }} aria-label="Next"><ArrowRight /></button>
        </div>
      )}
      {selectedVideo && (
        <div className="u-lightbox u-lightbox--video" role="dialog" aria-modal="true" aria-label="Memory video" onClick={() => setSelectedVideo(null)}>
          <button className="u-lightbox__close" onClick={() => setSelectedVideo(null)} aria-label="Close"><X /></button>
          <div className="u-lightbox__videoShell" onClick={(e) => e.stopPropagation()}>
            <div className="u-lightbox__videoFrame">
              <video src={asset(selectedVideo)} controls autoPlay playsInline preload="metadata" />
              <span>ORIGINAL MEMORY / VIDEO</span>
            </div>
            <div className="u-lightbox__videoMeta"><span>RADMAN / MOTION ARCHIVE</span><b>Memory in motion</b></div>
          </div>
        </div>
      )}
    </main>
  );
}

