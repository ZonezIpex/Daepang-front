// [AIWorkbench] AI 도우미(껍데기) — 요약/퀴즈/태깅 UI와 미리보기
import React,{useState}from"react";const TAB=["요약","퀴즈","태깅"] as const;type TTab=typeof TAB[number];
export default function AIWorkbench(){const[tab,setTab]=useState<TTab>("요약"),[text,setText]=useState("여기에 노트 또는 문서를 붙여넣고 우측 '미리보기'를 눌러 확인하세요."),[n,setN]=useState(5),[lvl,setLvl]=useState("보통"),[out,setOut]=useState("미리보기를 누르면 여기에 결과가 표시됩니다.");const run=()=>{if(tab==="요약")setOut(`✅ 요약(샘플)\n- 핵심1\n- 핵심2\n- 핵심3\n\n원문 길이: ${text.length}자`);else if(tab==="퀴즈")setOut(`✅ 퀴즈(샘플) · 난이도:${lvl} · 문항:${n}\n1) 질문...\nA/B/C/D`);else setOut(`✅ 태깅(샘플)\n#네트워크 #운영체제 #알고리즘`);};
return(<div className="container section">
  <div className="card" style={{padding:"16px 18px",background:"linear-gradient(180deg,#fafbff,transparent)",marginBottom:12}}>
    <div className="kicker">Beta</div>
    <h2 className="h2" style={{marginTop:4}}>AI 도우미</h2>
    <div className="muted" style={{fontSize:13}}>요약/퀴즈/태깅을 미리보기 형태로 체험해보세요.</div>
  </div>
<div className="grid grid-2" style={{marginTop:12}}>
  <div className="card surface">
    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{TAB.map(t=><button key={t} className={`btn ${t===tab?"btn-primary":""}`} onClick={()=>setTab(t)}>{t}</button>)}</div>
    <textarea style={{width:"100%",height:220,marginTop:10,padding:12,border:"1px solid var(--line)",borderRadius:12,font:"13px/1.5 var(--font)"}} value={text} onChange={e=>setText(e.target.value)}/>
    {tab==="퀴즈"&&<div style={{display:"flex",gap:8,marginTop:8,flexWrap:"wrap"}}><select className="input" value={lvl} onChange={e=>setLvl(e.target.value)} style={{width:180}}><option>쉬움</option><option>보통</option><option>어려움</option></select><input className="input" type="number" value={n} min={3} max={20} onChange={e=>setN(+e.target.value)} style={{width:140}}/></div>}
    <div style={{marginTop:10,display:"flex",gap:8}}><button className="btn btn-primary" onClick={run}>미리보기</button><button className="btn" onClick={()=>{setText("");setOut("초기화됨.");}}>초기화</button></div>
    <div style={{marginTop:8,color:"var(--muted)",fontSize:12}}>※ 실제 AI 호출은 연결 전입니다. UI 흐름만 확인하세요.</div>
  </div>
  <div className="card"><div style={{fontWeight:800,marginBottom:6}}>미리보기</div><pre style={{whiteSpace:"pre-wrap",font:"13px/1.5 var(--font)"}}>{out}</pre></div>
</div></div>)}
