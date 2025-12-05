// SQL: 6단계 × 10문항
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
  1: makeMC("SELECT", [
    "SELECT는 컬럼을 선택한다",
    "WHERE는 행을 필터링한다",
    "ORDER BY는 정렬을 수행한다",
    "LIMIT/OFFSET은 페이징에 사용된다",
    "DISTINCT는 중복을 제거한다",
    "BETWEEN은 경계를 포함한다",
    "LIKE는 패턴 일치를 수행한다",
    "NULL 비교는 IS NULL을 사용한다",
    "CASE는 조건 분기를 표현한다",
    "별칭은 AS로 지정할 수 있다",
  ]),
  2: makeMC("JOIN", [
    "INNER JOIN은 교집합을 반환한다",
    "LEFT JOIN은 왼쪽 테이블을 보존한다",
    "RIGHT JOIN은 오른쪽 테이블을 보존한다",
    "FULL OUTER JOIN은 양쪽을 보존한다",
    "CROSS JOIN은 데카르트 곱을 만든다",
    "SELF JOIN은 자기 자신과 조인한다",
    "ON은 조인 조건, WHERE는 후 필터다",
    "USING은 동일 컬럼명의 축약이다",
    "NATURAL JOIN은 자동 매칭이라 위험할 수 있다",
    "조인 순서는 옵티마이저가 결정한다",
  ]),
  3: makeMC("집계/윈도우", [
    "GROUP BY는 집계 기준을 만든다",
    "HAVING은 집계 결과를 필터링한다",
    "COUNT(*)는 NULL을 포함한다",
    "AVG/SUM 등 집계 함수가 있다",
    "윈도우 함수는 OVER 절이 필요하다",
    "PARTITION BY로 그룹을 나눈다",
    "ORDER BY로 순서를 정의한다",
    "ROW_NUMBER는 순위를 부여한다",
    "LAG/LEAD는 이전/다음 값을 읽는다",
    "FRAME 절로 범위를 제어한다",
  ]),
  4: makeMC("서브쿼리", [
    "IN은 집합 포함을 검사한다",
    "EXISTS는 존재 여부를 검사한다",
    "스칼라 서브쿼리는 단일 값을 반환한다",
    "상관 서브쿼리는 외부를 참조한다",
    "ANY/ALL 비교 연산을 지원한다",
    "FROM 서브쿼리는 인라인 뷰가 된다",
    "WITH는 CTE를 정의한다",
    "서브쿼리는 조인 대비 성능 주의가 필요하다",
    "NOT IN은 NULL 처리에 주의해야 한다",
    "서브쿼리는 중첩될 수 있다",
  ]),
  5: makeMC("인덱스/실행계획", [
    "B+Tree 인덱스가 일반적이다",
    "선택도가 높을수록 인덱스가 효율적이다",
    "복합 인덱스는 선두 컬럼이 중요하다",
    "커버링 인덱스는 테이블 접근을 줄인다",
    "EXPLAIN으로 실행계획을 확인한다",
    "인덱스는 쓰기 성능을 저하시킬 수 있다",
    "함수 적용 컬럼은 인덱스를 무력화할 수 있다",
    "범위 조건은 후행 컬럼 사용을 저하시킨다",
    "힌트로 최적화 방향을 제어할 수 있다",
    "통계 최신화가 중요하다",
  ]),
  6: makeMC("트랜잭션", [
    "ACID는 트랜잭션의 기본 성질을 말한다",
    "오토커밋은 각 문장을 바로 커밋한다",
    "Read Uncommitted는 더티 리드를 허용한다",
    "Repeatable Read는 같은 쿼리의 일관성을 보장한다",
    "Serializable는 가장 엄격하다",
    "데드락은 상호 대기로 인해 발생한다",
    "Savepoint로 부분 롤백이 가능하다",
    "2PC는 분산 트랜잭션 합의를 수행한다",
    "격리와 동시성은 트레이드오프다",
    "장기 트랜잭션은 락 경합을 유발한다",
  ]),
};
export default QBANK;
