# Lost Items API
- Java 21, Spring Boot, JPA, H2
- 계층: controller → service → repository. controller에 비즈니스 로직 금지
- 요청/응답은 DTO 사용, 엔티티를 그대로 반환하지 않는다
- 검증 실패 400, 없음 404, 상태 충돌 409
- 기능 추가 시 테스트를 먼저 작성하고, ./gradlew test 통과 전에는 완료로 보지 않는다

# web/ (React + TypeScript 프론트)
- 위치: 저장소 루트의 web/ (Vite + React + TypeScript). 백엔드와 같은 저장소에 둔다
- 개발 중 CORS는 백엔드를 고치지 않고 Vite server.proxy로 /items → http://localhost:8080 연결한다
- API 응답 타입은 백엔드 ItemResponse DTO와 맞춘 TypeScript 타입으로 정의한다 (web/src/types.ts)
- API 호출은 web/src/api.ts 한 파일에 모으고 fetch를 쓴다
- 400/404/409 응답은 서버 detail 메시지를 화면에 보여 준다 (특히 이미 반환된 물건 409)
- 로딩·에러 상태를 항상 처리한다
- 버튼·입력은 터치 영역을 넉넉하게 두고, 입력 필드는 label로 연결한다
- 기능 추가 시 테스트를 먼저 작성한다 (Vitest + React Testing Library)
- 완료 기준: cd web && npm test && npm run build 통과
