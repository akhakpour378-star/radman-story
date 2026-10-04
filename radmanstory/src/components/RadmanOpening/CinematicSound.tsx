"use client";

import { useEffect, useRef, useState } from "react";

type SoundState = {
  init: () => void;
  onTravel: (progress: number, velocity?: number) => void;
  enabled: boolean;
};

export function useForestSound(): SoundState {
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const windGainRef = useRef<GainNode | null>(null);
  const lastStepRef = useRef(-1);
  const lastBreathRef = useRef(-1);
  const [enabled, setEnabled] = useState(false);
  const startedRef = useRef(false);

  const noise = (duration: number, frequency: number, gainValue: number, type: BiquadFilterType = "bandpass") => {
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (!ctx || !master) return;

    const length = Math.max(1, Math.floor(ctx.sampleRate * duration));
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i += 1) {
      const fadeIn = Math.min(i / Math.max(1, ctx.sampleRate * 0.035), 1);
      const fadeOut = Math.min((length - i) / Math.max(1, ctx.sampleRate * 0.14), 1);
      data[i] = (Math.random() * 2 - 1) * fadeIn * fadeOut;
    }

    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    source.buffer = buffer;
    filter.type = type;
    filter.frequency.value = frequency;
    filter.Q.value = type === "lowpass" ? 0.35 : 0.8;

    gain.gain.setValueAtTime(gainValue, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    source.connect(filter).connect(gain).connect(master);
    source.start();
    source.stop(ctx.currentTime + duration + 0.03);
  };

  const footstep = (strength = 1) => {
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (!ctx || !master) return;

    noise(.16, 105, .22 * strength, "lowpass");

    const thump = ctx.createOscillator();
    const gain = ctx.createGain();
    thump.type = "sine";
    thump.frequency.setValueAtTime(72 + Math.random() * 12, ctx.currentTime);
    thump.frequency.exponentialRampToValueAtTime(38, ctx.currentTime + .13);
    gain.gain.setValueAtTime(.09 * strength, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .15);
    thump.connect(gain).connect(master);
    thump.start();
    thump.stop(ctx.currentTime + .17);

    window.setTimeout(() => noise(.32, 2200, .045 * strength), 55);
  };

  const breath = (deep = false) => {
    noise(deep ? 1.35 : .9, 720, deep ? .09 : .055, "bandpass");
  };

  const init = () => {
    if (typeof window === "undefined") return;

    if (!ctxRef.current) {
      const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      const master = ctx.createGain();
      master.gain.value = .34;
      master.connect(ctx.destination);

      const windGain = ctx.createGain();
      windGain.gain.value = .065;
      windGain.connect(master);

      const length = ctx.sampleRate * 4;
      const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < length; i += 1) {
        const slow = Math.sin(i / ctx.sampleRate * 1.7) * .45;
        data[i] = (Math.random() * 2 - 1) * (.55 + slow * .22);
      }

      const wind = ctx.createBufferSource();
      const windFilter = ctx.createBiquadFilter();
      wind.buffer = buffer;
      wind.loop = true;
      windFilter.type = "lowpass";
      windFilter.frequency.value = 900;
      windFilter.Q.value = .25;
      wind.connect(windFilter).connect(windGain);
      wind.start();

      const low = ctx.createOscillator();
      const lowGain = ctx.createGain();
      low.type = "sine";
      low.frequency.value = 43;
      lowGain.gain.value = .018;
      low.connect(lowGain).connect(master);
      low.start();

      ctxRef.current = ctx;
      masterRef.current = master;
      windGainRef.current = windGain;
    }

    const ctx = ctxRef.current;
    if (ctx.state === "suspended") void ctx.resume();

    if (!startedRef.current) {
      startedRef.current = true;
      setEnabled(true);

      window.setTimeout(() => {
        breath(true);
        footstep(.7);
      }, 260);

      window.setTimeout(() => noise(.75, 3200, .025), 850);
    } else {
      setEnabled(true);
    }
  };

  const onTravel = (progress: number, velocity = 0) => {
    if (!enabled || !ctxRef.current) return;

    const stepCount = Math.floor(progress * 22);
    if (stepCount > lastStepRef.current) {
      lastStepRef.current = stepCount;
      const speed = Math.min(Math.abs(velocity) / 900, 1);
      footstep(.72 + speed * .28);
    }

    const breathCount = Math.floor(progress * 6);
    if (breathCount > lastBreathRef.current) {
      lastBreathRef.current = breathCount;
      breath(breathCount % 2 === 0);
    }

    const wind = windGainRef.current;
    if (wind) wind.gain.value = .055 + Math.min(Math.abs(velocity) / 1800, .035);
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
