// [Community] 공지사항 목록 — 키워드/날짜/태그 필터 + 미니 카드 스타일
import React,{useMemo,useState}from"react";type Ann={id:string;date:string;title:string;body:string;tags:string[]};
const ALL:Ann[]=[
  {id:"a3",date:"2025-09-05",title:"퀴즈 모듈 개선",body:"문제 난이도 조절 옵션 추가.",tags:["업데이트","퀴즈"]},
  {id:"a4",date:"2025-09-06",title:"점검 안내",body:"9/10(수) 02:00~03:00 점검.",tags:["점검"]},
  {id:"a2",date:"2025-09-02",title:"자료 업로드 정책 업데이트",body:"저작권/인용 표기 가이드 안내.",tags:["정책","저작권"]},
  {id:"a1",date:"2025-08-31",title:"대팡 커뮤니티 오픈",body:"베타 오픈 및 이용 가이드.",tags:["공지","베타"]},
  {id:"a5",date:"2025-08-20",title:"스터디 로드맵 템플릿",body:"6단계 커리큘럼 샘플 배포.",tags:["템플릿"]}
];
const inRange=(d:string,from?:string,to?:string)=>{const x=new Date(d).getTime();if(from&&x<new Date(from).getTime())return false;if(to&&x>new Date(to).getTime())return false;return true};
const uniq=(arr:string[])=>Array.from(new Set(arr));
export default function Community(){
  const[q,setQ]=useState(""),[from,setFrom]=useState(""),[to,setTo]=useState(""),[tag,setTag]=useState("");
  const tags=useMemo(()=>uniq(ALL.flatMap(a=>a.tags)),[]);
  const list=useMemo(()=>ALL
    .filter(a=>inRange(a.date,from||undefined,to||undefined))
    .filter(a=>!tag||a.tags.includes(tag))
    .filter(a=>(a.title+a.body+a.tags.join(" ")).toLowerCase().includes(q.toLowerCase()))
    .sort((a,b)=>+new Date(b.date)-+new Date(a.date)),[q,from,to,tag]);

  return(
  <div className="container section">
    <div className="card" style={{padding:"16px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap",background:"linear-gradient(180deg,#fafbff,transparent)"}}>
      <div>
        <div className="kicker">Community</div>
        <h2 style={{margin:"2px 0 0"}}>📢 공지사항</h2>
        <div className="muted" style={{fontSize:13}}>업데이트와 점검, 정책 변경 소식을 확인하세요.</div>
      </div>
      <div className="badge" style={{fontWeight:700}}>{list.length}건</div>
    </div>

    <div className="card" style={{marginTop:12,display:"grid",gridTemplateColumns:"1fr auto auto auto",gap:8,alignItems:"center"}}>
      <input className="input" placeholder="키워드(예: 점검, 정책...)" value={q} onChange={e=>setQ(e.target.value)} style={{minWidth:220}}/>
      <input className="input" type="date" value={from} onChange={e=>setFrom(e.target.value)}/>
      <input className="input" type="date" value={to} onChange={e=>setTo(e.target.value)}/>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",justifySelf:"end"}}>
        <button className="badge" onClick={()=>setTag(tag===""?"":"")} style={{background:tag===""?"var(--accent, #eef2ff)":undefined}}>전체</button>
        {tags.map(t=>(<button key={t} className="badge" onClick={()=>setTag(t)} style={{background:tag===t?"var(--accent, #eef2ff)":undefined}}>{t}</button>))}
      </div>
    </div>

    <div style={{marginTop:12,display:"grid",gap:12}}>
      {list.length?list.map(a=>(
        <div key={a.id} className="card" style={{padding:0,overflow:"hidden"}}>
          <div style={{display:"grid",gridTemplateColumns:"auto 1fr auto",gap:12,alignItems:"center",padding:14}}>
            <div style={{width:36,height:36,borderRadius:8,display:"grid",placeItems:"center",background:"#eef2ff",color:"#3b5bdb",fontWeight:800}}>i</div>
            <div>
              <div style={{fontWeight:800}}>{a.title}</div>
              <div className="muted" style={{fontSize:13,marginTop:4}}>{a.body}</div>
              <div style={{marginTop:8,display:"flex",gap:6,flexWrap:"wrap"}}>{a.tags.map(t=><span key={t} className="badge">{t}</span>)}</div>
            </div>
            <div><span className="badge" style={{background:"#f6f7f9"}}>{new Date(a.date).toLocaleDateString()}</span></div>
          </div>
        </div>
      )):(
        <div className="card" style={{textAlign:"center",padding:24,color:"var(--muted)"}}>
          조건에 맞는 공지사항이 없습니다.
        </div>
      )}
    </div>
  </div>
  )}
