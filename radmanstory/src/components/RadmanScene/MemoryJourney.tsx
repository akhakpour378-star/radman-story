"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import RadmanScene from "./RadmanScene";

gsap.registerPlugin(ScrollTrigger);

export default function MemoryJourney() {
  const sectionRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const scene = sceneRef.current;

    if (!section || !scene) return;

    const context = gsap.context(() => {
      const cameraProxy = {
        x: 0,
        y: 0,
        z: 7,
        rotateY: 0,
      };

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=3200",
          scrub: 1.2,
          pin: scene,
          anticipatePin: 1,
        },
      });

      timeline

        /* -------------------------------------------------
           CHAPTER 01
        ------------------------------------------------- */

        .to(
          "[data-journey-title]",
          {
            opacity: 0,
            y: -80,
            scale: 0.85,
            duration: 0.8,
          },
          0,
        )

        .to(
          "[data-journey-meta]",
          {
            opacity: 0,
            y: -40,
            duration: 0.5,
          },
          0,
        )

        /* -------------------------------------------------
           CAMERA MOVE
        ------------------------------------------------- */

        .to(
          cameraProxy,
          {
            x: -0.8,
            y: 0.1,
            z: 5.4,
            duration: 1.2,
            onUpdate: () => {
              scene.style.setProperty(
                "--camera-x",
                `${cameraProxy.x}px`,
              );

              scene.style.setProperty(
                "--camera-y",
                `${cameraProxy.y}px`,
              );

              scene.style.setProperty(
                "--camera-z",
                `${cameraProxy.z}px`,
              );
            },
          },
          0.25,
        )

        /* -------------------------------------------------
           MEMORY 01
        ------------------------------------------------- */

        .to(
          "[data-memory-01]",
          {
            scale: 1.15,
            x: 30,
            duration: 0.8,
          },
          0.3,
        )

        /* -------------------------------------------------
           MEMORY 02
        ------------------------------------------------- */

        .fromTo(
          "[data-memory-02]",
          {
            opacity: 0,
            x: -180,
            scale: 0.7,
          },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 1,
          },
          0.7,
        )

        /* -------------------------------------------------
           MEMORY 01 LEAVES
        ------------------------------------------------- */

        .to(
          "[data-memory-01]",
          {
            opacity: 0.2,
            scale: 0.72,
            x: 100,
            duration: 0.8,
          },
          1.25,
        )

        /* -------------------------------------------------
           SECOND CAMERA MOVE
        ------------------------------------------------- */

        .to(
          cameraProxy,
          {
            x: 0.9,
            y: 0.2,
            z: 4.7,
            duration: 1.2,
            onUpdate: () => {
              scene.style.setProperty(
                "--camera-x",
                `${cameraProxy.x}px`,
              );

              scene.style.setProperty(
                "--camera-y",
                `${cameraProxy.y}px`,
              );

              scene.style.setProperty(
                "--camera-z",
                `${cameraProxy.z}px`,
              );
            },
          },
          1.35,
        )

        /* -------------------------------------------------
           MEMORY 03
        ------------------------------------------------- */

        .fromTo(
          "[data-memory-03]",
          {
            opacity: 0,
            x: 200,
            scale: 0.7,
          },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 1,
          },
          1.65,
        )

        /* -------------------------------------------------
           MEMORY 02 LEAVES
        ------------------------------------------------- */

        .to(
          "[data-memory-02]",
          {
            opacity: 0.18,
            scale: 0.75,
            x: -100,
            duration: 0.8,
          },
          2.15,
        )

        /* -------------------------------------------------
           MEMORY 03 LEAVES
        ------------------------------------------------- */

        .to(
          "[data-memory-03]",
          {
            opacity: 0.25,
            scale: 0.7,
            x: 100,
            duration: 0.8,
          },
          2.35,
        )

        /* -------------------------------------------------
           FINAL MEMORY
        ------------------------------------------------- */

        .fromTo(
          "[data-memory-04]",
          {
            opacity: 0,
            y: 180,
            scale: 0.55,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
          },
          2.45,
        )

        /* -------------------------------------------------
           DARKEN
        ------------------------------------------------- */

        .to(
          "[data-journey-dark]",
          {
            opacity: 0.92,
            duration: 0.8,
          },
          2.8,
        )

        /* -------------------------------------------------
           FINAL MESSAGE
        ------------------------------------------------- */

        .to(
          "[data-journey-message]",
          {
            opacity: 1,
            y: 0,
            duration: 1,
          },
          3,
        );

      return () => {
        timeline.scrollTrigger?.kill();
        timeline.kill();
      };
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[3400px] bg-[#020202]"
    >
      <div
        ref={sceneRef}
        className="relative h-screen w-full overflow-hidden"
      >
        <RadmanScene />

        {/* TOP META */}

        <div
          data-journey-meta
          className="pointer-events-none absolute left-7 top-7 z-30 text-[8px] uppercase tracking-[0.6em] text-white/30"
        >
          Memory Journey
        </div>

        <div className="pointer-events-none absolute right-7 top-7 z-30 text-[8px] uppercase tracking-[0.6em] text-white/20">
          03
        </div>

        {/* INTRO TITLE */}

        <div
          data-journey-title
          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center text-center"
        >
          <div>
            <p className="text-[8px] uppercase tracking-[0.7em] text-[#d8b77a]/60">
              Enter the memories
            </p>

            <h2 className="mt-7 text-5xl font-light tracking-[-0.06em] sm:text-7xl">
              One moment.
              <br />
              Then another.
            </h2>
          </div>
        </div>

        {/* MEMORY LABELS */}

        <div
          data-memory-01
          className="pointer-events-none absolute left-[50%] top-[72%] z-30 -translate-x-1/2 text-center"
        >
          <p className="text-[8px] uppercase tracking-[0.55em] text-white/25">
            Memory 01
          </p>
        </div>

        <div
          data-memory-02
          className="pointer-events-none absolute left-[12%] top-[25%] z-30 text-[8px] uppercase tracking-[0.55em] text-white/25"
        >
          Memory 02
        </div>

        <div
          data-memory-03
          className="pointer-events-none absolute right-[12%] top-[28%] z-30 text-[8px] uppercase tracking-[0.55em] text-white/25"
        >
          Memory 03
        </div>

        <div
          data-memory-04
          className="pointer-events-none absolute bottom-[18%] left-1/2 z-30 -translate-x-1/2 text-center"
        >
          <p className="text-[8px] uppercase tracking-[0.55em] text-[#d8b77a]/50">
            14 : 15
          </p>
        </div>

        {/* DARK TRANSITION */}

        <div
          data-journey-dark
          className="pointer-events-none absolute inset-0 z-40 bg-black opacity-0"
        />

        {/* FINAL MESSAGE */}

        <div
          data-journey-message
          className="pointer-events-none absolute inset-0 z-50 flex translate-y-16 items-center justify-center px-6 text-center opacity-0"
        >
          <div>
            <p className="text-[8px] uppercase tracking-[0.7em] text-[#d8b77a]/60">
              Forever
            </p>

            <h3 className="mt-8 max-w-4xl text-5xl font-light leading-[0.95] tracking-[-0.06em] sm:text-7xl lg:text-8xl">
              You became
              <br />
              the reason
              <br />
              my story never ended.
            </h3>

            <div className="mx-auto mt-12 h-px w-16 bg-[#d8b77a]/50" />

            <p className="mt-8 text-[9px] uppercase tracking-[0.55em] text-white/25">
              Forever, my son.
            </p>
          </div>
        </div>

        {/* SCROLL INDICATOR */}

        <div className="pointer-events-none absolute bottom-8 left-1/2 z-30 -translate-x-1/2 text-center">
          <div className="mx-auto mb-4 h-8 w-px bg-gradient-to-b from-transparent via-[#d8b77a]/50 to-transparent" />

          <p className="text-[7px] uppercase tracking-[0.5em] text-white/20">
            Scroll
          </p>
        </div>
      </div>
    </section>
  );
}