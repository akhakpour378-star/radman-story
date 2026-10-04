"use client";

import { useEffect, useRef, useState } from "react";

export function useForestSound() {
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const lastStepRef = useRef(-1);
  const [enabled, setEnabled] = useState(false);

  const init = () => {
    if (typeof window === "undefined") return;
    if (!ctxRef.current) {
      const ctx = new AudioContext();
      const master = ctx.createGain();
      master.gain.value = 0.12;
      master.connect(ctx.destination);
      ctxRef.current = ctx;
      masterRef.current = master;
    }
    const ctx = ctxRef.current;
    if (ctx.state === "suspended") void ctx.resume();
    setEnabled(true);
  };

  const noise = (duration: number, frequency: number, gainValue: number) => {
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (!ctx || !master) return;
    const length = Math.max(1, Math.floor(ctx.sampleRate * duration));
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      const fade = Math.min(i / 1800, (length - i) / 1800, 1);
      data[i] = (Math.random() * 2 - 1) * fade;
    }
    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    source.buffer = buffer;
    filter.type = "bandpass";
    filter.frequency.value = frequency;
    filter.Q.value = 0.55;
    gain.gain.setValueAtTime(gainValue, ctx.currentTime);
    source.connect(filter).connect(gain).connect(master);
    source.start();
  };

  const footstep = () => {
    noise(0.075, 115, 0.85);
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (!ctx || !master) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(74 + Math.random() * 18, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(42, ctx.currentTime + 0.09);
    gain.gain.setValueAtTime(0.035, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    osc.connect(gain).connect(master);
    osc.start();
    osc.stop(ctx.currentTime + 0.11);
  };

  const breath = (deep = false) => {
    noise(deep ? 1.2 : 0.8, 900, deep ? 0.16 : 0.1);
  };

  const onTravel = (progress: number) => {
    if (!enabled) return;
    const steps = Math.floor(progress * 15);
    if (steps > lastStepRef.current) {
      lastStepRef.current = steps;
      footstep();
      if (steps % 4 === 0) breath(steps % 8 === 0);
    }
  };

  useEffect(() => () => {
    if (ctxRef.current) void ctxRef.current.close();
  }, []);

  return { init, onTravel, enabled };
}

export function ForestSoundButton({ enabled, onClick }: { enabled: boolean; onClick: () => void }) {
  return (
    <button type="button" className="opening__sound" onClick={onClick} aria-label={enabled ? "Sound on" : "Enter memory and enable sound"}>
      <span className={enabled ? "opening__sound-dot is-on" : "opening__sound-dot"} />
      <span>{enabled ? "SOUND ON" : "ENTER WITH SOUND"}</span>
    </button>
  );
}
