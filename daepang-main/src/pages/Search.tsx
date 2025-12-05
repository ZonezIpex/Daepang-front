// [Search] 검색 — 하이라이트/즐겨찾기 필터/스켈레톤
import React,{useEffect,useMemo,useState}from"react";import{Link,useLocation,useNavigate}from"react-router-dom";
import{api}from"../api/mock";import{Note}from"../types";import ResourceCard from"../components/ResourceCard";
const SUBJECTS=["javascript","spring","react","typescript","algorithm","cs","sql"];const useQ=()=>new URLSearchParams(useLocation().search).get("q")||"";
const HL=(t:string,q:string)=>{if(!q)return t;const r=new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")})`,"ig");const parts=t.split(r);return parts.map((p,i)=>r.test(p)?<mark key={i} className="hl">{p}</mark>:<span key={i}>{p}</span>)};
export default function Search(){
	const q=useQ();const[notes,setNotes]=useState<Note[]>([]);const[loading,setLoading]=useState(true);const nav=useNavigate();const[favOnly,setFavOnly]=useState(false);const[favs,setFavs]=useState<string[]>(api.favIds());
	useEffect(()=>{let alive=true;api.listNotes().then(ns=>{if(!alive)return;setNotes(ns);setLoading(false)});return()=>{alive=false}},[q]);
	useEffect(()=>{const i=setInterval(()=>setFavs(api.favIds()),600);return()=>clearInterval(i)},[]);
	const list=useMemo(()=>{const k=q.toLowerCase();const filtered=notes.filter(n=>n.title.toLowerCase().includes(k)||(n.tags||[]).some(t=>t.toLowerCase().includes(k)));return favOnly?filtered.filter(n=>favs.includes(n.id)):filtered},[notes,q,favOnly,favs]);
	const quick=SUBJECTS.filter(s=>s.includes(q.toLowerCase()));
	return(<div className="container section">
		<div className="card" style={{padding:"16px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap",background:"linear-gradient(180deg,#fafbff,transparent)"}}>
			<div>
				<div className="kicker">Search</div>
				<h2 style={{margin:"2px 0 0"}}>🔎 검색: <span style={{color:"var(--brand)"}}>{q}</span></h2>
				<div className="muted" style={{fontSize:13}}>관련 자료를 빠르게 찾아보세요.</div>
			</div>
			<label className="badge" style={{display:"flex",gap:8,alignItems:"center",cursor:"pointer"}}>
				<input type="checkbox" checked={favOnly} onChange={e=>setFavOnly(e.target.checked)}/> 즐겨찾기만
			</label>
		</div>

		<div style={{display:"flex",gap:8,flexWrap:"wrap",margin:"8px 0 16px"}}>{quick.map(s=><button key={s} className="badge" onClick={()=>nav(`/study/${s}`)}>{s.toUpperCase()}</button>)}</div>

		{loading?
			<div className="grid grid-4">{Array.from({length:8}).map((_,i)=>(<div key={i} className="skeleton skeleton-card"><div className="skeleton-line lg" style={{width:"70%"}}></div><div className="skeleton-gap"/><div className="skeleton-line" style={{width:"40%"}}></div></div>))}</div>
			: list.length?
				<div className="grid grid-4">{list.map(n=>
					<ResourceCard key={n.id} id={n.id} title={HL(n.title,q) as any} meta={new Date(n.createdAt).toLocaleDateString()} seller={n.author} onClick={()=>nav(`/note/${n.id}`)}/>)}</div>
				: <div className="card" style={{textAlign:"center",color:"var(--muted)"}}>결과가 없습니다.</div>}
	</div>)}
