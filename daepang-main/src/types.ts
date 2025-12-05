// [types] 앱 전역 타입 정의
export type Note={id:string;title:string;content:string;author:string;tags?:string[];createdAt:string};
export type QuizQuestion={id:string;question:string;choices:string[];answer:number};
export type QuizSession={id:string;noteId:string;items:QuizQuestion[];userAnswers:number[];score?:number};
export type Progress={overallPct:number;streakDays:number;completedQuizzes:number};
