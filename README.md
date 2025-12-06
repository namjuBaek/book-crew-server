# Book Crew Server

독서 모임 관리 플랫폼 Book Crew의 백엔드 서버입니다.

## 기술 스택

- **Framework**: NestJS
- **Database**: MySQL
- **ORM**: TypeORM
- **Language**: TypeScript
- **Authentication**: bcrypt (비밀번호 해싱)

## 데이터베이스 스키마

데이터베이스 스키마 및 ERD는 [docs/db.md](docs/db.md)를 참고하세요.

### 주요 테이블
- `users` - 사용자 계정
- `workspaces` - 독서 모임 워크스페이스
- `members` - 워크스페이스 멤버
- `books` - 책 정보
- `meeting_logs` - 모임 기록
- `attendees` - 모임 참석자

## 프로젝트 구조

```
src/
├── infra/
│   └── database/          # 데이터베이스 설정
├── modules/
│   ├── users/             # 사용자 모듈
│   │   ├── controller/    # API 컨트롤러
│   │   ├── service/       # 비즈니스 로직
│   │   ├── repository/    # 데이터 접근
│   │   ├── entity/        # TypeORM 엔티티
│   │   └── dto/           # 데이터 전송 객체
│   ├── workspaces/        # 워크스페이스 모듈
│   ├── books/             # 책 모듈
│   └── meetings/          # 모임 모듈
└── main.ts                # 애플리케이션 진입점
```

## 보안

- 비밀번호는 bcrypt를 사용하여 해싱 (salt rounds: 10)
- DTO 유효성 검사를 통한 입력값 검증
- Whitelist 옵션으로 정의되지 않은 필드 자동 제거

## 라이선스

MIT
