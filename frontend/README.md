# Tauben Scanner - React Native Frontend

React Native Mobile App für den KI Tauben Scanner mit Expo SDK 51.

---

## Tech Stack

| Technologie | Version | Beschreibung |
|-------------|---------|--------------|
| **React Native** | 0.72+ | Native Mobile UI |
| **Expo SDK** | 51 | Development Platform |
| **React Navigation** | v7 | Screen Navigation |
| **React Native Paper** | v5 | Material Design 3 |
| **TypeScript** | 5.9 | Typisierung |
| **Zustand** | ^4.x | State Management |
| **React Query** | ^5.x | Server State |
| **Axios** | ^1.x | HTTP Client |
| **MMKV** | ^2.x | Lokale Persistenz |

---

## Projektstruktur

```
frontend/
├── App.tsx                    # Root App Komponente
├── app.json                   # Expo Konfiguration
├── index.ts                   # Entry Point
├── eas.json                   # EAS Build Konfiguration
├── src/
│   ├── navigation/
│   │   └── TabNavigator.tsx   # Bottom Tab Navigation
│   ├── screens/
│   │   ├── scan/
│   │   │   ├── ScanScreen.tsx
│   │   │   └── ResultScreen.tsx
│   │   ├── pigeons/
│   │   │   ├── PigeonsScreen.tsx
│   │   │   └── PigeonDetailScreen.tsx
│   │   ├── history/
│   │   │   └── HistoryScreen.tsx
│   │   └── settings/
│   │       └── SettingsScreen.tsx
│   ├── components/
│   │   ├── ui/                # Reusable UI Components
│   │   │   ├── PaperCard.tsx
│   │   │   └── PaperButton.tsx
│   │   └── camera/
│   │       └── CameraView.tsx # Expo Camera Wrapper
│   ├── stores/
│   │   ├── appStore.ts        # App-Settings
│   │   ├── scanStore.ts       # Scan-Workflow
│   │   └── settingsStore.ts   # User Settings
│   ├── hooks/
│   │   ├── usePigeons.ts      # React Query Hooks
│   │   ├── useMatchImage.ts
│   │   └── useSightings.ts
│   ├── services/
│   │   └── api.ts             # Axios Setup
│   ├── types/
│   │   └── index.ts
│   └── utils/
│       └── helpers.ts
├── assets/
│   ├── icon.png
│   ├── splash-icon.png
│   └── android-icon-*.png
└── STATE_MANAGEMENT.md         # State Management Docs
```

---

## Navigation (React Navigation v7)

```typescript
// Bottom Tab Navigator
const Tab = createBottomTabNavigator();

// Screens:
// - ScanTab      → ScanStack (Scan → Result → Register)
// - PigeonsTab   → PigeonsStack (List → Detail → AddSighting)
// - HistoryTab   → HistoryStack
// - SettingsTab  → SettingsStack
```

---

## State Management

### Zustand Stores

**AppStore** - Globale App-Einstellungen
```typescript
{
  theme: 'light' | 'dark' | 'system';
  isOnline: boolean;
  language: string;
  onboardingCompleted: boolean;
}
```

**ScanStore** - Scan-Workflow State
```typescript
{
  status: 'idle' | 'capturing' | 'uploading' | 'processing' | 'completed' | 'error';
  capturedPhoto: string | null;
  result: ScanResult | null;
  scanHistory: ScanResult[];
}
```

**SettingsStore** - User & API Settings
```typescript
{
  apiUrl: string;
  apiKey: string | null;
  matchThreshold: number;
  debugMode: boolean;
}
```

### React Query

- **usePigeons** - Liste aller Tauben
- **usePigeon** - Einzelne Taube
- **useMatchImage** - Bild Matching (Mutation)
- **useCreateSighting** - Sichtung erstellen (Mutation)

Siehe `STATE_MANAGEMENT.md` für Details.

---

## Installation

### Voraussetzungen

- Node.js 18+
- npm oder yarn
- Android Studio (für Android Emulator)
- Xcode (für iOS Simulator, nur macOS)

### Setup

```bash
# In das Frontend-Verzeichnis wechseln
cd frontend

# Dependencies installieren
npm install

# Expo CLI installieren (optional global)
npm install -g @expo/cli
```

