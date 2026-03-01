import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import healthRouter from '../src/routes/health';

const app = express();
app.use(express.json());
app.use('/health', healthRouter);

describe('Health Routes', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect('Content-Type', /json/);
      
      // Response status depends on database connection
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('timestamp');
    });
  });
  
  describe('GET /health/live', () => {
    it('should return alive status', async () => {
      const response = await request(app)
        .get('/health/live')
        .expect(200)
        .expect('Content-Type', /json/);
      
      expect(response.body.status).toBe('alive');
      expect(response.body.timestamp).toBeDefined();
    });
  });
  
  describe('GET /health/detailed', () => {
    it('should return detailed health status', async () => {
      const response = await request(app)
        .get('/health/detailed')
        .expect('Content-Type', /json/);
      
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('services');
      expect(response.body).toHaveProperty('checks');
    });
  });
});
