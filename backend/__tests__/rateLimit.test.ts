import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { createRateLimiter, apiRateLimiter, rateLimitStore, cleanupExpiredEntries } from '../src/middleware/rateLimit';
import { Request, Response } from 'express';

describe('Rate Limit Middleware', () => {
  beforeEach(() => {
    rateLimitStore.clear();
  });
  
  afterEach(() => {
    rateLimitStore.clear();
  });
  
  describe('createRateLimiter', () => {
    it('should allow requests under the limit', () => {
      const limiter = createRateLimiter({
        windowMs: 60000,
        maxRequests: 5,
      });
      
      const req = {
        headers: {},
        ip: '127.0.0.1',
        path: '/api/test',
        socket: { remoteAddress: '127.0.0.1' },
      } as Partial<Request>;
      
      let nextCalled = false;
      
      limiter(req as Request, {} as Response, () => { nextCalled = true; });
      
      expect(nextCalled).toBe(true);
    });
    
    it('should block requests over the limit', () => {
      const limiter = createRateLimiter({
        windowMs: 60000,
        maxRequests: 2,
      });
      
      const req = {
        headers: {},
        ip: '127.0.0.1',
        path: '/api/test',
        socket: { remoteAddress: '127.0.0.1' },
      } as Partial<Request>;
      
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        setHeader: jest.fn(),
      } as unknown as Response;
      
      // First 2 requests should pass
      limiter(req as Request, res, () => {});
      limiter(req as Request, res, () => {});
      
      // Third request should be blocked
      limiter(req as Request, res, () => {});
      
      expect(res.status).toHaveBeenCalledWith(429);
    });
  });
  
  describe('cleanupExpiredEntries', () => {
    it('should remove expired entries', () => {
      rateLimitStore.set('test-key', {
        count: 1,
        resetTime: Date.now() - 1000, // Expired 1 second ago
      });
      
      cleanupExpiredEntries();
      
      expect(rateLimitStore.has('test-key')).toBe(false);
    });
  });
});
