"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import RadmanOpening from "../RadmanOpening/RadmanOpening";
import MemoryExperience from "./MemoryExperience";
import "./MemoryJourney.css";

gsap.registerPlugin(ScrollTrigger);

export default function MemoryJourney() {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const chapters = gsap.utils.toArray<HTMLElement>(".journey-chapter");

      chapters.forEach((chapter) => {
        const image = chapter.querySelector<HTMLElement>(".journey-chapter__image");
        const content = chapter.querySelector<HTMLElement>("[data-journey-copy]");
        if (!image) return;

        gsap.fromTo(image, { scale: 1.12, yPercent: -4 }, {
          scale: 1.02, yPercent: 5, ease: "none",
          scrollTrigger: { trigger: chapter, start: "top bottom", end: "bottom top", scrub: 1.5 },
        });

        if (content) {
          gsap.fromTo(content, { opacity: 0, y: 55 }, {
            opacity: 1, y: 0, ease: "power3.out",
            scrollTrigger: { trigger: chapter, start: "top 70%", end: "top 42%", scrub: 1 },
          });
        }
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={rootRef} className="journey">
      <RadmanOpening />

      <section className="journey-chapter journey-chapter--one">
        <div className="journey-chapter__image" aria-hidden="true" />
        <div className="journey-chapter__veil" aria-hidden="true" />
        <div className="journey-chapter__content" data-journey-copy>
          <p>CHAPTER 01 · THE BEGINNING</p>
          <h2>Before the world<br />became a memory.</h2>
          <i />
          <span>Some moments do not need to be loud to become unforgettable. They simply remain.</span>
        </div>
        <div className="journey-chapter__number">01</div>
      </section>

      <section className="journey-chapter journey-chapter--two">
        <div className="journey-chapter__image" aria-hidden="true" />
        <div className="journey-chapter__veil" aria-hidden="true" />
        <div className="journey-chapter__content journey-chapter__content--split" data-journey-copy>
          <div>
            <p>CHAPTER 02 · A LITTLE LIFE</p>
            <h2>Small hands.<br />Big memories.</h2>
          </div>
          <span>A photograph keeps the light.<br />A memory keeps everything else.</span>
        </div>
        <div className="journey-chapter__number">02</div>
      </section>

      <MemoryExperience />

      <section className="journey-finale">
        <div className="journey-finale__glow" aria-hidden="true" />
        <div className="journey-finale__content" data-journey-copy>
          <p>FOREVER</p>
          <h2>You became<br />the reason<br />my story never ended.</h2>
          <i />
          <span>Forever, my son.</span>
          <small>14 : 15</small>
        </div>
      </section>
    </main>
  );
}
