"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./CinematicStory.css";
import { useForestSound } from "@/components/RadmanOpening/CinematicSound";
import ForestWorld from "./ForestWorld";

gsap.registerPlugin(ScrollTrigger);

const memories = [
  { no: "01", title: "اولین خنده", en: "THE FIRST LAUGH", image: "/memories/memory-01.JPG" },
  { no: "02", title: "اولین قدم", en: "THE FIRST STEP", image: "/memories/memory-02.JPG" },
  { no: "03", title: "اولین روز مهد", en: "THE FIRST DAY", image: "/memories/memory-03.JPG" },
];

export default function CinematicStory() {
  const root = useRef<HTMLElement>(null);
  const baba = useRef<HTMLAudioElement>(null);
  const [soundOn, setSoundOn] = useState(false);
  const sound = useForestSound();
  const soundRef = useRef(sound);
  soundRef.current = sound;

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const intro = gsap.timeline({
        scrollTrigger: {
          trigger: ".scene-intro",
          start: "top top",
          end: "+=130%",
          scrub: 1.1,
          pin: true,
        },
      });

      intro
        .to(".intro__eyebrow", { opacity: 0, y: -18, duration: 0.25 })
        .to(".intro__title", { opacity: 0, y: -55, scale: 0.96, duration: 0.55 }, "<")
        .to(".intro__signature", { opacity: 0, y: 25, duration: 0.35 }, "<")
        .to(".intro__hint", { opacity: 0 }, "<")
        .to(".intro__veil", { opacity: 0, duration: 0.7 }, "-=0.15");

      ScrollTrigger.create({
        trigger: ".scene-forest",
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => soundRef.current.onTravel(self.progress, self.getVelocity()),
      });

      gsap.to(".forest__camera", {
        yPercent: -3,
        scale: 1.08,
        ease: "none",
        scrollTrigger: { trigger: ".scene-forest", start: "top top", end: "bottom top", scrub: 2 },
      });
      gsap.to(".forest__atmosphere", {
        xPercent: 10,
        yPercent: -8,
        ease: "none",
        scrollTrigger: { trigger: ".scene-forest", start: "top top", end: "bottom top", scrub: 2.4 },
      });
      gsap.to(".forest__light", {
        xPercent: 28,
        rotate: 5,
        ease: "none",
        scrollTrigger: { trigger: ".scene-forest", start: "top top", end: "bottom top", scrub: 2 },
      });
      gsap.fromTo(
        ".forest__radman",
        { yPercent: 16, scale: 0.9, opacity: 0.35 },
        {
          yPercent: -12,
          scale: 1.08,
          opacity: 1,
          ease: "none",
          scrollTrigger: { trigger: ".scene-forest", start: "top top", end: "72% top", scrub: 1.5 },
        },
      );
      gsap.fromTo(
        ".forest__voice",
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: { trigger: ".forest__voice", start: "top 72%", end: "top 48%", scrub: true },
        },
      );
      gsap.to(".forest__chapter", {
        opacity: 0,
        y: -20,
        scrollTrigger: { trigger: ".scene-forest", start: "65% top", end: "80% top", scrub: true },
      });

      const memoriesTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".scene-memories",
          start: "top top",
          end: "+=280%",
          scrub: 1.15,
          pin: true,
        },
      });

      memoriesTl
        .fromTo(".memory__flash", { scaleY: 0, opacity: 0 }, { scaleY: 1, opacity: 1, duration: 0.2 })
        .to(".memory__flash", { scaleY: 0.35, opacity: 0.15, duration: 0.35 })
        .fromTo(".memory__heading", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.4 })
        .fromTo(".memory-card--one", { opacity: 0, x: -100, rotate: -6 }, { opacity: 1, x: 0, rotate: -2, duration: 0.4 }, "<")
        .fromTo(".memory-card--two", { opacity: 0, x: 100, rotate: 6 }, { opacity: 1, x: 0, rotate: 2, duration: 0.4 }, "-=0.25")
        .fromTo(".memory-card--three", { opacity: 0, y: 110 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.25")
        .to(".memory__heading", { opacity: 0.22, y: -30, duration: 0.25 })
        .to(".memory-card", { scale: 0.94, opacity: 0.16, duration: 0.35 }, "<");

      const beachTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".scene-beach",
          start: "top top",
          end: "+=180%",
          scrub: 1.2,
          pin: true,
        },
      });

      beachTl
        .fromTo(".beach__forest", { opacity: 1 }, { opacity: 0, duration: 0.5 })
        .fromTo(".beach__photo", { opacity: 0, scale: 1.12 }, { opacity: 1, scale: 1, duration: 0.7 }, "-=0.2")
        .fromTo(".beach__sun", { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.55 }, "<")
        .fromTo(".beach__copy", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.45 }, "-=0.15")
        .to(".beach__photo", { scale: 1.045, yPercent: -4, duration: 0.8 }, "<");

      gsap.fromTo(".video-story", { opacity: 0, y: 80 }, {
        opacity: 1,
        y: 0,
        scrollTrigger: { trigger: ".video-story", start: "top 82%", end: "top 45%", scrub: 1 },
      });

      gsap.fromTo(".final-memory__inner", { opacity: 0, y: 55, scale: 0.97 }, {
        opacity: 1,
        y: 0,
        scale: 1,
        scrollTrigger: { trigger: ".final-memory", start: "top 78%", end: "top 38%", scrub: 1 },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  const unlock = () => {
    sound.init();
    const audio = baba.current;
    if (!audio) return;
    audio.volume = 0.92;
    audio.play().then(() => {
      audio.pause();
      audio.currentTime = 0;
      setSoundOn(true);
    }).catch(() => setSoundOn(false));
  };

  const playBaba = () => {
    sound.init();
    const audio = baba.current;
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => undefined);
    setSoundOn(true);
  };

  return (
    <main ref={root} className="film" onPointerDown={unlock}>
      <audio ref={baba} src="/memory/memory-audio.mp3" preload="auto" />

      <section className="scene-intro">
        <div className="intro__veil" />
        <div className="intro__grain" />
        <div className="intro__content">
          <p className="intro__eyebrow">A MEMORY, KEPT ALIVE · 14 : 15</p>
          <h1 className="intro__title">
            you became the reason
            <br />
            <em>my story never ended.</em>
          </h1>
          <p className="intro__signature">Forever, my son.</p>
        </div>
        <div className="intro__hint"><span /> SCROLL TO ENTER <span /></div>
        <div className="intro__counter">01 / 05</div>
      </section>

      <section className="scene-forest">
        <div className="forest__camera">
          <ForestWorld />
        </div>
        <div className="forest__atmosphere" />
        <div className="forest__light" />
        <div className="forest__vignette" />
        <div className="forest__radman">
          <div className="forest__radman-glow" />
          <img src="/memory/radman-sit.jpeg" alt="Radman" />
        </div>
        <div className="forest__voice">
          <span>RADMAN</span>
          <button type="button" onClick={playBaba}>
            <strong>بابا</strong>
            <small>{soundOn ? "listen again" : "tap to hear"}</small>
          </button>
        </div>
        <div className="forest__chapter">
          <span>CHAPTER I · THE FOREST</span>
          <h2>Somewhere<br /><em>between the trees.</em></h2>
          <p>I still hear you.</p>
        </div>
        <div className="forest__scroll">KEEP WALKING <i /></div>
      </section>

      <section className="scene-memories">
        <div className="memory__flash" />
        <div className="memory__heading">
          <span>CHAPTER II · THE THINGS I REMEMBER</span>
          <h2>Firsts become<br /><em>forever.</em></h2>
          <p>خاطراتی که زمان نتوانست از من بگیرد.</p>
        </div>
        {memories.map((memory, index) => (
          <article key={memory.en} className={"memory-card memory-card--" + ["one", "two", "three"][index]}>
            <div className="memory-card__image"><img src={memory.image} alt={memory.title} /></div>
            <div className="memory-card__meta"><b>{memory.no}</b><span>{memory.en}</span></div>
            <h3>{memory.title}</h3>
          </article>
        ))}
      </section>

      <section className="scene-beach">
        <div className="beach__base" />
        <div className="beach__forest" />
        <div className="beach__sun" />
        <div className="beach__photo"><img src="/memory/radman-and-me.png" alt="Radman and his father" /></div>
        <div className="beach__waves"><i /><i /><i /></div>
        <div className="beach__grain" />
        <div className="beach__copy">
          <span>CHAPTER III · WHERE THE FOREST ENDS</span>
          <h2>And then,<br /><em>the sea.</em></h2>
          <p>جایی که نور گرم‌تر بود و ما هنوز کنار هم بودیم.</p>
        </div>
      </section>

      <section className="video-story">
        <div className="video-story__top">
          <span>ANOTHER MOMENT · PRESERVED</span>
          <h2>Some moments<br />deserve to <em>move.</em></h2>
        </div>
        <div className="video-story__frame">
          <div className="video-story__line" />
          <video src="/memory/memory-video.mp4" controls playsInline preload="metadata" />
        </div>
        <p className="video-story__note">Press play. Let the memory speak for itself.</p>
      </section>

      <section className="final-memory">
        <div className="final-memory__bg"><img src="/memory/radman-and-me.png" alt="" /></div>
        <div className="final-memory__inner">
          <span>FOREVER · RADMAN</span>
          <h2>You became the reason<br /><em>my story never ended.</em></h2>
          <p>Forever, my son.</p>
          <div className="final-memory__rule"><i /> 14 : 15 <i /></div>
        </div>
      </section>
    </main>
  );
}
