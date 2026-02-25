// DEPRECATED: Embeddings are now extracted server-side by the backend
// This file is kept for backwards compatibility but all functions are no-ops

export function getLastModelError(): string | null {
  return null;
}

export async function loadEmbeddingModel(): Promise<void> {
  console.log('[Embedding] Server-side embedding extraction enabled - no client model needed');
}

export function isModelLoaded(): boolean {
  return true;
}

export async function extractEmbedding(): Promise<number[]> {
  throw new Error('Client-side embedding extraction deprecated. Use server-side extraction via API.');
}

export async function extractMobileNetFeatures(): Promise<number[]> {
  throw new Error('Client-side embedding extraction deprecated. Use server-side extraction via API.');
}

export function base64ToImage(): Promise<HTMLImageElement> {
  throw new Error('Client-side image processing deprecated.');
}

export function resizeImageForMobileNet(): HTMLCanvasElement {
  throw new Error('Client-side image processing deprecated.');
}

export async function getEmbeddingFromBase64(): Promise<number[]> {
  throw new Error('Client-side embedding extraction deprecated. Use server-side extraction via API.');
}
