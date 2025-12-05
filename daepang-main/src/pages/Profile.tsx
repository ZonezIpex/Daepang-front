// [Profile] 내 정보 페이지 - 사용자 프로필 정보 표시 및 수정
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../App";

export default function Profile() {
  const { nickname, logout, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editNickname, setEditNickname] = useState(nickname || "");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // 최근 활동 데이터 (정확히 3개만)
  const recentActivities = [
    { title: "React 훅스 정리", time: "2시간 전 업로드" },
    { title: "JavaScript 퀴즈 완료", time: "1일 전 완료" },
    { title: "TypeScript 자료 업로드", time: "3일 전 업로드" }
  ];

  const handleEdit = () => {
    setIsEditing(true);
    setEditNickname(nickname || "");
  };

  const handleSave = () => {
    if (!editNickname.trim()) {
      alert("닉네임을 입력해주세요.");
      return;
    }
    login(editNickname.trim());
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditNickname(nickname || "");
    setIsEditing(false);
  };

  const handlePasswordChange = () => {
    setIsChangingPassword(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
  };

  const handlePasswordSave = () => {
    setPasswordError("");
    
    if (!currentPassword.trim()) {
      setPasswordError("현재 비밀번호를 입력해주세요.");
      return;
    }
    
    if (!newPassword.trim()) {
      setPasswordError("새 비밀번호를 입력해주세요.");
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordError("새 비밀번호는 6자 이상이어야 합니다.");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
      return;
    }
    
    // 비밀번호 변경 성공
    setIsChangingPassword(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handlePasswordCancel = () => {
    setIsChangingPassword(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    logout();
    window.location.href = "/";
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  return (
    <div className="container section">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2>{nickname || "사용자"}님의 정보</h2>
        <Link to="/" className="btn btn-ghost">← 홈으로</Link>
      </div>

      <div className="grid grid-2" style={{ gap: 24 }}>
        {/* 기본 정보 */}
        <div className="card surface">
          <h3 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 700 }}>기본 정보</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 14, color: "var(--muted)", marginBottom: 4 }}>아이디</label>
              <div style={{ fontSize: 16, fontWeight: 600 }}>test@example.com</div>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 14, color: "var(--muted)", marginBottom: 4 }}>비밀번호</label>
              <div style={{ fontSize: 16, fontWeight: 600 }}>••••••••</div>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 14, color: "var(--muted)", marginBottom: 4 }}>닉네임</label>
              {isEditing ? (
                <input
                  className="input"
                  value={editNickname}
                  onChange={(e) => setEditNickname(e.target.value)}
                  style={{ width: "100%" }}
                  placeholder="닉네임을 입력하세요"
                />
              ) : (
                <div style={{ fontSize: 16, fontWeight: 600 }}>{nickname || "사용자"}</div>
              )}
            </div>
            <div>
              <label style={{ display: "block", fontSize: 14, color: "var(--muted)", marginBottom: 4 }}>가입일</label>
              <div style={{ fontSize: 16 }}>2025년 1월 1일</div>
            </div>
            {isEditing && (
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button className="btn btn-primary" onClick={handleSave}>저장</button>
                <button className="btn btn-ghost" onClick={handleCancel}>취소</button>
              </div>
            )}
          </div>
        </div>

        {/* 활동 통계 */}
        <div className="card surface">
          <h3 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 700 }}>활동 통계</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 14, color: "var(--muted)" }}>업로드한 자료</span>
              <span style={{ fontSize: 16, fontWeight: 600 }}>3개</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 14, color: "var(--muted)" }}>완료한 퀴즈</span>
              <span style={{ fontSize: 16, fontWeight: 600 }}>12개</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 14, color: "var(--muted)" }}>연속 학습일</span>
              <span style={{ fontSize: 16, fontWeight: 600 }}>7일</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 14, color: "var(--muted)" }}>총 학습 시간</span>
              <span style={{ fontSize: 16, fontWeight: 600 }}>24시간</span>
            </div>
          </div>
        </div>

        {/* 최근 활동 */}
        <div className="card surface">
          <h3 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 700 }}>최근 활동</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {recentActivities.map((activity, index) => (
              <div key={index} style={{ padding: 8, background: "#f8fafc", borderRadius: 8, fontSize: 14 }}>
                <div style={{ fontWeight: 600 }}>{activity.title}</div>
                <div style={{ color: "var(--muted)", fontSize: 12 }}>{activity.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 설정 및 관리 */}
        <div className="card surface">
          <h3 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 700 }}>설정 및 관리</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button 
              className="btn btn-ghost" 
              style={{ justifyContent: "flex-start" }}
              onClick={handleEdit}
            >
              📝 프로필 수정
            </button>
            <button 
              className="btn btn-ghost" 
              style={{ justifyContent: "flex-start" }}
              onClick={handlePasswordChange}
            >
              🔒 비밀번호 변경
            </button>
            <button 
              className="btn btn-ghost" 
              style={{ justifyContent: "space-between" }}
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            >
              <span>🔔 알림 설정</span>
              <div style={{
                width: "44px",
                height: "24px",
                backgroundColor: notificationsEnabled ? "var(--brand)" : "#d1d5db",
                borderRadius: "12px",
                position: "relative",
                transition: "background-color 0.2s"
              }}>
                <div style={{
                  width: "20px",
                  height: "20px",
                  backgroundColor: "white",
                  borderRadius: "50%",
                  position: "absolute",
                  top: "2px",
                  left: notificationsEnabled ? "22px" : "2px",
                  transition: "left 0.2s",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                }} />
              </div>
            </button>
            <button 
              className="btn btn-ghost" 
              style={{ justifyContent: "flex-start", color: "#ef4444" }}
              onClick={handleLogoutClick}
            >
              🚪 로그아웃
            </button>
          </div>
        </div>
      </div>

      {/* 비밀번호 변경 모달 */}
      {isChangingPassword && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "white",
            padding: 24,
            borderRadius: 12,
            width: "90%",
            maxWidth: 400,
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)"
          }}>
            <h3 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 700 }}>비밀번호 변경</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 14, color: "var(--muted)", marginBottom: 4 }}>
                  현재 비밀번호
                </label>
                <input
                  className="input"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  style={{ width: "100%" }}
                  placeholder="현재 비밀번호를 입력하세요"
                />
              </div>
              
              <div>
                <label style={{ display: "block", fontSize: 14, color: "var(--muted)", marginBottom: 4 }}>
                  새 비밀번호
                </label>
                <input
                  className="input"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ width: "100%" }}
                  placeholder="새 비밀번호를 입력하세요 (6자 이상)"
                />
              </div>
              
              <div>
                <label style={{ display: "block", fontSize: 14, color: "var(--muted)", marginBottom: 4 }}>
                  새 비밀번호 확인
                </label>
                <input
                  className="input"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ width: "100%" }}
                  placeholder="새 비밀번호를 다시 입력하세요"
                />
              </div>
              
              {passwordError && (
                <div style={{ color: "#ef4444", fontSize: 14, textAlign: "center" }}>
                  {passwordError}
                </div>
              )}
              
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button className="btn btn-primary" onClick={handlePasswordSave} style={{ flex: 1 }}>
                  변경하기
                </button>
                <button className="btn btn-ghost" onClick={handlePasswordCancel} style={{ flex: 1 }}>
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 로그아웃 확인 모달 */}
      {showLogoutModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "white",
            padding: 24,
            borderRadius: 12,
            width: "90%",
            maxWidth: 400,
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)"
          }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 700 }}>로그아웃</h3>
            <p style={{ margin: "0 0 20px", fontSize: 14, color: "var(--muted)" }}>
              정말 로그아웃하시겠습니까?
            </p>
            
            <div style={{ display: "flex", gap: 8 }}>
              <button 
                className="btn btn-primary" 
                onClick={handleLogoutConfirm}
                style={{ flex: 1 }}
              >
                로그아웃
              </button>
              <button 
                className="btn btn-ghost" 
                onClick={handleLogoutCancel}
                style={{ flex: 1 }}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
