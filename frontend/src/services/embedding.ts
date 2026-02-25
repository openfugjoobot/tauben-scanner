import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

let model: mobilenet.MobileNet | null = null;
let modelLoadError: string | null = null;

// Expected embedding dimension - must match backend validation
const EXPECTED_EMBEDDING_DIMENSION = 1024;

export function getLastModelError(): string | null {
  return modelLoadError;
}

export async function loadEmbeddingModel(): Promise<void> {
  if (model) return;
  
  modelLoadError = null;
  
  try {
    // MobileNet V2 with alpha 0.75 produces 1024-dimensional embeddings
    // alpha 1.0 would produce 1280 dimensions, which doesn't match backend
    console.log('[Embedding] Loading MobileNet V2 with alpha 0.75...');
    
    model = await mobilenet.load({
      version: 2,
      alpha: 0.75  // Changed from 1.0 to 0.75 to get 1024 dimensions
    });
    
    console.log('[Embedding] Model loaded successfully');
  } catch (error) {
    modelLoadError = error instanceof Error ? error.message : 'Unknown error loading model';
    console.error('[Embedding] Failed to load model:', modelLoadError);
    throw new Error(`Model load failed: ${modelLoadError}`);
  }
}

export function isModelLoaded(): boolean {
  return model !== null;
}

export async function extractEmbedding(imageElement: HTMLImageElement): Promise<number[]> {
  await loadEmbeddingModel();
  
  if (!model) {
    throw new Error('Embedding model not loaded');
  }

  try {
    // Get the embeddings (true = return embedding layer, false = classification)
    // This returns a tensor with shape [1, embedding_dimension]
    const embeddings = model.infer(imageElement, true) as tf.Tensor;
    
    if (embeddings.shape.length !== 2 || embeddings.shape[0] !== 1) {
      throw new Error(`Unexpected tensor shape: ${JSON.stringify(embeddings.shape)}`);
    }
    
    // Validate dimension
    const actualDimension = embeddings.shape[1];
    if (actualDimension !== EXPECTED_EMBEDDING_DIMENSION) {
      console.warn(`[Embedding] Warning: Expected ${EXPECTED_EMBEDDING_DIMENSION} dimensions, got ${actualDimension}`);
    }
    
    // Flatten the tensor to get a 1D array
    const flattened = embeddings.flatten();
    
    // Convert to JavaScript array
    const embeddingArray = await flattened.array() as number[];
    
    // Clean up tensors
    embeddings.dispose();
    flattened.dispose();

    // Validate embedding dimension
    if (embeddingArray.length !== EXPECTED_EMBEDDING_DIMENSION) {
      console.warn(`[Embedding] Warning: Array has ${embeddingArray.length} dimensions, expected ${EXPECTED_EMBEDDING_DIMENSION}`);
    }
    
    if (embeddingArray.length === 0) {
      throw new Error('Failed to extract embedding: empty array returned');
    }

    console.log(`[Embedding] Successfully extracted embedding with ${embeddingArray.length} dimensions`);
    return embeddingArray;
  } catch (error) {
    console.error('[Embedding] Extraction error:', error);
    throw new Error(`Failed to extract embedding: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Alternative method using direct MobileNet classification features
export async function extractMobileNetFeatures(imageElement: HTMLImageElement): Promise<number[]> {
  await loadEmbeddingModel();
  
  if (!model) {
    throw new Error('Embedding model not loaded');
  }

  try {
    // Get the embedding
    const embedding = model.infer(imageElement, true) as tf.Tensor;
    
    // CRITICAL FIX: Must flatten before calling .array()
    // Without flatten(), array() returns a nested array [[...]]
    const flattened = embedding.flatten();
    const embeddingArray = await flattened.array() as number[];
    
    embedding.dispose();
    flattened.dispose();
    
    console.log(`[Embedding] extractMobileNetFeatures: ${embeddingArray.length} dimensions`);
    return embeddingArray;
  } catch (error) {
    console.error('[Embedding] Feature extraction error:', error);
    throw new Error(`Failed to extract features: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Base64 to Image element converter
export function base64ToImage(base64String: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    // Set a timeout in case image loading hangs
    const timeout = setTimeout(() => {
      reject(new Error('Image load timeout'));
    }, 10000);
    
    img.onload = () => {
      clearTimeout(timeout);
      resolve(img);
    };
    
    img.onerror = (error) => {
      clearTimeout(timeout);
      reject(new Error(`Failed to load image: ${error}`));
    };
    
    img.src = base64String;
  });
}

// Resize image to match MobileNet input requirements (224x224)
export function resizeImageForMobileNet(
  imageElement: HTMLImageElement
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 224;
  canvas.height = 224;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get canvas 2D context');
  }
  
  // Draw image covering the canvas while maintaining aspect ratio
  ctx.drawImage(imageElement, 0, 0, 224, 224);
  
  return canvas;
}

// Complete workflow: base64 -> embedding
export async function getEmbeddingFromBase64(base64Image: string): Promise<number[]> {
  console.log('[Embedding] Processing base64 image...');
  const image = await base64ToImage(base64Image);
  console.log(`[Embedding] Image loaded: ${image.width}x${image.height}`);
  const embedding = await extractEmbedding(image);
  return embedding;
}
