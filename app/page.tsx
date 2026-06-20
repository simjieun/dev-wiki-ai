import Link from "next/link";

const quickLinks = [
  {
    href: "/documents",
    title: "Documents",
    description: "등록된 개발 문서와 메모를 확인합니다.",
  },
  {
    href: "/documents/new",
    title: "New Document",
    description: "Markdown 또는 텍스트 문서를 새로 추가합니다.",
  },
  {
    href: "/ask",
    title: "Ask",
    description: "내 문서 기반으로 질문하고 출처가 있는 답변을 받습니다.",
  },
  {
    href: "/wiki",
    title: "Wiki",
    description: "좋은 답변을 위키 페이지로 정리합니다.",
  },
];

export default function HomePage() {
  return (
    <section className="space-y-10">
      <div className="max-w-3xl space-y-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
          Local RAG Wiki MVP
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          DevWiki AI
        </h1>
        <p className="text-lg leading-8 text-slate-700">
          개발 문서를 등록하고, chunk와 embedding을 기반으로 질문에 답하는
          개인용 AI 위키입니다.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-lg border border-slate-200 bg-white p-5 transition hover:border-teal-300 hover:shadow-sm"
          >
            <h2 className="text-lg font-semibold text-slate-950">
              {link.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {link.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
