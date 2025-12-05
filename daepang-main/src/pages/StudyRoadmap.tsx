// [StudyRoadmap] 채점 후 진행도 반영 · 2분 타이머 · 힌트/해설 · 데이터 외부 파일화
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import ProgressDonut from "../components/ProgressDonut";

// 데이터 파일 import
import JS_QBANK from "../data/javascript";
import CS_QBANK from "../data/cs";
import SPRING_QBANK from "../data/spring";
import REACT_QBANK from "../data/react";
import TS_QBANK from "../data/typescript";
import SQL_QBANK from "../data/sql";

type Question = { q: string; choices: string[]; a: number; hint?: string; exp?: string };
type StageProgress = { answers: number[]; graded?: boolean };
type ProgressStore = Record<string, StageProgress>;

const PASS_SCORE = 8;
const TIME_LIMIT_SEC = 120;

const STAGE_LABELS: Record<string, string[]> = {
  javascript: ["문법/런타임", "스코프/클로저", "비동기/프라미스", "DOM/이벤트", "ES모듈/번들", "테스트/품질"],
  cs: ["컴구/OS", "프로세스/스레드", "메모리", "네트워크", "DB/트랜잭션", "보안"],
  spring: ["핵심개념", "IoC/DI", "MVC/웹", "데이터/트랜잭션", "테스트", "배포/운영"],
  react: ["컴포넌트", "상태관리", "라우팅", "성능최적화", "테스트", "배포"],
  typescript: ["타입기초", "함수/제네릭", "유니온/인터섹션", "고급타입", "TS+React", "빌드"],
  sql: ["SELECT", "JOIN", "집계/윈도우", "서브쿼리", "인덱스/실행계획", "트랜잭션"],
};

const BANKS: Record<string, Record<number, Question[]>> = {
  javascript: JS_QBANK,
  cs: CS_QBANK,
  spring: SPRING_QBANK,
  react: REACT_QBANK,
  typescript: TS_QBANK,
  sql: SQL_QBANK,
};

function loadStore(subject: string): ProgressStore {
  try {
    const raw = localStorage.getItem(`dp_progress_${subject}`);
    return raw ? (JSON.parse(raw) as ProgressStore) : {};
  } catch {
    return {};
  }
}
function saveStore(subject: string, store: ProgressStore) {
  try {
    localStorage.setItem(`dp_progress_${subject}`, JSON.stringify(store));
  } catch {}
}

