"use client";

import "./ForestLeaves.css";

const leaves = Array.from({ length: 9 }, (_, index) => ({
  left: 4 + index * 11,
  top: 18 + ((index * 17) % 55),
  delay: -(index * 1.8),
  duration: 12 + (index % 4) * 3,
  rotation: -20 + index * 13,
}));

export default function ForestLeaves() {
  return (
    <div className="forest-leaves">
      {leaves.map((leaf, index) => (
        <span
          key={index}
          className="forest-leaf"
          style={{
            left: `${leaf.left}%`,
            top: `${leaf.top}%`,
            animationDelay: `${leaf.delay}s`,
            animationDuration: `${leaf.duration}s`,
            transform: `rotate(${leaf.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}