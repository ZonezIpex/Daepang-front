// [ResourceCard] 자료/노트 카드 — 클릭 가능 + 상단 액션(즐겨찾기/좋아요)
import React,{useEffect,useState}from"react";import {api} from"../api/mock";
type Props={id?:string;title:string;meta?:string;seller?:string;price?:string;showActions?:boolean;onClick?:()=>void};
export default function ResourceCard({id,title,meta,seller,price,showActions,onClick}:Props){
  const[fav,setFav]=useState(false),[liked,setLiked]=useState(false);
  useEffect(()=>{if(id){setFav(api.isFav(id));setLiked(api.isLiked(id));}},[id]);
  const toggFav=(e:React.MouseEvent)=>{e.stopPropagation();if(id)setFav(api.toggleFav(id));};
  const toggLike=(e:React.MouseEvent)=>{e.stopPropagation();if(id)setLiked(api.toggleLike(id));};
  return(<div className={`card rc`} role={onClick?"button":undefined} tabIndex={onClick?0:undefined}
    onClick={onClick} onKeyDown={e=>{if(onClick&&(e.key==="Enter"||e.key===" ")){e.preventDefault();onClick();}}}
    style={{cursor:onClick?"pointer":undefined}}>
    {!!id&&<div className="rc-actions">
      <button className={`icon-btn ${fav?"star-on":""}`} onClick={toggFav} aria-label="즐겨찾기">{fav?"★":"☆"}</button>
      <button className={`icon-btn ${liked?"icon-on":""}`} onClick={toggLike} aria-label="좋아요">{liked?"♥":"♡"}</button>
    </div>}
    <div style={{fontWeight:700,marginBottom:6}}>{title}</div>
    {meta&&<div style={{color:"var(--muted)",fontSize:12}}>{meta}</div>}
    {(seller||price)&&<div style={{marginTop:8,display:"flex",gap:8,alignItems:"center"}}>{seller&&<span>@{seller}</span>}{price&&<span>{price}</span>}</div>}
    {showActions&&<div style={{marginTop:10,display:"flex",gap:8}}><button className="btn">보기</button><button className="btn btn-primary">저장</button></div>}
  </div>)}
