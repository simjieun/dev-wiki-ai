# DevWiki AI 작업 우선순위

이 문서는 Codex 또는 AI 코딩 에이전트가 순차적으로 작업할 수 있도록 작성한 실행 단위입니다.

## 작업 원칙

- 한 번에 하나의 태스크만 진행한다.
- 각 태스크 완료 후 `pnpm typecheck`, `pnpm lint`, `pnpm build` 중 가능한 검증을 수행한다.
- UI보다 RAG 흐름의 end-to-end 동작을 우선한다.
- 처음에는 인증 없이 로컬 개인용 MVP로 만든다.
- 모든 기능은 작은 단위로 커밋 가능한 상태를 목표로 한다.

---

## 현재 진행 상태

- 마지막 완료 태스크: `P3-1. Chunking 함수 작성`
- 다음 진행 태스크: `P3-2. Embedding 함수 작성`
- Supabase 프로젝트: `devwiki-ai`
- Supabase project id/ref: `rfsnhfjdxneaoijlswtp`
- Supabase region: `ap-northeast-2`
- Supabase URL: `https://rfsnhfjdxneaoijlswtp.supabase.co`
- GitHub 저장소: `https://github.com/simjieun/llm-dev-wiki`
- 현재 미커밋 변경: `docs/DESIGN.md`, `TASKS.md`, `app/api/documents/route.ts`, 디자인 시스템 UI 변경 파일

### 완료된 검증

- P1-1 완료 후 `pnpm typecheck`, `pnpm lint`, `pnpm build` 통과
- P1-2 완료 후 `pnpm typecheck`, `pnpm lint`, `pnpm build` 통과
- P2-1 완료 후 `pnpm typecheck`, `pnpm lint`, `pnpm build` 통과
- P2-1 완료 후 `pnpm dev`에서 `/documents/new` 200 응답과 폼 렌더링 확인
- P2-2 완료 후 `pnpm typecheck`, `pnpm lint`, `pnpm build` 통과
- P2-2 완료 후 `/api/documents` invalid JSON 400 응답 확인
- P2-2 완료 후 `/api/documents` zod validation 400 응답 확인
- P2-2 완료 후 `/api/documents` 저장 성공 `201` 및 `{ id }` 응답 확인
- P2-2 검증용 테스트 문서 삭제 확인
- P3-1 완료 후 `pnpm typecheck`, `pnpm lint`, `pnpm build` 통과
- P3-1 완료 후 chunk 런타임 검증 통과
- Supabase migration 적용 완료
  - `initial_rag_schema`
  - `harden_rag_schema_search_path`

### 다음 작업 시작 전 확인

- `.env.local`에 아래 값이 필요하다.
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
- 다음 작업은 `P3-2`만 진행한다.
- `P3-2` 완료 후 검증하고, 변경사항과 검증 결과를 요약한다.

---

# Phase 0. 프로젝트 기본 세팅

## P0-1. Next.js 프로젝트 실행 가능 상태 만들기 - 완료

### 목표

현재 스캐폴드가 `pnpm dev`로 실행되도록 기본 파일을 완성한다.

### 작업

- `app/layout.tsx` 생성
- `app/page.tsx` 생성
- `tsconfig.json` 생성
- `next.config.ts` 생성
- Tailwind 기본 설정 추가
- 기본 네비게이션 추가

### 완료 조건

- `/` 페이지 접속 가능
- `/documents`, `/documents/new`, `/ask`, `/wiki` 링크가 보임

---

# Phase 1. DB / Supabase / pgvector

## P1-1. Supabase schema 작성 - 완료

### 목표

문서와 chunk를 저장할 DB 테이블을 만든다.

### 작업

- `documents` 테이블 생성
- `document_chunks` 테이블 생성
- `wiki_pages` 테이블 생성
- pgvector extension 활성화
- similarity search RPC 작성

### 완료 조건

- `supabase/schema.sql` 실행 시 테이블과 RPC가 생성됨

### 완료 메모

- 새 Supabase 프로젝트 `devwiki-ai` 생성 완료
- `documents`, `document_chunks`, `wiki_pages` 테이블 생성 완료
- `pgcrypto`, `vector` extension 활성화 완료
- `match_document_chunks` RPC 생성 완료
- RLS 활성화 완료
- 보안 advisor WARN 항목 보정 완료

## P1-2. Supabase client 작성 - 완료

### 목표

서버에서 Supabase에 접근할 수 있는 client를 만든다.

### 작업

- `lib/supabase/server.ts` 작성
- 환경변수 누락 시 명확한 에러 처리

### 완료 조건

- Route Handler에서 Supabase client import 가능

### 완료 메모

- `lib/supabase/server.ts` 작성 완료
- `server-only`로 서버 전용 모듈 처리 완료
- `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` 누락 시 명확한 에러 처리 완료

---

# Phase 2. 문서 등록

## P2-1. 문서 등록 UI 작성 - 완료

### 목표

사용자가 제목, 태그, 본문을 입력해 문서를 등록할 수 있다.

### 작업

- `/documents/new` 페이지 구현
- title 입력
- tags 입력
- content textarea 입력
- submit 버튼

### 완료 조건

- 입력값을 `/api/documents`로 POST 요청할 수 있음

### 완료 메모

- `/documents/new`에 title, tags, content 입력 UI 구현 완료
- submit 시 `/api/documents`로 JSON POST 요청하도록 구현 완료
- API 구현은 `P2-2`에서 진행한다.

