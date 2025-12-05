import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomSelect, { SelectOption } from "../components/CustomSelect";

type Review = {
  id: string;
  author: string;
  title: string;     // 제목 (검색 대상)
  content: string;
  rating: number;    // 1~5
  date: string;      // YYYY-MM-DD
  tags: string[];
};

const OTHERS: Review[] = [
  { id: "o1", author: "승혁", title: "태그 기능 좋아요", content: "태그가 정말 유용했어요. 특히 검색할 때 빠르게 찾을 수 있어서 좋습니다. 다른 기능들도 이런 식으로 개선되면 더욱 편리할 것 같아요. 사용자 경험이 많이 향상된 것 같고, 앞으로도 이런 방향으로 발전해주시면 좋겠습니다. 정말 만족스러운 기능이에요.", rating: 5, date: "2025-09-06", tags: ["열기"] },
  { id: "o2", author: "한울", title: "모바일 최적화", content: "속도가 빨라졌네요. 이전 버전보다 훨씬 부드럽게 동작합니다. 다만 일부 기능에서 아직 개선이 필요한 부분이 있는 것 같아요. 특히 터치 반응성이 좋아졌고, 스크롤도 부드러워졌습니다. 하지만 가로 모드에서 일부 레이아웃이 깨지는 경우가 있어서 이 부분은 개선이 필요해 보입니다. 전반적으로는 만족스러운 업데이트였습니다.", rating: 4, date: "2025-09-05", tags: ["열기"] },
  { id: "o3", author: "동원", title: "검색 성능 희망", content: "더 빨라지면 좋겠습니다. 현재도 나쁘지 않지만, 대용량 데이터를 다룰 때는 조금 느린 느낌이 있어요. 특히 복잡한 검색어를 입력할 때 결과가 나오기까지 시간이 걸리는 경우가 있습니다. 인덱싱 최적화나 캐싱 시스템을 도입하면 더 나아질 것 같습니다. 사용자 경험 측면에서 검색 속도는 정말 중요한 요소라고 생각해요. 빠른 검색으로 더 나은 서비스를 제공해주시면 감사하겠습니다.", rating: 3, date: "2025-09-04", tags: ["열기"] },
  { id: "o4", author: "현서", title: "깔끔한 UI", content: "보기 좋고 정돈됐어요. 사용하기 편리하고 직관적인 인터페이스입니다. 계속 이런 방향으로 발전해주세요! 색상 배치도 조화롭고, 폰트도 읽기 편해서 좋습니다. 버튼과 링크의 크기도 적절하고, 전체적인 레이아웃이 깔끔해서 사용하기 편해요. 특히 네비게이션이 직관적이라서 처음 사용하는 사람도 쉽게 적응할 수 있을 것 같습니다. 디자인 일관성도 잘 유지되고 있고, 전반적으로 정말 잘 만들어진 것 같아요. 앞으로도 이런 수준의 디자인을 유지해주시면 좋겠습니다.", rating: 4, date: "2025-09-03", tags: ["열기"] },
];

type SortKey = "rating" | "date_asc" | "date_desc";
const SORT_OPTIONS: SelectOption<SortKey>[] = [
  { value: "rating",   label: "별점 순" },
  { value: "date_asc", label: "날짜 순" },
  { value: "date_desc",label: "최신 순" },
];

export default function AllNotes() {
  const [q, setQ] = useState("");                 // 제목 검색
  const [sortBy, setSortBy] = useState<SortKey>("date_desc");
  const nav = useNavigate();

  const list = useMemo(() => {
    const filtered = OTHERS.filter(r =>
      r.title.toLowerCase().includes(q.toLowerCase())
    );
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "date_asc":
          return +new Date(a.date) - +new Date(b.date);
        case "date_desc":
        default:
          return +new Date(b.date) - +new Date(a.date);
      }
    });
  }, [q, sortBy]);

  return (
    <div className="container section">
      <div className="card" style={{padding:"16px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap",background:"linear-gradient(180deg,#fafbff,transparent)"}}>
        <div>
          <div className="kicker">Explore</div>
          <h2 style={{margin:"2px 0 0"}}>📚 전체 자료</h2>
          <div className="muted" style={{fontSize:13}}>후기/리뷰를 확인하고 필터로 빠르게 찾으세요.</div>
        </div>
        <div className="badge" style={{fontWeight:700}}>{list.length}건</div>
      </div>

      {/* 검색/정렬 */}
      <div className="card" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input
          className="input"
          placeholder="제목 검색"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ flex: "1 1 240px" }}
        />
        <CustomSelect
          value={sortBy}
          onChange={setSortBy}
          options={SORT_OPTIONS}
          className=""
        />
      </div>

      {/* 목록 */}
      <div style={{ marginTop: 12, display:"grid", gap:12 }}>
        {list.length ? (
          list.map((r) => (
            <div key={r.id} className="card" style={{padding:0,overflow:"hidden"}}>
              <div style={{display:"grid",gridTemplateColumns:"auto 1fr auto",gap:12,alignItems:"center",padding:14}}>
                <div style={{width:36,height:36,borderRadius:8,display:"grid",placeItems:"center",background:"#e6fcf5",color:"#099268",fontWeight:800}}>★</div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "baseline" }}>
                    <div style={{ fontWeight: 800 }}>{r.title}</div>
                    <div style={{ color: "var(--muted)", fontSize: 12 }}>
                      {new Date(r.date).toLocaleDateString()} · ⭐ {r.rating} · {r.author}
                    </div>
                  </div>
                  <div style={{ marginTop: 6 }}>
                    {r.content.length > 220 ? r.content.substring(0, 220) + "..." : r.content}
                  </div>
                  <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {r.tags.map((t) => (
                      <span 
                        key={t} 
                        className="badge" 
                        style={{ cursor: t === "열기" ? "pointer" : "default" }}
                        onClick={t === "열기" ? () => nav(`/other-notes?author=${encodeURIComponent(r.author)}`) : undefined}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div><button className="btn" onClick={()=>nav(`/other-notes?author=${encodeURIComponent(r.author)}`)}>자세히</button></div>
              </div>
            </div>
          ))
        ) : (
          <div className="card">검색 결과가 없습니다.</div>
        )}
      </div>
    </div>
  );
}
