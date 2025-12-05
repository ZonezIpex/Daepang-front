import React, { useLayoutEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

export default function RouteLoader({
  minDuration = 700,       // 최소 노출 시간(ms)
  delayBeforeShow = 0,   // 너무 짧은 전환은 아예 숨김(ms)
  text = "이동 중...",
}: {
  minDuration?: number;
  delayBeforeShow?: number;
  text?: string;
}) {
  const location = useLocation();
  const first = useRef(true);
  const [show, setShow] = useState(false);
  const delayTimer = useRef<number | null>(null);
  const hideTimer = useRef<number | null>(null);

  useLayoutEffect(() => {
    // 첫 렌더(앱 최초 진입)는 보여주지 않음
    if (first.current) {
      first.current = false;
      return;
    }

    // 라우트가 바뀔 때: 잠깐 딜레이 후 표시(짧은 전환은 굳이 안 보이게)
    if (delayTimer.current) window.clearTimeout(delayTimer.current);
    if (hideTimer.current) window.clearTimeout(hideTimer.current);

    delayTimer.current = window.setTimeout(() => {
      setShow(true);
      // 최소 노출 시간 보장
      hideTimer.current = window.setTimeout(() => setShow(false), minDuration);
    }, delayBeforeShow);

    // 언마운트/다음 전환 시 정리
    return () => {
      if (delayTimer.current) window.clearTimeout(delayTimer.current);
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
    };
  }, [location.key, minDuration, delayBeforeShow]);

  if (!show) return null;

  return (
    <div className="loader-overlay" role="status" aria-live="polite">
      <div className="loader-card">
        <div className="spinner" aria-hidden />
        <div className="loader-text">{text}</div>
      </div>
    </div>
  );
}
