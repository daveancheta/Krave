'use client';

import { useState } from 'react';
import FaceDetectionModel from '@/components/face-detection-model';
import FaceLandmarkModel from '@/components/face-landmark-model';
import HandLandmarkModel from '@/components/hand-landmark-model';

type DemoMode = 'face' | 'face-landmarks' | 'hands';

export default function VisionPlayground() {
  const [activeDemo, setActiveDemo] = useState<DemoMode>('face');

  return (
    <section id="live-demos" aria-labelledby="demos-title" className="vision-playground">
      <div className="vision-playground-heading">
        <p id="demos-title" className="vision-playground-label">
          Live demo <span>Camera starts only when you enable it.</span>
        </p>
        <div className="vision-demo-switch" role="group" aria-label="Choose a vision demo">
          <button
            type="button"
            aria-pressed={activeDemo === 'face'}
            onClick={() => setActiveDemo('face')}
          >
            Face
          </button>
          <button
            type="button"
            aria-pressed={activeDemo === 'face-landmarks'}
            onClick={() => setActiveDemo('face-landmarks')}
          >
            Face landmarks
          </button>
          <button
            type="button"
            aria-pressed={activeDemo === 'hands'}
            onClick={() => setActiveDemo('hands')}
          >
            Hands
          </button>
        </div>
      </div>
      <div key={activeDemo} className="vision-playground-panel">
        {activeDemo === 'face' ? (
          <FaceDetectionModel />
        ) : activeDemo === 'face-landmarks' ? (
          <FaceLandmarkModel />
        ) : (
          <HandLandmarkModel />
        )}
      </div>
    </section>
  );
}
