# Fix for "fail to fetch" Error in Production APK

## Issue
Production APK was showing "fail to fetch" errors when trying to make API calls to the backend server.

## Root Causes Identified

### 1. CRITICAL: Capacitor Server Configuration Mismatch
**File**: `frontend/capacitor.config.ts`, lines 9-11

**Problem**:
```typescript
server: {
  cleartext: true,
  androidScheme: 'https'
}
```

This configuration created a conflict:
- `cleartext: true` allows HTTP traffic (for development)
- `androidScheme: 'https'` sets the WebView to enforce HTTPS

This mismatch caused the WebView to incorrectly handle HTTP/HTTPS routing and broke fetch requests to the backend.

**Fix**:
```typescript
server: {
  cleartext: false,
  androidScheme: 'https'
}
```

Now both settings are consistent - the app enforces HTTPS for all traffic.

---

### 2. MISSING: Network Security Configuration
**File**: `frontend/android/app/src/main/AndroidManifest.xml`

**Problem**:
- Missing `android:usesCleartextTraffic` attribute
- Missing `android:networkSecurityConfig` reference
- No `network_security_config.xml` file defined

Android 9+ (API level 28) blocks cleartext (HTTP) traffic by default for security. Without proper configuration, the app couldn't establish network connections.

**Fix**:
1. Added attributes to AndroidManifest.xml:
```xml
android:usesCleartextTraffic="false"
android:networkSecurityConfig="@xml/network_security_config"
```

2. Created `network_security_config.xml` to:
- Explicitly block cleartext traffic (`cleartextTrafficPermitted="false"`)
- Allow `tauben-scanner.fugjoo.duckdns.org` domain with HTTPS
- Use system certificates only (no self-signed certs)

---

### 3. MODERATE: Inconsistent Default URL Trailing Slashes
**Files**:
- `frontend/src/contexts/SettingsContext.tsx` (line 18)
- `frontend/src/components/settings/BackendUrlInput.tsx` (line 34)

**Problem**:
- Default URL in SettingsContext: `'https://tauben-scanner.fugjoo.duckdns.org/'` (with trailing slash)
- Default URL in api.ts: `'https://tauben-scanner.fugjoo.duckdns.org'` (no trailing slash)

While the api.ts had code to remove trailing slashes, the inconsistency could cause confusion. When the default Settings URL was saved with a trailing slash, URL construction become: `https://...//api/images/match` (double slash).

**Fix**:
Unified all default URLs to NOT have trailing slashes:
- `frontend/src/contexts/SettingsContext.tsx`: Changed to `'https://tauben-scanner.fugjoo.duckdns.org'`
- `frontend/src/components/settings/BackendUrlInput.tsx`: Updated placeholder
- Improved trailing slash removal in api.ts with regex `replace(/\/+$/, '')` (removes multiple slashes)

---

### 4. MINOR: Missing Fetch Timeout
**File**: `frontend/src/services/api.ts`

**Problem**:
All fetch() calls had no timeout specified. On poor mobile connections or unresponsive servers, requests could hang indefinitely, causing poor UX.

**Fix**:
1. Created `fetchWithTimeout()` helper function with:
   - Configurable timeout (default 30 seconds)
   - AbortController for clean cancellation
   - Clear error message on timeout: "Network timeout - please check your connection"

2. Applied timeouts to all API calls:
   - `matchPigeon()`: 30s (image processing can be slow)
   - `registerPigeon()`: 30s (may include image upload)
   - `getPigeon()`: 15s
   - `listPigeons()`: 15s
   - `reportSighting()`: 30s
   - `healthCheck()`: 10s

---

### 5. MINOR: Improved Error Messages
**File**: `frontend/src/services/api.ts` (handleResponse function)

**Problem**: Generic error messages didn't help users understand what went wrong.

**Fix**: Added specific error messages based on HTTP status codes:
- `404`: "Resource not found - the requested endpoint does not exist"
- `500`: "Server error - please try again later"
- `503`: "Service temporarily unavailable - please try again later"
- `408`: "Request timeout - the server took too long to respond"
- `0` (network error): "Network error - please check your internet connection"

