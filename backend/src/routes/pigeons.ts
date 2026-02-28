import { Router, Request, Response } from 'express';
import { pool } from '../config/database';
import { extractEmbeddingFromBase64 } from '../services/embedding';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const router = Router();

// Ensure uploads directory exists
const UPLOADS_DIR = process.env.UPLOADS_DIR || join(process.cwd(), 'uploads');
if (!existsSync(UPLOADS_DIR)) {
  mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Helper: Save base64 image to file
function saveBase64Image(base64Data: string, filename: string): { path: string; size: number } {
  const base64WithoutPrefix = base64Data.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64WithoutPrefix, 'base64');
  const filePath = join(UPLOADS_DIR, filename);
  writeFileSync(filePath, buffer);
  return { path: filename, size: buffer.length };
}

// Validate pigeon data
const validatePigeonData = (data: any) => {
  const errors: string[] = [];
  
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push('Name is required and must be a non-empty string');
  }
  
  if (data.description && typeof data.description !== 'string') {
    errors.push('Description must be a string');
  }
  
  if (data.location) {
    if (typeof data.location !== 'object') {
      errors.push('Location must be an object');
    } else {
      if (data.location.lat !== undefined && (typeof data.location.lat !== 'number' || 
          data.location.lat < -90 || data.location.lat > 90)) {
        errors.push('Latitude must be a number between -90 and 90');
      }
      
      if (data.location.lng !== undefined && (typeof data.location.lng !== 'number' || 
          data.location.lng < -180 || data.location.lng > 180)) {
        errors.push('Longitude must be a number between -180 and 180');
      }
      
      if (data.location.name && typeof data.location.name !== 'string') {
        errors.push('Location name must be a string');
      }
    }
  }
  
  if (data.is_public !== undefined && typeof data.is_public !== 'boolean') {
    errors.push('is_public must be a boolean');
  }
  
  return errors;
};

// POST /api/pigeons - Create a new pigeon
router.post('/', async (req: Request, res: Response) => {
  try {
    // Validate input data
    const validationErrors = validatePigeonData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Invalid input data',
        details: validationErrors
      });
    }
    
    const { name, description, location, is_public = true, photo } = req.body;
    
    let embedding = null;
    let imageData: { path: string; size: number } | null = null;
    
    // Extract embedding AND save image if photo is provided
    if (photo && typeof photo === 'string' && photo.startsWith('data:image')) {
      try {
        console.log('[Pigeons] Processing photo...');
        embedding = await extractEmbeddingFromBase64(photo);
        console.log(`[Pigeons] Extracted ${embedding.length} dimensions`);
        
        // Save image to file
        const filename = `${Date.now()}_${name.replace(/\s+/g, '_').toLowerCase()}.jpg`;
        imageData = saveBase64Image(photo, filename);
        console.log(`[Pigeons] Saved image: ${filename} (${imageData.size} bytes)`);
      } catch (err) {
        console.error('[Pigeons] Failed to process photo:', err);
        // Continue without photo
      }
    }
    
    // Insert pigeon into database
    const pigeonQuery = `
      INSERT INTO pigeons (name, description, location_lat, location_lng, location_name, is_public, embedding, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7::vector, NOW())
      RETURNING id, name, description, location_lat, location_lng, location_name, is_public, first_seen, created_at
    `;
    
    const pigeonValues = [
      name,
      description || null,
      location?.lat || null,
      location?.lng || null,
      location?.name || null,
      is_public,
      embedding ? `[${embedding.join(',')}]` : null
    ];
    
    const pigeonResult = await pool.query(pigeonQuery, pigeonValues);
    const pigeon = pigeonResult.rows[0];
    
    // Save image to images table if photo was saved
    if (imageData && embedding) {
      const imageQuery = `
        INSERT INTO images (pigeon_id, file_path, file_size, mime_type, embedding, is_primary, created_at)
        VALUES ($1, $2, $3, $4, $5::vector, true, NOW())
        RETURNING id, file_path
      `;
      await pool.query(imageQuery, [
        pigeon.id,
        imageData.path,
        imageData.size,
        'image/jpeg',
        `[${embedding.join(',')}]`
      ]);
    }
    
    // Format response
    const response = {
      id: pigeon.id,
      name: pigeon.name,
      description: pigeon.description,
      location: {
        lat: pigeon.location_lat,
        lng: pigeon.location_lng,
        name: pigeon.location_name
      },
      first_seen: pigeon.first_seen,
      photo_url: imageData ? `/uploads/${imageData.path}` : null,
      embedding_generated: !!embedding,
      created_at: pigeon.created_at
    };
    
    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating pigeon:', error);
    res.status(500).json({
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to create pigeon'
    });
  }
});

