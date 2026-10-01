"use client";

import gsap from "gsap";

export function playIntroAnimation(root: HTMLElement) {
  const eyebrow = root.querySelector<HTMLElement>("[data-intro-eyebrow]");
  const title = root.querySelector<HTMLElement>("[data-intro-title]");
  const line = root.querySelector<HTMLElement>("[data-intro-line]");
  const subtitle = root.querySelector<HTMLElement>("[data-intro-subtitle]");
  const glow = root.querySelector<HTMLElement>("[data-intro-glow]");

  if (!eyebrow || !title || !line || !subtitle || !glow) {
    return;
  }

  const context = gsap.context(() => {
    gsap.set(eyebrow, {
      opacity: 0,
      y: 18,
    });

    gsap.set(title, {
      opacity: 0,
      y: 35,
      scale: 0.96,
    });

    gsap.set(line, {
      scaleX: 0,
      transformOrigin: "center center",
    });

    gsap.set(subtitle, {
      opacity: 0,
      y: 18,
    });

    gsap.set(glow, {
      opacity: 0,
      scale: 0.7,
    });

    const timeline = gsap.timeline({
      defaults: {
        ease: "power3.out",
      },
    });

    timeline
      .to(glow, {
        opacity: 1,
        scale: 1,
        duration: 2,
        ease: "power2.out",
      })
      .to(
        eyebrow,
        {
          opacity: 1,
          y: 0,
          duration: 1,
        },
        "-=1.2",
      )
      .to(
        title,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.4,
          ease: "power4.out",
        },
        "-=0.6",
      )
      .to(
        line,
        {
          scaleX: 1,
          duration: 1.2,
          ease: "power2.inOut",
        },
        "-=0.7",
      )
      .to(
        subtitle,
        {
          opacity: 1,
          y: 0,
          duration: 1,
        },
        "-=0.5",
      );

    return () => {
      timeline.kill();
    };
  }, root);

  return () => {
    context.revert();
  };
}