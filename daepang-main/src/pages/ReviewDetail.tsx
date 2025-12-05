// [ReviewDetail] 리뷰 상세 내용 보기 - 마크다운 뷰어와 목차 포함
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Markdown from "@uiw/react-markdown-preview";

type H = { text: string; level: number; el: HTMLElement };

type Review = {
  id: string;
  author: string;
  title: string;
  content: string;
  rating: number;
  date: string;
  tags: string[];
};

const REVIEWS: Record<string, Review> = {
  "o1": { 
    id: "o1", 
    author: "승혁", 
    title: "태그 기능 좋아요", 
    content: `# 태그 기능에 대한 리뷰

## 개요
대팡의 태그 기능이 정말 유용하다고 생각합니다. 특히 검색할 때 빠르게 찾을 수 있어서 좋습니다. 사용자 경험이 많이 향상된 것 같고, 앞으로도 이런 방향으로 발전해주시면 좋겠습니다.

## 장점
- **빠른 검색**: 태그를 통해 원하는 자료를 쉽게 찾을 수 있음
- **직관적**: 사용자가 이해하기 쉬운 구조
- **효율적**: 시간을 절약할 수 있음
- **사용자 친화적**: 직관적인 인터페이스

## 개선 제안
다른 기능들도 이런 식으로 개선되면 더욱 편리할 것 같아요. 특히 필터링 기능이 더 다양해지면 좋겠습니다. 정말 만족스러운 기능이에요.

## 결론
전반적으로 만족스러운 기능입니다. 앞으로도 이런 방향으로 발전해주시면 좋겠어요!`, 
    rating: 5, 
    date: "2025-09-06", 
    tags: ["태그", "검색", "기능"] 
  },
  "o2": { 
    id: "o2", 
    author: "한울", 
    title: "모바일 최적화", 
    content: `# 모바일 최적화에 대한 의견

## 성능 개선
속도가 빨라졌네요. 이전 버전보다 훨씬 부드럽게 동작합니다. 특히 터치 반응성이 좋아졌고, 스크롤도 부드러워졌습니다.

## 사용자 경험
- 로딩 시간 단축
- 스크롤 성능 향상
- 터치 반응성 개선
- 부드러운 애니메이션

## 아쉬운 점
다만 일부 기능에서 아직 개선이 필요한 부분이 있는 것 같아요:
- 일부 버튼이 작아서 터치하기 어려움
- 가로 모드에서 레이아웃이 깨지는 경우 있음
- 일부 기능에서 아직 개선이 필요한 부분이 있어 보입니다

## 총평
전반적으로는 만족스러운 업데이트였습니다. 하지만 세부적인 개선이 더 필요해 보입니다.`, 
    rating: 4, 
    date: "2025-09-05", 
    tags: ["모바일", "성능", "UI"] 
  },
  "o3": { 
    id: "o3", 
    author: "동원", 
    title: "검색 성능 희망", 
    content: `# 검색 성능 개선 요청

## 현재 상황
더 빨라지면 좋겠습니다. 현재도 나쁘지 않지만, 대용량 데이터를 다룰 때는 조금 느린 느낌이 있어요. 특히 복잡한 검색어를 입력할 때 결과가 나오기까지 시간이 걸리는 경우가 있습니다.

## 문제점
- 대량의 자료가 있을 때 검색 속도 저하
- 복잡한 검색어 처리 시 지연
- 실시간 검색 결과 업데이트가 느림
- 인덱싱 최적화 필요

## 개선 방안
- 인덱싱 최적화
- 캐싱 시스템 도입
- 검색 알고리즘 개선
- 사용자 경험 측면에서 검색 속도는 정말 중요한 요소

## 기대사항
빠른 검색으로 더 나은 서비스를 제공해주시면 감사하겠습니다. 사용자 경험 측면에서 검색 속도는 정말 중요한 요소라고 생각해요.`, 
    rating: 3, 
    date: "2025-09-04", 
    tags: ["검색", "성능", "개선"] 
  },
  "o4": { 
    id: "o4", 
    author: "현서", 
    title: "깔끔한 UI", 
    content: `# UI 디자인에 대한 칭찬

## 첫인상
보기 좋고 정돈됐어요. 사용하기 편리하고 직관적인 인터페이스입니다. 색상 배치도 조화롭고, 폰트도 읽기 편해서 좋습니다.

## 디자인 요소
- **색상**: 조화로운 색상 배치
- **레이아웃**: 깔끔하고 정돈된 구성
- **타이포그래피**: 읽기 쉬운 폰트와 크기
- **버튼과 링크**: 크기도 적절하고 전체적인 레이아웃이 깔끔

## 사용성
- 직관적인 네비게이션
- 명확한 버튼과 링크
- 일관된 디자인 패턴
- 처음 사용하는 사람도 쉽게 적응할 수 있음

## 만족도
계속 이런 방향으로 발전해주세요! 정말 잘 만들어진 것 같습니다. 디자인 일관성도 잘 유지되고 있고, 전반적으로 정말 잘 만들어진 것 같아요. 앞으로도 이런 수준의 디자인을 유지해주시면 좋겠습니다.`, 
    rating: 4, 
    date: "2025-09-03", 
    tags: ["UI", "디자인", "사용성"] 
  }
};

export default function ReviewDetail() {
  const { id } = useParams();
  const review = REVIEWS[id || ""];
  const wrapRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [heads, setHeads] = useState<H[]>([]);

  // 렌더 후 헤더 스캔
  useEffect(() => {
    const root = bodyRef.current;
    if (!root) return;

    const hs = Array.from(root.querySelectorAll("h1,h2,h3")) as HTMLElement[];
    const arr: H[] = hs.map(el => ({
      text: el.textContent || "",
      level: el.tagName === "H1" ? 1 : el.tagName === "H2" ? 2 : 3,
      el
    }));
    setHeads(arr);
  }, [review?.content]);

  const onJump = (h: H) => h.el.scrollIntoView({ behavior: "smooth", block: "start" });
  const toc = useMemo(
    () => heads.map((h, i) => (
      <a key={i} className={h.level === 1 ? "lv1" : h.level === 2 ? "lv2" : "lv3"} onClick={() => onJump(h)}>
        {h.text}
      </a>
    )),
    [heads]
  );

  if (!review) {
    return (
      <div className="container section">
        <div className="card">
          해당 리뷰를 찾을 수 없습니다. 
          <Link to="/other-notes" className="btn" style={{ marginLeft: 8 }}>← 목록으로</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container section">
      <div className="card" style={{padding:"16px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap",background:"linear-gradient(180deg,#fafbff,transparent)",marginBottom:12}}>
        <div>
          <div className="kicker">Review</div>
          <h2 style={{margin:"2px 0 0"}}>{review.title}</h2>
          <div className="muted" style={{fontSize:13}}>{new Date(review.date).toLocaleDateString()} · ⭐ {review.rating} · @{review.author}</div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <Link to="/other-notes" className="btn">← 목록</Link>
          <button className="btn btn-primary">퀴즈 생성</button>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div ref={wrapRef} className="md-wrap">
          <aside className="toc">
            <div className="toc-title">목차</div>
            {toc.length ? toc : <div style={{ color: "var(--muted)" }}>제목이 없습니다</div>}
          </aside>
          <div className="md-body" ref={bodyRef} data-color-mode="light" style={{ padding: 16 }}>
            <Markdown source={`# ${review.title}\n\n> 작성자: **${review.author}** · ${review.date} · ⭐ ${review.rating}/5\n\n${review.content}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
