"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import "./MovingMemoryCarousel.css";

type Props = {
  items: string[];
  titles?: Record<string, string>;
  resolveSrc: (src: string) => string;
  onSelect: (src: string) => void;
};

const cleanSrc = (entry: string) => entry.startsWith("video:") ? entry.slice(6) : entry;
const isVideoSrc = (entry: string) => /\.(mp4|webm|mov|m4v)(?:[?#].*)?$/i.test(cleanSrc(entry));

export default function MovingMemoryCarousel({ items, titles = {}, resolveSrc, onSelect }: Props) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [dragging, setDragging] = useState(false);
  const startRef = useRef<{ x: number; y: number; index: number; pointerId: number } | null>(null);
  const movedRef = useRef(false);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);

  const media = useMemo(() => {
    const seen = new Set<string>();
    return items.filter((entry) => {
      if (typeof entry !== "string") return false;
      const src = cleanSrc(entry);
      if (!src || seen.has(src)) return false;
      seen.add(src);
      return true;
    });
  }, [items]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(query.matches);
    sync();
    query.addEventListener?.("change", sync);
    return () => query.removeEventListener?.("change", sync);
  }, []);

  useEffect(() => {
    if (active >= media.length) setActive(0);
  }, [active, media.length]);

  const move = useCallback((delta: number) => {
    if (!media.length) return;
    setActive((current) => (current + delta + media.length) % media.length);
  }, [media.length]);

  useEffect(() => {
    if (media.length < 2 || paused || dragging || reducedMotion || document.visibilityState !== "visible") return;
    const timer = window.setInterval(() => { if (document.visibilityState === "visible") move(1); }, 3900);
    const onVisibility = () => { if (document.visibilityState !== "visible") setPaused((value) => value); };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [active, dragging, media.length, move, paused, reducedMotion]);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === active && !paused && !reducedMotion) {
        const play = video.play();
        if (play && typeof play.catch === "function") play.catch(() => {});
      } else {
        video.pause();
        if (index !== active) {
          try { video.currentTime = 0; } catch {}
        }
      }
    });
  }, [active, media, paused, reducedMotion]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") { event.preventDefault(); move(-1); }
      if (event.key === "ArrowLeft") { event.preventDefault(); move(1); }
    };
    const stage = document.querySelector(".mm3d");
    stage?.addEventListener("keydown", onKey as EventListener);
    return () => stage?.removeEventListener("keydown", onKey as EventListener);
  }, [move]);

  if (!media.length) return null;

  const startDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const card = (event.target as HTMLElement).closest<HTMLElement>(".mm3d__card");
    const captureTarget = card || event.currentTarget;
    startRef.current = { x: event.clientX, y: event.clientY, index: active, pointerId: event.pointerId, captureTarget };
    movedRef.current = false;
    setDragging(true);
    setPaused(true);
    // Capture on the card itself so pointer capture doesn't swallow its click.
    try { captureTarget.setPointerCapture(event.pointerId); } catch {}
  };

  const drag = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = startRef.current;
    if (!start || start.pointerId !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy)) movedRef.current = true;
    if (movedRef.current) {
      const steps = Math.max(1, Math.round(Math.abs(dx) / 95));
      const next = (start.index + (dx > 0 ? -steps : steps) + media.length * 10) % media.length;
      setActive(next);
    }
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = startRef.current;
    if (!start || start.pointerId !== event.pointerId) return;
    startRef.current = null;
    setDragging(false);
    setPaused(false);
    if (movedRef.current) window.setTimeout(() => { movedRef.current = false; }, 80);
    try {
      if (start.captureTarget.hasPointerCapture(event.pointerId)) start.captureTarget.releasePointerCapture(event.pointerId);
    } catch {}
  };

  const openCard = (index: number) => {
    if (movedRef.current) return;
    // First click on a side card promotes it to the featured center frame.
    if (index !== active) {
      setActive(index);
      setPaused(true);
      return;
    }
    // Clicking the already featured frame opens the full image/video viewer.
    setPaused(true);
    onSelect(cleanSrc(media[index]));
  };

  const count = media.length;
  const visibleOffset = (index: number) => {
    let delta = index - active;
    if (delta > count / 2) delta -= count;
    if (delta < -count / 2) delta += count;
    return delta;
  };

  return (
    <section className="mm3d" aria-label="Moving Memory 3D video carousel">
      <div className="mm3d__topline"><span>RADMAN / MOVING MEMORY</span><span>SELECT A MOMENT <i /></span></div>
      <div
        className={"mm3d__stage" + (dragging ? " is-dragging" : "")}
        role="region"
        aria-roledescription="carousel"
        aria-label="Moving Memory films"
        tabIndex={0}
        onPointerDown={startDrag}
        onPointerMove={drag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div className="mm3d__ambient" aria-hidden="true" />
        {media.map((entry, index) => {
          const src = cleanSrc(entry);
          const offset = visibleOffset(index);
          const distance = Math.abs(offset);
          const title = titles[entry] || titles[src] || `Memory film ${String(index + 1).padStart(2, "0")}`;
          const videoSrc = resolveSrc(src);
          return (
            <button
              type="button"
              className={"mm3d__card" + (offset === 0 ? " is-active" : "")}
              key={entry}
              style={{
                transform: `translate(-50%, -50%) translateX(${offset * 67}%) translateZ(${-distance * 116}px) rotateY(${offset * -27}deg) scale(${offset === 0 ? 1 : Math.max(.68, 1 - distance * .13)})`,
                zIndex: 20 - distance,
                opacity: distance > 2 ? 0 : Math.max(.18, 1 - distance * .3),
                pointerEvents: distance > 2 ? "none" : "auto",
              }}
              aria-label={offset === 0 ? `Play ${title}` : `Bring ${title} to center`}
              aria-current={offset === 0 ? "true" : undefined}
              tabIndex={distance > 2 ? -1 : 0}
              onClick={() => openCard(index)}
            >
              <span className="mm3d__image">
                {isVideoSrc(entry) ? (
                  <video
                    ref={(node) => { videoRefs.current[index] = node; }}
                    src={videoSrc}
                    muted
                    loop
                    playsInline
                    preload={distance <= 1 ? "metadata" : "none"}
                    aria-hidden="true"
                  />
                ) : (
                  <img
                    src={videoSrc}
                    alt=""
                    loading={distance <= 1 ? "eager" : "lazy"}
                    draggable={false}
                    aria-hidden="true"
                  />
                )}
                <span className="mm3d__vignette" />
                <span className="mm3d__play">{offset === 0 ? <Play size={17} fill="currentColor" /> : <ArrowRight size={16} />}</span>
                <span className="mm3d__filmno">FRAME / {String(index + 1).padStart(2, "0")}</span>
              </span>
              <span className="mm3d__caption"><span>{title}</span><i>{String(index + 1).padStart(2, "0")}</i></span>
            </button>
          );
        })}
      </div>
      <div className="mm3d__controls">
        <button type="button" aria-label="Previous film" onClick={() => { move(-1); setPaused(false); }}><ArrowRight size={16} /></button>
        <div className="mm3d__progress" aria-label={`Film ${active + 1} of ${count}`}>
          <span>{String(active + 1).padStart(2, "0")}</span><i><b style={{ width: `${((active + 1) / count) * 100}%` }} /></i><span>{String(count).padStart(2, "0")}</span>
        </div>
        <button type="button" aria-label="Next film" onClick={() => { move(1); setPaused(false); }}><ArrowLeft size={16} /></button>
        <button type="button" className="mm3d__autoplay" aria-label={paused ? "Resume carousel" : "Pause carousel"} onClick={() => setPaused((value) => !value)}>{paused ? <Play size={13} /> : <Pause size={13} />}</button>
      </div>
      <p className="mm3d__hint">DRAG TO EXPLORE <span>·</span> SELECT THE CENTER FRAME TO WATCH</p>
    </section>
  );
}
