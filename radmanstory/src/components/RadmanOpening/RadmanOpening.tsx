"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "./RadmanOpening.css";
import { ForestSoundButton, useForestSound } from "./CinematicSound";

gsap.registerPlugin(ScrollTrigger);

const particles = Array.from({ length: 46 }, (_, i) => ({
  id: i,
  left: (i * 37.7) % 100,
  top: (i * 19.3) % 100,
  size: 1 + (i % 3),
  delay: -(i % 11),
  duration: 8 + (i % 9),
}));

export default function RadmanOpening() {
  const sectionRef = useRef<HTMLElement>(null);
  const [entered, setEntered] = useState(false);
  const sound = useForestSound();
  const soundRef = useRef(sound);
  soundRef.current = sound;

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(section);

      gsap.set(q(".opening__hero-image"), { scale: 1.08 });

      const intro = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.25,
      });

      intro
        .fromTo(q(".opening__topline"), { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: 0.9 })
        .fromTo(q(".opening__chapter"), { opacity: 0, x: 25 }, { opacity: 1, x: 0, duration: 0.9 }, "-=0.55")
        .fromTo(q(".opening__content"), { opacity: 0, y: 45 }, { opacity: 1, y: 0, duration: 1.3 }, "-=0.45")
        .fromTo(q(".opening__enter"), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.5");

      const master = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom top",
        pin: q(".opening__pin"),
        anticipatePin: 1,
        scrub: 0.9,
        onUpdate: (self) => soundRef.current.onTravel(self.progress, self.getVelocity()),
      });

      gsap.to(q(".opening__hero-image"), {
        scale: 1.22,
        xPercent: -3,
        yPercent: -4,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 1.4,
        },
      });

      gsap.to(q(".opening__midground"), {
        xPercent: 5,
        yPercent: -5,
        scale: 1.08,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 1.8,
        },
      });

      gsap.to(q(".opening__fog"), {
        xPercent: 10,
        yPercent: -7,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 2.4,
        },
      });

      gsap.to(q(".opening__content"), {
        yPercent: -48,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "10% top",
          end: "40% top",
          scrub: 1,
        },
      });

      gsap.to(q(".opening__enter"), {
        opacity: 0,
        y: 25,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "7% top",
          end: "22% top",
          scrub: true,
        },
      });

      gsap.to(q(".opening__chapter"), {
        opacity: 0,
        x: 35,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "12% top",
          end: "30% top",
          scrub: true,
        },
      });

      gsap.to(q(".opening__scroll-cue"), {
        opacity: 0,
        y: 15,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "4% top",
          end: "18% top",
          scrub: true,
        },
      });

      return () => master.kill();
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
        <div className="opening__image-wrap" aria-hidden="true">
          <img
            className="opening__hero-image"
            src="/memory/world/radman-forest-cinematic.jpg"
            alt=""
            draggable={false}
          />
        </div>

        <div className="opening__midground" aria-hidden="true" />

        <div className="opening__fog" aria-hidden="true">
          <span className="opening__fog-cloud opening__fog-cloud--one" />
          <span className="opening__fog-cloud opening__fog-cloud--two" />
          <span className="opening__fog-cloud opening__fog-cloud--three" />
        </div>

        <div className="opening__atmosphere" aria-hidden="true">
          <span className="opening__moon" />
          <span className="opening__ray opening__ray--one" />
          <span className="opening__ray opening__ray--two" />
          <span className="opening__ray opening__ray--three" />
          <div className="opening__particles">
            {particles.map((p) => (
              <i
                key={p.id}
                style={{
                  left: p.left + "%",
                  top: p.top + "%",
                  width: p.size,
                  height: p.size,
                  animationDelay: p.delay + "s",
                  animationDuration: p.duration + "s",
                }}
              />
            ))}
          </div>
        </div>

        <div className="opening__foreground" aria-hidden="true">
          <span className="opening__trunk opening__trunk--left" />
          <span className="opening__trunk opening__trunk--right" />
          <span className="opening__branch opening__branch--left" />
          <span className="opening__branch opening__branch--right" />
        </div>

        <div className="opening__shade" aria-hidden="true" />
        <div className="opening__grain" aria-hidden="true" />

        <header className="opening__topline">
          <div className="opening__brand">
            <span className="opening__mark">R</span>
            <span>RADMAN</span>
            <i />
            <span>MY SON · MY FOREVER</span>
          </div>

          <div className="opening__tools">
            <ForestSoundButton enabled={sound.enabled} onClick={enterMemory} />
            <span className="opening__menu" aria-hidden="true">
              <i /><i /><i />
            </span>
          </div>
        </header>

        <div className="opening__chapter">
          <span>MEMORY 01</span>
          <i />
          <span>THE FOREST</span>
        </div>

        <main className="opening__content">
          <p className="opening__eyebrow">A father&apos;s journey</p>
          <h1>
            The little steps
            <br />
            that changed
            <br />
            my world<span>.</span>
          </h1>

          <div className="opening__rule" />

          <p className="opening__copy">
            Somewhere between the trees,
            <br />
            I still hear the sound of us walking.
            <br />
            <strong>Forever, my son.</strong>
          </p>
        </main>

        <div className="opening__enter">
          <button type="button" onClick={enterMemory} className={entered ? "is-entered" : ""}>
            <span>{entered ? "SOUND ON · WALK WITH ME" : "ENTER THE MEMORY"}</span>
            <b>↓</b>
          </button>
          <small>Turn sound on. Then move slowly.</small>
        </div>

        <div className="opening__scroll-cue" aria-hidden="true">
          <span>SCROLL TO REMEMBER</span>
          <i />
        </div>

        <div className="opening__footer-left">RADMAN · 14 : 15</div>
        <div className="opening__footer-right">ALWAYS TOGETHER</div>

        <div className="opening__counter" aria-hidden="true">
          <strong>01</strong>
          <i />
          <span>04</span>
        </div>
      </div>
    </section>
  );
}
