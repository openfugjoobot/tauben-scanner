import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from 'dotenv';
import { join } from 'path';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { apiRateLimiter, uploadRateLimiter } from './middleware/rateLimit';
import { validateApiKey, optionalAuth } from './middleware/auth';
import healthRoutes from './routes/health';
import pigeonRoutes from './routes/pigeons';
import imageRoutes from './routes/images';
import sightingRoutes from './routes/sightings';

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 3000;

const UPLOADS_DIR = process.env.UPLOADS_DIR || join(process.cwd(), 'uploads');

// Security middleware
app.use(helmet());

// CORS configuration
const corsOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',').map(o => o.trim())
  : [
    'https://tauben-scanner.fugjoo.duckdns.org',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost',
    'http://localhost:8080',
    'http://localhost:4200'
  ];

app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      ...corsOrigins,
      'https://localhost',
      'http://localhost'
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin || '*');
    } else {
      console.log('CORS blocked:', origin);
      callback(new Error('Not allowed'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 204,
  preflightContinue: false
}));

// Logging
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));

// Static file serving for uploads
app.use('/uploads', express.static(UPLOADS_DIR));

// Health check routes (before rate limiting and auth)
app.use('/health', healthRoutes);

// Rate limiting for API routes
app.use('/api', apiRateLimiter);
app.use('/api/images', uploadRateLimiter);

// API authentication (skip if no API_KEY configured, for backward compatibility)
if (process.env.API_KEY) {
  app.use('/api', validateApiKey);
}

// API Routes
app.use('/api/pigeons', pigeonRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/sightings', sightingRoutes);

// Error handling middleware
app.use(errorHandler);
app.use(notFoundHandler);

export default app;
