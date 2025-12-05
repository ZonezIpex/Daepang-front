// [MarkdownView] 마크다운 뷰어 — 고정 목차 + 부드러운 스크롤 + 코드블럭 복사
// UI 개선(2025-09-11):
// - 좌측 '목차'를 sticky로 고정, 현재 섹션 하이라이트
// - 본문 너비/행간/제목 여백 개선
import React, { useEffect, useMemo, useRef, useState } from "react";
import Markdown from "@uiw/react-markdown-preview";

type H = { text: string; level: number; el: HTMLElement };

export default function MarkdownView({ content }: { content: string }){
  const wrapRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [heads, setHeads] = useState<H[]>([]);
  const [active, setActive] = useState<number>(-1);

  // Render 후 헤더 스캔 + 활성 섹션 트래킹
  useEffect(() => {
    const root = bodyRef.current;
    if(!root) return;

    const hs: H[] = [];
    root.querySelectorAll("h1, h2, h3").forEach((el) => {
      const level = el.tagName === "H1" ? 1 : el.tagName === "H2" ? 2 : 3;
      const text = (el as HTMLElement).innerText.trim();
      const id = (el as HTMLElement).id || text.toLowerCase().replace(/\s+/g, "-");
      (el as HTMLElement).id = id;
      hs.push({ text, level, el: el as HTMLElement });
    });
    setHeads(hs);

    const io = new IntersectionObserver((entries) => {
      const vis = entries
        .filter(e => e.isIntersecting)
        .sort((a,b) => (a.boundingClientRect.top - b.boundingClientRect.top));
      if(vis.length){
        const i = hs.findIndex(h => h.el === vis[0].target);
        if(i >= 0) setActive(i);
      }
    }, { rootMargin: "-40% 0px -50% 0px", threshold: [0, 1] });

    hs.forEach(h => io.observe(h.el));
    return () => io.disconnect();
  }, [content]);

  const toc = useMemo(() => {
    return heads.map((h, idx) => (
      <a
        key={idx}
        href={"#" + (h.el.id || "")}
        onClick={(e) => {
          e.preventDefault();
          const el = document.getElementById(h.el.id);
          if(el){ el.scrollIntoView({ behavior: "smooth", block: "start" }); }
        }}
        className={"toc-item" + (idx === active ? " active" : "")}
        style={{
          display: "block",
          fontSize: 14,
          padding: "6px 10px",
          borderRadius: 8,
          marginLeft: (h.level-1) * 12,
          color: "var(--muted)",
          textDecoration: "none",
        }}
      >
        {h.text}
      </a>
    ));
  }, [heads, active]);

  return (
    <div ref={wrapRef} className="md-wrap" style={{display:"grid", gridTemplateColumns:"240px 1fr"}}>
      <aside className="toc" style={{
        borderRight: "1px solid rgba(0,0,0,.06)",
        padding: 14,
        position: "sticky",
        top: 64,
        alignSelf: "start",
        height: "calc(100dvh - 80px)",
        overflow: "auto",
      }}>
        <div className="toc-title" style={{fontWeight:800, marginBottom:8}}>목차</div>
        {toc.length ? toc : <div style={{color:"var(--muted)"}}>제목이 없습니다</div>}
      </aside>

      <div className="md-body" ref={bodyRef} data-color-mode="light" style={{
        padding: 20, minHeight: 320, lineHeight: 1.7
      }}>
        <Markdown source={content} />
      </div>
    </div>
  );
}
