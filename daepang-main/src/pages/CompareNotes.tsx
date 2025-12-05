// [CompareNotes] 노트 두 개의 차이 비교(diff-match-patch)
import React,{useEffect,useState}from"react";import{useParams}from"react-router-dom";import{api}from"../api/mock";import{Note}from"../types";import DMP from"diff-match-patch";
const dmp=new DMP();const diffHTML=(a:string,b:string)=>{const ds=dmp.diff_main(a,b);dmp.diff_cleanupSemantic(ds);return ds.map(([op,text])=>op===0?text:op===-1?`<del style="background:#ffe6e6">${text}</del>`:`<ins style="background:#e6ffef">${text}</ins>`).join("")};
export default function CompareNotes(){const{ idA,idB }=useParams();const[a,setA]=useState<Note|null>(null),[b,setB]=useState<Note|null>(null);
useEffect(()=>{api.getNote(idA||"").then(setA);api.getNote(idB||"").then(setB)},[idA,idB]);
if(!a||!b)return(<div className="container section"><div className="card">불러오는 중...</div></div>);
return(<div className="container section">
  <div className="card" style={{padding:"16px 18px",background:"linear-gradient(180deg,#fafbff,transparent)",marginBottom:12}}>
    <div className="kicker">Compare</div>
    <h2 style={{margin:"2px 0 0"}}>노트 비교</h2>
    <div className="muted" style={{fontSize:13}}>좌우로 차이를 빠르게 확인하세요.</div>
  </div>
  <div className="grid grid-2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
    <div className="card"><div style={{fontWeight:800,marginBottom:6}}>{a.title}</div><div dangerouslySetInnerHTML={{__html:diffHTML(a.content,b.content)}}/></div>
    <div className="card"><div style={{fontWeight:800,marginBottom:6}}>{b.title}</div><div dangerouslySetInnerHTML={{__html:diffHTML(b.content,a.content)}}/></div>
  </div>
</div>)}
