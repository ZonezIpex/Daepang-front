// Spring: 6단계 × 10문항(핵심 개념/어노테이션/JPA/테스트/운영)
export type Question = { q: string; choices: string[]; a: number; hint?: string; exp?: string };
type Bank = Record<number, Question[]>;

function makeMC(topic: string, facts: string[]): Question[] {
  const distractors = ["무관한 설명", "일반적으로 틀린 말", "반대 개념"];
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
  1: makeMC("핵심개념", [
    "스프링은 IoC 컨테이너를 제공한다",
    "빈은 컨테이너가 생성하고 관리한다",
    "의존성 주입은 생성자와 세터 방식이 있다",
    "AOP는 횡단 관심사를 분리한다",
    "빈 라이프사이클 콜백을 제공한다",
    "환경/프로퍼티로 설정을 외부화할 수 있다",
    "스프링 부트는 자동 설정을 제공한다",
    "스타터 의존성은 설정을 단순화한다",
    "애노테이션 기반 구성을 사용한다",
    "프로파일로 환경별 빈을 선택한다",
  ]),
  2: makeMC("IoC/DI", [
    "@Component는 스캔 대상 빈이다",
    "@Autowired는 의존성을 주입한다",
    "@Configuration은 설정 클래스를 의미한다",
    "@Bean은 메서드 반환을 빈으로 등록한다",
    "기본 스코프는 singleton이다",
    "@Qualifier는 후보 빈을 특정한다",
    "생성자 주입은 순환 의존 탐지에 유리하다",
    "@Value로 설정 값을 주입할 수 있다",
    "Lazy 초기화는 빈 생성을 지연한다",
    "FactoryBean은 특수 빈 생성을 도와준다",
  ]),
  3: makeMC("MVC/웹", [
    "@Controller는 뷰를 반환한다",
    "@RestController는 바디에 직접 응답한다",
    "@RequestMapping은 경로와 메서드를 매핑한다",
    "@PathVariable은 경로 변수를 바인딩한다",
    "@RequestParam은 쿼리 파라미터를 바인딩한다",
    "Model은 뷰에 데이터를 전달한다",
    "ViewResolver는 뷰를 찾는다",
    "HandlerInterceptor는 전/후처리를 수행한다",
    "@ControllerAdvice는 예외를 공통 처리한다",
    "MultipartFile로 파일 업로드를 처리한다",
  ]),
  4: makeMC("데이터/트랜잭션", [
    "Spring Data JPA는 JpaRepository를 제공한다",
    "@Entity는 JPA 엔티티를 의미한다",
    "지연 로딩은 프록시를 사용한다",
    "@Transactional은 트랜잭션 경계를 정의한다",
    "격리 수준은 기본적으로 DB 설정을 따른다",
    "N+1 문제는 fetch join으로 완화할 수 있다",
    "영속성 컨텍스트는 1차 캐시를 제공한다",
    "변경 감지는 dirty checking으로 수행된다",
    "벌크 업데이트는 영속성 컨텍스트를 우회한다",
    "@Version은 낙관적 락을 구현한다",
  ]),
  5: makeMC("테스트", [
    "@SpringBootTest는 통합 테스트를 수행한다",
    "@WebMvcTest는 MVC 슬라이스 테스트다",
    "MockMvc로 컨트롤러를 테스트한다",
    "H2 같은 인메모리 DB를 사용할 수 있다",
    "TestEntityManager로 JPA 테스트를 돕는다",
    "@DataJpaTest는 JPA 전용 슬라이스다",
    "Mockito로 목 객체를 사용할 수 있다",
    "@MockBean으로 테스트 컨테이너에 주입한다",
    "Testcontainers로 외부 DB를 테스트한다",
    "@ActiveProfiles로 테스트 프로파일을 지정한다",
  ]),
  6: makeMC("배포/운영", [
    "Actuator로 헬스와 메트릭을 노출할 수 있다",
    "외부 설정은 환경변수나 파일에서 주입한다",
    "@Profile로 환경별 설정을 구분한다",
    "스프링 부트는 이미지 빌더를 지원한다",
    "Docker로 컨테이너 배포가 가능하다",
    "Graceful shutdown을 지원한다",
    "기본 로깅 구현은 Logback이다",
    "Flyway/Liquibase로 스키마 마이그레이션 한다",
    "CORS 설정으로 교차 출처를 제어한다",
    "Micrometer로 모니터링을 수집한다",
  ]),
};
export default QBANK;
