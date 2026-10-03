"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type StoryRevealProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export default function StoryReveal({
  eyebrow,
  title,
  description,
}: StoryRevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;

    if (!root) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 78%",
          end: "top 35%",
          scrub: 1,
        },
      });

      tl.fromTo(
        ".story-eyebrow",
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
        },
      )
        .fromTo(
          ".story-title",
          {
            opacity: 0,
            y: 70,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1.4,
          },
          "-=0.7",
        )
        .fromTo(
          ".story-description",
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1,
          },
          "-=0.7",
        );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef}>
      <div className="story-eyebrow flex items-center gap-4">
        <span className="h-px w-10 bg-[#c8a76a]" />

        <span className="text-[9px] uppercase tracking-[0.55em] text-[#c8a76a]/70">
          {eyebrow}
        </span>
      </div>

      <h2 className="story-title mt-8 max-w-[850px] text-[clamp(3.2rem,7vw,7rem)] font-light leading-[0.9] tracking-[-0.065em]">
        {title}
      </h2>

      <p className="story-description mt-10 max-w-[480px] text-sm font-light leading-8 tracking-wide text-white/40 sm:text-base">
        {description}
      </p>
    </div>
  );
}