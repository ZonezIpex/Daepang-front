// [Home] 랜딩 — 진행도/내 파일 + 공개 갤러리(이미지 2분할, 텍스트 제거)
// 변경 요약(2025-09-12):
// - PosterImage: background-image → <ZoomableImage/>로 교체 (이미지 클릭 시 부드러운 확대/축소 미리보기)
// - 갤러리 이미지 클릭 라우팅 제거(미리보기로만 동작)

import React,{useEffect,useState,FormEvent}from"react";
import{Link,useNavigate}from"react-router-dom";
import{api}from"../api/mock";
import ProgressDonut from"../components/ProgressDonut";
import ResourceCard from"../components/ResourceCard";
import Reveal from"../components/Reveal";
import Stepper from"../components/Stepper";
import{Note}from"../types";
import{CERTS}from"../data/certs";
import{useAuth}from"../App";
import{ZoomableImage}from"../components/ImagePreview";

const TAGS=["JavaScript","Spring","React","TypeScript","SQL","CS","Algorithm"];
const POP=[{t:"JS 핵심",s:"js-core"},{t:"Spring 입문",s:"spring-basic"},{t:"React 요약",s:"react-summary"},{t:"SQL 문법",s:"sql-grammar"},{t:"네트워크",s:"network"}];

// 이미지 포스터 카드 (<ZoomableImage/> 사용)
function PosterImage({src,items,index}:{src:string;items:{src:string;alt?:string;caption?:string}[];index:number}){
  return(
    <div className="card" role="img" aria-label="필기 이미지 미리보기"
      style={{height:220,position:"relative",overflow:"hidden",boxShadow:"var(--shadow, 0 6px 18px rgba(0,0,0,.06))",isolation:"isolate"}}>
      <ZoomableImage src={src} alt="필기 이미지 미리보기" items={items} index={index} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
    </div>
  );
}

