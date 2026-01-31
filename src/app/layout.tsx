import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Inter } from 'next/font/google';
import { Metadata } from 'next';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Krave",
    default: "Krave",
  },
  description:
    "Krave is a ready-made AI chatbot assistant built with Next.js, featuring Gemini, OpenAI, and Claude API integration with a UI starter kit.",
  
  keywords: [
    "Krave", "AI Chatbot", "Next.js", "Gemini API", "OpenAI API", "Claude API", "UI Starter", "Chatbot Guide"
  ],

  authors: [{ name: "Heaven Dave Ancheta" }],

  openGraph: {
    title: "Krave – AI Chatbot Assistant with Next.js",
    description:
      "Step-by-step guide to build AI chatbots using Gemini, OpenAI, and Claude APIs with a Next.js UI starter kit.",
    url: "https://krave-docs.vercel.app",
    siteName: "Krave Docs",
    images: [
      {
        url: "/home.png",
        width: 1200,
        height: 630,
        alt: "Krave Docs – AI Chatbot",
      },
    ],
    type: "website",
  },
};


export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
