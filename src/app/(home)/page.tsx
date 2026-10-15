import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import HandLandmarkModel from '@/components/hand-landmark-model';
import FaceDetectionModel from '@/components/face-detection-model';

export default function HomePage() {
  return (
    <main className="home-shell wrapper flex flex-col items-center text-center">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground">
        <span className="size-1.5 rounded-full bg-primary" />
        Computer vision guides for Next.js
      </div>

      <h1 className="max-w-4xl text-balance text-4xl font-semibold tracking-[-0.045em] text-foreground sm:text-6xl sm:leading-[1.08] lg:text-7xl">
        Bring computer vision to{' '}
        <span className="text-primary">Next.js</span>
      </h1>

      <p className="mt-6 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
        Learn to build browser-based face detection and hand tracking with
        MediaPipe. Explore practical guides and try the live camera demos below.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button asChild size="lg" className="h-11 rounded-lg px-6 shadow-sm shadow-primary/15">
          <Link href="/docs/task-vision/face-detection">
            Face Detection Guide <ArrowRight className="size-4" />
          </Link>
        </Button>
        <Button variant="outline" asChild size="lg" className="h-11 rounded-lg bg-background px-6">
          <Link href="/docs/task-vision/hand-land-marker">
            <BookOpen className="size-4" /> Hand Tracking Guide
          </Link>
        </Button>
      </div>

      <HandLandmarkModel />
      <FaceDetectionModel />
    </main>
  );
}
