# Krave Docs

Practical guides and live demos for browser-based computer vision with
[MediaPipe Tasks Vision](https://ai.google.dev/edge/mediapipe/solutions/vision)
and [Next.js](https://nextjs.org/). Explore face detection and hand landmark
tracking, then adapt the examples for your own project.

## What’s inside

- **Face detection** — detect faces in a live camera preview and draw
  confidence-scored bounding boxes.
- **Hand landmark tracking** — track up to two hands and render their
  landmarks and connections.
- **Documentation** — implementation guides with example code for both tasks.

The live demos request camera access only after you choose to start them. Video
is processed in your browser and is not uploaded by the demos.

## Getting started

### Requirements

- Node.js (LTS recommended)
- npm
- A browser with webcam access for the live demos

### Install and run

```bash
git clone https://github.com/daveancheta/Krave.git
cd Krave
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Select a vision demo on the
landing page and allow camera access when prompted.

To run a production build locally:

```bash
npm run build
npm run start
```

## Documentation

- [Face Detection](https://github.com/daveancheta/Krave/blob/main/content/docs/task-vision/face-detection.mdx)
- [Hand Landmark Tracking](https://github.com/daveancheta/Krave/blob/main/content/docs/task-vision/hand-land-marker.mdx)

When running the site locally, browse the guides at `/docs/task-vision/face-detection`
and `/docs/task-vision/hand-land-marker`.

## Development commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server. |
| `npm run build` | Build the production site. |
| `npm run start` | Serve the production build. |
| `npm run lint` | Run ESLint. |
| `npm run types:check` | Generate Fumadocs MDX and Next.js types, then run TypeScript checks. |

## Built with

- Next.js and React
- Fumadocs MDX and UI
- MediaPipe Tasks Vision
- TypeScript and Tailwind CSS
