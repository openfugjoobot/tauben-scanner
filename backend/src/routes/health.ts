import { Router, Request, Response } from 'express';
import { pool } from '../config/database';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const startTime = Date.now();
    const client = await Promise.race([
      pool.connect(),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Database connection timeout')), 3000)
      ),
    ]);
    const responseTime = Date.now() - startTime;
    client.release();
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'DATABASE_CONNECTION_FAILED',
    });
  }
});

router.get('/detailed', async (req: Request, res: Response) => {
  const startTime = Date.now();
  const health: any = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    uptime: process.uptime(),
    services: {
      database: 'unknown',
      storage: 'connected',
      memory: {
        status: 'healthy',
        used: 0,
        total: 0,
        percentage: 0,
      },
    },
    checks: {},
  };

  let hasErrors = false;
  let hasWarnings = false;

  try {
    const dbStartTime = Date.now();
    const client = await Promise.race([
      pool.connect(),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 5000)
      ),
    ]);
    const dbResponseTime = Date.now() - dbStartTime;
    client.release();
    
    health.services.database = 'connected';
    health.checks.database = {
      status: 'ok',
      responseTime: dbResponseTime,
    };
  } catch (error) {
    hasErrors = true;
    health.services.database = 'disconnected';
    health.checks.database = {
      status: 'error',
      responseTime: Date.now() - startTime,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }

  const memUsage = process.memoryUsage();
  const totalMemory = require('os').totalmem();
  const usedMemory = memUsage.heapUsed;
  const memoryPercentage = (usedMemory / totalMemory) * 100;
  
  health.services.memory = {
    status: memoryPercentage > 80 ? 'critical' : memoryPercentage > 60 ? 'warning' : 'healthy',
    used: Math.round(usedMemory / 1024 / 1024),
    total: Math.round(totalMemory / 1024 / 1024),
    percentage: Math.round(memoryPercentage * 100) / 100,
  };
  
  if (memoryPercentage > 80) {
    hasErrors = true;
    health.checks.memory = {
      status: 'critical',
      message: `Memory usage critical: ${memoryPercentage.toFixed(2)}%`,
    };
  } else if (memoryPercentage > 60) {
    hasWarnings = true;
    health.checks.memory = {
      status: 'warning',
      message: `Memory usage high: ${memoryPercentage.toFixed(2)}%`,
    };
  } else {
    health.checks.memory = {
      status: 'ok',
      message: `Memory usage normal: ${memoryPercentage.toFixed(2)}%`,
    };
  }

  if (hasErrors) {
    health.status = 'unhealthy';
  } else if (hasWarnings) {
    health.status = 'degraded';
  }

  const statusCode = health.status === 'healthy' ? 200 : 
                     health.status === 'degraded' ? 200 : 503;
  
  res.status(statusCode).json(health);
});

router.get('/live', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString(),
  });
});

router.get('/ready', async (req: Request, res: Response) => {
  try {
    const client = await Promise.race([
      pool.connect(),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 2000)
      ),
    ]);
    client.release();
    
    res.status(200).json({
      status: 'ready',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'not_ready',
      timestamp: new Date().toISOString(),
      error: 'Database not available',
    });
  }
});

export default router;
