'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { FaceDetector } from '@mediapipe/tasks-vision';
import { Camera, CameraOff, LoaderCircle, ScanLine } from 'lucide-react';

const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite';
const WASM_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.1.0/wasm';
const MIN_DETECTION_CONFIDENCE = 0.75;

export default function FaceDetectionModel() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detectorRef = useRef<FaceDetector | null>(null);
  const drawingUtilsRef = useRef<
    typeof import('@mediapipe/tasks-vision').DrawingUtils | null
  >(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameRef = useRef<number | null>(null);
  const runningRef = useRef(false);
  const faceDetectedRef = useRef(false);
  const [modelReady, setModelReady] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraStarting, setCameraStarting] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let createdDetector: FaceDetector | null = null;

    async function loadModel() {
      try {
        const { DrawingUtils, FaceDetector: MediaPipeFaceDetector, FilesetResolver } =
          await import('@mediapipe/tasks-vision');
        const vision = await FilesetResolver.forVisionTasks(WASM_URL);
        const options = {
          baseOptions: { modelAssetPath: MODEL_URL },
          runningMode: 'VIDEO' as const,
          minDetectionConfidence: MIN_DETECTION_CONFIDENCE,
          minSuppressionThreshold: 0.3,
        };

        try {
          createdDetector = await MediaPipeFaceDetector.createFromOptions(vision, {
            ...options,
            baseOptions: { ...options.baseOptions, delegate: 'GPU' },
          });
        } catch (gpuError) {
          console.warn('GPU face detection unavailable; retrying with CPU:', gpuError);
          createdDetector = await MediaPipeFaceDetector.createFromOptions(vision, {
            ...options,
            baseOptions: { ...options.baseOptions, delegate: 'CPU' },
          });
        }

        if (cancelled) {
          createdDetector.close();
          return;
        }

        detectorRef.current = createdDetector;
        drawingUtilsRef.current = DrawingUtils;
        setModelReady(true);
      } catch (cause) {
        console.error('Failed to load the face detection model:', cause);
        if (!cancelled) {
          setError('Could not load the face detector. Check your connection and reload.');
        }
      }
    }

    void loadModel();
    return () => {
      cancelled = true;
      runningRef.current = false;
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      createdDetector?.close();
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
    faceDetectedRef.current = false;
    setFaceDetected(false);
    setCameraOn(false);
  }, []);

  const predictWebcam = useCallback(
    (timestamp: number) => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const detector = detectorRef.current;
      if (!runningRef.current || !video || !canvas) return;

      if (
        !detector ||
        video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA ||
        video.videoWidth === 0
      ) {
        frameRef.current = requestAnimationFrame(predictWebcam);
        return;
      }

      const context = canvas.getContext('2d');
      if (!context) {
        setError('Could not create the face detection canvas.');
        stopCamera();
        return;
      }

      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      try {
        const detections = detector.detectForVideo(video, timestamp).detections.filter(
          (detection) =>
            (detection.categories?.[0]?.score ?? 0) >= MIN_DETECTION_CONFIDENCE,
        );
        context.clearRect(0, 0, canvas.width, canvas.height);

        if (detections.length > 0) {
          const DrawingUtils = drawingUtilsRef.current;
          if (!DrawingUtils) throw new Error('Face detection drawing tools are unavailable.');
          const drawingUtils = new DrawingUtils(context);
          context.font = '16px sans-serif';

          for (const detection of detections) {
            if (!detection.boundingBox) continue;
            const box = detection.boundingBox;
            const mirroredBox = {
              ...box,
              originX: canvas.width - box.originX - box.width,
            };
            drawingUtils.drawBoundingBox(mirroredBox, {
              color: '#ffffff',
              lineWidth: 4,
              fillColor: 'transparent',
            });

            const score = Math.round((detection.categories?.[0]?.score ?? 0) * 100);
            const label = `Face - ${score}%`;
            const labelWidth = context.measureText(label).width;
            context.fillStyle = '#0f172a';
            context.fillRect(mirroredBox.originX, mirroredBox.originY, labelWidth + 12, 26);
            context.fillStyle = '#ffffff';
            context.fillText(label, mirroredBox.originX + 6, mirroredBox.originY + 18);
          }
        }

        const detected = detections.length > 0;
        if (faceDetectedRef.current !== detected) {
          faceDetectedRef.current = detected;
          setFaceDetected(detected);
        }
      } catch (cause) {
        console.error('Face detection failed:', cause);
        setError('Face detection failed. Please restart the camera.');
        stopCamera();
        return;
      }

      if (runningRef.current) {
        frameRef.current = requestAnimationFrame(predictWebcam);
      }
    },
    [stopCamera],
  );

  const startCamera = useCallback(async () => {
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
      frameRef.current = requestAnimationFrame(predictWebcam);
    } catch (cause) {
      stopCamera();
      console.error('Failed to start the camera:', cause);
      setError(
        cause instanceof Error && cause.name === 'NotAllowedError'
          ? 'Camera access was denied. Allow camera access in your browser settings and try again.'
          : 'Could not start the camera. Check that it is connected and not being used by another app.',
      );
    } finally {
      setCameraStarting(false);
    }
  }, [predictWebcam, stopCamera]);

  return (
    <section aria-label="Live face detection" className="face-demo hand-demo">
      <div className="hand-demo-copy">
        <span className="hand-eyebrow">
          <ScanLine className="size-3.5" /> TASK VISION
        </span>
        <h2>Face detection.</h2>
        <p>
          Detect faces in real time with your camera. Your video stays in this browser tab.
        </p>
        <button
          className="hand-toggle"
          type="button"
          onClick={cameraOn ? stopCamera : startCamera}
          disabled={!modelReady || cameraStarting}
        >
          {cameraStarting ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : cameraOn ? (
            <CameraOff className="size-4" />
          ) : (
            <Camera className="size-4" />
          )}
          {cameraStarting
            ? 'Starting camera...'
            : cameraOn
              ? 'Stop camera'
              : modelReady
                ? 'Enable camera'
                : 'Loading face detector...'}
        </button>
        <p className="hand-status" aria-live="polite">
          {error
            ? error
            : cameraOn
              ? faceDetected
                ? 'Face detected'
                : 'No face detected'
              : modelReady
                ? 'Face detector ready'
                : 'Loading MediaPipe model...'}
        </p>
      </div>
      <div className={`hand-stage ${cameraOn ? 'is-live' : ''}`}>
        <div className="hand-camera-view face-camera-view face-detection-camera-view">
          <video ref={videoRef} autoPlay playsInline muted aria-label="Live camera preview" />
          <canvas ref={canvasRef} aria-hidden="true" />
          {!cameraOn && (
            <div className="hand-camera-placeholder">
              <Camera className="size-8" />
              <span>{error ?? 'Camera preview'}</span>
            </div>
          )}
        </div>
        <div className="hand-stage-hint">
          <span className={`hand-live-dot ${cameraOn ? 'is-live' : ''}`} />
          {cameraOn ? 'LIVE DETECTION' : 'CAMERA OFF'}
        </div>
        <div className="hand-point-count">{faceDetected ? '1' : '0'}<span>FACES</span></div>
      </div>
    </section>
  );
}
