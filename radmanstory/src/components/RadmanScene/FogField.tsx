"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import "./RadmanScene.css";

export default function FogField() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;

    if (!root) return;

    const layers = Array.from(
      root.querySelectorAll<HTMLElement>("[data-fog-layer]")
    );

    const animations = layers.map((layer, index) => {
      return gsap.to(layer, {
        xPercent: index % 2 === 0 ? 8 : -7,
        yPercent: index % 2 === 0 ? -2 : 3,
        duration: 18 + index * 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });

    return () => {
      animations.forEach((animation) => animation.kill());
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="fog-field"
      aria-hidden="true"
    >
      <div
        data-fog-layer
        className="fog-field__layer fog-field__layer--one"
      />

      <div
        data-fog-layer
        className="fog-field__layer fog-field__layer--two"
      />

      <div
        data-fog-layer
        className="fog-field__layer fog-field__layer--three"
      />

      <div className="fog-field__haze" />
    </div>
  );
}