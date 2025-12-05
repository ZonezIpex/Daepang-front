// [Stepper] 사용 흐름(다이어그램 요약)을 가로 배지 형태로 표현
import React from"react";export default function Stepper({steps}:{steps:string[]}){return(<div className="stepper">{steps.map((s,i)=>(<div key={i} className="step"><span className="dot"/> {s}</div>))}</div>)}
