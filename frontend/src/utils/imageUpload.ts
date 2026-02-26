/**
 * T4 API Layer - Image Upload Utilities
 * React Native compatible FormData helpers for image uploads
 */

/**
 * Result from a camera or file picker
 * Compatible with Capacitor Camera plugin
 */
export interface ImageResult {
  webPath?: string;
  path?: string;
  base64String?: string;
  format?: string;
}

/**
 * Image data prepared for upload
 */
export interface PreparedImage {
  base64: string;
  blob: Blob;
  fileName: string;
  mimeType: string;
}

/**
 * Convert a base64 string to a Blob (works in React Native and Web)
 */
export const base64ToBlob = (base64: string, mimeType = 'image/jpeg'): Blob => {
  // Remove data URL prefix if present
  const cleanBase64 = base64.includes(',') 
    ? base64.split(',')[1] 
    : base64;
  
  // For React Native, we can use the base64 directly without conversion
  // This is also compatible with web
  try {
    const byteCharacters = atob(cleanBase64);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  } catch (error) {
    console.error('[ImageUpload] Failed to convert base64 to blob:', error);
    throw new Error('Failed to process image');
  }
};

/**
 * Prepare image data from camera/file picker result
 * Works with Capacitor Camera plugin
 */
export const prepareImageForUpload = async (
  imageResult: ImageResult,
  options?: {
    fileName?: string;
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    mimeType?: string;
  }
): Promise<PreparedImage> => {
  const { 
    fileName = `image_${Date.now()}.jpg`,
    mimeType = 'image/jpeg'
  } = options || {};

  // Get base64 data
  let base64 = imageResult.base64String;
  
  if (!base64) {
    // If no base64String provided, try to fetch from webPath
    const imageUrl = imageResult.webPath || imageResult.path;
    if (!imageUrl) {
      throw new Error('No image data available');
    }
    
    // Fetch and convert to base64
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    base64 = await blobToBase64(blob);
  }

  // Convert to blob
  const blob = base64ToBlob(base64, mimeType);

  return {
    base64,
    blob,
    fileName,
    mimeType,
  };
};

/**
 * Convert Blob to base64 string
 */
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Remove data URL prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Create FormData for image upload
 * Compatible with React Native and Web
 */
export const createImageUploadFormData = (
  image: PreparedImage | Blob | string,
  metadata?: {
    pigeonId?: string;
    isPrimary?: boolean;
    notes?: string;
  }
): FormData => {
  const formData = new FormData();

  // Handle different input types
  if (typeof image === 'string') {
    // Base64 string - convert to blob
    formData.append('image', base64ToBlob(image), 'image.jpg');
  } else if (image instanceof Blob) {
    // Direct blob
    formData.append('image', image, 'image.jpg');
  } else {
    // PreparedImage object
    formData.append('image', image.blob, image.fileName);
  }

  // Add metadata
  if (metadata?.pigeonId) {
    formData.append('pigeon_id', metadata.pigeonId);
  }
  if (metadata?.isPrimary !== undefined) {
    formData.append('is_primary', String(metadata.isPrimary));
  }
  if (metadata?.notes) {
    formData.append('notes', metadata.notes);
  }

  return formData;
};

/**
 * Helper for Capacitor Camera result -> FormData
 * One-step conversion from camera to upload-ready FormData
 */
export const cameraResultToFormData = async (
  cameraResult: ImageResult,
  metadata?: {
    pigeonId?: string;
    isPrimary?: boolean;
    notes?: string;
  }
): Promise<FormData> => {
  const prepared = await prepareImageForUpload(cameraResult);
  return createImageUploadFormData(prepared, metadata);
};

/**
 * Resize image using Canvas API (web only)
 * Returns base64 string
 */
export const resizeImage = (
  base64: string,
  maxWidth: number = 1920,
  maxHeight: number = 1920,
  quality: number = 0.9
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      let { width, height } = img;
      
      // Calculate new dimensions
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.floor(width * ratio);
        height = Math.floor(height * ratio);
      }
      
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      ctx.drawImage(img, 0, 0, width, height);
      
      // Get resized base64
      const resizedBase64 = canvas.toDataURL('image/jpeg', quality);
      resolve(resizedBase64);
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = base64;
  });
};

/**
 * Get file size from base64 string in bytes
 */
export const getBase64Size = (base64: string): number => {
  const clean = base64.split(',')[1] || base64;
  return Math.ceil((clean.length * 3) / 4);
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default {
  base64ToBlob,
  prepareImageForUpload,
  blobToBase64,
  createImageUploadFormData,
  cameraResultToFormData,
  resizeImage,
  getBase64Size,
  formatFileSize,
};
