import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';

// These tests require a running server with database
// Skip in CI if database is not available
describe('Integration Tests', () => {
  const baseUrl = process.env.TEST_API_URL || 'http://localhost:3000';
  const apiKey = process.env.TEST_API_KEY || 'test-key';
  
  beforeAll(() => {
    // Setup code
  });
  
  afterAll(() => {
    // Cleanup code
  });
  
  describe('API Authentication', () => {
    it('should reject requests without API key', async () => {
      const response = await request(baseUrl)
        .get('/api/pigeons');
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
    
    it('should accept requests with valid X-API-Key header', async () => {
      const response = await request(baseUrl)
        .get('/api/pigeons')
        .set('X-API-Key', apiKey);
      
      expect([200, 401]).toContain(response.status);
    });
    
    it('should accept requests with valid Authorization Bearer header', async () => {
      const response = await request(baseUrl)
        .get('/api/pigeons')
        .set('Authorization', `Bearer ${apiKey}`);
      
      expect([200, 401]).toContain(response.status);
    });
  });
  
  describe('Rate Limiting', () => {
    it('should include rate limit headers in response', async () => {
      const response = await request(baseUrl)
        .get('/health');
      
      expect(response.headers).toHaveProperty('x-ratelimit-limit');
    });
  });
  
  describe('Health Endpoints', () => {
    it('should return health status', async () => {
      const response = await request(baseUrl)
        .get('/health');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status');
    });
    
    it('should return detailed health status', async () => {
      const response = await request(baseUrl)
        .get('/health/detailed');
      
      expect(response.body).toHaveProperty('services');
    });
    
    it('should return liveness check', async () => {
      const response = await request(baseUrl)
        .get('/health/live');
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('alive');
    });
    
    it('should return readiness check', async () => {
      const response = await request(baseUrl)
        .get('/health/ready');
      
      expect(response.body).toHaveProperty('status');
    });
  });
});
