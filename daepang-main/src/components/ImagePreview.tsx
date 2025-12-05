// components/ImagePreview.tsx
import React,{useCallback,useEffect,useMemo,useRef,useState}from"react";
import{createPortal}from"react-dom";

type PreviewItem={src:string;alt?:string;hiResSrc?:string;caption?:string};
type PreviewState={
  src:string;alt?:string;startRect:DOMRect;borderRadius?:number;
  items?:PreviewItem[];index?:number; // 그룹 네비게이션용
  trigger?:HTMLElement|null; // 닫힐 때 포커스 복귀
};

export function useImagePreview(){
  const[st,setSt]=useState<PreviewState|null>(null);
  const[closing,setClosing]=useState(false);

  // 스크롤 잠금
  useEffect(()=>{if(!st)return;const prev=document.body.style.overflow;document.body.style.overflow="hidden";return()=>{document.body.style.overflow=prev}},[st]);

  // 닫기 (애니메이션 시간과 동기화)
  const close=useCallback(()=>{
    if(!st||closing)return;
    setClosing(true);
    const prefersReduce=window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches??false;
    const DURATION_MS=prefersReduce?1:450;
    window.setTimeout(()=>{setSt(null);setClosing(false)},DURATION_MS);
  },[st,closing]);

  // ESC 닫기
  useEffect(()=>{if(!st)return;const on=(e:KeyboardEvent)=>{if(e.key==="Escape")close()};window.addEventListener("keydown",on);return()=>window.removeEventListener("keydown",on)},[st,close]);

  // 열기
  const open=useCallback((img:HTMLImageElement,opts?:{alt?:string;borderRadius?:number;items?:PreviewItem[];index?:number})=>{
    const r=img.getBoundingClientRect();
    const s=(img.currentSrc||img.src||img.getAttribute("data-zoom-src")||"").toString();
    setSt({src:s,alt:opts?.alt,startRect:r,borderRadius:opts?.borderRadius,items:opts?.items,index:opts?.index??0,trigger:img});setClosing(false);
  },[]);

  /** 오버레이 (항상 훅 최상단) */
  function Preview(){
    const prefersReduce=useMemo(()=>window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches??false,[]);
    const imgRef=useRef<HTMLImageElement|null>(null);
    const btnRef=useRef<HTMLButtonElement|null>(null);
    const[entered,setEntered]=useState(false); // false: from, true: to
    const DUR=prefersReduce?"1ms":"450ms";
    const EASE="cubic-bezier(.22,.61,.36,1)";
    const[loading,setLoading]=useState(false);
    const[error,setError]=useState<string|undefined>(undefined);
    const[zoom,setZoom]=useState(1);
    const[pan,setPan]=useState({x:0,y:0});
    const dragStart=useRef<{x:number;y:number;panX:number;panY:number}|null>(null);
    // 스와이프(모바일)
    const touch=useRef<{x:number;y:number}|null>(null);
    // 외부에서 useEffect에서 호출하기 위해 ref에 보관 (항상 훅 순서 상단)
    const goToRef=useRef<((d:1|-1)=>void)|null>(null);

    // 마운트 후 1) from로 페인트 → 2) 강제 리플로우 → 3) to로 전환
    useEffect(()=>{
      if(!st)return;
      setEntered(false);setZoom(1);setPan({x:0,y:0});setLoading(false);setError(undefined);
      // 포커스
      btnRef.current?.focus({preventScroll:true});
      // 강제 리플로우로 초기 상태 고정
      void imgRef.current?.getBoundingClientRect();
      // 다음 프레임에서 to 상태로 (두 번의 rAF로 확실히 분리)
      let id2:number|undefined;
      const id=window.requestAnimationFrame(()=>{
        id2=window.requestAnimationFrame(()=>setEntered(true));
      });
      return()=>{
        window.cancelAnimationFrame(id);
        if(id2!==undefined)window.cancelAnimationFrame(id2);
      };
    },[st]);

    // 키보드: 좌우, ESC는 상위에서 처리 (항상 훅 호출, 내부에서 가드)
    useEffect(()=>{const h=(e:KeyboardEvent)=>{if(!st)return;const items=st.items;const index=st.index??0;const hasGroup=Array.isArray(items)&&items.length>1;const canPrev=hasGroup&&index>0;const canNext=hasGroup&&items&&index<items.length-1;if(e.key==="ArrowRight"&&canNext)goToRef.current?.(1);else if(e.key==="ArrowLeft"&&canPrev)goToRef.current?.(-1)};window.addEventListener("keydown",h);return()=>window.removeEventListener("keydown",h)},[st]);
    // 프리로드 next/prev (항상 훅 호출, 내부에서 가드)
    useEffect(()=>{if(!st)return;const items=st.items;const index=st.index??0;if(!items||items.length<2)return;const n=items[index+1];const p=items[index-1];[n,p].forEach(it=>{if(!it)return;const img=new Image();img.src=it.hiResSrc||it.src})},[st]);

    if(!st) return null;

    const{startRect,src,alt,borderRadius=12,items,index=0}=st;
    const vw=window.innerWidth,vh=window.innerHeight;
    // 화면 가장자리에 4% 마진을 남기며 중앙 정렬
    const maxW=vw*0.92,maxH=vh*0.92;
    const scale=Math.min(maxW/startRect.width,maxH/startRect.height);
    const targetCenterX=vw/2;
    const targetCenterY=vh/2;
    // 스케일이 먼저 적용되고, 이후 translate가 적용되므로 스케일을 반영한 중앙 정렬 위치 계산
    const targetLeft=targetCenterX-(startRect.width*scale)/2;
    const targetTop=targetCenterY-(startRect.height*scale)/2;
    const dx=targetLeft-startRect.left;
    const dy=targetTop-startRect.top;

    const FROM="translate3d(0,0,0) scale(1)";
    const TO=`translate3d(${dx}px,${dy}px,0) scale(${scale})`;

    // 네비게이션
    const hasGroup=Array.isArray(items)&&items.length>1;
    const canPrev=hasGroup&&index>0;
    const canNext=hasGroup&&items&&index<items.length-1;
    const goTo=(dir:1|-1)=>{
      if(!items||items.length<2)return;
      const nextIdx=Math.max(0,Math.min(items.length-1,(index??0)+dir));
      if(nextIdx===index)return;
      const current=items[nextIdx];
      setLoading(!!current.hiResSrc);setError(undefined);
      setSt(s=>{
        if(!s) return s;
        const next:PreviewState={...s,src:current.src,alt:current.alt,startRect:s.startRect,items:items,index:nextIdx};
        return next;
      });
      if(current.hiResSrc){
        const hi=current.hiResSrc;
        const img=new Image();
        img.onload=()=>{setSt(s=>{if(!s) return s;const next:PreviewState={...s,src:hi};return next});setLoading(false)};
        img.onerror=()=>{setLoading(false);setError("이미지 로드 실패")};
        img.src=hi;
      }
    };
    goToRef.current=goTo;

    // (중복 제거) 하단 조건부 훅 제거, 상단의 가드된 훅만 유지

    // 휠 줌
    const onWheel=(e:React.WheelEvent)=>{if(!entered||closing)return;const dz=e.deltaY>0?-0.1:0.1;const nz=Math.max(1,Math.min(3,zoom+dz));setZoom(nz)};
    // 더블클릭/탭 줌 토글
    const onDoubleClick=()=>setZoom(z=>z>1?1:2);
    // 드래그 팬
    const onMouseDown=(e:React.MouseEvent)=>{if(zoom<=1)return;dragStart.current={x:e.clientX,y:e.clientY,panX:pan.x,panY:pan.y}};
    const onMouseMove=(e:React.MouseEvent)=>{if(!dragStart.current)return;const dx=e.clientX-dragStart.current.x;const dy=e.clientY-dragStart.current.y;setPan({x:dragStart.current.panX+dx,y:dragStart.current.panY+dy})};
    const onMouseUp=()=>{dragStart.current=null};

    const onTouchStart=(e:React.TouchEvent)=>{touch.current={x:e.touches[0].clientX,y:e.touches[0].clientY}};
    const onTouchEnd=(e:React.TouchEvent)=>{if(!touch.current)return;const dx=e.changedTouches[0].clientX-touch.current.x;const dy=e.changedTouches[0].clientY-touch.current.y;if(Math.abs(dx)>60&&Math.abs(dy)<40){if(dx<0&&canNext)goTo(1);if(dx>0&&canPrev)goTo(-1)}touch.current=null};

    return createPortal(
      <div aria-modal="true" role="dialog" style={{position:"fixed",inset:0,zIndex:9999}}>
        {/* DIM */}
        <div onClick={close} style={{
          position:"absolute",inset:0,transition:`background ${DUR} ${EASE}`,
          background:(!entered||closing)?"rgba(0,0,0,0)":"rgba(0,0,0,.6)"
        }}/>
        {/* 확대 이미지 */}
        <img ref={imgRef} src={src} alt={alt||""} draggable={false}
          onWheel={onWheel} onDoubleClick={onDoubleClick}
          onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp}
          onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
          style={{
          position:"fixed",left:startRect.left,top:startRect.top,
          width:startRect.width,height:startRect.height,
          transformOrigin:"top left",borderRadius,
          boxShadow:"0 18px 60px rgba(0,0,0,.38)",
          transition:`transform ${DUR} ${EASE},border-radius ${DUR} ${EASE}`,
          // 초기 프레임에는 FROM으로 그렸다가 entered=true가 되면 TO로 전환
          transform:(closing?FROM:(entered?TO:FROM))+` translate3d(${pan.x}px,${pan.y}px,0) scale(${zoom})`,
          willChange:"transform",pointerEvents:"auto",userSelect:"none",cursor:zoom>1?"grab":"zoom-out"
        }}/>
        {/* 캡션/로딩/에러 */}
        <div style={{position:"fixed",left:0,right:0,bottom:0,display:"flex",justifyContent:"center",pointerEvents:"none"}}>
          <div style={{margin:16,padding:"8px 12px",borderRadius:10,background:"rgba(0,0,0,.45)",color:"#fff",maxWidth:"82%",fontSize:13,backdropFilter:"blur(6px)",pointerEvents:"auto"}}>
            {loading?"고화질 로딩 중...":(error||((items&&items[index||0]?.caption)||alt)||"")}
          </div>
        </div>
        {/* 네비게이션 버튼 */}
        {hasGroup&&(
          <>
            <button aria-label="이전" disabled={!canPrev} onClick={()=>goTo(-1)}
              style={{position:"fixed",top:"50%",left:12,transform:"translateY(-50%)",opacity:canPrev?1:.4,
              padding:"10px 12px",borderRadius:999,border:"1px solid rgba(255,255,255,.25)",background:"rgba(0,0,0,.35)",color:"#fff",cursor:canPrev?"pointer":"default"}}>{"<"}</button>
            <button aria-label="다음" disabled={!canNext} onClick={()=>goTo(1)}
              style={{position:"fixed",top:"50%",right:12,transform:"translateY(-50%)",opacity:canNext?1:.4,
              padding:"10px 12px",borderRadius:999,border:"1px solid rgba(255,255,255,.25)",background:"rgba(0,0,0,.35)",color:"#fff",cursor:canNext?"pointer":"default"}}>{">"}</button>
          </>
        )}
        {/* 닫기 */}
        <button ref={btnRef} onClick={()=>{close();st?.trigger?.focus?.();}} aria-label="닫기"
          onMouseDown={e=>e.stopPropagation()} onClickCapture={e=>e.stopPropagation()}
          style={{position:"fixed",top:16,right:16,padding:"10px 14px",borderRadius:999,
          border:"1px solid rgba(255,255,255,.25)",background:"rgba(0,0,0,.35)",
          color:"#fff",fontSize:14,backdropFilter:"blur(6px)",cursor:"pointer",zIndex:10000}}>닫기</button>
      </div>,document.body
    );
  }

  return[open,Preview] as const;
}

// 썸네일 대체: 클릭 시 프리뷰 오픈
type ZoomableProps=React.ImgHTMLAttributes<HTMLImageElement>&{items?:PreviewItem[];index?:number;hiResSrc?:string;caption?:string};
export function ZoomableImage(p:ZoomableProps){
  const[open,Preview]=useImagePreview();
  const{style,onClick,...rest}=p;
  const r=parseFloat(String((style as any)?.borderRadius??12))||12;
  return<>
    <img {...rest} style={{...style,cursor:"zoom-in"}}
      onClick={e=>{(onClick as any)?.(e);open(e.currentTarget as HTMLImageElement,{alt:p.alt,borderRadius:r,items:p.items||((p as any).items),index:p.index});}}/>
    <Preview/>
  </>;
}
