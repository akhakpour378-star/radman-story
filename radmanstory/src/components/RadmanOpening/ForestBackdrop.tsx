"use client";
import "./ForestBackdrop.css";
const far=Array.from({length:18},(_,i)=>({x:3+i*5.6,h:18+(i*17)%22}));
const near=Array.from({length:11},(_,i)=>({x:-4+i*10.8,h:34+(i*23)%28}));
export default function ForestBackdrop(){
 return <div className="forest-backdrop" aria-hidden="true">
  <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" className="forest-backdrop__svg">
   <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#07100d"/><stop offset=".5" stopColor="#13221b"/><stop offset="1" stopColor="#050806"/></linearGradient>
    <radialGradient id="glow"><stop stopColor="#d7dfcc" stopOpacity=".22"/><stop offset=".4" stopColor="#9faf99" stopOpacity=".06"/><stop offset="1" stopColor="#000" stopOpacity="0"/></radialGradient>
    <linearGradient id="path" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#d9dfce" stopOpacity=".02"/><stop offset="1" stopColor="#d9dfce" stopOpacity=".22"/></linearGradient>
    <linearGradient id="farTree"><stop stopColor="#07100b"/><stop offset=".5" stopColor="#0d1812"/><stop offset="1" stopColor="#040806"/></linearGradient>
    <linearGradient id="nearTree"><stop stopColor="#010302"/><stop offset=".5" stopColor="#07100b"/><stop offset="1" stopColor="#020403"/></linearGradient>
    <filter id="blur"><feGaussianBlur stdDeviation="24"/></filter>
   </defs>
   <rect width="1600" height="1000" fill="url(#sky)"/><rect width="1600" height="1000" fill="url(#glow)"/>
   <g opacity=".9">{far.map((t,i)=><path key={i} transform={`translate(${t.x*16} 0)`} d={`M30 1000L30 ${1000-t.h*8}L5 ${1000-t.h*8+60}L55 ${1000-t.h*8+38}L8 ${1000-t.h*8+105}L58 ${1000-t.h*8+72}L75 ${1000-t.h*8+122}L30 ${1000-t.h*8+95}Z`} fill="url(#farTree)"/>)}</g>
   <path d="M650 1000C710 870 755 770 790 660C812 585 824 535 830 485C837 535 850 585 872 660C905 770 955 870 1035 1000Z" fill="url(#path)"/>
   <g>{near.map((t,i)=><path key={i} transform={`translate(${t.x*15} 0)`} d={`M52 1000C42 850 45 730 49 620L20 670L54 560L28 600L58 500L44 530L62 ${1000-t.h*9}L70 530L100 600L76 575L112 675L82 630C90 760 94 870 86 1000Z`} fill="url(#nearTree)"/>)}</g>
   <g opacity=".4"><path d="M0 230C250 170 420 210 620 300S1100 250 1600 160" fill="none" stroke="#07120d" strokeWidth="75"/><path d="M0 285C250 230 420 265 620 345S1100 295 1600 205" fill="none" stroke="#0b1811" strokeWidth="38"/></g>
   <g filter="url(#blur)" opacity=".22"><ellipse cx="360" cy="650" rx="360" ry="90" fill="#d9dfd0"/><ellipse cx="1250" cy="690" rx="420" ry="100" fill="#cfd8c7"/></g>
   <circle cx="1260" cy="190" r="76" fill="#e4e4d5" opacity=".055"/><circle cx="1260" cy="190" r="42" fill="#ecebdc" opacity=".08"/>
  </svg>
  <div className="forest-backdrop__mist forest-backdrop__mist--one"/><div className="forest-backdrop__mist forest-backdrop__mist--two"/><div className="forest-backdrop__vignette"/>
 </div>
}