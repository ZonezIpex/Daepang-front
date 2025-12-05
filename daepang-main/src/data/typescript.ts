// TypeScript: 6단계 × 10문항
export type Question = { q: string; choices: string[]; a: number; hint?: string; exp?: string };
type Bank = Record<number, Question[]>;

function makeMC(topic: string, facts: string[]): Question[] {
  const distractors = ["무관한 설명", "틀린 진술", "반대 개념"];
  return Array.from({ length: 10 }).map((_, i) => {
    const fact = facts[i % facts.length];
    const correct = i % 4;
    const choices = Array(4).fill("");
    choices[correct] = fact;
    let j = 0;
    for (let k = 0; k < 4; k++) if (k !== correct) choices[k] = distractors[j++];
    return { q: `[${topic}] 옳은 설명을 고르세요.`, choices, a: correct, hint: fact, exp: `정답: ${fact}` };
  });
}

const QBANK: Bank = {
  1: makeMC("타입기초", [
    "any는 타입 안전성을 잃게 한다",
    "unknown은 사용 전 좁히기가 필요하다",
    "never는 도달 불가를 나타낸다",
    "literal 타입으로 정밀 제약이 가능하다",
    "strictNullChecks로 null 안전을 강화한다",
    "enum 대신 union literal이 권장된다",
    "타입 별칭은 재사용에 유리하다",
    "interface는 확장이 쉽다",
    "type과 interface는 상호 보완적이다",
    "타입 단언은 마지막 수단이어야 한다",
  ]),
  2: makeMC("함수/제네릭", [
    "제네릭 T는 재사용성을 높인다",
    "extends로 제약을 줄 수 있다",
    "제네릭 기본 파라미터를 설정할 수 있다",
    "오버로드로 시그니처를 선언한다",
    "this 파라미터 타입을 지정할 수 있다",
    "제네릭 함수는 타입 추론이 된다",
    "key는 keyof로 제한할 수 있다",
    "infer로 조건부 타입에서 추론한다",
    "제네릭 클래스/인터페이스를 정의할 수 있다",
    "satisfies 연산자로 구조를 검증할 수 있다",
  ]),
  3: makeMC("유니온/인터섹션", [
    "유니온은 OR 타입이다",
    "인터섹션은 AND 타입이다",
    "판별식 유니온은 태그 필드가 필요하다",
    "in/typeof/instanceof로 좁힐 수 있다",
    "모든 케이스를 처리하지 않으면 never가 될 수 있다",
    "공변/반공변 개념이 존재한다",
    "Partial/Required 같은 유틸 타입이 있다",
    "Readonly로 불변을 표시할 수 있다",
    "분배 조건부 타입에 주의해야 한다",
    "Exclude/Extract를 활용할 수 있다",
  ]),
  4: makeMC("고급타입", [
    "keyof는 속성 키의 집합을 만든다",
    "mapped type으로 변환이 가능하다",
    "조건부 타입 T extends U ? X : Y 형태를 지원한다",
    "템플릿 리터럴 타입을 사용할 수 있다",
    "Variadic tuple 타입을 지원한다",
    "제네릭 유틸이 다양하게 제공된다",
    "NonNullable로 null을 제거한다",
    "ReturnType/Parameters를 활용할 수 있다",
    "as const로 리터럴을 고정한다",
    "satisfies로 과도한 넓힘을 방지한다",
  ]),
  5: makeMC("TS+React", [
    "FC 타입은 children을 암시적으로 포함하지 않는다",
    "Props는 타입/인터페이스로 선언한다",
    "이벤트 타입은 React.MouseEvent 등을 사용한다",
    "useRef<HTMLDivElement>처럼 제네릭을 지정한다",
    "상태는 유니온으로 안전을 높인다",
    "Context는 createContext<타입>으로 만든다",
    "forwardRef로 ref를 전달한다",
    "ComponentProps로 재사용할 수 있다",
    "JSX.Element와 ReactNode를 구분한다",
    "vite/tsconfig에서 jsx 설정을 조정한다",
  ]),
  6: makeMC("빌드", [
    "tsconfig의 target/module을 설정한다",
    "moduleResolution 전략을 이해해야 한다",
    "paths와 baseUrl로 별칭을 만든다",
    "esModuleInterop는 CJS 상호 운용을 돕는다",
    "skipLibCheck는 빌드 속도를 높인다",
    "isolatedModules는 ESM 호환을 높인다",
    "sourceMap 옵션으로 디버깅한다",
    "declaration으로 d.ts를 생성한다",
    "noUncheckedIndexedAccess가 권장된다",
    "strict 모드가 안정성을 높인다",
  ]),
};
export default QBANK;
