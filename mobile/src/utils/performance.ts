/**
 * Performance utilities for camera optimization
 * Target: <200ms capture lag, 60 FPS on capable devices
 */

export class PerformanceMonitor {
  private frameCount = 0;
  private lastTime = performance.now();
  private fps = 60;

  /**
   * Track FPS during camera preview
   */
  trackFrame(): void {
    this.frameCount++;
    const now = performance.now();
    const elapsed = now - this.lastTime;

    if (elapsed >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / elapsed);
      this.frameCount = 0;
      this.lastTime = now;
    }
  }

  /**
   * Get current FPS
   */
  getFPS(): number {
    return this.fps;
  }

  /**
   * Check if target FPS is being met
   */
  isTargetFPS(): boolean {
    return this.fps >= 55; // Allow some variance from 60
  }

  /**
   * Reset tracking
   */
  reset(): void {
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.fps = 60;
  }
}

/**
 * Measure operation time
 */
export function measureTime<T>(operation: () => T): { result: T; duration: number } {
  const start = performance.now();
  const result = operation();
  const duration = performance.now() - start;
  return { result, duration };
}

/**
 * Measure async operation time
 */
export async function measureTimeAsync<T>(operation: () => Promise<T>): Promise<{ result: T; duration: number }> {
  const start = performance.now();
  const result = await operation();
  const duration = performance.now() - start;
  return { result, duration };
}

/**
 * Camera capture optimization settings
 */
export const CaptureOptimizations = {
  // Skip processing for faster capture
  skipProcessing: true,
  // Disable shutter sound to reduce latency
  shutterSound: false,
  // Target width for optimization (1920 = Full HD)
  targetWidth: 1920,
  // Target height for 16:9 aspect ratio
  targetHeight: 1080,
  // Maximum capture time target (200ms)
  maxCaptureTime: 200,
  // Image quality (0.9 = 90% for balance of quality/size)
  quality: 0.9,
} as const;

/**
 * Check if device supports 60 FPS camera
 */
export function supportsHighFrameRate(): boolean {
  if (typeof navigator === 'undefined') return false;
  
  // Check for device capability
  const memory = (navigator as { deviceMemory?: number }).deviceMemory;
  const cores = navigator.hardwareConcurrency;
  
  // High-end devices typically have 4GB+ RAM and 6+ cores
  return (memory ? memory >= 4 : false) && (cores ? cores >= 6 : false);
}

/**
 * Get optimal camera settings based on device capability
 */
export function getOptimalCameraSettings(): {
  skipProcessing: boolean;
  shutterSound: boolean;
  quality: number;
} {
  const isHighEnd = supportsHighFrameRate();
  
  return {
    skipProcessing: true,
    shutterSound: false,
    quality: isHighEnd ? 0.95 : 0.85, // Higher quality on capable devices
  };
}

/**
 * Log performance metrics
 */
export function logPerformance(operation: string, duration: number): void {
  const status = duration < 200 ? '✅' : duration < 500 ? '⚠️' : '❌';
  console.log(`${status} ${operation}: ${duration.toFixed(2)}ms`);
}
