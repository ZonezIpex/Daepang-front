// [api/mock] 로컬스토리지 기반 가짜 API — 노트/퀴즈/진행도 + 즐겨찾기/좋아요
import {Note,QuizSession,Progress} from"../types";
const KEY="daepang_notes",PROG="daepang_progress",FAV="daepang_favs",LIK="daepang_likes";
const id=()=>Math.random().toString(36).slice(2,10),now=()=>new Date().toISOString();
const load=():Note[]=>JSON.parse(localStorage.getItem(KEY)||"[]");
const save=(v:Note[])=>localStorage.setItem(KEY,JSON.stringify(v));

const getSet=(k:string)=>new Set<string>(JSON.parse(localStorage.getItem(k)||"[]"));
const setSet=(k:string,s:Set<string>)=>localStorage.setItem(k,JSON.stringify(Array.from(s)));

if(!localStorage.getItem(KEY))
  save([{id:id(),title:"샘플 노트",content:"# 시작하기\n- 예시 본문",author:"demo",tags:["sample"],createdAt:now()}]);

if(!localStorage.getItem(PROG))
  localStorage.setItem(PROG,JSON.stringify({overallPct:8,streakDays:2,completedQuizzes:0} as Progress));

export const api={
 listNotes:async():Promise<Note[]>=>load(),
 getNote:async(id0:string)=>load().find(n=>n.id===id0)||null,
 createNote:async(n:Pick<Note,"title"|"content"> & {tags?:string[];author?:string})=>{
  const v=load();
  const item:Note={id:id(),title:n.title,content:n.content,author:n.author||"me",tags:n.tags||[],createdAt:now()};
  v.push(item);save(v);return item;
 },
 listOtherNotes:async():Promise<Note[]>=>load().slice(0,8),
 getProgress:async():Promise<Progress>=>JSON.parse(localStorage.getItem(PROG)||"{}"),
 bumpProgress:async(d:number)=>{
   const p:Progress=JSON.parse(localStorage.getItem(PROG)||"{}");
   p.overallPct=Math.max(0,Math.min(100,(p.overallPct||0)+d));
   localStorage.setItem(PROG,JSON.stringify(p));
   return p;
 },
 generateQuiz:async(noteId:string):Promise<QuizSession>=>{
   const items=[
     {id:id(),question:"클로저의 정의는?",choices:["함수+렉시컬환경","전역객체","DOM API","이벤트 버블링"],answer:0},
     {id:id(),question:"HTTP 200은?",choices:["성공","리다이렉트","클라이언트오류","서버오류"],answer:0}
   ];
   return{id:id(),noteId,items,userAnswers:new Array(items.length).fill(-1)};
 },
 gradeQuiz:async(s:QuizSession)=>{
   const c=s.items.reduce((acc,it,i)=>acc+(it.answer===s.userAnswers[i]?1:0),0);
   s.score=Math.round((c/s.items.length)*100);
   const p:Progress=JSON.parse(localStorage.getItem(PROG)||"{}");
   p.completedQuizzes=(p.completedQuizzes||0)+1;
   p.overallPct=Math.min(100,(p.overallPct||0)+5);
   localStorage.setItem(PROG,JSON.stringify(p));
   return s;
 },

 // 즐겨찾기/좋아요
 isFav:(id:string)=>getSet(FAV).has(id),
 toggleFav:(id:string)=>{const s=getSet(FAV);s.has(id)?s.delete(id):s.add(id);setSet(FAV,s);return s.has(id)},
 favIds:()=>Array.from(getSet(FAV)),

 isLiked:(id:string)=>getSet(LIK).has(id),
 toggleLike:(id:string)=>{const s=getSet(LIK);s.has(id)?s.delete(id):s.add(id);setSet(LIK,s);return s.has(id)},
 likeIds:()=>Array.from(getSet(LIK))
};