// GET /api/pigeons/:id - Get a specific pigeon by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Query database for pigeon
    const query = `
      SELECT p.id, p.name, p.description, p.location_lat, p.location_lng, p.location_name, 
             p.first_seen, p.is_public, p.created_at, p.updated_at,
             COUNT(s.id) as sightings_count
      FROM pigeons p
      LEFT JOIN sightings s ON p.id = s.pigeon_id
      WHERE p.id = $1
      GROUP BY p.id
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'NOT_FOUND',
        message: 'Pigeon not found'
      });
    }
    
    const pigeon = result.rows[0];
    
    // Get primary photo for this pigeon
    const photoQuery = `
      SELECT file_path 
      FROM images 
      WHERE pigeon_id = $1 AND is_primary = true 
      ORDER BY created_at DESC 
      LIMIT 1
    `;
    const photoResult = await pool.query(photoQuery, [id]);
    const photoUrl = photoResult.rows.length > 0 
      ? `/uploads/${photoResult.rows[0].file_path}` 
      : null;
    
    // Get sightings for this pigeon
    const sightingsQuery = `
      SELECT id, location_lat, location_lng, location_name, notes, timestamp
      FROM sightings
      WHERE pigeon_id = $1
      ORDER BY timestamp DESC
    `;
    
    const sightingsResult = await pool.query(sightingsQuery, [id]);
    
    // Format response
    const response = {
      id: pigeon.id,
      name: pigeon.name,
      description: pigeon.description,
      location: {
        lat: pigeon.location_lat,
        lng: pigeon.location_lng,
        name: pigeon.location_name
      },
      first_seen: pigeon.first_seen,
      photo_url: photoUrl,
      sightings: sightingsResult.rows.map(sighting => ({
        id: sighting.id,
        location: {
          lat: sighting.location_lat,
          lng: sighting.location_lng,
          name: sighting.location_name
        },
        notes: sighting.notes,
        timestamp: sighting.timestamp
      })),
      sightings_count: parseInt(pigeon.sightings_count),
      created_at: pigeon.created_at,
      updated_at: pigeon.updated_at
    };
    
    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching pigeon:', error);
    res.status(500).json({
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to fetch pigeon'
    });
  }
});

// GET /api/pigeons - Get list of pigeons with pagination
router.get('/', async (req: Request, res: Response) => {
  try {
    // Parse query parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const offset = (page - 1) * limit;
    
    // Build WHERE clause for search filtering
    let whereClause = '';
    const queryParams: any[] = [];
    let paramCount = 0;
    
    if (req.query.search) {
      paramCount++;
      queryParams.push(`%${req.query.search}%`);
      whereClause = `WHERE p.name ILIKE $${paramCount}`;
    }
    
    // Query database for pigeons with primary photo
    const query = `
      SELECT 
        p.id, 
        p.name, 
        p.first_seen, 
        p.created_at,
        COUNT(s.id) as sightings_count,
        i.file_path as photo_path
      FROM pigeons p
      LEFT JOIN sightings s ON p.id = s.pigeon_id
      LEFT JOIN images i ON p.id = i.pigeon_id AND i.is_primary = true
      ${whereClause}
      GROUP BY p.id, i.file_path
      ORDER BY p.created_at DESC
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;
    
    queryParams.push(limit, offset);
    const result = await pool.query(query, queryParams);
    
    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as total
      FROM pigeons p
      ${whereClause}
    `;
    
    const countResult = await pool.query(countQuery, req.query.search ? [`%${req.query.search}%`] : []);
    const total = parseInt(countResult.rows[0].total);
    
    // Format response
    const response = {
      pigeons: result.rows.map(pigeon => ({
        id: pigeon.id,
        name: pigeon.name,
        photo_url: pigeon.photo_path ? `/uploads/${pigeon.photo_path}` : null,
        first_seen: pigeon.first_seen,
        sightings_count: parseInt(pigeon.sightings_count)
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
    
    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching pigeons:', error);
    res.status(500).json({
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to fetch pigeons'
    });
  }
});

export default router;
