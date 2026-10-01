"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const memories = [
    {
        number: "01",
        title: "The little moments",
        text: "The moments that seemed ordinary became the ones worth remembering.",
        image: "/memories/memory-01.jpg",
        position: "left",
    },
    {
        number: "02",
        title: "Growing together",
        text: "Every day added another frame to a story that was quietly becoming forever.",
        image: "/memories/memory-02.jpg",
        position: "right",
    },
    {
        number: "03",
        title: "Forever",
        text: "Some memories don't belong to the past. They become part of who we are.",
        image: "/memories/memory-03.jpg",
        position: "center",
    },
];

export default function MemoryChapter() {
    const rootRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const root = rootRef.current;

        if (!root) return;

        const context = gsap.context(() => {
            const cards =
                gsap.utils.toArray<HTMLElement>("[data-memory-card]");

            gsap.fromTo(
                root,
                {
                    backgroundColor: "#050505",
                },
                {
                    backgroundColor: "#080706",
                    duration: 2,
                    scrollTrigger: {
                        trigger: root,
                        start: "top 75%",
                        end: "top 25%",
                        scrub: 1,
                    },
                },
            );

            cards.forEach((card) => {
                const image = card.querySelector<HTMLElement>(
                    "[data-memory-image]",
                );

                const imageInner = card.querySelector<HTMLElement>(
                    "[data-memory-image-inner]",
                );

                gsap.to(imageInner, {
                    yPercent: -8,
                    ease: "none",
                    scrollTrigger: {
                        trigger: card,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1.5,
                    },
                });

                const content = card.querySelector<HTMLElement>(
                    "[data-memory-content]",
                );

                const number = card.querySelector<HTMLElement>(
                    "[data-memory-number]",
                );

                gsap.fromTo(
                    image,
                    {
                        opacity: 0,
                        scale: 0.82,
                        y: 80,
                    },
                    {
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: card,
                            start: "top 85%",
                            end: "top 30%",
                            scrub: 1.2,
                        },
                    },
                );

                gsap.fromTo(
                    imageInner,
                    {
                        scale: 1.18,
                    },
                    {
                        scale: 1,
                        ease: "none",
                        scrollTrigger: {
                            trigger: card,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: 1.5,
                        },
                    },
                );

                gsap.fromTo(
                    content,
                    {
                        opacity: 0,
                        x: 70,
                    },
                    {
                        opacity: 1,
                        x: 0,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: card,
                            start: "top 75%",
                            end: "top 40%",
                            scrub: 1,
                        },
                    },
                );

                gsap.fromTo(
                    number,
                    {
                        opacity: 0,
                        y: 20,
                    },
                    {
                        opacity: 1,
                        y: 0,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: card,
                            start: "top 80%",
                            end: "top 50%",
                            scrub: 1,
                        },
                    },
                );
            });
        }, root);

        return () => context.revert();
    }, []);

    return (
        <section
            ref={rootRef}
            className="relative overflow-hidden bg-[#050505] text-white"
        >
            {/* Ambient glow */}

            <div className="pointer-events-none absolute left-1/2 top-[30%] h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(216,183,122,0.055),transparent_68%)] blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-6 py-32 sm:px-10 sm:py-48 lg:px-16">

                {/* HEADER */}

                <header className="mb-44 max-w-3xl">
                    <p className="mb-7 text-[9px] uppercase tracking-[0.65em] text-[#d8b77a]/60">
                        Chapter 02
                    </p>

                    <h2 className="text-6xl font-light leading-[0.9] tracking-[-0.06em] sm:text-8xl lg:text-[9rem]">
                        Memories
                    </h2>

                    <div className="mt-10 h-px w-24 bg-[#d8b77a]/50" />

                    <p className="mt-9 max-w-lg text-sm leading-8 text-white/35 sm:text-base">
                        A collection of moments that became part of forever.
                    </p>
                </header>

                {/* MEMORY CARDS */}

                <div className="space-y-64 sm:space-y-80">
                    {memories.map((memory) => (
                        <article
                            key={memory.number}
                            data-memory-card
                            className="relative grid min-h-[80vh] items-center gap-12 lg:grid-cols-2 lg:gap-24"
                        >
                            {/* IMAGE */}

                            <div
                                data-memory-image
                                className={`relative aspect-[4/5] w-full overflow-hidden bg-[#101010] ${memory.position === "right"
                                    ? "lg:order-2"
                                    : "lg:order-1"
                                    }`}
                            >
                                <div
                                    data-memory-image-inner
                                    className="absolute inset-0"
                                >
                                    <Image
                                        src={memory.image}
                                        alt={`Radman memory ${memory.number}`}
                                        fill
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                        className="object-cover"
                                        priority={memory.number === "01"}
                                    />
                                </div>

                                {/* image overlay */}

                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />

                                <div className="absolute bottom-5 left-5 text-[8px] uppercase tracking-[0.45em] text-white/50">
                                    Memory {memory.number}
                                </div>
                            </div>

                            {/* CONTENT */}

                            <div
                                data-memory-content
                                className={`${memory.position === "right"
                                    ? "lg:order-1"
                                    : "lg:order-2"
                                    }`}
                            >
                                <span
                                    data-memory-number
                                    className="text-[9px] uppercase tracking-[0.6em] text-[#d8b77a]/60"
                                >
                                    {memory.number}
                                </span>

                                <h3 className="mt-7 max-w-xl text-4xl font-light leading-[1.05] tracking-[-0.045em] sm:text-6xl">
                                    {memory.title}
                                </h3>

                                <div className="my-8 h-px w-14 bg-white/15" />

                                <p className="max-w-md text-sm leading-8 text-white/35 sm:text-base">
                                    {memory.text}
                                </p>

                                <div className="mt-10 flex items-center gap-4">
                                    <span className="h-px w-10 bg-[#d8b77a]/40" />

                                    <span className="text-[8px] uppercase tracking-[0.45em] text-white/25">
                                        Remember this moment
                                    </span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* END */}

                <div className="mt-48 border-t border-white/10 pt-10">
                    <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                        <p className="text-[9px] uppercase tracking-[0.55em] text-white/25">
                            The story continues
                        </p>

                        <span className="text-[9px] uppercase tracking-[0.45em] text-[#d8b77a]/40">
                            02 / 05
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}