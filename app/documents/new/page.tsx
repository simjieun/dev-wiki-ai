import { DocumentForm } from "./document-form";

export default function NewDocumentPage() {
  return (
    <section className="page-stack">
      <div className="page-header">
        <h1 className="page-title">New Document</h1>
        <p className="page-description">
          저장할 개발 문서의 제목, 태그, 본문을 입력하세요.
        </p>
      </div>
      <DocumentForm />
    </section>
  );
}
