import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevWiki AI",
  description: "RAG 기반 개발자용 AI 위키",
};

const navItems = [
  { href: "/documents", label: "Documents" },
  { href: "/documents/new", label: "New Document" },
  { href: "/ask", label: "Ask" },
  { href: "/wiki", label: "Wiki" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <div className="app-shell">
          <header className="app-header">
            <nav className="app-nav" aria-label="Primary">
              <Link href="/" className="brand-link">
                DevWiki AI
              </Link>
              <div className="flex flex-wrap gap-2">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} className="nav-link">
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>
          </header>
          <main className="app-main">{children}</main>
        </div>
      </body>
    </html>
  );
}
