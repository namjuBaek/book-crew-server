# Book Crew DB 스펙

## 공통 규칙

- **구현 기술 스택**: TypeORM + MySQL 사용을 원칙으로 하며 아래 명세는 해당 구조로 코드로 구현한다.
- **DB**: MySQL 기준으로 작성. 다른 RDB도 타입만 맞게 치환 가능.
- **테이블 네이밍**: `snake_case`, 복수형
  - 예: `user` → `users`, `meeting_log` → `meeting_logs`
- **기본 키(PK)**: 모든 테이블 `id BIGSERIAL` (또는 `BIGINT` + 시퀀스)
- **시간 컬럼**: ERD 기준으로 `created_at`만 필수
  - 타입: `TIMESTAMP WITH TIME ZONE` (또는 `TIMESTAMPTZ`)
- **논리 삭제는 없음** (soft delete 필요하면 `deleted_at` 추가 고려)

---

## 1. users

### 목적

- 서비스 로그인 계정(아이디/비밀번호)을 관리하는 테이블.
- 워크스페이스/멤버와는 분리된 **계정 단위**.

### 테이블명

- `users`

### 컬럼

| 컬럼명       | 타입           | NN  | 기본값         | 설명                                |
| ------------ | -------------- | --- | -------------- | ----------------------------------- |
| `id`         | BIGSERIAL (PK) | YES | auto increment | 사용자 식별자                       |
| `created_at` | TIMESTAMPTZ    | YES | `NOW()`        | 생성 일시                           |
| `user_id`    | VARCHAR(255)   | YES |                | 로그인용 사용자 ID (이메일 or 핸들) |
| `password`   | VARCHAR(255)   | YES |                | 해시된 비밀번호 문자열              |

### 제약 조건

- PK: `PRIMARY KEY (id)`
- 유니크: `UNIQUE (user_id)` → 같은 `user_id` 중복 불가

### 인덱스

- `users_user_id_uindex` on `user_id` (unique)

---

## 2. workspaces

### 목적

- 하나의 **독서 모임 그룹 / 공간**을 의미하는 단위.
- 책/모임 로그/멤버가 모두 workspace에 속함.

### 테이블명

- `workspaces`

### 컬럼

| 컬럼명        | 타입           | NN  | 기본값  | 설명                                       |
| ------------- | -------------- | --- | ------- | ------------------------------------------ |
| `id`          | BIGSERIAL (PK) | YES |         | 워크스페이스 식별자                        |
| `created_at`  | TIMESTAMPTZ    | YES | `NOW()` | 생성 일시                                  |
| `name`        | VARCHAR(255)   | YES |         | 워크스페이스 이름                          |
| `description` | TEXT           | NO  |         | 워크스페이스 소개                          |
| `password`    | VARCHAR(255)   | NO  |         | 입장/참여 코드 (해시 or 평문, 정책에 따라) |

### 제약 조건

- PK: `PRIMARY KEY (id)`

### 인덱스

- 필요 시, `name`에 일반 인덱스 고려 (검색용)

---

## 3. members

### 목적

- **user ↔ workspace** 연결 테이블 + 추가 정보  
  (닉네임, 역할 등)

### 테이블명

- `members`

### 컬럼

| 컬럼명         | 타입           | NN  | 기본값     | 설명                                                                   |
| -------------- | -------------- | --- | ---------- | ---------------------------------------------------------------------- |
| `id`           | BIGSERIAL (PK) | YES |            | 멤버 식별자                                                            |
| `created_at`   | TIMESTAMPTZ    | YES | `NOW()`    | 생성 일시                                                              |
| `user_id`      | BIGINT         | YES |            | FK → `users.id`                                                        |
| `workspace_id` | BIGINT         | YES |            | FK → `workspaces.id`                                                   |
| `name`         | VARCHAR(255)   | YES |            | 워크스페이스 내에서 사용할 이름/닉네임                                 |
| `role`         | VARCHAR(20)    | YES | `'MEMBER'` | 역할: `ADMIN` \| `MEMBER` (애플리케이션 레벨에서 enum 관리 or DB enum) |

### 제약 조건

- PK: `PRIMARY KEY (id)`
- FK:
  - `FOREIGN KEY (user_id) REFERENCES users(id)`
  - `FOREIGN KEY (workspace_id) REFERENCES workspaces(id)`
- 유니크:
  - `UNIQUE (user_id, workspace_id)` → 한 유저가 같은 워크스페이스에 여러 번 가입하는 것 방지

### 인덱스

- `members_user_id_idx` on `user_id`
- `members_workspace_id_idx` on `workspace_id`

---

## 4. books

### 목적

- 각 워크스페이스에서 읽는 **책 정보** 관리.

### 테이블명

- `books`

### 컬럼

