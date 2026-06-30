import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Venture Metrics | Validate Your Business Concept",
  description: "Evaluate your startup idea in seconds. Get AI-powered feedback on market potential, scalability, revenue models, risks, and competitors using Google Gemini.",
  keywords: ["startup evaluation", "AI business analyst", "validate startup idea", "Gemini API startup feedback"],
  openGraph: {
    title: "Venture Metrics",
    description: "Validate your startup idea in seconds using Google Gemini.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakartaSans.variable} h-full antialiased dark`}
      style={{ colorScheme: 'dark' }}
    >
      <body className="min-h-full flex flex-col bg-[#05070f] text-slate-100 selection:bg-violet-500/30 selection:text-violet-200">
        <div className="gradient-bg-glow" />
        {children}
      </body>
    </html>
  );
}
