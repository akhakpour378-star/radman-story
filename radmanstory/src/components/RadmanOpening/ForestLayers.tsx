"use client";

import Image from "next/image";

import "./ForestLayers.css";

export default function ForestLayers() {
  return (
    <div className="opening-forest">
      <div className="opening-forest__far">
        <Image
          src="/memory/radman-main.jpg"
          alt=""
          fill
          sizes="100vw"
          className="opening-forest__image"
        />
      </div>

      <div className="opening-forest__mid">
        <Image
          src="/memory/radman-main.jpg"
          alt=""
          fill
          sizes="100vw"
          className="opening-forest__image"
        />
      </div>

      <div className="opening-forest__near">
        <Image
          src="/memory/radman-main.jpg"
          alt=""
          fill
          sizes="100vw"
          className="opening-forest__image"
        />
      </div>

      <div className="opening-forest__dark" />
    </div>
  );
}