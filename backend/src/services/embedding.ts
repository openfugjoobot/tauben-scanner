import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-cpu';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { createCanvas, loadImage } from 'canvas';

// Initialize TensorFlow.js CPU backend
let backendInitialized = false;
async function initializeBackend(): Promise<void> {
  if (backendInitialized) return;
  await tf.setBackend('cpu');
  await tf.ready();
  console.log('[Embedding] TensorFlow.js backend:', tf.getBackend());
  backendInitialized = true;
}

let model: mobilenet.MobileNet | null = null;
let modelLoading = false;
let modelError: string | null = null;

// Expected embedding dimension - must match backend validation
const EXPECTED_EMBEDDING_DIMENSION = 1024;

/**
 * Load the MobileNet model for embedding extraction
 * Caches the model after first load
 */
export async function loadEmbeddingModel(): Promise<void> {
  // Initialize backend first
  await initializeBackend();
  
  if (model) return;
  if (modelLoading) {
    // Wait for loading to complete
    while (modelLoading) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    if (modelError) throw new Error(modelError);
    return;
  }

  modelLoading = true;
  modelError = null;

  try {
    console.log('[Embedding] Loading MobileNet V2 with alpha 0.75...');
    
    // MobileNet V2 with alpha 0.75 produces 1024-dimensional embeddings
    model = await mobilenet.load({
      version: 2,
      alpha: 0.75
    });
    
    console.log('[Embedding] Model loaded successfully');
  } catch (error) {
    modelError = error instanceof Error ? error.message : 'Unknown error loading model';
    console.error('[Embedding] Failed to load model:', modelError);
    throw new Error(`Model load failed: ${modelError}`);
  } finally {
    modelLoading = false;
  }
}

/**
 * Check if model is loaded
 */
export function isModelLoaded(): boolean {
  return model !== null;
}

/**
 * Get last model error
 */
export function getLastModelError(): string | null {
  return modelError;
}

/**
 * Extract embedding from an image buffer
 */
export async function extractEmbeddingFromBuffer(imageBuffer: Buffer): Promise<number[]> {
  await loadEmbeddingModel();
  
  if (!model) {
    throw new Error('Embedding model not loaded');
  }

  try {
    // Load image
    const img = await loadImage(imageBuffer);
    
    // Create canvas and resize to 224x224 (MobileNet input size)
    const canvas = createCanvas(224, 224);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, 224, 224);
    
    // Get image data
    const imageData = ctx.getImageData(0, 0, 224, 224);
    
    // Create tensor directly from ImageData (node-canvas compatible)
    // tf.browser.fromPixels doesn't work with node-canvas ImageData
    const { data, width, height } = imageData;
    
    // data is RGBA, we need to create a 3-channel RGB tensor
    // Remove alpha channel and reshape to [height, width, 3]
    const rgbData = new Uint8Array(width * height * 3);
    for (let i = 0; i < width * height; i++) {
      rgbData[i * 3] = data[i * 4];     // R
      rgbData[i * 3 + 1] = data[i * 4 + 1]; // G
      rgbData[i * 3 + 2] = data[i * 4 + 2]; // B
    }
    
    // Create tensor from raw data
    // Shape: [1, 224, 224, 3]
    const tensor = tf.tensor4d(rgbData, [1, height, width, 3])
      .toFloat()
      .div(255.0); // Normalize to [0, 1]
    
    // Get embedding (true = return embedding layer)
    const embeddings = model.infer(tensor, true) as tf.Tensor;
    
    // Validate dimension
    const shape = embeddings.shape;
    if (shape.length !== 2 || shape[0] !== 1) {
      throw new Error(`Unexpected tensor shape: ${JSON.stringify(shape)}`);
    }
    
    const actualDimension = shape[1];
    if (actualDimension !== EXPECTED_EMBEDDING_DIMENSION) {
      console.warn(`[Embedding] Warning: Expected ${EXPECTED_EMBEDDING_DIMENSION} dimensions, got ${actualDimension}`);
    }
    
    // Flatten and convert to array
    const flattened = embeddings.flatten();
    const embeddingArray = Array.from(await flattened.data()) as number[];
    
    // Cleanup tensors
    tensor.dispose();
    embeddings.dispose();
    flattened.dispose();
    
    if (embeddingArray.length === 0) {
      throw new Error('Failed to extract embedding: empty array returned');
    }

    console.log(`[Embedding] Extracted ${embeddingArray.length} dimensions`);
    return embeddingArray;
  } catch (error) {
    console.error('[Embedding] Extraction error:', error);
    throw new Error(`Failed to extract embedding: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Extract embedding from base64 image string
 */
export async function extractEmbeddingFromBase64(base64Image: string): Promise<number[]> {
  console.log('[Embedding] Processing base64 image...');
  
  // Remove data:image/xxx;base64, prefix if present
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
  
  // Convert base64 to buffer
  const imageBuffer = Buffer.from(base64Data, 'base64');
  
  console.log(`[Embedding] Image buffer size: ${imageBuffer.length} bytes`);
  
  const embedding = await extractEmbeddingFromBuffer(imageBuffer);
  return embedding;
}
