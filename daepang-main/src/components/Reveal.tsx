// [Reveal] 스크롤 내려오면 '스르륵' 한 번만 나타나고, 다시 올라가도 사라지지 않음(once)
import React,{useEffect,useRef,useState}from"react";
type Props={children:React.ReactNode;delay?:number;once?:boolean};
export default function Reveal({children,delay=0,once=true}:Props){
  const ref=useRef<HTMLDivElement>(null);const[show,setShow]=useState(false);
  useEffect(()=>{const el=ref.current;if(!el)return;
    const io=new IntersectionObserver(([e])=>{if(e.isIntersecting){setShow(true);if(once)io.unobserve(el);}},{rootMargin:"-20% 0px -20% 0px",threshold:.2});
    io.observe(el);return()=>io.disconnect();
  },[once]);
  return(<div ref={ref} className={`reveal${show?" show":""}`} style={{transitionDelay:`${delay}ms`}}>{children}</div>);
}
