import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

let model: mobilenet.MobileNet | null = null;

export async function loadEmbeddingModel(): Promise<void> {
  if (model) return;
  
  // MobileNet V3 loaded with TensorFlow.js
  // This loads the MobileNet model for feature extraction
  model = await mobilenet.load({
    version: 2,
    alpha: 1.0
  });
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
    // This returns a tensor with the features before the final classification layer
    const embeddings = model.infer(imageElement, true) as tf.Tensor;
    
    // Flatten the tensor to get a 1D array
    const flattened = embeddings.flatten();
    
    // Convert to JavaScript array
    const embeddingArray = await flattened.array() as number[];
    
    // Clean up tensors
    embeddings.dispose();
    flattened.dispose();

    // Validate embedding dimension
    if (embeddingArray.length === 0) {
      throw new Error('Failed to extract embedding: empty array returned');
    }

    return embeddingArray;
  } catch (error) {
    console.error('Embedding extraction error:', error);
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
    // For 1024-dimensional embedding, use the embedding feature
    const embedding = model.infer(imageElement, true) as tf.Tensor;
    const embeddingArray = await embedding.array() as number[];
    embedding.dispose();
    
    return embeddingArray;
  } catch (error) {
    console.error('Feature extraction error:', error);
    throw new Error(`Failed to extract features: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Base64 to Image element converter
export function base64ToImage(base64String: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      resolve(img);
    };
    
    img.onerror = (error) => {
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
  const image = await base64ToImage(base64Image);
  return extractEmbedding(image);
}
