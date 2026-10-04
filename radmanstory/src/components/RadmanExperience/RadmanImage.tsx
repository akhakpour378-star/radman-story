"use client";

import { useMemo, useState } from "react";

const candidates = [
  "/memory/radman.jpeg","/memory/radman.jpg","/memory/radman.png",
  "/memory/radman-01.jpeg","/memory/radman-01.jpg","/memory/radman-01.png",
  "/memory/radman-1.jpeg","/memory/radman-1.jpg","/memory/radman-1.png",
  "/memory/radman1.jpeg","/memory/radman1.jpg","/memory/radman1.png",
  "/memory/radman-02.jpeg","/memory/radman-02.jpg","/memory/radman-02.png",
  "/memory/radman-2.jpeg","/memory/radman-2.jpg","/memory/radman-2.png",
  "/memory/radman2.jpeg","/memory/radman2.jpg","/memory/radman2.png",
  "/memory/radman-03.jpeg","/memory/radman-03.jpg","/memory/radman-03.png",
  "/memory/radman-and-me.png",
];

export default function RadmanImage({ index = 0, alt = "Radman memory", className = "" }:{
  index?:number; alt?:string; className?:string;
}) {
  const source = useMemo(() => candidates[Math.min(index, candidates.length - 1)] ?? candidates[candidates.length - 1], [index]);
  const [src, setSrc] = useState(source);
  return <img className={className} src={src} alt={alt} loading={index ? "lazy" : "eager"} onError={() => setSrc("/memory/radman-and-me.png")} />;
}
