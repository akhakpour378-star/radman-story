"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CinematicHero() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const context = gsap.context(() => {
      const intro = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      intro
        .from("[data-hero-image]", {
          scale: 1.18,
          opacity: 0,
          duration: 2.2,
        })
        .from(
          "[data-hero-eyebrow]",
          {
            opacity: 0,
            y: 30,
            duration: 1,
          },
          "-=1.3",
        )
        .from(
          "[data-hero-title]",
          {
            opacity: 0,
            y: 70,
            duration: 1.4,
          },
          "-=0.8",
        )
        .from(
          "[data-hero-line]",
          {
            scaleX: 0,
            transformOrigin: "left",
            duration: 1,
          },
          "-=0.8",
        )
        .from(
          "[data-hero-subtitle]",
          {
            opacity: 0,
            y: 25,
            duration: 1,
          },
          "-=0.5",
        );

      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=1800",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      })
        .to(
          "[data-hero-image]",
          {
            scale: 1.08,
            yPercent: -7,
            ease: "none",
          },
          0,
        )
        .to(
          "[data-hero-overlay]",
          {
            opacity: 0.75,
            ease: "none",
          },
          0,
        )
        .to(
          "[data-hero-title]",
          {
            yPercent: -35,
            scale: 0.78,
            opacity: 0.18,
            ease: "none",
          },
          0,
        )
        .to(
          "[data-hero-copy]",
          {
            yPercent: -70,
            opacity: 0,
            ease: "none",
          },
          0.12,
        )
        .to(
          "[data-hero-orb]",
          {
            scale: 2.2,
            opacity: 0.04,
            ease: "none",
          },
          0,
        )
        .to(
          "[data-hero-scroll]",
          {
            opacity: 0,
            y: 30,
            ease: "none",
          },
          0,
        );
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen min-h-[700px] overflow-hidden bg-[#020202] text-white"
    >
      {/* BACKGROUND IMAGE */}

      <div className="absolute inset-[-8%]">
        <Image
          src="/memory/radman-main.jpg"
          alt="Radman"
          fill
          priority
          sizes="100vw"
          data-hero-image
          className="object-cover object-center"
        />
      </div>

      {/* DARK CINEMATIC GRADING */}

      <div
        data-hero-overlay
        className="absolute inset-0 bg-black/35"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/10 to-black" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_15%,rgba(0,0,0,0.72)_100%)]" />

      {/* GOLD LIGHT */}

      <div
        data-hero-orb
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d8b77a]/10 blur-[120px]"
      />

      {/* CONTENT */}

      <div
        data-hero-copy
        className="absolute inset-0 z-20 flex items-center justify-center px-6"
      >
        <div className="w-full max-w-6xl text-center">

          <p
            data-hero-eyebrow
            className="text-[9px] uppercase tracking-[0.75em] text-[#d8b77a]/75"
          >
            A story that never ended
          </p>

          <h1
            data-hero-title
            className="mt-8 text-[clamp(5rem,16vw,13rem)] font-extralight leading-[0.78] tracking-[-0.09em]"
          >
            Radman
          </h1>

          <div
            data-hero-line
            className="mx-auto mt-12 h-px w-24 bg-[#d8b77a]/60"
          />

          <p
            data-hero-subtitle
            className="mt-8 text-[10px] uppercase tracking-[0.65em] text-white/45"
          >
            14 : 15
          </p>

        </div>
      </div>

      {/* TOP CORNER */}

      <div className="absolute left-7 top-7 z-30 text-[8px] uppercase tracking-[0.5em] text-white/30">
        RADMAN
      </div>

      <div className="absolute right-7 top-7 z-30 text-[8px] uppercase tracking-[0.5em] text-white/25">
        01
      </div>

      {/* BOTTOM */}

      <div
        data-hero-scroll
        className="absolute bottom-8 left-1/2 z-30 -translate-x-1/2 text-center"
      >
        <div className="mx-auto mb-4 h-10 w-px bg-gradient-to-b from-transparent via-[#d8b77a]/60 to-transparent" />

        <p className="text-[8px] uppercase tracking-[0.55em] text-white/30">
          Scroll to remember
        </p>
      </div>

      {/* SIDE LABEL */}

      <div className="absolute bottom-8 left-7 z-30 hidden text-[8px] uppercase tracking-[0.45em] text-white/20 sm:block">
        Forever
      </div>

      <div className="absolute bottom-8 right-7 z-30 hidden text-[8px] uppercase tracking-[0.45em] text-white/20 sm:block">
        2026
      </div>
    </section>
  );
}