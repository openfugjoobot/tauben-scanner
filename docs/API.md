# API Dokumentation

Vollständige REST API Referenz für den KI Tauben Scanner.

**Basis-URL:** `http://localhost:3000` (lokal) oder deine Produktions-URL

**Content-Type:** `application/json` (oder `multipart/form-data` für Uploads)

---

## 📚 Inhaltsverzeichnis

- [Allgemein](#allgemein)
- [CORS](#cors)
- [Frontend API Client](#frontend-api-client)
- [Health Check](#health-check)
- [Tauben (Pigeons)](#tauben-pigeons)
- [Bilder (Images)](#bilder-images)
- [Sichtungen (Sightings)](#sichtungen-sightings)
- [React Query Hooks](#react-query-hooks)
- [Fehlerbehandlung](#fehlerbehandlung)

---

## Allgemein

### Authentifizierung

⚠️ **Wichtig:** Die aktuelle Version hat keine Authentifizierung. Für Produktionsumgebungen sollte ein Auth-Layer hinzugefügt werden.

### Request Format

Alle Endpoints akzeptieren `application/json`. Bild-Uploads verwenden `multipart/form-data`.

---

## CORS

**Backend regelt CORS allein** - Nginx sollte KEINE CORS-Headers hinzufügen.

### Konfiguration

Erlaubte Origins werden über `CORS_ORIGINS` konfiguriert:

```bash
CORS_ORIGINS=https://tauben-scanner.fugjoo.duckdns.org,
```

### Verhalten

- `null` Origin wird erlaubt (React Native / Expo)
- Origins werden gespiegelt (reflect origin)
- Credentials werden unterstützt
- Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH

### Default Origins

- `https://tauben-scanner.fugjoo.duckdns.org`
- `http://localhost:8081` (Metro Bundler)
- `http://localhost:3000` (Dev Server)

---

## Frontend API Client

### Axios Setup

```typescript
// src/services/api.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.tauben-scanner.de',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const apiKey = useSettingsStore.getState().apiKey;
    if (apiKey) {
      config.headers.Authorization = `Bearer ${apiKey}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor für Error Handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - please check your connection');
    }
    throw error;
  },
);

export default apiClient;
```

### Timeout-Konfiguration

| Operation | Timeout | Beschreibung |
|-----------|---------|-------------|
| Health Check | 10s | Server Status |
| Pigeon List | 15s | Liste abrufen |
| Pigeon Registration | 30s | Mit Bild-Upload |
| Image Match | 30s | KI-Matching |
| Sighting | 30s | Sichtung erstellen |

---

## Bild-Upload Flow

### Mit FormData (React Native)

```typescript
import apiClient from './api';

// Bild von Camera/Roll
const uploadImage = async (imageUri: string) => {
  const formData = new FormData();
  
  // FormData mit richtigem Format
  formData.append('photo', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'scan.jpg',
  } as any);
  
  // Optional: Threshold & Location als String
  formData.append('threshold', '0.80');
  formData.append('location', JSON.stringify({
    lat: 52.52,
    lng: 13.405,
    name: 'Berlin'
  }));
  
  const response = await apiClient.post('/api/images/match', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 30000,
  });
  
  return response.data;
};
```

### Base64 Alternative (legacy)

```typescript
// Für Endpoints die noch Base64 erwarten
const uploadBase64 = async (base64Image: string) => {
  const response = await apiClient.post('/api/images/match', {
    photo: base64Image,
    threshold: 0.80,
  });
  return response.data;
};
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

#### Request Body (multipart/form-data)

| Feld | Typ | Erforderlich | Beschreibung |
|------|-----|--------------|--------------|
| `name` | string | ✅ | Name der Taube |
| `photo` | file | ✅ | Bild als Datei |
| `description` | string | ❌ | Beschreibung |
| `location` | string (JSON) | ❌ | Standort als JSON |
| `is_public` | string | ❌ | Öffentlich sichtbar (default: true) |

**React Native Example:**

```typescript
const createPigeon = async (photoUri: string, name: string) => {
  const formData = new FormData();
  formData.append('name', name);
  formData.append('photo', {
    uri: photoUri,
    type: 'image/jpeg',
    name: 'pigeon.jpg',
  } as any);
  formData.append('description', 'Roter Ring am linken Fuß');
  
  const { data } = await apiClient.post('/api/pigeons', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
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
      const { data } = await apiClient.get(`/api/pigeons/${id}`);
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
      const { data } = await apiClient.get(`/api/pigeons?${params}`);
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

#### Request Body (multipart/form-data)

| Feld | Typ | Erforderlich | Beschreibung |
|------|-----|--------------|--------------|
| `photo` | file | ✅ | Bild als Datei |
| `threshold` | string | ❌ | Matching-Schwelle (0.50-0.99, default: 0.80) |
| `location` | string (JSON) | ❌ | Standort der Sichtung |

**React Query Mutation:**

```typescript
// hooks/useMatchImage.ts
import { useMutation } from '@tanstack/react-query';

interface MatchImageParams {
  imageUri: string;
  threshold?: number;
  location?: {
    lat: number;
    lng: number;
    name?: string;
  };
}

export const useMatchImage = () => {
  return useMutation({
    mutationFn: async ({ imageUri, threshold = 0.8, location }: MatchImageParams) => {
      const formData = new FormData();
      formData.append('photo', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'scan.jpg',
      } as any);
      
      if (threshold) {
        formData.append('threshold', String(threshold));
      }
      if (location) {
        formData.append('location', JSON.stringify(location));
      }
      
      const { data } = await apiClient.post('/api/images/match', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      return data;
    },
  });
};

// Verwendung
const { mutate: matchImage, isPending } = useMatchImage();

const handleScan = async (photoUri: string) => {
  matchImage(
    { imageUri: photoUri, threshold: 0.85 },
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

---

## Sichtungen (Sightings)

### POST /api/sightings

Erstellt eine neue Sichtung einer Taube.

#### Request Body

| Feld | Typ | Erforderlich | Beschreibung |
|------|-----|--------------|--------------|
| `pigeon_id` | UUID | ✅ | ID der Taube |
| `location` | object | ❌ | Standort |
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
      const { data } = await apiClient.post('/api/sightings', sighting);
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

## React Query Hooks

### Überblick

```typescript
// Pigeon Hooks
usePigeons(page, limit, search)       // Liste aller Tauben
usePigeon(id)                          // Einzelne Taube
useCreatePigeon()                      // Taube erstellen (Mutation)
useUpdatePigeon()                      // Taube aktualisieren (Mutation)
useDeletePigeon()                      // Taube löschen (Mutation)

// Scan Hooks
useMatchImage()                        // Bild Matching (Mutation)

// Sighting Hooks
useSightings()                         // Alle Sichtungen
useSightingsByPigeon(pigeonId)         // Sichtungen einer Taube
useCreateSighting()                    // Sichtung erstellen (Mutation)
```

### Query Provider Setup

```typescript
// src/components/providers/QueryProvider.tsx
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5 Minuten
      gcTime: 10 * 60 * 1000,        // 10 Minuten
      retry: 3,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  },
});

export const QueryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {__DEV__ && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
};
```

---

## Fehlerbehandlung

### Axios Error Interceptor

```typescript
// services/api.ts - Error Handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
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
| `MISSING_PHOTO` | 400 | Photo fehlt |
| `INVALID_THRESHOLD` | 400 | Threshold außerhalb Bereich |
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
  photo_url?: string;
  embedding_generated: boolean;
  created_at: string;
  updated_at?: string;
  sightings?: Sighting[];
  sightings_count?: number;
}

export interface MatchRequest {
  photo: string;  // Base64 oder Datei
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
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

---

**Zurück zur [Hauptdokumentation](../README.md)**

*Aktualisiert für React Native + React Query*
