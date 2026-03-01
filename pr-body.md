## Backend Production Fixes

This PR implements essential security and operational improvements for production deployment.

### Changes Implemented

#### 1. API Key Authentication (`middleware/auth.ts`)
- Secure API key-based authentication
- Support for `X-API-Key` and `Authorization: Bearer` headers
- In-memory key storage (upgradeable to database)
- Permission-based access control with `requirePermission` middleware
- Optional authentication support
- Health endpoints can optionally skip auth

#### 2. Rate Limiting (`middleware/rateLimit.ts`)
- Configurable rate limiting with window-based tracking
- Per-route limiters: `apiRateLimiter`, `strictRateLimiter`, `uploadRateLimiter`, `authRateLimiter`, `healthRateLimiter`
- Rate limit headers in responses: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- Automatic cleanup of expired entries
- Returns 429 status with retry information

#### 3. Comprehensive Health Checks (`routes/health.ts`)
- `/health` - Basic liveness check (for load balancers)
- `/health/live` - Kubernetes liveness probe
- `/health/ready` - Kubernetes readiness probe
- `/health/detailed` - Full system status with database, memory, and service status

#### 4. API Key Generation Script (`scripts/generate-api-key.js`)
```bash
node scripts/generate-api-key.js
```

#### 5. Test Suite (`__tests__/`)
- `auth.test.ts` - Authentication middleware tests
- `rateLimit.test.ts` - Rate limiting tests
- `health.test.ts` - Health endpoint tests
- `integration.test.ts` - Integration tests

#### 6. Environment Configuration
Updated `.env.example` with new required variables:
```bash
API_KEY=your_secure_api_key_here_min_32_characters
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
REQUIRE_AUTH_FOR_HEALTH=false
```

### Testing
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Generate new API key
npm run generate-api-key
```

### Migration Guide

1. Generate a new API key:
   ```bash
   cd backend && npm run generate-api-key
   ```

2. Add API_KEY to your `.env` file (minimum 32 characters)

3. Update your API clients to include the header:
   ```
   X-API-Key: your-api-key-here
   # or
   Authorization: Bearer your-api-key-here
   ```

4. Health endpoints remain public by default (disable with `REQUIRE_AUTH_FOR_HEALTH=true`)

### Security Considerations
- API keys must be at least 32 characters
- Rate limiting prevents DDoS and brute force attacks
- Health endpoints can be protected if needed
- In-memory key storage is suitable for single-instance deployments; use Redis/database for multi-instance

Closes #76