| 컬럼명          | 타입           | NN  | 기본값  | 설명                 |
| --------------- | -------------- | --- | ------- | -------------------- |
| `id`            | BIGSERIAL (PK) | YES |         | 책 식별자            |
| `created_at`    | TIMESTAMPTZ    | YES | `NOW()` | 생성 일시            |
| `workspace_id`  | BIGINT         | YES |         | FK → `workspaces.id` |
| `created_by_id` | BIGINT         | YES |         | FK → `members.id`    |
| `title`         | VARCHAR(255)   | YES |         | 책 제목              |

### 제약 조건

- PK: `PRIMARY KEY (id)`
- FK:
  - `FOREIGN KEY (workspace_id) REFERENCES workspaces(id)`
  - `FOREIGN KEY (created_by_id) REFERENCES members(id)`

### 인덱스

- `books_workspace_id_idx` on `workspace_id`
- `books_created_by_id_idx` on `created_by_id`
- 필요 시 `title` + `workspace_id` 복합 인덱스 고려

---

## 5. meeting_logs

### 목적

- 날짜별 **모임 기록(세션)** 테이블.
- 어떤 책으로 어떤 모임을 했는지, 제목/간단 설명 등을 기록.

### 테이블명

- `meeting_logs`

### 컬럼

| 컬럼명         | 타입           | NN  | 기본값  | 설명                                                |
| -------------- | -------------- | --- | ------- | --------------------------------------------------- |
| `id`           | BIGSERIAL (PK) | YES |         | 모임 로그 식별자                                    |
| `created_at`   | TIMESTAMPTZ    | YES | `NOW()` | 생성 일시                                           |
| `workspace_id` | BIGINT         | YES |         | FK → `workspaces.id`                                |
| `book_id`      | BIGINT         | NO  |         | FK → `books.id` (책 없이 모임도 가능하면 NULL 허용) |
| `title`        | VARCHAR(255)   | YES |         | 모임 제목 (예: "3회차 정기 모임")                   |
| `meeting_date` | DATE           | YES |         | 진행 일자                                           |

### 제약 조건

- PK: `PRIMARY KEY (id)`
- FK:
  - `FOREIGN KEY (workspace_id) REFERENCES workspaces(id)`
  - `FOREIGN KEY (book_id) REFERENCES books(id)`

### 인덱스

- `meeting_logs_workspace_id_idx` on `workspace_id`
- `meeting_logs_book_id_idx` on `book_id`

---

## 6. attendees

### 목적

- 특정 모임(meeting_log)에 **어떤 멤버가 참석했는지** 기록.
- 이후 출석 통계, 참여도 분석 등 가능.

### 테이블명

- `attendees`

### 컬럼

| 컬럼명           | 타입           | NN  | 기본값  | 설명                                    |
| ---------------- | -------------- | --- | ------- | --------------------------------------- |
| `id`             | BIGSERIAL (PK) | YES |         | 참석 기록 식별자                        |
| `created_at`     | TIMESTAMPTZ    | YES | `NOW()` | 생성 일시                               |
| `meeting_log_id` | BIGINT         | YES |         | FK → `meeting_logs.id`                  |
| `member_id`      | BIGINT         | YES |         | FK → `members.id`                       |
| `note`           | TEXT           | NO  |         | 해당 참석자가 해당 문서에 책에 대한 의견을 작성하는 내용 |

### 제약 조건

- PK: `PRIMARY KEY (id)`
- FK:
  - `FOREIGN KEY (meeting_log_id) REFERENCES meeting_logs(id)`
  - `FOREIGN KEY (member_id) REFERENCES members(id)`
- 유니크:
  - `UNIQUE (meeting_log_id, member_id)` → 같은 모임에 같은 멤버가 중복 참석 기록되는 것 방지

### 인덱스

- `attendees_meeting_log_id_idx` on `meeting_log_id`
- `attendees_member_id_idx` on `member_id`

---

## 7. 테이블 간 관계 요약

- `users` (1) — (N) `members`  
  `members.user_id` → `users.id`
- `workspaces` (1) — (N) `members`  
  `members.workspace_id` → `workspaces.id`
- `workspaces` (1) — (N) `books`  
  `books.workspace_id` → `workspaces.id`
- `members` (1) — (N) `books`  
  `books.created_by_id` → `members.id`
- `workspaces` (1) — (N) `meeting_logs`  
  `meeting_logs.workspace_id` → `workspaces.id`
- `books` (1) — (N) `meeting_logs` (optional)  
  `meeting_logs.book_id` → `books.id`
- `meeting_logs` (1) — (N) `attendees`  
  `attendees.meeting_log_id` → `meeting_logs.id`
- `members` (1) — (N) `attendees`  
  `attendees.member_id` → `members.id`

---

## 8. 구현 시 참고

- `role` 컬럼은
  - MySQL ENUM 타입으로 만들거나,
  - VARCHAR로 두고 애플리케이션 레벨에서 enum 관리.
- `read_start_period`, `read_end_period`는 기간 기준으로 `DATE`를 사용하되, 시각까지 필요하면 `TIMESTAMPTZ`로 변경해서 구현.
