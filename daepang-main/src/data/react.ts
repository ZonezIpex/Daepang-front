// React: 6단계 × 10문항
export type Question = { q: string; choices: string[]; a: number; hint?: string; exp?: string };
type Bank = Record<number, Question[]>;

function makeMC(topic: string, facts: string[]): Question[] {
  const distractors = ["무관한 설명", "틀린 일반화", "반대/예외"];
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
  1: makeMC("컴포넌트", [
    "함수형 컴포넌트가 표준이다",
    "props는 읽기 전용이다",
    "key는 리스트 아이템 식별에 필요하다",
    "Fragment는 불필요한 DOM을 줄인다",
    "컴포넌트 이름은 대문자로 시작한다",
    "ref는 DOM 접근에 사용된다",
    "memo는 불필요 렌더링을 줄인다",
    "prop drilling은 Context로 해결한다",
    "이벤트 핸들러는 onClick 등으로 작성한다",
    "훅은 컴포넌트 최상위에서만 호출한다",
  ]),
  2: makeMC("상태관리", [
    "useState는 로컬 상태를 관리한다",
    "setState는 배치되어 비동기처럼 보일 수 있다",
    "useReducer는 복잡한 로직에 적합하다",
    "Context는 전역 상태를 공유한다",
    "불변성 유지는 중요하다",
    "상태 끌어올리기로 공유한다",
    "커스텀 훅으로 로직을 재사용한다",
    "useRef는 값이 변해도 렌더를 유발하지 않는다",
    "setState는 이전 값을 콜백으로 받을 수 있다",
    "동기화는 useEffect로 처리한다",
  ]),
  3: makeMC("라우팅", [
    "react-router v6는 element 기반 구성이다",
    "useNavigate로 라우팅 이동한다",
    "Outlet로 중첩 라우트를 렌더링한다",
    "useParams로 URL 파라미터를 읽는다",
    "Link는 a 태그를 대체한다",
    "Route 객체 구성을 지원한다",
    "index 라우트 개념이 있다",
    "와일드카드 *로 404 처리를 한다",
    "navigate(-1)로 뒤로 간다",
    "loader/action으로 데이터 라우팅을 한다",
  ]),
  4: makeMC("성능최적화", [
    "useMemo는 값 메모이제이션이다",
    "useCallback은 함수 메모이제이션이다",
    "memo는 props 비교로 최적화한다",
    "key 안정성이 성능에 중요하다",
    "리스트 가상화는 렌더 부담을 줄인다",
    "코드 스플리팅은 초기 번들을 줄인다",
    "이미지 지연 로딩은 네트워크를 절약한다",
    "Suspense는 지연 UI를 제공한다",
    "Profiler로 렌더 비용을 측정한다",
    "불변 데이터 구조는 비교를 단순화한다",
  ]),
  5: makeMC("테스트", [
    "React Testing Library가 권장된다",
    "getByRole 같은 접근성 쿼리를 쓴다",
    "jest-dom으로 확장 매처를 사용한다",
    "msw로 네트워크를 목킹한다",
    "스냅샷 테스트는 최소화가 권장된다",
    "접근성 쿼리는 테스트 내구성을 높인다",
    "act()로 비동기 업데이트를 감싼다",
    "fireEvent보다 userEvent가 선호된다",
    "테스트 격리는 중요하다",
    "CI에서 자동 실행한다",
  ]),
  6: makeMC("배포", [
    "build는 정적 파일을 생성한다",
    "REACT_APP_ 접두사로 환경변수를 주입한다",
    "서브패스 배포는 basename을 설정한다",
    "PWA는 service worker를 사용한다",
    "Sentry로 에러를 수집할 수 있다",
    "Core Web Vitals를 측정할 수 있다",
    "CDN 캐싱으로 성능을 높인다",
    "CSP로 보안을 강화한다",
    "ESLint/Prettier로 품질을 유지한다",
    "Source map은 배포에서 제한할 수 있다",
  ]),
};
export default QBANK;
