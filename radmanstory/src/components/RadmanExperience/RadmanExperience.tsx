"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { ArrowDown, Volume2, VolumeX, Plus, ArrowUpRight } from "lucide-react";
import "./RadmanExperience.css";

gsap.registerPlugin(ScrollTrigger);

const MEDIA = {
  hero: "/memory/radman-and-me.png",
  portrait: "/memory/radman-main.JPG",
  detail: "/memory/radman-second.JPG",
  seated: "/memory/radman-sit.jpeg",
  memory01: "/memories/memory-01.JPG",
  memory02: "/memories/memory-02.JPG",
  memory03: "/memories/memory-03.JPG",
};

const chapters = [
  { id:"01", date:"THE BEGINNING", title:["A new name.","A new universe."], copy:"Before there were chapters, there was one small arrival that changed the shape of everything.", image:MEDIA.memory01, side:"01 / ORIGIN" },
  { id:"02", date:"THE FIRST YEARS", title:["The days","started moving."], copy:"The ordinary became unforgettable: a laugh, a look, a first step, a room suddenly filled with a different kind of light.", image:MEDIA.portrait, side:"02 / GROWTH" },
  { id:"03", date:"THE WORLD OUTSIDE", title:["Small hands.","A larger world."], copy:"Every photograph holds a place, a season and a version of Radman that can never happen twice.", image:MEDIA.memory02, side:"03 / DISCOVERY" },
  { id:"04", date:"TOGETHER", title:["Two people.","One archive."], copy:"Some photographs are records. Some become landmarks. This one belongs to both.", image:MEDIA.hero, side:"04 / TOGETHER" },
];

const gallery = [
  [MEDIA.detail,"A FACE I REMEMBER","DETAIL / 01"],
  [MEDIA.seated,"QUIET MOMENT","DETAIL / 02"],
  [MEDIA.memory03,"ANOTHER DAY","DETAIL / 03"],
  [MEDIA.memory01,"THE BEGINNING","DETAIL / 04"],
  [MEDIA.hero,"TOGETHER","DETAIL / 05"],
];

