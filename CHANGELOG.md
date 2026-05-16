# Change Log

## 0.6.3 (2026-05-16)

### Changed

- **`NaverCommerceClient`**:
  - `HttpHandlerOptions`을 통한 유연한 사용자 설정 지원.
- **`NodeHttpHandler`**:
  - `socket hang up` 방지를 위해 `keepAlive` 기본값을 `false`로 변경.
  - `ipv4` 주소 강제. 네이버 Commer API 서버는 ipv6 지원하지 않음.
- **`middlewareRetry`**:
  - NodeHttpHandler 표준 에러에 의한 HTTP Request Retry 정책 추가. (`SDK.TIMEOUT`, `SDK.NETWORK_ERROR`)
- **`package.json`**:
  - ESM 지원하기 위한 `"type": "module"` 속성 추가.

## 0.6.2 (2026-05-11)

### Changed

- **NodeHttpHandler**: `socket hang up` 방지를 위해 `freeSocketTimeout` 기본값을 1,000ms로 하향 조정
- **ListChangedOrderStatuses**: `변경 상품 주문 내역 조회` 최대 범위(24시간) 초과 및 미래 시간 요청 시 발생하는 에러 핸들링 추가
