"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./RadmanOpening.css";
import { ForestSoundButton, useForestSound } from "./CinematicSound";

gsap.registerPlugin(ScrollTrigger);

const dust = Array.from({ length: 28 }, (_, i) => ({
  left: (i * 31.7) % 100,
  top: 34 + ((i * 19.3) % 56),
  delay: -(i % 10),
}));

export default function RadmanOpening() {
  const sectionRef = useRef<HTMLElement>(null);
  const [entered, setEntered] = useState(false);
  const [heroSrc, setHeroSrc] = useState("/memory/world/radman-forest-cinematic.jpg");
  const sound = useForestSound();
  const soundRef = useRef(sound);
  soundRef.current = sound;

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(section);

      gsap.fromTo(q(".opening__topline"), { autoAlpha: 0, y: -16 }, {
        autoAlpha: 1, y: 0, duration: 1.2, ease: "power3.out", delay: 0.15,
      });
      gsap.fromTo(q(".opening__content"), { autoAlpha: 0, y: 28 }, {
        autoAlpha: 1, y: 0, duration: 1.35, ease: "power3.out", delay: 0.3,
      });
      gsap.fromTo(q(".opening__enter"), { autoAlpha: 0, y: 16 }, {
        autoAlpha: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.7,
      });

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => soundRef.current.onTravel(self.progress, self.getVelocity()),
      });

      gsap.to(q(".opening__photo"), {
        scale: 1.1, xPercent: -1.5, yPercent: -4, ease: "none",
        scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: 1.6 },
      });

      gsap.to(q(".opening__photo img"), {
        filter: "saturate(.78) contrast(1.08) brightness(.78)",
        ease: "none",
        scrollTrigger: { trigger: section, start: "top top", end: "28% top", scrub: 1 },
      });

      gsap.to(q(".opening__foreground"), {
        yPercent: 8, xPercent: 2, ease: "none",
        scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: 2 },
      });

      gsap.to(q(".opening__fog"), {
        xPercent: 12, yPercent: -4, ease: "none",
        scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: 2.5 },
      });

      gsap.to(q(".opening__content"), {
        yPercent: -55, autoAlpha: 0, ease: "none",
        scrollTrigger: { trigger: section, start: "8% top", end: "34% top", scrub: 1 },
      });

      gsap.to(q(".opening__enter"), {
        y: 28, autoAlpha: 0, ease: "none",
        scrollTrigger: { trigger: section, start: "4% top", end: "17% top", scrub: true },
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
        <div className="opening__photo" aria-hidden="true">
          <img src={heroSrc} alt="" draggable={false} fetchPriority="high" onError={() => setHeroSrc("/memory/radman-main.JPG")} />
        </div>

        <div className="opening__color" aria-hidden="true" />
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
          <div className="opening__brand"><b>R</b><span>RADMAN</span><i /><span>MY SON · MY FOREVER</span></div>
          <div className="opening__tools">
            <ForestSoundButton enabled={sound.enabled} onClick={enterMemory} />
            <span className="opening__menu" aria-hidden="true"><i /><i /><i /></span>
          </div>
        </header>

        <div className="opening__chapter"><span>MEMORY 01</span><i /><span>THE FOREST</span></div>

        <main className="opening__content">
          <p className="opening__eyebrow">A father's journey</p>
          <h1>The little steps<br />that changed<br />my world<span>.</span></h1>
          <div className="opening__rule" />
          <p className="opening__copy">Somewhere between the trees,<br />I still hear the sound of us walking.<br /><strong>Forever, my son.</strong></p>
        </main>

        <div className="opening__enter">
          <button type="button" onClick={enterMemory}><span>{entered ? "SOUND ON · WALK WITH ME" : "ENTER THE MEMORY"}</span><b>↓</b></button>
          <small>Turn sound on. Then move slowly.</small>
        </div>

        <div className="opening__scroll-cue"><span>SCROLL TO REMEMBER</span><i /></div>
        <div className="opening__footer-left">RADMAN · 14 : 15</div>
        <div className="opening__footer-right">ALWAYS TOGETHER</div>
        <div className="opening__counter"><strong>01</strong><i /><span>04</span></div>
      </div>
    </section>
  );
}