---

## Entwicklung

### Dev Server starten

```bash
# Metro Bundler starten
npx expo start

# Optionen:
#  - i → iOS Simulator (macOS only)
#  - a → Android Emulator
#  - w → Web-Version
#  - r → Reload
#  - m → Menu
```

### Expo Go App verwenden

1. [Expo Go](https://apps.apple.com/app/expo-go/id982107779) aus App Store installieren
2. QR-Code im Terminal scannen
3. App lädt und aktualisiert automatisch bei Code-Änderungen

### Development Build

```bash
# Für native Debugging-Features
eas build --profile development --platform android

# Installieren und mit Dev Client starten
```

---

## Build

### EAS Preview (APK)

```bash
# Schneller Preview-Build für Tests
eas build --profile preview --platform android

# Download-Link wird angezeigt
```

### EAS Production

```bash
# Production Build (für Store)
eas build --profile production --platform android
```

### iOS

```bash
# iOS Simulator Build
eas build --profile preview --platform ios

# Production Build (für App Store)
eas build --profile production --platform ios
```

---

## OTA Updates

```bash
# Update auf Production Channel veröffentlichen
eas update --channel production --message "Bugfix Kamera"

# App startet automatisch neu und lädt Update
```

---

## Scripts

| Befehl | Beschreibung |
|--------|--------------|
| `npx expo start` | Dev Server starten |
| `npx expo run:android` | Android Emulator |
| `npx expo run:ios` | iOS Simulator |
| `eas build --profile preview` | Preview Build |
| `eas update --channel production` | OTA Update |
| `eas submit --platform android` | Zu Play Store |

---

## Dependencies

### Core
- `expo` - Expo SDK
- `react` / `react-native` - React Native

### Navigation
- `@react-navigation/native` - Navigation Core
- `@react-navigation/bottom-tabs` - Tab Navigator
- `@react-navigation/native-stack` - Stack Navigator
- `react-native-screens` / `react-native-safe-area-context`

### UI
- `react-native-paper` - Material Design 3
- `@react-navigation/material-bottom-tabs` - Bottom Tabs

### State & Data
- `zustand` - State Management
- `@tanstack/react-query` - Server State
- `react-native-mmkv` - Lokale Persistenz
- `axios` - HTTP Client

### Expo Modules
- `expo-camera` - Kamera-Zugriff
- `expo-location` - GPS/Standort
- `expo-status-bar` - Status Bar
- `expo-updates` - OTA Updates

### Dev Tools
- `@tanstack/react-query-devtools` - React Query DevTools (Web)

---

## Environment Variablen

```bash
# .env im Frontend-Verzeichnis
EXPO_PUBLIC_API_URL=https://api.tauben-scanner.de
```

Zugriff im Code:
```typescript
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
```

---

## Troubleshooting

### Metro Bundler startet nicht

```bash
# Cache löschen
rm -rf node_modules
rm -rf .expo
rm -rf $TMPDIR/haste-map-*
npm install
npx expo start --clear
```

### Android Emulator Fehler

```bash
# Android Studio öffnen
# AVD Manager → Emulator erstellen (API 34)
adb devices  # Check ob Gerät erkannt wird
```

### iOS Simulator Fehler

```bash
# Nur auf macOS
sudo xcode-select --switch /Applications/Xcode.app
```

### Build Fehler

```bash
# EAS Credentials checken
eas credentials

# Project neu konfigurieren
eas build:configure
```

---

## Dokumentation

- [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md) - Zustand + React Query
- [../docs/API.md](../docs/API.md) - Backend API
- [../docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md) - System-Architektur
- [../docs/SETUP.md](../docs/SETUP.md) - Development Setup

---

## Expo SDK 51 Features

- ✅ React Native 0.72+
- ✅ Material Design 3 via React Native Paper
- ✅ Expo Router Ready
- ✅ EAS Build & Update
- ✅ Hermes JavaScript Engine
- ✅ Expo Modules API
- ✅ Improved Developer Experience

---

**Tech Stack**: React Native + Expo SDK 51 + React Navigation v7  
**State**: Zustand + React Query  
**UI**: React Native Paper (Material Design 3)  
**Build**: EAS (Expo Application Services)
