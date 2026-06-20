create extension if not exists vector;

create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  source_url text,
  content text not null,
  tags text[] default '{}',
  created_at timestamptz default now()
);

create table if not exists document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references documents(id) on delete cascade,
  content text not null,
  chunk_index int not null,
  embedding vector(1536),
  created_at timestamptz default now()
);

create table if not exists wiki_pages (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  tags text[] default '{}',
  created_at timestamptz default now()
);

create or replace function match_document_chunks(
  query_embedding vector(1536),
  match_count int default 5,
  similarity_threshold float default 0.5
)
returns table (
  id uuid,
  document_id uuid,
  content text,
  chunk_index int,
  similarity float
)
language sql stable
as $$
  select
    document_chunks.id,
    document_chunks.document_id,
    document_chunks.content,
    document_chunks.chunk_index,
    1 - (document_chunks.embedding <=> query_embedding) as similarity
  from document_chunks
  where 1 - (document_chunks.embedding <=> query_embedding) > similarity_threshold
  order by document_chunks.embedding <=> query_embedding
  limit match_count;
$$;
