# DevWiki AI

개발자가 저장한 기술 문서, 회고, 발표자료, 코드 메모를 기반으로 질문하면 출처가 있는 답변을 제공하는 RAG 기반 개발자용 AI 위키입니다.

## 핵심 컨셉

```text
문서 등록 → Chunking → Embedding → Vector DB 저장 → 질문 → 유사 문서 검색 → LLM 답변 생성
```

## MVP 목표

1. Markdown/텍스트 문서 등록
2. 문서 chunk 분리
3. OpenAI embedding 생성
4. Supabase pgvector 저장
5. 질문 기반 유사 chunk 검색
6. 검색 결과를 context로 넣어 답변 생성
7. 답변에 출처 표시

## 개발 시작

```bash
pnpm install
pnpm dev
```

## 환경 변수

`.env.local` 파일을 생성하세요.

```bash
OPENAI_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```
