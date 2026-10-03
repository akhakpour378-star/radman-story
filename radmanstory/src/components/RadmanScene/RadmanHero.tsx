"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "./RadmanHero.css";

gsap.registerPlugin(ScrollTrigger);

export default function RadmanHero() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;

    if (!root) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: "(min-width: 901px)",
          mobile: "(max-width: 900px)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const conditions = context.conditions as {
            desktop: boolean;
            mobile: boolean;
            reduced: boolean;
          };

          if (conditions.reduced) {
            gsap.set(
              [
                ".radman-hero__image",
                ".radman-hero__veil",
                ".radman-hero__content",
                ".radman-hero__meta",
                ".radman-hero__scroll",
              ],
              {
                opacity: 1,
                x: 0,
                y: 0,
                scale: 1,
              },
            );

            return;
          }

          const intro = gsap.timeline({
            defaults: {
              ease: "power3.out",
            },
          });

          intro
            .fromTo(
              ".radman-hero__image",
              {
                scale: 1.12,
              },
              {
                scale: 1,
                duration: 2.4,
                ease: "power3.out",
              },
            )
            .fromTo(
              ".radman-hero__veil",
              {
                opacity: 1,
              },
              {
                opacity: 0.65,
                duration: 1.8,
              },
              "-=1.8",
            )
            .fromTo(
              ".radman-hero__eyebrow",
              {
                opacity: 0,
                y: 20,
              },
              {
                opacity: 1,
                y: 0,
                duration: 0.8,
              },
              "-=0.9",
            )
            .fromTo(
              ".radman-hero__title-line",
              {
                opacity: 0,
                y: 90,
              },
              {
                opacity: 1,
                y: 0,
                duration: 1.1,
                stagger: 0.1,
              },
              "-=0.6",
            )
            .fromTo(
              ".radman-hero__description",
              {
                opacity: 0,
                y: 25,
              },
              {
                opacity: 1,
                y: 0,
                duration: 0.8,
              },
              "-=0.55",
            )
            .fromTo(
              ".radman-hero__meta",
              {
                opacity: 0,
                x: conditions.desktop ? 30 : 0,
                y: conditions.mobile ? 20 : 0,
              },
              {
                opacity: 1,
                x: 0,
                y: 0,
                duration: 0.8,
              },
              "-=0.5",
            )
            .fromTo(
              ".radman-hero__scroll",
              {
                opacity: 0,
                y: 15,
              },
              {
                opacity: 1,
                y: 0,
                duration: 0.8,
              },
              "-=0.35",
            );

          if (conditions.desktop) {
            gsap.to(".radman-hero__image", {
              yPercent: 10,
              scale: 1.06,
              ease: "none",
              scrollTrigger: {
                trigger: root,
                start: "top top",
                end: "bottom top",
                scrub: true,
              },
            });

            gsap.to(".radman-hero__content", {
              yPercent: -12,
              opacity: 0.2,
              ease: "none",
              scrollTrigger: {
                trigger: root,
                start: "top top",
                end: "bottom top",
                scrub: true,
              },
            });

            gsap.to(".radman-hero__side", {
              yPercent: -20,
              opacity: 0,
              ease: "none",
              scrollTrigger: {
                trigger: root,
                start: "top top",
                end: "bottom top",
                scrub: true,
              },
            });
          }
        },
      );

      return () => {
        mm.revert();
      };
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="radman-hero"
      aria-label="Radman Memorial"
    >
      {/* BACKGROUND */}

      <div className="radman-hero__background">
        <div className="radman-hero__image">
          <Image
            src="/memory/radman-main.jpg"
            alt="Radman"
            fill
            priority
            sizes="100vw"
            className="radman-hero__photo"
          />
        </div>

        <div className="radman-hero__veil" />

        <div className="radman-hero__gradient" />

        <div className="radman-hero__grain" />
      </div>

      {/* NAV */}

      <div className="radman-hero__nav">
        <div className="radman-hero__logo">
          <span>R</span>
          <span className="radman-hero__logo-full">
            RADMAN
          </span>
        </div>

        <div className="radman-hero__nav-right">
          <span>MEMORY</span>
          <span className="radman-hero__nav-line" />
          <span>01 — 04</span>
        </div>
      </div>

      {/* MAIN */}

      <div className="radman-hero__content">
        <div className="radman-hero__eyebrow">
          <span className="radman-hero__eyebrow-line" />
          A STORY THAT REMAINS
        </div>

        <h1 className="radman-hero__title">
          <span className="radman-hero__title-line">
            For
          </span>

          <span className="radman-hero__title-line radman-hero__title-line--indent">
            Radman.
          </span>
        </h1>

        <p className="radman-hero__description">
          Some stories are not meant to end.
          <br />
          They are meant to remain.
        </p>
      </div>

      {/* SIDE */}

      <aside className="radman-hero__side">
        <div className="radman-hero__side-number">
          01
        </div>

        <div className="radman-hero__side-line" />

        <div className="radman-hero__side-label">
          BEGINNING
        </div>
      </aside>

      {/* FOOTER */}

      <div className="radman-hero__footer">
        <div className="radman-hero__coordinates">
          <span>35°41′ N</span>
          <span>51°25′ E</span>
        </div>

        <div className="radman-hero__scroll">
          <span>SCROLL TO REMEMBER</span>

          <div className="radman-hero__scroll-line">
            <span />
          </div>
        </div>

        <div className="radman-hero__year">
          MMXXVI
        </div>
      </div>
    </section>
  );
}