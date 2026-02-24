"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
// Create PostgreSQL connection pool
exports.pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://tauben:password@localhost:5432/tauben_scanner',
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
});
// Test the connection
exports.pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection error:', err.stack);
    }
    else {
        console.log('Database connected successfully');
    }
});