export default function RadmanExperience(){
  const root = useRef<HTMLDivElement>(null);
  const [sound,setSound] = useState(false);
  const audio = useRef<HTMLAudioElement|null>(null);

  useEffect(()=>{
    return ()=>{ audio.current?.pause(); audio.current=null; };
  },[]);

  useLayoutEffect(()=>{
    const el=root.current;
    if(!el) return;

    const lenis=new Lenis({ duration:1.15, smoothWheel:true, touchMultiplier:1.1 });
    let raf=0;
    const render=(time:number)=>{ lenis.raf(time); raf=requestAnimationFrame(render); };
    raf=requestAnimationFrame(render);

    const ctx=gsap.context(()=>{
      const reveal=gsap.utils.toArray<HTMLElement>(".rx-reveal");
      const photos=gsap.utils.toArray<HTMLElement>(".rx-photo");
      const chaptersEls=gsap.utils.toArray<HTMLElement>(".rx-chapter");

      gsap.set(".rx-loader__word",{y:30,opacity:0});
      gsap.timeline()
        .to(".rx-loader__word",{y:0,opacity:1,duration:.8,ease:"power4.out"})
        .to(".rx-loader__line",{scaleX:1,duration:1.2,ease:"power4.inOut"},"-=.35")
        .to(".rx-loader",{autoAlpha:0,duration:.9,delay:.25,ease:"power4.inOut"});

      gsap.timeline({defaults:{ease:"power4.out"}})
        .from(".rx-hero__meta",{y:30,opacity:0,duration:.9},.5)
        .from(".rx-hero__title .line",{yPercent:115,opacity:0,stagger:.11,duration:1.2},.55)
        .from(".rx-hero__description",{y:25,opacity:0,duration:1},1.05)
        .from(".rx-hero__image",{scale:1.12,opacity:0,duration:1.8},.2)
        .from(".rx-hero__orb",{scale:.3,opacity:0,duration:1.4},.3);

      gsap.to(".rx-hero__image img",{scale:1.16,yPercent:8,ease:"none",scrollTrigger:{trigger:".rx-hero",start:"top top",end:"bottom top",scrub:1.4}});
      gsap.to(".rx-hero__title",{yPercent:-26,ease:"none",scrollTrigger:{trigger:".rx-hero",start:"top top",end:"bottom top",scrub:1}});
      gsap.to(".rx-hero__orb",{xPercent:35,yPercent:22,rotation:80,ease:"none",scrollTrigger:{trigger:".rx-hero",start:"top top",end:"bottom top",scrub:1.3}});

      reveal.forEach((node)=>{
        gsap.fromTo(node,{y:70,opacity:0},{y:0,opacity:1,duration:1.05,ease:"power4.out",scrollTrigger:{trigger:node,start:"top 84%",toggleActions:"play none none reverse"}});
      });

      photos.forEach((node)=>{
        const img=node.querySelector("img");
        if(!img) return;
        gsap.fromTo(img,{scale:1.15,yPercent:-4},{scale:1,yPercent:0,ease:"none",scrollTrigger:{trigger:node,start:"top bottom",end:"bottom top",scrub:1.2}});
      });

      chaptersEls.forEach((chapter,i)=>{
        const image=chapter.querySelector(".rx-chapter__image");
        const copy=chapter.querySelector(".rx-chapter__copy");
        gsap.fromTo(image,{clipPath:"inset(14% 10% 14% 10%)",scale:1.08},{clipPath:"inset(0% 0% 0% 0%)",scale:1,duration:1.3,ease:"power4.out",scrollTrigger:{trigger:chapter,start:"top 78%",toggleActions:"play none none reverse"}});
        gsap.fromTo(copy,{x:i%2?70:-70,opacity:0},{x:0,opacity:1,duration:1.1,ease:"power4.out",scrollTrigger:{trigger:chapter,start:"top 72%",toggleActions:"play none none reverse"}});
        gsap.to(chapter.querySelector(".rx-chapter__ghost"),{yPercent:-25,ease:"none",scrollTrigger:{trigger:chapter,start:"top bottom",end:"bottom top",scrub:1}});
      });

      gsap.to(".rx-thread__beam",{scaleX:1,transformOrigin:"left",ease:"none",scrollTrigger:{trigger:".rx-thread",start:"top 65%",end:"bottom 40%",scrub:1}});
      gsap.to(".rx-thread__light",{x:"82vw",ease:"none",scrollTrigger:{trigger:".rx-thread",start:"top 65%",end:"bottom 40%",scrub:1}});

      const horizontal=document.querySelector<HTMLElement>(".rx-gallery__track");
      if(horizontal){
        const distance=()=>Math.max(0,horizontal.scrollWidth-window.innerWidth);
        gsap.to(horizontal,{x:()=>-distance(),ease:"none",scrollTrigger:{trigger:".rx-gallery",start:"top top",end:()=>"+="+distance(),pin:true,scrub:1.1,anticipatePin:1,invalidateOnRefresh:true}});
      }

      gsap.to(".rx-final__image img",{scale:1.17,yPercent:8,ease:"none",scrollTrigger:{trigger:".rx-final",start:"top top",end:"bottom top",scrub:1.3}});
      gsap.to(".rx-progress__bar",{scaleX:1,transformOrigin:"left",ease:"none",scrollTrigger:{trigger:el,start:"top top",end:"bottom bottom",scrub:.15}});

      const cursor=document.querySelector<HTMLElement>(".rx-cursor");
      const glow=document.querySelector<HTMLElement>(".rx-cursor-glow");
      let mouseX=0,mouseY=0,currentX=0,currentY=0;
      const move=(e:MouseEvent)=>{mouseX=e.clientX;mouseY=e.clientY};
      const cursorLoop=()=>{
        currentX+=(mouseX-currentX)*.14;
        currentY+=(mouseY-currentY)*.14;
        if(cursor) cursor.style.transform=`translate3d(${currentX}px,${currentY}px,0)`;
        if(glow) glow.style.transform=`translate3d(${mouseX-180}px,${mouseY-180}px,0)`;
        requestAnimationFrame(cursorLoop);
      };
      window.addEventListener("mousemove",move);
      cursorLoop();

      return ()=>window.removeEventListener("mousemove",move);
    },el);

    return ()=>{ctx.revert();lenis.destroy();cancelAnimationFrame(raf);};
  },[]);

  const toggleSound=()=>{
    if(!audio.current){
      audio.current=new Audio("/memory/memory-audio.mp3");
      audio.current.loop=true;
      audio.current.volume=.32;
    }
    if(sound){ audio.current.pause(); setSound(false); }
    else { audio.current.play().catch(()=>{}); setSound(true); }
  };

  return <main ref={root} className="rx">
    <div className="rx-loader"><div className="rx-loader__word">RADMAN<span>.</span></div><div className="rx-loader__line"/></div>
    <div className="rx-cursor"/><div className="rx-cursor-glow"/>
    <div className="rx-progress"><i className="rx-progress__bar"/></div>

    <header className="rx-nav">
      <a href="#top" className="rx-brand">R<span>.</span></a>
      <div className="rx-nav__center"><span>RADMAN ARCHIVE</span><i/><span>VISUAL BIOGRAPHY</span></div>
      <button className="rx-sound" onClick={toggleSound}>{sound?<Volume2 size={14}/>:<VolumeX size={14}/>}<span>{sound?"SOUND ON":"SOUND"}</span></button>
    </header>

    <section id="top" className="rx-hero">
      <div className="rx-hero__image rx-photo"><img src={MEDIA.hero} alt="Radman and his father"/></div>
      <div className="rx-hero__veil"/>
      <div className="rx-hero__orb"/>
      <div className="rx-hero__grain"/>
      <div className="rx-hero__meta"><span>THE LIFE OF RADMAN</span><span>ARCHIVE / 2026</span></div>
      <div className="rx-hero__content">
        <h1 className="rx-hero__title">
          <span className="line">A LIFE</span>
          <span className="line"><i>worth</i> remembering.</span>
        </h1>
        <p className="rx-hero__description">A visual biography built from photographs, films and the small moments that become everything.</p>
      </div>
      <div className="rx-hero__bottom"><span>SCROLL TO ENTER</span><ArrowDown size={15}/><span>FOREVER, MY SON.</span></div>
    </section>

    <section className="rx-introduction">
      <div className="rx-introduction__number rx-reveal">01</div>
      <div className="rx-introduction__copy rx-reveal">
        <span className="rx-kicker">THE ARCHIVE</span>
        <h2>Not a collection.<br/><em>A life, frame by frame.</em></h2>
        <p>From the first days to the person he is becoming, this archive turns photographs into a continuous story. Move through it slowly.</p>
      </div>
      <div className="rx-introduction__stamp rx-reveal"><span>RADMAN</span><b>FOREVER<br/>MY SON.</b></div>
    </section>

    <section className="rx-chapters">
      {chapters.map((chapter,i)=><article className={"rx-chapter "+(i%2?"rx-chapter--reverse":"")} key={chapter.id}>
        <div className="rx-chapter__ghost">{chapter.id}</div>
        <div className="rx-chapter__index"><span>{chapter.id}</span><small>{chapter.side}</small></div>
        <div className="rx-chapter__image rx-photo"><img src={chapter.image} alt={chapter.date}/><div className="rx-image-glass"/></div>
        <div className="rx-chapter__copy">
          <span className="rx-kicker">{chapter.date}</span>
          <h2>{chapter.title.map((line)=><span key={line}>{line}</span>)}</h2>
          <p>{chapter.copy}</p>
          <div className="rx-chapter__rule"/><small>RADMAN / VISUAL ARCHIVE / {chapter.id}</small>
        </div>
      </article>)}
    </section>

    <section className="rx-thread">
      <div className="rx-thread__copy rx-reveal"><span className="rx-kicker">THE THREAD</span><h2>One year<br/><em>becomes another.</em></h2></div>
      <div className="rx-thread__beam"/><div className="rx-thread__light"/>
      <div className="rx-thread__years"><span>BEGINNING</span><span>LAUGHTER</span><span>STEPS</span><span>DISCOVERY</span><span>TOGETHER</span></div>
    </section>

    <section className="rx-gallery">
      <div className="rx-gallery__track">
        <div className="rx-gallery__intro"><span className="rx-kicker">THE CONTACT SHEET</span><h2>Every frame<br/><em>holds a world.</em></h2></div>
        {gallery.map(([src,title,label],i)=><figure className="rx-gallery__card" key={src+title}>
          <div className="rx-gallery__image rx-photo"><img src={src} alt={title}/><span className="rx-gallery__plus"><Plus size={15}/></span><span className="rx-gallery__count">0{i+1}</span></div>
          <figcaption><small>{label}</small><b>{title}</b></figcaption>
        </figure>)}
      </div>
    </section>

    <section className="rx-film">
      <div className="rx-film__heading rx-reveal"><span className="rx-kicker">MOVING MEMORY / 05</span><h2>Photographs stop time.<br/><em>Film lets it breathe.</em></h2></div>
      <div className="rx-film__frame rx-reveal"><video src="/memory/memory-video.mp4" controls playsInline preload="metadata"/><div className="rx-film__label">RADMAN / HOME MOVIE</div></div>
    </section>

    <section className="rx-feature">
      <div className="rx-feature__image rx-photo"><img src={MEDIA.seated} alt="Radman seated from behind"/><div className="rx-image-glass"/></div>
      <div className="rx-feature__copy rx-reveal"><span className="rx-kicker">A QUIET FRAME</span><h2>Some memories<br/><em>do not need words.</em></h2><p>They only need to stay exactly where they were.</p></div>
    </section>

    <section className="rx-final">
      <div className="rx-final__image rx-photo"><img src={MEDIA.hero} alt="Radman and his father"/></div>
      <div className="rx-final__veil"/>
      <div className="rx-final__copy rx-reveal"><span className="rx-kicker">THE ARCHIVE / 06</span><h2>There is no<br/><em>final frame.</em></h2><p>The story keeps moving. New photographs. New years. New memories.</p><a href="#top">RETURN TO BEGINNING <ArrowUpRight size={14}/></a></div>
      <blockquote>“You became the reason<br/>my story never ended.”</blockquote>
    </section>

    <footer className="rx-footer"><strong>RADMAN<span>.</span></strong><span>AN IMMERSIVE VISUAL BIOGRAPHY / 2026</span><small>FOREVER, MY SON.</small></footer>
  </main>;
}
