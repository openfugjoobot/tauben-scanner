"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../config/database");
const router = (0, express_1.Router)();
// Validate pigeon data
const validatePigeonData = (data) => {
    const errors = [];
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
        errors.push('Name is required and must be a non-empty string');
    }
    if (data.description && typeof data.description !== 'string') {
        errors.push('Description must be a string');
    }
    if (data.location) {
        if (typeof data.location !== 'object') {
            errors.push('Location must be an object');
        }
        else {
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
router.post('/', async (req, res) => {
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
        const { name, description, location, is_public = true } = req.body;
        // Insert pigeon into database
        const query = `
      INSERT INTO pigeons (name, description, location_lat, location_lng, location_name, is_public, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING id, name, description, location_lat, location_lng, location_name, is_public, first_seen, created_at
    `;
        const values = [
            name,
            description || null,
            location?.lat || null,
            location?.lng || null,
            location?.name || null,
            is_public
        ];
        const result = await database_1.pool.query(query, values);
        const pigeon = result.rows[0];
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
            photo_url: null, // Will be set when photo is uploaded
            embedding_generated: false, // Will be set when embedding is generated
            created_at: pigeon.created_at
        };
        res.status(201).json(response);
    }
    catch (error) {
        console.error('Error creating pigeon:', error);
        res.status(500).json({
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to create pigeon'
        });
    }
});
// GET /api/pigeons/:id - Get a specific pigeon by ID
router.get('/:id', async (req, res) => {
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
        const result = await database_1.pool.query(query, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'NOT_FOUND',
                message: 'Pigeon not found'
            });
        }
        const pigeon = result.rows[0];
        // Get sightings for this pigeon
        const sightingsQuery = `
      SELECT id, location_lat, location_lng, location_name, notes, timestamp
      FROM sightings
      WHERE pigeon_id = $1
      ORDER BY timestamp DESC
    `;
        const sightingsResult = await database_1.pool.query(sightingsQuery, [id]);
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
            photo_url: null, // Would need to query images table for this
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
    }
    catch (error) {
        console.error('Error fetching pigeon:', error);
        res.status(500).json({
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to fetch pigeon'
        });
    }
});
// GET /api/pigeons - Get list of pigeons with pagination
router.get('/', async (req, res) => {
    try {
        // Parse query parameters
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || 20, 100);
        const offset = (page - 1) * limit;
        // Build WHERE clause for search filtering
        let whereClause = '';
        const queryParams = [];
        let paramCount = 0;
        if (req.query.search) {
            paramCount++;
            queryParams.push(`%${req.query.search}%`);
            whereClause = `WHERE p.name ILIKE $${paramCount}`;
        }
        // Query database for pigeons
        const query = `
      SELECT p.id, p.name, p.first_seen, p.created_at,
             COUNT(s.id) as sightings_count
      FROM pigeons p
      LEFT JOIN sightings s ON p.id = s.pigeon_id
      ${whereClause}
      GROUP BY p.id
      ORDER BY p.created_at DESC
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;
        queryParams.push(limit, offset);
        const result = await database_1.pool.query(query, queryParams);
        // Get total count for pagination
        const countQuery = `
      SELECT COUNT(*) as total
      FROM pigeons p
      ${whereClause}
    `;
        const countResult = await database_1.pool.query(countQuery, req.query.search ? [`%${req.query.search}%`] : []);
        const total = parseInt(countResult.rows[0].total);
        // Format response
        const response = {
            pigeons: result.rows.map(pigeon => ({
                id: pigeon.id,
                name: pigeon.name,
                photo_url: null, // Would need to query images table for this
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
    }
    catch (error) {
        console.error('Error fetching pigeons:', error);
        res.status(500).json({
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to fetch pigeons'
        });
    }
});
exports.default = router;
