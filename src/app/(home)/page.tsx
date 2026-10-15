'use client';

import ChatContainer from '@/components/ai/chat-container';
import { Button } from '@/components/ui/button';
import { HeroVideoDialog } from '@/components/ui/hero-video-dialog';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { ArrowRight, BookOpen } from 'lucide-react';
import { useEffect, useState } from 'react';
import HandLandmarkModel from '@/components/hand-landmark-model';
import FaceDetectionModel from '@/components/face-detection-model';

export default function HomePage() {
  const [isMounted, setIsMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const thumbnailSrc = isMounted && isDark ? '/dark-portfolio.png' : '/portfolio.png';

  return (
    <main className="home-shell wrapper flex flex-col items-center text-center">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground">
        <span className="size-1.5 rounded-full bg-primary" />
        Open-source AI chatbot starter for Next.js
      </div>

      <h1 className="max-w-4xl text-balance text-4xl font-semibold tracking-[-0.045em] text-foreground sm:text-6xl sm:leading-[1.08] lg:text-7xl">
        Start Your Chatbot Journey with{' '}
        <span className="text-primary">Next.js</span>
      </h1>

      <p className="mt-6 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
        Learn how to connect Gemini, OpenAI, and other AI APIs in a Next.js app.
        Krave guides you through backend logic, frontend setup, and chatbot flows
        with a ready-made UI foundation.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button asChild size="lg" className="h-11 rounded-lg px-6 shadow-sm shadow-primary/15">
          <Link href="/docs">
            Get Started <ArrowRight className="size-4" />
          </Link>
        </Button>
        <Button variant="outline" asChild size="lg" className="h-11 rounded-lg bg-background px-6">
          <Link href="/docs/frontend/ui">
            <BookOpen className="size-4" /> UI Setup Guide
          </Link>
        </Button>
      </div>

      <section aria-label="Krave product preview" className="home-preview mt-12 grid w-full max-w-6xl gap-4 rounded-xl border border-border p-3 text-left sm:mt-16 sm:gap-5 sm:p-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(300px,0.8fr)]">
        <div className="overflow-hidden rounded-lg border border-border bg-muted/40 p-1.5 sm:p-2">
          <HeroVideoDialog
            animationStyle="top-in-bottom-out"
            videoSrc="https://www.youtube.com/embed/VQawbeiYDqY?si=pPA6d-slbrLzwt1ub"
            thumbnailSrc={thumbnailSrc}
            thumbnailAlt="Preview of the Krave chatbot starter"
          />
        </div>
        <div className="hidden min-h-[420px] sm:block">
          <ChatContainer />
        </div>
      </section>

      <p className="mt-4 text-xs text-muted-foreground/80">A quick look at the interface you’ll build with Krave</p>
      <HandLandmarkModel />
      <FaceDetectionModel />
    </main>
  );
}
