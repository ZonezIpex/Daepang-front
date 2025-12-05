// [CertDetail] 자격 상세 — 상용 서비스형 레이아웃(히어로 + 카드 + 목차 고정)
// 변경 요약(2025-09-11):
// - 상단 히어로 영역 추가(제목/요약)
// - 좌측 고정 목차 + 우측 본문 2컬럼(모바일 1컬럼)
// - MarkdownView는 내부에서 TOC를 생성(기존 컴포넌트 사용)
// - 뒤로가기/목록 버튼 제공
import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getCert } from "../data/certs";
import MarkdownView from "../components/MarkdownView";

export default function CertDetail(){
  const { slug } = useParams();
  const nav = useNavigate();
  const c = slug ? getCert(slug) : undefined;

  if(!c){
    return (
      <div className="container section">
        <div className="card" style={{padding:18}}>
          해당 자격 정보를 찾을 수 없습니다. <Link to="/certs" className="btn" style={{marginLeft:8}}>자격 목록</Link>
        </div>
      </div>
    );
  }

  const md = `# ${c.name}

> ${c.summary}

${c.howto}

${c.plan}

${c.faq ? c.faq : ""}`;

  return (
    <>
      {/* Hero */}
      <section className="section" style={{paddingTop:24, paddingBottom:0}}>
        <div className="container">
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
            <button className="btn" onClick={()=>nav(-1)} aria-label="뒤로 가기">←</button>
            <Link to="/certs" className="btn" aria-label="목록으로">목록</Link>
          </div>

          <div className="card" style={{
            background: "linear-gradient(180deg, rgba(59,130,246,.10), rgba(59,130,246,.04))",
            border: "1px solid rgba(59,130,246,.15)",
            padding: "18px 20px",
          }}>
            <div className="kicker">자격 로드맵</div>
            <h1 className="h1" style={{margin:"6px 0 8px"}}>{c.name}</h1>
            <p className="muted" style={{margin:0}}>{c.summary}</p>
          </div>
        </div>
      </section>

      {/* Body: TOC + Markdown */}
      <section className="section">
        <div className="container">
          <div className="card" style={{padding:0}}>
            {/* MarkdownView: 내부에서 좌측 목차 + 우측 본문 2컬럼 렌더 */}
            <MarkdownView content={md}/>
          </div>
        </div>
      </section>
    </>
  );
}
