"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import RadmanImage from "./RadmanImage";
import "./RadmanExperience.css";

gsap.registerPlugin(ScrollTrigger);

const moments = [
  ["01","THE FIRST FRAME","The beginning of a life that changed everything.","RADMAN / 01"],
  ["02","FIRST LAUGH","A sound that turned ordinary rooms into memories.","RADMAN / 02"],
  ["03","FIRST STEPS","Small steps. A world becoming bigger.","RADMAN / 03"],
  ["04","GROWING","Every year added another layer to the story.","RADMAN / 04"],
  ["05","STILL BECOMING","The archive continues as life continues.","RADMAN / 05"],
];

export default function RadmanExperience(){
  const root=useRef<HTMLDivElement>(null);
  useLayoutEffect(()=>{
    const el=root.current;if(!el)return;
    const ctx=gsap.context(()=>{
      gsap.utils.toArray<HTMLElement>("[data-r]").forEach((node)=>{
        gsap.fromTo(node,{y:70,opacity:0},{y:0,opacity:1,duration:1,ease:"power3.out",scrollTrigger:{trigger:node,start:"top 86%",toggleActions:"play none none reverse"}});
      });
      gsap.utils.toArray<HTMLElement>("[data-image]").forEach((node)=>{
        gsap.to(node,{yPercent:-8,ease:"none",scrollTrigger:{trigger:node.closest(".rx-card"),start:"top bottom",end:"bottom top",scrub:1.2}});
      });
      gsap.to(".rx-hero__photo",{scale:1.12,yPercent:8,ease:"none",scrollTrigger:{trigger:".rx-hero",start:"top top",end:"bottom top",scrub:1.2}});
      gsap.to(".rx-hero__copy",{yPercent:-28,opacity:.25,ease:"none",scrollTrigger:{trigger:".rx-hero",start:"top top",end:"75% top",scrub:1}});
      gsap.to(".rx-progress i",{scaleX:1,transformOrigin:"left",ease:"none",scrollTrigger:{trigger:el,start:"top top",end:"bottom bottom",scrub:.25}});
      gsap.utils.toArray<HTMLElement>("[data-line]").forEach((n)=>gsap.fromTo(n,{scaleX:0},{scaleX:1,ease:"none",scrollTrigger:{trigger:n,start:"top 88%",end:"top 62%",scrub:.8}}));
    },el);
    return()=>ctx.revert();
  },[]);

  return <div ref={root} className="rx">
    <div className="rx-progress"><i/></div>
    <header className="rx-topbar">
      <a className="rx-mark" href="#top">R<span>.</span></a>
      <div className="rx-topbar__center"><span>RADMAN</span><i/> <span>VISUAL BIOGRAPHY</span></div>
      <a className="rx-enter" href="#archive">ENTER STORY <b>↘</b></a>
    </header>

    <section id="top" className="rx-hero">
      <div className="rx-hero__photo"><img src="/memory/radman-and-me.png" alt="Radman and his father"/></div>
      <div className="rx-hero__veil"/>
      <div className="rx-hero__noise"/>
      <div className="rx-hero__orb rx-hero__orb--a"/><div className="rx-hero__orb rx-hero__orb--b"/>
      <div className="rx-hero__copy" data-r>
        <span className="rx-kicker">A LIVING ARCHIVE · 2026</span>
        <h1>Radman<br/><em>in frames.</em></h1>
        <p>A visual biography of a childhood, a family and all the moments still becoming.</p>
      </div>
      <div className="rx-hero__bottom"><span>01 — THE BEGINNING</span><span>SCROLL TO EXPLORE ↓</span></div>
      <div className="rx-hero__badge">MEMORY<br/><strong>01</strong></div>
    </section>

    <section className="rx-manifesto">
      <div className="rx-manifesto__number">01</div>
      <div data-r>
        <span className="rx-kicker">THE ARCHIVE IS NOT A GALLERY</span>
        <h2>A life is not<br/><em>a collection of pictures.</em></h2>
        <p>It is a sequence of places, faces, sounds, firsts and tiny moments. This experience turns those fragments into one continuous visual story.</p>
        <div className="rx-rule" data-line/>
      </div>
    </section>

    <section id="archive" className="rx-archive">
      <div className="rx-section-head" data-r>
        <div><span className="rx-kicker">THE MEMORY INDEX · 02</span><h2>Years,<br/><em>not pages.</em></h2></div>
        <p>Scroll through the archive as one continuous timeline. Images move independently from typography, creating depth without turning the story into a slideshow.</p>
      </div>
      <div className="rx-cards">
        {moments.map((m,i)=><article className={"rx-card rx-card--"+(i%3)} key={m[0]}>
          <div className="rx-card__meta"><span>{m[0]}</span><i/><small>{m[1]}</small></div>
          <div className="rx-card__media"><div data-image><RadmanImage index={i} alt={m[1]}/></div><span>{m[3]}</span></div>
          <div className="rx-card__copy" data-r><span className="rx-kicker">{m[1]}</span><h3>{m[2]}</h3><p>Every frame keeps a place in the larger story.</p></div>
        </article>)}
      </div>
    </section>

    <section className="rx-feature">
      <div className="rx-feature__backdrop"><RadmanImage index={4} alt="Radman portrait"/></div>
      <div className="rx-feature__veil"/>
      <div className="rx-feature__content" data-r><span className="rx-kicker">THE HUMAN FRAME · 03</span><h2>Small moments.<br/><em>Infinite meaning.</em></h2><p>The interface slows down here. The image becomes the story, typography becomes the caption, and motion becomes the transition between memories.</p><a href="#film">CONTINUE ↓</a></div>
    </section>

    <section id="film" className="rx-film">
      <div className="rx-film__head" data-r><span className="rx-kicker">MOVING MEMORY · 04</span><h2>Some memories<br/><em>need motion.</em></h2></div>
      <div className="rx-film__frame" data-r><div className="rx-film__screen"><video src="/memory/memory-video.mp4" controls playsInline preload="metadata"/></div><div className="rx-film__caption"><span>RADMAN / FILM 01</span><span>PLAY MEMORY</span></div></div>
    </section>

    <section className="rx-gallery">
      <div className="rx-section-head" data-r><div><span className="rx-kicker">CONTACT SHEET · 05</span><h2>More frames.<br/><em>More years.</em></h2></div><p>A responsive image wall built to feel like a contemporary editorial archive rather than a conventional photo grid.</p></div>
      <div className="rx-gallery__grid">{[0,1,2,3,4,5].map((i)=><figure key={i} data-r><div><RadmanImage index={i} alt={"Radman memory "+(i+1)}/></div><figcaption>0{i+1} / RADMAN</figcaption></figure>)}</div>
    </section>

    <section className="rx-end"><div className="rx-end__glow"/><span className="rx-end__ghost">R</span><div data-r><span className="rx-kicker">TO BE CONTINUED · 06</span><h2>The archive<br/><em>keeps growing.</em></h2><p>There is no final chapter here. The next photograph, the next film and the next year can always become part of the story.</p></div></section>
    <footer className="rx-footer"><b>RADMAN<span>.</span></b><span>VISUAL BIOGRAPHY / 2026</span><small>FOREVER, MY SON.</small></footer>
  </div>
}
