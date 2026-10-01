"use client";

import { useEffect, useRef } from "react";
import { playIntroAnimation } from "@/animations/intro";

export default function CinematicIntro() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!rootRef.current) {
      return;
    }

    return playIntroAnimation(rootRef.current);
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black"
    >
      <div
        data-intro-glow
        className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(216,183,122,0.10),transparent_65%)] blur-2xl"
      />

      <div className="relative z-10 px-6 text-center">
        <p
          data-intro-eyebrow
          className="mb-6 text-[10px] font-medium uppercase tracking-[0.55em] text-white/45 sm:text-xs"
        >
          A story beyond time
        </p>

        <h1
          data-intro-title
          className="font-serif text-6xl font-light tracking-[-0.04em] text-white sm:text-8xl md:text-9xl"
        >
          Radman
        </h1>

        <div
          data-intro-line
          className="mx-auto mt-8 h-px w-24 bg-[#d8b77a]/50"
        />

        <p
          data-intro-subtitle
          className="mt-8 text-[10px] uppercase tracking-[0.45em] text-white/40 sm:text-xs"
        >
          A story that never ends
        </p>
      </div>
    </section>
  );
}