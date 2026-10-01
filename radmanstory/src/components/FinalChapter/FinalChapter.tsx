"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function FinalChapter() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;

    if (!root) return;

    const context = gsap.context(() => {
      gsap.from("[data-final-content]", {
        opacity: 0,
        y: 100,
        scale: 0.96,
        scrollTrigger: {
          trigger: root,
          start: "top 75%",
          end: "top 35%",
          scrub: 1,
        },
      });

      gsap.to("[data-final-glow]", {
        scale: 1.4,
        opacity: 0.8,
        scrollTrigger: {
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });
    }, root);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020202] px-6 text-white"
    >
      <div
        data-final-glow
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(216,183,122,0.12),transparent_68%)] blur-3xl"
      />

      <div
        data-final-content
        className="relative z-10 max-w-3xl text-center"
      >
        <p className="text-[9px] uppercase tracking-[0.7em] text-[#d8b77a]/60">
          Forever
        </p>

        <h2 className="mt-10 text-5xl font-light leading-[0.95] tracking-[-0.06em] sm:text-7xl lg:text-8xl">
          You became
          <br />
          the reason
          <br />
          my story never ended.
        </h2>

        <div className="mx-auto my-12 h-px w-20 bg-[#d8b77a]/50" />

        <p className="text-sm tracking-wide text-white/30">
          Forever, my son.
        </p>

        <div className="mt-20">
          <a
            href="/"
            className="group inline-flex items-center gap-5 border border-white/10 px-8 py-4 transition duration-500 hover:border-[#d8b77a]/50"
          >
            <span className="text-[9px] uppercase tracking-[0.45em] text-white/50 transition group-hover:text-[#d8b77a]">
              Enter the memory
            </span>

            <span className="text-[#d8b77a]/60 transition group-hover:translate-x-2">
              →
            </span>
          </a>
        </div>

        <div className="mt-16 text-[8px] uppercase tracking-[0.6em] text-white/15">
          14 : 15
        </div>
      </div>
    </section>
  );
}