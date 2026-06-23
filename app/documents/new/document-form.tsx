"use client";

import { type FormEvent, useState } from "react";

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

type CreateDocumentResponse = {
  id?: string;
  error?: string;
};

function parseTags(value: string): string[] {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function isCreateDocumentResponse(value: unknown): value is CreateDocumentResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const response = value as Record<string, unknown>;

  return (
    (response.id === undefined || typeof response.id === "string") &&
    (response.error === undefined || typeof response.error === "string")
  );
}

export function DocumentForm() {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>({
    status: "idle",
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState({ status: "submitting" });

    try {
      const response = await fetch("/api/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          tags: parseTags(tags),
          content,
        }),
      });

      const payload: unknown = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message =
          isCreateDocumentResponse(payload) && payload.error
            ? payload.error
            : "문서 저장 요청에 실패했습니다.";

        setSubmitState({ status: "error", message });
        return;
      }

      const documentId =
        isCreateDocumentResponse(payload) && payload.id
          ? ` ID: ${payload.id}`
          : "";

      setSubmitState({
        status: "success",
        message: `문서 저장 요청을 보냈습니다.${documentId}`,
      });
      setTitle("");
      setTags("");
      setContent("");
    } catch {
      setSubmitState({
        status: "error",
        message: "문서 저장 요청 중 오류가 발생했습니다.",
      });
    }
  }

  const isSubmitting = submitState.status === "submitting";
  const status =
    submitState.status === "success" || submitState.status === "error"
      ? submitState.status
      : "idle";
  const message =
    submitState.status === "success" || submitState.status === "error"
      ? submitState.message
      : "";

  return (
    <form onSubmit={handleSubmit} className="form-stack">
      <div className="form-grid">
        <label className="field-label">
          <span className="label-text">Title</span>
          <input
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="field"
            name="title"
            type="text"
            placeholder="React Query migration note"
          />
        </label>

        <label className="field-label">
          <span className="label-text">Tags</span>
          <input
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            className="field"
            name="tags"
            type="text"
            placeholder="react, rag, nextjs"
          />
        </label>
      </div>

      <label className="field-label">
        <span className="label-text">Content</span>
        <textarea
          required
          value={content}
          onChange={(event) => setContent(event.target.value)}
          className="field textarea-field"
          name="content"
          placeholder="# 문서 제목&#10;&#10;정리할 내용을 Markdown으로 입력하세요."
        />
      </label>

      <div className="form-footer">
        <p className="status-message" data-status={status} aria-live="polite">
          {message}
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className="button"
        >
          {isSubmitting ? "Saving..." : "Save Document"}
        </button>
      </div>
    </form>
  );
}
