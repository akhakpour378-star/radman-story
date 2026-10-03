"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import StoryReveal from "./StoryReveal";
import StoryTimeline from "./StoryTimeline";

gsap.registerPlugin(ScrollTrigger);

export default function StorySection() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".story-top-line",
        {
          scaleX: 0,
        },
        {
          scaleX: 1,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
          },
        },
      );

      gsap.to(".story-background-number", {
        y: -160,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="story"
      className="relative overflow-hidden bg-[#080706] py-32 text-white sm:py-44 lg:py-56"
    >
      {/* background number */}

      <div className="story-background-number pointer-events-none absolute right-[-4vw] top-20 select-none text-[30vw] font-light leading-none tracking-[-0.1em] text-white/[0.018]">
        01
      </div>

      {/* top line */}

      <div className="mx-auto max-w-[1500px] px-6 sm:px-10 lg:px-14">
        <div className="story-top-line h-px origin-left bg-gradient-to-r from-[#c8a76a]/60 via-white/10 to-transparent" />
      </div>

      {/* intro */}

      <div className="mx-auto max-w-[1500px] px-6 py-28 sm:px-10 sm:py-36 lg:px-14 lg:py-48">
        <StoryReveal
          eyebrow="Chapter One"
          title="A story is made from the moments we choose to remember."
          description="Not every memory needs a photograph. Some live in a voice, a gesture, a particular hour of the day — and some remain simply because they matter."
        />
      </div>

      {/* timeline */}

      <StoryTimeline />

      {/* ending statement */}

      <div className="mx-auto max-w-[1500px] px-6 pt-16 sm:px-10 lg:px-14 lg:pt-24">
        <div className="mx-auto max-w-[700px] text-center">
          <div className="mx-auto h-12 w-px bg-gradient-to-b from-[#c8a76a]/60 to-transparent" />

          <p className="mt-8 text-[8px] uppercase tracking-[0.6em] text-[#c8a76a]/50">
            To be continued
          </p>

          <h3 className="mt-7 text-[clamp(2.5rem,6vw,5.5rem)] font-light leading-none tracking-[-0.06em] text-white/90">
            This is only
            <br />
            the beginning.
          </h3>
        </div>
      </div>
    </section>
  );
}