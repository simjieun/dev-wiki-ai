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
      <body className="font-sans antialiased">
        <div className="min-h-screen">
          <header className="border-b border-slate-200 bg-white/80">
            <nav className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <Link href="/" className="text-lg font-semibold text-slate-950">
                DevWiki AI
              </Link>
              <div className="flex flex-wrap gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>
          </header>
          <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
        </div>
      </body>
    </html>
  );
}
