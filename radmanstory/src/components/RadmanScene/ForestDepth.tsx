"use client";

import Image from "next/image";
import "./ForestDepth.css";

export default function ForestDepth() {
  return (
    <div className="forest-depth" aria-hidden="true">
      <div className="forest-depth__photo">
        <Image
          src="/memory/radman-main.JPG"
          alt=""
          fill
          priority
          sizes="100vw"
          className="forest-depth__photo-image"
        />
      </div>

      <div className="forest-depth__distant" />
      <div className="forest-depth__near" />

      <div className="forest-depth__mist" />
      <div className="forest-depth__ground" />
    </div>
  );
}
