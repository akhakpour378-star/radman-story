"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import RadmanScene from "./RadmanScene";

gsap.registerPlugin(ScrollTrigger);

export default function RadmanSceneSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const context = gsap.context(() => {
      gsap.from("[data-scene-label]", {
        opacity: 0,
        y: 30,
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          end: "top 45%",
          scrub: 1,
        },
      });

      gsap.from("[data-scene-frame]", {
        opacity: 0,
        scale: 0.88,
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          end: "top 35%",
          scrub: 1,
        },
      });

      gsap.to("[data-scene-glow]", {
        scale: 1.6,
        opacity: 0.8,
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-[#020202] px-6 py-32 text-white"
    >
      <div
        data-scene-glow
        className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d8b77a]/5 blur-[150px]"
      />

      <div className="relative z-10 mx-auto max-w-6xl">

        <div
          data-scene-label
          className="mb-12 flex items-end justify-between"
        >
          <div>
            <p className="text-[9px] uppercase tracking-[0.7em] text-[#d8b77a]/60">
              Memory space
            </p>

            <h2 className="mt-5 text-4xl font-light tracking-[-0.05em] sm:text-6xl">
              A memory
              <br />
              beyond time.
            </h2>
          </div>

          <span className="hidden text-[8px] uppercase tracking-[0.5em] text-white/20 sm:block">
            02
          </span>
        </div>

        <div
          data-scene-frame
          className="relative h-[620px] overflow-hidden rounded-[2px] border border-white/10 bg-black shadow-[0_0_100px_rgba(216,183,122,0.05)]"
        >
          <RadmanScene />

          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.55)_100%)]" />

          <div className="pointer-events-none absolute left-6 top-6 text-[8px] uppercase tracking-[0.5em] text-white/20">
            Memory 01
          </div>

          <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
            <p className="text-[8px] uppercase tracking-[0.5em] text-white/25">
              Move through the memory
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-between text-[8px] uppercase tracking-[0.4em] text-white/15">
          <span>Radman</span>
          <span>14 : 15</span>
        </div>

      </div>
    </section>
  );
}