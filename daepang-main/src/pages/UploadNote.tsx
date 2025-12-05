// [UploadNote] 노트 업로드/작성(Markdown Editor) — 저장 후 노트 상세로 이동
import React,{useState}from"react";
import{useNavigate}from"react-router-dom";
import MDEditor from"@uiw/react-md-editor";
import{api}from"../api/mock";

export default function UploadNote(){
    const nav=useNavigate();
    const[title,setTitle]=useState(""),[content,setContent]=useState(""),[tags,setTags]=useState("");

    const submit=async()=>{
        if(!title.trim()||!content.trim())
            return alert("제목/내용을 입력하세요");
        const note=await api.createNote({title,content,tags:tags.split(",").map(s=>s.trim()).filter(Boolean)});

        nav(`/note/${note.id}`)};

return(<div className="container section">
	{/* 헤더 카드 */}
	<div className="card" style={{padding:"16px 18px",background:"linear-gradient(180deg,#fafbff,transparent)"}}>
		<div className="kicker">Create</div>
		<h2 style={{margin:"2px 0 0"}}>자료 업로드</h2>
		<div className="muted" style={{fontSize:13}}>제목과 내용을 입력하고 태그로 분류하세요.</div>
	</div>

	<div className="card surface" style={{marginTop:12}}>
		<input className="input" placeholder="제목" value={title} onChange={e=>setTitle(e.target.value)} style={{width:"100%"}}/>
		<div data-color-mode="light" style={{marginTop:8}}>
			<MDEditor value={content} onChange={(v)=>setContent(v||"")}/>
		</div>
		<input className="input" placeholder="태그(콤마 구분)" value={tags} onChange={e=>setTags(e.target.value)} style={{width:"100%",marginTop:8}}/>
		<div style={{display:"flex",gap:8,marginTop:10,justifyContent:"flex-end"}}>
			<button className="btn" onClick={()=>nav(-1)}>취소</button>
			<button className="btn btn-primary" onClick={submit}>저장</button>
		</div>
	</div>
</div>)}
