"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const moments = [
  {
    time: "14:15",
    title: "A moment",
    text: "Some moments become important only after we realize how much they meant.",
  },
  {
    time: "∞",
    title: "A story without an ending",
    text: "Time continues moving, but the memories we carry don't have to disappear with it.",
  },
  {
    time: "FOREVER",
    title: "Still here",
    text: "Every photograph, every memory, every little detail becomes another way of keeping a story alive.",
  },
];

export default function TimeChapter() {
  const rootRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const line = lineRef.current;

    if (!root || !line) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        line,
        {
          scaleY: 0,
          transformOrigin: "top",
        },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top 70%",
            end: "bottom 80%",
            scrub: 1,
          },
        },
      );

      const moments =
        gsap.utils.toArray<HTMLElement>("[data-time-moment]");

      moments.forEach((moment) => {
        const content =
          moment.querySelector("[data-time-content]");

        const time =
          moment.querySelector("[data-time-label]");

        gsap.fromTo(
          content,
          {
            opacity: 0,
            y: 60,
          },
          {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: moment,
              start: "top 78%",
              end: "top 45%",
              scrub: 1,
            },
          },
        );

        gsap.fromTo(
          time,
          {
            opacity: 0.15,
            scale: 0.8,
          },
          {
            opacity: 1,
            scale: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: moment,
              start: "top 75%",
              end: "top 45%",
              scrub: 1,
            },
          },
        );
      });
    }, root);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden bg-[#030303] text-white"
    >
      <div className="pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/10">
        <div
          ref={lineRef}
          className="h-full w-full bg-[#d8b77a]/60"
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-40 sm:px-10 sm:py-56">

        <header className="mb-56 text-center">
          <p className="mb-7 text-[9px] uppercase tracking-[0.65em] text-[#d8b77a]/60">
            Chapter 03
          </p>

          <h2 className="text-6xl font-light tracking-[-0.06em] sm:text-8xl lg:text-[9rem]">
            Time
          </h2>

          <p className="mx-auto mt-9 max-w-md text-sm leading-8 text-white/35">
            Time changes everything.
            <br />
            Except the moments we choose to remember.
          </p>
        </header>

        <div className="space-y-64 sm:space-y-80">
          {moments.map((moment, index) => (
            <article
              key={moment.time}
              data-time-moment
              className={`relative grid min-h-[55vh] items-center gap-12 md:grid-cols-2 ${
                index % 2 === 0
                  ? ""
                  : "md:text-right"
              }`}
            >
              <div
                className={`relative z-10 ${
                  index % 2 === 0
                    ? "md:col-start-1"
                    : "md:col-start-2"
                }`}
              >
                <div
                  data-time-content
                  className="mx-auto max-w-md"
                >
                  <p
                    data-time-label
                    className="text-5xl font-extralight tracking-[-0.05em] text-[#d8b77a] sm:text-7xl"
                  >
                    {moment.time}
                  </p>

                  <div className="my-7 h-px w-14 bg-[#d8b77a]/40 md:ml-auto" />

                  <h3 className="text-3xl font-light tracking-[-0.035em] sm:text-5xl">
                    {moment.title}
                  </h3>

                  <p className="mt-7 text-sm leading-8 text-white/35 sm:text-base">
                    {moment.text}
                  </p>
                </div>
              </div>

              <div
                className={`absolute left-1/2 top-1/2 z-20 flex h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#d8b77a]/70 bg-[#030303] shadow-[0_0_30px_rgba(216,183,122,0.35)]`}
              />
            </article>
          ))}
        </div>

        <footer className="mt-48 border-t border-white/10 pt-10 text-center">
          <p className="text-[9px] uppercase tracking-[0.55em] text-white/25">
            Time passes. Memories remain.
          </p>
        </footer>
      </div>
    </section>
  );
}