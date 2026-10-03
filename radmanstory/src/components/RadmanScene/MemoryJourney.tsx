"use client";

import { Canvas } from "@react-three/fiber";
import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import AmbientScene from "./AmbientScene";
import StorySection from "./StorySection";

import MemoryExperience from "./MemoryExperience";
import { main } from "framer-motion/client";

import RadmanOpening from "../RadmanOpening/RadmanOpening";

gsap.registerPlugin(ScrollTrigger);

export default function MemoryJourney() {
  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const page = pageRef.current;

    if (!page) return;

    const ctx = gsap.context(() => {
      const hero = heroRef.current;

      if (!hero) return;

      const heroImage = heroImageRef.current;

      const heroTimeline = gsap.timeline();

      heroTimeline
        .fromTo(
          ".radman-nav",
          {
            y: -20,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 1,
          },
        )
        .fromTo(
          ".hero-eyebrow",
          {
            opacity: 0,
            y: 25,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          "-=0.5",
        )
        .fromTo(
          ".hero-title-line",
          {
            opacity: 0,
            y: 80,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            stagger: 0.12,
          },
          "-=0.45",
        )
        .fromTo(
          ".hero-description",
          {
            opacity: 0,
            y: 25,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          "-=0.5",
        )
        .fromTo(
          heroImage,
          {
            opacity: 0,
            scale: 1.08,
          },
          {
            opacity: 1,
            scale: 1,
            duration: 1.5,
            ease: "power2.out",
          },
          "-=1",
        );

      /* HERO SCROLL */

      gsap.to(".hero-copy", {
        y: -120,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(heroImage, {
        y: -80,
        scale: 1.08,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(".hero-scroll", {
        opacity: 0,
        y: 30,
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "top 30%",
          scrub: true,
        },
      });

      /* NAV */

      ScrollTrigger.create({
        trigger: hero,
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => {
          const nav = document.querySelector(".radman-nav");

          if (!nav) return;

          if (self.progress > 0.08) {
            nav.classList.add("nav-scrolled");
          } else {
            nav.classList.remove("nav-scrolled");
          }
        },
      });
    }, page);

    return () => ctx.revert();
  }, []);

  return (

      <div
        ref={pageRef}
        className="relative overflow-hidden bg-[#080706] text-white"
      >
        {/* =====================================================
          GLOBAL AMBIENT BACKGROUND
      ====================================================== */}

        <div className="pointer-events-none fixed inset-0 z-0">
          <Canvas
            dpr={[1, 1.5]}
            camera={{
              position: [0, 0, 7],
              fov: 42,
              near: 0.1,
              far: 30,
            }}
            gl={{
              antialias: true,
              alpha: true,
            }}
          >
            <AmbientScene />
          </Canvas>
        </div>

        {/* =====================================================
          HERO
      ====================================================== */}

      <RadmanOpening />

        {/* =====================================================
          STORY
      ====================================================== */}

        <div className="relative z-10">
          <StorySection />
        </div>

        {/* =====================================================
          NEXT SECTION PLACEHOLDER
      ====================================================== */}

        <div className="relative z-10">
          <MemoryExperience />
        </div>

        <section
          id="forever"
          className="relative z-10 flex min-h-[70vh] items-center justify-center bg-[#080706] px-6"
        >
          <div className="text-center">
            <p className="text-[8px] uppercase tracking-[0.65em] text-[#c8a76a]/50">
              Forever
            </p>

            <h2 className="mt-8 text-[clamp(3rem,7vw,7rem)] font-light leading-none tracking-[-0.07em]">
              Always remembered.
            </h2>
          </div>
        </section>
      </div>
  );
}