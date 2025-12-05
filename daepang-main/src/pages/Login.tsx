// [Login] 로그인 화면 — 중앙 배치 + 우측 가이드 카드
import React,{useState}from"react";
import {useLoading, useAuth}from"../App";

export default function Login(){
  const[email,setEmail]=useState("");
  const[pw,setPw]=useState("");
  const[errors,setErrors]=useState({email:"",pw:""});
  const{setShowCodingLoader}=useLoading();
  const{login}=useAuth();

  const handleLogin=()=>{
    // 오류 메시지 초기화
    setErrors({email:"",pw:""});
    
    let hasError = false;
    const newErrors = {email:"",pw:""};

    // 입력 필드 검증
    if(!email.trim()){
      newErrors.email = "이메일을 입력해주세요.";
      hasError = true;
    }
    if(!pw.trim()){
      newErrors.pw = "비밀번호를 입력해주세요.";
      hasError = true;
    }

    if(hasError){
      setErrors(newErrors);
      return;
    }

    // 임시 로그인 정보 확인
    if(email==="123"&&pw==="123"){
      setShowCodingLoader(true);
      // 2초 후 로딩 종료 후 홈으로 이동
      setTimeout(()=>{
        setShowCodingLoader(false);
        login("테스트유저"); // 닉네임과 함께 로그인 상태 업데이트
        window.location.href="/";
      },2000);
    }else{
      alert("아이디 또는 비밀번호가 올바르지 않습니다.\n\n임시 로그인 정보:\n아이디: 123\n비밀번호: 123");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return(<div className="auth-wrap"><div className="auth-grid">
<div className="card surface"><div className="kicker">Welcome back</div><h2 style={{margin:"2px 0 8px"}}>로그인</h2>
<div style={{marginTop:8}}>
  <input 
    className="input" 
    placeholder="이메일" 
    value={email} 
    onChange={e=>setEmail(e.target.value)} 
    onKeyPress={handleKeyPress} 
    style={{
      width:"100%",
      borderColor: errors.email ? "#ef4444" : undefined
    }}
  />
  {errors.email && <div style={{color:"#ef4444",fontSize:"12px",marginTop:"4px"}}>{errors.email}</div>}
</div>
<div style={{marginTop:8}}>
  <input 
    className="input" 
    type="password" 
    placeholder="비밀번호" 
    value={pw} 
    onChange={e=>setPw(e.target.value)} 
    onKeyPress={handleKeyPress} 
    style={{
      width:"100%",
      borderColor: errors.pw ? "#ef4444" : undefined
    }}
  />
  {errors.pw && <div style={{color:"#ef4444",fontSize:"12px",marginTop:"4px"}}>{errors.pw}</div>}
</div>
<button className="btn btn-primary" style={{width:"100%",marginTop:12}} onClick={handleLogin}>로그인</button></div>
<div className="card auth-tip"><h3>대팡 사용 가이드</h3><ul><li>자료 업로드 후 퀴즈로 복습</li><li>주제별 6단계 로드맵</li><li>자격 페이지에서 플랜 확인</li></ul></div>
</div></div>)}
