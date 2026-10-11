'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { HandLandmarker } from '@mediapipe/tasks-vision';
import { Camera, CameraOff, ScanLine } from 'lucide-react';

export default function HandLandmarkModel() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const landmarkerRef = useRef<HandLandmarker | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameRef = useRef<number | null>(null);
  const runningRef = useRef(false);
  const lastVideoTimeRef = useRef(-1);
  const [modelReady, setModelReady] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [handCount, setHandCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let createdLandmarker: HandLandmarker | null = null;

    async function loadModel() {
      try {
        const { FilesetResolver, HandLandmarker: MediaPipeHandLandmarker } = await import('@mediapipe/tasks-vision');
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.1.0/wasm',
        );
        const options = {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numHands: 2,
        } as const;
        try {
          createdLandmarker = await MediaPipeHandLandmarker.createFromOptions(vision, options);
        } catch {
          createdLandmarker = await MediaPipeHandLandmarker.createFromOptions(vision, {
            ...options,
            baseOptions: { ...options.baseOptions, delegate: 'CPU' },
          });
        }
        if (cancelled) {
          createdLandmarker.close();
          return;
        }
        landmarkerRef.current = createdLandmarker;
        setModelReady(true);
      } catch (cause) {
        if (!cancelled) setError(cause instanceof Error ? cause.message : 'Could not load the hand tracking model.');
      }
    }

    void loadModel();
    return () => {
      cancelled = true;
      runningRef.current = false;
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      createdLandmarker?.close();
    };
  }, []);

  const stopCamera = useCallback(() => {
    runningRef.current = false;
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    const context = canvasRef.current?.getContext('2d');
    if (context && canvasRef.current) context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setCameraOn(false);
    setHandCount(0);
  }, []);

  const startCamera = useCallback(async () => {
    if (!landmarkerRef.current) return;
    setError(null);
    try {
      const { DrawingUtils, HandLandmarker: MediaPipeHandLandmarker } = await import('@mediapipe/tasks-vision');
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) return;
      video.srcObject = stream;
      await video.play();
      runningRef.current = true;
      setCameraOn(true);

      const detect = async () => {
        const currentVideo = videoRef.current;
        const canvas = canvasRef.current;
        const landmarker = landmarkerRef.current;
        if (!runningRef.current || !currentVideo || !canvas || !landmarker) return;
        if (currentVideo.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && currentVideo.currentTime !== lastVideoTimeRef.current) {
          lastVideoTimeRef.current = currentVideo.currentTime;
          if (canvas.width !== currentVideo.videoWidth || canvas.height !== currentVideo.videoHeight) {
            canvas.width = currentVideo.videoWidth;
            canvas.height = currentVideo.videoHeight;
          }
          const result = landmarker.detectForVideo(currentVideo, performance.now());
          const context = canvas.getContext('2d');
          if (context) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            const drawing = new DrawingUtils(context);
            for (const landmarks of result.landmarks) {
              drawing.drawConnectors(landmarks, MediaPipeHandLandmarker.HAND_CONNECTIONS, { color: '#35e6a0', lineWidth: 4 });
              drawing.drawLandmarks(landmarks, { color: '#ffffff', fillColor: '#ff5d73', lineWidth: 2, radius: 5 });
            }
          }
          setHandCount(result.landmarks.length);
        }
        frameRef.current = requestAnimationFrame(() => { void detect(); });
      };
      void detect();
    } catch (cause) {
      stopCamera();
      setError(cause instanceof Error ? cause.message : 'Could not access the camera. Check your browser permissions.');
    }
  }, [stopCamera]);

  return (
    <section aria-label="Live hand landmark detection" className="hand-demo">
      <div className="hand-demo-copy">
        <span className="hand-eyebrow"><ScanLine className="size-3.5" /> TASK VISION</span>
        <h2>Hand landmark detection.</h2>
        <p>Use your camera to track up to two hands in real time. Your video stays in this browser tab.</p>
        <button className="hand-toggle" type="button" onClick={cameraOn ? stopCamera : startCamera} disabled={!modelReady}>
          {cameraOn ? <CameraOff className="size-4" /> : <Camera className="size-4" />}
          {cameraOn ? 'Stop camera' : modelReady ? 'Enable camera' : 'Loading hand tracker...'}
        </button>
        <p className="hand-status" aria-live="polite">
          {error ? error : cameraOn ? `${handCount} ${handCount === 1 ? 'hand' : 'hands'} detected` : modelReady ? 'Hand tracker ready' : 'Loading MediaPipe model...'}
        </p>
      </div>
      <div className={`hand-stage ${cameraOn ? 'is-live' : ''}`}>
        <div className="hand-camera-view">
          <video ref={videoRef} autoPlay playsInline muted aria-label="Live camera preview" />
          <canvas ref={canvasRef} aria-hidden="true" />
          {!cameraOn && <div className="hand-camera-placeholder"><Camera className="size-8" /><span>Camera preview</span></div>}
        </div>
        <div className="hand-stage-hint"><span className={`hand-live-dot ${cameraOn ? 'is-live' : ''}`} />{cameraOn ? 'LIVE TRACKING' : 'CAMERA OFF'}</div>
        <div className="hand-point-count">{handCount}<span>{handCount === 1 ? 'HAND' : 'HANDS'}</span></div>
      </div>
    </section>
  );
}
