// rateLimit.ts - Rate Limiting Middleware
import { Request, Response, NextFunction } from 'express';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (req: Request) => string;
  handler?: (req: Request, res: Response) => void;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

const DEFAULT_CONFIG: RateLimitConfig = {
  windowMs: 15 * 60 * 1000,
  maxRequests: 100,
  keyGenerator: (req: Request): string => {
    const apiKey = req.headers['x-api-key'] as string || 
                   (req.headers['authorization'] || '').slice(7).trim();
    if (apiKey) {
      return `api:${apiKey}`;
    }
    return `ip:${req.ip || req.socket.remoteAddress || 'unknown'}:${req.path}`;
  },
};

function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime <= now) {
      rateLimitStore.delete(key);
    }
  }
}

setInterval(cleanupExpiredEntries, 5 * 60 * 1000);

export function createRateLimiter(config: Partial<RateLimitConfig> = {}) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  return (req: Request, res: Response, next: NextFunction): void => {
    const now = Date.now();
    const key = finalConfig.keyGenerator!(req);
    
    let entry = rateLimitStore.get(key);
    
    if (!entry || entry.resetTime <= now) {
      entry = {
        count: 0,
        resetTime: now + finalConfig.windowMs,
      };
    }
    
    if (entry.count >= finalConfig.maxRequests) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
      
      if (finalConfig.handler) {
        return finalConfig.handler(req, res);
      }
      
      res.setHeader('Retry-After', retryAfter);
      res.setHeader('X-RateLimit-Limit', finalConfig.maxRequests.toString());
      res.setHeader('X-RateLimit-Remaining', '0');
      res.setHeader('X-RateLimit-Reset', new Date(entry.resetTime).toISOString());
      
      res.status(429).json({
        error: 'RATE_LIMIT_EXCEEDED',
        message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
        retryAfter,
      });
      return;
    }
    
    entry.count++;
    rateLimitStore.set(key, entry);
    
    res.setHeader('X-RateLimit-Limit', finalConfig.maxRequests.toString());
    res.setHeader('X-RateLimit-Remaining', (finalConfig.maxRequests - entry.count).toString());
    res.setHeader('X-RateLimit-Window', `${finalConfig.windowMs / 1000}s`);
    
    next();
  };
}

export const apiRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 100,
});

export const strictRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 20,
});

export const uploadRateLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000,
  maxRequests: 10,
});

export const authRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 5,
  keyGenerator: (req: Request): string => {
    return `auth:${req.ip || req.socket.remoteAddress || 'unknown'}`;
  },
});

export const healthRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 30,
  keyGenerator: (req: Request): string => {
    return `health:${req.ip || req.socket.remoteAddress || 'unknown'}`;
  },
});

export { cleanupExpiredEntries, rateLimitStore };