export default function Home(){
  const nav=useNavigate();
  const{isLoggedIn}=useAuth();

  // 검색
  const[q,setQ]=useState("");
  const onSubmit=(e:FormEvent)=>{e.preventDefault();const s=q.trim();if(!s)return;nav(`/search?q=${encodeURIComponent(s)}`);};

  // 진행도(로그인시에만)
  const[prog,setProg]=useState({overallPct:0,streakDays:0,completedQuizzes:0});
  useEffect(()=>{if(!isLoggedIn)return;let alive=true;api.getProgress().then(p=>{if(alive)setProg(p)});return()=>{alive=false}},[isLoggedIn]);

  // 최근 내 자료
  const[myNotes,setMyNotes]=useState<Note[]>([]);
  const[loadingMy,setLoadingMy]=useState(true);
  useEffect(()=>{if(!isLoggedIn){setMyNotes([]);setLoadingMy(false);return;}setLoadingMy(true);let alive=true;
    api.listNotes().then(ns=>{if(alive){setMyNotes(ns.slice(0,8));setLoadingMy(false);}});return()=>{alive=false}},[isLoggedIn]);

  // 공개 갤러리(타인 업로드) — 현재는 이미지 2장 프리뷰만 사용
  const[gallery,setGallery]=useState<Note[]>([]);
  useEffect(()=>{let alive=true;api.listOtherNotes().then(ns=>{if(alive)setGallery(ns.slice(0,2))});return()=>{alive=false}},[]);

  return(<>
    {/* ===== Hero ===== */}
    <section className="hero">
      <div className="container" style={{textAlign:"center"}}>
        <div className="kicker">Study Hub</div>
        <h1 className="h1">필기·요약·퀴즈를 한 곳에서, <span className="gradient">빠르게</span></h1>
        <p className="muted" style={{marginTop:6}}>요약 노트 · 기출/모의 · 프로젝트 산출물까지</p>
        <form onSubmit={onSubmit} role="search" aria-label="자료 검색" style={{margin:"18px auto 0",maxWidth:640,display:"flex",gap:8}}>
          <input value={q} onChange={e=>setQ(e.target.value)} className="input" placeholder="예) 스프링 DI, 네트워크 계층, SQL JOIN" aria-label="검색어 입력"/>
          <button className="btn btn-primary" type="submit">검색</button>
        </form>
        <div style={{marginTop:12,display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
          {TAGS.map(t=>(<button key={t} className="badge" onClick={()=>nav(`/study/${t.toLowerCase()}`)}>{t}</button>))}
        </div>
      </div>
    </section>

    {/* ===== 오늘의 진행도(로그인) ===== */}
    {isLoggedIn&&(
      <Reveal>
        <section className="section">
          <div className="container">
            <div className="card surface" style={{display:"grid",gridTemplateColumns:"minmax(160px,220px) 1fr",alignItems:"center",gap:24}}>
              <div style={{justifySelf:"center"}}><ProgressDonut pct={prog.overallPct}/></div>
              <div>
                <div style={{fontSize:20,fontWeight:800,marginBottom:4}}>오늘의 진행도 {prog.overallPct}%</div>
                <div className="muted" style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  <span className="badge">연속 {prog.streakDays}일</span>
                  <span className="badge">퀴즈 {prog.completedQuizzes}개</span>
                </div>
                <div style={{marginTop:14,display:"flex",gap:8,flexWrap:"wrap"}}>
                  <Link to="/upload" className="btn btn-primary">자료 업로드</Link>
                  <Link to="/ai" className="btn">AI 도우미</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>
    )}

    {/* ===== 빠른 시작 ===== */}
    <Reveal delay={60}>
      <section className="section">
        <div className="container"><Stepper steps={["로그인/가입","자료 업로드","저작권 동의","AI 활용(요약·퀴즈)","공개/개인 선택","진행도/결과확인"]}/></div>
      </section>
    </Reveal>

    {/* ===== 최근 내 파일 ===== */}
    <Reveal delay={80}>
      <section className="container section">
        <div className="section-head" style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <h2 className="h2" style={{margin:0}}>최근 내 파일</h2>
          {isLoggedIn?<Link to="/notes" className="btn">전체 보기</Link>:<Link to="/login" className="btn btn-primary">로그인하고 보기</Link>}
        </div>
        {isLoggedIn?(
          loadingMy?(
            <div className="grid grid-4" style={{marginTop:12}}>
              {Array.from({length:8}).map((_,i)=>(<div key={i} className="card skeleton" style={{height:120}}/>))}
            </div>
          ):myNotes.length?(
            <div className="grid grid-4" style={{marginTop:12}}>
              {myNotes.map(n=>(
                <ResourceCard key={n.id} id={n.id} title={n.title}
                  meta={`@${n.author} · ${new Date(n.createdAt).toLocaleDateString()}`}
                  onClick={()=>nav(`/note/${n.id}`)}/>
              ))}
            </div>
          ):(
            <div className="card" style={{padding:18}}>아직 업로드한 자료가 없습니다. <Link to="/upload" className="btn" style={{marginLeft:8}}>지금 업로드</Link></div>
          )
        ):(
          <div className="card" style={{padding:18,color:"var(--muted)"}}>로그인 후 내 파일을 확인할 수 있어요.</div>
        )}
      </section>
    </Reveal>

    {/* ===== 추천 세트 ===== */}
    <Reveal delay={100}>
      <section className="section">
        <div className="container">
          <h2 className="h2">🔥 이번 주 추천 세트</h2>
          <div className="popular-grid" style={{marginTop:12}}>
            {POP.map(p=>(<ResourceCard key={p.s} title={p.t} meta="요약 + 예상문제 세트" seller="someone" onClick={()=>nav(`/sample/${p.s}`)}/>))}
          </div>
        </div>
      </section>
    </Reveal>

    {/* ===== 자격 로드맵 미리보기 ===== */}
    <Reveal delay={140}>
      <section className="container section">
        <h2 className="h2">🎓 자격 로드맵 미리보기</h2>
        <div className="grid grid-3" style={{marginTop:12}}>
          {CERTS.slice(0,3).map(c=>(
            <div key={c.slug} className="card" role="group" aria-label={c.name}
              onClick={()=>nav(`/certs/${c.slug}`)}
              style={{cursor:"pointer"}}>
              <div style={{fontWeight:700,marginBottom:4}}>{c.name}</div>
              <div className="muted" style={{fontSize:13}}>{c.summary}</div>
            </div>
          ))}
          <div className="card" style={{display:"flex",alignItems:"center",justifyContent:"center"}}><Link to="/certs" className="btn">전체 보기</Link></div>
        </div>
      </section>
    </Reveal>

    {/* ===== 공개 필기 갤러리(이미지 2분할, 텍스트 제거) ===== */}
    <Reveal delay={170}>
      <section className="container section" style={{position:"relative",isolation:"isolate"}}>
        <h2 className="h2" style={{marginBottom:12}}>🖼️ 필기 갤러리</h2>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          {(()=>{const items=["/view1.png","/view2.png"].map((s,i)=>({src:s,alt:`필기 이미지 ${i+1}`,caption:`공개 필기 미리보기 ${i+1}`}));
            return items.map((it,i)=>(<div key={it.src}><PosterImage src={it.src} items={items} index={i}/></div>))})()}
        </div>
      </section>
    </Reveal>
  </>);
}
