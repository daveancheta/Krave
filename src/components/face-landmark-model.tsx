'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { DrawingUtils, FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { Camera, CameraOff, LoaderCircle, ScanLine } from 'lucide-react';

const WASM_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.1.0/wasm';
const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';
const SKELETON_COLOR = '#55e6c1';
const DOT_COLOR = '#f8fafc';
const DRAWING_SIZE = 2;

export default function FaceLandmarkModel() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const landmarkerRef = useRef<FaceLandmarker | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameRef = useRef<number | null>(null);
  const runningRef = useRef(false);
  const [modelReady, setModelReady] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraStarting, setCameraStarting] = useState(false);
  const [faceCount, setFaceCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let createdLandmarker: FaceLandmarker | null = null;

    async function loadModel() {
      try {
        const vision = await FilesetResolver.forVisionTasks(WASM_URL);
        const options = {
          baseOptions: { modelAssetPath: MODEL_URL },
          runningMode: 'VIDEO' as const,
          numFaces: 2,
          minFaceDetectionConfidence: 0.5,
          minFacePresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
          outputFaceBlendshapes: false,
          outputFacialTransformationMatrixes: false,
        };

        try {
          createdLandmarker = await FaceLandmarker.createFromOptions(vision, {
            ...options,
            baseOptions: { ...options.baseOptions, delegate: 'GPU' },
          });
        } catch {
          createdLandmarker = await FaceLandmarker.createFromOptions(vision, {
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
        if (!cancelled) {
          setError(cause instanceof Error ? cause.message : 'Could not load the face landmark model.');
        }
      }
    }

    const startupTimer = window.setTimeout(() => {
      void loadModel();
    }, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(startupTimer);
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
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (canvas && context) context.clearRect(0, 0, canvas.width, canvas.height);
    setCameraOn(false);
    setFaceCount(0);
  }, []);

  const predictFrame = useCallback((timestamp: number) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const landmarker = landmarkerRef.current;
    if (!runningRef.current || !video || !canvas) return;

    if (!landmarker || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA || video.videoWidth === 0) {
      frameRef.current = requestAnimationFrame(predictFrame);
      return;
    }

    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }
    const context = canvas.getContext('2d');
    if (!context) {
      setError('Could not create the face landmark canvas.');
      stopCamera();
      return;
    }

    try {
      const result = landmarker.detectForVideo(video, timestamp);
      context.clearRect(0, 0, canvas.width, canvas.height);
      const drawing = new DrawingUtils(context);
      for (const landmarks of result.faceLandmarks) {
        drawing.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_TESSELATION, {
          color: `${SKELETON_COLOR}55`,
          lineWidth: Math.max(0.5, DRAWING_SIZE * 0.7),
        });
        drawing.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_FACE_OVAL, {
          color: SKELETON_COLOR,
          lineWidth: Math.max(1, DRAWING_SIZE * 1.5),
        });
        drawing.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LIPS, {
          color: SKELETON_COLOR,
          lineWidth: Math.max(1, DRAWING_SIZE * 1.5),
        });
        drawing.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LEFT_EYE, { color: DOT_COLOR, lineWidth: DRAWING_SIZE });
        drawing.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE, { color: DOT_COLOR, lineWidth: DRAWING_SIZE });
        drawing.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW, { color: DOT_COLOR, lineWidth: DRAWING_SIZE });
        drawing.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW, { color: DOT_COLOR, lineWidth: DRAWING_SIZE });
        drawing.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS, { color: DOT_COLOR, lineWidth: DRAWING_SIZE });
        drawing.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS, { color: DOT_COLOR, lineWidth: DRAWING_SIZE });
      }
      setFaceCount(result.faceLandmarks.length);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Face landmarking failed.');
      stopCamera();
      return;
    }

    if (runningRef.current) frameRef.current = requestAnimationFrame(predictFrame);
  }, [stopCamera]);

  const startCamera = useCallback(async () => {
    if (!landmarkerRef.current || cameraStarting) return;
    setCameraStarting(true);
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      });
      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) {
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        return;
      }
      video.srcObject = stream;
      await video.play();
      runningRef.current = true;
      setCameraOn(true);
      frameRef.current = requestAnimationFrame(predictFrame);
    } catch (cause) {
      stopCamera();
      setError(cause instanceof Error ? cause.message : 'Could not access the camera.');
    } finally {
      setCameraStarting(false);
    }
  }, [cameraStarting, predictFrame, stopCamera]);

  return (
    <section aria-label="Live face landmark tracking" className="face-demo hand-demo">
      <div className="hand-demo-copy">
        <span className="hand-eyebrow"><ScanLine className="size-3.5" /> TASK VISION</span>
        <h2>Face landmark tracking.</h2>
        <p>Track facial landmarks and contours in real time. Your video stays in this browser tab.</p>
        <button className="hand-toggle" type="button" onClick={cameraOn ? stopCamera : startCamera} disabled={!modelReady || cameraStarting}>
          {cameraStarting ? <LoaderCircle className="size-4 animate-spin" /> : cameraOn ? <CameraOff className="size-4" /> : <Camera className="size-4" />}
          {cameraStarting ? 'Starting camera...' : cameraOn ? 'Stop camera' : modelReady ? 'Enable camera' : 'Loading face landmarker...'}
        </button>
        <p className="hand-status" aria-live="polite">
          {error ? error : cameraOn ? `${faceCount} ${faceCount === 1 ? 'face' : 'faces'} tracked` : modelReady ? 'Face landmarker ready' : 'Loading MediaPipe model...'}
        </p>
      </div>
      <div className={`hand-stage ${cameraOn ? 'is-live' : ''}`}>
        <div className="hand-camera-view face-camera-view face-landmark-camera-view">
          <video ref={videoRef} autoPlay playsInline muted aria-label="Live camera preview" className="scale-x-[-1]" />
          <canvas ref={canvasRef} aria-hidden="true" className="scale-x-[-1]" />
          {!cameraOn && <div className="hand-camera-placeholder"><Camera className="size-8" /><span>{error ?? 'Camera preview'}</span></div>}
        </div>
        <div className="hand-stage-hint"><span className={`hand-live-dot ${cameraOn ? 'is-live' : ''}`} />{cameraOn ? 'LIVE TRACKING' : 'CAMERA OFF'}</div>
        <div className="hand-point-count">{faceCount}<span>{faceCount === 1 ? 'FACE' : 'FACES'}</span></div>
      </div>
    </section>
  );
}
