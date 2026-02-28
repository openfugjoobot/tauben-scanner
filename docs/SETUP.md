# Development Setup Guide

Komplette Einrichtung der Entwicklungsumgebung für den KI Tauben Scanner.

---

## Überblick

| Komponente | Tool | Zweck |
|------------|------|-------|
| **Backend** | Docker Compose | PostgreSQL + API |
| **Frontend** | Expo / React Native | Mobile App Entwicklung |
| **Testing** | Expo Go / Simulator | Live Testing auf Gerät |

---

## Schnellstart

```bash
# 1. Repository klonen
git clone https://github.com/openfugjoobot/tauben-scanner.git
cd tauben-scanner

# 2. Backend starten (Docker)
docker-compose up -d

# 3. Mobile App installieren
cd mobile
npm install

# 4. Dev Server starten
npx expo start

# 5. QR-Code mit Expo Go scannen
```

---

## System Voraussetzungen

### Hardware

| Komponente | Minimum | Empfohlen |
|------------|---------|-----------|
| RAM | 8 GB | 16 GB |
| Speicher | 10 GB frei | 20 GB frei |
| CPU | 4 Kerne | 8 Kerne |

### Software

| Tool | Version | Link |
|------|---------|------|
| Node.js | 20+ LTS | https://nodejs.org |
| Docker | Latest | https://docker.com |
| Docker Compose | v2.x | Inkludiert |
| Git | 2.x | https://git-scm.com |

---

## Backend Setup

### 1. Docker Installation

**Ubuntu/Debian:**
```bash
# Docker installieren
sudo apt-get update
sudo apt-get install -y docker.io docker-compose

# Docker starten
sudo systemctl start docker
sudo systemctl enable docker

# Nutzer zur docker-group hinzufügen
sudo usermod -aG docker $USER
# Neu einloggen oder:
newgrp docker
```

**macOS (via Homebrew):**
```bash
brew install docker docker-compose
```

### 2. Umgebungsvariablen

```bash
# In Projekt-Root
cp .env.example .env

# Anpassen:
nano .env
```

**Wichtige Werte:**
```bash
DATABASE_URL=postgresql://tauben:password@postgres:5432/tauben_scanner
DB_PASSWORD=dein_sicheres_password
CORS_ORIGINS=http://localhost:8081,http://localhost:3000
```

### 3. Services starten

```bash
# Alle Services starten
docker-compose up -d

# Status prüfen
docker-compose ps

# Logs ansehen
docker-compose logs -f api

# Health Check
curl http://localhost:3000/health
```

**Erwartete Ausgabe:**
```json
{
  "status": "healthy",
  "services": {
    "database": "connected",
    "storage": "connected",
    "embedding_model": "loaded"
  }
}
```

---

## Mobile App Setup (React Native + Expo SDK 52)

### 1. Node.js Installation

**Mit NVM (empfohlen):**
```bash
# NVM installieren
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Neu laden
source ~/.bashrc

# Node 20 installieren
nvm install 20
nvm use 20
nvm alias default 20

# Prüfen
node --version  # v20.x.x
npm --version
```

### 2. Expo CLI installieren

```bash
# Global (optional)
npm install -g @expo/cli

# Oder im Projekt:
cd mobile
npm install --save-dev @expo/cli
```

### 3. Dependencies installieren

```bash
cd mobile

# Alle Pakete installieren
npm install

# Bei Problemen mit nativen Modulen:
npx expo install --fix
```

---

## Expo Go Testing

### 1. Expo Go App installieren

