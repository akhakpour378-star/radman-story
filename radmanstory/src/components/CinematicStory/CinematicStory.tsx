"use client";
import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./CinematicStory.css";
import { useForestSound } from "@/components/RadmanOpening/CinematicSound";
gsap.registerPlugin(ScrollTrigger);
const memories=[
{title:"اولین خنده",en:"THE FIRST LAUGH",image:"/memories/memory-01.JPG"},
{title:"اولین قدم",en:"THE FIRST STEP",image:"/memories/memory-02.JPG"},
{title:"اولین روز مهد",en:"THE FIRST DAY",image:"/memories/memory-03.JPG"},
];
export default function CinematicStory(){
const root=useRef<HTMLDivElement>(null); const baba=useRef<HTMLAudioElement>(null);
const sound=useForestSound(); const soundRef=useRef(sound); soundRef.current=sound;
const [soundOn,setSoundOn]=useState(false);
useLayoutEffect(()=>{const el=root.current;if(!el)return;const ctx=gsap.context(()=>{
const intro=gsap.timeline({scrollTrigger:{trigger:".film-intro",start:"top top",end:"bottom top",scrub:1,pin:true}});
ScrollTrigger.create({trigger:".film-forest",start:"top top",end:"bottom top",onUpdate:self=>soundRef.current.onTravel(self.progress,self.getVelocity())});
      intro.to(".film-intro__line",{opacity:0,scale:.96,y:-40}).to(".film-intro__hint",{opacity:0,y:20},"<").to(".film-intro__black",{opacity:0},"+=.2").to(".film-forest",{opacity:1},"<");
gsap.to(".forest__sky",{yPercent:-10,scale:1.08,ease:"none",scrollTrigger:{trigger:".film-forest",start:"top top",end:"bottom top",scrub:1.5}});
gsap.to(".forest__mist",{xPercent:18,yPercent:-8,ease:"none",scrollTrigger:{trigger:".film-forest",start:"top top",end:"bottom top",scrub:2.5}});
gsap.to(".forest__trees",{xPercent:-5,yPercent:6,scale:1.08,ease:"none",scrollTrigger:{trigger:".film-forest",start:"top top",end:"bottom top",scrub:1.2}});
gsap.to(".forest__particles",{xPercent:10,yPercent:-18,ease:"none",scrollTrigger:{trigger:".film-forest",start:"top top",end:"bottom top",scrub:2.8}});
gsap.to(".forest__radman",{yPercent:-18,scale:1.08,ease:"none",scrollTrigger:{trigger:".film-forest",start:"18% top",end:"78% top",scrub:1.5}});
gsap.fromTo(".forest__baba",{opacity:0,y:25},{opacity:1,y:0,scrollTrigger:{trigger:".forest__baba",start:"top 72%",end:"top 48%",scrub:true}});
gsap.to(".forest__light",{xPercent:35,yPercent:-18,rotate:7,ease:"none",scrollTrigger:{trigger:".film-forest",start:"20% top",end:"bottom top",scrub:2}});
const mem=gsap.timeline({scrollTrigger:{trigger:".film-memory",start:"top top",end:"+=240%",scrub:1.2,pin:true}});
mem.fromTo(".memory-transition__beam",{scaleY:0,opacity:0},{scaleY:1,opacity:1,duration:.25}).to(".memory-transition__beam",{height:"140%",yPercent:30,duration:.55}).to(".memory-transition",{opacity:0,duration:.22},"-=.18").fromTo(".memory-heading",{opacity:0,y:80},{opacity:1,y:0,duration:.45}).fromTo(".memory-card--one",{opacity:0,x:-80,rotate:-3},{opacity:1,x:0,rotate:-1,duration:.4},"-=.25").fromTo(".memory-card--two",{opacity:0,x:80,rotate:3},{opacity:1,x:0,rotate:1,duration:.4},"-=.25").fromTo(".memory-card--three",{opacity:0,y:90},{opacity:1,y:0,duration:.4},"-=.25").to(".memory-heading",{opacity:.2,y:-40,duration:.3}).to(".memory-card",{scale:.94,opacity:.18,duration:.4},"<");
const beach=gsap.timeline({scrollTrigger:{trigger:".film-beach",start:"top top",end:"bottom top",scrub:1.2,pin:true}});
beach.fromTo(".beach__forest-wash",{opacity:1},{opacity:0,duration:.25}).fromTo(".beach__sky",{yPercent:12,scale:1.12},{yPercent:-5,scale:1,duration:.6},0).fromTo(".beach__photo",{opacity:0,scale:1.16},{opacity:1,scale:1.02,duration:.45},.12).fromTo(".beach__waves",{xPercent:-8},{xPercent:8,duration:.8},0).fromTo(".beach__copy",{opacity:0,y:60},{opacity:1,y:0,duration:.35},.25);
gsap.fromTo(".video-story",{opacity:0,y:70},{opacity:1,y:0,scrollTrigger:{trigger:".video-story",start:"top 78%",end:"top 45%",scrub:1}});
gsap.fromTo(".final-memory",{opacity:0,scale:.97},{opacity:1,scale:1,scrollTrigger:{trigger:".final-memory",start:"top 78%",end:"top 40%",scrub:1}});
},el);return()=>ctx.revert()},[]);
const unlock=()=>{sound.init(); const a=baba.current;if(!a)return;a.volume=.9;a.play().then(()=>{a.pause();a.currentTime=0;setSoundOn(true)}).catch(()=>setSoundOn(false))};
const playBaba=()=>{const a=baba.current;if(!a)return;a.currentTime=0;a.play().catch(()=>undefined)};
return <main ref={root} className="film" onPointerDown={unlock}>
<audio ref={baba} src="/memory/memory-audio.mp3" preload="auto"/>
<section className="film-intro"><div className="film-intro__black"/><div className="film-intro__line"><p>YOU BECAME THE REASON</p><h1>you became<br/>the reason<br/><em>my story never ended.</em></h1><span>Forever, my son.</span></div><div className="film-intro__hint"><i/> SCROLL TO ENTER</div><div className="film-intro__mark">RADMAN · 14 : 15</div></section>
<section className="film-forest"><div className="forest__sky"/><div className="forest__trees"/><div className="forest__mist"><span/><span/><span/></div><div className="forest__light"/><div className="forest__particles">{Array.from({length:42},(_,i)=><i key={i} style={{left:((i*37)%100)+"%",top:(25+((i*19)%70))+"%",animationDelay:(-(i%10))+"s"}}/>)}</div><div className="forest__radman"><div className="forest__radman-halo"/><img src="/memory/radman-sit.png" alt="Radman sitting in the forest"/></div><button className="forest__baba" type="button" onClick={playBaba}><span>RADMAN</span><strong>بابا</strong><small>{soundOn?"listen again":"tap to hear"}</small></button><div className="forest__caption"><span>THE FOREST</span><p>Somewhere between the trees,<br/>I still hear you.</p></div><div className="forest__scroll">KEEP WALKING <i/></div></section>
<section className="film-memory"><div className="memory-transition"><span className="memory-transition__beam"/></div><div className="memory-heading"><span>THE THINGS I REMEMBER</span><h2>Firsts become<br/><em>forever.</em></h2><p>اولین خنده · اولین قدم · اولین روز مهد</p></div>{memories.map((m,i)=><article key={m.en} className={"memory-card memory-card--"+["one","two","three"][i]}><img src={m.image} alt={m.title}/><div><b>0{i+1}</b><span>{m.en}</span><h3>{m.title}</h3></div></article>)}</section>
<section className="film-beach"><div className="beach__sky"/><div className="beach__forest-wash"/><div className="beach__photo"><img src="/memory/radman-and-me.png" alt="Radman and his father"/></div><div className="beach__waves"><span/><span/><span/></div><div className="beach__sand"/><div className="beach__copy"><span>AND THEN THE FOREST OPENED</span><h2>To the sea.</h2><p>جایی که باد آرام‌تر بود، نور گرم‌تر، و ما هنوز کنار هم بودیم.</p></div></section>
<section className="video-story"><div className="video-story__header"><span>ANOTHER MOMENT</span><h2>Keep<br/><em>moving.</em></h2></div><div className="video-story__frame"><video src="/memory/memory-video.mp4" controls playsInline preload="metadata"/></div><p className="video-story__note">A moving memory, preserved exactly as it was.</p></section>
<section className="final-memory"><div className="final-memory__glow"/><img src="/memory/radman-and-me.png" alt=""/><div><span>FOREVER</span><h2>You became the reason<br/><em>my story never ended.</em></h2><p>Forever, my son.</p><small>RADMAN · 14 : 15</small></div></section>
</main>}