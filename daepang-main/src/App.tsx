// [App] 전역 라우팅: 헤더/푸터 공통 + 모든 페이지 라우트 등록
import React, { createContext, useContext, useState } from "react";
import RouteLoader from "./components/RouteLoader";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UploadNote from "./pages/UploadNote";
import AllNotes from "./pages/AllNotes";
import OtherNotes from "./pages/OtherNotes";
import ReviewDetail from "./pages/ReviewDetail";
import Profile from "./pages/Profile";
import MyNotes from "./pages/MyNotes";
import CompareNotes from "./pages/CompareNotes";
import Quiz from "./pages/Quiz";
import NoteDetail from "./pages/NoteDetail";
import StudyRoadmap from "./pages/StudyRoadmap";
import Search from "./pages/Search";
import Certs from "./pages/Certs";
import CertDetail from "./pages/CertDetail";
import Community from "./pages/Community";
import SampleNote from "./pages/SampleNote";
import AIWorkbench from "./pages/AIWorkbench";
import CodingLoader from "./components/CodingLoader";

// 로딩 상태를 관리하는 Context
const LoadingContext = createContext<{
  showCodingLoader: boolean;
  setShowCodingLoader: (show: boolean) => void;
}>({
  showCodingLoader: false,
  setShowCodingLoader: () => {},
});

// 로그인 상태를 관리하는 Context
const AuthContext = createContext<{
  isLoggedIn: boolean;
  nickname: string;
  login: (nickname: string) => void;
  logout: () => void;
}>({
  isLoggedIn: false,
  nickname: "",
  login: () => {},
  logout: () => {},
});

export const useLoading = () => useContext(LoadingContext);
export const useAuth = () => useContext(AuthContext);

function AppContent() {
  const [showCodingLoader, setShowCodingLoader] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // 페이지 로드 시 localStorage에서 로그인 상태 확인
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  const [nickname, setNickname] = useState(() => {
    // 페이지 로드 시 localStorage에서 닉네임 확인
    return localStorage.getItem('nickname') || '';
  });

  const login = (userNickname: string) => {
    setIsLoggedIn(true);
    setNickname(userNickname);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('nickname', userNickname);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setNickname('');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('nickname');
  };

  return (
    <LoadingContext.Provider value={{ showCodingLoader, setShowCodingLoader }}>
      <AuthContext.Provider value={{ isLoggedIn, nickname, login, logout }}>
        <Header />
        {/*<RouteLoader text="페이지 불러오는 중..." delayBeforeShow={0}/> {/* ← 페이지 전환 때마다 표시 */}
        {showCodingLoader && <CodingLoader text="화면 불러오는 중..." delayBeforeShow={0}/>}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/upload" element={<UploadNote />} />
            <Route path="/notes" element={<MyNotes />} />
            <Route path="/all-notes" element={<AllNotes />} />
            <Route path="/other-notes" element={<OtherNotes />} />
            <Route path="/review/:id" element={<ReviewDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/compare/:idA/:idB" element={<CompareNotes />} />
            <Route path="/quiz/:noteId" element={<Quiz />} />
            <Route path="/note/:id" element={<NoteDetail />} />
            <Route path="/study/:subject" element={<StudyRoadmap />} />
            <Route path="/search" element={<Search />} />
            <Route path="/certs" element={<Certs />} />
            <Route path="/certs/:slug" element={<CertDetail />} />
            <Route path="/community" element={<Community />} />
            <Route path="/sample/:slug" element={<SampleNote />} />
            <Route path="/ai" element={<AIWorkbench />} />
          </Routes>
        <Footer />
      </AuthContext.Provider>
    </LoadingContext.Provider>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
