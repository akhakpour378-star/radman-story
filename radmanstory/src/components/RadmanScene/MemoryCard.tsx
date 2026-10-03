"use client";

import Image from "next/image";
import type { MemoryItem } from "./memoryData";

type MemoryCardProps = {
  memory: MemoryItem;
  onOpen: (memory: MemoryItem) => void;
};

export default function MemoryCard({
  memory,
  onOpen,
}: MemoryCardProps) {
  return (
    <article
      className={`memory-card ${
        memory.featured
          ? "memory-card--featured"
          : ""
      }`}
    >
      <button
        type="button"
        onClick={() => onOpen(memory)}
        className="memory-card__button"
        aria-label={`Open ${memory.title}`}
      >
        <div className="memory-card__image">
          <Image
            src={memory.image}
            alt={memory.title}
            fill
            sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 32vw"
            className="object-cover"
          />

          <div className="memory-card__shade" />

          <div className="memory-card__shine" />

          <div className="memory-card__top">
            <span>{memory.category}</span>

            <span>{memory.number}</span>
          </div>

          <div className="memory-card__bottom">
            <span className="memory-card__year">
              {memory.year}
            </span>

            <span className="memory-card__arrow">
              ↗
            </span>
          </div>
        </div>

        <div className="memory-card__content">
          <div>
            <p className="memory-card__eyebrow">
              {memory.subtitle}
            </p>

            <h3>{memory.title}</h3>
          </div>

          <span className="memory-card__open">
            Open memory
          </span>
        </div>
      </button>
    </article>
  );
}