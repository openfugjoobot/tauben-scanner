"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.errorHandler = void 0;
// Error handling middleware
const errorHandler = (err, req, res, next) => {
    // Default error values
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let field = err.field || null;
    // Log the error for debugging (in production, use a logging library)
    console.error(`Error ${statusCode}: ${message}`, err.stack);
    // Handle common error types
    switch (err.name) {
        case 'ValidationError':
            statusCode = 400;
            message = 'Validation Error';
            break;
        case 'CastError':
            statusCode = 400;
            message = 'Invalid Data Format';
            break;
        case 'JsonWebTokenError':
            statusCode = 401;
            message = 'Invalid Token';
            break;
        case 'TokenExpiredError':
            statusCode = 401;
            message = 'Token Expired';
            break;
        default:
            // Keep the original status code and message for unhandled errors
            break;
    }
    // Prepare the response object
    const errorResponse = {
        error: err.name || 'INTERNAL_ERROR',
        message: message,
    };
    // Include field information if available
    if (field) {
        errorResponse.field = field;
    }
    // In development, include stack trace
    if (process.env.NODE_ENV === 'development') {
        errorResponse.stack = err.stack;
    }
    // Send the error response
    res.status(statusCode).json(errorResponse);
};
exports.errorHandler = errorHandler;
// 404 handler middleware
const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        error: 'NOT_FOUND',
        message: `Route ${req.originalUrl} not found`,
    });
};
exports.notFoundHandler = notFoundHandler;
