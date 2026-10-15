import HomeDemoButton from '@/components/home-demo-button';
import VisionPlayground from '@/components/vision-playground';

export default function HomePage() {
  return (
    <main className="home-shell wrapper">
      <section aria-labelledby="home-title" className="home-hero">
        <h1 id="home-title">
          Face and hand tracking
          <br />
          <span>for the browser.</span>
        </h1>
        <p className="home-intro">
          MediaPipe examples for Next.js, with live demos and implementation
          guides you can adapt to your own project.
        </p>
        <HomeDemoButton />
      </section>
      <VisionPlayground />
    </main>
  );
}
