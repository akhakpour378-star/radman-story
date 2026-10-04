"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./CinematicStory.css";

gsap.registerPlugin(ScrollTrigger);

const chapters = [
  { no:"01", year:"THE BEGINNING", title:"The day your story began.", copy:"A small beginning. A new name. A life that would quietly change everything around it.", image:"/memory/radman-main.JPG" },
  { no:"02", year:"FIRST LAUGH", title:"Then came the laughter.", copy:"Some sounds disappear. Some remain in the room forever. This is one of those memories.", image:"/memories/memory-01.JPG" },
  { no:"03", year:"FIRST STEPS", title:"Every first step mattered.", copy:"The world became bigger, one uncertain step at a time.", image:"/memories/memory-02.JPG" },
  { no:"04", year:"A NEW WORLD", title:"Outside, everything opened.", copy:"New places. New faces. New little discoveries that became part of a much bigger story.", image:"/memories/memory-03.JPG" },
  { no:"05", year:"STILL GROWING", title:"The story is not finished.", copy:"This archive is intentionally unfinished. The next chapter belongs to the years ahead.", image:"/memory/radman-second.JPG" },
];

function Chapter({ item, index }: { item: typeof chapters[number]; index: number }) {
  return (
    <article className="bio-chapter" data-chapter>
      <div className="bio-chapter__meta">
        <span>{item.no}</span><i /><small>{item.year}</small>
      </div>
      <div className="bio-chapter__visual">
        <div className="bio-chapter__image" data-parallax="-7">
          <img src={item.image} alt={item.title} loading={index ? "lazy" : "eager"} />
          <span className="bio-chapter__shine" />
        </div>
        <div className="bio-chapter__image-index">RADMAN / {item.no}</div>
      </div>
      <div className="bio-chapter__copy" data-reveal>
        <span className="bio-chapter__eyebrow">{item.year}</span>
        <h3>{item.title}</h3>
        <p>{item.copy}</p>
        <span className="bio-chapter__rule" />
      </div>
    </article>
  );
}