## P2-2. 문서 저장 API 작성 - 완료

### 목표

문서 원문을 `documents` 테이블에 저장한다.

### 작업

- `app/api/documents/route.ts` 생성
- POST 요청 처리
- zod validation 적용
- Supabase insert 구현

### 완료 조건

- 문서 저장 성공 시 document id 반환

### 완료 메모

- `app/api/documents/route.ts` 생성 완료
- POST 요청 JSON parsing 구현 완료
- zod validation 구현 완료
- Supabase `documents` insert 구현 완료
- 성공 시 `{ id }`를 `201`로 반환하도록 구현 완료
- 로컬 `.env.local`의 `SUPABASE_SERVICE_ROLE_KEY`로 실제 저장 성공 라이브 검증 완료

---

# Phase 3. RAG Ingestion

## P3-1. Chunking 함수 작성 - 완료

### 목표

긴 문서를 검색 가능한 작은 단위로 나눈다.

### 작업

- `lib/rag/chunk.ts` 작성
- 기본 chunk size: 800자
- overlap: 120자
- 빈 문자열 제거

### 완료 조건

- content 입력 시 chunk 배열 반환

### 완료 메모

- `lib/rag/chunk.ts` 작성 완료
- 기본 chunk size `800`, overlap `120` 적용 완료
- 빈 문자열 입력 시 빈 배열 반환 확인
- 1900자 입력 시 `[800, 800, 540]` chunk 및 overlap 동작 확인

## P3-2. Embedding 함수 작성

### 목표

OpenAI embedding API를 이용해 텍스트를 벡터로 변환한다.

### 작업

- `lib/ai/embedding.ts` 작성
- `text-embedding-3-small` 사용
- batch embedding 지원

### 완료 조건

- 문자열 배열 입력 시 embedding 배열 반환

## P3-3. 문서 저장 시 chunk + embedding 저장

### 목표

문서 등록 후 document_chunks에 chunk와 embedding을 저장한다.

### 작업

- `/api/documents` POST 내부에서 chunking 실행
- embedding 생성
- `document_chunks` insert

### 완료 조건

- 문서 1개 등록 시 여러 chunk가 저장됨

---

# Phase 4. Ask My Wiki

## P4-1. 질문 UI 작성

### 목표

사용자가 질문을 입력하고 답변을 받을 수 있다.

### 작업

- `/ask` 페이지 구현
- question textarea
- submit 버튼
- answer 영역
- sources 영역

### 완료 조건

- 질문을 `/api/ask`로 POST 요청 가능

## P4-2. similarity search 구현

### 목표

질문과 관련된 document_chunks를 검색한다.

### 작업

- 질문 embedding 생성
- Supabase RPC `match_document_chunks` 호출
- topK 기본값 5

### 완료 조건

- 질문 입력 시 관련 chunk 목록 반환

## P4-3. RAG 답변 생성 구현

### 목표

검색된 chunk를 context로 넣어 LLM 답변을 생성한다.

### 작업

- `lib/ai/chat.ts` 작성
- system prompt 작성
- context에 없는 내용은 모른다고 답하도록 제한
- 답변과 sources 반환

### 완료 조건

- `/ask`에서 출처가 포함된 답변 확인 가능

---

# Phase 5. 문서 목록 / 상세

## P5-1. 문서 목록 구현

### 목표

저장된 문서 목록을 볼 수 있다.

### 작업

- `/documents` 페이지 구현
- title, tags, created_at 표시

### 완료 조건

- 등록된 문서가 목록에 표시됨

## P5-2. 문서 상세 구현

### 목표

문서 원문과 chunk 상태를 확인할 수 있다.

### 작업

- `/documents/[id]` 페이지 구현
- 원문 markdown 렌더링
- chunk 개수 표시

### 완료 조건

- 문서 상세 페이지 접속 가능

---

# Phase 6. Wiki Page 저장

## P6-1. 좋은 답변을 위키로 저장

### 목표

Ask 답변을 wiki page로 저장한다.

### 작업

- `wiki_pages` insert API 작성
- `/ask` 답변 영역에 “위키로 저장” 버튼 추가

### 완료 조건

- 답변을 wiki page로 저장 가능

## P6-2. Wiki 목록/상세 구현

### 목표

저장한 위키 문서를 다시 볼 수 있다.

### 작업

- `/wiki` 목록 구현
- `/wiki/[id]` 상세 구현

### 완료 조건

- 저장된 위키 문서를 확인 가능

---

# Phase 7. 품질 개선

## P7-1. Prompt 개선

### 목표

답변 품질을 개발자 위키 스타일로 개선한다.

### 작업

- 답변 구조 고정
- 한 줄 요약
- 핵심 개념
- 예제 코드
- 주의사항
- 참고한 source 표시

### 완료 조건

- 답변이 일관된 위키 문서 형식으로 생성됨

## P7-2. 검색 품질 개선

### 목표

관련 chunk 검색 정확도를 높인다.

### 작업

- chunk size 조정
- similarity threshold 적용
- title/tags metadata 활용

### 완료 조건

- 관련 없는 source가 줄어듦

---

# Phase 8. 확장 후보

- URL 크롤링 문서 등록
- GitHub repository 문서/코드 ingestion
- PDF 업로드
- 로그인/Auth
- 팀 workspace
- 문서 자동 요약
- 발표자료 자동 생성
- 면접 질문 자동 생성
