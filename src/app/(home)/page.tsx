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
            Examples for Next.js, with live demos and implementation guides you
            can adapt to your own project.
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
