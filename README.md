# 🕊️ KI Tauben Scanner

> Mobile App zur Identifizierung und Verwaltung von Stadttauben per KI-gestützter Bilderkennung.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/Docker-ready-blue.svg)](https://www.docker.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791.svg)](https://www.postgresql.org/)
[![Expo](https://img.shields.io/badge/Expo-SDK%2052-000020.svg)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.76-61dafb.svg)](https://reactnative.dev/)

---

## 📋 Inhaltsverzeichnis

- [Überblick](#-überblick)
- [Features](#-features)
- [Quick Start](#-quick-start)
- [Dokumentation](#-dokumentation)
- [Tech Stack](#-tech-stack)
- [Mitmachen](#-mitmachen)
- [Lizenz](#-lizenz)

---

## 🎯 Überblick

Der **KI Tauben Scanner** ist eine mobile Anwendung, die Stadttauben per Smartphone-Kamera fotografiert und mit Machine Learning identifiziert.

**Architektur:**
- **Mobile App:** React Native + Expo SDK 52
- **Backend:** Node.js + Express + TensorFlow.js (MobileNet-V2)
- **Datenbank:** PostgreSQL + pgvector für 1024-dimensionale Embeddings
- **Storage:** Bilder in `/uploads` mit statischem Serving

**Anwendungsfälle:**
- 🏛️ **Kommunen:** Verwaltung von Stadttaubenpopulationen
- 🕊️ **Taubenvereine:** Registrierung und Nachverfolgung
- 🔬 **Forschung:** Verhaltensstudien
- 💚 **Tierschutz:** Erfassung verletzter Tiere

---

## ✨ Features

### 🔍 Bilderkennung
- **KI-basierte Identifikation** mit MobileNet-V2
- **Server-side Embedding-Extraktion**
- **Cosine Similarity Matching** (Threshold 0.50-0.99)
- **Mehrwinkelsupport** durch Speicherung mehrerer Bilder

### 📱 Mobile App
- **React Native + Expo SDK 52** (Pure Expo, kein Capacitor)
- **Kamera-Zugriff** mit Bilderfassung
- **Material Design 3** UI
- **Offline-Support** mit Zustand + MMKV
- **React Query** für API-State

### 🗄️ Backend
- **PostgreSQL 15+** mit pgvector
- **HNSW-Index** für schnelle Vektor-Suche
- **RESTful API** mit Express.js
- **CORS** vom Backend geregelt
- **Automatische Builds** via GitHub Actions

---

## 🚀 Quick Start

### Voraussetzungen
- Docker & Docker Compose
- Node.js 20+
- Expo Account (für EAS Builds)

### Backend starten

```bash
# Repository klonen
git clone https://github.com/openfugjoobot/tauben-scanner.git
cd tauben-scanner

# Umgebungsvariablen setzen
cp .env.example .env
# .env bearbeiten

# Mit Docker starten
docker-compose up -d

# Gesundheit prüfen
curl http://localhost:3000/health
```

### Mobile App starten

```bash
cd mobile
npm install
npx expo start
# QR-Code mit Expo Go scannen
```

---

## 📚 Dokumentation

| Dokument | Inhalt |
|----------|--------|
| [docs/API.md](docs/API.md) | REST API Referenz |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Systemarchitektur & Datenfluss |
| [docs/DATABASE.md](docs/DATABASE.md) | PostgreSQL Schema & Tabellen |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Produktions-Deployment & SSL |
| [docs/MOBILE.md](docs/MOBILE.md) | Mobile App Entwicklung |
| [docs/SETUP.md](docs/SETUP.md) | Entwicklungs-Setup |
| [docs/BACKUP.md](docs/BACKUP.md) | Backup-Strategie |
| [docs/CHANGELOG.md](docs/CHANGELOG.md) | Änderungshistorie |

---

## 🛠️ Tech Stack

### Mobile App
| Technologie | Version | Zweck |
|-------------|---------|-------|
| React Native | 0.76 | Native UI |
| Expo SDK | 52 | Development & Builds |
| TypeScript | 5.9 | Typisierung |
| React Navigation | v7 | Navigation |
| React Native Paper | v5 | Material Design 3 |
| Zustand | ^5.x | State Management |
| React Query | ^5.x | Server-State |

### Backend
| Technologie | Zweck |
|-------------|-------|
| Node.js + Express 5 | API Server |
| TensorFlow.js | ML Runtime |
| MobileNet-V2 | Feature Extraction |
| PostgreSQL + pgvector | Datenbank & Embeddings |

### DevOps
| Technologie | Zweck |
|-------------|-------|
| Docker Compose | Multi-Service |
| GitHub Actions | CI/CD |
| Nginx Proxy Manager | Reverse Proxy & SSL |

---

## 🏗️ Architektur-Überblick

```
┌──────────────────────────────────────────────────────────────┐
│                    Mobile App (Expo)                         │
│  📷 Camera → 📤 Upload → 📊 Match Result                    │
└──────────────────────────┬───────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│                    Backend API (Node.js)                     │
│  🧠 MobileNet-V2 → 📊 1024-d Embedding → 🔍 pgvector          │
│  💾 Images → /uploads (Docker volume)                        │
└──────────────────────────────────────────────────────────────┘
```

---

## 🤝 Mitmachen

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

---

## 📜 Lizenz

MIT License - siehe [LICENSE](LICENSE) für Details.

---

**Made with ❤️ by OpenFugjooBot**

*Migration: Capacitor → Pure Expo SDK 52* 🦞