export default function CinematicStory() {
  const root = useRef<HTMLElement>(null);
  const [soundHint, setSoundHint] = useState(false);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    const move = (event: MouseEvent) => {
      el.style.setProperty("--mx", event.clientX + "px");
      el.style.setProperty("--my", event.clientY + "px");
    };
    window.addEventListener("pointermove", move, { passive: true });

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((node) => {
        gsap.fromTo(node, { y: 70, opacity: 0 }, {
          y: 0, opacity: 1, duration: 1.15, ease: "power3.out",
          scrollTrigger: { trigger: node, start: "top 86%", end: "top 60%", scrub: 1 },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((node) => {
        gsap.to(node, {
          yPercent: Number(node.dataset.parallax || -7),
          ease: "none",
          scrollTrigger: { trigger: node.closest("[data-chapter]") || node, start: "top bottom", end: "bottom top", scrub: 1.25 },
        });
      });

      gsap.to(".bio-hero__media", {
        scale: 1.13, yPercent: 8, ease: "none",
        scrollTrigger: { trigger: ".bio-hero", start: "top top", end: "bottom top", scrub: 1.4 },
      });

      gsap.to(".bio-hero__title", {
        yPercent: -25, opacity: .25, ease: "none",
        scrollTrigger: { trigger: ".bio-hero", start: "top top", end: "75% top", scrub: 1 },
      });

      gsap.to(".bio-opening__content", {
        yPercent: -25, opacity: .1, ease: "none",
        scrollTrigger: { trigger: ".bio-opening", start: "top top", end: "bottom top", scrub: 1 },
      });

      gsap.utils.toArray<HTMLElement>("[data-line]").forEach((line) => {
        gsap.fromTo(line, { scaleX: 0 }, {
          scaleX: 1, transformOrigin: "left center", ease: "none",
          scrollTrigger: { trigger: line, start: "top 90%", end: "top 60%", scrub: 1 },
        });
      });

      gsap.to(".bio-index__bar i", {
        scaleY: 1, transformOrigin: "top",
        scrollTrigger: { trigger: ".bio-index", start: "top top", end: "bottom bottom", scrub: .5 },
      });
    }, el);

    return () => {
      window.removeEventListener("pointermove", move);
      ctx.revert();
    };
  }, []);

  return (
    <main ref={root} className="bio-site">
      <div className="bio-site__spotlight" aria-hidden="true" />
      <div className="bio-progress"><i /></div>

      <header className="bio-nav">
        <a className="bio-nav__brand" href="#top" aria-label="Radman">R<span>.</span></a>
        <nav><a href="#story">STORY</a><a href="#archive">ARCHIVE</a><a href="#film">FILM</a><a href="#gallery">GALLERY</a></nav>
        <button className="bio-nav__sound" type="button" onClick={() => setSoundHint(v => !v)}>
          <span className={soundHint ? "is-on" : ""} /> AMBIENCE
        </button>
      </header>

      <section id="top" className="bio-opening">
        <div className="bio-opening__grain" />
        <div className="bio-opening__rings" aria-hidden="true"><i/><i/><i/></div>
        <div className="bio-opening__content">
          <span className="micro">A PRIVATE VISUAL BIOGRAPHY / 01</span>
          <h1>You became<br/><i>the reason</i><br/>my story never ended.</h1>
          <div className="bio-opening__bottom"><span>RADMAN / 2025—</span><span>SCROLL TO BEGIN ↓</span></div>
        </div>
      </section>

      <section className="bio-hero" id="story">
        <div className="bio-hero__media"><img src="/memory/radman-and-me.png" alt="Radman and his father" /></div>
        <div className="bio-hero__grid" /><div className="bio-hero__orbs"><i/><i/><i/></div><div className="bio-hero__veil" />
        <div className="bio-hero__title" data-reveal>
          <span className="micro">RADMAN — A VISUAL BIOGRAPHY</span>
          <h2>A life<br/><i>in motion.</i></h2>
          <p>از اولین روزها تا تمام روزهایی که هنوز نرسیده‌اند.</p>
        </div>
        <div className="bio-hero__cursor">SCROLL<br/>TO ENTER</div>
        <div className="bio-hero__stamp">MEMORY / MOTION / TIME<br/>14 : 15</div>
      </section>

      <section className="bio-intro">
        <div className="bio-intro__orb" />
        <div className="bio-intro__num">01</div>
        <div className="bio-intro__text" data-reveal>
          <span className="micro">THE IDEA / 02</span>
          <h2>A website that<br/><i>grows with him.</i></h2>
          <p>این یک گالری ساده نیست؛ یک آرشیو زنده است. عکس، فیلم، صدا و نوشته در کنار هم یک روایت قابل ادامه می‌سازند.</p>
          <span className="bio-section-line" data-line />
        </div>
      </section>

      <section className="bio-index" id="archive">
        <div className="bio-index__bar"><i /></div>
        <div className="bio-index__header" data-reveal>
          <div><span className="micro">THE ARCHIVE / 03</span><h2>Five chapters.<br/><i>One life.</i></h2></div>
          <p>هر فصل یک قاب از مسیر زندگی رادمان است؛ نه یک صفحه‌ی جدا، بلکه بخشی از یک روایت پیوسته.</p>
        </div>
        <div className="bio-chapters">{chapters.map((item, index) => <Chapter key={item.no} item={item} index={index} />)}</div>
      </section>

      <section className="bio-film" id="film">
        <div className="bio-film__halo" />
        <div className="bio-film__copy" data-reveal>
          <span className="micro">MOVING MEMORY / 04</span>
          <h2>Some memories<br/><i>need motion.</i></h2>
          <p>تصویر را متوقف نکن. بگذار دوباره زنده شود.</p>
        </div>
        <div className="bio-film__screen" data-reveal>
          <div className="bio-film__frame"><video src="/memory/memory-video.mp4" controls playsInline preload="metadata" /></div>
          <div className="bio-film__caption"><span>RADMAN / FILM 01</span><span>PLAY MEMORY</span></div>
        </div>
      </section>

      <section className="bio-gallery" id="gallery">
        <div className="bio-gallery__heading" data-reveal><span className="micro">CONTACT SHEET / 05</span><h2>More frames.<br/><i>More years.</i></h2></div>
        <div className="bio-gallery__grid">
          {["/memory/radman-main.JPG","/memories/memory-01.JPG","/memories/memory-02.JPG","/memories/memory-03.JPG","/memory/radman-second.JPG","/memory/radman-and-me.png"].map((src, i) =>
            <figure key={src}><div><img src={src} alt={"Radman memory " + (i + 1)} loading="lazy"/></div><figcaption>0{i + 1} / RADMAN</figcaption></figure>
          )}
        </div>
      </section>

      <section className="bio-future">
        <div className="bio-future__aurora" />
        <span className="bio-future__ghost">06</span>
        <div data-reveal><span className="micro">TO BE CONTINUED / 06</span><h2>The next chapter<br/><i>hasn't happened yet.</i></h2><p>این صفحه پایان ندارد. سال‌های بعد، عکس‌های بعد و خاطرات بعدی به همین داستان اضافه می‌شوند.</p></div>
      </section>

      <footer className="bio-footer"><b>RADMAN<span>.</span></b><span>A LIFE IN FRAMES</span><small>FOREVER, MY SON.</small></footer>
    </main>
  );
}
