"use client";

import { useMemo } from "react";

import "./FloatingParticles.css";

type Particle = {
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
};

export default function FloatingParticles() {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: 34 }, (_, index) => ({
      left: (index * 37.17) % 100,
      top: (index * 61.31) % 100,
      size: 1 + (index % 3) * 0.6,
      delay: -(index % 11) * 0.8,
      duration: 8 + (index % 7) * 2,
      opacity: 0.12 + (index % 5) * 0.045,
    }));
  }, []);

  return (
    <div className="opening-particles">
      {particles.map((particle, index) => (
        <span
          key={index}
          className="opening-particle"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
    </div>
  );
}