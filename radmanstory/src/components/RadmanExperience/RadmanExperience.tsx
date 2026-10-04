"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { ArrowDown, Volume2, VolumeX, Play, Plus } from "lucide-react";
import "./RadmanExperience.css";

gsap.registerPlugin(ScrollTrigger);

const images=[
  "/memory/radman-main.JPG",
  "/memory/radman-second.JPG",
  "/memory/radman-sit.jpeg",
  "/memory/radman-and-me.png",
  "/memory/radman-and-me.png",
  "/memory/radman-main.JPG",
  "/memory/radman-second.JPG",
  "/memory/radman-sit.jpeg",
];

const chapters=[
  {n:"01",year:"THE BEGINNING",title:"The first day\nof everything.",copy:"A small beginning. A new name. A new rhythm in the house.",image:images[0]},
  {n:"02",year:"THE FIRST LAUGH",title:"Then the room\nstarted smiling.",copy:"Some memories do not need a date. You remember the sound.",image:images[1]},
  {n:"03",year:"FIRST STEPS",title:"Tiny steps.\nA larger world.",copy:"The distance was small. The feeling was enormous.",image:images[2]},
  {n:"04",year:"TOGETHER",title:"Two shadows.\nOne story.",copy:"A photograph becomes more than a photograph when it carries a whole season.",image:images[3]},
];

function splitLines(value:string){return value.split("\n").map((x,i)=><span key={i}>{x}</span>);}

