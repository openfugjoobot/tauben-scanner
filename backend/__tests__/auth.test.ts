import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { validateApiKey, optionalAuth, requirePermission, AuthenticatedRequest, API_KEYS } from '../src/middleware/auth';
import { Request, Response, NextFunction } from 'express';

describe('Auth Middleware', () => {
  let req: Partial<AuthenticatedRequest>;
  let res: Partial<Response>;
  let next: NextFunction;
  
  beforeEach(() => {
    req = {
      headers: {},
      path: '/api/pigeons',
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    
    // Set up test API key
    process.env.API_KEY = 'test_api_key_12345678901234567890123456789012345678901234';
    API_KEYS.clear();
    API_KEYS.set(process.env.API_KEY, {
      id: 'test',
      name: 'Test Key',
      key: process.env.API_KEY,
      permissions: ['read', 'write'],
      createdAt: new Date(),
    });
  });
  
  afterEach(() => {
    delete process.env.API_KEY;
    API_KEYS.clear();
  });

  describe('validateApiKey', () => {
    it('should skip auth for health endpoints', () => {
      req.path = '/health';
      validateApiKey(req as AuthenticatedRequest, res as Response, next);
      
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
    
    it('should return 401 if no API key provided', () => {
      validateApiKey(req as AuthenticatedRequest, res as Response, next);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'UNAUTHORIZED',
        })
      );
    });
    
    it('should authenticate with X-API-Key header', () => {
      req.headers = { 'x-api-key': process.env.API_KEY };
      validateApiKey(req as AuthenticatedRequest, res as Response, next);
      
      expect(next).toHaveBeenCalled();
      expect(req.apiKey).toBeDefined();
      expect(req.apiKey?.id).toBe('test');
    });
    
    it('should authenticate with Authorization: Bearer header', () => {
      req.headers = { 'authorization': `Bearer ${process.env.API_KEY}` };
      validateApiKey(req as AuthenticatedRequest, res as Response, next);
      
      expect(next).toHaveBeenCalled();
      expect(req.apiKey).toBeDefined();
    });
  });
  
  describe('requirePermission', () => {
    it('should allow access with correct permission', () => {
      req.apiKey = {
        id: 'test',
        name: 'Test Key',
        permissions: ['read'],
      };
      
      const middleware = requirePermission('read');
      middleware(req as AuthenticatedRequest, res as Response, next);
      
      expect(next).toHaveBeenCalled();
    });
    
    it('should deny access without permission', () => {
      req.apiKey = {
        id: 'test',
        name: 'Test Key',
        permissions: ['read'],
      };
      
      const middleware = requirePermission('delete');
      middleware(req as AuthenticatedRequest, res as Response, next);
      
      expect(res.status).toHaveBeenCalledWith(403);
    });
  });
});
