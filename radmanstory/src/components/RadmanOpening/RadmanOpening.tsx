"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "./RadmanOpening.css";
import ForestDepth from "../RadmanScene/ForestDepth";
import FogField from "../RadmanScene/FogField";
import RadmanPresence from "../RadmanScene/RadmanPresence";

gsap.registerPlugin(ScrollTrigger);

export default function RadmanOpening() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: "(min-width: 901px)",
          mobile: "(max-width: 900px)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { desktop, reduce } = context.conditions as {
            desktop: boolean;
            mobile: boolean;
            reduce: boolean;
          };

          const q = gsap.utils.selector(section);

          if (reduce) {
            gsap.set(q(".opening__veil, .opening__content, .opening__meta"), {
              opacity: 1,
              clearProps: "transform",
            });
            return;
          }

          const intro = gsap.timeline({
            defaults: { ease: "power3.out" },
          });

          intro
            .fromTo(
              q(".opening__veil"),
              { opacity: 1 },
              { opacity: 0.5, duration: 2.2, ease: "power2.inOut" },
            )
            .fromTo(
              q(".opening__content"),
              { opacity: 0, y: 42 },
              { opacity: 1, y: 0, duration: 1.4 },
              "-=1.4",
            )
            .fromTo(
              q(".opening__meta"),
              { opacity: 0, y: 18 },
              { opacity: 1, y: 0, duration: 0.9 },
              "-=0.8",
            );

          ScrollTrigger.create({
            trigger: section,
            start: "top top",
            end: "bottom top",
            pin: section.querySelector(".opening__pin") as HTMLElement,
            anticipatePin: 1,
          });

          const travel = {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: desktop ? 1.15 : 0.8,
          };

          gsap.to(q(".forest-depth__distant"), {
            yPercent: -2,
            scale: 1.04,
            ease: "none",
            scrollTrigger: travel,
          });

          gsap.to(q(".forest-depth__near"), {
            yPercent: -7,
            xPercent: desktop ? 2 : 0,
            scale: 1.1,
            ease: "none",
            scrollTrigger: { ...travel, scrub: desktop ? 0.9 : 0.7 },
          });

          gsap.to(q(".radman-presence"), {
            yPercent: -8,
            scale: 1.045,
            ease: "none",
            scrollTrigger: { ...travel, scrub: 1.25 },
          });

          gsap.to(q(".fog-field"), {
            xPercent: 7,
            yPercent: -10,
            ease: "none",
            scrollTrigger: { ...travel, scrub: 1.8 },
          });

          gsap.to(q(".opening__content"), {
            yPercent: -34,
            opacity: 0,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "12% top",
              end: "58% top",
              scrub: 1,
            },
          });

          gsap.to(q(".opening__scroll"), {
            opacity: 0,
            y: 20,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "18% top",
              scrub: true,
            },
          });
        },
      );

      return () => mm.revert();
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="opening">
      <div className="opening__pin">
        <ForestDepth />
        <FogField />
        <div className="opening__light" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <RadmanPresence />

        <div className="opening__veil" aria-hidden="true" />
        <div className="opening__grain" aria-hidden="true" />

        <div className="opening__nav opening__meta">
          <span className="opening__mark">R</span>
          <span>RADMAN</span>
          <span className="opening__nav-line" />
          <span>01 — 04</span>
        </div>

        <div className="opening__content">
          <p className="opening__eyebrow">A memory that remains</p>
          <h1>Radman</h1>
          <div className="opening__rule" />
          <p className="opening__copy">
            Some moments pass through time.
            <br />
            Some moments become time.
          </p>
        </div>

        <div className="opening__scroll" aria-hidden="true">
          <span>SCROLL TO REMEMBER</span>
          <i />
        </div>

        <div className="opening__corner opening__corner--left">14 : 15</div>
        <div className="opening__corner opening__corner--right">FOREVER</div>
      </div>
    </section>
  );
}
