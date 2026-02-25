# Architektur

Übersicht über die Systemarchitektur des KI Tauben Scanners.

---

## Architektur-Wechsel

### Früher: Client-Side ML

```
Frontend (TensorFlow.js) → 1024-d Embedding → POST /api/images/match
```

- MobileNet-V3 lief im Browser/App
- Frontend generierte Embeddings
- Backend empfing nur Vektoren

### Jetzt: Server-Side ML

```
Frontend (Photo) → POST /api/images/match → Backend (MobileNet-V3) → Embedding
```

- Frontend sendet Base64-Photos
- Backend extrahiert Embeddings
- Einheitliche Verarbeitung

---

## Komponenten

### Frontend (React + Capacitor)

**Aufgaben:**
- Kamera-Zugriff
- Photo-Capture als Base64
- API-Requests mit Timeout-Handling
- Debug-UI (UploadProgress, NetworkDebugPanel)

**Key Technologies:**
- React 19
- TypeScript 5.9
- Capacitor 8
- Vite 7

**Timeout-Konfiguration:**

| Operation | Timeout |
|-----------|---------|
| Health Check | 10s |
| Pigeon List | 15s |
| Pigeon Registration | 30s |
| Image Match | 30s |
| Sighting | 30s |

### Backend (Express.js)

**Aufgaben:**
- Photo-Empfang (Base64)
- Embedding-Extraktion (MobileNet-V3)
- Ähnlichkeitssuche (pgvector)
- CORS-Regelung

**Key Technologies:**
- Express.js 5
- TypeScript 5.9
- MobileNet-V3 (TensorFlow.js)
- pg 8 (PostgreSQL)

**CORS-Konfiguration:**

```typescript
// Backend regelt CORS - kein Nginx-Proxy für CORS
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      'https://tauben-scanner.fugjoo.duckdns.org',
      'capacitor://localhost',
      'http://localhost:5173',
      // ...
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin || '*');
    } else {
      callback(new Error('Not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

### Datenbank (PostgreSQL + pgvector)

**Schema:**

| Tabelle | Zweck |
|---------|-------|
| `pigeons` | Registrierte Tauben mit Embedding |
| `images` | Bilder (optional) |
| `sightings` | Sichtungen |

**Indizes:**

```sql
-- HNSW für Vektor-Suche
CREATE INDEX pigeons_embedding_idx ON pigeons 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- GIN für Full-Text-Suche
CREATE INDEX pigeons_name_search_idx ON pigeons 
USING gin(to_tsvector('german', name));
```

### Storage (MinIO)

- S3-kompatibler Object Storage
- Speichert Original-Bilder
- Zugriff über API

---

## Datenfluss

### Photo-Registrierung

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Camera  │────▶│  Base64  │────▶│  Backend │────▶│  MinIO   │
│  Capture │     │  Photo   │     │  Upload  │     │ Storage  │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
                                         │
                                         ▼
                                  ┌──────────┐
                                  │ MobileNet│
                                  │ Embedding│
                                  └────┬─────┘
                                       │
                                       ▼
                                  ┌──────────┐
                                  │PostgreSQL│
                                  │ (pgvector)
                                  └──────────┘
```

### Photo-Matching

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Camera  │────▶│  Base64  │────▶│  Backend │────▶│ MobileNet│
│  Capture │     │  Photo   │     │  Upload  │     │ Embedding│
└──────────┘     └──────────┘     └────┬─────┘     └────┬─────┘
                                       │                │
                                       │                ▼
                                       │           ┌──────────┐
                                       │           │ Similar. │
                                       │           │ Search   │
                                       │           └────┬─────┘
                                       │                │
                                       ▼                ▼
                                  ┌─────────────────────────┐
                                  │     PostgreSQL          │
                                  │  (pgvector HNSW Index)  │
                                  └─────────────────────────┘
```

---

## API-Endpunkte

| Endpoint | Methode | Zweck |
|----------|---------|-------|
| `/api/pigeons` | POST | Taube mit Photo registrieren |
| `/api/pigeons/:id` | GET | Taube abrufen |
| `/api/pigeons` | GET | Tauben-Liste (paginiert) |
| `/api/images/match` | POST | Photo-Matching |
| `/api/sightings` | POST | Sichtung erstellen |
| `/health` | GET | Health-Check |

### Request/Response Beispiele

**POST /api/pigeons:**

```json
{
  "name": "Rudi",
  "photo": "iVBORw0KGgoAAAANSUhEUgAAABAAAA...",
  "location": { "lat": 52.5200, "lng": 13.4050 }
}
```

**POST /api/images/match:**

```json
{
  "photo": "iVBORw0KGgoAAAANSUhEUgAAABAAAA...",
  "threshold": 0.80
}
```

---

## Mobile App

### Android-Konfiguration

**capacitor.config.ts:**

```typescript
const isDebugBuild = process.env.NODE_ENV !== 'production' 
  && process.env.BUILD_TYPE !== 'release';

const config: CapacitorConfig = {
  appId: 'com.taubenscanner.app',
  webDir: 'dist',
  android: {
    webContentsDebuggingEnabled: isDebugBuild
  }
};
```

### Berechtigungen

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

---

## Build-System

### GitHub Actions

**Workflow:**

1. Checkout
2. Node.js Setup (v22)
3. Java Setup (v21)
4. Android SDK Setup
5. Dependencies installieren
6. Web-Assets bilden
7. Capacitor Sync
8. Debug APK bilden
9. Release APK bilden
10. Artefakte hochladen

**Build-Outputs:**

| Typ | Datei | Debugging |
|-----|-------|-----------|
| Debug | `app-debug.apk` | webContentsDebuggingEnabled=true |
| Release | `app-release-unsigned.apk` | webContentsDebuggingEnabled=false |

---

## Deployment

### Docker-Compose

```yaml
services:
  postgres:
    image: ankane/pgvector:latest
    
  api:
    build: ./backend
    environment:
      - NODE_ENV=production
      - CORS_ORIGINS=https://...
    
  minio:
    image: minio/minio:latest
```

### CORS-Hinweis

⚠️ **Backend regelt CORS allein.**

- Nginx Proxy Manager: KEINE CORS-Headers hinzufügen
- Backend: `Access-Control-Allow-Origin` mit reflected origin
- Null-Origin wird für Android WebView erlaubt

---

## Sicherheit

### Implementiert

- ✅ HTTPS-only (kein cleartext)
- ✅ CORS vom Backend
- ✅ Security Headers (Helmet)
- ✅ Request-Timeouts
- ✅ Input-Validierung

### Empfohlen

- JWT-Authentifizierung
- Rate-Limiting
- API-Keys
- Bild-Validierung (Größe, Format)

---

**Zurück zur [Hauptdokumentation](../README.md)**
