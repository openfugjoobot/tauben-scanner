# Tauben Scanner Dokumentation - Update Zusammenfassung

## ✅ Aktualisierte Dateien

### 1. README.md (Haupt-Doku)
**Änderungen:**
- Architektur-Wechsel dokumentiert (Server-side statt client-side ML)
- Tech Stack aktualisiert (MobileNet-V3 + TensorFlow.js im Backend)
- API-Beispiele aktualisiert: `photo` statt `embedding` bei POST /api/pigeons und POST /api/images/match
- CORS-Hinweis hinzugefügt: Backend regelt CORS allein
- Android Features: Neue Berechtigungen (INTERNET, NETWORK_STATE, WIFI_STATE)
- Build-System: GitHub Actions Hinweis hinzugefügt
- Debug-UI und Timeout-Handling erwähnt

### 2. docs/API.md
**Änderungen:**
- Neuer Abschnitt: CORS (Backend regelt CORS allein)
- POST /api/pigeons: Erwartet jetzt `photo` (base64) statt Embedding-
- POST /api/images/match: Erwartet jetzt `photo` statt `embedding`
- Fehler-Codes aktualisiert: `MISSING_PHOTO` statt `MISSING_INPUT`
- TypeScript Types: `MatchRequest` mit `photo` statt `embedding`

### 3. docs/MOBILE.md
**Änderungen:**
- Android Berechtigungen aktualisiert: INTERNET, NETWORK_STATE, WIFI_STATE, LOCATION
- Neuer Abschnitt: Timeout-Handling mit AbortController
- Neuer Abschnitt: Debug-UI Komponenten (UploadProgress, NetworkDebugPanel)
- Neuer Abschnitt: CI/CD (GitHub Actions)
- capacitor.config.ts: `webContentsDebuggingEnabled` je nach Build-Typ
- Build-Typen Tabelle hinzugefügt (Debug vs Release)

### 4. docs/DEPLOYMENT.md
**Änderungen:**
- CORS-Hinweis hinzugefügt: Backend regelt CORS, Nginx addiert keine CORS-Headers
- Android WebView: Null-Origin wird erlaubt

### 5. docs/ARCHITECTURE.md (Neu erstellt)
**Inhalt:**
- Architektur-Wechsel dokumentiert (Früher vs Jetzt)
- Komponenten-Beschreibung (Frontend, Backend, DB, Storage)
- Datenfluss-Diagramme für Photo-Registrierung und Photo-Matching
- API-Endpunkte Übersicht
- Mobile App Konfiguration
- Build-System Dokumentation
- CORS-Hinweise
- Sicherheit

### 6. docs/README.md
**Änderungen:**
- Architektur-Diagramm aktualisiert (TensorFlow.js jetzt server-side)
- Tech Stack aktualisiert
- ARCHITECTURE.md zum Index hinzugefügt

### 7. docs/DATABASE.md
**Änderungen:**
- Hinweis hinzugefügt: Embeddings werden serverseitig generiert

## 📝 Wichtige Änderungen im Detail

### API-Endpunkte (NEU)

**POST /api/pigeons:**
```json
{
  "name": "Rudi",
  "photo": "base64EncodedImage...",  // <- NEU: statt embedding
  "location": { "lat": 52.52, "lng": 13.405 }
}
```

**POST /api/images/match:**
```json
{
  "photo": "base64EncodedImage...",  // <- NEU: statt embedding
  "threshold": 0.80
}
```

### CORS-Konfiguration

- Backend regelt CORS allein
- Nginx sollte KEINE CORS-Headers hinzufügen
- Reflect origin für Android WebView
- Null-Origin wird erlaubt

### Android Features

**Berechtigungen:**
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

**Timeout-Handling:**
- Standard: 30s für Uploads
- Implementiert mit AbortController

**Build-System:**
- GitHub Actions für Debug + Release APK Builds
- webContentsDebuggingEnabled=false für Release

## 📁 Alle aktualisierten Dateien

1. `/home/ubuntu/.openclaw/workspace/tauben-scanner/README.md`
2. `/home/ubuntu/.openclaw/workspace/tauben-scanner/docs/API.md`
3. `/home/ubuntu/.openclaw/workspace/tauben-scanner/docs/MOBILE.md`
4. `/home/ubuntu/.openclaw/workspace/tauben-scanner/docs/DEPLOYMENT.md`
5. `/home/ubuntu/.openclaw/workspace/tauben-scanner/docs/ARCHITECTURE.md` (neu)
6. `/home/ubuntu/.openclaw/workspace/tauben-scanner/docs/README.md`
7. `/home/ubuntu/.openclaw/workspace/tauben-scanner/docs/DATABASE.md`

**Status:** ✅ Alle Dokumentations-Dateien aktualisiert
