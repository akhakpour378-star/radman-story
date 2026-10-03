"use client";

import Image from "next/image";

type ForestDepthProps = {
  className?: string;
};

export default function ForestDepth({
  className = "",
}: ForestDepthProps) {
  return (
    <div
      className={`forest-depth ${className}`}
      aria-hidden="true"
    >
      <div className="forest-depth__base">
        <Image
          src="/memory/world/radman-main.jpg"
          alt=""
          fill
          sizes="100vw"
          className="forest-depth__image"
        />
      </div>

      <div className="forest-depth__back">
        <Image
          src="/memory/world/radman-main.jpg"
          alt=""
          fill
          sizes="100vw"
          className="forest-depth__image"
        />
      </div>

      <div className="forest-depth__middle">
        <Image
          src="/memory/world/radman-main.jpg"
          alt=""
          fill
          sizes="100vw"
          className="forest-depth__image"
        />
      </div>

      <div className="forest-depth__front">
        <Image
          src="/memory/world/radman-main.jpg"
          alt=""
          fill
          sizes="100vw"
          className="forest-depth__image"
        />
      </div>

      <div className="forest-depth__shade" />
    </div>
  );
}