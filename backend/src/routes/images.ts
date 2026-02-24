import { Router, Request, Response } from 'express';
import { pool } from '../config/database';

const router = Router();

// Helper function to validate embedding array
const validateEmbedding = (embedding: any): boolean => {
  if (!Array.isArray(embedding)) return false;
  if (embedding.length !== 1024) return false;
  return embedding.every(val => typeof val === 'number');
};

// POST /api/images/match - Match pigeon by embedding
router.post('/match', async (req: Request, res: Response) => {
  try {
    const { photo, embedding, location, threshold = 0.80 } = req.body;
    
    // Validate embedding if provided
    if (embedding && !validateEmbedding(embedding)) {
      return res.status(400).json({
        error: 'INVALID_EMBEDDING',
        message: 'Embedding must be a 1024-dimensional array of numbers'
      });
    }
    
    // If no embedding provided, check if photo is provided
    if (!embedding && !photo) {
      return res.status(400).json({
        error: 'MISSING_INPUT',
        message: 'Either embedding or photo is required'
      });
    }
    
    // If we only have a photo, we would normally extract the embedding here
    // For now, we'll assume the embedding is provided or will be extracted by the client
    const queryEmbedding = embedding || []; // Placeholder
    
    // Validate threshold
    if (typeof threshold !== 'number' || threshold < 0.5 || threshold > 0.99) {
      return res.status(400).json({
        error: 'INVALID_THRESHOLD',
        message: 'Threshold must be a number between 0.5 and 0.99'
      });
    }
    
    // If we don't have an embedding, return an error
    if (!queryEmbedding.length) {
      return res.status(400).json({
        error: 'EMBEDDING_REQUIRED',
        message: 'Embedding extraction not implemented in backend yet. Please provide embedding from client.'
      });
    }
    
    // Format embedding for PostgreSQL
    const vectorLiteral = `[${queryEmbedding.join(',')}]`;
    
    // Query for similar pigeons using pgvector
    const query = `
      SELECT 
        id,
        name,
        description,
        (1 - (embedding <=> $1::vector))::float as similarity
      FROM pigeons
      WHERE embedding IS NOT NULL
        AND (1 - (embedding <=> $1::vector)) >= $2
      ORDER BY embedding <=> $1::vector
      LIMIT 10
    `;
    
    const result = await pool.query(query, [vectorLiteral, threshold]);
    
    // Check if we found a match
    if (result.rows.length > 0) {
      const topMatch = result.rows[0];
      
      // Get similar pigeons (excluding top match)
      const similarPigeons = result.rows.slice(1).map(row => ({
        id: row.id,
        name: row.name,
        similarity: parseFloat(row.similarity.toFixed(4))
      }));
      
      // Return match result
      return res.status(200).json({
        match: true,
        pigeon: {
          id: topMatch.id,
          name: topMatch.name,
          description: topMatch.description,
          photo_url: null, // Would need to query images table for this
          first_seen: null, // Would need to query pigeons table for this
          sightings_count: 0 // Would need to query sightings table for this
        },
        confidence: parseFloat(topMatch.similarity.toFixed(4)),
        similar_pigeons: similarPigeons
      });
    }
    
    // No match found - get most similar pigeons
    const similarQuery = `
      SELECT 
        id,
        name,
        (1 - (embedding <=> $1::vector))::float as similarity
      FROM pigeons
      WHERE embedding IS NOT NULL
      ORDER BY embedding <=> $1::vector
      LIMIT 5
    `;
    
    const similarResult = await pool.query(similarQuery, [vectorLiteral]);
    
    const similarPigeons = similarResult.rows.map(row => ({
      id: row.id,
      name: row.name,
      similarity: parseFloat(row.similarity.toFixed(4))
    }));
    
    // Return no match result
    res.status(200).json({
      match: false,
      confidence: 0,
      similar_pigeons: similarPigeons,
      suggestion: 'Register as new pigeon?'
    });
  } catch (error) {
    console.error('Error matching pigeon:', error);
    res.status(500).json({
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to match pigeon'
    });
  }
});

export default router;