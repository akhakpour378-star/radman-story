"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "./CinematicHero.css";

gsap.registerPlugin(ScrollTrigger);

export default function CinematicHero() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const context = gsap.context(() => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const intro = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      intro
        .fromTo(
          "[data-hero-image]",
          { opacity: 0, scale: 1.035 },
          { opacity: 1, scale: 1, duration: 2.2 },
        )
        .fromTo(
          "[data-hero-atmosphere]",
          { opacity: 0 },
          { opacity: 1, duration: 1.8 },
          "-=1.6",
        )
        .fromTo(
          "[data-hero-copy] > *",
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.1 },
          "-=1.25",
        );

      if (reduceMotion) {
        gsap.set(
          "[data-hero-image], [data-hero-copy], [data-hero-forest], [data-hero-fog], [data-hero-light], [data-hero-scroll]",
          { clearProps: "all" },
        );
        return;
      }

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          pin: "[data-hero-frame]",
          scrub: 1.15,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .to(
          "[data-hero-background]",
          {
            scale: 1.1,
            yPercent: 4,
            ease: "none",
          },
          0,
        )
        .to(
          "[data-hero-forest-back]",
          {
            xPercent: -3,
            yPercent: -2,
            scale: 1.05,
            ease: "none",
          },
          0,
        )
        .to(
          "[data-hero-forest-front]",
          {
            xPercent: 5,
            yPercent: -5,
            scale: 1.1,
            ease: "none",
          },
          0,
        )
        .to(
          "[data-hero-fog]",
          {
            xPercent: 8,
            yPercent: -8,
            scale: 1.12,
            ease: "none",
          },
          0,
        )
        .to(
          "[data-hero-image]",
          {
            yPercent: -8,
            scale: 1.06,
            ease: "none",
          },
          0,
        )
        .to(
          "[data-hero-copy]",
          {
            yPercent: -42,
            opacity: 0,
            ease: "none",
          },
          0.08,
        )
        .to(
          "[data-hero-scroll]",
          {
            opacity: 0,
            y: 24,
            ease: "none",
          },
          0,
        )
        .to(
          "[data-hero-exit]",
          {
            opacity: 1,
            y: 0,
            ease: "none",
          },
          0.62,
        )
        .to(
          "[data-hero-vignette]",
          {
            opacity: 0.9,
            ease: "none",
          },
          0.58,
        );
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} className="cinematic-hero">
      <div data-hero-frame className="cinematic-hero__frame">
        <div data-hero-background className="cinematic-hero__background">
          <div className="cinematic-hero__sky" />
          <div data-hero-forest className="cinematic-hero__forest">
            <div
              data-hero-forest-back
              className="cinematic-hero__forest-layer cinematic-hero__forest-layer--back"
            />
            <div
              className="cinematic-hero__forest-layer cinematic-hero__forest-layer--middle"
            />
            <div
              data-hero-forest-front
              className="cinematic-hero__forest-layer cinematic-hero__forest-layer--front"
            />
          </div>

          <div data-hero-light className="cinematic-hero__light">
            <span />
            <span />
            <span />
          </div>

          <div data-hero-image className="cinematic-hero__portrait-wrap">
            <div className="cinematic-hero__portrait-glow" />
            <Image
              src="/memory/radman-main.JPG"
              alt="Radman"
              fill
              priority
              sizes="(max-width: 700px) 92vw, 52vw"
              className="cinematic-hero__portrait"
            />
          </div>

          <div data-hero-fog className="cinematic-hero__fog cinematic-hero__fog--one" />
          <div className="cinematic-hero__fog cinematic-hero__fog--two" />

          <div className="cinematic-hero__particles" aria-hidden="true">
            {Array.from({ length: 22 }).map((_, index) => (
              <span key={index} />
            ))}
          </div>

          <div data-hero-atmosphere className="cinematic-hero__grading" />
          <div data-hero-vignette className="cinematic-hero__vignette" />
        </div>

        <header className="cinematic-hero__nav">
          <div className="cinematic-hero__brand">
            <span>R</span>
            <strong>RADMAN</strong>
          </div>
          <div className="cinematic-hero__chapter">A MEMORY / 01</div>
        </header>

        <div data-hero-copy className="cinematic-hero__copy">
          <p className="cinematic-hero__eyebrow">
            <span />
            A STORY THAT REMAINS
          </p>

          <h1>
            <span>For</span>
            <span>Radman.</span>
          </h1>

          <p className="cinematic-hero__description">
            Some moments are brief.
            <br />
            Some become forever.
          </p>

          <div className="cinematic-hero__signature">
            <span>14 : 15</span>
            <i />
            <span>FOREVER</span>
          </div>
        </div>

        <div data-hero-scroll className="cinematic-hero__scroll">
          <span>SCROLL TO ENTER</span>
          <i />
        </div>

        <div data-hero-exit className="cinematic-hero__exit">
          <span>THE STORY BEGINS</span>
          <i />
        </div>
      </div>
    </section>
  );
}
