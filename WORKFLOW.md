# Tauben Scanner - Workflow Guide

Entwicklungs- und Deployment-Workflow für das Tauben Scanner Projekt.

---

## Repository Struktur

```
tauben-scanner/
├── backend/              # Express.js API
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── frontend/            # React Native + Expo App
│   ├── src/
│   ├── App.tsx
│   ├── app.json         # Expo Konfiguration
│   ├── eas.json         # EAS Build Konfiguration
│   └── package.json
├── docker-compose.yml   # Backend Services
├── .env                 # Umgebungsvariablen
└── .github/
    └── workflows/
        └── eas-build.yml  # CI/CD für EAS
```

---

## Workflow Diagramm

```
Feature Branch
     │
     ▼
┌─────────────┐
│   Code      │
│   Push      │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   PR        │
│   Review    │
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐
│   Merge     │────▶│   EAS Build │
│   → main    │     │   (CI/CD)   │
└─────────────┘     └──────┬──────┘
                           │
            ┌──────────────┼──────────────┐
            ▼              ▼              ▼
      ┌──────────┐   ┌──────────┐  ┌──────────┐
      │ Preview  │   │ Prod     │  │ OTA      │
      │ APK      │   │ AAB/IPA│  │ Update   │
      └────┬─────┘   └────┬─────┘  └────┬─────┘
           │              │             │
      ┌────┴─────┐   ┌────┴─────┐  ┌────┴─────┐
      │ Internal │   │ Play     │  │ Channel  │
      │ Testing  │   │ Store    │  │ Update   │
      └──────────┘   └──────────┘  └──────────┘
```

---

## Entwicklungs-Workflow

### 1. Feature Branch erstellen

```bash
# Main aktualisieren
git checkout main
git pull origin main

# Feature Branch
git checkout -b feat/neue-feature

# Oder Bugfix
git checkout -b fix/bug-beschreibung
```

### 2. Backend-Entwicklung

```bash
# Im Projekt-Root
docker-compose up -d

# Code ändern...

# Tests
cd backend
npm test

# Container neu bilden bei Änderungen
docker-compose up -d --build api
```

### 3. Frontend-Entwicklung

```bash
cd frontend
npx expo start

# Expo Go QR-Code scannen

# Code ändern → Live Reload
```

### 4. Commit Konventionen

```
feat:  Neue Features
fix:   Bugfixes
docs:  Dokumentation
style: Formatierung (keine Code-Änderung)
refactor: Code-Refactoring
test:  Tests
chore: Wartung (Build, Deps, etc.)
```

**Beispiele:**
```bash
git commit -m "feat: Kamera-Overlay mit Fokus-Indikator"
git commit -m "fix: Timeout bei langsamer Verbindung"
git commit -m "docs: API-Endpunkte dokumentiert"
```

---

## Build-Workflow (EAS)

### EAS Build Prozess

```bash
# 1. Login
npx expo login

# 2. Build starten
eas build --platform android --profile preview

# 3. Download
# Link aus Dashboard kopieren oder:
eas build:list

# 4. Installieren
adb install app-preview.apk
```

### Build Profile

| Profile | Verwendung | Ausgabe |
|---------|------------|---------|
| `development` | Lokale Entwicklung | Dev Client |
| `preview` | Interne Tests | APK / Simulator |
| `production` | Store Release | AAB / IPA |

### Automatisierter Build

```bash
# Nach jedem Push auf main
git push origin main

# GitHub Actions → EAS Build
# → Download Link in PR/Issue
```

---

## Deployment-Workflow

### Backend Deployment

```bash
# Auf Server:
cd /opt/tauben-scanner

# Pull
git pull origin main

# Neu builden
docker-compose up -d --build

# Health Check
curl https://api.tauben-scanner.de/health
```

### Mobile App Deployment

**OTA Update (schnell):**
```bash
# Für kleine Bugfixes (keine native Änderungen)
cd frontend

git checkout main
git pull

# Update veröffentlichen
eas update --channel production --message "Fix: Kamera-Schwarzbild"
```

**Store Update (langsam, nativer Code):**
```bash
# Für native Änderungen (neue Module, SDK Update)
eas build --platform android --profile production

# Testen

# Submit
eas submit --platform android

# Google Play Review (~1-3 Tage)
```

---

## CI/CD Pipeline

### GitHub Actions Flow

```yaml
# .github/workflows/eas-build.yml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        
      - name: Setup EAS
        uses: expo/expo-github-action@v8
        
      - name: Install dependencies
        run: cd frontend && npm ci
        
      - name: Build EAS
        run: cd frontend && eas build --profile preview --platform android
        
      - name: Comment on PR
        # Download-Link posten
```

---

## Release Workflow

### Version Bump

```bash
# 1. Version in app.json bumpen
# "version": "1.0.1"

# 2. Commit
git add app.json
git commit -m "chore: Bump version to 1.0.1"

# 3. Tag erstellen
git tag -a v1.0.1 -m "Release v1.0.1"
git push origin v1.0.1

# 4. EAS Build
eas build --profile production

# 5. Submit
eas submit --platform android
```

### Checkliste vor Release

- [ ] Tests passen
- [ ] Version gebumpt
- [ ] Changelog aktualisiert
- [ ] app.json geprüft
- [ ] EAS Build erfolgreich
- [ ] APK getestet
- [ ] Store Screenshots aktuell
- [ ] Release Notes geschrieben

---

## Git Branching

```
main                    ●───────────────────────────────────
                         \
feature/xyz               ●──────●──────●
                                           \
PR: Merge feature/xyz ─────────────────────▶

hotfix/critical           ●──●
                               \
PR: Merge hotfix ───────────────────────────▶
```

### Branch Namen

- `feat/` - Neue Features
- `fix/` - Bugfixes
- `docs/` - Dokumentation
- `refactor/` - Refactoring
- `test/` - Tests
- `hotfix/` - Kritische Fixes für main

---

## Update Workflow

**Kleine Updates (JavaScript/Assets only):**
```
eas update --channel production
→ Sofort live (kein Store Review)
```

**Native Updates (Android/iOS):**
```
eas build --profile production
→ Store Review
→ Automatic Update
```

---

## Monitoring

### Backend

```bash
# Logs
docker logs tauben-api --tail 100 -f

# Health
curl https://api.tauben-scanner.de/health
```

### Mobile

```bash
# EAS Dashboard
eas builds:list
eas updates:list
```

---

## Troubleshooting

| Problem | Workflow |
|---------|----------|
| "Build failed" | EAS Dashboard Logs checken |
| "OTA not working" | `runtimeVersion` prüfen |
| "CORS Error" | Backend CORS Origins checken |
| "Native crash" | EAS Build neu erstellen |

---

## Schnellreferenz

| Task | Befehl |
|------|--------|
| Dev Server | `npx expo start` |
| Preview Build | `eas build --profile preview` |
| OTA Update | `eas update --channel production` |
| Store Submit | `eas submit --platform android` |
| Logs | `eas logs` |
| Doctor | `npx expo-doctor` |

---

**Zurück zur [Hauptdokumentation](../README.md)**

**Weitere Guides:**
- [SETUP.md](./SETUP.md) - Development Setup
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deploy Details
- [../frontend/README.md](../frontend/README.md) - Frontend
