"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { storyChapters } from "./storyData";

gsap.registerPlugin(ScrollTrigger);

export default function StoryTimeline() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;

    if (!root) return;

    const ctx = gsap.context(() => {
      const chapters = gsap.utils.toArray<HTMLElement>(".story-chapter");

      chapters.forEach((chapter) => {
        const image = chapter.querySelector(".chapter-image");
        const content = chapter.querySelector(".chapter-content");
        const number = chapter.querySelector(".chapter-number");

        gsap.fromTo(
          image,
          {
            opacity: 0,
            y: 80,
            scale: 1.08,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: chapter,
              start: "top 80%",
              end: "top 35%",
              scrub: 1,
            },
          },
        );

        gsap.fromTo(
          content,
          {
            opacity: 0,
            y: 50,
          },
          {
            opacity: 1,
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: chapter,
              start: "top 72%",
              end: "top 38%",
              scrub: 1,
            },
          },
        );

        gsap.fromTo(
          number,
          {
            opacity: 0,
            scale: 0.7,
          },
          {
            opacity: 1,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: chapter,
              start: "top 75%",
              end: "top 45%",
              scrub: 1,
            },
          },
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative mx-auto max-w-[1500px] px-6 pb-40 sm:px-10 lg:px-14"
    >
      {/* central line */}

      <div className="absolute bottom-0 left-1/2 top-0 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/10 to-transparent lg:block" />

      <div className="space-y-36 sm:space-y-48 lg:space-y-64">
        {storyChapters.map((chapter) => {
          const isLeft = chapter.align === "left";

          return (
            <article
              key={chapter.number}
              className="story-chapter relative grid items-center gap-12 lg:grid-cols-2 lg:gap-28"
            >
              {/* image */}

              <div
                className={`chapter-image relative aspect-[4/5] overflow-hidden ${
                  isLeft
                    ? "lg:order-1"
                    : "lg:order-2"
                }`}
              >
                <Image
                  src={chapter.image}
                  alt={chapter.title}
                  fill
                  sizes="(max-width: 1024px) 90vw, 42vw"
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#080706]/70 via-transparent to-transparent" />

                <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />

                <div className="absolute bottom-5 left-5">
                  <span className="text-[8px] uppercase tracking-[0.5em] text-white/40">
                    {chapter.year}
                  </span>
                </div>
              </div>

              {/* content */}

              <div
                className={`chapter-content relative ${
                  isLeft
                    ? "lg:order-2"
                    : "lg:order-1 lg:text-right"
                }`}
              >
                <div
                  className={`flex items-center gap-4 ${
                    !isLeft
                      ? "lg:justify-end"
                      : ""
                  }`}
                >
                  <span className="h-px w-8 bg-[#c8a76a]/60" />

                  <span className="text-[8px] uppercase tracking-[0.5em] text-[#c8a76a]/60">
                    {chapter.year}
                  </span>
                </div>

                <h3 className="mt-7 max-w-[580px] text-[clamp(2.2rem,4vw,4.5rem)] font-light leading-[0.95] tracking-[-0.055em]">
                  {chapter.title}
                </h3>

                <p className="mt-8 max-w-[430px] text-sm leading-8 text-white/35 sm:text-[15px]">
                  {chapter.description}
                </p>

                <div
                  className={`mt-10 flex items-center gap-4 ${
                    !isLeft
                      ? "lg:justify-end"
                      : ""
                  }`}
                >
                  <span className="text-[9px] uppercase tracking-[0.45em] text-white/25">
                    Chapter
                  </span>

                  <span className="text-sm text-[#c8a76a]/60">
                    {chapter.number}
                  </span>
                </div>
              </div>

              {/* timeline marker */}

              <div className="chapter-number absolute left-1/2 top-1/2 z-10 hidden h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#c8a76a]/30 bg-[#080706] lg:flex">
                <span className="text-[9px] tracking-[0.2em] text-[#c8a76a]/70">
                  {chapter.number}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}