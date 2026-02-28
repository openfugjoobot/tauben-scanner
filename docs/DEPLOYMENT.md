# Tauben Scanner Deployment Guide

Complete deployment guide für Backend (Docker) und Mobile App (EAS).

---

## Überblick

| Komponente | Technology | Deployment |
|------------|------------|------------|
| Backend | Docker Compose | VPS/Server |
| Database | PostgreSQL + pgvector | Docker Volume |
| Image Storage | Local Filesystem | `/uploads` |
| Mobile App | Expo (React Native) | EAS Build + Update |

---

## Backend Deployment

### Container Status

```bash
$ docker ps | grep tauben
f07c026296d1   tauben-scanner-api    "docker-entrypoint.s…"   Up 3 min    0.0.0.0:3000->3000/tcp   tauben-api
c7843e260ed1   ankane/pgvector:latest  "docker-entrypoint.s…"   Up 3 min    0.0.0.0:5432->5432/tcp   tauben-postgres
```

**Hinweis:** MinIO ist in docker-compose.yml definiert aber wird vom Backend aktuell nicht verwendet. Bilder werden in `/uploads` gespeichert.

---

## Environment Variables

### Required

```bash
# Server
PORT=3000
NODE_ENV=production

# Database
DATABASE_URL=postgresql://tauben:password@postgres:5432/tauben_scanner
DB_PASSWORD=secure_password

# CORS
CORS_ORIGINS=https://tauben-scanner.fugjoo.duckdns.org,http://localhost:8081

# Storage
UPLOADS_DIR=/app/uploads
```

### Optional (MinIO - nicht aktiv verwendet)

```bash
MINIO_USER=minioadmin
MINIO_PASSWORD=minioadmin123
```

---

## Docker Compose

```yaml
version: '3.8'

services:
  postgres:
    image: ankane/pgvector:latest
    container_name: tauben-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: tauben_scanner
      POSTGRES_USER: tauben
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./docker/init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    networks:
      - tauben-network

  api:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: tauben-api
    restart: unless-stopped
    environment:
      NODE_ENV: production
      PORT: 3000
      DATABASE_URL: postgresql://tauben:${DB_PASSWORD}@postgres:5432/tauben_scanner
      CORS_ORIGINS: "${CORS_ORIGINS}"
      UPLOADS_DIR: /app/uploads
    volumes:
      - uploads_data:/app/uploads
    ports:
      - "3000:3000"
    depends_on:
      - postgres
    networks:
      - tauben-network
      - proxy

  # Optional: MinIO (nicht aktiv verwendet)
  minio:
    image: minio/minio:latest
    container_name: tauben-minio
    restart: unless-stopped
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: ${MINIO_USER:-admin}
      MINIO_ROOT_PASSWORD: ${MINIO_PASSWORD}
    volumes:
      - minio_data:/data
    ports:
      - "9000:9000"
      - "9001:9001"
    networks:
      - tauben-network

networks:
  tauben-network:
    driver: bridge
  proxy:
    external: true

volumes:
  postgres_data:
  minio_data:
  uploads_data:
```

---

## Mobile App Deployment (EAS)

### EAS Build Setup

**1. Expo Account erstellen**

```bash
# Registrieren bei expo.dev
# Dann lokal login:
npx expo login
```

**2. EAS installieren**

```bash
npm install -g eas-cli
# Oder lokal:
cd mobile
npm install --save-dev eas-cli
```

**3. eas.json konfigurieren**

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
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

**4. app.json konfigurieren**

```json
{
  "expo": {
    "name": "Tauben Scanner",
    "slug": "tauben-scanner",
    "version": "1.0.1",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "backgroundColor": "#FFFFFF",
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#FFFFFF"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.openfugjoobot.taubenscanner"
    },
    "android": {
      "package": "com.openfugjoobot.taubenscanner",
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon-foreground.png",
        "backgroundImage": "./assets/adaptive-icon-background.png"
      }
    },
    "plugins": [
      ["expo-camera", { "cameraPermission": "Tauben Scanner benötigt Kamera-Zugriff." }],
      ["expo-location", { "locationPermission": "Tauben Scanner benötigt Standort." }]
    ],
    "extra": {
      "eas": {
        "projectId": "YOUR_PROJECT_ID"
      }
    }
  }
}
```

### EAS Build Commands

**Preview Build (APK)**

```bash
cd mobile

# Android APK (für interne Tests)
eas build --platform android --profile preview

# iOS Simulator Build (nur macOS)
eas build --platform ios --profile preview
```

**Production Build**

```bash
# Android APK
eas build --platform android --profile production

# iOS IPA (für App Store)
eas build --platform ios --profile production
```

### EAS Update (OTA Updates)

```bash
# Update auf Production Channel veröffentlichen
eas update --channel production --message "Bugfix: Kamera-Zugriff"

# Update auf Preview Channel
eas update --channel preview --message "Neue Features"
```

---

## CORS Configuration

⚠️ **Backend regelt CORS allein** - Nginx sollte KEINE CORS-Headers hinzufügen.

### Erlaubte Origins

- `https://tauben-scanner.dein-domain.de`
- `http://localhost:8081` (Metro Bundler)
- `http://localhost:3000` (Dev Server)
- `null` (für mobile Apps)

### Nginx Proxy Manager

Bei Verwendung von NPM:
- **Keine** CORS-Headers in NPM konfigurieren
- Backend übernimmt CORS komplett

---

## Troubleshooting

### Backend Issues

**502 Bad Gateway**
- Check tauben-api container
- Verify internal network connectivity
- Review NPM proxy configuration

**Database Connection Failed**
- Verify postgres container running
- Check DATABASE_URL credentials
- Review network configuration

**Images not loading**
- Check `uploads_data` volume
- Verify UPLOADS_DIR environment variable
- Check file permissions

### Mobile App Issues

**Build Fails**
```bash
# Cache löschen
rm -rf node_modules
rm -rf $TMPDIR/haste-map-*
npm install

# EAS Account check
npx eas whoami
```

**OTA Update funktioniert nicht**
- Prüfe `runtimeVersion` in app.json
- Channel Name überprüfen
- App muss mindestens 1x gestartet werden

---

## Security Considerations

### Implemented

- ✅ HTTPS/SSL termination
- ✅ Reverse proxy protection
- ✅ Security headers (Helmet)
- ✅ Container isolation
- ✅ Database authentication
- ✅ OTA Updates (Code-Signing)

### Nicht implementiert (offene API)

- ❌ Authentifizierung
- ❌ API-Keys
- ❌ Rate-Limiting

### Empfohlen für Produktion

1. JWT-Authentifizierung hinzufügen
2. Rate-Limiting implementieren
3. API-Keys für mobile App
4. Bild-Validierung (Größe, Format)

---

## Storage Architecture

### Current: Local Filesystem

```
Backend Container
├── /app/uploads/
│   ├── 1705312800000_rudi_rothen.jpg
│   ├── 1705312900000_helga_hell.jpg
│   └── ...
```

- Vorteile: Einfach, schnell, keine zusätzlichen Services
- Nachteile: Keine Skalierung über mehrere Server

### Future: MinIO (S3)

MinIO ist bereits in docker-compose.yml konfiguriert aber nicht aktiv verwendet.
Für Migration auf S3-storage wäre Backend-Code-Anpassung nötig.

---

**Zurück zur [Hauptdokumentation](../README.md)**

*Deployment aktualisiert: Local storage (/uploads), Expo SDK 52*
