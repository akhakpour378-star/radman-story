"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowUpRight, Volume2, VolumeX } from "lucide-react";
import "./RadmanUltimate.css";

gsap.registerPlugin(ScrollTrigger);

type Memory = { src: string; no: string; title: string; year: string; tag: string };

const memory: Memory[] = [
  {src:"/memory/radman-and-me.png",no:"01",title:"Together",year:"01",tag:"FAMILY"},
  {src:"/memory/radman-main.JPG",no:"02",title:"The Beginning",year:"02",tag:"ORIGIN"},
  {src:"/memory/radman-01.JPG",no:"03",title:"First Light",year:"03",tag:"EARLY YEARS"},
  {src:"/memory/radman-02.JPG",no:"04",title:"Little Days",year:"04",tag:"EARLY YEARS"},
  {src:"/memory/radman-03.JPG",no:"05",title:"Discovery",year:"05",tag:"EARLY YEARS"},
  {src:"/memory/radman-1.JPG",no:"06",title:"Growing",year:"06",tag:"CHILDHOOD"},
  {src:"/memory/radman-2.JPG",no:"07",title:"A New Day",year:"07",tag:"CHILDHOOD"},
  {src:"/memory/radman.JPG",no:"08",title:"Portrait",year:"08",tag:"CHILDHOOD"},
  {src:"/memory/radman1.JPG",no:"09",title:"The Smile",year:"09",tag:"CHILDHOOD"},
  {src:"/memory/radman2.JPG",no:"10",title:"The World",year:"10",tag:"DISCOVERY"},
  {src:"/memory/radman%20(9).JPG",no:"11",title:"Memory 09",year:"11",tag:"ARCHIVE"},
  {src:"/memory/radman%20(10).JPG",no:"12",title:"Memory 10",year:"12",tag:"ARCHIVE"},
  {src:"/memory/radman%20(11).JPG",no:"13",title:"Memory 11",year:"13",tag:"ARCHIVE"},
  {src:"/memory/radman%20(12).JPG",no:"14",title:"Memory 12",year:"14",tag:"ARCHIVE"},
  {src:"/memory/radman%20(13).JPG",no:"15",title:"Memory 13",year:"15",tag:"ARCHIVE"},
  {src:"/memory/radman%20(14).JPG",no:"16",title:"Memory 14",year:"16",tag:"ARCHIVE"},
  {src:"/memory/radman%20(15).JPG",no:"17",title:"Memory 15",year:"17",tag:"ARCHIVE"},
  {src:"/memory/radman%20(16).JPG",no:"18",title:"Memory 16",year:"18",tag:"ARCHIVE"},
  {src:"/memory/radman%20(17).JPG",no:"19",title:"Memory 17",year:"19",tag:"ARCHIVE"},
  {src:"/memory/radman%20(18).JPG",no:"20",title:"Memory 18",year:"20",tag:"ARCHIVE"},
];

const asset = (src: string) => src.startsWith("/memory/") ? `/api/memory?file=${encodeURIComponent(src.slice(1))}` : src;\n\nconst chapters = [
  ["01","THE BEGINNING","A face arrives and an ordinary life becomes a story.","02"],
  ["02","THE LITTLE YEARS","The years move quickly. The archive keeps what time cannot.","06"],
  ["03","BECOMING","Twenty frames. One childhood. Hundreds of moments between them.","11"],
  ["04","TOGETHER","Some memories are not about a place. They are about who was there.","01"],
];

