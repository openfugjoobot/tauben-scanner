# Mobile App Guide

Diese Dokumentation beschreibt die Einrichtung, Entwicklung und den Build der KI Tauben Scanner Mobile App für Android und iOS.

**Framework:** React Native + Expo SDK 51

**Zielplattformen**: Android (API 21+) und iOS (14+)

---

## ⚠️ Architektur-Update

Die App wurde von **Capacitor** zu **React Native + Expo** migriert.

- **Früher**: Capacitor 8 + React + Vite
- **Jetzt**: React Native + Expo SDK 51

Siehe:
- [`SETUP.md`](./SETUP.md) - Development Setup
- [`ARCHITECTURE.md`](./ARCHITECTURE.md) - Architektur-Dokumentation
- [`../frontend/README.md`](../frontend/README.md) - Frontend Dokumentation

---

## Quick Start

```bash
# 1. Backend starten (Docker)
cd ..
docker-compose up -d

# 2. Frontend installieren
cd frontend
npm install

# 3. Dev Server starten
npx expo start

# 4. QR-Code mit Expo Go scannen
```

---

## Tech Stack

| Komponente | Technologie |
|------------|-------------|
| Framework | React Native |
| SDK | Expo SDK 51 |
| Navigation | React Navigation v7 |
| UI | React Native Paper (Material Design 3) |
| State | Zustand + React Query |
| Storage | MMKV |
| HTTP | Axios |
| Camera | expo-camera |
| Location | expo-location |

---

## Expo CLI

```bash
# Expo CLI installieren
npm install -g @expo/cli

# Dev Server
npx expo start

# Build
npx expo prebuild

# EAS Build
eas build --profile preview
```

---

## Build System

### EAS Build

**Konfiguration** (`eas.json`):
```json
{
  "cli": { "version": ">= 5.0.0" },
  "build": {
    "preview": { "distribution": "internal" },
    "production": { "distribution": "store" }
  }
}
```

**Commands**:
```bash
# Preview APK
eas build --profile preview --platform android

# Production AAB
eas build --profile production --platform android

# iOS Simulator
eas build --profile preview --platform ios
```

### OTA Updates

```bash
# Update veröffentlichen
eas update --channel production --message "Bugfixes"
```

---

## Berechtigungen

**`app.json:`**
```json
{
  "expo": {
    "plugins": [
      ["expo-camera", { "cameraPermission": "Für Tauben-Scans" }],
      ["expo-location", { "locationPermission": "Für Standorte" }]
    ]
  }
}
```

---

## Navigation

**React Navigation v7:**
- Bottom Tab Navigator (Hauptnavigation)
- Native Stack Navigator für Screens

Siehe `../frontend/README.md`

---

## State Management

- **Zustand**: App-, Scan-, Settings-Store
- **React Query**: API-Calls mit Caching
- **MMKV**: Persistenter Storage

Siehe `../frontend/STATE_MANAGEMENT.md`

---

## API Client

**Axios mit FormData:**
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.tauben-scanner.de',
  timeout: 30000,
});

// Bild-Upload
const formData = new FormData();
formData.append('photo', { uri, type: 'image/jpeg', name: 'scan.jpg' });
await api.post('/api/images/match', formData);
```

Siehe `API.md` für Details.

---

## Development

### Expo Go (Empfohlen)

1. [Expo Go](https://expo.dev/go) installieren
2. `npx expo start`
3. QR-Code scannen

### Emulator/Simulator

```bash
# Android
npx expo run:android

# iOS (nur Mac)
npx expo run:ios
```

---

## Troubleshooting

| Problem | Lösung |
|---------|--------|
| "expo command not found" | `npm install -g @expo/cli` |
| "No connected devices" | `adb devices` prüfen |
| "Network Error" | Firewall / API-URL prüfen |
| Build fehlschlägt | `rm -rf node_modules && npm install` |

---

## Weiterführende Links

- [Expo Dokumentation](https://docs.expo.dev)
- [React Native](https://reactnative.dev)
- [React Navigation](https://reactnavigation.org)
- [React Native Paper](https://reactnativepaper.com)

---

**Zurück zur [Hauptdokumentation](../README.md)**

*Aktualisiert: Migration zu React Native + Expo SDK 51*
