"use client";

import Image from "next/image";
import "./../RadmanOpening/RadmanPresence.css";

export default function RadmanPresence() {
  return (
    <div className="radman-presence" aria-hidden="true">
      <div className="radman-presence__halo" />
      <div className="radman-presence__body">
        <Image
          src="/memory/radman-main.JPG"
          alt=""
          fill
          priority
          sizes="(max-width: 900px) 92vw, 52vw"
          className="radman-presence__image"
        />
      </div>
      <div className="radman-presence__ground" />
    </div>
  );
}
