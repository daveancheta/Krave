import HomeDemoButton from '@/components/home-demo-button';
import VisionPlayground from '@/components/vision-playground';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <main className="home-shell wrapper">
      <section aria-labelledby="home-title" className="home-hero">
        <h1 id="home-title">
          Face and hand tracking
          <br />
          <span>for the browser.</span>
        </h1>
        <div className="home-hero-copy">
          <p className="home-hero-note">Built with MediaPipe Tasks Vision</p>
          <p className="home-intro">
            Explore face detection, face landmark tracking, and hand tracking
            with live demos and implementation guides for Next.js.
          </p>
          <div className="home-hero-actions">
            <HomeDemoButton />
            <Button asChild variant="outline" size="lg" className="home-docs-button">
              <Link href="/docs">
                <BookOpen className="size-4" />
                Read the docs
              </Link>
            </Button>
          </div>
        </div>
      </section>
      <VisionPlayground />
    </main>
  );
}
