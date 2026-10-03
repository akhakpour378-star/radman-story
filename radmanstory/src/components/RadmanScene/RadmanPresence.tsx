"use client";

import Image from "next/image";

export default function RadmanPresence() {
  return (
    <div className="radman-presence">
      <div className="radman-presence__atmosphere" />

      <div className="radman-presence__halo" />

      <div className="radman-presence__body">
        <Image
          src="/memory/radman/radman-main.jpg"
          alt="Radman"
          fill
          sizes="(max-width: 900px) 85vw, 48vw"
          className="radman-presence__image"
          priority
        />
      </div>

      <div className="radman-presence__ground" />
    </div>
  );
}