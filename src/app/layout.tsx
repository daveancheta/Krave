import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Inter } from 'next/font/google';
import { Metadata } from 'next';

const inter = Inter({
  subsets: ['latin'],
});

const siteName = "Krave Docs"
const creator = "HHeaven Dave Ancheta"
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const siteDescription = 
"Learn how to connect Gemini, OpenAI, and other AI APIs in a Next.js app. Krave guides you through backend logic, frontend setup, and chatbot flows with a ready-made UI foundation."

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Krave Docs",
    template: "%s - Krave Docs",
  },
  description: siteDescription,
  keywords: [
    "Krave",
    "AI Chatbot",
    "Next.js",
    "OpenAI",
    "Gemini",
    "Documentation",
    "Tutorial",
    "Chatbot UI",
    "AI Integration",
  ],
  authors: [
    { name: "Heaven Dave Ancheta", url: "https://github.com/daveancheta" },
  ],
  creator: creator,
  publisher: "krave-docs",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [{ url: "/krave.png", type: "image/svg+xml" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: siteName,
    title: "Krave Docs",
    description: siteDescription,
    images: [
      {
        url: "/home.png",
        width: 1200,
        height: 630,
        alt: "Krave Docs - Beautiful documentation made simple",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Krave Docs - Beautiful documentation made simple",
    description: siteDescription,
    creator: creator,
    images: ["/home.png"],
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "technology",
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
