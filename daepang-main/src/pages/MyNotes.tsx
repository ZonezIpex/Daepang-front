// [MyNotes] 내 노트 — 즐겨찾기 필터 지원
import React,{useEffect,useState}from"react";
import{Link,useNavigate}from"react-router-dom";
import{api}from"../api/mock";
import{Note}from"../types";

export default function MyNotes(){
	const nav=useNavigate();
	const[list,setList]=useState<Note[]>([]);
	const[sel,setSel]=useState<string[]>([]);
	const[favOnly,setFavOnly]=useState(false);
	const[favs,setFavs]=useState<string[]>(api.favIds());

	useEffect(()=>{api.listNotes().then(setList)},[]);
	useEffect(()=>{const i=setInterval(()=>setFavs(api.favIds()),600);return()=>clearInterval(i)},[]);

	const toggle=(id:string)=>setSel(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id]);
	const view=favOnly?list.filter(n=>favs.includes(n.id)):list;

	return(<div className="container section">
		{/* 헤더 요약 */}
		<div className="card" style={{padding:"16px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap",background:"linear-gradient(180deg,#fafbff,transparent)"}}>
			<div>
				<div className="kicker">My Library</div>
				<h2 style={{margin:"2px 0 0"}}>내 자료</h2>
				<div className="muted" style={{fontSize:13}}>총 {view.length}개 · 즐겨찾기 {view.filter(n=>favs.includes(n.id)).length}개</div>
			</div>
			<label className="badge" style={{display:"flex",gap:8,alignItems:"center",cursor:"pointer"}}>
				<input type="checkbox" checked={favOnly} onChange={e=>setFavOnly(e.target.checked)}/> 즐겨찾기만 보기
			</label>
		</div>

		{/* 카드 그리드 */}
		<div className="grid grid-4" style={{marginTop:12}}>{view.map(n=>(
			<label key={n.id} className="card rc" style={{cursor:"pointer",padding:14,display:"grid",gap:8}}>
				<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
					<div style={{display:"flex",alignItems:"center",gap:8}}>
						<input type="checkbox" checked={sel.includes(n.id)} onChange={()=>toggle(n.id)}/>
						<span className="badge" style={{background:"#f6f7f9"}}>{new Date(n.createdAt).toLocaleDateString()}</span>
					</div>
					<button className={`badge`} onClick={(e)=>{e.stopPropagation();e.preventDefault();api.toggleFav(n.id);setFavs(api.favIds());}} style={{background:api.isFav(n.id)?"#fff3bf":"#f6f7f9",color:api.isFav(n.id)?"#e67700":undefined}}>{api.isFav(n.id)?"★ 즐겨찾기":"☆ 즐겨찾기"}</button>
				</div>
				<div style={{fontWeight:800,lineHeight:1.35}}>{n.title}</div>
				<div style={{display:"flex",gap:8,marginTop:4}}>
					<Link to={`/note/${n.id}`} className="btn btn-primary">열기</Link>
					<button className="btn" onClick={(e)=>{e.preventDefault();e.stopPropagation();toggle(n.id)}}>{sel.includes(n.id)?"선택 해제":"비교 선택"}</button>
				</div>
			</label>
		))}
		</div>

		{sel.length===2&&(
			<div className="card" style={{marginTop:12,display:"flex",justifyContent:"space-between",alignItems:"center",gap:12}}>
				<div>선택된 항목: <span className="badge">{sel[0]}</span> <span className="badge">{sel[1]}</span></div>
				<button className="btn btn-primary" onClick={()=>nav(`/compare/${sel[0]}/${sel[1]}`)}>선택 2개 비교</button>
			</div>
		)}

		{/* 🔽 작성(업로드)로 이동하는 플로팅 버튼 */}
		<Link to="/upload" className="fab" aria-label="새 자료 작성">＋</Link>

	</div>)}

