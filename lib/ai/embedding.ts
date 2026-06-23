import "server-only";

import OpenAI from "openai";

export const EMBEDDING_MODEL = "text-embedding-3-small";

function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing required environment variable: OPENAI_API_KEY");
  }

  return new OpenAI({ apiKey });
}

function normalizeEmbeddingInputs(texts: string[]): string[] {
  return texts.map((text) => text.trim());
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
  const input = normalizeEmbeddingInputs(texts);

  if (input.length === 0) {
    return [];
  }

  const emptyInputIndex = input.findIndex((text) => text.length === 0);

  if (emptyInputIndex >= 0) {
    throw new Error(`Embedding input at index ${emptyInputIndex} is empty.`);
  }

  const client = getOpenAIClient();
  const response = await client.embeddings.create({
    model: EMBEDDING_MODEL,
    input,
  });

  return response.data
    .sort((left, right) => left.index - right.index)
    .map((item) => item.embedding);
}
