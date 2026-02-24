# API Dokumentation

Vollständige REST API Referenz für den KI Tauben Scanner.

**Basis-URL:** `http://localhost:3000` (lokal) oder deine Produktions-URL

**Content-Type:** `application/json`

---

## 📚 Inhaltsverzeichnis

- [Allgemein](#allgemein)
- [Health Check](#health-check)
- [Tauben (Pigeons)](#tauben-pigeons)
- [Bilder (Images)](#bilder-images)
- [Sichtungen (Sightings)](#sichtungen-sightings)
- [Fehlerbehandlung](#fehlerbehandlung)
- [Rate Limiting](#rate-limiting)

---

## Allgemein

### CORS

Die API unterstützt Cross-Origin Requests. Erlaubte Origins werden über `CORS_ORIGINS` konfiguriert.

Standardmäßig erlaubt:
- `http://localhost:5173` (Vite Dev Server)
- `http://localhost:3000` (API)
- `capacitor://localhost` (Mobile App)

### Authentifizierung

⚠️ **Wichtig:** Die aktuelle Version hat keine Authentifizierung. Für Produktionsumgebungen sollte ein Auth-Layer hinzugefügt werden.

### Request Format

Alle Endpoints akzeptieren und geben `application/json` zurück.

### Response Envelope

Alle Antworten folgen diesem Format:

```json
{
  // Bei Erfolg: Direkt die Resource(n)
  // Bei Fehler: Error-Objekt
}
```

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

Erstellt eine neue Taube in der Datenbank.

#### Request Body

| Feld | Typ | Erforderlich | Beschreibung |
|------|-----|--------------|--------------|
| `name` | string | ✅ | Name der Taube |
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
  "photo_url": null,
  "embedding_generated": false,
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
    "Latitude must be a number between -90 and 90"
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
  "photo_url": null,
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

#### Response 500 (Server Error)

```json
{
  "error": "INTERNAL_SERVER_ERROR",
  "message": "Failed to fetch pigeon"
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

#### Response 200 (Success)

```json
{
  "pigeons": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Rudi Rothen",
      "photo_url": null,
      "first_seen": "2024-01-10T08:00:00.000Z",
      "sightings_count": 5
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Helga Hell",
      "photo_url": null,
      "first_seen": "2024-01-11T10:00:00.000Z",
      "sightings_count": 3
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "pages": 1
  }
}
```

#### Response 500 (Server Error)

```json
{
  "error": "INTERNAL_SERVER_ERROR",
  "message": "Failed to fetch pigeons"
}
```

---

## Bilder (Images)

### POST /api/images/match

Sucht nach ähnlichen Tauben anhand eines Bild-Embeddings.

#### Request Body

| Feld | Typ | Erforderlich | Beschreibung |
|------|-----|--------------|--------------|
| `embedding` | array | ⚠️ | 1024-dimensionaler Vektor (base64 oder Array) |
| `photo` | base64 | ⚠️ | Bild (Base64) - wird clientseitig verarbeitet |
| `threshold` | float | ❌ | Matching-Schwelle (0.50-0.99, default: 0.80) |
| `location` | object | ❌ | Standort der Sichtung |

⚠️ **Hinweis:** Mindestens eines der Felder `embedding` oder `photo` muss vorhanden sein.

**Beispiel Request mit Embedding:**

```bash
curl -X POST http://localhost:3000/api/images/match \
  -H "Content-Type: application/json" \
  -d '{
    "embedding": [0.123, -0.456, 0.789, ..., 0.321],
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
  "similar_pigeons": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Unbekannte Taube",
      "similarity": 0.6532
    }
  ],
  "suggestion": "Register as new pigeon?"
}
```

#### Response 400 (Validation Error)

```json
{
  "error": "INVALID_EMBEDDING",
  "message": "Embedding must be a 1024-dimensional array of numbers"
}
```

```json
{
  "error": "MISSING_INPUT",
  "message": "Either embedding or photo is required"
}
```

```json
{
  "error": "INVALID_THRESHOLD",
  "message": "Threshold must be a number between 0.5 and 0.99"
}
```

#### Response 500 (Server Error)

```json
{
  "error": "INTERNAL_SERVER_ERROR",
  "message": "Failed to match pigeon"
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

#### Response 400 (Validation Error)

```json
{
  "error": "VALIDATION_ERROR",
  "message": "Invalid input data",
  "details": [
    "pigeon_id is required and must be a string",
    "Latitude must be a number between -90 and 90"
  ]
}
```

#### Response 404 (Pigeon Not Found)

```json
{
  "error": "NOT_FOUND",
  "message": "Pigeon not found"
}
```

#### Response 500 (Server Error)

```json
{
  "error": "INTERNAL_SERVER_ERROR",
  "message": "Failed to create sighting"
}
```

---

### GET /api/sightings

Listet alle Sichtungen mit Paginierung.

#### Query Parameters

| Parameter | Typ | Default | Beschreibung |
|-----------|-----|---------|--------------|
| `page` | integer | 1 | Seitennummer |
| `limit` | integer | 20 | Ergebnisse pro Seite (max 100) |

**Beispiel Request:**

```bash
curl "http://localhost:3000/api/sightings?page=1&limit=10"
```

#### Response 200 (Success)

```json
{
  "sightings": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "pigeon": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Rudi Rothen"
      },
      "location": {
        "lat": 52.5205,
        "lng": 13.4055,
        "name": "Fernsehturm, Berlin"
      },
      "notes": "Frisst von einem Sandwich",
      "condition": "healthy",
      "timestamp": "2024-01-15T09:30:00.000Z"
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440002",
      "pigeon": {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "name": "Helga Hell"
      },
      "location": {
        "lat": 52.515,
        "lng": 13.41,
        "name": "Brandenburger Tor"
      },
      "notes": null,
      "condition": "unknown",
      "timestamp": "2024-01-14T16:45:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "pages": 1
  }
}
```

---

### GET /api/pigeons/:id/sightings

Gibt alle Sichtungen einer spezifischen Taube zurück.

#### Path Parameters

| Parameter | Typ | Beschreibung |
|-----------|-----|--------------|
| `id` | UUID | ID der Taube |

**Beispiel Request:**

```bash
curl http://localhost:3000/api/pigeons/550e8400-e29b-41d4-a716-446655440000/sightings
```

#### Response 200 (Success)

```json
[
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
]
```

---

## Fehlerbehandlung

### Fehler-Codes

| Code | HTTP Status | Beschreibung |
|------|-------------|--------------|
| `VALIDATION_ERROR` | 400 | Ungültige Eingabedaten |
| `INVALID_EMBEDDING` | 400 | Embedding hat falsches Format |
| `MISSING_INPUT` | 400 | Erforderliches Feld fehlt |
| `INVALID_THRESHOLD` | 400 | Threshold außerhalb des gültigen Bereichs |
| `NOT_FOUND` | 404 | Resource nicht gefunden |
| `INTERNAL_SERVER_ERROR` | 500 | Serverseitiger Fehler |
| `DATABASE_CONNECTION_FAILED` | 503 | Datenbank nicht erreichbar |

### Error Response Format

```json
{
  "error": "ERROR_CODE",
  "message": "Human-readable description",
  "details": ["Optional array of specific issues"] // Nur bei Validation Error
}
```

---

## Rate Limiting

⚠️ **Aktuell nicht implementiert.** 

Zukünftig geplant:
- 100 Requests pro Minute pro IP
- 1000 Requests pro Stunde pro API-Key

---

## TypeScript Types

Für TypeScript-Projekte:

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

export interface Sighting {
  id: string;
  pigeon_id: string;
  location?: Location;
  notes?: string;
  condition?: 'healthy' | 'injured' | 'unknown';
  timestamp: string;
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

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiError {
  error: string;
  message: string;
  details?: string[];
}
```

---

## Beispiel: Kompletter Workflow

### 1. Taube registrieren

```bash
# Neue Taube erstellen
curl -X POST http://localhost:3000/api/pigeons \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test-Taube",
    "description": "Ring rechts: 2024-AB-123"
  }'
# Response: { "id": "uuid-hier", ... }
```

### 2. Sichtung eintragen

```bash
# Sichtung der Taube
curl -X POST http://localhost:3000/api/sightings \
  -H "Content-Type: application/json" \
  -d '{
    "pigeon_id": "uuid-hier",
    "location": { "lat": 52.52, "lng": 13.405, "name": "Berlin" },
    "condition": "healthy"
  }'
```

### 3. Bild-Matching

```bash
# Mit Embedding nach gleicher Taube suchen
curl -X POST http://localhost:3000/api/images/match \
  -H "Content-Type: application/json" \
  -d '{
    "embedding": [/* 1024 Zahlen */],
    "threshold": 0.85
  }'
# Response: Match mit "Test-Taube"
```

---

**Zurück zur [Hauptdokumentation](../README.md)**