function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.35)",
        display: "grid",
        placeItems: "center",
        zIndex: 2000,
      }}
    >
      <div className="card" onClick={(e) => e.stopPropagation()} style={{ width: "min(960px, 94vw)", maxHeight: "88vh", overflow: "auto", padding: 0 }}>
        {children}
      </div>
    </div>
  );
}
function ResultToast({
  open,
  pass,
  score,
  total,
  onRetry,
  onClose,
}: {
  open: boolean;
  pass: boolean;
  score: number;
  total: number;
  onRetry: () => void;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 2100, display: "grid", placeItems: "center", background: "rgba(0,0,0,.4)" }}>
      <div className="card" style={{ padding: 20, textAlign: "center", width: 360 }}>
        <div className="kicker">{pass ? "통과했습니다 🎉" : "아쉽지만 불합격 😢"}</div>
        <div style={{ fontSize: 20, fontWeight: 800, marginTop: 6 }}>
          점수: {score}/{total}
        </div>
        <p className="muted" style={{ marginTop: 6 }}>{pass ? "좋은 흐름입니다! 다음 단계로 이어가요." : "괜찮아, 다음에는 더 잘할 수 있어! 힌트를 참고해 다시 도전해요."}</p>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 10 }}>
          {!pass && (
            <button className="btn btn-primary" onClick={onRetry}>
              다시 도전하기
            </button>
          )}
          <button className="btn" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StudyRoadmap() {
  const { subject = "javascript" } = useParams();
  const labels = STAGE_LABELS[subject] ?? STAGE_LABELS.javascript;
  const QBANK = useMemo<Record<number, Question[]>>(() => BANKS[subject] ?? JS_QBANK, [subject]);

  const [store, setStore] = useState<ProgressStore>(() => loadStore(subject));
  useEffect(() => {
    saveStore(subject, store);
  }, [subject, store]);

  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<number>(1);
  const [gradedNow, setGradedNow] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(TIME_LIMIT_SEC);
  const [toast, setToast] = useState<{ open: boolean; pass: boolean; score: number; total: number }>({ open: false, pass: false, score: 0, total: 10 });
  const [hintOpen, setHintOpen] = useState<Record<string, boolean>>({});
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (open) document.body.classList.add("quiz-mode");
    else document.body.classList.remove("quiz-mode");
    return () => {
      document.body.classList.remove("quiz-mode");
    };
  }, [open]);

  const total = QBANK[stage]?.length ?? 10;
  const stageKey = String(stage);
  const answers = store[stageKey]?.answers ?? Array.from({ length: total }).map(() => -1);

  const stageScore = (s: number) => {
    const rec = store[String(s)];
    if (!rec?.graded) return 0;
    const qs = QBANK[s] ?? [];
    const correct = qs.reduce((acc, q, i) => acc + ((rec.answers?.[i] ?? -1) === q.a ? 1 : 0), 0);
    return Math.round((correct / (qs.length || 10)) * 100);
  };

  const resetStage = (s: number) => {
    const qs = QBANK[s] ?? [];
    setStore({ ...store, [String(s)]: { answers: Array.from({ length: qs.length }).map(() => -1), graded: false } });
    if (s === stage) {
      setGradedNow(false);
      setTimeLeft(TIME_LIMIT_SEC);
      setHintOpen({});
    }
  };

  const openStage = (s: number) => {
    setStage(s);
    setOpen(true);
    setGradedNow(false);
    setTimeLeft(TIME_LIMIT_SEC);
    setHintOpen({});
  };
  const closeModal = () => {
    setOpen(false);
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    if (!open) return;
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    timerRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (timerRef.current) {
            window.clearInterval(timerRef.current);
            timerRef.current = null;
          }
          doGrade(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [open, stage]);

  const fmtTime = (sec: number) => `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;

  const select = (qIdx: number, choiceIdx: number) => {
    if (gradedNow) return;
    const qs = QBANK[stage] ?? [];
    const arr = (store[stageKey]?.answers ?? Array.from({ length: qs.length }).map(() => -1)).slice();
    arr[qIdx] = choiceIdx;
    setStore({ ...store, [stageKey]: { answers: arr, graded: store[stageKey]?.graded ?? false } });
  };

  const doGrade = (_byTimeout = false) => {
    if (gradedNow) return;
    const qs = QBANK[stage] ?? [];
    const a = store[stageKey]?.answers ?? [];
    const correct = qs.reduce((acc, q, i) => acc + (a[i] === q.a ? 1 : 0), 0);
    setStore((prev) => ({ ...prev, [stageKey]: { answers: a, graded: true } }));
    setGradedNow(true);
    setToast({ open: true, pass: correct >= PASS_SCORE, score: correct, total: qs.length });
  };

  const retry = () => {
    resetStage(stage);
    setToast({ open: false, pass: false, score: 0, total });
    setGradedNow(false);
    setTimeLeft(TIME_LIMIT_SEC);
    setOpen(true);
  };

  const toggleHint = (i: number) => {
    const key = `${stage}-${i}`;
    setHintOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="h1" style={{ marginBottom: 14, textTransform: "uppercase" }}>
          {subject} 로드맵
        </h1>

        <div className="grid grid-3" style={{ gap: 18 }}>
          {labels.map((label, idx) => {
            const s = idx + 1;
            return (
              <div key={s} className="card" style={{ display: "grid", gridTemplateColumns: "130px 1fr", alignItems: "center", gap: 12 }}>
                <div style={{ justifySelf: "center" }}>
                  <ProgressDonut pct={stageScore(s)} />
                </div>
                <div>
                  <div style={{ fontWeight: 800 }}>{s}단계</div>
                  <div className="muted" style={{ fontSize: 13 }}>
                    {label}
                  </div>
                  <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button className="btn btn-primary" onClick={() => openStage(s)}>
                      예시문제 10개 풀기
                    </button>
                    <button className="btn" onClick={() => resetStage(s)}>
                      초기화
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Modal open={open} onClose={closeModal}>
        <div
          style={{
            position: "sticky",
            top: 0,
            background: "var(--card, #fff)",
            padding: "14px 16px",
            borderBottom: "1px solid rgba(0,0,0,.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div>
            <div className="kicker">스테이지 {stage}</div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>{labels[stage - 1]} — 예시문제 10개</div>
          </div>
          <div
            style={{
              minWidth: 120,
              textAlign: "center",
              fontWeight: 900,
              fontSize: 22,
              padding: "6px 12px",
              borderRadius: 12,
              background: timeLeft <= 10 ? "rgba(239,68,68,.1)" : "rgba(29,78,216,.08)",
              color: timeLeft <= 10 ? "#b91c1c" : "#1e40af",
            }}
          >
            ⏱ {fmtTime(timeLeft)}
          </div>
        </div>

        <div style={{ padding: "16px 16px 80px" }}>
          {(QBANK[stage] ?? []).map((qq, i) => {
            const sel = answers[i] ?? -1;
            const picked = sel > -1;
            const correct = sel === qq.a;
            const key = `${stage}-${i}`;
            return (
              <div
                key={i}
                className="card"
                style={{
                  marginBottom: 12,
                  border: gradedNow ? (picked ? (correct ? "1px solid #22c55e" : "1px solid #ef4444") : "1px dashed rgba(0,0,0,.2)") : "1px solid rgba(0,0,0,.06)",
                  background: gradedNow ? (picked ? (correct ? "rgba(34,197,94,.08)" : "rgba(239,68,68,.05)") : "rgba(0,0,0,.02)") : undefined,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                  <div style={{ fontWeight: 800 }}>
                    Q{i + 1}. {qq.q}
                  </div>
                  {gradedNow && (
                    <div className="badge" style={{ background: correct ? "#dcfce7" : "#fee2e2", color: correct ? "#166534" : "#991b1b" }}>
                      {correct ? "정답" : `오답 · 정답: ${"ABCD"[qq.a]}`}
                    </div>
                  )}
                </div>

                <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                  {qq.choices.map((ch, ci) => (
                    <label
                      key={ci}
                      className="choice"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 12px",
                        borderRadius: 10,
                        border: "1px solid rgba(0,0,0,.08)",
                        cursor: gradedNow ? "not-allowed" : "pointer",
                        background: !gradedNow && sel === ci ? "rgba(29,78,216,.08)" : "transparent",
                      }}
                    >
                      <input type="radio" name={`q_${stage}_${i}`} checked={sel === ci} disabled={gradedNow} onChange={() => select(i, ci)} />
                      <span style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{`ABCD`[ci]}.</span>
                      <span>{ch}</span>
                    </label>
                  ))}
                </div>

                <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  {!gradedNow && qq.hint && (
                    <>
                      <button className="btn" onClick={() => toggleHint(i)} aria-expanded={!!hintOpen[key]}>
                        힌트 보기
                      </button>
                      {hintOpen[key] && (
                        <div className="muted" style={{ fontSize: 13 }}>
                          힌트: {qq.hint}
                        </div>
                      )}
                    </>
                  )}
                  {gradedNow && qq.exp && (
                    <div className="muted" style={{ fontSize: 13 }}>
                      해설: {qq.exp}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            position: "sticky",
            bottom: 0,
            background: "var(--card, #fff)",
            padding: "12px 16px",
            borderTop: "1px solid rgba(0,0,0,.06)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
          }}
        >
          <button className="btn" onClick={() => resetStage(stage)}>
            이 스테이지 초기화
          </button>
          <div style={{ display: "flex", gap: 8 }}>
            {!gradedNow ? (
              <button className="btn btn-primary" onClick={() => doGrade(false)}>
                채점하기
              </button>
            ) : (
              <button className="btn btn-primary" onClick={closeModal}>
                닫기
              </button>
            )}
          </div>
        </div>
      </Modal>

      <ResultToast open={toast.open} pass={toast.pass} score={toast.score} total={toast.total} onRetry={retry} onClose={() => setToast({ ...toast, open: false })} />
    </div>
  );
}
