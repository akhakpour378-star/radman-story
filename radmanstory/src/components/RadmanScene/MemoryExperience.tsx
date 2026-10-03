"use client";

import {
  useCallback,
  useLayoutEffect,
  useState,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import MemoryCard from "./MemoryCard";
import MemoryProgress from "./MemoryProgress";
import MemoryViewer from "./MemoryViewer";
import {
  memoryItems,
  type MemoryItem,
} from "./memoryData";

import "./MemoryExperience.css";

gsap.registerPlugin(ScrollTrigger);

export default function MemoryExperience() {
  const [activeMemory, setActiveMemory] =
    useState<MemoryItem | null>(null);

  const [activeIndex, setActiveIndex] =
    useState(0);

  const openMemory = useCallback(
    (memory: MemoryItem) => {
      const index = memoryItems.findIndex(
        (item) => item.id === memory.id,
      );

      setActiveIndex(
        index >= 0 ? index : 0,
      );

      setActiveMemory(memory);
    },
    [],
  );

  const closeMemory = useCallback(() => {
    setActiveMemory(null);
  }, []);

  const showPrevious = useCallback(() => {
    setActiveIndex((current) => {
      const next =
        (current - 1 + memoryItems.length) %
        memoryItems.length;

      setActiveMemory(memoryItems[next]);

      return next;
    });
  }, []);

  const showNext = useCallback(() => {
    setActiveIndex((current) => {
      const next =
        (current + 1) % memoryItems.length;

      setActiveMemory(memoryItems[next]);

      return next;
    });
  }, []);

  useLayoutEffect(() => {
    const root = document.querySelector(
      ".memory-experience",
    );

    if (!root) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: "(min-width: 901px)",
          mobile: "(max-width: 900px)",
          reduceMotion:
            "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const {
            desktop,
            mobile,
            reduceMotion,
          } = context.conditions as {
            desktop: boolean;
            mobile: boolean;
            reduceMotion: boolean;
          };

          if (reduceMotion) {
            gsap.set(
              ".memory-card, .memory-experience__header",
              {
                opacity: 1,
                y: 0,
              },
            );

            return;
          }

          gsap.fromTo(
            ".memory-experience__header",
            {
              opacity: 0,
              y: 60,
            },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: ".memory-experience__header",
                start: "top 82%",
                once: true,
              },
            },
          );

          gsap.utils
            .toArray<HTMLElement>(".memory-card")
            .forEach((card, index) => {
              const direction =
                desktop && index % 2
                  ? 45
                  : mobile
                    ? 0
                    : -45;

              gsap.fromTo(
                card,
                {
                  opacity: 0,
                  y: mobile ? 45 : 80,
                  x: direction,
                },
                {
                  opacity: 1,
                  y: 0,
                  x: 0,
                  duration: 1.1,
                  ease: "power3.out",
                  scrollTrigger: {
                    trigger: card,
                    start: "top 88%",
                    once: true,
                  },
                },
              );
            });

          ScrollTrigger.refresh(true);
        },
      );

      return () => mm.revert();
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section
        id="memories"
        className="memory-experience px-6 py-32 sm:px-10 sm:py-44 lg:px-14 lg:py-56"
      >
        <div className="mx-auto max-w-[1500px]">
          <header className="memory-experience__header">
            <div>
              <div className="memory-experience__eyebrow">
                Chapter Two
              </div>

              <h2 className="memory-experience__heading">
                The moments
                <br />
                that remain.
              </h2>

              <p className="memory-experience__intro">
                A collection of memories preserved
                not because time stopped, but because
                some moments deserve to be remembered.
              </p>
            </div>

            <div className="memory-experience__count">
              <strong>
                {String(memoryItems.length).padStart(
                  2,
                  "0",
                )}
              </strong>

              <span>memories</span>
            </div>
          </header>

          <div className="memory-grid">
            {memoryItems.map((memory) => (
              <div
                key={memory.id}
                className="memory-grid__item"
              >
                <MemoryCard
                  memory={memory}
                  onOpen={openMemory}
                />
              </div>
            ))}
          </div>
        </div>

        <MemoryProgress
          current={activeIndex + 1}
          total={memoryItems.length}
        />
      </section>

      <MemoryViewer
        memory={activeMemory}
        currentIndex={activeIndex}
        total={memoryItems.length}
        onClose={closeMemory}
        onPrevious={showPrevious}
        onNext={showNext}
      />
    </>
  );
}