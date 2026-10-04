"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./CinematicStory.css";

gsap.registerPlugin(ScrollTrigger);

const chapters = [
  { no:"01", year:"THE BEGINNING", title:"The day your story began.", copy:"A small beginning. A new name. A life that would quietly change everything around it.", image:"/memory/radman-main.JPG" },
  { no:"02", year:"FIRST LAUGH", title:"Then came the laughter.", copy:"Some sounds last longer than recordings. The first laugh became one of those memories.", image:"/memories/memory-01.JPG" },
  { no:"03", year:"FIRST STEPS", title:"Every first step mattered.", copy:"The room became a world. A few uncertain steps became the beginning of everything that came after.", image:"/memories/memory-02.JPG" },
  { no:"04", year:"A NEW WORLD", title:"Outside, the world got bigger.", copy:"New places, new people, new days. Childhood kept moving, one frame at a time.", image:"/memories/memory-03.JPG" },
  { no:"05", year:"STILL GROWING", title:"And the story keeps going.", copy:"This archive is deliberately unfinished. Every new year can become another chapter.", image:"/memory/radman-second.JPG" },
];

function Chapter({ item, index }: { item: typeof chapters[number]; index:number }) {
  return (
    <article className="bio-chapter" data-chapter>
      <div className="bio-chapter__meta">
        <span>{item.no}</span><i /><small>{item.year}</small>
      </div>
      <div className="bio-chapter__visual" data-parallax="-8">
        <div className="bio-chapter__image"><img src={item.image} alt={item.title} loading={index ? "lazy" : "eager"} /></div>
        <div className="bio-chapter__image-index">{item.no} / 05</div>
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

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((node) => {
        gsap.fromTo(node, { y: 55, opacity: 0 }, {
          y: 0, opacity: 1, duration: 1.1, ease: "power3.out",
          scrollTrigger: { trigger: node, start: "top 84%", end: "top 58%", scrub: 1 },
        });
      });
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((node) => {
        const y = Number(node.dataset.parallax || -8);
        gsap.to(node, {
          yPercent: y, ease: "none",
          scrollTrigger: { trigger: node.closest("[data-chapter]") || node, start: "top bottom", end: "bottom top", scrub: 1.2 },
        });
      });
      gsap.to(".bio-hero__media img", {
        scale: 1.12, yPercent: 7, ease: "none",
        scrollTrigger: { trigger: ".bio-hero", start: "top top", end: "bottom top", scrub: 1.3 },
      });
      gsap.to(".bio-hero__title", {
        yPercent: -22, opacity: .25, ease: "none",
        scrollTrigger: { trigger: ".bio-hero", start: "top top", end: "75% top", scrub: 1 },
      });
      gsap.utils.toArray<HTMLElement>("[data-line]").forEach((line) => {
        gsap.fromTo(line, { scaleX: 0 }, {
          scaleX: 1, transformOrigin: "left center", ease: "none",
          scrollTrigger: { trigger: line, start: "top 88%", end: "top 58%", scrub: 1 },
        });
      });
      gsap.to(".bio-index__bar i", {
        scaleY: 1, transformOrigin: "top",
        scrollTrigger: { trigger: ".bio-index", start: "top top", end: "bottom bottom", scrub: .5 },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <main ref={root} className="bio-site">
      <header className="bio-nav">
        <a className="bio-nav__brand" href="#top">R<span>.</span></a>
        <nav>
          <a href="#story">STORY</a><a href="#archive">ARCHIVE</a><a href="#film">FILM</a>
        </nav>
        <span className="bio-nav__counter">A LIFE IN FRAMES</span>
      </header>

      <section id="top" className="bio-opening">
        <div className="bio-opening__grain" />
        <div className="bio-opening__content">
          <span className="micro">A PRIVATE VISUAL BIOGRAPHY</span>
          <h1>You became<br/><i>the reason</i><br/>my story never ended.</h1>
          <div className="bio-opening__bottom"><span>RADMAN / 2025—</span><span>SCROLL TO BEGIN ↓</span></div>
        </div>
      </section>

      <section className="bio-hero" id="story">
        <div className="bio-hero__orbs"><i/><i/><i/></div>
        <div className="bio-hero__grid"/>
        <div className="bio-hero__cursor">SCROLL<br/>TO ENTER</div>
        <div className="bio-hero__media"><img src="/memory/radman-and-me.png" alt="Radman and his father" /></div>
        <div className="bio-hero__veil" />
        <div className="bio-hero__title" data-reveal>
          <span className="micro">RADMAN — A VISUAL BIOGRAPHY</span>
          <h2>A life<br/><i>in motion.</i></h2>
          <p>از اولین روزها تا تمام روزهایی که هنوز نرسیده‌اند.</p>
        </div>
        <div className="bio-hero__stamp">MEMORY / MOTION / TIME<br/>14 : 15</div>
      </section>

      <section className="bio-intro">
        <div className="bio-intro__orb"/>

        <div className="bio-intro__num">01</div>
        <div className="bio-intro__text" data-reveal>
          <span className="micro">THE IDEA</span>
          <h2>A website that<br/><i>grows with him.</i></h2>
          <p>این یک گالری ساده نیست. یک آرشیو زنده است؛ جایی برای عکس، فیلم، نوشته و خاطره. هر فصل با بزرگ‌تر شدن رادمان کامل‌تر می‌شود.</p>
        </div>
      </section>

      <section className="bio-index" id="archive">
        <div className="bio-index__bar"><i /></div>
        <div className="bio-index__header" data-reveal>
          <span className="micro">THE ARCHIVE</span>
          <h2>Five chapters.<br/><i>One life.</i></h2>
          <p>هر فصل یک نقطه از مسیر زندگی رادمان است.</p>
        </div>
        <div className="bio-chapters">
          {chapters.map((item,index)=><Chapter key={item.no} item={item} index={index}/>)}
        </div>
      </section>

      <section className="bio-film" id="film">
        <div className="bio-film__halo"/>

        <div className="bio-film__copy" data-reveal>
          <span className="micro">MOVING MEMORY</span>
          <h2>Some memories<br/><i>need motion.</i></h2>
          <p>تصویر را متوقف نکن. بگذار دوباره زنده شود.</p>
        </div>
        <div className="bio-film__screen" data-reveal>
          <video src="/memory/memory-video.mp4" controls playsInline preload="metadata" />
          <div className="bio-film__caption"><span>RADMAN / FILM 01</span><span>PLAY MEMORY</span></div>
        </div>
      </section>

      <section className="bio-gallery">
        <div className="bio-gallery__heading" data-reveal><span className="micro">THE CONTACT SHEET</span><h2>More frames.<br/><i>More years.</i></h2></div>
        <div className="bio-gallery__grid">
          {["/memory/radman-main.JPG","/memories/memory-01.JPG","/memories/memory-02.JPG","/memories/memory-03.JPG","/memory/radman-second.JPG","/memory/radman-and-me.png"].map((src,i)=>
            <figure key={src}><img src={src} alt={"Radman memory "+(i+1)} loading="lazy"/><figcaption>0{i+1} / RADMAN</figcaption></figure>
          )}
        </div>
      </section>

      <section className="bio-future">
        <div className="bio-future__aurora"/>

        <span className="bio-future__ghost">06</span>
        <div data-reveal>
          <span className="micro">TO BE CONTINUED</span>
          <h2>The next chapter<br/><i>hasn't happened yet.</i></h2>
          <p>این صفحه عمداً پایان ندارد. سال‌های بعد، عکس‌های بعد و خاطرات بعدی به همین داستان اضافه می‌شوند.</p>
        </div>
      </section>

      <footer className="bio-footer">
        <b>RADMAN<span>.</span></b><span>A LIFE IN FRAMES</span><small>FOREVER, MY SON.</small>
      </footer>
    </main>
  );
}