export default function RadmanUltimate() {
  const root=useRef<main>(null);
  const audio=useRef<HTMLAudioElement|null>(null);
  const [sound,setSound]=useState(false);

  useLayoutEffect(()=>{
    const el=root.current;if(!el)return;
    const ctx=gsap.context(()=>{
      const q=gsap.utils.toArray<HTMLElement>(".u-reveal");
      q.forEach((node)=>gsap.fromTo(node,{y:70,opacity:0},{y:0,opacity:1,duration:1.05,ease:"power4.out",scrollTrigger:{trigger:node,start:"top 88%"}}));
      gsap.from(".u-hero__title .word span",{yPercent:120,opacity:0,duration:1.2,stagger:.1,ease:"power4.out",delay:.2});
      gsap.from(".u-hero__meta > *",{opacity:0,y:20,stagger:.12,duration:.8,delay:.55});
      gsap.to(".u-hero__photo img",{scale:1.2,yPercent:9,ease:"none",scrollTrigger:{trigger:".u-hero",start:"top top",end:"bottom top",scrub:1.4}});
      gsap.to(".u-hero__photo",{yPercent:12,ease:"none",scrollTrigger:{trigger:".u-hero",start:"top top",end:"bottom top",scrub:1}});
      gsap.to(".u-hero__copy",{yPercent:-32,opacity:0,ease:"none",scrollTrigger:{trigger:".u-hero",start:"top top",end:"65% top",scrub:1}});
      gsap.to(".u-orb",{xPercent:70,yPercent:-30,rotation:120,ease:"none",scrollTrigger:{trigger:".u-hero",start:"top top",end:"bottom top",scrub:1.5}});
      gsap.to(".u-progress i",{scaleX:1,transformOrigin:"left",ease:"none",scrollTrigger:{trigger:el,start:"top top",end:"bottom bottom",scrub:.1}});
      gsap.utils.toArray<HTMLElement>(".u-chapter__image").forEach((box)=>{
        gsap.fromTo(box,{clipPath:"inset(9% 9% 9% 9%)",scale:1.06},{clipPath:"inset(0% 0% 0% 0%)",scale:1,duration:1.25,ease:"power4.out",scrollTrigger:{trigger:box,start:"top 80%"}});
        gsap.to(box.querySelector("img"),{yPercent:-8,scale:1.08,ease:"none",scrollTrigger:{trigger:box,start:"top bottom",end:"bottom top",scrub:1}});
      });
      gsap.utils.toArray<HTMLElement>(".u-card").forEach((card,i)=>{
        gsap.to(card,{y:i%2?45:-30,rotate:i%3===0?-1.2:1,ease:"none",scrollTrigger:{trigger:".u-archive",start:"top bottom",end:"bottom top",scrub:1.2}});
      });
      gsap.to(".u-line",{scaleX:1,transformOrigin:"left",ease:"none",scrollTrigger:{trigger:".u-timeline",start:"top 70%",end:"bottom 55%",scrub:1}});
    },el);
    return()=>ctx.revert();
  },[]);

  const toggle=()=>{
    if(!audio.current){audio.current=new Audio(asset("/memory/memory-audio.mp3"));audio.current.loop=true;audio.current.volume=.22;}
    if(sound){audio.current.pause();setSound(false);}else{audio.current.play().catch(()=>{});setSound(true);}
  };

  return <main ref={root} className="u">
    <div className="u-progress"><i/></div>
    <nav className="u-nav">
      <a href="#top" className="u-logo">R<span>.</span></a>
      <div className="u-nav__center"><span>RADMAN</span><i/> <span>VISUAL BIOGRAPHY</span></div>
      <button onClick={toggle}>{sound?<Volume2 size={14}/>:<VolumeX size={14}/>} {sound?"SOUND ON":"SOUND"}</button>
    </nav>

    <section id="top" className="u-hero">
      <div className="u-hero__photo"><img src={asset(memory[0].src)} alt="Radman and his father"/></div>
      <div className="u-hero__wash"/>
      <div className="u-orb"/>
      <div className="u-grain"/>
      <div className="u-hero__copy">
        <p className="u-kicker"><span/>A VISUAL BIOGRAPHY / 2026</p>
        <h1 className="u-hero__title"><span className="word"><span>RADMAN</span></span><span className="word"><em>A LIFE</em> IN FRAMES</span></h1>
        <p className="u-hero__lead">یک آرشیو زنده از تولد، کودکی، خنده‌ها، رشد کردن و تمام لحظه‌هایی که نباید فراموش شوند.</p>
      </div>
      <div className="u-hero__meta"><div><small>ARCHIVE</small><b>20</b><span>ORIGINAL FRAMES</span></div><div><small>CHAPTERS</small><b>04</b><span>ONE STORY</span></div></div>
      <div className="u-scroll"><ArrowDown size={14}/><span>SCROLL TO ENTER</span></div>
    </section>

    <section className="u-manifesto">
      <div className="u-manifesto__ghost">R</div>
      <span className="u-kicker u-reveal">00 / THE CONCEPT</span>
      <div className="u-manifesto__copy u-reveal">
        <h2>Not a gallery.<br/><em>A life.</em></h2>
        <p>این سایت قرار نیست فقط عکس‌ها را کنار هم بچیند. هر فصل یک فضای بصری مستقل است؛ با تایپوگرافی، عمق، حرکت و ریتم مخصوص خودش.</p>
      </div>
      <div className="u-manifesto__numbers u-reveal"><div><b>20</b><span>FRAMES</span></div><div><b>04</b><span>CHAPTERS</span></div><div><b>01</b><span>STORY</span></div></div>
    </section>

    <section className="u-chapters">
      {chapters.map(([num,title,copy,frame],i)=>{const m=memory[Number(frame)-1]??memory[i];return <article className="u-chapter" key={num}>
        <div className="u-chapter__top"><b>{num}</b><span>{m.tag}</span><small>{String(i+1).padStart(2,"0")} / 04</small></div>
        <div className="u-chapter__layout">
          <div className="u-chapter__image"><img src={asset(m.src)} alt={m.title}/><span>{m.no}</span></div>
          <div className="u-chapter__copy u-reveal"><p className="u-kicker">{m.tag} / {m.year}</p><h2>{title}</h2><p>{copy}</p><div className="u-rule"/></div>
        </div>
      </article>})}
    </section>

    <section className="u-timeline">
      <div className="u-timeline__head u-reveal"><span className="u-kicker">01 / THE YEARS</span><h2>From first breath<br/><em>to becoming.</em></h2></div>
      <div className="u-line"/>
      <div className="u-timeline__steps">
        {memory.slice(0,8).map((m,i)=><div className="u-step u-reveal" key={m.src}><span>{m.no}</span><b>{m.title}</b><small>{m.tag}</small></div>)}
      </div>
    </section>

    <section className="u-archive">
      <div className="u-archive__head u-reveal"><span className="u-kicker">02 / THE COMPLETE ARCHIVE</span><h2>Twenty frames.<br/><em>Nothing repeated.</em></h2><p>هر کارت یک فایل واقعی از آرشیو است؛ بدون تکرار تصویری.</p></div>
      <div className="u-archive__grid">
        {memory.map((m,i)=><figure className={"u-card u-card--"+(i%4)} key={m.src}><div><img src={m.src} alt={m.title} loading={i<4?"eager":"lazy"}/><span>{m.no}</span></div><figcaption><small>{m.tag}</small><b>{m.title}</b><em>{m.year}</em></figcaption></figure>)}
      </div>
    </section>

    <section className="u-film">
      <div className="u-film__copy u-reveal"><span className="u-kicker">03 / MOVING MEMORY</span><h2>Photos hold time.<br/><em>Film holds breath.</em></h2><p>در این بخش تصویر از آرشیو جدا می‌شود و وارد حرکت می‌شود؛ ویدئو و صدای خاطره، بخشی از روایت هستند.</p></div>
      <div className="u-film__media u-reveal"><img src={asset("/memory/radman-sit.jpeg")} alt="Radman seated from behind"/><span>QUIET FRAME / RADMAN</span></div>
      <div className="u-video u-reveal"><video src={asset("/memory/memory-video.mp4")} controls playsInline preload="metadata"/><small>ORIGINAL HOME MOVIE / PLAY</small></div>
    </section>

    <section className="u-finale">
      <div className="u-finale__glow"/>
      <div className="u-finale__copy u-reveal"><span className="u-kicker">04 / THE STORY CONTINUES</span><h2>There is no<br/><em>final frame.</em></h2><p>آرشیو با هر خاطره تازه، فصل تازه‌ای پیدا می‌کند.</p><a href="#top">RETURN TO BEGINNING <ArrowUpRight size={14}/></a></div>
    </section>
    <footer className="u-footer"><b>RADMAN<span>.</span></b><span>VISUAL BIOGRAPHY / 2026</span><small>FOREVER, MY SON.</small></footer>
  </main>;
}