export default function RadmanExperience(){
  const root=useRef<HTMLDivElement>(null);
  const [sound,setSound]=useState(false);
  const audio=useRef<HTMLAudioElement|null>(null);

  useLayoutEffect(()=>{
    const el=root.current;if(!el)return;
    const lenis=new Lenis({duration:1.15,smoothWheel:true});
    let raf=0;
    const loop=(time:number)=>{lenis.raf(time);ScrollTrigger.update();raf=requestAnimationFrame(loop)};
    raf=requestAnimationFrame(loop);
    const ctx=gsap.context(()=>{
      const q=(s:string)=>gsap.utils.toArray<HTMLElement>(s);

      gsap.fromTo(".rx-loader__line",{scaleX:0},{scaleX:1,duration:1.7,ease:"power4.inOut"});
      gsap.to(".rx-loader",{autoAlpha:0,delay:1.9,duration:.9,ease:"power3.inOut"});

      const hero=gsap.timeline({defaults:{ease:"power4.out"}});
      hero.fromTo(".rx-hero__eyebrow",{y:25,opacity:0},{y:0,opacity:1,duration:1},.5)
        .fromTo(".rx-hero__title span",{y:"110%",rotate:4,opacity:0},{y:0,rotate:0,opacity:1,duration:1.25,stagger:.1},.65)
        .fromTo(".rx-hero__lead",{y:30,opacity:0},{y:0,opacity:1,duration:1},1.05)
        .fromTo(".rx-hero__image",{scale:1.16,opacity:0},{scale:1,opacity:1,duration:1.8},.15)
        .fromTo(".rx-hero__frame",{clipPath:"inset(100% 0 0 0)"},{clipPath:"inset(0% 0 0 0)",duration:1.4},.2);

      gsap.to(".rx-hero__image",{scale:1.18,yPercent:10,ease:"none",scrollTrigger:{trigger:".rx-hero",start:"top top",end:"bottom top",scrub:1.4}});
      gsap.to(".rx-hero__title",{yPercent:-30,opacity:.18,ease:"none",scrollTrigger:{trigger:".rx-hero",start:"top top",end:"bottom top",scrub:1}});
      gsap.to(".rx-hero__sun",{rotation:25,xPercent:30,ease:"none",scrollTrigger:{trigger:".rx-hero",start:"top top",end:"bottom top",scrub:1.2}});

      q(".rx-reveal").forEach(n=>gsap.fromTo(n,{y:80,opacity:0},{y:0,opacity:1,duration:1.1,ease:"power4.out",scrollTrigger:{trigger:n,start:"top 82%",toggleActions:"play none none reverse"}}));

      q(".rx-image").forEach(n=>{
        const img=n.querySelector("img");
        if(img)gsap.to(img,{yPercent:-13,scale:1.08,ease:"none",scrollTrigger:{trigger:n,start:"top bottom",end:"bottom top",scrub:1.3}});
      });

      q(".rx-chapter").forEach((chapter,i)=>{
        const photo=chapter.querySelector(".rx-chapter__photo");
        gsap.fromTo(photo,{scale:1.18,opacity:.55},{scale:1,opacity:1,ease:"none",scrollTrigger:{trigger:chapter,start:"top 90%",end:"center 45%",scrub:1}});
        gsap.fromTo(chapter.querySelectorAll(".rx-chapter__word"),{y:100,opacity:0},{y:0,opacity:1,stagger:.08,duration:1,ease:"power4.out",scrollTrigger:{trigger:chapter,start:"top 70%",toggleActions:"play none none reverse"}});
        if(i===2) gsap.to(chapter,{backgroundColor:"#0b1723",scrollTrigger:{trigger:chapter,start:"top center",end:"bottom center",scrub:1}});
      });

      gsap.to(".rx-line__beam",{scaleX:1,transformOrigin:"left",ease:"none",scrollTrigger:{trigger:".rx-line",start:"top 70%",end:"bottom 35%",scrub:1}});
      gsap.to(".rx-line__dot",{xPercent:900,ease:"none",scrollTrigger:{trigger:".rx-line",start:"top 70%",end:"bottom 35%",scrub:1}});

      gsap.to(".rx-horizontal__track",{x:()=>-(document.querySelector(".rx-horizontal__track")!.scrollWidth-window.innerWidth+window.innerWidth*.08),ease:"none",scrollTrigger:{trigger:".rx-horizontal",start:"top top",end:()=>"+="+(document.querySelector(".rx-horizontal__track")!.scrollWidth-window.innerWidth),pin:true,scrub:1,anticipatePin:1,invalidateOnRefresh:true}});

      gsap.to(".rx-final__photo",{scale:1.16,yPercent:8,ease:"none",scrollTrigger:{trigger:".rx-final",start:"top top",end:"bottom top",scrub:1.4}});
      gsap.to(".rx-progress i",{scaleX:1,transformOrigin:"left",ease:"none",scrollTrigger:{trigger:el,start:"top top",end:"bottom bottom",scrub:.2}});

      const cursor=document.querySelector(".rx-cursor") as HTMLElement|null;
      const glow=document.querySelector(".rx-cursor__glow") as HTMLElement|null;
      if(cursor&&glow){
        let mx=0,my=0,cx=0,cy=0;
        const move=(e:MouseEvent)=>{mx=e.clientX;my=e.clientY};
        window.addEventListener("mousemove",move);
        const tick=()=>{cx+=(mx-cx)*.12;cy+=(my-cy)*.12;cursor.style.transform=`translate3d(${cx}px,${cy}px,0)`;glow.style.transform=`translate3d(${mx-150}px,${my-150}px,0)`;requestAnimationFrame(tick)};
        tick();
        return()=>window.removeEventListener("mousemove",move);
      }
    },el);
    return()=>{ctx.revert();lenis.destroy();cancelAnimationFrame(raf)};
  },[]);

  const toggleSound=()=>{
    if(!audio.current)audio.current=new Audio("/memory/memory-audio.mp3");
    audio.current.loop=true;
    if(sound){audio.current.pause();setSound(false)}else{audio.current.volume=.34;audio.current.play().catch(()=>{});setSound(true)}
  };

  return <main ref={root} className="rx">
    <div className="rx-loader"><div className="rx-loader__brand">R<span>.</span></div><div className="rx-loader__line"/></div>
    <div className="rx-cursor"/><div className="rx-cursor__glow"/>
    <div className="rx-progress"><i/></div>

    <header className="rx-nav">
      <a href="#top" className="rx-logo">R<span>.</span></a>
      <div className="rx-nav__middle"><span>RADMAN</span><i/><span>AN IMMERSIVE BIOGRAPHY</span></div>
      <button className="rx-sound" onClick={toggleSound}>{sound?<Volume2 size={13}/>:<VolumeX size={13}/>} <span>{sound?"SOUND ON":"SOUND OFF"}</span></button>
    </header>

    <section id="top" className="rx-hero">
      <div className="rx-hero__image rx-image"><img src={images[3]} alt="Radman and his father"/></div>
      <div className="rx-hero__shade"/>
      <div className="rx-hero__sun"/>
      <div className="rx-hero__grid"/>
      <div className="rx-hero__content">
        <div className="rx-hero__eyebrow"><span>THE ARCHIVE / 01</span><span>2026</span></div>
        <h1 className="rx-hero__title"><span>RADMAN</span><span><em>—</em> A LIFE IN</span><span>MEMORY.</span></h1>
        <p className="rx-hero__lead">A living visual biography — from the first breath to every frame that came after.</p>
      </div>
      <div className="rx-hero__bottom"><span>SCROLL TO REMEMBER</span><ArrowDown size={14}/><span>35° 41' N / 51° 25' E</span></div>
    </section>

    <section className="rx-intro">
      <div className="rx-intro__number rx-reveal">01</div>
      <div className="rx-intro__copy rx-reveal">
        <span className="rx-label">A STORY IN MOTION</span>
        <h2>Not a gallery.<br/><i>A memory you enter.</i></h2>
        <p>Every photograph is a doorway. Every year leaves a trace. Scroll slowly — the archive changes with you.</p>
      </div>
      <div className="rx-intro__side rx-reveal"><span>RADMAN</span><b>FOREVER, MY SON.</b></div>
    </section>

    <section className="rx-chapters">
      {chapters.map((c,i)=><article className={"rx-chapter rx-chapter--"+i} key={c.n}>
        <div className="rx-chapter__index"><span>{c.n}</span><i/></div>
        <div className="rx-chapter__photo rx-image"><img src={c.image} alt={c.year}/><div className="rx-chapter__photo-glass"/></div>
        <div className="rx-chapter__copy">
          <span className="rx-label">{c.year}</span>
          <h2>{c.title.split("\n").map((x,j)=><span className="rx-chapter__word" key={j}>{x}</span>)}</h2>
          <p className="rx-chapter__word">{c.copy}</p>
          <span className="rx-chapter__caption">FRAME {c.n} / RADMAN ARCHIVE</span>
        </div>
      </article>)}
    </section>

    <section className="rx-line">
      <div className="rx-line__copy rx-reveal"><span className="rx-label">THE THREAD</span><h2>One memory<br/><i>leads to another.</i></h2></div>
      <div className="rx-line__beam"/><div className="rx-line__dot"/><div className="rx-line__year"><span>2019</span><span>2020</span><span>2021</span><span>2022</span><span>2023</span><span>2024</span></div>
    </section>

    <section className="rx-horizontal">
      <div className="rx-horizontal__track">
        {[4,5,6,7].map((i)=><figure key={i} className="rx-film-card"><div><img src={images[i]} alt={"Radman archive "+i}/><span><Plus size={15}/></span></div><figcaption><small>ARCHIVE / 0{i-3}</small><b>{["THE DAYS BETWEEN","OUTSIDE / TOGETHER","A SMALL UNIVERSE","THE NEXT FRAME"][i-4]}</b></figcaption></figure>)}
      </div>
    </section>

    <section className="rx-video">
      <div className="rx-video__heading rx-reveal"><span className="rx-label">MOVING MEMORY / 05</span><h2>Some moments<br/><i>need a heartbeat.</i></h2></div>
      <div className="rx-video__frame rx-reveal"><video src="/memory/memory-video.mp4" controls playsInline preload="metadata"/><div className="rx-video__overlay"><Play size={22}/><span>PLAY FILM</span></div></div>
    </section>

    <section className="rx-final">
      <div className="rx-final__photo rx-image"><img src="/memory/radman-and-me.png" alt="Radman and his father"/></div>
      <div className="rx-final__shade"/>
      <div className="rx-final__copy rx-reveal"><span className="rx-label">THE ARCHIVE / 06</span><h2>There is no<br/><i>final frame.</i></h2><p>The story keeps moving. New photographs, new years, new memories — waiting for the next chapter.</p><a href="#top">RETURN TO BEGINNING ↗</a></div>
      <div className="rx-final__quote">“You became the reason<br/>my story never ended.”</div>
    </section>

    <footer className="rx-footer"><strong>RADMAN<span>.</span></strong><span>AN IMMERSIVE VISUAL BIOGRAPHY / 2026</span><small>FOREVER, MY SON.</small></footer>
  </main>
}
