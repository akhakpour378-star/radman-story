"use client";

import dynamic from "next/dynamic";

const RadmanScene = dynamic(
  () => import("@/scenes/RadmanScene/RadmanScene"),
  {
    ssr: false,
    loading: () => null,
  },
);

export default function ImmersiveScene() {
  return (
    <section
      data-immersive-scene
      className="relative min-h-[180svh] overflow-hidden bg-[#020202]"
    >
      {/* 3D WORLD */}

      <div className="sticky top-0 h-[100svh] min-h-[700px] overflow-hidden">
        <RadmanScene />

        {/* Atmospheric layers */}

        <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_50%_45%,transparent_0%,rgba(0,0,0,0.12)_35%,rgba(0,0,0,0.72)_100%)]" />

        <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.55),transparent_25%,transparent_65%,rgba(0,0,0,0.9))]" />

        {/* HERO CONTENT */}

        <div className="pointer-events-none absolute inset-0 z-20 flex items-center">
          <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-16">
            <div className="max-w-xl">

              <p className="mb-7 text-[9px] uppercase tracking-[0.65em] text-[#d8b77a]/70 sm:text-[10px]">
                A story beyond time
              </p>

              <h2 className="text-6xl font-light leading-[0.9] tracking-[-0.06em] text-white sm:text-8xl lg:text-[9rem]">
                Radman
              </h2>

              <div className="mt-9 flex items-center gap-5">
                <span className="h-px w-20 bg-[#d8b77a]/60" />

                <span className="text-[9px] uppercase tracking-[0.45em] text-white/35">
                  Forever
                </span>
              </div>

              <p className="mt-8 max-w-md text-sm leading-8 text-white/40 sm:text-base">
                Some stories are measured in years.
                <br />
                Some are measured in moments.
                <br />
                This one lives beyond time.
              </p>

            </div>
          </div>
        </div>

        {/* SCROLL INDICATOR */}

        <div className="pointer-events-none absolute bottom-10 left-1/2 z-30 -translate-x-1/2">
          <div className="flex flex-col items-center gap-4">

            <span className="text-[8px] uppercase tracking-[0.55em] text-white/25">
              Scroll to enter
            </span>

            <span className="h-12 w-px overflow-hidden bg-white/10">
              <span className="block h-1/2 w-full animate-pulse bg-[#d8b77a]/60" />
            </span>

          </div>
        </div>

        {/* SIDE INDEX */}

        <div className="pointer-events-none absolute right-6 top-1/2 z-30 hidden -translate-y-1/2 lg:block">
          <div className="flex flex-col items-center gap-5">

            <span className="h-16 w-px bg-[#d8b77a]/50" />

            <span className="rotate-90 whitespace-nowrap text-[8px] uppercase tracking-[0.5em] text-white/25">
              Chapter 01
            </span>

          </div>
        </div>
      </div>

      {/* SPACE AFTER HERO */}

      <div className="relative z-20 h-[80svh] bg-[#050505]">
        <div className="mx-auto flex h-full max-w-6xl items-end px-6 pb-24 sm:px-10">
          <div>
            <p className="mb-5 text-[9px] uppercase tracking-[0.6em] text-[#d8b77a]/50">
              The beginning
            </p>

            <p className="max-w-xl text-2xl font-light leading-relaxed tracking-[-0.02em] text-white/70 sm:text-4xl">
              Before there was a story,
              <br />
              there was a moment.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}