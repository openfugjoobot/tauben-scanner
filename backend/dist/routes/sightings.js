"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../config/database");
const router = (0, express_1.Router)();
// Validate sighting data
const validateSightingData = (data) => {
    const errors = [];
    if (!data.pigeon_id || typeof data.pigeon_id !== 'string') {
        errors.push('pigeon_id is required and must be a string');
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
    if (data.notes && typeof data.notes !== 'string') {
        errors.push('Notes must be a string');
    }
    if (data.condition && typeof data.condition !== 'string') {
        errors.push('Condition must be a string');
    }
    return errors;
};
// POST /api/sightings - Create a new sighting
router.post('/', async (req, res) => {
    try {
        // Validate input data
        const validationErrors = validateSightingData(req.body);
        if (validationErrors.length > 0) {
            return res.status(400).json({
                error: 'VALIDATION_ERROR',
                message: 'Invalid input data',
                details: validationErrors
            });
        }
        const { pigeon_id, location, notes, condition } = req.body;
        // Check if pigeon exists
        const pigeonCheck = await database_1.pool.query('SELECT id FROM pigeons WHERE id = $1', [pigeon_id]);
        if (pigeonCheck.rowCount === 0) {
            return res.status(404).json({
                error: 'NOT_FOUND',
                message: 'Pigeon not found'
            });
        }
        // Insert sighting into database
        const query = `
      INSERT INTO sightings (pigeon_id, location_lat, location_lng, location_name, notes, condition, timestamp, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING id, pigeon_id, location_lat, location_lng, location_name, notes, condition, timestamp
    `;
        const values = [
            pigeon_id,
            location?.lat || null,
            location?.lng || null,
            location?.name || null,
            notes || null,
            condition || null
        ];
        const result = await database_1.pool.query(query, values);
        const sighting = result.rows[0];
        // Format response
        const response = {
            id: sighting.id,
            pigeon_id: sighting.pigeon_id,
            location: {
                lat: sighting.location_lat,
                lng: sighting.location_lng,
                name: sighting.location_name
            },
            notes: sighting.notes,
            condition: sighting.condition,
            timestamp: sighting.timestamp
        };
        res.status(201).json(response);
    }
    catch (error) {
        console.error('Error creating sighting:', error);
        res.status(500).json({
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to create sighting'
        });
    }
});
// GET /api/sightings - Get list of sightings with pagination
router.get('/', async (req, res) => {
    try {
        // Parse query parameters
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || 20, 100);
        const offset = (page - 1) * limit;
        // Query database for sightings
        const query = `
      SELECT s.id, s.pigeon_id, s.location_lat, s.location_lng, s.location_name, 
             s.notes, s.condition, s.timestamp,
             p.name as pigeon_name
      FROM sightings s
      LEFT JOIN pigeons p ON s.pigeon_id = p.id
      ORDER BY s.timestamp DESC
      LIMIT $1 OFFSET $2
    `;
        const result = await database_1.pool.query(query, [limit, offset]);
        // Get total count for pagination
        const countQuery = 'SELECT COUNT(*) as total FROM sightings';
        const countResult = await database_1.pool.query(countQuery);
        const total = parseInt(countResult.rows[0].total);
        // Format response
        const response = {
            sightings: result.rows.map(sighting => ({
                id: sighting.id,
                pigeon: {
                    id: sighting.pigeon_id,
                    name: sighting.pigeon_name
                },
                location: {
                    lat: sighting.location_lat,
                    lng: sighting.location_lng,
                    name: sighting.location_name
                },
                notes: sighting.notes,
                condition: sighting.condition,
                timestamp: sighting.timestamp
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
        console.error('Error fetching sightings:', error);
        res.status(500).json({
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to fetch sightings'
        });
    }
});
exports.default = router;
