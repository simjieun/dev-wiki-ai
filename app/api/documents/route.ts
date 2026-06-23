import { NextResponse } from "next/server";
import { z } from "zod";
import { embedTexts } from "@/lib/ai/embedding";
import { chunkText } from "@/lib/rag/chunk";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const createDocumentSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(200),
  tags: z.array(z.string().trim().min(1).max(50)).max(20).default([]),
  content: z.string().trim().min(1, "Content is required."),
});

type CreateDocumentInput = z.infer<typeof createDocumentSchema>;

type DocumentChunkInsert = {
  document_id: string;
  content: string;
  chunk_index: number;
  embedding: number[];
};

function normalizeDocumentInput(input: CreateDocumentInput) {
  return {
    title: input.title,
    tags: Array.from(new Set(input.tags)),
    content: input.content,
  };
}

function getSaveErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.startsWith("Missing required")) {
    return "Server is not configured to save documents.";
  }

  return "Failed to save document.";
}

async function deleteDocumentById(documentId: string) {
  const supabase = createSupabaseServerClient();
  await supabase.from("documents").delete().eq("id", documentId);
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  const result = createDocumentSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      {
        error: "Invalid document payload.",
        issues: result.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  try {
    const supabase = createSupabaseServerClient();
    const document = normalizeDocumentInput(result.data);
    const chunks = chunkText(document.content);

    if (chunks.length === 0) {
      return NextResponse.json(
        { error: "Document content did not produce any chunks." },
        { status: 400 },
      );
    }

    const embeddings = await embedTexts(chunks);

    const { data, error } = await supabase
      .from("documents")
      .insert(document)
      .select("id")
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to save document." },
        { status: 500 },
      );
    }

    const chunkRows: DocumentChunkInsert[] = chunks.map((chunk, index) => ({
      document_id: data.id,
      content: chunk,
      chunk_index: index,
      embedding: embeddings[index],
    }));

    const { error: chunkError } = await supabase
      .from("document_chunks")
      .insert(chunkRows);

    if (chunkError) {
      await deleteDocumentById(data.id);

      return NextResponse.json(
        { error: "Failed to save document chunks." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { id: data.id, chunkCount: chunkRows.length },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: getSaveErrorMessage(error) },
      { status: 500 },
    );
  }
}
