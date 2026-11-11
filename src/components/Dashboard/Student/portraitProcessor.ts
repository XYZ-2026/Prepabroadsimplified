'use client';

/**
 * In-browser portrait processing for student portfolio photos.
 *
 * 1. Validates the photo (type, size, resolution).
 * 2. Removes the background with MediaPipe's multiclass selfie segmenter
 *    (classes: 0 background · 1 hair · 2 body-skin · 3 face-skin · 4 clothes · 5 others).
 * 3. Checks a face is actually present, then crops a head-and-shoulders portrait
 *    with headroom for the spotlight and exports a transparent PNG/WebP cutout.
 *
 * The heavy runtime (~15 MB wasm + ~16 MB model) is only fetched when a student
 * uploads a photo, from pinned official CDNs. If anything fails we fall back to a
 * resized copy of the original photo (rendered with a blended spotlight instead).
 */

const TASKS_VERSION = '1.2.2';
const WASM_BASE = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${TASKS_VERSION}/wasm`;
const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_multiclass_256x256/float32/latest/selfie_multiclass_256x256.tflite';

export const PHOTO_RULES = {
  maxInputBytes: 15 * 1024 * 1024,
  minShortSide: 400,
  types: ['image/jpeg', 'image/png', 'image/webp'],
};

export class PortraitRuleError extends Error {}

export interface ProcessedPortrait {
  blob: Blob;
  cutout: boolean;
  previewUrl: string;
  note?: string;
}

 
let segmenterPromise: Promise<any> | null = null;

async function getSegmenter() {
  if (!segmenterPromise) {
    segmenterPromise = (async () => {
      const { FilesetResolver, ImageSegmenter } = await import('@mediapipe/tasks-vision');
      const fileset = await FilesetResolver.forVisionTasks(WASM_BASE);
      const make = (delegate: 'GPU' | 'CPU') =>
        ImageSegmenter.createFromOptions(fileset, {
          baseOptions: { modelAssetPath: MODEL_URL, delegate },
          runningMode: 'IMAGE',
          outputCategoryMask: false,
          outputConfidenceMasks: true,
        });
      try {
        return await make('GPU');
      } catch {
        return await make('CPU');
      }
    })().catch((err) => {
      segmenterPromise = null; // allow retry on next upload
      throw err;
    });
  }
  return segmenterPromise;
}
 

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new PortraitRuleError('This image could not be opened. Please upload a JPG, PNG or WebP photo.'));
    };
    img.src = url;
  });
}

function toBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

/** Prefer WebP (smaller, keeps transparency); fall back to PNG/JPEG where unsupported. */
async function encode(canvas: HTMLCanvasElement, transparent: boolean): Promise<Blob> {
  const webp = await toBlob(canvas, 'image/webp', 0.9);
  if (webp && webp.type === 'image/webp' && webp.size <= 4.5 * 1024 * 1024) return webp;
  const fallback = await toBlob(canvas, transparent ? 'image/png' : 'image/jpeg', 0.9);
  if (!fallback) throw new Error('Could not encode image');
  return fallback;
}

function drawScaled(img: HTMLImageElement, maxSide: number) {
  const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.round(img.naturalWidth * scale);
  const h = Math.round(img.naturalHeight * scale);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, w, h);
  return { canvas, ctx, w, h };
}

/** Plain resized copy — used when background removal is unavailable. */
async function fallbackCopy(img: HTMLImageElement, note: string): Promise<ProcessedPortrait> {
  const { canvas } = drawScaled(img, 1400);
  const blob = await encode(canvas, false);
  return { blob, cutout: false, previewUrl: URL.createObjectURL(blob), note };
}

const smoothstep = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

export async function processPortrait(file: File): Promise<ProcessedPortrait> {
  if (!PHOTO_RULES.types.includes(file.type)) {
    throw new PortraitRuleError('Please upload a JPG, PNG or WebP photo.');
  }
  if (file.size > PHOTO_RULES.maxInputBytes) {
    throw new PortraitRuleError('Photo must be 15 MB or smaller.');
  }

  const img = await loadImage(file);
  try {
    if (Math.min(img.naturalWidth, img.naturalHeight) < PHOTO_RULES.minShortSide) {
      throw new PortraitRuleError(
        `Photo is too small (${img.naturalWidth}×${img.naturalHeight}). Please use at least 400 px on the shorter side — ideally 1000×1250 or larger.`,
      );
    }

    let segmenter;
    try {
      segmenter = await getSegmenter();
    } catch (err) {
      console.warn('[Portrait] Segmenter unavailable, using original photo:', err);
      return await fallbackCopy(img, 'Background removal was unavailable, so your original photo was used.');
    }

    const { canvas, ctx, w, h } = drawScaled(img, 1400);
    const result = segmenter.segment(canvas);
    const masks = result.confidenceMasks || [];
    if (masks.length < 4 || masks[0].width !== w || masks[0].height !== h) {
      masks.forEach((m: { close: () => void }) => m.close());
      return await fallbackCopy(img, 'Background removal was unavailable, so your original photo was used.');
    }

    const background: Float32Array = masks[0].getAsFloat32Array();
    const faceSkin: Float32Array = masks[3].getAsFloat32Array();
    const total = w * h;

    // Alpha = 1 - background confidence, with a soft-but-clean edge.
    const alpha = new Float32Array(total);
    let faceArea = 0;
    let personArea = 0;
    let minX = w, minY = h, maxX = -1, maxY = -1;
    let faceSumX = 0, faceMinY = h;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        const a = smoothstep(0.3, 0.7, 1 - background[i]);
        alpha[i] = a;
        if (a > 0.5) {
          personArea++;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
        if (faceSkin[i] > 0.5) {
          faceArea++;
          faceSumX += x;
          if (y < faceMinY) faceMinY = y;
        }
      }
    }
    masks.forEach((m: { close: () => void }) => m.close());

    // ── Rule checks ──
    if (faceArea / total < 0.004) {
      throw new PortraitRuleError(
        'We could not find a clear face in this photo. Please upload a front-facing photo where your whole face is visible.',
      );
    }
    if (personArea / total < 0.06) {
      throw new PortraitRuleError('You appear too small in this photo. Please use a closer, head-and-shoulders shot.');
    }
    if (minY <= 1 && faceMinY < h * 0.08) {
      throw new PortraitRuleError('The top of your head is cut off. Please leave some space above your head.');
    }

    // ── Apply alpha ──
    const pixels = ctx.getImageData(0, 0, w, h);
    const d = pixels.data;
    for (let i = 0; i < total; i++) d[i * 4 + 3] = Math.round(d[i * 4 + 3] * alpha[i]);
    ctx.putImageData(pixels, 0, 0);

    // ── Crop: centred on the face, headroom above the head, down to the bottom of the person ──
    const personH = maxY - minY + 1;
    const top = Math.max(0, Math.round(minY - personH * 0.1));
    const bottom = maxY + 1;
    const cropH = bottom - top;
    const faceCx = faceSumX / faceArea;
    const cropW = Math.min(w, Math.max(maxX - minX + 1, Math.round(cropH * 0.8)));
    let left = Math.round(faceCx - cropW / 2);
    left = Math.max(0, Math.min(w - cropW, left));

    const outScale = Math.min(1, 1250 / cropH);
    const out = document.createElement('canvas');
    out.width = Math.round(cropW * outScale);
    out.height = Math.round(cropH * outScale);
    const octx = out.getContext('2d')!;
    octx.imageSmoothingQuality = 'high';
    octx.drawImage(canvas, left, top, cropW, cropH, 0, 0, out.width, out.height);

    const blob = await encode(out, true);
    return { blob, cutout: true, previewUrl: URL.createObjectURL(blob) };
  } finally {
    URL.revokeObjectURL(img.src);
  }
}
