import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "flashcard.ai",
  description:
    "AI-powered spaced repetition flashcards to make learning more effective.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geist.variable} font-sans antialiased bg-zinc-50 text-zinc-900 min-h-screen`}
      >
        <header className="border-b border-zinc-200 bg-white">
          <div className="mx-auto max-w-4xl px-4 py-4 flex items-center gap-2">
            <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <span className="text-2xl">🧠</span>
              <span className="text-lg font-bold tracking-tight text-indigo-600">
                flashcard.ai
              </span>
            </a>
          </div>
        </header>
        <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
