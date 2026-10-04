"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "./RadmanOpening.css";
import ForestDepth from "../RadmanScene/ForestDepth";
import FogField from "../RadmanScene/FogField";
import { ForestSoundButton, useForestSound } from "./CinematicSound";

gsap.registerPlugin(ScrollTrigger);

export default function RadmanOpening() {
  const sectionRef = useRef<HTMLElement>(null);
  const [entered, setEntered] = useState(false);
  const sound = useForestSound();

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
            gsap.set(q(".opening__content, .opening__meta, .opening__enter"), {
              opacity: 1,
              clearProps: "transform",
            });
            return;
          }

          gsap.timeline({ defaults: { ease: "power3.out" } })
            .fromTo(q(".opening__content"), { opacity: 0, y: 38 }, { opacity: 1, y: 0, duration: 1.5 })
            .fromTo(q(".opening__meta"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.9 }, "-=0.9")
            .fromTo(q(".opening__enter"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.9 }, "-=0.6");

          const travel = {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: desktop ? 1.1 : 0.8,
          };

          ScrollTrigger.create({
            trigger: section,
            start: "top top",
            end: "bottom top",
            pin: section.querySelector(".opening__pin") as HTMLElement,
            anticipatePin: 1,
            onUpdate: (self) => sound.onTravel(self.progress),
          });

          gsap.to(q(".opening__plate"), {
            scale: 1.18,
            yPercent: -5,
            ease: "none",
            scrollTrigger: travel,
          });

          gsap.to(q(".opening__forest"), {
            scale: 1.08,
            yPercent: -7,
            xPercent: desktop ? 2 : 0,
            ease: "none",
            scrollTrigger: { ...travel, scrub: desktop ? 0.85 : 0.7 },
          });

          gsap.to(q(".opening__fog"), {
            xPercent: 10,
            yPercent: -12,
            scale: 1.08,
            ease: "none",
            scrollTrigger: { ...travel, scrub: 1.8 },
          });

          gsap.to(q(".opening__content"), {
            yPercent: -55,
            opacity: 0,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "10% top",
              end: "48% top",
              scrub: 1,
            },
          });

          gsap.to(q(".opening__enter"), {
            opacity: 0,
            y: 30,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "8% top",
              end: "24% top",
              scrub: true,
            },
          });

          gsap.to(q(".opening__sound"), {
            opacity: 0,
            y: -10,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "20% top",
              end: "38% top",
              scrub: true,
            },
          });
        },
      );

      return () => mm.revert();
    }, section);

    return () => ctx.revert();
  }, [sound]);

  const enterMemory = () => {
    sound.init();
    setEntered(true);
  };

  return (
    <section ref={sectionRef} className="opening">
      <div className="opening__pin">
        <div className="opening__plate" aria-hidden="true" />
        <div className="opening__forest" aria-hidden="true" />
        <ForestDepth />
        <div className="opening__fog" aria-hidden="true">
          <FogField />
        </div>

        <div className="opening__light" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <div className="opening__veil" aria-hidden="true" />
        <div className="opening__grain" aria-hidden="true" />

        <div className="opening__nav opening__meta">
          <span className="opening__mark">R</span>
          <span>RADMAN</span>
          <span className="opening__nav-line" />
          <span>MY SON · MY FOREVER</span>
          <ForestSoundButton enabled={sound.enabled} onClick={enterMemory} />
          <span className="opening__menu" aria-hidden="true"><i /><i /><i /></span>
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
            You became the reason
            <br />
            my story never ended.
            <br />
            <span>Forever, my son.</span>
          </p>
        </div>

        <div className="opening__enter">
          <button type="button" onClick={enterMemory} className={entered ? "is-entered" : ""}>
            <span>{entered ? "SOUND ON" : "ENTER THE MEMORY"}</span>
            <b>↓</b>
          </button>
          <small>Use headphones for the full experience</small>
        </div>

        <div className="opening__scroll" aria-hidden="true">
          <span>SCROLL TO REMEMBER</span>
          <i />
        </div>

        <div className="opening__corner opening__corner--left">14 : 15</div>
        <div className="opening__corner opening__corner--right">ALWAYS TOGETHER</div>
        <div className="opening__counter"><span>01</span><i /><span>04</span></div>
      </div>
    </section>
  );
}
