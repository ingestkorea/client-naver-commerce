# Change Log

## 0.6.2 (2026-05-11)

### Fixed

- **NodeHttpHandler**: `socket hang up` 방지를 위해 `freeSocketTimeout` 기본값을 1,000ms로 하향 조정
- **ListChangedOrderStatuses**: `변경 상품 주문 내역 조회` 최대 범위(24시간) 초과 및 미래 시간 요청 시 발생하는 에러 핸들링 추가
