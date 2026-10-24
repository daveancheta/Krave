import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Geist } from 'next/font/google';
import localFont from 'next/font/local';
import { Metadata } from 'next';

const geist = Geist({
  subsets: ['latin'],
});
const brandFont = localFont({
  src: '../../public/fonts/bricolage-grotesque-semibold.woff2',
  variable: '--font-brand',
  weight: '600',
});

const siteName = "Krave Docs";
const creator = "Heaven Dave Ancheta";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const siteDescription =
  "Practical guides for building browser-based computer vision features with MediaPipe and Next.js, including face detection and hand tracking.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Krave Docs - Computer Vision with MediaPipe and Next.js",
    template: "%s | Krave Docs",
  },
  description: siteDescription,
  keywords: [
    "computer vision Next.js",
    "MediaPipe face detection",
    "MediaPipe hand tracking",
    "browser-based computer vision",
    "Next.js vision guides",
  ],
  authors: [
    { name: "Heaven Dave Ancheta", url: "https://github.com/daveancheta" },
  ],
  creator: creator,
  publisher: "Krave Docs",
  
  verification: {
    google: "", 
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
    title: "Krave Docs - Computer Vision with MediaPipe and Next.js",
    description: siteDescription,
    images: [
      {
        url: `/home.png`, 
        width: 1200,
        height: 630,
        alt: "Krave Docs - Computer Vision Guides for Next.js",
      },
    ],
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Krave Docs - Computer Vision with MediaPipe and Next.js",
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
    <html lang="en" className={`${geist.className} ${brandFont.variable}`} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
