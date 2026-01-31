import ChatContainer from '@/components/ai/chat-container';
import { Button } from '@/components/ui/button';
import { HeroVideoDialog } from '@/components/ui/hero-video-dialog';
import { Metadata } from 'next';
import Link from 'next/link';

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

  authors: [{ name: "Dave Ancheta" }],

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

export default function HomePage() {
  return (
    <div className="wrapper flex flex-col flex-1 items-center justify-center text-center gap-6 px-4">
      <h1 className="text-3xl md:text-5xl font-black tracking-tight text-transparent 
      bg-clip-text bg-linear-to-r dark:from-gray-500 dark:to-white from-gray-500 to-black">
        Start Your Chatbot Journey with Next.js
      </h1>

      <p className="max-w-xl text-sm md:text-base text-muted-foreground">
        Learn how to connect Gemini, OpenAI, and other AI APIs in a Next.js app.
        Krave guides you through backend logic, frontend setup, and chatbot flows
        with a ready-made UI foundation.
      </p>

      <div className="flex gap-4 mt-4">
        <Button asChild>
          <Link href="/docs">
            Get Started
          </Link>
        </Button>

        <Button variant="outline" asChild>
          <Link href="/docs/frontend/ui">
            View Components
          </Link>
        </Button>
      </div>
      <div className='flex flex-row gap-2'>
        <div className="relative sm:w-200">
          <HeroVideoDialog
            className="block dark:hidden"
            animationStyle="top-in-bottom-out"
            videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
            thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
            thumbnailAlt="Hero Video"
          />
          <HeroVideoDialog
            className="hidden dark:block"
            animationStyle="top-in-bottom-out"
            videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
            thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
            thumbnailAlt="Hero Video"
          />
        </div>
        <ChatContainer />
      </div>
    </div>
  );
}
