"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import RadmanOpening from "../RadmanOpening/RadmanOpening";
import MemoryExperience from "./MemoryExperience";

gsap.registerPlugin(ScrollTrigger);

export default function MemoryJourney() {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-journey-copy]").forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 55 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 82%",
              once: true,
            },
          },
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative overflow-hidden bg-[#050605] text-white">
      <RadmanOpening />

      <section className="relative min-h-[88svh] bg-[#050605] px-6 py-32 sm:px-10 sm:py-44">
        <div className="mx-auto max-w-6xl">
          <div data-journey-copy className="max-w-3xl">
            <p className="text-[9px] uppercase tracking-[0.62em] text-[#c8a76a]/70">
              Chapter 01 — The beginning
            </p>

            <h2 className="mt-9 text-[clamp(3.3rem,7.5vw,7.5rem)] font-light leading-[0.9] tracking-[-0.065em]">
              Before the world
              <br />
              became a memory.
            </h2>

            <div className="mt-10 h-px w-20 bg-[#c8a76a]/55" />

            <p className="mt-8 max-w-xl text-sm leading-8 text-white/40 sm:text-base">
              There are moments that do not need to be loud to become
              unforgettable. They simply remain.
            </p>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#070806] px-6 py-32 sm:px-10 sm:py-44">
        <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div data-journey-copy>
            <p className="text-[9px] uppercase tracking-[0.62em] text-[#c8a76a]/70">
              Chapter 02 — A little life
            </p>
            <h2 className="mt-8 text-4xl font-light leading-[0.96] tracking-[-0.045em] sm:text-6xl">
              Small hands.
              <br />
              Big memories.
            </h2>
          </div>

          <div data-journey-copy className="max-w-xl lg:justify-self-end">
            <p className="text-lg leading-9 text-white/48 sm:text-2xl sm:leading-10">
              A photograph keeps the light.
              <br />
              A memory keeps everything else.
            </p>
          </div>
        </div>
      </section>

      <MemoryExperience />

      <section className="relative flex min-h-[78svh] items-center justify-center overflow-hidden bg-[#030403] px-6 text-center">
        <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(200,167,106,0.12),transparent_68%)] blur-3xl" />

        <div data-journey-copy className="relative z-10 max-w-3xl">
          <p className="text-[9px] uppercase tracking-[0.7em] text-[#c8a76a]/60">
            Forever
          </p>

          <h2 className="mt-10 text-[clamp(3.2rem,7vw,7rem)] font-light leading-[0.92] tracking-[-0.06em]">
            You became
            <br />
            the reason
            <br />
            my story never ended.
          </h2>

          <div className="mx-auto my-12 h-px w-20 bg-[#c8a76a]/50" />

          <p className="text-sm tracking-wide text-white/30">
            Forever, my son.
          </p>

          <p className="mt-16 text-[8px] uppercase tracking-[0.62em] text-white/15">
            14 : 15
          </p>
        </div>
      </section>
    </div>
  );
}
