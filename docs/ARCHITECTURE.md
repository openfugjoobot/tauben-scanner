# Architektur

Übersicht über die Systemarchitektur des KI Tauben Scanners.

---

## Tech Stack

### Frontend (React Native + Expo)

| Technologie | Zweck | Version |
|-------------|-------|---------|
| **React Native** | Native Mobile UI | 0.76 |
| **Expo SDK** | Development & Build Platform | 52 |
| **TypeScript** | Typisierung | 5.9 |
| **React Navigation v7** | Navigation | ^7.0 |
| **React Native Paper** | Material Design 3 | ^5.x |
| **Zustand** | State Management | ^5.x |
| **React Query** | Server-State & Caching | ^5.x |
| **Axios** | HTTP Client | ^1.x |
| **MMKV** | Lokale Persistenz | ^2.x |

### Backend (Node.js + Express)

| Technologie | Zweck |
|-------------|-------|
| **Express.js 5** | Web-Framework |
| **TypeScript 5.9** | Typisierung |
| **MobileNet-V2** | Server-side Feature Extraction (TensorFlow.js) |
| **TensorFlow.js** | ML Runtime |
| **1024-d Embeddings** | MobileNet V2 alpha 0.75 |

### Storage

| Komponente | Zweck | Hinweis |
|------------|-------|---------|
| **PostgreSQL + pgvector** | Datenbank & Embeddings | Hauptdatenspeicher |
| **Local Filesystem** | Bildspeicher | `/uploads` Verzeichnis mit statischem Serving |

---

## Architektur-Übersicht

```
┌─────────────────────────────────────────────────────────────────┐
│                     Mobile App (React Native)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │  expo-camera │  │    Axios     │  │  @tanstack/react-query│  │
│  │  (Capture)   │──▶│  (Upload)    │──▶│    (State Mgmt)      │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
│                           │                                      │
│  ┌────────────────────────┘                                      │
│  │  Zustand (Global State) + MMKV (Persistenz)                 │
│  └───────────────────────────────────────────────────────────────┘
│                           │                                      │
└───────────────────────────┼──────────────────────────────────────┘
                            │ HTTPS / JSON + Base64 Images
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Backend (Express.js)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │    REST      │  │  TensorFlow  │  │   PostgreSQL │         │
│  │    API       │──▶│   MobileNet  │──▶│  + pgvector  │         │
│  │              │  │   V2 (1024d) │  │  (Embeddings)│         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│         │                                                      │
│  ┌──────┴──────────────────────┐                               │
│  │  Static File Serving        │                               │
│  │  /uploads (Local Storage)   │                               │
│  └─────────────────────────────┘                               │
└─────────────────────────────────────────────────────────────────┘
```

### Wichtige Architektur-Entscheidungen

**1. Server-side Embedding-Extraktion**
- MobileNet-V2 (alpha 0.75) läuft im Backend (TensorFlow.js)
- Mobile App sendet Base64-kodierte Bilder
- Backend extrahiert 1024-dimensionale Embeddings
- Embeddings werden in PostgreSQL mit pgvector gespeichert

**2. Authentifizierung**
- **Keine Authentifizierung** in der aktuellen Version
- Offene API für einfachen Zugang
- Für Produktion sollte Auth-Layer hinzugefügt werden

**3. Bildspeicher**
- Bilder werden im lokalen Dateisystem gespeichert (`/uploads`)
- Statisches Serving via Express
- Kein MinIO/S3 aktiver Einsatz (konfiguriert aber nicht verwendet)
- Bild-URLs: `/uploads/filename.jpg`

**4. CORS**
- Backend regelt CORS allein
- Nginx sollte KEINE CORS-Headers hinzufügen
- Null-Origin wird erlaubt (für mobile Apps)

---

## Komponenten

### Frontend (React Native + Expo SDK 52)

**Aufgaben:**
- Kamera-Zugriff via `expo-camera`
- Photo-Capture für Upload (Base64)
- API-Requests mit Axios & React Query
- State Management via Zustand
- Lokale Persistenz via MMKV
- Navigation via React Navigation v7
- Material Design 3 UI mit React Native Paper

