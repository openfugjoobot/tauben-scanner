# Mobile App Guide

Diese Dokumentation beschreibt die Einrichtung, Entwicklung und den Build der KI Tauben Scanner Mobile App für Android.

**Framework:** React + Capacitor + TypeScript

**Zielplattform:** Android (API Level 22+)

---

## 📋 Inhaltsverzeichnis

- [Voraussetzungen](#voraussetzungen)
- [Entwicklungsumgebung](#entwicklungsumgebung)
- [Projekt-Setup](#projekt-setup)
- [Lokale Entwicklung](#lokale-entwicklung)
- [Android Build](#android-build)
- [Geräte-Testing](#geräte-testing)
- [Berechtigungen](#berechtigungen)
- [Release & Distribution](#release--distribution)
- [Troubleshooting](#troubleshooting)

---

## Voraussetzungen

### Hardware

| Komponente | Minimum | Empfohlen |
|------------|---------|-----------|
| Android Gerät | API 22+ (Android 5.1) | API 29+ (Android 10+) |
| RAM | 2 GB | 4 GB |
| Kamera | 5 MP | 12 MP+ |
| Speicher | 100 MB frei | 500 MB frei |

### Software

- **Node.js** 20+ LTS
- **Android Studio** Hedgehog (2023.1.1) oder neuer
- **Java SDK** 17
- **Android SDK** mit API Level 34

---

## Entwicklungsumgebung

### 1. Node.js installieren

```bash
# Mit NVM (empfohlen)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20

# Überprüfen
node --version
npm --version
```

### 2. Android Studio installieren

1. [Android Studio herunterladen](https://developer.android.com/studio)
2. Installieren mit Standard-Settings
3. **SDK Platform** installieren:
   - Android SDK Platform 34
   - Android SDK Build-Tools 34.0.0
   - Android SDK Command Line Tools
   - Android Emulator (optional)
   - Android SDK Platform-Tools

### 3. Umgebungsvariablen

```bash
# ~/.bashrc oder ~/.zshrc hinzufügen

export ANDROID_HOME=$HOME/Android/Sdk
export ANDROID_SDK_ROOT=$ANDROID_HOME
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
```

```bash
# Neu laden
source ~/.bashrc

# Überprüfen
adb --version
sdkmanager --list
```

---

## Projekt-Setup

### 1. Abhängigkeiten installieren

```bash
cd frontend

# npm packages
npm install

# Capacitor Android Plattform hinzufügen
npx cap add android
```

### 2. Capacitor Konfiguration

Die Konfiguration befindet sich in `capacitor.config.ts`:

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.taubenscanner.app',
  appName: 'Tauben Scanner',
  webDir: 'dist',
  server: {
    cleartext: true,  // Für HTTP (nur Development!)
    androidScheme: 'https'
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
      keystorePassword: undefined,
      keystoreKeyPassword: undefined,
      signingType: 'apksigner',
    }
  },
  plugins: {
    Camera: {
      permissionPrompt: true,
      saveToGallery: true
    }
  }
};

export default config;
```

**Wichtig:** Für Produktion `cleartext` auf `false` setzen!

---

## Lokale Entwicklung

### 1. Dev Server starten

```bash
cd frontend

# Vite Dev Server
npm run dev

# Oder mit Netzwerkzugriff (für echte Geräte)
npm run dev -- --host
```

### 2. Im Browser testen

1. Auf `http://localhost:5173` öffnen
2. Chrome DevTools → Device Toolbar
3. Mobile Viewport wählen
4. „Foto machen“ - Button testet die Kamera-Funktionalität

### 3. Capacitor Live Reload

```bash
# Sync zu Android
cd frontend

# Build + Sync
npm run build
npx cap sync android

# Mit Android Studio öffnen
npx cap open android
```

### 4. Live Reload für schnelle Entwicklung

```typescript
// capacitor.config.ts (Development only!)
const config: CapacitorConfig = {
  // ... andere configs
  server: {
    url: 'http://DEINE_IP:5173',  // Deine lokale IP
    cleartext: true
  }
};
```

```bash
# Dann:
npm run dev
npx cap run android -l --host=DEINE_IP
```

---

## Android Build

### Debug APK erstellen

```bash
cd frontend

# 1. Vite Build
npm run build

# 2. Capacitor Sync
npx cap sync android

# 3. Debug APK  (Gradle)
cd android
./gradlew assembleDebug

# APK liegt unter:
ls ./app/build/outputs/apk/debug/app-debug.apk
```

### Release APK erstellen

#### 1. Keystore erstellen

```bash
# Im Android-Verzeichnis
cd frontend/android

# Keystore erstellen
keytool -genkey -v \
  -keystore taubenscanner.keystore \
  -alias taubenscanner \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

# Antworten:
# - Passwort: [starkes Passwort]
# - CN: Tauben Scanner
# - OU: Development
# - O: OpenFugjooBot
# - L: Berlin
# - ST: Berlin
# - C: DE
```

**⚠️ Wichtig:** Sichere den Keystore! Verlust = keine Updates möglich!

#### 2. Keystore konfigurieren

`capacitor.config.ts` aktualisieren:

```typescript
android: {
  buildOptions: {
    keystorePath: 'taubenscanner.keystore',
    keystoreAlias: 'taubenscanner',
    keystorePassword: 'DEIN_PASSWORT',
    keystoreKeyPassword: 'DEIN_PASSWORT',
    signingType: 'apksigner',
  }
}
```

**Alternative (sicherer):** `local.properties` in `frontend/android/` erstellen:

```properties
keystore.file=taubenscanner.keystore
keystore.alias=taubenscanner
keystore.password=DEIN_PASSWORT
keystore.key.password=DEIN_PASSWORT
```

#### 3. Release Build

```bash
cd frontend

# Build
npm run build
npx cap sync android

# Release APK
cd android
./gradlew assembleRelease

# APK liegt unter:
ls ./app/build/outputs/apk/release/app-release-signed.apk
```

### AAB erstellen (Für Google Play)

```bash
cd frontend/android
./gradlew bundleRelease

# AAB liegt unter:
ls ./app/build/outputs/bundle/release/app-release.aab
```

---

## Geräte-Testing

### Android Emulator

```bash
# Emulator erstellen
avdmanager create avd -n "TaubenScanner" -k "system-images;android-34;google_apis;x86_64" -d "pixel_7"

# Starten
emulator -avd TaubenScanner
```

### Echtes Gerät

1. **USB-Debugging aktivieren:**
   - Einstellungen → Über das Telefon → Build-Nummer (7x tippen)
   - Entwickleroptionen → USB-Debugging aktivieren

2. **Verbinden:**
   ```bash
   # Gerät prüfen
   adb devices
   
   # Installieren
   adb install frontend/android/app/build/outputs/apk/debug/app-debug.apk
   ```

### APK installieren

```bash
# Via ADB
adb install -r ./app-debug.apk

# Via Browser (wenn APK auf Webserver)
# Download auf Gerät → Installieren

# Hinweis: Unknown Sources muss aktiviert sein
```

---

## Berechtigungen

Die App benötigt folgende Berechtigungen:

### AndroidManifest.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.taubenscanner.app">

    <!-- Internet -->
    <uses-permission android:name="android.permission.INTERNET" />
    
    <!-- Camera -->
    <uses-permission android:name="android.permission.CAMERA" />
    
    <!-- Location -->
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <!-- Storage (für Bildspeicherung) -->
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"
        android:maxSdkVersion="32" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"
        android:maxSdkVersion="32" />
    
</manifest>
```

### Request zur Laufzeit

Die Berechtigungen werden automatisch durch den Capacitor Camera-Plugin angefragt. Für manuelle Steuerung:

```typescript
// src/services/permissions.ts
import { Camera } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';

export async function requestCameraPermission(): Promise<boolean> {
  const permission = await Camera.requestPermissions();
  return permission.camera === 'granted';
}

export async function requestLocationPermission(): Promise<boolean> {
  const permission = await Geolocation.requestPermissions();
  return permission.location === 'granted';
}
```

### Berechtigungen prüfen

```typescript
// In einem Komponenten
import { useEffect } from 'react';
import { Camera } from '@capacitor/camera';

function App() {
  useEffect(() {
    Camera.checkPermissions().then(permissionStatus => {
      if (permissionStatus.camera !== 'granted') {
        Camera.requestPermissions();
      }
    });
  }, []);
}
```

---

## Release & Distribution

### Version Bump

**package.json** aktualisieren:

```json
{
  "name": "tauben-scanner-frontend",
  "version": "1.0.1",  // Erhöhen für jedes Release
  // ...
}
```

**android/app/build.gradle**:

```gradle
android {
    defaultConfig {
        versionCode 2          // Erhöhen für jedes Release
        versionName "1.0.1"     // Sollte package.json entsprechen
    }
}
```

### App Icon und Branding

```bash
# Icons generieren
# Erstelle ein 1024x1024 PNG Logo in res/

# Mit ImageMagick (optional)
cd frontend
npx cordova-res android --skip-config --copy

# oder manuell kopieren:
# android/app/src/main/res/mipmap-*/
```

| Verzeichnis | Größe |
|-------------|-------|
| `mipmap-xxxhdpi` | 512px |
| `mipmap-xxhdpi` | 384px |
| `mipmap-xhdpi` | 256px |
| `mipmap-hdpi` | 192px |
| `mipmap-mdpi` | 128px |
| `mipmap-ldpi` | 96px |

### Google Play Store

#### 1. Google Play Console

1. [play.google.com/console](https://play.google.com/console) öffnen
2. Neues App-Projekt erstellen
3. App-Details eintragen

#### 2. App Bundle hochladen

```bash
# AAB erstellen
cd frontend/android
./gradlew bundleRelease

# Hochladen:
# frontend/android/app/build/outputs/bundle/release/app-release.aab
```

#### 3. Store Listing

Benötigte Assets:

| Asset | Spezifikation |
|-------|---------------|
| Feature Graphic | 1024 x 500 px |
| Screenshots | Mindestens 2, 1080 x 1920 px |
| App Icon | 512 x 512 px |
| Short Description | Max 80 Zeichen |
| Full Description | Max 4000 Zeichen |

#### 4. Content Rating

- IARC-Zertifizierung beantragen
- Für Tauben Scanner: PEGI 3 (für alle Altersgruppen)

#### 5. Preise & Distribution

- Kostenlos oder kostenpflichtig
- Länder auswählen
- Veröffentlichen

---

## Troubleshooting

### Gradle Fehler

```bash
# Gradle Cache löschen
cd frontend/android
./gradlew clean
rm -rf ~/.gradle/caches/

# Neu aufbauen
./gradlew assembleDebug
```

### SDK nicht gefunden

```bash
# SDK Path überprüfen
echo $ANDROID_HOME
ls $ANDROID_HOME

# Lizenzen akzeptieren (falls nicht geschehen)
yes | sdkmanager --licenses
```

### Build schlägt fehl

```bash
# Dependency Updates
cd frontend/android
./gradlew dependencies --configuration implementation

# Versionen prüfen
java -version  # Sollte 17 sein
```

### APK zu groß

```bash
# APK Analyzer in Android Studio nutzen
# Oder: ProGuard/R8 aktivieren

# android/app/build.gradle
defaultConfig {
    minifyEnabled true
    proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
}
```

### App stürzt beim Start ab

```bash
# Logcat auslesen
adb logcat -d > logs.txt

# Nach Fehlern suchen
grep -i "taubenscanner\|capacitor\|error\|fatal" logs.txt
```

### TensorFlow.js zu langsam

```typescript
// Backend optimieren
import * as tf from '@tensorflow/tfjs';

// WASM Backend (falls unterstützt)
import '@tensorflow/tfjs-backend-wasm';

await tf.setBackend('wasm');
```

### Hot Reload funktioniert nicht

```bash
# Capacitor neu synchronisieren
cd frontend
npm run build
npx cap sync android

# Android Studio: Build → Clean Project
# Android Studio: File → Invalidate Caches / Restart
```

---

## Entwicklungs-Tipps

### 1. TypeScript Types

```typescript
// src/types/api.ts
export interface MatchResponse {
  match: boolean;
  pigeon?: {
    id: string;
    name: string;
    photo_url?: string;
  };
  confidence: number;
  similar_pigeons?: Array<{
    id: string;
    name: string;
    similarity: number;
  }>;
}
```

### 2. Development vs Production

```typescript
// src/config/index.ts
const isDev = import.meta.env.DEV;

export const API_URL = isDev 
  ? 'http://192.168.1.100:3000'  // Deine lokale IP
  : 'https://api.taube.dein-domain.com';

export const EMBEDDING_DIMENSION = 1024;
export const MATCH_THRESHOLD = 0.80;
```

### 3. Offline-Unterstützung (zukünftig)

```typescript
// Service Worker für Offline-Fähigkeit
// In vite.config.ts:
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg}']
      }
    })
  ]
});
```

---

## Testing

### Unit Tests

```bash
# Jest einrichten
npm install --save-dev jest @testing-library/react

# Tests ausführen
npm test
```

### E2E Tests

```bash
# Detox für React Native / Capacitor
npm install --save-dev detox

# Tests schreiben in e2e/
detox test
```

---

**Zurück zur [Hauptdokumentation](../README.md)**
