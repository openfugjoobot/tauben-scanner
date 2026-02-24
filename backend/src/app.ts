import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from 'dotenv';
import { pool } from './config/database';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import pigeonRoutes from './routes/pigeons';
import imageRoutes from './routes/images';
import sightingRoutes from './routes/sightings';

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());

// CORS configuration - restrict to known origins
const corsOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:5173', 'http://localhost:3000', 'capacitor://localhost', 'http://localhost'];

app.use(cors({
  origin: corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/pigeons', pigeonRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/sightings', sightingRoutes);

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Test database connection
    const client = await pool.connect();
    client.release();
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        storage: 'connected',
        embedding_model: 'loaded'
      }
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      error: 'DATABASE_CONNECTION_FAILED',
      message: 'Could not connect to database'
    });
  }
});

// Error handling middleware
app.use(errorHandler);
app.use(notFoundHandler);

export default app;