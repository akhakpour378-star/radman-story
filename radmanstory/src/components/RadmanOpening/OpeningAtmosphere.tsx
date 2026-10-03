"use client";

import FogLayer from "./FogLayer";
import LightRays from "./LightRays";
import FloatingParticles from "./FloatingParticles";
import ForestLeaves from "./ForestLeaves";

import "./OpeningAtmosphere.css";

export default function OpeningAtmosphere() {
  return (
    <div className="opening-atmosphere">
      <FogLayer />
      <LightRays />
      <FloatingParticles />
      <ForestLeaves />
    </div>
  );
}