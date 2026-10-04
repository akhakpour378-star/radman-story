"use client";

import { useEffect, useRef, useState } from "react";

type SoundState = {
  init: () => void;
  onTravel: (progress: number, velocity?: number) => void;
  enabled: boolean;
};

function createNoiseBuffer(ctx: AudioContext, seconds: number) {
  const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * seconds), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

export function useForestSound(): SoundState {
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const windRef = useRef<GainNode | null>(null);
  const startedRef = useRef(false);
  const lastStepRef = useRef(-1);
  const lastBreathRef = useRef(-1);
  const [enabled, setEnabled] = useState(false);

  const burst = (
    duration: number,
    frequency: number,
    volume: number,
    filterType: BiquadFilterType = "bandpass",
  ) => {
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (!ctx || !master) return;

    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    source.buffer = createNoiseBuffer(ctx, duration);
    filter.type = filterType;
    filter.frequency.value = frequency;
    filter.Q.value = filterType === "lowpass" ? 0.35 : 1.1;

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + Math.min(.03, duration * .2));
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    source.connect(filter).connect(gain).connect(master);
    source.start();
    source.stop(ctx.currentTime + duration + .03);
  };

  const step = (strength = 1) => {
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (!ctx || !master) return;

    burst(.18, 125, .34 * strength, "lowpass");

    const impact = ctx.createOscillator();
    const gain = ctx.createGain();
    impact.type = "sine";
    impact.frequency.setValueAtTime(74, ctx.currentTime);
    impact.frequency.exponentialRampToValueAtTime(36, ctx.currentTime + .18);
    gain.gain.setValueAtTime(.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(.16 * strength, ctx.currentTime + .012);
    gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .19);
    impact.connect(gain).connect(master);
    impact.start();
    impact.stop(ctx.currentTime + .21);

    window.setTimeout(() => burst(.35, 2300, .09 * strength), 45);
  };

  const breath = (deep = false) => {
    burst(deep ? 1.45 : 1.0, 620, deep ? .16 : .095);
  };

  const init = () => {
    if (typeof window === "undefined") return;

    if (!ctxRef.current) {
      const AudioCtor =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

      if (!AudioCtor) return;

      const ctx = new AudioCtor();
      const master = ctx.createGain();
      master.gain.value = .72;
      master.connect(ctx.destination);

      const windGain = ctx.createGain();
      windGain.gain.value = .18;
      windGain.connect(master);

      const wind = ctx.createBufferSource();
      const windFilter = ctx.createBiquadFilter();
      wind.buffer = createNoiseBuffer(ctx, 5);
      wind.loop = true;
      windFilter.type = "lowpass";
      windFilter.frequency.value = 1200;
      windFilter.Q.value = .22;
      wind.connect(windFilter).connect(windGain);
      wind.start();

      const drone = ctx.createOscillator();
      const droneGain = ctx.createGain();
      drone.type = "sine";
      drone.frequency.value = 48;
      droneGain.gain.value = .035;
      drone.connect(droneGain).connect(master);
      drone.start();

      ctxRef.current = ctx;
      masterRef.current = master;
      windRef.current = windGain;
    }

    const ctx = ctxRef.current;
    if (ctx.state === "suspended") void ctx.resume();

    if (!startedRef.current) {
      startedRef.current = true;
      setEnabled(true);

      window.setTimeout(() => breath(true), 180);
      window.setTimeout(() => step(.9), 520);
      window.setTimeout(() => burst(.7, 2800, .055), 1050);
    } else {
      setEnabled(true);
    }
  };

  const onTravel = (progress: number, velocity = 0) => {
    if (!ctxRef.current) return;

    const stepIndex = Math.floor(progress * 18);
    if (stepIndex > lastStepRef.current) {
      lastStepRef.current = stepIndex;
      const speed = Math.min(Math.abs(velocity) / 900, 1);
      step(.85 + speed * .3);
    }

    const breathIndex = Math.floor(progress * 5);
    if (breathIndex > lastBreathRef.current) {
      lastBreathRef.current = breathIndex;
      breath(breathIndex % 2 === 0);
    }

    if (windRef.current) {
      windRef.current.gain.value = .13 + Math.min(Math.abs(velocity) / 2000, .08);
    }
  };

  useEffect(() => {
    return () => {
      if (ctxRef.current) void ctxRef.current.close();
    };
  }, []);

  return { init, onTravel, enabled };
}

export function ForestSoundButton({
  enabled,
  onClick,
}: {
  enabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="opening__sound"
      onClick={onClick}
      aria-label={enabled ? "Sound on" : "Enter memory and enable sound"}
    >
      <span className={enabled ? "opening__sound-dot is-on" : "opening__sound-dot"} />
      <span>{enabled ? "SOUND ON" : "ENTER WITH SOUND"}</span>
    </button>
  );
}
