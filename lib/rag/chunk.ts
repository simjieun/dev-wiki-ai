export type ChunkTextOptions = {
  chunkSize?: number;
  overlap?: number;
};

const DEFAULT_CHUNK_SIZE = 800;
const DEFAULT_OVERLAP = 120;

function assertChunkOptions(chunkSize: number, overlap: number) {
  if (!Number.isInteger(chunkSize) || chunkSize <= 0) {
    throw new Error("chunkSize must be a positive integer.");
  }

  if (!Number.isInteger(overlap) || overlap < 0) {
    throw new Error("overlap must be a non-negative integer.");
  }

  if (overlap >= chunkSize) {
    throw new Error("overlap must be smaller than chunkSize.");
  }
}

export function chunkText(
  content: string,
  options: ChunkTextOptions = {},
): string[] {
  const chunkSize = options.chunkSize ?? DEFAULT_CHUNK_SIZE;
  const overlap = options.overlap ?? DEFAULT_OVERLAP;

  assertChunkOptions(chunkSize, overlap);

  const normalizedContent = content.replace(/\r\n/g, "\n").trim();

  if (!normalizedContent) {
    return [];
  }

  const chunks: string[] = [];
  let start = 0;

  while (start < normalizedContent.length) {
    const end = Math.min(start + chunkSize, normalizedContent.length);
    const chunk = normalizedContent.slice(start, end).trim();

    if (chunk) {
      chunks.push(chunk);
    }

    if (end === normalizedContent.length) {
      break;
    }

    start = end - overlap;
  }

  return chunks;
}
