# API Dokumentation

Vollständige REST API Referenz für den KI Tauben Scanner.

**Basis-URL:** `http://localhost:3000` (lokal) oder deine Produktions-URL

**Content-Type:** `application/json`

---

## 📚 Inhaltsverzeichnis

- [Allgemein](#allgemein)
- [CORS](#cors)
- [Health Check](#health-check)
- [Tauben (Pigeons)](#tauben-pigeons)
- [Bilder (Images)](#bilder-images)
- [Sichtungen (Sightings)](#sichtungen-sightings)
- [Fehlerbehandlung](#fehlerbehandlung)

---

## Allgemein

### Authentifizierung

⚠️ **Wichtig:** Die aktuelle Version hat keine Authentifizierung. Für Produktionsumgebungen sollte ein Auth-Layer hinzugefügt werden.

### Request Format

Alle Endpoints akzeptieren und geben `application/json` zurück.

---

## CORS

**Backend regelt CORS allein** - Nginx sollte KEINE CORS-Headers hinzufügen.

### Konfiguration

Erlaubte Origins werden über `CORS_ORIGINS` konfiguriert:

```bash
CORS_ORIGINS=https://tauben-scanner.fugjoo.duckdns.org,capacitor://localhost
```

### Verhalten

- `null` Origin wird erlaubt (Android Capacitor WebView)
- Origins werden gespiegelt (reflect origin)
- Credentials werden unterstützt
- Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH

### Default Origins

- `https://tauben-scanner.fugjoo.duckdns.org`
- `capacitor://localhost`
- `http://localhost:8100`
- `http://localhost:5173`
- `http://localhost:3000`
- `http://localhost`
- `ionic://localhost`
- `http://localhost:8080`
- `http://localhost:4200`

---

## Health Check

### GET /health

Prüft den Status aller Services.

#### Response 200 (Healthy)

```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "services": {
    "database": "connected",
    "storage": "connected",
    "embedding_model": "loaded"
  }
}
```

#### Response 503 (Unhealthy)

```json
{
  "status": "unhealthy",
  "error": "DATABASE_CONNECTION_FAILED",
  "message": "Could not connect to database"
}
```

**Nutzung:** Ideal für Docker HEALTHCHECK und Load Balancer.

---

## Tauben (Pigeons)

### POST /api/pigeons

Erstellt eine neue Taube in der Datenbank. **NEU:** Erwartet jetzt ein Photo statt Embedding.

#### Request Body

| Feld | Typ | Erforderlich | Beschreibung |
|------|-----|--------------|--------------|
| `name` | string | ✅ | Name der Taube |
| `photo` | string (base64) | ✅ | Bild als Base64-String |
| `description` | string | ❌ | Beschreibung |
| `location` | object | ❌ | Standort |
| `location.lat` | number | ❌ | Breitengrad (-90 bis 90) |
| `location.lng` | number | ❌ | Längengrad (-180 bis 180) |
| `location.name` | string | ❌ | Ortsname |
| `is_public` | boolean | ❌ | Öffentlich sichtbar (default: true) |

**Beispiel Request:**

```bash
curl -X POST http://localhost:3000/api/pigeons \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rudi Rothen",
    "description": "Roter Ring am linken Fuß, sehr zutraulich",
    "photo": "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9h...",
    "location": {
      "lat": 52.5200,
      "lng": 13.4050,
      "name": "Alexanderplatz, Berlin"
    },
    "is_public": true
  }'
```

#### Response 201 (Created)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Rudi Rothen",
  "description": "Roter Ring am linken Fuß, sehr zutraulich",
  "location": {
    "lat": 52.52,
    "lng": 13.405,
    "name": "Alexanderplatz, Berlin"
  },
  "first_seen": null,
  "photo_url": "/uploads/rudi_2024_01.jpg",
  "embedding_generated": true,
  "created_at": "2024-01-15T10:30:00.000Z"
}
```

#### Response 400 (Validation Error)

```json
{
  "error": "VALIDATION_ERROR",
  "message": "Invalid input data",
  "details": [
    "Name is required and must be a non-empty string",
    "Photo is required"
  ]
}
```

#### Response 500 (Server Error)

```json
{
  "error": "INTERNAL_SERVER_ERROR",
  "message": "Failed to create pigeon"
}
```

---

### GET /api/pigeons/:id

Gibt Details einer spezifischen Taube zurück, inklusive Sichtungen.

#### Path Parameters

| Parameter | Typ | Beschreibung |
|-----------|-----|--------------|
| `id` | UUID | ID der Taube |

**Beispiel Request:**

```bash
curl http://localhost:3000/api/pigeons/550e8400-e29b-41d4-a716-446655440000
```

#### Response 200 (Success)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Rudi Rothen",
  "description": "Roter Ring am linken Fuß",
  "location": {
    "lat": 52.52,
    "lng": 13.405,
    "name": "Alexanderplatz, Berlin"
  },
  "first_seen": "2024-01-10T08:00:00.000Z",
  "photo_url": "/uploads/rudi_2024_01.jpg",
  "sightings": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "location": {
        "lat": 52.5205,
        "lng": 13.4055,
        "name": "Fernsehturm"
      },
      "notes": "Frisst von einem Sandwich",
      "timestamp": "2024-01-15T09:30:00.000Z"
    }
  ],
  "sightings_count": 5,
  "created_at": "2024-01-10T08:00:00.000Z",
  "updated_at": "2024-01-15T09:30:00.000Z"
}
```

#### Response 404 (Not Found)

```json
{
  "error": "NOT_FOUND",
  "message": "Pigeon not found"
}
```

---

### GET /api/pigeons

Listet alle Tauben mit Paginierung und optionaler Suche.

#### Query Parameters

| Parameter | Typ | Default | Beschreibung |
|-----------|-----|---------|--------------|
| `page` | integer | 1 | Seitennummer |
| `limit` | integer | 20 | Ergebnisse pro Seite (max 100) |
| `search` | string | - | Suche im Namen (case-insensitive) |

**Beispiel Request:**

```bash
# Alle Tauben (paginiert)
curl "http://localhost:3000/api/pigeons?page=1&limit=10"

# Mit Suche
curl "http://localhost:3000/api/pigeons?search=Rudi&limit=5"
```

---

## Bilder (Images)

### POST /api/images/match

Sucht nach ähnlichen Tauben anhand eines Fotos. **GEÄNDERT:** Erwartet jetzt Photo statt Embedding.

#### Request Body

| Feld | Typ | Erforderlich | Beschreibung |
|------|-----|--------------|--------------|
| `photo` | string (base64) | ✅ | Bild als Base64-String |
| `threshold` | float | ❌ | Matching-Schwelle (0.50-0.99, default: 0.80) |
| `location` | object | ❌ | Standort der Sichtung |

**Beispiel Request:**

```bash
curl -X POST http://localhost:3000/api/images/match \
  -H "Content-Type: application/json" \
  -d '{
    "photo": "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9h...",
    "threshold": 0.80,
    "location": {
      "lat": 52.52,
      "lng": 13.405,
      "name": "Alexanderplatz"
    }
  }'
```

#### Response 200 (Match Found)

```json
{
  "match": true,
  "pigeon": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Rudi Rothen",
    "description": "Roter Ring am linken Fuß",
    "photo_url": "/uploads/rudi_2024_01.jpg",
    "first_seen": "2024-01-10T08:00:00.000Z",
    "sightings_count": 5
  },
  "confidence": 0.9234,
  "similar_pigeons": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Helga Hell",
      "similarity": 0.8156
    }
  ]
}
```

#### Response 200 (No Match)

```json
{
  "match": false,
  "confidence": 0,
  "similar_pigeons": [],
  "suggestion": "Register as new pigeon?"
}
```

#### Response 400 (Validation Error)

```json
{
  "error": "MISSING_PHOTO",
  "message": "Photo is required"
}
```

```json
{
  "error": "INVALID_THRESHOLD",
  "message": "Threshold must be a number between 0.5 and 0.99"
}
```

---

## Sichtungen (Sightings)

### POST /api/sightings

Erstellt eine neue Sichtung einer Taube.

#### Request Body

| Feld | Typ | Erforderlich | Beschreibung |
|------|-----|--------------|--------------|
| `pigeon_id` | UUID | ✅ | ID der Taube |
| `location` | object | ❌ | Standort |
| `location.lat` | number | ❌ | Breitengrad |
| `location.lng` | number | ❌ | Längengrad |
| `location.name` | string | ❌ | Ortsname |
| `notes` | string | ❌ | Notizen zur Sichtung |
| `condition` | string | ❌ | Zustand (healthy, injured, unknown) |

**Beispiel Request:**

```bash
curl -X POST http://localhost:3000/api/sightings \
  -H "Content-Type: application/json" \
  -d '{
    "pigeon_id": "550e8400-e29b-41d4-a716-446655440000",
    "location": {
      "lat": 52.5205,
      "lng": 13.4055,
      "name": "Fernsehturm, Berlin"
    },
    "notes": "Frisst von einem Sandwich",
    "condition": "healthy"
  }'
```

#### Response 201 (Created)

```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "pigeon_id": "550e8400-e29b-41d4-a716-446655440000",
  "location": {
    "lat": 52.5205,
    "lng": 13.4055,
    "name": "Fernsehturm, Berlin"
  },
  "notes": "Frisst von einem Sandwich",
  "condition": "healthy",
  "timestamp": "2024-01-15T09:30:00.000Z"
}
```

---

## Fehlerbehandlung

### Fehler-Codes

| Code | HTTP Status | Beschreibung |
|------|-------------|--------------|
| `VALIDATION_ERROR` | 400 | Ungültige Eingabedaten |
| `MISSING_PHOTO` | 400 | Photo fehlt |
| `INVALID_THRESHOLD` | 400 | Threshold außerhalb Bereich |
| `NOT_FOUND` | 404 | Resource nicht gefunden |
| `INTERNAL_SERVER_ERROR` | 500 | Serverseitiger Fehler |
| `DATABASE_CONNECTION_FAILED` | 503 | Datenbank nicht erreichbar |

### Error Response Format

```json
{
  "error": "ERROR_CODE",
  "message": "Human-readable description",
  "details": ["Optional array of specific issues"]
}
```

---

## TypeScript Types

```typescript
// types/api.ts

export interface Location {
  lat: number;
  lng: number;
  name?: string;
}

export interface Pigeon {
  id: string;
  name: string;
  description?: string;
  location?: Location;
  first_seen?: string;
  photo_url?: string;
  embedding_generated: boolean;
  created_at: string;
  updated_at?: string;
}

export interface MatchRequest {
  photo: string;  // Base64 encoded image
  threshold?: number;
  location?: Location;
}

export interface MatchResponse {
  match: boolean;
  pigeon?: Pigeon;
  confidence: number;
  similar_pigeons?: Array<{
    id: string;
    name: string;
    similarity: number;
  }>;
  suggestion?: string;
}

export interface Sighting {
  id: string;
  pigeon_id: string;
  location?: Location;
  notes?: string;
  condition?: 'healthy' | 'injured' | 'unknown';
  timestamp: string;
}
```

---

## Beispiel: Kompletter Workflow

### 1. Taube registrieren

```bash
# Neue Taube mit Photo erstellen
curl -X POST http://localhost:3000/api/pigeons \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test-Taube",
    "description": "Ring rechts: 2024-AB-123",
    "photo": "base64EncodedImage..."
  }'
```

### 2. Photo-Matching

```bash
# Mit Photo nach gleicher Taube suchen
curl -X POST http://localhost:3000/api/images/match \
  -H "Content-Type: application/json" \
  -d '{
    "photo": "base64EncodedImage...",
    "threshold": 0.85
  }'
```

---

**Zurück zur [Hauptdokumentation](../README.md)**
