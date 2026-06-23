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
    <section className="page-stack">
      <div className="page-header">
        <p className="eyebrow">Local RAG Wiki MVP</p>
        <h1 className="page-title">DevWiki AI</h1>
        <p className="page-description">
          개발 문서를 등록하고, chunk와 embedding을 기반으로 질문에 답하는
          개인용 AI 위키입니다.
        </p>
      </div>

      <div className="card-grid">
        {quickLinks.map((link) => (
          <Link key={link.href} href={link.href} className="card-link">
            <h2 className="card-title">{link.title}</h2>
            <p className="card-description">{link.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
