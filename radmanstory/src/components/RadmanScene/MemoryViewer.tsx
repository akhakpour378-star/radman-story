"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";

import type { MemoryItem } from "./memoryData";

type MemoryViewerProps = {
  memory: MemoryItem | null;
  currentIndex: number;
  total: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
};

export default function MemoryViewer({
  memory,
  currentIndex,
  total,
  onClose,
  onPrevious,
  onNext,
}: MemoryViewerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!memory) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "ArrowLeft") {
        onPrevious();
      }

      if (event.key === "ArrowRight") {
        onNext();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );

      document.body.style.overflow =
        previousOverflow;
    };
  }, [
    memory,
    onClose,
    onPrevious,
    onNext,
  ]);

  useLayoutEffect(() => {
    if (!memory || !rootRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        rootRef.current,
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 0.45,
          ease: "power2.out",
        },
      );

      gsap.fromTo(
        imageRef.current,
        {
          opacity: 0,
          scale: 0.94,
          y: 25,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        },
      );

      gsap.fromTo(
        ".viewer-copy",
        {
          opacity: 0,
          x: 30,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          delay: 0.15,
          stagger: 0.08,
          ease: "power3.out",
        },
      );
    }, rootRef);

    return () => ctx.revert();
  }, [memory]);

  if (!memory) return null;

  return (
    <div
      ref={rootRef}
      className="memory-viewer"
      role="dialog"
      aria-modal="true"
      aria-label={memory.title}
    >
      <div className="memory-viewer__backdrop" />

      <div className="memory-viewer__noise" />

      {/* TOP */}

      <header className="memory-viewer__header">
        <div className="viewer-copy">
          <span className="memory-viewer__brand">
            RADMAN
          </span>

          <span className="memory-viewer__divider" />

          <span className="memory-viewer__category">
            {memory.category}
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="memory-viewer__close"
          aria-label="Close memory"
        >
          <span />
          <span />
        </button>
      </header>

      {/* MAIN */}

      <div className="memory-viewer__main">
        <button
          type="button"
          onClick={onPrevious}
          className="memory-viewer__side-button memory-viewer__side-button--left"
          aria-label="Previous memory"
        >
          ←
        </button>

        <div
          ref={imageRef}
          className="memory-viewer__image"
        >
          <Image
            src={memory.image}
            alt={memory.title}
            fill
            priority
            sizes="(max-width: 1024px) 92vw, 65vw"
            className="object-contain"
          />

          <div className="memory-viewer__image-frame" />
        </div>

        <button
          type="button"
          onClick={onNext}
          className="memory-viewer__side-button memory-viewer__side-button--right"
          aria-label="Next memory"
        >
          →
        </button>
      </div>

      {/* BOTTOM */}

      <footer className="memory-viewer__footer">
        <div className="viewer-copy memory-viewer__meta">
          <span>{memory.year}</span>

          {memory.time && (
            <>
              <span>·</span>
              <span>{memory.time}</span>
            </>
          )}

          {memory.location && (
            <>
              <span>·</span>
              <span>{memory.location}</span>
            </>
          )}
        </div>

        <div className="viewer-copy memory-viewer__title">
          <span>{memory.subtitle}</span>

          <h2>{memory.title}</h2>

          <p>{memory.description}</p>
        </div>

        <div className="viewer-copy memory-viewer__counter">
          <span>
            {String(currentIndex + 1).padStart(2, "0")}
          </span>

          <span className="memory-viewer__counter-line" />

          <span>
            {String(total).padStart(2, "0")}
          </span>
        </div>
      </footer>
    </div>
  );
}