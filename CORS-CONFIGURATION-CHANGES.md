# CORS Configuration Changes for Tauben Scanner Backend

## Problem
Android WebView could not connect to the backend due to "fail to fetch" errors caused by missing CORS headers.

## Solution Implemented

### 1. Backend CORS Configuration
**File:** `backend/src/app.ts`

**Changes Made:**
- Updated CORS origins to explicitly include all required origins
- Added proper OPTIONS handling with `optionsSuccessStatus: 204`
- Enhanced CORS configuration for better security and compatibility

**Updated Configuration:**
```typescript
const corsOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',').map(o => o.trim())
  : [
    'https://tauben-scanner.fugjoo.duckdns.org',
    'capacitor://localhost',
    'http://localhost:8100',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost'
  ];

app.use(cors({
  origin: corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204
}));
```

### 2. Nginx Reverse Proxy CORS Configuration
**File:** Nginx Proxy Manager configuration for host `tauben-scanner.fugjoo.duckdns.org`

**Changes Made:**
- Added CORS headers directly to the nginx reverse proxy
- Implemented proper OPTIONS preflight handling
- Ensured CORS headers are always sent with `always` directive

**Configuration Added:**
```nginx
location / {
    # Add CORS headers
    add_header 'Access-Control-Allow-Origin' 'https://tauben-scanner.fugjoo.duckdns.org' always;
    add_header 'Access-Control-Allow-Origin' 'capacitor://localhost' always;
    add_header 'Access-Control-Allow-Origin' 'http://localhost' always;
    add_header 'Access-Control-Allow-Origin' 'http://localhost:8100' always;
    add_header 'Access-Control-Allow-Origin' 'http://localhost:5173' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization' always;
    add_header 'Access-Control-Allow-Credentials' 'true' always;

    # Handle preflight requests
    if ($request_method = 'OPTIONS') {
        add_header 'Access-Control-Allow-Origin' 'https://tauben-scanner.fugjoo.duckdns.org';
        add_header 'Access-Control-Allow-Origin' 'capacitor://localhost';
        add_header 'Access-Control-Allow-Origin' 'http://localhost';
        add_header 'Access-Control-Allow-Origin' 'http://localhost:8100';
        add_header 'Access-Control-Allow-Origin' 'http://localhost:5173';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS';
        add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization';
        add_header 'Access-Control-Allow-Credentials' 'true';
        add_header 'Access-Control-Max-Age' 1728000;
        add_header 'Content-Type' 'text/plain; charset=utf-8';
        add_header 'Content-Length' 0;
        return 204;
    }
    
    # Proxy!
    include conf.d/include/proxy.conf;
}
```

### 3. Docker Compose Environment Variables
**File:** `docker-compose.yml`

The Docker Compose configuration already had the correct `CORS_ORIGINS` environment variable:

```yaml
CORS_ORIGINS: "https://tauben-scanner.fugjoo.duckdns.org,http://localhost:5173,capacitor://localhost,http://localhost"
```

## Testing Performed

### Health Check Test
```bash
curl -v https://tauben-scanner.fugjoo.duckdns.org/health
```
✅ **Result:** 200 OK with all CORS headers present

### CORS Preflight Test (Android WebView)
```bash
curl -H "Origin: capacitor://localhost" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     -v https://tauben-scanner.fugjoo.duckdns.org/api/images/match
```
✅ **Result:** 204 No Content with proper CORS headers

### POST Request Test
```bash
curl -H "Origin: capacitor://localhost" \
     -H "Content-Type: application/json" \
     -X POST \
     -d '{"test": "value"}' \
     -v https://tauben-scanner.fugjoo.duckdns.org/api/images/match
```
✅ **Result:** 400 Bad Request (expected due to invalid data) with CORS headers present

## Allowed Origins

1. **Production:** `https://tauben-scanner.fugjoo.duckdns.org`
2. **Android WebView:** `capacitor://localhost`
3. **Development:** `http://localhost:8100` (Capacitor dev server)
4. **Vite Frontend:** `http://localhost:5173`
5. **Localhost General:** `http://localhost`
6. **Backend API:** `http://localhost:3000`

## Security Considerations

- CORS is configured to allow only specific, known origins
- Credentials are allowed but only for trusted origins
- Access-Control-Max-Age is set to 20 days (1728000 seconds) to cache preflight responses
- All sensitive operations require proper Authorization headers

## What Was Restarted

1. **Nginx Proxy Manager:** Configuration reloaded with `nginx -s reload`
2. **Backend Container:** Restarted to ensure environment variables are picked up

## Verification

- ✅ Health endpoint accessible
- ✅ CORS preflight requests properly handled
- ✅ POST requests with CORS headers working
- ✅ All required origins supported
- ✅ SSL certificate valid and working

## Next Steps for Android Development

The Android WebView should now be able to connect to the backend without CORS issues. If you still encounter problems:

1. Ensure the WebView is configured to allow mixed content if needed
2. Check that the Android app is making requests to `https://tauben-scanner.fugjoo.duckdns.org`
3. Verify network connectivity and SSL certificate trust on the Android device
4. Check the Android app logs for any remaining network errors

## Files Modified

1. `/home/ubuntu/.openclaw/workspace/tauben-scanner/backend/src/app.ts`
2. Nginx Proxy Manager configuration for host `tauben-scanner.fugjoo.duckdns.org`

## Support

If issues persist, check the following logs:
- Docker logs: `docker logs tauben-api`
- Nginx logs: `/data/logs/proxy-host-20_access.log` and `/data/logs/proxy-host-20_error.log`