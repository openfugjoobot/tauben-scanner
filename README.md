# 🕊️ KI Tauben Scanner

> Eine mobile App zur Identifizierung und Verwaltung von Stadttauben per KI-gestützter Bilderkennung.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/Docker-ready-blue.svg)](https://www.docker.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791.svg)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-3178C6.svg)](https://www.typescriptlang.org/)
[![Expo](https://img.shields.io/badge/Expo-SDK%2052-000020.svg)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.76-61dafb.svg)](https://reactnative.dev/)

---

## 📋 Inhaltsverzeichnis

- [Überblick](#-überblick)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architektur](#-architektur)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [API Dokumentation](#-api-dokumentation)
- [Konfiguration](#-konfiguration)
- [Mobile App](#-mobile-app)
- [Deployment](#-deployment)
- [Mitmachen](#-mitmachen)
- [Lizenz](#-lizenz)

---

## 🎯 Überblick

Der **KI Tauben Scanner** ist eine mobile Anwendung, die es ermöglicht, Stadttauben per Smartphone-Kamera zu fotografieren und mit Hilfe von Machine Learning zu identifizieren.

**Architektur-Überblick:**
- React Native App sendet Fotos an Backend
- Backend extrahiert Embeddings server-seitig (MobileNet-V2)
- PostgreSQL mit pgvector speichert 1024-dimensionale Vektoren
- Cosine Similarity für Bild-Matching

**Anwendungsfälle:**
- 🏛️ **Kommunen**: Verwaltung von Stadttaubenpopulationen
- 🕊️ **Taubenvereine**: Registrierung und Nachverfolgung von Rassetauben
- 🔬 **Forschung**: Verhaltensstudien und Populationsdynamik
- 💚 **Tierschutz**: Erfassung verletzter oder kranker Tiere

---

## ✨ Features

### 🔍 Bilderkennung
- **KI-basierte Identifikation** mit MobileNet-V2
- **Server-side Embedding-Extraktion** (Backend verarbeitet Fotos)
- **Cosine Similarity Matching** mit anpassbarem Threshold (0.50-0.99)
- **Mehrwinkelsupport** durch Speicherung mehrerer Bilder pro Taube

### 📱 Mobile App
- **Native Cross-Platform App** via React Native + Expo SDK 52
- **Kamera-Zugriff** mit Bilderfassung (expo-camera)
- **Material Design 3** UI mit React Native Paper
- **React Navigation v7** für Screen-Navigation
- **Offline-Support** mit Zustand + MMKV Persistenz
- **React Query** für API-State-Management

### 🗄️ Datenbank & API
- **PostgreSQL 15+** mit pgvector-Extension
- **HNSW-Index** für schnelle Vektor-Suche
- **RESTful API** mit Express.js
- **CORS** vom Backend geregelt
- **Axios** für HTTP-Requests mit Timeout-Handling

### 🗺️ Standortverwaltung
- **GPS-Tracking** bei Sichtungen (expo-location)
- **Geografische Suche**
- **Standort-basierte Historie**

### 📝 Sichtungsprotokoll
- **Zeitgestempelte Sichtungen**
- **Zustandsbewertung** (gesund, verletzt, unbekannt)
- **Notizfunktion** für Beobachtungen**

### 🔧 Build-System
- **EAS (Expo Application Services)**: Cloud-Builds für Android & iOS
- **GitHub Actions**: Automatische Preview-Updates auf PRs
- **React Query DevTools**: Für Entwicklung und Debugging
- **Metro Bundler**: Für lokale Entwicklung

---

## 🛠️ Tech Stack

### Frontend (Mobile App)
| Technologie | Zweck |
|-------------|-------|
| **React Native 0.76** | Native Mobile UI |
| **Expo SDK 52** | Development & Build Platform |
| **TypeScript 5.9** | Typisierung |
| **React Navigation v7** | Screen Navigation |
| **React Native Paper v5** | Material Design 3 Komponenten |
| **Zustand** | Global State Management |
| **React Query** | Server-State & Caching |
| **MMKV** | Lokale Datenspeicherung |
| **Axios** | HTTP Client |

### Backend (API Server)
| Technologie | Zweck |
|-------------|-------|
| **Node.js** | Runtime |
| **Express.js 5** | Web-Framework |
| **TypeScript 5.9** | Typisierung |
| **MobileNet-V2** | Server-side Feature Extraction |
| **pg 8** | PostgreSQL Client |
| **Helmet** | Security Headers |
| **CORS** | Cross-Origin Requests (Backend-gesteuert) |
| **Morgan** | HTTP Logging |

### Datenbank & Storage
| Technologie | Zweck |
|-------------|-------|
| **PostgreSQL 15+** | Primäre Datenbank |
| **pgvector** | Vektor-Erweiterung |
| **HNSW** | Approximate Nearest Neighbor Search |
| **Local Filesystem** | Bild-Speicher in `/uploads` |
| **MinIO** | S3-kompatibel (optional, nicht aktiv) |

### DevOps & Deployment
| Technologie | Zweck |
|-------------|-------|
| **Docker** | Containerisierung |
| **Docker Compose** | Multi-Service Orchestration |
| **Nginx Proxy Manager** | Reverse Proxy & SSL |
| **EAS Build** | Cloud-Builds für Mobile Apps |
| **EAS Update** | OTA Updates für Expo |

---

## 🏗️ Architektur

```mermaid
graph TB
    subgraph "React Native App"
        A[📱 Expo App] --> B[📷 Camera Component]
        B --> C[FormData Photo Upload]
        C --> D[POST /api/images/match]
        A --> E[Zustand Stores]
        A --> F[React Query]
    end
    
    subgraph "Backend API"
        G[🌐 Express.js API] --> H[MobileNet-V2 Embedding]
        H --> I[1024-d Vector]
        G --> J[/api/pigeons\]
        G --> K[/api/sightings\]
        G --> L[/health\]
    end
    
    subgraph "Datenbank"
        M[🐘 PostgreSQL + pgvector]
        N[hnsw_index<br/>vector_cosine_ops]
        O[Tables:<br/>pigeons, images, sightings]
    end
    
    subgraph "Storage"
        P[📁 /uploads Volume]
        Q[Image Files]
    end
    
    D -->|Photo Upload| G
    F -->|API Calls| G
    I -->|Similarity Search| M
    J --> K --> M
    M --> N
    M --> O
    G --> P
    P --> Q
```

### Datenfluss beim Matching (React Native)

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Camera Capture │────▶│  FormData Photo │────▶│  POST /api/     │
│  (expo-camera)  │     │  (Axios)        │     │  images/match   │
└─────────────────┘     └──────────────────┘     └────────┬────────┘
                                                          │
                                                          ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Match-         │◀────│  Cosine Similar. │◀────│  MobileNet-V2   │
│  Ergebnis       │     │  1 - (vec<=>q)  │     │  (Backend)      │
│  (Navigation)   │     └──────────────────┘     └─────────────────┘
└─────────────────┘                                          │
                                                           ▼
                                                  ┌─────────────────┐
                                                  │  pgvector       │
                                                  │  HNSW Index     │
                                                  └─────────────────┘
```

---

## 🚀 Quick Start

### Voraussetzungen
- Docker & Docker Compose
- Node.js 20+ (für lokale Entwicklung)
- Android Studio (für lokale Android Builds)
- Expo Account (für EAS Builds)

### Backend in 5 Minuten starten

```bash
# 1. Repository klonen
git clone https://github.com/openfugjoobot/tauben-scanner.git
cd tauben-scanner

# 2. Umgebungsvariablen setzen
cp .env.example .env
# Bearbeite .env und setze Passwörter

# 3. Mit Docker starten
docker-compose up -d

# 4. Gesundheit prüfen
curl http://localhost:3000/health
```

**Ausgabe:**
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

### Mobile App starten

```bash
# 1. Mobile dependencies installieren
cd mobile
npm install

# 2. Expo Development Server starten
npx expo start

# 3. Expo Go App auf dem Handy öffnen
# QR-Code scannen oder i für iOS Simulator / a für Android Emulator
```

---

## 📦 Installation

### Docker Deployment (empfohlen für Backend)

```bash
# Alle Services starten
docker-compose up -d

# Logs anzeigen
docker-compose logs -f api
docker-compose logs -f postgres

# Alle Services stoppen
docker-compose down

# Mit Volumes löschen (Achtung: Daten gehen verloren!)
docker-compose down -v
```

### Mobile App Entwicklung

```bash
# Expo CLI installieren (global)
npm install -g @expo/cli

# Frontend dependencies installieren
cd frontend
npm install

# iOS Simulator (nur macOS)
npx expo run:ios

# Android Emulator
npx expo run:android

# Expo Go (einfachste Methode)
npx expo start
```

### Ports

| Service | Port | Beschreibung |
|---------|------|--------------|
| API | 3000 | REST API Backend |
| PostgreSQL | 5432 | Datenbank |
| Metro Bundler | 8081 | React Native Dev Server |

*Hinweis: MinIO Ports (9000/9001) sind konfiguriert aber nicht aktiv – Bilder werden in `/uploads` gespeichert.*

---

## 🔌 API Dokumentation

Die vollständige API-Dokumentation findest du unter [`docs/API.md`](docs/API.md).

### Endpoints im Überblick

| Methode | Endpoint | Beschreibung |
|---------|----------|--------------|
| `POST` | `/api/pigeons` | Neue Taube erstellen (mit Photo) |
| `GET` | `/api/pigeons/:id` | Taube mit Sichtungen abrufen |
| `GET` | `/api/pigeons` | Tauben-Liste (paginiert) |
| `POST` | `/api/images/match` | Bild-Matching (Photo Upload) |
| `POST` | `/api/sightings` | Neue Sichtung erstellen |
| `GET` | `/api/pigeons/:id/sightings` | Sichtungen einer Taube |
| `GET` | `/health` | Health Check |

### Frontend API Client (Axios)

```typescript
// Beispiel mit axios
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.tauben-scanner.de',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Bild-Matching mit FormData
const matchImage = async (imageUri: string) => {
  const formData = new FormData();
  formData.append('photo', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'scan.jpg',
  });
  
  const response = await apiClient.post('/api/images/match', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};
```

---

## ⚙️ Konfiguration

### Umgebungsvariablen (.env)

```bash
# Server
PORT=3000
NODE_ENV=production

# Datenbank
DATABASE_URL=postgresql://tauben:password@postgres:5432/tauben_scanner
DB_PASSWORD=secure_test_password_123

# CORS
CORS_ORIGINS=https://tauben-scanner.fugjoo.duckdns.org
```

### EAS Build Konfiguration

**eas.json:**
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
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "distribution": "store"
    }
  }
}
```

### Wichtige Einstellungen

| Variable | Default | Beschreibung |
|----------|---------|--------------|
| `PORT` | 3000 | API Server Port |
| `NODE_ENV` | development | Umgebung (development/production) |
| `CORS_ORIGINS` | - | Erlaubte Origins (kommasepariert) |
| `threshold` | 0.80 | Matching-Schwelle (0.50-0.99) |

---

## 📱 Mobile App

Die Mobile App ist eine **React Native + Expo** Anwendung. Detaillierte Anleitungen findest du unter:
- [`mobile/README.md`](mobile/README.md) - Mobile App Setup
- [`docs/MOBILE.md`](docs/MOBILE.md) - Mobile Development
- [`mobile/STATE_MANAGEMENT.md`](mobile/STATE_MANAGEMENT.md) - State Management Docs

### Navigation

```typescript
// React Navigation v7 - Tab + Stack Navigator
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Screens: Scan, Pigeons, History, Settings
// Stack für: PigeonDetails, ScanResult, AddSighting
```

### State Management

- **Zustand**: App-Store, Scan-Store, Settings-Store
- **React Query**: API-Queries, Caching, Invalidierung
- **MMKV**: Persistenter lokaler Storage

### Berechtigungen

**app.json:**
```json
{
  "expo": {
    "plugins": [
      [
        "expo-camera",
        {
          "cameraPermission": "Für Tauben-Scans benötigt"
        }
      ],
      [
        "expo-location",
        {
          "locationPermission": "Für Standort-Sichtungen benötigt"
        }
      ]
    ]
  }
}
```

### EAS Build

```bash
# Login bei Expo
npx expo login

# Build starten (Preview APK)
eas build --platform android --profile preview

# iOS Build
eas build --platform ios --profile production

# OTA Update veröffentlichen
eas update --channel production --message "Bugfixes"
```

---

## 🚢 Deployment

Für produktive Deployments empfehlen wir:

1. **Docker Compose** mit SSL-Zertifikaten
2. **Nginx Proxy Manager** als Reverse Proxy
3. **Automatische Backups** der PostgreSQL-Datenbank
4. **EAS Build** für Mobile App Distribution
5. **EAS Update** für OTA Updates

Siehe [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) für:
- SSL-Konfiguration
- CORS-Setup
- EAS Build & Update
- Backup-Strategie
- Troubleshooting

Siehe [`docs/SETUP.md`](docs/SETUP.md) für:
- Development Setup
- Expo Go Testing
- Simulator/Emulator Setup

---

## 🤝 Mitmachen

Wir freuen uns über Beiträge! So kannst du helfen:

1. **Fork** das Repository
2. **Branch** erstellen: `git checkout -b feature/neues-feature`
3. **Commit**: `git commit -am 'feat: Neues Feature'`
4. **Push**: `git push origin feature/neues-feature`
5. **Pull Request** erstellen

### Commit Conventions

- `feat:` Neue Features
- `fix:` Bugfixes
- `docs:` Dokumentation
- `refactor:` Code-Refactoring
- `test:` Tests
- `chore:` Wartung

### Development Setup

```bash
# Backend im Dev-Modus
npm run dev

# Frontend im Dev-Modus (Expo)
npx expo start

# Tests ausführen
npm test
```

---

## 📜 Lizenz

MIT License - siehe [LICENSE](LICENSE) für Details.

---

## 🙏 Danksagungen

- **MobileNet-V2** - Für effiziente Feature Extraction
- **pgvector** - Für Vektor-Suche in PostgreSQL
- **Expo** - Für React Native Entwicklung & Build Process
- **React Navigation** - Für Navigation in der App
- **TensorFlow.js** - Für serverseitiges ML

---

## 📞 Support

Bei Problemen:
1. Dokumentation lesen: [`docs/`](docs/)
2. GitHub Issues prüfen: [github.com/openfugjoobot/tauben-scanner/issues](https://github.com/openfugjoobot/tauben-scanner/issues)
3. Neue Issue erstellen mit Beschreibung und Logs

---

**Made with ❤️ by OpenFugjooBot**

*Migration complete: Capacitor → React Native + Expo SDK 52*
