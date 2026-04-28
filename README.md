# @ingestkorea/client-naver-commerce

[![npm (scoped)](https://img.shields.io/npm/v/@ingestkorea/client-naver-commerce?style=flat-square)](https://www.npmjs.com/package/@ingestkorea/client-naver-commerce)
[![npm downloads](https://img.shields.io/npm/dm/@ingestkorea/client-naver-commerce?style=flat-square)](https://www.npmjs.com/package/@ingestkorea/client-naver-commerce)
[![license](https://img.shields.io/github/license/ingestkorea/client-naver-commerce?style=flat-square)](https://www.npmjs.com/package/@ingestkorea/client-naver-commerce)

## Description

INGESTKOREA SDK - Naver Commerce Client for Node.js.

INGESTKOREA SDK - Naver Commerce Client는 [네이버 커머스 API](https://apicenter.commerce.naver.com/docs/commerce-api/current)에서 필수적으로 사용되는 메서드 위주로 구현된 가벼운 라이브러리입니다.

SDK는 아래 작업들을 내부적으로 수행합니다.

- OAuth Token 발급을 위한 전자서명
- OAuth Token을 이용한 API 인증
- HTTP 요청 실패시 재시도
- Naver Commerce API 표준 에러 핸들링

SDK는 [네이버 커머스 API Docs](https://apicenter.commerce.naver.com/docs/commerce-api/current)에서 제공하는 형식을 준수합니다.

네이버 커머스 API 이용을 위해서는 [커머스 API 센터](https://apicenter.commerce.naver.com/ko/member/home)에서 개발업체 계정 생성 후 애플리케이션을 등록해야 합니다.

**주의사항**: 애플리케이션 등록 과정에서 API 호출에 사용할 **고정 IP**가 필요합니다.

## Getting Started

### Installing

```sh
npm install @ingestkorea/client-naver-commerce
```

### Pre-requisites

SDK는 아래 사항들을 요구합니다.

- TypeScript v5 이상
- Node v22 이상

```sh
# save dev mode
npm install -D typescript
npm install -D @types/node
```

## Support Methods

- CreateAccessToken
- DispatchProductOrders
- GetAccountInfo
- GetProductOrders
- ListBrandsInfo
- ListChangedOrderStatuses
- ListProducts

## Import

Naver Commerce SDK는 `client`, `commands` 두 개의 모듈로 구성되어 있습니다.

SDK 사용을 위해서는 `NaverCommerceClient`, 필요한 `Command` 단 두 개만 import 하면 됩니다. (예시를 위해 `CreateAccessTokenCommand`를 사용하겠습니다)

```ts
import { NaverCommerceClient, CreateAccessTokenCommand } from "@ingestkorea/client-naver-commerce";
```

### Usage

요청을 보내기 위해서는

- Client 초기화 / 설정 정보 필요(ex. credentials)
- Command 초기화 / 파라미터 값들 필요
- `send` 메서드 호출 / Command 객체 필요

```ts
import { NaverCommerceClient, GetAccountInfoCommand } from "@ingestkorea/client-naver-commerce";

// a client can be shared by different commands.
const client = new NaverCommerceClient({
  credentials: {
    appId: "APPLICATION_ID",
    appSecret: "APPLICATION_SECRET",
    accessToken: "ACCESS_TOKEN",
  },
});
const command = new GetAccountInfoCommand({});

const output = await client.send(command);
```

### Acess Token

네이버 커머스 API는 모든 요청에 [인증 토큰](https://apicenter.commerce.naver.com/docs/auth)을 요구합니다.

토큰 발급에 필요한 전자서명은 SDK에서 내부적으로 수행하므로, SDK 사용자는 오직 [커머스 API 센터](https://apicenter.commerce.naver.com/ko/member/home)에서 발급한 **Applicaion ID, Applicaion Secret** 값들을 `Client`에 선언 후, `CreateAccessTokenCommand`를 호출하시면 됩니다.

```ts
import { NaverCommerceClient, CreateAccessTokenCommand } from "@ingestkorea/client-naver-commerce";

const client = new NaverCommerceClient({
  credentials: {
    appId: "MY_APP_ID",
    appSecret: "MY_APP_SECRET",
  },
});

const output = await client.send(new CreateAccessTokenCommand({}));
```

```json
{
  "$metadata": {
    "httpStatusCode": 200,
    "attempts": 1,
    "totalRetryDelay": 0,
    "traceId": "xxxxxxxxx"
  },
  "access_token": "5M8fqYeK6xxxxx",
  "expires_in": 10800,
  "token_type": "Bearer"
}
```

### API 호출하기

발급받은 인증 토큰의 유효 시간은 **3시간**(10,800초)입니다.

한 번 초기화된 `client`는 다른 `command` 호출을 위해 공유할 수 있습니다.

```ts
import {
  NaverCommerceClient,
  GetAccountInfoCommand,
} from "@ingestkorea/client-naver-commerce";

...

// 발급받은 access_token을 client 인증 정보에 반영
client.config.credentials.accessToken = "MY_ACCESS_TOKEN";

const command = new GetAccountInfoCommand({});

// a client can be shared by different commands.
const output = await client.send(command);
```

```json
{
  "$metadata": {
    "httpStatusCode": 200,
    "attempts": 1,
    "totalRetryDelay": 0,
    "traceId": "xxxxxxxx",
    "rateLimit": 3
  },
  "accountId": "ncp_xxxxxx",
  "accountUid": "ncp_xxxxxxzzzzzz",
  "grade": "xx"
}
```

## Getting Help

기능 추가 요청, 버그 신고는 깃허브 이슈를 사용해주세요.

## License

This SDK is distributed under the [MIT License](https://opensource.org/licenses/MIT), see LICENSE for more information.