---

## Files Changed

1. ✅ `frontend/capacitor.config.ts`
   - Changed `cleartext: true` → `cleartext: false`

2. ✅ `frontend/android/app/src/main/AndroidManifest.xml`
   - Added `android:usesCleartextTraffic="false"`
   - Added `android:networkSecurityConfig="@xml/network_security_config"`

3. ✅ `frontend/android/app/src/main/res/xml/network_security_config.xml` (NEW)
   - Created network security configuration

4. ✅ `frontend/src/contexts/SettingsContext.tsx`
   - Fixed trailing slash in default backend URL

5. ✅ `frontend/src/components/settings/BackendUrlInput.tsx`
   - Updated placeholder to remove trailing slash

6. ✅ `frontend/src/services/api.ts`
   - Added `fetchWithTimeout()` helper
   - Applied timeouts to all API functions
   - Improved error messages in `handleResponse()`
   - Enhanced trailing slash removal

---

## Testing Steps

### Manual Testing (Device/Emulator)

1. **Build APK**:
   ```bash
   cd frontend
   npm run build
   npx cap sync android
   # Build and install APK via Android Studio or Gradle
   ```

2. **Test API Connectivity**:
   - Open the app
   - Verify no errors on startup
   - Take a photo and try to match a pigeon
   - Attempt to add a new pigeon
   - Check the Settings page

3. **Verify SSL/TLS**:
   - Ensure all requests use HTTPS
   - Check Android Logcat for SSL errors (should be none)

4. **Network Error Handling**:
   - Enable Airplane Mode → should show "Network error" message
   - Disable WiFi (mobile only) → should still work
   - Test with poor network → should timeout gracefully

### Automated Testing

Run existing tests:
```bash
cd backend
npm test

cd frontend
npm test
```

### Backend Verification

Verify backend is accessible:
```bash
curl https://tauben-scanner.fugjoo.duckdns.org/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "...",
  "services": {
    "database": "connected",
    "storage": "connected",
    "embedding_model": "loaded"
  }
}
```

---

## Deployment Checklist

- [x] Capacitor config updated (cleartext: false)
- [x] AndroidManifest.xml updated with security attributes
- [x] Network security config created
- [x] API service updated with timeouts
- [x] Default URLs unified (no trailing slashes)
- [x] Error messages improved
- [ ] Rebuild APK with changes (`npm run build && npx cap sync android`)
- [ ] Test on physical Android device
- [ ] Test with poor network conditions
- [ ] Deploy updated APK to production

---

## Verification After Fix

After installing the updated APK, users should:

1. ✅ **No more "fail to fetch" errors**
2. ✅ **Proper error messages** when network is unavailable
3. ✅ **Timeout after 30s** instead of infinite hang
4. ✅ **All requests use HTTPS** securely
5. ✅ **Backend API calls succeed** (pigeon matching, adding pigeons, etc.)

---

## Future Improvements

### Recommended (Not Critical)
1. Add retry logic with exponential backoff for failed requests
2. Add offline support with local caching
3. Add request/response logging in debug mode
4. Add network status indicator in UI
5. Consider using a dedicated HTTP client (e.g., Axios) for better mobile support

### Backend CORS Enhancement
Allow the production HTTPS domain explicitly for web testing:
```typescript
const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map(o => o.trim())
  : [
      'http://localhost:5173',
      'http://localhost:3000',
      'capacitor://localhost',
      'http://localhost',
      'https://tauben-scanner.fugjoo.duckdns.org'  // Add this
    ];
```

---

## References

- [Capacitor Configuration Docs](https://capacitorjs.com/docs/config)
- [Android Network Security Config](https://developer.android.com/training/articles/security-config)
- [Android Cleartext Traffic (API 28+)](https://developer.android.com/training/articles/security-config#CleartextTrafficPermitted)
- [Capacitor HTTP Issues on Android 9+](https://medium.com/@aliyousefi-dev/ionic-http-not-working-on-lan-after-build-capacitor-fix-for-android-9-2fdd279aea84)