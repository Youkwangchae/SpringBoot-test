# Lost Items API
- Java 21, Spring Boot, JPA, H2
- 계층: controller → service → repository. controller에 비즈니스 로직 금지
- 요청/응답은 DTO 사용, 엔티티를 그대로 반환하지 않는다
- 검증 실패 400, 없음 404, 상태 충돌 409
- 기능 추가 시 테스트를 먼저 작성하고, ./gradlew test 통과 전에는 완료로 보지 않는다
