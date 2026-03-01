// auth.ts - API Key Authentication Middleware
import { Request, Response, NextFunction } from 'express';

// Extend Express Request to include apiKey
export interface AuthenticatedRequest extends Request {
  apiKey?: {
    id: string;
    name: string;
    permissions: string[];
  };
}

// In-memory API key storage (in production, use database)
const API_KEYS = new Map<string, {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  createdAt: Date;
  lastUsedAt?: Date;
}>();

// Initialize with API key from environment
function initializeApiKeys(): void {
  const envKey = process.env.API_KEY;
  if (envKey && envKey.length >= 32) {
    API_KEYS.set(envKey, {
      id: 'default',
      name: 'Default API Key',
      key: envKey,
      permissions: ['read', 'write', 'delete', 'admin'],
      createdAt: new Date(),
    });
    console.log('API Key authentication initialized');
  } else {
    console.warn('No valid API_KEY configured. Set a secure API_KEY with at least 32 characters.');
  }
}

// Initialize on module load
initializeApiKeys();

export function validateApiKey(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  if (req.path === '/health' || req.path === '/health/') {
    const requireAuthForHealth = process.env.REQUIRE_AUTH_FOR_HEALTH === 'true';
    if (!requireAuthForHealth) {
      return next();
    }
  }

  const apiKeyHeader = req.headers['x-api-key'] as string;
  const authHeader = req.headers['authorization'] as string;
  
  let providedKey: string | undefined;
  
  if (apiKeyHeader) {
    providedKey = apiKeyHeader.trim();
  } else if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
    providedKey = authHeader.slice(7).trim();
  }
  
  if (!providedKey) {
    res.status(401).json({
      error: 'UNAUTHORIZED',
      message: 'API key is required. Provide it via X-API-Key header or Authorization: Bearer <key>',
    });
    return;
  }
  
  const keyData = API_KEYS.get(providedKey);
  if (!keyData) {
    res.status(401).json({
      error: 'UNAUTHORIZED',
      message: 'Invalid API key',
    });
    return;
  }
  
  if (providedKey.length < 32) {
    res.status(401).json({
      error: 'UNAUTHORIZED',
      message: 'API key must be at least 32 characters',
    });
    return;
  }
  
  keyData.lastUsedAt = new Date();
  
  req.apiKey = {
    id: keyData.id,
    name: keyData.name,
    permissions: keyData.permissions,
  };
  
  next();
}

export function requirePermission(permission: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.apiKey) {
      res.status(401).json({
        error: 'UNAUTHORIZED',
        message: 'Authentication required',
      });
      return;
    }
    
    if (!req.apiKey.permissions.includes(permission) && !req.apiKey.permissions.includes('admin')) {
      res.status(403).json({
        error: 'FORBIDDEN',
        message: `Permission '${permission}' required`,
      });
      return;
    }
    
    next();
  };
}

export function optionalAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const apiKeyHeader = req.headers['x-api-key'] as string;
  const authHeader = req.headers['authorization'] as string;
  
  let providedKey: string | undefined;
  
  if (apiKeyHeader) {
    providedKey = apiKeyHeader.trim();
  } else if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
    providedKey = authHeader.slice(7).trim();
  }
  
  if (providedKey) {
    const keyData = API_KEYS.get(providedKey);
    if (keyData) {
      keyData.lastUsedAt = new Date();
      req.apiKey = {
        id: keyData.id,
        name: keyData.name,
        permissions: keyData.permissions,
      };
    }
  }
  
  next();
}

export { API_KEYS };
