"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function MemoryPage() {
    const rootRef = useRef<HTMLElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    const [playing, setPlaying] = useState(false);

    useEffect(() => {
        const root = rootRef.current;

        if (!root) return;

        const context = gsap.context(() => {
            gsap.from("[data-hero]", {
                opacity: 0,
                y: 60,
                duration: 1.6,
                ease: "power3.out",
            });

            gsap.to("[data-photo]", {
                yPercent: -10,
                ease: "none",
                scrollTrigger: {
                    trigger: "[data-photo-wrap]",
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1.5,
                },
            });

            gsap.from("[data-story]", {
                opacity: 0,
                y: 80,
                scrollTrigger: {
                    trigger: "[data-story]",
                    start: "top 80%",
                    end: "top 45%",
                    scrub: 1,
                },
            });
        }, root);

        return () => context.revert();
    }, []);

    const toggleAudio = async () => {
        const audio = audioRef.current;

        if (!audio) return;

        if (playing) {
            audio.pause();
            setPlaying(false);
            return;
        }

        try {
            await audio.play();
            setPlaying(true);
        } catch {
            setPlaying(false);
        }
    };

    return (
        <main
            ref={rootRef}
            className="overflow-hidden bg-[#030303] text-white"
        >
            {/* AUDIO */}

            <audio
                ref={audioRef}
                src="/memory/memory-audio.mp3"
                loop
                preload="metadata"
                onEnded={() => setPlaying(false)}
            />

            {/* AUDIO CONTROL */}

            <button
                data-play
                onClick={toggleAudio}
                aria-label={playing ? "Pause memory" : "Play memory"}
                className="fixed bottom-7 right-7 z-[100] flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-black/40 backdrop-blur-xl transition hover:border-[#d8b77a]/50"
            >
                {playing ? (
                    <span className="flex items-end gap-[3px]">
                        <span className="h-3 w-[2px] animate-pulse bg-[#d8b77a]" />
                        <span className="h-5 w-[2px] animate-pulse bg-[#d8b77a]" />
                        <span className="h-4 w-[2px] animate-pulse bg-[#d8b77a]" />
                    </span>
                ) : (
                    <span className="ml-1 h-0 w-0 border-y-[6px] border-l-[9px] border-y-transparent border-l-[#d8b77a]" />
                )}
            </button>

            {/* HERO */}

            <section className="relative flex min-h-screen items-center justify-center px-6">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(216,183,122,0.10),transparent_55%)]" />

                <div data-hero className="relative z-10 text-center">
                    <p className="text-[9px] uppercase tracking-[0.7em] text-[#d8b77a]/60">
                        A memory
                    </p>

                    <h1 className="mt-8 text-7xl font-light tracking-[-0.07em] sm:text-9xl">
                        Radman
                    </h1>

                    <div className="mx-auto mt-10 h-px w-24 bg-[#d8b77a]/60" />

                    <p className="mt-10 text-[9px] uppercase tracking-[0.6em] text-white/25">
                        14 : 15
                    </p>
                </div>

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[8px] uppercase tracking-[0.55em] text-white/20">
                    Scroll
                </div>
            </section>

            {/* PHOTO */}

            <section
                data-photo-wrap
                className="relative mx-auto h-[90vh] max-w-6xl overflow-hidden"
            >
                <div className="absolute inset-0 overflow-hidden">
                    <Image
                        data-photo
                        src="/memory/radman-main.jpg"
                        alt="Radman"
                        fill
                        priority
                        sizes="100vw"
                        className="object-cover"
                    />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/20" />

                <div className="absolute bottom-10 left-8">
                    <p className="text-[8px] uppercase tracking-[0.55em] text-white/40">
                        A moment kept forever
                    </p>
                </div>
            </section>

            {/* STORY */}

            {/* VIDEO MEMORY */}

            <section className="relative bg-black">
                <div className="relative h-[90vh] w-full overflow-hidden">

                    <video
                        src="/memory/memory-video.mp4"
                        autoPlay
                        muted
                        loop
                        playsInline
                        controls
                        preload="auto"
                        className="absolute inset-0 h-full w-full object-cover"
                    />

                    <div className="absolute inset-0 bg-black/10" />

                

                   
                    <div className="absolute inset-0 flex items-end px-6 pb-16 sm:px-12 sm:pb-24">

                        <div className="max-w-xl">

                            <p className="text-[9px] uppercase tracking-[0.65em] text-[#d8b77a]/70">
                                Moving memories
                            </p>

                            <h2 className="mt-6 text-4xl font-light leading-tight tracking-[-0.04em] sm:text-6xl">
                                Some moments
                                <br />
                                deserve to move.
                            </h2>

                        </div>

                    </div>
                </div>
            </section>

            {/* STORY */}

            <section className="relative min-h-screen bg-[#030303] px-6 py-40">

                <div
                    data-story
                    className="mx-auto max-w-3xl text-center"
                >

                    <p className="text-[9px] uppercase tracking-[0.65em] text-[#d8b77a]/60">
                        The story
                    </p>

                    <h2 className="mt-10 text-4xl font-light leading-tight tracking-[-0.04em] sm:text-6xl">
                        Some moments
                        <br />
                        never leave us.
                    </h2>

                    <div className="mx-auto mt-10 h-px w-16 bg-[#d8b77a]/50" />

                    <p className="mx-auto mt-10 max-w-xl text-sm leading-9 text-white/35 sm:text-base">
                        A photograph can hold a moment.
                        A memory can hold a lifetime.
                        And some memories become part of us forever.
                    </p>

                </div>

            </section>

        </main>
    );
}