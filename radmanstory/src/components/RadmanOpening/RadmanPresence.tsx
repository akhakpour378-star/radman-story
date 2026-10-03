"use client";

import Image from "next/image";

import "./RadmanPresence.css";

export default function RadmanPresence() {
  return (
    <div className="opening__radman">
      <div className="radman-presence">
        <div className="radman-presence__halo" />

        <div className="radman-presence__figure">
          <Image
            src="/memory/radman-main.jpg"
            alt="Radman"
            fill
            sizes="(max-width: 900px) 70vw, 34vw"
            className="radman-presence__image"
          />
        </div>

        <div className="radman-presence__mist" />
      </div>
    </div>
  );
}