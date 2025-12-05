// [index] 앱 엔트리: 전역 CSS 로드 후 App 마운트
import React from"react";import ReactDOM from"react-dom/client";
import"./index.css";import App from"./App";
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(<React.StrictMode><App/></React.StrictMode>);
