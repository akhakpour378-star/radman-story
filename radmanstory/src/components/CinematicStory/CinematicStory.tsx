"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./CinematicStory.css";

gsap.registerPlugin(ScrollTrigger);

type Chapter = {
  index: string;
  period: string;
  title: string;
  text: string;
  image: string;
  align: "left" | "right";
};

const chapters: Chapter[] = [
  { index: "01", period: "THE BEGINNING", title: "روزهایی که همه‌چیز تازه بود.", text: "اولین قاب‌ها؛ اولین نگاه‌ها، اولین خنده‌ها و لحظه‌هایی که آرام‌آرام یک زندگی را ساختند.", image: "/memory/radman-main.JPG", align: "left" },
  { index: "02", period: "FIRST LAUGH", title: "اولین خنده.", text: "یک خنده کوتاه می‌تواند برای همیشه در حافظه بماند.", image: "/memories/memory-01.JPG", align: "right" },
  { index: "03", period: "FIRST STEPS", title: "اولین قدم‌ها.", text: "هر قدم کوچک، شروع یک جهان بزرگ‌تر بود.", image: "/memories/memory-02.JPG", align: "left" },
  { index: "04", period: "A NEW WORLD", title: "اولین روزهای مهد.", text: "بیرون از خانه، دنیایی تازه شروع شد؛ آدم‌های تازه، تجربه‌های تازه و خاطراتی که بیشتر شدند.", image: "/memories/memory-03.JPG", align: "right" },
  { index: "05", period: "GROWING", title: "و بعد، بزرگ‌تر شدی.", text: "این داستان قرار نیست با چند عکس تمام شود. هر سال، یک قاب تازه به آرشیو زندگی تو اضافه می‌کند.", image: "/memory/radman-second.JPG", align: "left" },
];

function Chapter({ chapter }: { chapter: Chapter }) {
  return (
    <article className={"life-chapter life-chapter--" + chapter.align}>
      <div className="life-chapter__ghost">{chapter.index}</div>
      <div className="life-chapter__copy">
        <span>{chapter.period}</span>
        <h3>{chapter.title}</h3>
        <p>{chapter.text}</p>
      </div>
      <figure className="life-chapter__media">
        <div className="life-chapter__frame">
          <img src={chapter.image} alt={chapter.title} loading="lazy" />
          <i />
        </div>
        <figcaption><b>{chapter.index}</b><span>RADMAN ARCHIVE</span></figcaption>
      </figure>
    </article>
  );
}

