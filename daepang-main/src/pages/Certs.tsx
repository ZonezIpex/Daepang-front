// [Certs] 자격 목록 그리드(6종)
import React from"react";import{useNavigate}from"react-router-dom";import{CERTS}from"../data/certs";
export default function Certs(){const nav=useNavigate();return(
  <div className="container section">
    <div className="card" style={{padding:"16px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap",background:"linear-gradient(180deg,#fafbff,transparent)"}}>
      <div>
        <div className="kicker">Roadmaps</div>
        <h2 style={{margin:"2px 0 0"}}>📚 자격 로드맵</h2>
        <div className="muted" style={{fontSize:13}}>컴퓨터정보학부 맞춤 자격 가이드를 확인하세요.</div>
      </div>
      <div className="badge" style={{fontWeight:700}}>{CERTS.length}종</div>
    </div>

    <div className="grid grid-3" style={{marginTop:12}}>
      {CERTS.map(c=>
        <div key={c.slug} className="card" role="button" tabIndex={0}
          onClick={()=>nav(`/certs/${c.slug}`)} onKeyDown={e=>{if(e.key==="Enter")nav(`/certs/${c.slug}`)}}
          style={{cursor:"pointer",transition:"transform .12s, box-shadow .2s"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",gap:8}}>
            <div style={{fontWeight:800}}>{c.name}</div>
            <span className="badge" style={{background:"#f6f7f9"}}>로드맵</span>
          </div>
          <div style={{color:"var(--muted)",fontSize:13,marginTop:6}}>{c.summary}</div>
          <div style={{marginTop:10}}>
            <button className="btn" onClick={(e)=>{e.stopPropagation();nav(`/certs/${c.slug}`)}}>자세히</button>
          </div>
        </div>
      )}
    </div>
  </div>
)}
