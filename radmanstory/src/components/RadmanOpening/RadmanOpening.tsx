"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "./RadmanOpening.css";

import ForestDepth from "../RadmanScene/ForestDepth";
import FogField from "../RadmanScene/FogField";
import RadmanPresence from "../RadmanScene/RadmanPresence";

gsap.registerPlugin(ScrollTrigger);

export default function RadmanOpening() {
    const sectionRef = useRef<HTMLElement | null>(null);

    useLayoutEffect(() => {
        const section = sectionRef.current;

        if (!section) return;

        const ctx = gsap.context(() => {
            const intro = gsap.timeline({
                defaults: {
                    ease: "power3.out",
                },
            });

            intro
                .set(".cinematic__black", {
                    opacity: 1,
                })
                .to(".cinematic__black", {
                    opacity: 0,
                    duration: 2.4,
                    ease: "power2.inOut",
                })
                .fromTo(
                    ".cinematic__world",
                    {
                        opacity: 0,
                        scale: 1.045,
                    },
                    {
                        opacity: 1,
                        scale: 1,
                        duration: 3.2,
                        ease: "power2.out",
                    },
                    "-=1.8",
                )
                .fromTo(
                    ".cinematic__radman",
                    {
                        opacity: 0,
                        y: 30,
                    },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 2.2,
                    },
                    "-=2",
                )
                .fromTo(
                    ".cinematic__title",
                    {
                        opacity: 0,
                        y: 35,
                    },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1.5,
                    },
                    "-=1.2",
                )
                .fromTo(
                    ".cinematic__navigation",
                    {
                        opacity: 0,
                    },
                    {
                        opacity: 1,
                        duration: 1,
                    },
                    "-=0.7",
                );

            /*
             * IMPORTANT:
             *
             * We pin the INNER FRAME,
             * not the element that receives transforms.
             */

            ScrollTrigger.create({
                trigger: section,
                start: "top top",
                end: "bottom top",
                pin: ".cinematic__frame",
                scrub: 1.1,
                anticipatePin: 1,
            });

            gsap.to(".forest-depth__back", {
                xPercent: -2,
                yPercent: -2,
                scale: 1.08,

                ease: "none",

                scrollTrigger: {
                    trigger: section,
                    start: "top top",
                    end: "bottom top",
                    scrub: 1.8,
                },
            });

            gsap.to(".forest-depth__middle", {
                xPercent: -5,
                yPercent: -4,
                scale: 1.12,

                ease: "none",

                scrollTrigger: {
                    trigger: section,
                    start: "top top",
                    end: "bottom top",
                    scrub: 1.35,
                },
            });

            gsap.to(".forest-depth__front", {
                xPercent: -9,
                yPercent: -7,
                scale: 1.17,

                ease: "none",

                scrollTrigger: {
                    trigger: section,
                    start: "top top",
                    end: "bottom top",
                    scrub: 0.9,
                },
            });

            gsap.to(".radman-presence", {
                yPercent: -7,
                scale: 1.07,

                ease: "none",

                scrollTrigger: {
                    trigger: section,
                    start: "top top",
                    end: "bottom top",
                    scrub: 1.2,
                },
            });

            gsap.to(".fog-field", {
                yPercent: -10,
                xPercent: 5,

                ease: "none",

                scrollTrigger: {
                    trigger: section,
                    start: "top top",
                    end: "bottom top",
                    scrub: 2,
                },
            });

            gsap.to(".cinematic__background", {
                scale: 1.12,
                yPercent: 5,
                ease: "none",
                scrollTrigger: {
                    trigger: section,
                    start: "top top",
                    end: "bottom top",
                    scrub: 1.2,
                },
            });

            gsap.to(".cinematic__forest-back", {
                xPercent: -2,
                yPercent: -3,
                scale: 1.06,
                ease: "none",
                scrollTrigger: {
                    trigger: section,
                    start: "top top",
                    end: "bottom top",
                    scrub: 1.4,
                },
            });

            gsap.to(".cinematic__forest-front", {
                xPercent: 3,
                yPercent: -7,
                scale: 1.12,
                ease: "none",
                scrollTrigger: {
                    trigger: section,
                    start: "top top",
                    end: "bottom top",
                    scrub: 1.1,
                },
            });

            gsap.to(".cinematic__fog", {
                xPercent: 8,
                yPercent: -4,
                ease: "none",
                scrollTrigger: {
                    trigger: section,
                    start: "top top",
                    end: "bottom top",
                    scrub: 1.8,
                },
            });

            gsap.to(".cinematic__radman", {
                scale: 1.08,
                yPercent: -5,
                ease: "none",
                scrollTrigger: {
                    trigger: section,
                    start: "top top",
                    end: "bottom top",
                    scrub: 1.3,
                },
            });

            gsap.to(".cinematic__title", {
                yPercent: -45,
                opacity: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: section,
                    start: "top top",
                    end: "55% top",
                    scrub: 1,
                },
            });

            gsap.to(".cinematic__navigation", {
                opacity: 0,
                y: -20,
                ease: "none",
                scrollTrigger: {
                    trigger: section,
                    start: "15% top",
                    end: "42% top",
                    scrub: true,
                },
            });

            gsap.to(".cinematic__exit", {
                opacity: 1,
                ease: "none",
                scrollTrigger: {
                    trigger: section,
                    start: "55% top",
                    end: "80% top",
                    scrub: true,
                },
            });
        }, section);

        return () => {
            ctx.revert();
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            className="cinematic"
        >
            <div className="cinematic__frame">

                <div className="cinematic__black" />

                <div className="cinematic__world">

                    <ForestDepth />

                    <FogField />

                    <div className="cinematic__light">
                        <span />
                        <span />
                        <span />
                    </div>

                    <div className="cinematic__particles">
                        {Array.from({ length: 24 }).map((_, index) => (
                            <i key={index} />
                        ))}
                    </div>

                    <RadmanPresence />

                    <div className="cinematic__foreground-fog" />

                    <div className="cinematic__title">
                        ...
                    </div>

                    ...
                </div>

            </div>
        </section>
    );
}