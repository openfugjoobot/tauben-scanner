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
- [Android Features](#android-features)
- [Debug-UI Komponenten](#debug-ui-komponenten)
- [CI/CD (GitHub Actions)](#cicd-github-actions)
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
import type { CapacitorConfig } from '@capacitor/cli';

const isDebugBuild = process.env.NODE_ENV !== 'production' && process.env.BUILD_TYPE !== 'release';

const config: CapacitorConfig = {
  appId: 'com.taubenscanner.app',
  appName: 'Tauben Scanner',
  webDir: 'dist',
  server: {
    cleartext: false,
    androidScheme: 'https'
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
      keystorePassword: undefined,
      keystoreKeyPassword: undefined,
      signingType: 'apksigner',
    },
    // Debug nur in Development, disabled in Release
    webContentsDebuggingEnabled: isDebugBuild
  },
  plugins: {
    Camera: {
      permissionPrompt: true,
      saveToGallery: true
    },
    Geolocation: {
      permissionPrompt: true
    }
  }
};

export default config;
```

---

## Android Features

### Berechtigungen

**AndroidManifest.xml:**

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.taubenscanner.app">

    <!-- Network Permissions -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />

    <!-- Location Permissions -->
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme"
        android:usesCleartextTraffic="false"
        android:networkSecurityConfig="@xml/network_security_config">
        ...
    </application>
</manifest>
```

### Timeout-Handling

**API-Requests mit AbortController:**

```typescript
// frontend/src/services/api.ts

async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = 30000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    let errorMessage = 'Network error - please check your internet connection';
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        errorMessage = 'Network timeout - please check your connection';
      }
    }
    throw new Error(errorMessage);
  }
}
```

**Timeout-Defaults:**

| Operation | Timeout |
|-----------|---------|
| Health Check | 10s |
| Single Pigeon Fetch | 15s |
| List Pigeons | 15s |
| Pigeon Registration | 30s |
| Image Match | 30s |
| Sighting Report | 30s |

---

## Debug-UI Komponenten

### UploadProgress

Zeigt Fortschritt beim Photo-Upload an.

### NetworkDebugPanel

Debug-Informationen für Netzwerk-Requests:
- API-URL
- Request-Status
- Fehler-Logs (letzte 10 Einträge)
- CORS-Status

**Fehler-Logging:**

```typescript
function logNetworkError(error: string, url?: string) {
  const errors = JSON.parse(localStorage.getItem('network_errors') || '[]');
  errors.unshift({
    timestamp: new Date().toLocaleString(),
    error,
    url
  });
  localStorage.setItem('network_errors', JSON.stringify(errors.slice(0, 10)));
}
```

---

## CI/CD (GitHub Actions)

Automatische Builds bei Push auf main/tags.

### Workflow: `.github/workflows/build-apk.yml`

```yaml
name: Build APK

on:
  push:
    branches: [main, master]
    tags: ['v*']
  workflow_dispatch:

jobs:
  build-apk:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Setup Java
        uses: actions/setup-java@v4
        with:
          java-version: '21'
          distribution: 'temurin'

      - name: Setup Android SDK
        uses: android-actions/setup-android@v3

      - name: Install Android SDK components
        run: |
          yes | sdkmanager --licenses || true
          sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"

      - name: Install dependencies
        working-directory: frontend
        run: npm ci

      - name: Build web assets
        working-directory: frontend
        run: npm run build

      - name: Sync Capacitor
        working-directory: frontend
        run: |
          export ANDROID_SDK_ROOT=$ANDROID_HOME
          echo "sdk.dir=$ANDROID_SDK_ROOT" > android/local.properties
          npx cap sync android

      - name: Build Debug APK
        working-directory: frontend/android
        run: |
          chmod +x gradlew
          ./gradlew assembleDebug --no-daemon

      - name: Build Release APK
        working-directory: frontend/android
        run: |
          chmod +x gradlew
          ./gradlew assembleRelease --no-daemon

      - name: Upload Debug APK
        uses: actions/upload-artifact@v4
        with:
          name: tauben-scanner-debug
          path: frontend/android/app/build/outputs/apk/debug/app-debug.apk

      - name: Upload Release APK
        uses: actions/upload-artifact@v4
        with:
          name: tauben-scanner-release
          path: frontend/android/app/build/outputs/apk/release/app-release-unsigned.apk

      - name: Create Release
        if: startsWith(github.ref, 'refs/tags/')
        uses: softprops/action-gh-release@v1
        with:
          files: |
            frontend/android/app/build/outputs/apk/debug/app-debug.apk
            frontend/android/app/build/outputs/apk/release/app-release-unsigned.apk
          generate_release_notes: true
```

### Build-Typen

| Typ | webContentsDebuggingEnabled | Optimierung |
|-----|----------------------------|-------------|
| Debug | `true` | Nein |
| Release | `false` | Ja (R8, minify) |

### Artefakte

- Debug APK: `app-debug.apk`
- Release APK: `app-release-unsigned.apk` (ohne Signing-Keys)

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

### 2. Capacitor Live Reload

```bash
# Sync zu Android
cd frontend

# Build + Sync
npm run build
npx cap sync android

# Mit Android Studio öffnen
npx cap open android
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

# 3. Debug APK (Gradle)
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
```

**⚠️ Wichtig:** Sichere den Keystore! Verlust = keine Updates möglich!

#### 2. Release Build

```bash
cd frontend

npm run build
npx cap sync android

# Release APK
cd android
./gradlew assembleRelease

# APK liegt unter:
ls ./app/build/outputs/apk/release/app-release-unsigned.apk
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

---

## Release & Distribution

### Version Bump

**package.json** aktualisieren:

```json
{
  "name": "tauben-scanner-frontend",
  "version": "1.0.1",
  // ...
}
```

**android/app/build.gradle**:

```gradle
android {
    defaultConfig {
        versionCode 2
        versionName "1.0.1"
    }
}
```

### Google Play Store

1. Play Console → Release → Production
2. AAB hochladen
3. Rollout starten

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

# Lizenzen akzeptieren
yes | sdkmanager --licenses
```

### Netzwerk-Fehler (CORS)

- Prüfe API-URL in den Einstellungen
- Prüfe `network_security_config.xml`
- Prüfe Backend CORS-Einstellungen
- Debug-Logs in NetworkDebugPanel ansehen

### App stürzt beim Start ab

```bash
# Logcat auslesen
adb logcat -d > logs.txt

# Nach Fehlern suchen
grep -i "taubenscanner\|capacitor\|error\|fatal" logs.txt
```

### Timeout bei Uploads

- Konvertiere Bilder vor Upload (max 2MB)
- Prüfe Server-Timeout-Einstellungen
- Aktiviere UploadProgress für Debug

---

**Zurück zur [Hauptdokumentation](../README.md)**
