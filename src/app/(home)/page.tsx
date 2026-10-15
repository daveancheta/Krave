import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowDown, Camera, ShieldCheck } from 'lucide-react';
import VisionPlayground from '@/components/vision-playground';

export default function HomePage() {
  return (
    <main className="home-shell wrapper">
      <section aria-labelledby="home-title" className="home-hero">
        <p className="home-kicker">
          <span className="home-kicker-dot" />
          COMPUTER VISION · MEDIAPIPE · NEXT.JS
        </p>
        <h1 id="home-title">
          Computer vision,
          <br />
          <span>made practical.</span>
        </h1>
        <p className="home-intro">
          Learn browser-based face detection and hand tracking with practical
          guides and live examples.
        </p>
        <Button asChild size="lg" className="home-hero-button">
          <Link href="#live-demos">
            <Camera className="size-4" />
            Try the live demos
            <ArrowDown className="size-4" />
          </Link>
        </Button>
        <p className="home-privacy">
          <ShieldCheck className="size-4" />
          Your camera stays off until you choose to start a demo.
        </p>
      </section>
      <VisionPlayground />
    </main>
  );
}
