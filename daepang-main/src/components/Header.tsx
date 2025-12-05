// [Header] 상단 내비게이션: 로고/메뉴(좌측 정렬) + 우측 인증버튼 + 스크롤 자동숨김 + 드롭다운(상태제어)
import React,{useEffect,useRef,useState}from"react";
import{Link,useNavigate}from"react-router-dom";
import{CERTS}from"../data/certs";
import{useAuth}from"../App";

export default function Header(){
  const nav=useNavigate();
  const{isLoggedIn,nickname,logout}=useAuth();
  const[scrolled,setS]=useState(false);
  const[hidden,setH]=useState(false);
  const last=useRef(0);
  const[showLogoutModal,setShowLogoutModal]=useState(false);

  // Auto-hide on scroll
  useEffect(()=>{if(typeof window!=="undefined")last.current=window.scrollY;},[]);
  useEffect(()=>{
    if(typeof window==="undefined")return;
    let ticking=false;
    const on=()=>{ if(ticking) return; ticking=true;
      window.requestAnimationFrame(()=>{ const y=window.scrollY,dy=y-last.current;
        setS(y>8); if(y<20)setH(false); else if(dy>4)setH(true); else if(dy<-4)setH(false);
        last.current=y; ticking=false;
      });
    };
    window.addEventListener("scroll",on,{passive:true});
    return()=>window.removeEventListener("scroll",on);
  },[]);

  // Dropdown state (stable: hover/click/keyboard)
  const[openKey,setOpenKey]=useState<string|null>(null);
  const open=(k:string)=>setOpenKey(k);
  const close=()=>setOpenKey(null);
  const onBlurContainer=(e:React.FocusEvent<HTMLElement>)=>{
    if(!e.currentTarget.contains(e.relatedTarget as Node)) close();
  };

  const handleLogoutClick=()=>{
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm=()=>{
    setShowLogoutModal(false);
    logout();
    nav("/");
  };

  const handleLogoutCancel=()=>{
    setShowLogoutModal(false);
  };

  return(
<>
<header className={`site-header ${scrolled?"scrolled":""} ${hidden?"hidden":""}`}>
  <div className="container header-inner">
    {/* 좌측: 로고 + 메뉴 묶음 */}
    <div className="header-left">
      <Link to="/" className="brand" aria-label="대팡 홈">
        <img src="/logo.png" alt="대팡 로고"/><span className="logo">대팡</span>
      </Link>

      <nav className="nav" aria-label="주요 메뉴" onBlur={onBlurContainer}>
        {/* 자료 */}
        <div className={`menu ${openKey==="data"?"open":""}`}
          onMouseEnter={()=>open("data")} onMouseLeave={close}>
            <button className="menu-button" type="button" aria-expanded={openKey==="data"}
              onClick={()=>setOpenKey(v=>v==="data"?null:"data")}>자료</button>
                <div className="submenu" role="menu">
                  <button role="menuitem" tabIndex={0} onClick={()=>{isLoggedIn?nav("/notes"):alert("로그인 후 이용이 가능합니다.");close();if(!isLoggedIn)nav("/login");}}>내 자료</button>
                  <button role="menuitem" tabIndex={0} onClick={()=>{isLoggedIn?nav("/all-notes"):alert("로그인 후 이용이 가능합니다.");close();if(!isLoggedIn)nav("/login");}}>전체 자료</button>
                  <button role="menuitem" tabIndex={0} onClick={()=>{isLoggedIn?nav("/ai"):alert("로그인 후 이용이 가능합니다.");close();if(!isLoggedIn)nav("/login");}}>AI 도우미(베타)</button>
                </div>
        </div>


        {/* 주제 */}
        <div className={`menu ${openKey==="topic"?"open":""}`}
             onMouseEnter={()=>open("topic")} onMouseLeave={close}>
          <button className="menu-button" type="button" aria-expanded={openKey==="topic"}
                  onClick={()=>setOpenKey(v=>v==="topic"?null:"topic")}>주제</button>
          <div className="submenu" role="menu">
            {["javascript","spring","react","typescript","algorithm","cs"].map(s=>
              <button key={s} role="menuitem" tabIndex={0}
                onClick={()=>{isLoggedIn?nav(`/study/${s}`):alert("로그인 후 이용이 가능합니다.");close();if(!isLoggedIn)nav("/login");}}>{s.toUpperCase()}</button>
            )}
          </div>
        </div>

        {/* 자격 */}
        <div className={`menu ${openKey==="cert"?"open":""}`}
             onMouseEnter={()=>open("cert")} onMouseLeave={close}>
          <button className="menu-button" type="button" aria-expanded={openKey==="cert"}
                  onClick={()=>setOpenKey(v=>v==="cert"?null:"cert")}>자격</button>
          <div className="submenu" role="menu">
            {CERTS.map(c=>
              <button key={c.slug} role="menuitem" tabIndex={0}
                onClick={()=>{isLoggedIn?nav(`/certs/${c.slug}`):alert("로그인 후 이용이 가능합니다.");close();if(!isLoggedIn)nav("/login");}}>{c.name}</button>
            )}
            <button className="submenu-all" role="menuitem" tabIndex={0}
              onClick={()=>{isLoggedIn?nav("/certs"):alert("로그인 후 이용이 가능합니다.");close();if(!isLoggedIn)nav("/login");}}>전체 보기</button>
          </div>
        </div>

        {/* 커뮤니티 */}
        <div className={`menu ${openKey==="comm"?"open":""}`}
             onMouseEnter={()=>open("comm")} onMouseLeave={close}>
          <button className="menu-button" type="button" aria-expanded={openKey==="comm"}
                  onClick={()=>setOpenKey(v=>v==="comm"?null:"comm")}>커뮤니티</button>
          <div className="submenu" role="menu">
            <button role="menuitem" tabIndex={0} onClick={()=>{isLoggedIn?nav("/community"):alert("로그인 후 이용이 가능합니다.");close();if(!isLoggedIn)nav("/login");}}>공지사항</button>
          </div>
        </div>
      </nav>
    </div>

    {/* 우측: 로그인/회원가입 또는 프로필 */}
    <div className="auth">
      {isLoggedIn ? (
        <div style={{display:"flex",alignItems:"center",gap:"4px"}}>
          <button 
            className="btn btn-ghost" 
            onClick={()=>nav("/profile")}
            style={{color:"var(--brand)",fontWeight:"600",padding:"8px 12px"}}
          >
            👤 {nickname || "사용자"}
          </button>
          <button className="btn btn-ghost" onClick={handleLogoutClick}>로그아웃</button>
        </div>
      ) : (
        <>
          <Link to="/login" className="btn btn-ghost">로그인</Link>
          <Link to="/signup" className="btn btn-strong">회원가입</Link>
        </>
      )}
    </div>
  </div>
</header>

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
</>)}
