# Architektur

Übersicht über die Systemarchitektur des KI Tauben Scanners.

---

## Tech Stack

### Frontend (React Native + Expo)

| Technologie | Zweck | Version |
|-------------|-------|---------|
| **React Native** | Native Mobile UI | 0.72+ |
| **Expo SDK** | Development & Build Platform | 51 |
| **TypeScript** | Typisierung | 5.9 |
| **React Navigation v7** | Navigation | ^7.0 |
| **React Native Paper** | Material Design 3 | ^5.x |
| **Zustand** | State Management | ^4.x |
| **React Query** | Server-State & Caching | ^5.x |
| **Axios** | HTTP Client | ^1.x |
| **MMKV** | Lokale Persistenz | ^2.x |

### Backend (Node.js + Express)

| Technologie | Zweck |
|-------------|-------|
| **Express.js 5** | Web-Framework |
| **TypeScript 5.9** | Typisierung |
| **MobileNet-V3** | Server-side Feature Extraction |
| **TensorFlow.js** | ML Runtime |

### Navigation Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Tab Navigator                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Scan   │  │ Pigeons  │  │  History │  │ Settings │   │
│  │   Tab    │◀─┤   Tab    │  │   Tab    │  │   Tab    │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │             │             │             │          │
│       ▼             ▼             ▼             ▼          │
│  ┌──────────┐  ┌──────────┐  ╔══════════╗  ┌──────────┐   │
│  │ Scan     │  │ Pigeons  │  ║ History  ║  │ Settings │   │
│  │ Screen   │  │ Screen   │  ║ Screen   ║  │ Screen   │   │
│  └────┬─────┘  └────┬─────┘  ╚══════════╝  └──────────┘   │
│       │             │                                      │
│       ▼             ▼                                      │
│  ┌──────────┐  ╔══════════════╗                            │
│  │ Result   │  ║ Pigeon       ║                            │
│  │ Screen   │  ║ Details      ║                            │
│  └──────────┘  ╚══════════════╝                            │
│                                                                 │
└─────────────────────────────────────────────────────────────┘

Legende: ═══ Stack.Navigator()  ─── Tab.Screen
```

---

## Architektur-Wechsel: Capacitor → React Native

### Früher: Capacitor (WebView)

```
Frontend (Capacitor WebView) ──▶ Photo ──▶ POST /api/images/match
```

- Hybrid-App im WebView Container
- Web-basierte UI (React + Vite)
- Native APIs via Capacitor Plugins
- Gradlew/Android Studio Builds

### Jetzt: React Native + Expo

```
Frontend (React Native + Expo) ──▶ Photo ──▶ POST /api/images/match
```

- Native UI Components (kein WebView)
- Expo SDK für native Features (Camera, Location)
- Material Design 3 (React Native Paper)
- EAS Build für Cloud-Builds
- OTA Updates via EAS Update

---

## Komponenten

### Frontend (React Native + Expo)

**Aufgaben:**
- Kamera-Zugriff via `expo-camera`
- Photo-Capture für Upload
- API-Requests mit Axios & React Query
- State Management via Zustand
- Lokale Persistenz via MMKV
- Navigation via React Navigation v7
- Material Design 3 UI mit React Native Paper

**Key Technologies:**
- React Native 0.72+
- Expo SDK 51
- React Navigation v7
- React Native Paper v5
- Zustand
- React Query
- Axios
- MMKV

**State Flow:**

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   React      │◀────│   Zustand    │◀────│     UI       │
│   Native     │     │   Stores     │     │  Components  │
│   Screen     │     │              │     │              │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │
       │                    │                    │
       ▼                    ▼                    │
┌──────────────┐     ┌──────────────┐            │
│   React      │     │     MMKV     │────────────┘
│   Query      │────▶│   Persistenz │
│   (API)      │     └──────────────┘
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Backend    │
│   API        │
└──────────────┘
```

**Navigation Architecture:**

```typescript
// Bottom Tab Navigator (Haupt-Navigation)
const Tab = createBottomTabNavigator();

// Tab Screens:
// - ScanTab (Stack)
// - PigeonsTab (Stack)
// - HistoryTab (Stack)
// - SettingsTab (Stack)

// Jeder Tab hat einen eigenen Stack Navigator:
// Scan Stack: ScanScreen → ResultScreen → RegisterScreen
// Pigeons Stack: PigeonsScreen → PigeonDetailScreen → AddSightingScreen
// History Stack: HistoryScreen → DetailScreen
// Settings Stack: SettingsScreen → ApiConfigScreen → AboutScreen
```

### Backend (Express.js)

**Aufgaben:**
- Photo-Empfang (FormData multipart)
- Embedding-Extraktion (MobileNet-V3)
- Ähnlichkeitssuche (pgvector)
- CORS-Regelung

**Key Technologies:**
- Express.js 5
- TypeScript 5.9
- MobileNet-V3 (TensorFlow.js)
- pg 8 (PostgreSQL)
- Multer (File Upload)

