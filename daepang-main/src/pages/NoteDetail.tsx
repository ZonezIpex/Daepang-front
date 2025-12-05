// [NoteDetail] 노트 상세(마크다운 보기) + 퀴즈 생성 버튼
import React,{useEffect,useState}from"react";import{useNavigate,useParams}from"react-router-dom";import MarkdownView from"../components/MarkdownView";import{api}from"../api/mock";import{Note}from"../types";
export default function NoteDetail(){const{id}=useParams();const nav=useNavigate();const[note,setNote]=useState<Note|null>(null);
useEffect(()=>{api.getNote(id||"").then(setNote)},[id]);if(!note)return(<div className="container section"><div className="card">자료를 찾을 수 없습니다.</div></div>);
return(<div className="container section">
  {/* 헤더 카드 */}
  <div className="card" style={{padding:"16px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap",background:"linear-gradient(180deg,#fafbff,transparent)",marginBottom:12}}>
    <div>
      <div className="kicker">Note</div>
      <h2 style={{margin:"2px 0 0"}}>{note.title}</h2>
      <div className="muted" style={{fontSize:13}}>{new Date(note.createdAt).toLocaleString()} · @{note.author}</div>
    </div>
    <div style={{display:"flex",gap:8}}>
      <button className="btn" onClick={()=>nav(-1)}>← 뒤로</button>
      <button className="btn btn-primary" onClick={()=>nav(`/quiz/${note.id}`)}>퀴즈 생성</button>
    </div>
  </div>

  <div className="card" style={{padding:0}}><MarkdownView content={`# ${note.title}\n\n${note.content}`}/></div>
</div>)}
