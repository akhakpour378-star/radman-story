"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./RadmanOpening.css";
import { ForestSoundButton, useForestSound } from "./CinematicSound";

gsap.registerPlugin(ScrollTrigger);

const dust = Array.from({ length: 34 }, (_, i) => ({
  left: (i * 29.7) % 100,
  top: 30 + ((i * 17.1) % 62),
  delay: -(i % 12),
}));

export default function RadmanOpening() {
  const sectionRef = useRef<HTMLElement>(null);
  const [entered, setEntered] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const sound = useForestSound();
  const soundRef = useRef(sound);
  soundRef.current = sound;

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(section);

      gsap.timeline({ defaults: { ease: "power3.out" } })
        .fromTo(q(".opening__preloader-line"), { scaleX: 0 }, { scaleX: 1, duration: 1.3 })
        .to(q(".opening__preloader"), { autoAlpha: 0, duration: .8, delay: .15 })
        .fromTo(q(".opening__topline"), { autoAlpha: 0, y: -22 }, { autoAlpha: 1, y: 0, duration: 1.1 }, "-=.35")
        .fromTo(q(".opening__chapter"), { autoAlpha: 0, x: 22 }, { autoAlpha: 1, x: 0, duration: 1 }, "-=.8")
        .fromTo(q(".opening__content"), { autoAlpha: 0, y: 38 }, { autoAlpha: 1, y: 0, duration: 1.35 }, "-=.7")
        .fromTo(q(".opening__enter"), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: .9 }, "-=.85")
        .fromTo(q(".opening__scroll-cue"), { autoAlpha: 0 }, { autoAlpha: 1, duration: .8 }, "-=.5");

      const progress = q(".opening__progress-fill");

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => {
          soundRef.current.onTravel(self.progress, self.getVelocity());
          gsap.set(progress, { scaleX: self.progress });
        },
      });

      gsap.to(q(".opening__photo"), {
        scale: 1.12,
        xPercent: -1.5,
        yPercent: -4,
        ease: "none",
        scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: 1.8 },
      });

      gsap.to(q(".opening__fog"), {
        xPercent: 15,
        yPercent: -6,
        ease: "none",
        scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: 2.6 },
      });

      gsap.to(q(".opening__foreground"), {
        xPercent: 3,
        yPercent: 9,
        ease: "none",
        scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: 2.2 },
      });

      gsap.to(q(".opening__content"), {
        yPercent: -65,
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: { trigger: section, start: "10% top", end: "32% top", scrub: 1 },
      });

      gsap.to(q(".opening__enter"), {
        y: 25,
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: { trigger: section, start: "4% top", end: "16% top", scrub: true },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const enterMemory = () => {
    sound.init();
    setEntered(true);
  };

  return (
    <section ref={sectionRef} className="opening">
      <div className="opening__pin">
        <div className="opening__preloader" aria-hidden="true">
          <div className="opening__preloader-mark">R</div>
          <span>ENTERING A MEMORY</span>
          <i><b className="opening__preloader-line" /></i>
        </div>

        <div className="opening__photo">
          <img
            src="/memory/radman-and-me.png"
            alt="Radman and his father walking through a misty forest"
            draggable={false}
            fetchPriority="high"
            onLoad={() => setLoaded(true)}
          />
        </div>

        <div className={loaded ? "opening__color is-ready" : "opening__color"} aria-hidden="true" />
        <div className="opening__vignette" aria-hidden="true" />
        <div className="opening__fog" aria-hidden="true"><span /><span /><span /></div>

        <div className="opening__dust" aria-hidden="true">
          {dust.map((p, i) => (
            <i key={i} style={{ left: `${p.left}%`, top: `${p.top}%`, animationDelay: `${p.delay}s` }} />
          ))}
        </div>

        <div className="opening__foreground" aria-hidden="true">
          <span className="opening__frame-tree opening__frame-tree--left" />
          <span className="opening__frame-tree opening__frame-tree--right" />
          <span className="opening__frame-branch opening__frame-branch--left" />
          <span className="opening__frame-branch opening__frame-branch--right" />
        </div>

        <header className="opening__topline">
          <div className="opening__brand">
            <b>R</b>
            <span>RADMAN</span>
            <i />
            <span>MY SON · MY FOREVER</span>
          </div>
          <div className="opening__tools">
            <ForestSoundButton enabled={sound.enabled} onClick={enterMemory} />
            <span className="opening__menu" aria-hidden="true"><i /><i /><i /></span>
          </div>
        </header>

        <div className="opening__chapter">
          <span>01</span><i /><span>THE FOREST</span>
        </div>

        <main className="opening__content">
          <p className="opening__eyebrow">A father's journey</p>
          <h1>The little steps<br />that changed<br /><em>my world.</em></h1>
          <div className="opening__rule" />
          <p className="opening__copy">
            Somewhere between the trees,<br />
            I still hear the sound of us walking.
          </p>
        </main>

        <div className="opening__enter">
          <button type="button" onClick={enterMemory}>
            <span>{entered ? "SOUND ON · WALK WITH ME" : "ENTER THE MEMORY"}</span>
            <b>↓</b>
          </button>
          <small>Sound creates the first step.</small>
        </div>

        <div className="opening__quote">
          <span>RADMAN</span>
          <p>Every path<br />leads back to you.</p>
        </div>

        <div className="opening__scroll-cue">
          <span>SCROLL TO REMEMBER</span>
          <i />
        </div>

        <div className="opening__footer-left">RADMAN · 14 : 15</div>
        <div className="opening__footer-right">ALWAYS TOGETHER</div>

        <div className="opening__counter">
          <strong>01</strong><i /><span>04</span>
        </div>

        <div className="opening__progress">
          <b className="opening__progress-fill" />
        </div>
      </div>
    </section>
  );
}
