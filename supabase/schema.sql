create extension if not exists pgcrypto;
create schema if not exists extensions;
create extension if not exists vector with schema extensions;

create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  source_url text,
  content text not null,
  tags text[] default '{}',
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

create table if not exists document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references documents(id) on delete cascade,
  content text not null,
  chunk_index int not null,
  embedding extensions.vector(1536) not null,
  created_at timestamptz default now(),
  unique (document_id, chunk_index)
);

create table if not exists wiki_pages (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  tags text[] default '{}',
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

create index if not exists documents_created_at_idx
  on documents (created_at desc);

create index if not exists document_chunks_document_id_idx
  on document_chunks (document_id);

create index if not exists document_chunks_embedding_idx
  on document_chunks
  using ivfflat (embedding extensions.vector_cosine_ops)
  with (lists = 100);

create index if not exists wiki_pages_created_at_idx
  on wiki_pages (created_at desc);

alter table documents enable row level security;
alter table document_chunks enable row level security;
alter table wiki_pages enable row level security;

create or replace function match_document_chunks(
  query_embedding extensions.vector(1536),
  match_count int default 5,
  similarity_threshold float default 0.5
)
returns table (
  id uuid,
  document_id uuid,
  document_title text,
  content text,
  chunk_index int,
  similarity float
)
language sql stable
set search_path = public, extensions
as $$
  select
    dc.id,
    dc.document_id,
    d.title as document_title,
    dc.content,
    dc.chunk_index,
    1 - (dc.embedding <=> query_embedding) as similarity
  from document_chunks dc
  join documents d on d.id = dc.document_id
  where 1 - (dc.embedding <=> query_embedding) > similarity_threshold
  order by dc.embedding <=> query_embedding
  limit match_count;
$$;