export default function CinematicStory() {
  const root = useRef<HTMLElement>(null);
  const [soundOn, setSoundOn] = useState(false);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((node) => {
        gsap.fromTo(node, { opacity: 0, y: 70 }, {
          opacity: 1, y: 0, duration: 1.15, ease: "power3.out",
          scrollTrigger: { trigger: node, start: "top 82%", end: "top 48%", scrub: 1 },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((node) => {
        const amount = Number(node.dataset.parallax || 12);
        gsap.to(node, {
          yPercent: amount,
          ease: "none",
          scrollTrigger: { trigger: node.closest("section") || node, start: "top bottom", end: "bottom top", scrub: 1.4 },
        });
      });

      gsap.utils.toArray<HTMLElement>(".life-chapter").forEach((chapter) => {
        const media = chapter.querySelector(".life-chapter__media");
        const ghost = chapter.querySelector(".life-chapter__ghost");
        if (media) gsap.fromTo(media, { y: 80 }, { y: -80, ease: "none", scrollTrigger: { trigger: chapter, start: "top bottom", end: "bottom top", scrub: 1.3 } });
        if (ghost) gsap.fromTo(ghost, { x: -30, opacity: 0 }, { x: 0, opacity: 1, scrollTrigger: { trigger: chapter, start: "top 80%", end: "top 48%", scrub: 1 } });
      });

      gsap.to(".archive__progress i", {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: ".archive", start: "top top", end: "bottom bottom", scrub: 0.5 },
      });

      gsap.to(".hero-archive__image", {
        scale: 1.08,
        yPercent: 9,
        ease: "none",
        scrollTrigger: { trigger: ".hero-archive", start: "top top", end: "bottom top", scrub: 1.5 },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={root} className="archive-site">
      <header className="archive-nav">
  <a href="#top" className="archive-nav__brand">R.</a>
  <nav><a href="#bio">BIOGRAPHY</a><a href="#archive">ARCHIVE</a><a href="#film">FILM</a></nav>
  <a href="#archive" className="archive-nav__index">01—05</a>
</header>

      <section id="top" className="archive-intro">
        <div className="archive-intro__noise" />
        <div className="archive-intro__grid" />
        <div className="archive-intro__content">
          <span className="archive-kicker">PRIVATE ARCHIVE · 01 / 01</span>
          <h1>you became<br /><em>the reason</em><br />my story never ended.</h1>
          <p>Forever, my son.</p>
        </div>
        <div className="archive-intro__scroll">SCROLL TO REMEMBER <i /></div>
      </section>

      <section className="hero-archive">
        <div className="hero-archive__image"><img src="/memory/radman-and-me.png" alt="Radman and his father" /></div>
        <div className="hero-archive__shade" />
        <div className="hero-archive__copy" data-reveal>
          <span>RADMAN · A VISUAL BIOGRAPHY</span>
          <h2>A life.<br /><em>Not a moment.</em></h2>
          <p>یک آرشیو زنده از روزهایی که آمدند، گذشتند و هنوز در ما ادامه دارند.</p>
        </div>
        <div className="hero-archive__coordinates">35°41′N / 51°23′E<br />MEMORY / MOTION / TIME</div>
      </section>

      <section id="bio" className="manifesto">
  <div className="manifesto__year">2025—</div>
  <div>
    <span className="archive-kicker">A BIOGRAPHY IN MOTION</span>
    <h2>Radman is<br/><em>still becoming.</em></h2>
    <p>یک زندگی را نمی‌شود در یک قاب خلاصه کرد. اینجا روایت رادمان است؛ از اولین روز تا تمام روزهایی که هنوز نرسیده‌اند.</p>
  </div>
</section>

      <section id="archive" className="archive">
        <div className="archive__header" data-reveal>
          <div><span className="archive-kicker">THE LIFE ARCHIVE</span><h2>Radman,<br /><em>in time.</em></h2></div>
          <p>هر فصل با تصویر، فیلم و چند خط از همان روزها ثبت می‌شود.</p>
        </div>
        <div className="archive__progress"><i /></div>
        <div className="archive__chapters">
          {chapters.map((chapter) => <Chapter key={chapter.index} chapter={chapter} />)}
        </div>
      </section>

      <section id="film" className="film-room" data-reveal>
        <div className="film-room__copy">
          <span className="archive-kicker">MOVING MEMORY</span>
          <h2>بعضی خاطره‌ها<br /><em>باید حرکت کنند.</em></h2>
          <p>یک لحظه را متوقف نکن. بگذار دوباره زنده شود.</p>
          <button type="button" onClick={() => setSoundOn((v) => !v)}>
            <i className={soundOn ? "is-on" : ""} /> {soundOn ? "SOUND ON" : "AMBIENT SOUND"}
          </button>
        </div>
        <div className="film-room__video">
          <video src="/memory/memory-video.mp4" controls playsInline preload="metadata" />
          <div className="film-room__caption"><span>RADMAN / MOVIE 01</span><b>PLAY MEMORY</b></div>
        </div>
      </section>

      <section className="contact-sheet" id="gallery" data-reveal>
        <div className="contact-sheet__heading"><span className="archive-kicker">CONTACT SHEET</span><h2>More moments.<br /><em>More years.</em></h2></div>
        <div className="contact-sheet__grid">
          {[
            ["/memory/radman-main.JPG", "01"], ["/memories/memory-01.JPG", "02"],
            ["/memories/memory-02.JPG", "03"], ["/memory/radman-second.JPG", "04"],
            ["/memories/memory-03.JPG", "05"], ["/memory/radman-and-me.png", "06"],
          ].map(([src, no]) => (
            <figure key={no}><img src={src} alt={"Radman archive " + no} loading="lazy" /><figcaption>{no} / RADMAN</figcaption></figure>
          ))}
        </div>
      </section>

      <section className="future" data-reveal>
        <div className="future__number">05</div>
        <div className="future__copy">
          <span className="archive-kicker">THE STORY CONTINUES</span>
          <h2>این آرشیو<br /><em>تمام نمی‌شود.</em></h2>
          <p>فصل‌های بعدی با بزرگ‌تر شدن رادمان، تصاویر تازه، فیلم‌های تازه و نوشته‌های تازه به اینجا اضافه می‌شوند.</p>
        </div>
      </section>

      <footer className="archive-footer">
        <div><b>RADMAN.</b><span>A LIFE IN FRAMES</span></div>
        <p>Made to remember. Made to grow.</p>
        <small>14 : 15 · FOREVER, MY SON.</small>
      </footer>
    </main>
  );
}
