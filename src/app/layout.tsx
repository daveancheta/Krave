import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Inter } from 'next/font/google';
import { Metadata } from 'next';

const inter = Inter({
  subsets: ['latin'],
});

const siteName = "Krave Docs";
const creator = "Heaven Dave Ancheta";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// Shortened, more focused description (120-155 chars is optimal)
const siteDescription =
  "Connect AI APIs like Gemini and OpenAI to Next.js. Step-by-step guides for chatbots, backend logic, and ready-made UI components.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Krave Docs - AI Chatbot Integration for Next.js",
    template: "%s | Krave Docs",
  },
  description: siteDescription,
  keywords: [
    "AI chatbot Next.js",
    "OpenAI integration",
    "Gemini API tutorial",
    "Next.js AI documentation",
    "chatbot UI components",
    "AI API integration guide",
  ],
  authors: [
    { name: "Heaven Dave Ancheta", url: "https://github.com/daveancheta" },
  ],
  creator: creator,
  publisher: "Krave Docs",
  
  verification: {
    google: "google89c9ecfc790b5ed5.html", 
  },
  
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
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png", 
  },
  
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: siteName,
    title: "Krave Docs - AI Chatbot Integration for Next.js",
    description: siteDescription,
    images: [
      {
        url: `/home.png`, 
        width: 1200,
        height: 630,
        alt: "Krave Docs - AI API Integration Documentation",
      },
    ],
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Krave Docs - AI Chatbot Integration for Next.js",
    description: siteDescription,
    creator: "@yourhandle", 
    images: [`/homePage.png`], 
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
