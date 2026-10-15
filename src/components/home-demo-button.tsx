'use client';

import { ArrowDownRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomeDemoButton() {
  const scrollToDemo = () => {
    document.getElementById('live-demos')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <Button type="button" size="lg" className="home-hero-button" onClick={scrollToDemo}>
      Explore the demo
      <ArrowDownRight className="size-4" />
    </Button>
  );
}