- **Android**: [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **iOS**: [App Store](https://apps.apple.com/app/expo-go/id982107779)

### 2. Dev Server starten

```bash
cd mobile

# Metro Bundler
npx expo start

# Ausgabe:
#  Metro waiting on exp://192.168.1.100:8081
#  Scan QR code shown above
```

### 3. QR-Code scannen

1. **Android**: Expo Go App → Scan QR Code
2. **iOS**: Kamera App → QR-Code scannen → "In Expo Go öffnen"

### 4. Live Reload

- App lädt automatisch Code-Änderungen
- CMD+R (Mac) / Ctrl+R (Win) für Reload
- Shake-Geste für Dev Menu (Android)

---

## Android Studio Emulator

### 1. Android Studio installieren

**Download:** https://developer.android.com/studio

### 2. SDK installieren

```
SDK Manager → SDK Platforms:
  ✅ Android API 35 (oder höher)
  
SDK Manager → SDK Tools:
  ✅ Android SDK Build-Tools
  ✅ Android Emulator
  ✅ Android SDK Platform-Tools
```

### 3. Emulator erstellen

```
AVD Manager → Create Device
  → Pixel 7 (empfohlen)
  → System Image: Android API 35
  → Finish
```

### 4. Starten

```bash
# Emulator starten (CLI)
emulator -avd Pixel_7

# Oder in Android Studio: Play Button
```

### 5. App starten

```bash
cd mobile

# Android Emulator
npx expo run:android

# Oder im Expo Dev Menu:
#  → A für Android Emulator
```

---

## iOS Simulator (nur macOS)

### 1. Xcode installieren

**App Store:** https://apps.apple.com/de/app/xcode/id497799835

```bash
# Command Line Tools
xcode-select --install

# Verify
sudo xcode-select --switch /Applications/Xcode.app
```

### 2. Simulator starten

```bash
# Im Simulator starten
npx expo run:ios

# Oder im Expo Dev Menu:
#  → I für iOS Simulator
```

---

## Entwicklungs-Workflow

### Täglicher Ablauf

```bash
# 1. Backend prüfen
docker-compose ps
docker-compose logs -f api

# 2. Frontend starten
cd mobile
npx expo start

# 3. Expo Go öffnen → QR Scan

# 4. Coden...

# 5. Hot Reload zeigt Änderungen sofort
```

### API URL konfigurieren

**Für lokale Tests:**
```bash
# Im Frontend-Verzeichnis
echo "EXPO_PUBLIC_API_URL=http://$(hostname -I | awk '{print $1}'):3000/api" > .env
```

**Für Emulator:**
```bash
# Android Emulator
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000/api

# iOS Simulator
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

---

## Troubleshooting

### Backend Probleme

**"Cannot connect to Docker daemon"**
```bash
sudo usermod -aG docker $USER
# Neu einloggen
```

**"Port 3000 already in use"**
```bash
# Port belegen?
sudo ss -tlnp | grep 3000
sudo kill -9 PID

# Oder Port ändern in .env
PORT=3001
```

**"Database connection failed"**
```bash
# PostgreSQL Logs
docker-compose logs postgres

# Container neu erstellen
docker-compose down
docker-compose up -d
```

### Frontend Probleme

**"expo command not found"**
```bash
npm install -g @expo/cli
# Oder: npx expo
```

**"Could not connect to development server"**
```bash
# Firewall prüfen
# Selbes Netzwerk wie Gerät?
# In Settings → "Tunnel" Modus probieren
npx expo start --tunnel
```

**"Android SDK not found"**
```bash
# Android Studio installieren
# Umgebungsvariablen setzen:
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

**iOS "No simulators available" (Mac)**
```bash
# Xcode Command Line Tools
sudo xcode-select --reset

# Simulator installieren
xcrun simctl list devices
```

### Expo Go Probleme

**App stürzt ab**
- Cache löschen: Einstellungen → "Clear Cache"
- Neu installieren
- Prüfen ob native Module benötigt werden

**Updates werden nicht geladen**
- QR-Code erneut scannen
- CMD+R / Shake → Reload
- `expo start --clear` (Cache löschen)

---

## Nützliche Befehle

| Befehl | Beschreibung |
|--------|--------------|
| `docker-compose up -d` | Backend starten |
| `docker-compose down` | Backend stoppen |
| `docker-compose logs -f` | Logs live ansehen |
| `npx expo start` | Dev Server starten |
| `npx expo start --clear` | Mit Cache reset |
| `npx expo start --tunnel` | Tunnel-Modus |
| `npx expo run:android` | Android Emulator |
| `npx expo run:ios` | iOS Simulator |
| `eas build --profile preview` | Preview Build |
| `eas update --channel preview` | OTA Update |
| `adb devices` | Android Geräte listen |
| `adb logcat` | Android Logs |

---

## Port Übersicht

| Service | Port | Beschreibung |
|---------|------|--------------|
| Metro Bundler | 8081 | React Native Dev Server |
| API | 3000 | Backend API |
| Postgres | 5432 | Datenbank |
| MinIO API | 9000 | Object Storage (nicht aktiv) |
| MinIO Console | 9001 | Storage UI (nicht aktiv) |

---

## Links & Resourcen

### Dokumentation

- [Expo Docs](https://docs.expo.dev)
- [React Native Docs](https://reactnative.dev)
- [React Navigation](https://reactnavigation.org)
- [React Native Paper](https://reactnativepaper.com)

---

**Setup Status**: ✅ Backend (Docker) + Frontend (Expo SDK 52) ready

*Aktualisiert: Expo SDK 52, React Native 0.76*
