import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LanguageProvider } from "@/lib/LanguageContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pendle YT Analyzer",
  description: "Analytics and backtesting platform for Pendle Finance Yield Token (YT) purchase timing strategies",
  authors: [{ name: "Rusenkiy" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          <div className="flex-1 flex flex-col">{children}</div>
          <footer className="border-t border-dark-border bg-black py-4 text-center font-mono text-[10px] tracking-widest text-slate-500 uppercase select-none">
            BUILT BY <span className="text-brand-green font-bold">RUSENKIY 🐸</span>
          </footer>
        </LanguageProvider>
      </body>
    </html>
  );
}
