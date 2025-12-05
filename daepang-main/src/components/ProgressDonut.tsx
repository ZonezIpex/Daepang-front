// [ProgressDonut] 진행률 도넛(그라데이션 스트로크+진행점) — 홈/로드맵 등에서 재사용
import React from"react";
export default function ProgressDonut({pct,size=130}:{pct:number;size?:number}){
  const r=44,c=2*Math.PI*r,o=c-(c*(pct||0))/100,ang=(pct/100)*2*Math.PI-Math.PI/2,x=50+r*Math.cos(ang),y=50+r*Math.sin(ang);
  return(<svg width={size} height={size} viewBox="0 0 100 100">
    <defs><linearGradient id="pg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#1d4ed8"/></linearGradient></defs>
    <circle cx="50" cy="50" r={r} fill="none" stroke="#eee" strokeWidth="8"/>
    <circle cx="50" cy="50" r={r} fill="none" stroke="url(#pg)" strokeWidth="8" strokeDasharray={`${c} ${c}`} strokeDashoffset={o} strokeLinecap="round" transform="rotate(-90 50 50)"/>
    <circle cx={x} cy={y} r="3.5" fill="#1d4ed8" stroke="#fff" strokeWidth="1.5"/>
    <text x="50" y="54" textAnchor="middle" fontSize="14" fontWeight="700">{pct}%</text>
  </svg>)}
