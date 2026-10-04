"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "./RadmanOpening.css";
import ForestDepth from "../RadmanScene/ForestDepth";
import { ForestSoundButton, useForestSound } from "./CinematicSound";

gsap.registerPlugin(ScrollTrigger);

const dust = Array.from({ length: 34 }, (_, index) => ({
  id: index,
  x: (index * 29) % 100,
  y: (index * 47) % 100,
  size: 1 + (index % 3),
  delay: -(index % 9),
  duration: 9 + (index % 8),
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
      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: "(min-width: 901px)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { desktop, reduce } = context.conditions as {
            desktop: boolean;
            reduce: boolean;
          };

          if (reduce) {
            gsap.set(
              q(".opening__content, .opening__meta, .opening__enter, .opening__chapter"),
              { opacity: 1, clearProps: "transform" },
            );
            return;
          }

          const intro = gsap.timeline({
            defaults: { ease: "power3.out" },
            delay: 0.15,
          });

          intro
            .fromTo(q(".opening__chapter"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.9 })
            .fromTo(q(".opening__content"), { opacity: 0, y: 48 }, { opacity: 1, y: 0, duration: 1.35 }, "-=0.5")
            .fromTo(q(".opening__rule"), { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.7 }, "-=0.65")
            .fromTo(q(".opening__copy"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.4")
            .fromTo(q(".opening__enter"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.85 }, "-=0.45");

          const baseTrigger = {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: desktop ? 1.15 : 0.85,
          };

          ScrollTrigger.create({
            trigger: section,
            start: "top top",
            end: "bottom top",
            pin: q(".opening__pin"),
            anticipatePin: 1,
            onUpdate: (self) => soundRef.current.onTravel(self.progress, self.getVelocity()),
          });

          gsap.to(q(".opening__plate"), {
            scale: 1.12,
            xPercent: -2.5,
            yPercent: -4,
            ease: "none",
            scrollTrigger: baseTrigger,
          });

          gsap.to(q(".opening__image-depth"), {
            scale: 1.18,
            xPercent: 4,
            yPercent: -8,
            ease: "none",
            scrollTrigger: { ...baseTrigger, scrub: desktop ? 1.7 : 1.1 },
          });

          gsap.to(q(".opening__foreground"), {
            xPercent: desktop ? -6 : -2,
            yPercent: -11,
            scale: 1.08,
            ease: "none",
            scrollTrigger: { ...baseTrigger, scrub: desktop ? 0.7 : 0.5 },
          });

          gsap.to(q(".opening__fog"), {
            xPercent: 7,
            yPercent: -9,
            ease: "none",
            scrollTrigger: { ...baseTrigger, scrub: 2.2 },
          });

          gsap.to(q(".opening__content"), {
            yPercent: -42,
            opacity: 0,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "12% top",
              end: "48% top",
              scrub: 1,
            },
          });

          gsap.to(q(".opening__chapter"), {
            opacity: 0,
            y: -20,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "14% top",
              end: "34% top",
              scrub: true,
            },
          });

          gsap.to(q(".opening__enter"), {
            opacity: 0,
            y: 28,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "10% top",
              end: "25% top",
              scrub: true,
            },
          });

          gsap.to(q(".opening__scroll"), {
            opacity: 0,
            y: 18,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "6% top",
              end: "19% top",
              scrub: true,
            },
          });

          gsap.to(q(".opening__ambient-label"), {
            opacity: 0,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "16% top",
              end: "32% top",
              scrub: true,
            },
          });
        },
      );

      return () => mm.revert();
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
        <div className="opening__plate" aria-hidden="true" />
        <div className="opening__image-depth" aria-hidden="true" />

        <div className="opening__atmosphere" aria-hidden="true">
          <div className="opening__moon" />
          <div className="opening__ray opening__ray--one" />
          <div className="opening__ray opening__ray--two" />
          <div className="opening__ray opening__ray--three" />

          <div className="opening__dust">
            {dust.map((particle) => (
              <i
                key={particle.id}
                style={{
                  left: particle.x + "%",
                  top: particle.y + "%",
                  width: particle.size,
                  height: particle.size,
                  animationDelay: particle.delay + "s",
                  animationDuration: particle.duration + "s",
                }}
              />
            ))}
          </div>
        </div>

        <ForestDepth />

        <div className="opening__fog" aria-hidden="true">
          <div className="opening__fog-bank opening__fog-bank--one" />
          <div className="opening__fog-bank opening__fog-bank--two" />
          <div className="opening__fog-bank opening__fog-bank--three" />
        </div>

        <div className="opening__foreground" aria-hidden="true">
          <span className="opening__tree opening__tree--left" />
          <span className="opening__tree opening__tree--right" />
          <span className="opening__branch opening__branch--left" />
          <span className="opening__branch opening__branch--right" />
        </div>

        <div className="opening__veil" aria-hidden="true" />
        <div className="opening__grain" aria-hidden="true" />
        <div className="opening__vignette" aria-hidden="true" />

        <div className="opening__nav opening__meta">
          <span className="opening__mark">R</span>
          <span>RADMAN</span>
          <span className="opening__nav-line" />
          <span className="opening__nav-caption">MY SON · MY FOREVER</span>
          <ForestSoundButton enabled={sound.enabled} onClick={enterMemory} />
          <span className="opening__menu" aria-hidden="true"><i /><i /><i /></span>
        </div>

        <div className="opening__chapter">
          <span>MEMORY 01</span>
          <i />
          <span>THE FOREST</span>
        </div>

        <div className="opening__content">
          <p className="opening__eyebrow">A father’s journey</p>
          <h1>
            The little steps
            <br />
            that changed
            <br />
            my world<span>…</span>
          </h1>

          <div className="opening__rule" />

          <p className="opening__copy">
            Somewhere between the trees,
            <br />
            I still hear the sound of us walking.
            <br />
            <span>Forever, my son.</span>
          </p>
        </div>

        <div className="opening__enter">
          <button type="button" onClick={enterMemory} className={entered ? "is-entered" : ""}>
            <span>{entered ? "SOUND ON · ENTER AGAIN" : "ENTER THE MEMORY"}</span>
            <b>↓</b>
          </button>
          <small>Turn sound on, then move slowly through the forest</small>
        </div>

        <div className="opening__ambient-label" aria-hidden="true">
          <span>THE PATH REMEMBERS</span>
          <i />
          <span>14 : 15</span>
        </div>

        <div className="opening__scroll" aria-hidden="true">
          <span>SCROLL TO REMEMBER</span>
          <i />
        </div>

        <div className="opening__corner opening__corner--left">RADMAN · ALWAYS WITH ME</div>
        <div className="opening__corner opening__corner--right">ALWAYS TOGETHER</div>
        <div className="opening__counter"><span>01</span><i /><span>04</span></div>
      </div>
    </section>
  );
}
