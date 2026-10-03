"use client";

import "./FogLayer.css";

export default function FogLayer({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div className={`fog-layer ${className}`}>
      <div className="fog-layer__cloud fog-layer__cloud--one" />
      <div className="fog-layer__cloud fog-layer__cloud--two" />
      <div className="fog-layer__cloud fog-layer__cloud--three" />
      <div className="fog-layer__cloud fog-layer__cloud--four" />
    </div>
  );
}