**Key Technologies:**
- React Native 0.76
- Expo SDK 52
- React Navigation v7
- React Native Paper v5
- Zustand
- React Query
- Axios
- MMKV

### Backend (Express.js)

**Aufgaben:**
- Photo-Empfang (Base64 JSON)
- Embedding-Extraktion (MobileNet-V2 mit alpha 0.75)
- Ähnlichkeitssuche (pgvector)
- CORS-Regelung
- Statisches File Serving für `/uploads`

**Key Technologies:**
- Express.js 5
- TypeScript 5.9
- MobileNet-V2 (TensorFlow.js) - produces 1024-d embeddings
- pg 8 (PostgreSQL)
- Kein Multer (Base64 Uploads statt Multipart)

---

## Datenbank Schema

### pigeons Tabelle

```sql
CREATE TABLE pigeons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    location_name VARCHAR(255),
    first_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_public BOOLEAN DEFAULT true,
    embedding vector(1024),  -- MobileNet V2 produces 1024-d embeddings
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### images Tabelle

```sql
CREATE TABLE images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pigeon_id UUID REFERENCES pigeons(id) ON DELETE CASCADE,
    sighting_id UUID,
    file_path VARCHAR(500) NOT NULL,  -- Relative path in /uploads
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    width INTEGER,
    height INTEGER,
    embedding vector(1024),
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## Mobile App Struktur

```
mobile/
├── src/
│   ├── navigation/
│   │   └── RootNavigator.tsx         # Stack + Tab Navigator
│   ├── screens/
│   │   ├── home/
│   │   ├── scan/
│   │   ├── pigeons/
│   │   └── settings/
│   ├── components/
│   │   ├── atoms/                    # Buttons, Text, Input
│   │   ├── molecules/                # Cards, Form inputs
│   │   └── organisms/                # Camera, Lists
│   ├── services/
│   │   ├── api/                      # Axios client
│   │   └── queryClient.ts            # React Query setup
│   ├── stores/
│   │   ├── appStore.ts
│   │   ├── scanStore.ts
│   │   └── settingsStore.ts
│   └── types/
│       └── index.ts
├── App.tsx                           # Root App Component
├── app.json                          # Expo Configuration (SDK 52)
└── eas.json                          # EAS Build Konfiguration
```

---

## API-Endpunkte

| Endpoint | Methode | Zweck |
|----------|---------|-------|
| `/api/pigeons` | POST | Taube mit Photo registrieren (Base64) |
| `/api/pigeons/:id` | GET | Taube abrufen |
| `/api/pigeons` | GET | Tauben-Liste (paginiert) |
| `/api/images/match` | POST | Photo-Matching (Base64) |
| `/api/sightings` | POST | Sichtung erstellen |
| `/health` | GET | Health-Check |

### Request Format (Base64)

```typescript
// POST /api/pigeons
{
  "name": "Rudi Rothen",
  "photo": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAA...",
  "description": "Roter Ring am linken Fuß",
  "location": { "lat": 52.52, "lng": 13.405, "name": "Berlin" }
}

// POST /api/images/match
{
  "photo": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAA...",
  "threshold": 0.80
}
```

---

## Sicherheit

### Implementiert

- ✅ HTTPS-only (kein cleartext)
- ✅ CORS vom Backend
- ✅ Security Headers (Helmet)
- ✅ Request-Timeouts (Axios)
- ✅ Input-Validierung
- ✅ MMKV verschlüsselt (optional)

### Nicht implementiert (offene API)

- ❌ Authentifizierung
- ❌ API-Keys
- ❌ Rate-Limiting

**Empfohlen für Produktion:**
- JWT-Authentifizierung hinzufügen
- Rate-Limiting implementieren
- API-Keys für mobile App

---

**Zurück zur [Hauptdokumentation](../README.md)**

*Aktualisiert: React Native 0.76 + Expo SDK 52, MobileNet-V2, kein Auth*
