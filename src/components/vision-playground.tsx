'use client';

import { useState } from 'react';
import FaceDetectionModel from '@/components/face-detection-model';
import HandLandmarkModel from '@/components/hand-landmark-model';

type DemoMode = 'face' | 'hands';

export default function VisionPlayground() {
  const [activeDemo, setActiveDemo] = useState<DemoMode>('face');

  return (
    <section id="live-demos" aria-labelledby="demos-title" className="vision-playground">
      <div className="vision-playground-heading">
        <div>
          <p className="home-section-kicker">INTERACTIVE PLAYGROUND</p>
          <h2 id="demos-title">Try computer vision live.</h2>
          <p className="vision-playground-description">
            Switch between demos. Camera access starts only when you enable it.
          </p>
        </div>
        <div className="vision-demo-switch" role="group" aria-label="Choose a vision demo">
          <button
            type="button"
            aria-pressed={activeDemo === 'face'}
            onClick={() => setActiveDemo('face')}
          >
            Face detection
          </button>
          <button
            type="button"
            aria-pressed={activeDemo === 'hands'}
            onClick={() => setActiveDemo('hands')}
          >
            Hand tracking
          </button>
        </div>
      </div>
      <div key={activeDemo} className="vision-playground-panel">
        {activeDemo === 'face' ? <FaceDetectionModel /> : <HandLandmarkModel />}
      </div>
    </section>
  );
}
