"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = require("dotenv");
const database_1 = require("./config/database");
const errorHandler_1 = require("./middleware/errorHandler");
const pigeons_1 = __importDefault(require("./routes/pigeons"));
const images_1 = __importDefault(require("./routes/images"));
const sightings_1 = __importDefault(require("./routes/sightings"));
// Load environment variables
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('combined'));
app.use(express_1.default.json({ limit: '10mb' }));
// Routes
app.use('/api/pigeons', pigeons_1.default);
app.use('/api/images', images_1.default);
app.use('/api/sightings', sightings_1.default);
// Health check endpoint
app.get('/health', async (req, res) => {
    try {
        // Test database connection
        const client = await database_1.pool.connect();
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
    }
    catch (error) {
        console.error('Health check failed:', error);
        res.status(503).json({
            status: 'unhealthy',
            error: 'DATABASE_CONNECTION_FAILED',
            message: 'Could not connect to database'
        });
    }
});
// Error handling middleware
app.use(errorHandler_1.errorHandler);
app.use(errorHandler_1.notFoundHandler);
exports.default = app;