---

## State Management

### Zustand Stores

```typescript
// AppStore - Globale App-Einstellungen
interface AppState {
  theme: 'light' | 'dark' | 'system';
  isOnline: boolean;
  language: string;
  onboardingCompleted: boolean;
}

// ScanStore - Scan-Workflow State
interface ScanState {
  status: 'idle' | 'capturing' | 'uploading' | 'processing' | 'completed' | 'error';
  capturedPhoto: string | null;
  result: ScanResult | null;
  scanHistory: ScanResult[];
}

// SettingsStore - User & API Settings
interface SettingsState {
  apiUrl: string;
  apiKey: string | null;
  matchThreshold: number;
  debugMode: boolean;
}
```

### React Query Integration

```typescript
// API Queries mit Caching
const { data: pigeons } = useQuery({
  queryKey: ['pigeons'],
  queryFn: fetchPigeons,
  staleTime: 5 * 60 * 1000, // 5 Minuten
});

// Mutations
const mutation = useMutation({
  mutationFn: uploadPhoto,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['pigeons'] });
  },
});
```

---

## Datenfluss

### Photo-Registrierung

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Camera  │────▶│  FormData │────▶│ Backend  │────▶│  MinIO   │
│  Capture │     │  (Axios) │     │  Upload  │     │ Storage  │
└──────────┘     └──────────┘     └────┬─────┘     └──────────┘
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
│  Camera  │────▶│  FormData │────▶│ Backend  │────▶│ MobileNet│
│  Capture │     │  (Axios) │     │  Upload  │     │ Embedding│
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

### Frontend API Client

```typescript
// axios instance
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.tauben-scanner.de',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Request Interceptor für Auth
api.interceptors.request.use((config) => {
  const apiKey = useSettingsStore.getState().apiKey;
  if (apiKey) {
    config.headers.Authorization = `Bearer ${apiKey}`;
  }
  return config;
});

// Bild-Upload mit FormData
export const uploadImage = async (uri: string, name: string) => {
  const formData = new FormData();
  formData.append('photo', {
    uri,
    name,
    type: 'image/jpeg',
  });
  
  const { data } = await api.post('/api/images/match', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  
  return data;
};
```

---

## Mobile App Struktur

```
frontend/
├── src/
│   ├── navigation/
│   │   └── TabNavigator.tsx          # Bottom Tab Navigator
│   ├── screens/
│   │   ├── scan/
│   │   │   ├── ScanScreen.tsx
│   │   │   └── ResultScreen.tsx
│   │   ├── pigeons/
│   │   │   ├── PigeonsScreen.tsx
│   │   │   └── PigeonDetailScreen.tsx
│   │   └── settings/
│   │       └── SettingsScreen.tsx
│   ├── components/
│   │   ├── ui/                        # Reusable UI components
│   │   │   ├── PaperCard.tsx
│   │   │   └── PaperButton.tsx
│   │   └── camera/
│   │       └── CameraView.tsx        # Expo Camera Wrapper
│   ├── stores/
│   │   ├── appStore.ts
│   │   ├── scanStore.ts
│   │   └── settingsStore.ts
│   ├── hooks/
│   │   ├── usePigeons.ts             # React Query hooks
│   │   ├── useScanImage.ts
│   │   └── useSightings.ts
│   ├── services/
│   │   └── api.ts                    # Axios setup
│   └── types/
│       └── index.ts
├── App.tsx                           # Root App Component
├── app.json                          # Expo Configuration
└── state_management.md               # State Management Docs
```

---

## Build-System

### EAS Build

```bash
# Login
npx expo login

# Build für interne Preview
 eas build --platform android --profile preview

# Production Build
 eas build --platform android --profile production

# OTA Update
eas update --channel production --message "Update"
```

### EAS Konfiguration (eas.json)

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "android": { "buildType": "apk" }
    },
    "production": {
      "distribution": "store"
    }
  }
}
```

---

## Deployment

### Docker-Compose (Backend)

```yaml
services:
  postgres:
    image: ankane/pgvector:latest
    
  api:
    build: ./backend
    environment:
      - NODE_ENV=production

  minio:
    image: minio/minio:latest
```

### CORS-Hinweis

⚠️ **Backend regelt CORS allein.**

- Erlaubte Origins in `CORS_ORIGINS` konfigurieren
- React Native App verwendet oft `null` Origin
- Credentials unterstützt

---

## Sicherheit

### Implementiert

- ✅ HTTPS-only (kein cleartext)
- ✅ CORS vom Backend
- ✅ Security Headers (Helmet)
- ✅ Request-Timeouts (Axios)
- ✅ Input-Validierung
- ✅ MMKV verschlüsselt (optional)

### Empfohlen

- JWT-Authentifizierung
- Rate-Limiting
- API-Keys
- Bild-Validierung (Größe, Format)

---

**Zurück zur [Hauptdokumentation](../README.md)**

*Letzte Aktualisierung: React Native + Expo SDK 51 Migration*
