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

      chapters.forEach((chapter, index) => {
        const image = chapter.querySelector<HTMLElement>(".journey-chapter__image");
        const content = chapter.querySelector<HTMLElement>("[data-journey-copy]");
        const label = chapter.querySelector<HTMLElement>(".journey-chapter__label");
        if (!image) return;

        gsap.fromTo(image, { scale: 1.16, yPercent: -7 }, {
          scale: 1.03, yPercent: 7, ease: "none",
          scrollTrigger: { trigger: chapter, start: "top bottom", end: "bottom top", scrub: 1.8 },
        });

        if (content) {
          gsap.fromTo(content, { opacity: 0, y: 70 }, {
            opacity: 1, y: 0, ease: "power3.out",
            scrollTrigger: { trigger: chapter, start: "top 74%", end: "top 42%", scrub: 1 },
          });
        }

        if (label) {
          gsap.fromTo(label, { opacity: 0, x: index ? 35 : -35 }, {
            opacity: 1, x: 0, duration: 1.1, ease: "power3.out",
            scrollTrigger: { trigger: chapter, start: "top 65%", once: true },
          });
        }
      });

      gsap.to(".journey__chapter-line", {
        scaleY: 1,
        transformOrigin: "top",
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: 1 },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={rootRef} className="journey">
      <div className="journey__chapter-line" aria-hidden="true" />

      <RadmanOpening />

      <section className="journey-chapter journey-chapter--one">
        <div className="journey-chapter__image" aria-hidden="true" />
        <div className="journey-chapter__veil" aria-hidden="true" />
        <div className="journey-chapter__content" data-journey-copy>
          <p className="journey-chapter__label">CHAPTER 01 · THE BEGINNING</p>
          <h2>Before the world<br /><em>became a memory.</em></h2>
          <i />
          <span>There was a time when the most important thing in the world was simply walking beside you.</span>
          <small>01 / 04</small>
        </div>
      </section>

      <section className="journey-interlude">
        <div className="journey-interlude__number">02</div>
        <div className="journey-interlude__copy">
          <p>THE DISTANCE BETWEEN MOMENTS</p>
          <h3>And then,<br /><em>time began to move.</em></h3>
          <span>Not everything has to be explained. Some memories only need a place to exist.</span>
        </div>
        <div className="journey-interlude__line" />
      </section>

      <section className="journey-chapter journey-chapter--two">
        <div className="journey-chapter__image" aria-hidden="true" />
        <div className="journey-chapter__veil" aria-hidden="true" />
        <div className="journey-chapter__content journey-chapter__content--split" data-journey-copy>
          <div>
            <p className="journey-chapter__label">CHAPTER 02 · A LITTLE LIFE</p>
            <h2>Small hands.<br /><em>Big memories.</em></h2>
          </div>
          <span>A photograph keeps the light.<br />A memory keeps everything else.</span>
        </div>
      </section>

      <MemoryExperience />

      <section className="journey-finale">
        <div className="journey-finale__stars" aria-hidden="true" />
        <div className="journey-finale__glow" aria-hidden="true" />
        <div className="journey-finale__content" data-journey-copy>
          <p>THE LAST FRAME</p>
          <h2>You became<br />the reason<br /><em>my story never ended.</em></h2>
          <i />
          <span>Forever, my son.</span>
          <small>14 : 15 · ALWAYS</small>
        </div>
      </section>
    </main>
  );
}
