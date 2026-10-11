"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { Play } from "lucide-react";
import "./MemorySignal.css";

type Props = {
  items: string[];
  resolveSrc: (src: string) => string;
  onSelect: (src: string, index: number) => void;
};

const isVideoSrc = (src: string) => /\.(mp4|webm|mov|m4v)(?:[?#].*)?$/i.test(src);

export default function MemorySignal({ items, resolveSrc, onSelect }: Props) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cycleWidthRef = useRef(0);
  const frameRef = useRef<number | null>(null);
  const lastFrameRef = useRef(0);
  const pointerRef = useRef<{ id: number; x: number; scroll: number; captureTarget: HTMLElement } | null>(null);
  const draggedRef = useRef(false);
  const suppressClickRef = useRef(false);
  const [focused, setFocused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);

  const media = useMemo(() => {
    const seen = new Set<string>();
    return items.filter((entry) => {
      if (typeof entry !== "string") return false;
      const src = entry.startsWith("video:") ? entry.slice(6) : entry;
      if (!src || seen.has(src)) return false;
      seen.add(src);
      return true;
    });
  }, [items]);

  const loopItems = useMemo(() => {
    if (!media.length) return [];
    // Even a single selected item gets repeated copies, so the track can still loop.
    const copies = media.length < 5 ? 7 : media.length < 8 ? 5 : 3;
    return Array.from({ length: copies }, () => media).flat();
  }, [media]);
  const getCycleWidth = useCallback(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport || media.length < 1) {
      cycleWidthRef.current = 0;
      return;
    }

    const children = Array.from(track.children) as HTMLElement[];
    const first = children[0];
    const firstOfNextCopy = children[media.length];
    if (!first || !firstOfNextCopy) {
      cycleWidthRef.current = 0;
      return;
    }

    // Measure in viewport coordinates: unlike offsetLeft, this remains reliable
    // when the page around the carousel uses RTL layout or nested offset parents.
    const cycleWidth = firstOfNextCopy.getBoundingClientRect().left - first.getBoundingClientRect().left;
    if (!Number.isFinite(cycleWidth) || cycleWidth <= 0) {
      cycleWidthRef.current = 0;
      return;
    }

    const previousCycle = cycleWidthRef.current;
    cycleWidthRef.current = cycleWidth;
    if (previousCycle === 0) {
      // Begin in the middle copy so the track has room to loop in both directions.
      viewport.scrollLeft = cycleWidth;
    } else {
      // Preserve the user's relative position when images/fonts/layout resize.
      const relative = viewport.scrollLeft % previousCycle;
      viewport.scrollLeft = cycleWidth + relative;
    }
  }, [media.length]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener?.("change", update);
    const observer = new ResizeObserver(getCycleWidth);
    if (trackRef.current) observer.observe(trackRef.current);
    if (viewportRef.current) observer.observe(viewportRef.current);
    window.addEventListener("resize", getCycleWidth);
    const firstMeasure = window.requestAnimationFrame(getCycleWidth);
    return () => {
      query.removeEventListener?.("change", update);
      observer.disconnect();
      window.removeEventListener("resize", getCycleWidth);
      window.cancelAnimationFrame(firstMeasure);
    };
  }, [getCycleWidth, loopItems.length]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || media.length < 1) return;
    const canMove = !focused && !reducedMotion && document.visibilityState === "visible" && !isDragging;
    if (!canMove) {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
      lastFrameRef.current = 0;
      return;
    }

    const tick = (now: number) => {
      if (!lastFrameRef.current) lastFrameRef.current = now;
      const elapsed = Math.min(40, now - lastFrameRef.current);
      lastFrameRef.current = now;
      const cycle = cycleWidthRef.current;
      if (cycle > 0) {
        // LTR is enforced on the viewport; normalize against the middle copy.
        const next = viewport.scrollLeft + elapsed * 0.045;
        const lower = cycle * 0.5;
        const upper = cycle * 2.5;
        if (next >= upper) viewport.scrollLeft = next - cycle;
        else if (next < lower) viewport.scrollLeft = next + cycle;
        else viewport.scrollLeft = next;
      }
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
      lastFrameRef.current = 0;
    };
  }, [focused, isDragging, media.length, reducedMotion]);



  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    const viewport = viewportRef.current;
    if (!viewport) return;
    const captureTarget = event.target instanceof HTMLElement ? event.target : viewport;
    pointerRef.current = { id: event.pointerId, x: event.clientX, scroll: viewport.scrollLeft, captureTarget };
    draggedRef.current = false;
    setIsDragging(true);
    try { captureTarget.setPointerCapture(event.pointerId); } catch {}
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const pointer = pointerRef.current;
    const viewport = viewportRef.current;
    if (!pointer || pointer.id !== event.pointerId || !viewport) return;
    const delta = event.clientX - pointer.x;
    if (Math.abs(delta) > 4) draggedRef.current = true;
    if (draggedRef.current) {
      viewport.scrollLeft = pointer.scroll - delta;
      event.preventDefault();
    }
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const pointer = pointerRef.current;
    if (!pointer || pointer.id !== event.pointerId) return;
    pointerRef.current = null;
    setIsDragging(false);
    if (draggedRef.current) {
      suppressClickRef.current = true;
      window.setTimeout(() => { suppressClickRef.current = false; }, 0);
    }
    draggedRef.current = false;
    try { if (pointer.captureTarget.hasPointerCapture(event.pointerId)) pointer.captureTarget.releasePointerCapture(event.pointerId); } catch {}
  };

  const openMedia = (entry: string, index: number) => {
    if (suppressClickRef.current) return;
    onSelect(entry.startsWith("video:") ? entry.slice(6) : entry, index);
  };

  if (!media.length) return null;

  return (
    <section className="memory-signal" aria-label="Selected memories">
      <div
        className="memory-signal__viewport"
        ref={viewportRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onFocusCapture={(event) => { if (event.target === event.currentTarget) setFocused(true); }}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
        }}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Memory Signal gallery. Use the arrow keys to browse."
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") { event.preventDefault(); viewportRef.current?.scrollBy({ left: 205, behavior: reducedMotion ? "auto" : "smooth" });  }
          if (event.key === "ArrowLeft") { event.preventDefault(); viewportRef.current?.scrollBy({ left: -205, behavior: reducedMotion ? "auto" : "smooth" });  }
        }}
      >
        <div className="memory-signal__track" ref={trackRef}>
          {loopItems.map((entry, renderIndex) => {
            const originalIndex = renderIndex % media.length;
            const src = entry.startsWith("video:") ? entry.slice(6) : entry;
            const video = entry.startsWith("video:") || isVideoSrc(src);
            const clone = renderIndex >= media.length;
            return (
              <button
                type="button"
                className={"memory-signal__card" + (video ? " memory-signal__card--video" : "")}
                key={renderIndex + ":" + entry}
                data-media={src}
                onClick={() => openMedia(entry, originalIndex)}
                tabIndex={clone ? -1 : 0}
                aria-hidden={clone || undefined}
                aria-label={video ? "Open memory video" : `Open memory ${originalIndex + 1}`}
              >
                {video
                  ? <video src={resolveSrc(src)} muted autoPlay loop playsInline preload="metadata" draggable={false} />
                  : <img src={resolveSrc(src)} alt="" loading={renderIndex < media.length ? "eager" : "lazy"} draggable={false} />}
                {video && <span className="memory-signal__play" aria-hidden="true"><Play size={18} fill="currentColor" /></span>}
                <span className="memory-signal__shine" aria-hidden="true" />
              </button>
            );
          })}
        </div>
      </div>

    </section>
  );
}
