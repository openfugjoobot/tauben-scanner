# 🕊️ KI Tauben Scanner

> Eine mobile App zur Identifizierung und Verwaltung von Stadttauben per KI-gestützter Bilderkennung.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/Docker-ready-blue.svg)](https://www.docker.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791.svg)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-3178C6.svg)](https://www.typescriptlang.org/)

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
- Frontend sendet Fotos an Backend
- Backend extrahiert Embeddings server-seitig (MobileNet-V3)
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
- **KI-basierte Identifikation** mit MobileNet-V3
- **Server-side Embedding-Extraktion** (Backend verarbeitet Fotos)
- **Cosine Similarity Matching** mit anpassbarem Threshold (0.50-0.99)
- **Mehrwinkelsupport** durch Speicherung mehrerer Bilder pro Taube

### 📱 Mobile App
- **Native Android-App** via Capacitor
- **Kamera-Zugriff** mit Bilderfassung
- **Debug-UI**: UploadProgress, NetworkDebugPanel
- **Timeout-Handling** mit AbortController (30s Standard)

### 🗄️ Datenbank & API
- **PostgreSQL 15+** mit pgvector-Extension
- **HNSW-Index** für schnelle Vektor-Suche
- **RESTful API** mit Express.js
- **CORS** vom Backend geregelt (reflect origin für Android WebView)

### 🗺️ Standortverwaltung
- **GPS-Tracking** bei Sichtungen
- **Geografische Suche**
- **Standort-basierte Historie**

### 📝 Sichtungsprotokoll
- **Zeitgestempelte Sichtungen**
- **Zustandsbewertung** (gesund, verletzt, unbekannt)
- **Notizfunktion** für Beobachtungen

### 🔧 Build-System
- **GitHub Actions**: Automatische Debug + Release APK Builds
- **Release**: webContentsDebuggingEnabled=false, optimiert
- **Debug**: webContentsDebuggingEnabled=true

---

## 🛠️ Tech Stack

### Frontend (Mobile App)
| Technologie | Zweck |
|-------------|-------|
| **React 19** | UI-Framework |
| **TypeScript 5.9** | Typisierung |
| **Vite 7** | Build-Tool |
| **Capacitor 8** | Native Mobile Wrapper |

### Backend (API Server)
| Technologie | Zweck |
|-------------|-------|
| **Node.js** | Runtime |
| **Express.js 5** | Web-Framework |
| **TypeScript 5.9** | Typisierung |
| **MobileNet-V3** | Server-side Feature Extraction |
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
| **MinIO** | S3-kompatibler Object Storage |

### DevOps & Deployment
| Technologie | Zweck |
|-------------|-------|
| **Docker** | Containerisierung |
| **Docker Compose** | Multi-Service Orchestration |
| **Nginx Proxy Manager** | Reverse Proxy & SSL |
| **GitHub Actions** | CI/CD für APK Builds |

---

## 🏗️ Architektur

```mermaid
graph TB
    subgraph "Mobile App"
        A[📱 Capacitor App] --> B[📷 Camera Component]
        B --> C[Base64 Photo]
        C --> D[POST /api/images/match]
    end
    
    subgraph "Backend API"
        E[🌐 Express.js API] --> F[MobileNet-V3 Embedding]
        F --> G[1024-d Vector]
        E --> H[/api/pigeons\]
        E --> I[/api/sightings\]
        E --> J[/health\]
    end
    
    subgraph "Datenbank"
        K[🐘 PostgreSQL + pgvector]
        L[hnsw_index<br/>vector_cosine_ops]
        M[Tables:<br/>pigeons, images, sightings]
    end
    
    subgraph "Storage"
        N[📦 MinIO S3]
        O[Image Files]
    end
    
    D -->|Photo Upload| E
    G -->|Similarity Search| K
    H --> K
    I --> K
    K --> L
    K --> M
    E --> N
    N --> O
```

### Datenfluss beim Matching

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Nutzer macht  │────▶│  Base64 Photo    │────▶│  POST /api/     │
│    Foto         │     │  (Frontend)      │     │  images/match   │
└─────────────────┘     └──────────────────┘     └────────┬────────┘
                                                          │
                                                          ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Match-         │◀────│  Cosine Similar. │◀────│  MobileNet-V3   │
│  Ergebnis       │     │  1 - (vec<=>q)  │     │  (Backend)      │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                                          │
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
- Android Studio (für Mobile Build)

### In 5 Minuten loslegen

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

---

## 📦 Installation

### Docker Deployment (empfohlen)

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

### Manuelle Installation

```bash
# 1. PostgreSQL mit pgvector installieren
# Siehe: https://github.com/pgvector/pgvector

# 2. Backend einrichten
cd backend
npm install
npm run build
npm start

# 3. Frontend einrichten
cd ../frontend
npm install
npm run dev
```

### Ports

| Service | Port | Beschreibung |
|---------|------|--------------|
| API | 3000 | REST API Backend |
| PostgreSQL | 5432 | Datenbank |
| MinIO API | 9000 | Object Storage |
| MinIO Console | 9001 | Storage Web UI |

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

### Beispiel: Taube erstellen (NEU)

```bash
curl -X POST http://localhost:3000/api/pigeons \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rudi Rothen",
    "description": "Roter Ring am linken Fuß",
    "photo": "base64EncodedImageString...",
    "location": {
      "lat": 52.5200,
      "lng": 13.4050,
      "name": "Alexanderplatz, Berlin"
    },
    "is_public": true
  }'
```

### Beispiel: Bild-Matching (NEU)

```bash
curl -X POST http://localhost:3000/api/images/match \
  -H "Content-Type: application/json" \
  -d '{
    "photo": "base64EncodedImageString...",
    "threshold": 0.80,
    "location": {
      "lat": 52.52,
      "lng": 13.405
    }
  }'
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

# CORS (Backend regelt CORS allein - keine Nginx CORS Headers!)
CORS_ORIGINS=https://tauben-scanner.fugjoo.duckdns.org,capacitor://localhost

# MinIO Storage
MINIO_USER=minioadmin
MINIO_PASSWORD=minioadmin123
```

### CORS-Konfiguration

Das Backend regelt CORS allein. Nginx sollte KEINE CORS-Headers hinzufügen.

- Erlaubt: `null` Origin (Android Capacitor WebView)
- Reflect origin für bekannte Origins
- Credentials werden unterstützt

### Wichtige Einstellungen

| Variable | Default | Beschreibung |
|----------|---------|--------------|
| `PORT` | 3000 | API Server Port |
| `NODE_ENV` | development | Umgebung (development/production) |
| `CORS_ORIGINS` | - | Erlaubte Origins (kommasepariert) |
| `threshold` | 0.80 | Matching-Schwelle (0.50-0.99) |

---

## 📱 Mobile App

Die Mobile App wird mit Capacitor gebaut. Detaillierte Anleitungen findest du unter [`docs/MOBILE.md`](docs/MOBILE.md).

### Android Berechtigungen

```xml
<!-- AndroidManifest.xml -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

### Schnellstart (Android)

```bash
cd frontend

# Abhängigkeiten installieren
npm install

# Build für Android
npm run android
```

Dies öffnet Android Studio automatisch.

### GitHub Actions CI/CD

- **Automatische Builds** bei Push auf main/tags
- **Debug APK**: `app-debug.apk`
- **Release APK**: `app-release-unsigned.apk`
- Ablage als Artifacts und Release-Assets

---

## 🚢 Deployment

Für produktive Deployments empfehlen wir:

1. **Docker Compose** mit SSL-Zertifikaten
2. **Nginx Proxy Manager** als Reverse Proxy (keine CORS-Headers!)
3. **Automatische Backups** der PostgreSQL-Datenbank
4. **GitHub Actions** für APK-Builds

Siehe [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) für:
- SSL-Konfiguration
- CORS-Setup (Backend-only)
- Backup-Strategie
- Troubleshooting
- Performance-Optimierung

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

# Frontend im Dev-Modus
npm run dev

# Tests ausführen
npm test
```

---

## 📜 Lizenz

MIT License - siehe [LICENSE](LICENSE) für Details.

---

## 🙏 Danksagungen

- **MobileNet-V3** - Für effiziente Feature Extraction
- **pgvector** - Für Vektor-Suche in PostgreSQL
- **Capacitor** - Für native Mobile Apps
- **TensorFlow.js** - Für serverseitiges ML

---

## 📞 Support

Bei Problemen:
1. Dokumentation lesen: [`docs/`](docs/)
2. GitHub Issues prüfen: [github.com/openfugjoobot/tauben-scanner/issues](https://github.com/openfugjoobot/tauben-scanner/issues)
3. Neue Issue erstellen mit Beschreibung und Logs

---

**Made with ❤️ by OpenFugjooBot**
