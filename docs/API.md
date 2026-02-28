# API Dokumentation

Vollständige REST API Referenz für den KI Tauben Scanner.

**Basis-URL:** `http://localhost:3000` (lokal) oder deine Produktions-URL

**Content-Type:** `application/json`

**Wichtig:** Die API verwendet **Base64-kodierte Bilder** (nicht multipart/form-data).

---

## 📚 Inhaltsverzeichnis

- [Allgemein](#allgemein)
- [CORS](#cors)
- [Bild-Upload Format](#bild-upload-format)
- [Health Check](#health-check)
- [Tauben (Pigeons)](#tauben-pigeons)
- [Bilder (Images)](#bilder-images)
- [Sichtungen (Sightings)](#sichtungen-sightings)
- [Fehlerbehandlung](#fehlerbehandlung)

---

## Allgemein

### Authentifizierung

⚠️ **Wichtig:** Die aktuelle Version hat **keine Authentifizierung**. Die API ist offen zugänglich.

Für Produktionsumgebungen sollte ein Auth-Layer (z.B. JWT oder API-Keys) hinzugefügt werden.

### Request Format

Alle Endpoints akzeptieren `application/json`. Bilder werden als Base64-Strings übertragen.

---

## CORS

**Backend regelt CORS allein** - Nginx sollte KEINE CORS-Headers hinzufügen.

### Konfiguration

Erlaubte Origins werden über `CORS_ORIGINS` konfiguriert:

```bash
CORS_ORIGINS=https://tauben-scanner.fugjoo.duckdns.org,http://localhost:8081
```

### Verhalten

- `null` Origin wird erlaubt (React Native / Expo)
- Origins werden gespiegelt (reflect origin)
- Credentials werden unterstützt
- Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH

---

## Bild-Upload Format

### Base64 JSON (Aktuelle Implementierung)

```typescript
// POST /api/images/match
const matchImage = async (base64Image: string) => {
  const response = await api.post('/images/match', {
    photo: base64Image,  // data:image/jpeg;base64,...
    threshold: 0.80,
    location: {
      lat: 52.52,
      lng: 13.405,
      name: 'Berlin'
    }
  });
  return response.data;
};
```

Das Bild muss ein Base64-kodierter String sein, optional mit Data-URL-Präfix (`data:image/jpeg;base64,...`).

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

#### Request Body (JSON)

| Feld | Typ | Erforderlich | Beschreibung |
|------|-----|--------------|--------------|
| `name` | string | ✅ | Name der Taube |
| `photo` | string (Base64) | ❌ | Bild als Base64-String |
| `description` | string | ❌ | Beschreibung |
| `location` | object | ❌ | Standort `{lat, lng, name}` |
| `is_public` | boolean | ❌ | Öffentlich sichtbar (default: true) |

**React Native Example:**

```typescript
const createPigeon = async (base64Photo: string, name: string) => {
  const { data } = await api.post('/pigeons', {
    name: name,
    photo: base64Photo,  // data:image/jpeg;base64,...
    description: 'Roter Ring am linken Fuß',
    location: {
      lat: 52.52,
      lng: 13.405,
      name: 'Alexanderplatz, Berlin'
    }
  });
  
  return data;
};
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

---

### GET /api/pigeons/:id

Gibt Details einer spezifischen Taube zurück, inklusive Sichtungen.

#### Path Parameters

| Parameter | Typ | Beschreibung |
|-----------|-----|--------------|
| `id` | UUID | ID der Taube |

**React Query Hook:**

```typescript
// hooks/usePigeon.ts
import { useQuery } from '@tanstack/react-query';

export const usePigeon = (id: string) => {
  return useQuery({
    queryKey: ['pigeons', id],
    queryFn: async () => {
      const { data } = await api.get(`/pigeons/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

// Verwendung
const { data, isLoading, error } = usePigeon(pigeonId);
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

**React Query Hook:**

```typescript
// hooks/usePigeons.ts
import { useQuery } from '@tanstack/react-query';

export const usePigeons = (page = 1, limit = 20, search = '') => {
  return useQuery({
    queryKey: ['pigeons', { page, limit, search }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(search && { search }),
      });
      const { data } = await api.get(`/pigeons?${params}`);
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 Minuten
  });
};
```

---

## Bilder (Images)

### POST /api/images/match

Sucht nach ähnlichen Tauben anhand eines Fotos.

#### Request Body (JSON)

| Feld | Typ | Erforderlich | Beschreibung |
|------|-----|--------------|--------------|
| `photo` | string (Base64) | ✅ | Bild als Base64-String |
| `threshold` | number | ❌ | Matching-Schwelle (0.50-0.99, default: 0.80) |
| `location` | object | ❌ | Standort der Sichtung `{lat, lng, name}` |

**React Query Mutation:**

```typescript
// hooks/useMatchImage.ts
import { useMutation } from '@tanstack/react-query';

interface MatchImageParams {
  base64Image: string;
  threshold?: number;
  location?: {
    lat: number;
    lng: number;
    name?: string;
  };
}

export const useMatchImage = () => {
  return useMutation({
    mutationFn: async ({ base64Image, threshold = 0.8, location }: MatchImageParams) => {
      const { data } = await api.post('/images/match', {
        photo: base64Image,
        threshold,
        ...(location && { location }),
      });
      
      return data;
    },
  });
};

// Verwendung
const { mutate: matchImage, isPending } = useMatchImage();

const handleScan = async (base64Photo: string) => {
  matchImage(
    { base64Image: base64Photo, threshold: 0.85 },
    {
      onSuccess: (result) => {
        if (result.match) {
          navigation.navigate('Result', { result });
        } else {
          navigation.navigate('Register', { photoUri });
        }
      },
      onError: (error) => {
        console.error('Scan failed:', error);
      },
    }
  );
};
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
      "name": "Helga Hell",
      "similarity": 0.6543
    }
  ],
  "suggestion": "Register as new pigeon?"
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
| `location` | object | ❌ | Standort `{lat, lng, name}` |
| `notes` | string | ❌ | Notizen zur Sichtung |
| `condition` | string | ❌ | Zustand (healthy, injured, unknown) |

**React Query Mutation:**

```typescript
// hooks/useCreateSighting.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateSighting = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (sighting: {
      pigeonId: string;
      location?: { lat: number; lng: number; name?: string };
      notes?: string;
      condition?: 'healthy' | 'injured' | 'unknown';
    }) => {
      const { data } = await api.post('/sightings', {
        pigeon_id: sighting.pigeonId,
        location: sighting.location,
        notes: sighting.notes,
        condition: sighting.condition,
      });
      return data;
    },
    onSuccess: (_, variables) => {
      // Cache invalidieren
      queryClient.invalidateQueries({
        queryKey: ['pigeons', variables.pigeonId],
      });
      queryClient.invalidateQueries({
        queryKey: ['sightings', variables.pigeonId],
      });
    },
  });
};
```

---

## Fehlerbehandlung

### Axios Error Interceptor

```typescript
// services/api.ts - Error Handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    let errorMessage = 'Ein Fehler ist aufgetreten';
    
    if (error.code === 'ECONNABORTED') {
      errorMessage = 'Zeitüberschritt - Bitte Verbindung prüfen';
    } else if (error.response) {
      // Server hat Fehler zurückgegeben
      switch (error.response.status) {
        case 400:
          errorMessage = error.response.data.message || 'Ungültige Eingabe';
          break;
        case 404:
          errorMessage = 'Nicht gefunden';
          break;
        case 500:
          errorMessage = 'Serverfehler';
          break;
        default:
          errorMessage = `Fehler ${error.response.status}`;
      }
    } else if (error.request) {
      errorMessage = 'Keine Antwort vom Server';
    }
    
    return Promise.reject(new Error(errorMessage));
  },
);
```

### Fehler-Codes

| Code | HTTP Status | Beschreibung |
|------|-------------|--------------|
| `VALIDATION_ERROR` | 400 | Ungültige Eingabedaten |
| `MISSING_INPUT` | 400 | Photo fehlt |
| `INVALID_THRESHOLD` | 400 | Threshold außerhalb Bereich (0.5-0.99) |
| `EMBEDDING_EXTRACTION_FAILED` | 400 | Bild konnte nicht verarbeitet werden |
| `NOT_FOUND` | 404 | Resource nicht gefunden |
| `INTERNAL_SERVER_ERROR` | 500 | Serverseitiger Fehler |
| `DATABASE_CONNECTION_FAILED` | 503 | Datenbank nicht erreichbar |

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
  photoUrl?: string;  // Absolute URL
  embedding_generated: boolean;
  created_at: string;
  updated_at?: string;
  sightings?: Sighting[];
  sightings_count?: number;
}

export interface MatchRequest {
  photo: string;  // Base64 image
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

// Query Result Types
export interface PaginatedResponse<T> {
  pigeons: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
```

---

**Zurück zur [Hauptdokumentation](../README.md)**

*Aktualisiert: Base64 Uploads, Expo SDK 52, React Native 0.76*
