# Mobile App Guide

Diese Dokumentation beschreibt die Einrichtung, Entwicklung und den Build der KI Tauben Scanner Mobile App für Android und iOS.

**Framework:** React Native + Expo SDK 52

**Zielplattformen**: Android (API 24+) und iOS (14+)

---

## ⚠️ Architektur-Update

Die App wurde von **Capacitor** zu **React Native + Expo** migriert.

- **Früher**: Capacitor 8 + React + Vite
- **Jetzt**: React Native 0.76 + Expo SDK 52 (pure Expo, kein Capacitor)

Siehe:
- [`SETUP.md`](./SETUP.md) - Development Setup
- [`ARCHITECTURE.md`](./ARCHITECTURE.md) - Architektur-Dokumentation

---

## Quick Start

```bash
# 1. Backend starten (Docker)
cd ..
docker-compose up -d

# 2. Mobile App installieren
cd mobile
npm install

# 3. Dev Server starten
npx expo start

# 4. QR-Code mit Expo Go scannen
```

---

## Tech Stack

| Komponente | Technologie | Version |
|------------|-------------|---------|
| Framework | React Native | 0.76 |
| SDK | Expo SDK | 52 |
| Navigation | React Navigation | v7 |
| UI | React Native Paper | v5 (Material Design 3) |
| State | Zustand | ^5.x |
| Server State | React Query | ^5.x |
| Storage | MMKV | ^2.x |
| HTTP | Axios | ^1.x |
| Camera | expo-camera | ~16.0 |
| Location | expo-location | ~18.0 |
| Image Picker | expo-image-picker | ~16.0 |

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
  "cli": {
    "version": ">= 5.0.0",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": { "buildType": "apk" }
    },
    "production": {
      "android": { "buildType": "apk" }
    }
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
      [
        "expo-camera",
        {
          "cameraPermission": "Tauben Scanner benötigt Zugriff auf die Kamera, um Tauben zu scannen."
        }
      ],
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "Tauben Scanner benötigt Ihren Standort, um Sichtungen zu speichern."
        }
      ],
      [
        "expo-image-picker",
        {
          "photosPermission": "Die App benötigt Zugriff auf Ihre Fotos."
        }
      ]
    ]
  }
}
```

---

## Navigation

**React Navigation v7:**
- Bottom Tab Navigator (Hauptnavigation)
- Native Stack Navigator für Screens

---

## State Management

- **Zustand**: App-, Scan-, Settings-Store
- **React Query**: API-Calls mit Caching
- **MMKV**: Persistenter Storage

---

## API Client

**Axios mit Base64:**
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.tauben-scanner.de/api',
  timeout: 30000,
});

// Bild-Upload als Base64
const uploadImage = async (base64Image: string) => {
  const { data } = await api.post('/images/match', {
    photo: base64Image,
    threshold: 0.80,
  });
  return data;
};
```

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

*Aktualisiert: React Native 0.76 + Expo SDK 52*
