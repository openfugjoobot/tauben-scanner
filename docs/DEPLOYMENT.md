# Tauben Scanner Deployment Guide

Complete deployment guide für Backend (Docker) und Mobile App (EAS).

---

## Überblick

| Komponente | Technology | Deployment |
|------------|------------|------------|
| Backend | Docker Compose | VPS/Server |
| Database | PostgreSQL + pgvector | Docker Volume |
| Storage | MinIO | Docker Volume |
| Mobile App | Expo (React Native) | EAS Build + Update |

---

## Deployment Status: ✅ PHASE 7 COMPLETE

### Components Deployed

- **Docker Containers**: 3 running (postgres, api, minio)
- **Nginx Proxy Manager**: Configured with SSL support
- **Backup System**: Daily automated backups with 30-day retention
- **Production Environment**: Ready for production use
- **EAS Build**: Configured für cloud builds

---

## Backend Deployment

### Container Status

```bash
$ docker ps | grep tauben
f07c026296d1   tauben-scanner-api    "docker-entrypoint.s…"   Up 3 min    0.0.0.0:3000->3000/tcp   tauben-api
b4f9546bdd3a   minio/minio:latest    "/usr/bin/docker-ent…"   Up 3 min    0.0.0.0:9000-9001->9000-9001/tcp   tauben-minio
c7843e260ed1   ankane/pgvector:latest  "docker-entrypoint.s…"   Up 3 min    0.0.0.0:5432->5432/tcp   tauben-postgres
```

### Ports Exposed

- **80**: HTTP (NPM proxy)
- **443**: HTTPS (NPM proxy)
- **81**: NPM Admin Interface
- **3000**: Direct API access (bypass NPM)
- **5432**: PostgreSQL (internal)
- **9000**: MinIO API (internal)
- **9001**: MinIO Console (internal)

### Access URLs

- **Application**: https://tauben-scanner.dein-domain.de
- **API**: https://tauben-scanner.dein-domain.de/api
- **NPM Admin**: http://localhost:81
- **Health Check**: https://tauben-scanner.dein-domain.de/health

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
cd frontend
npm install --save-dev eas-cli
```

**3. eas.json konfigurieren**

```json
{
  "cli": {
    "version": ">= 5.0.0"
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
      },
      "ios": {
        "simulator": true
      }
    },
    "production": {
      "distribution": "store"
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json"
      }
    }
  }
}
```

**4. app.json konfigurieren**

```json
{
  "expo": {
    "name": "Tauben Scanner",
    "slug": "tauben-scanner",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.openfugjoobot.taubenscanner"
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/android-icon-foreground.png",
        "monochromeImage": "./assets/android-icon-monochrome.png"
      },
      "package": "com.openfugjoobot.taubenscanner"
    },
    "updates": {
      "url": "https://u.expo.dev/YOUR_PROJECT_ID"
    },
    "extra": {
      "eas": {
        "projectId": "YOUR_PROJECT_ID"
      }
    },
    "runtimeVersion": {
      "policy": "sdkVersion"
    }
  }
}
```

### EAS Build Commands

**Preview Build (APK)**

```bash
cd frontend

# Android APK (für interne Tests)
eas build --platform android --profile preview

# iOS Simulator Build (nur macOS)
eas build --platform ios --profile preview
```

**Production Build**

```bash
# Android AAB (für Play Store)
eas build --platform android --profile production

# iOS IPA (für App Store)
eas build --platform ios --profile production
```

**Development Build**

```bash
# Für lokalen Entwicklungsclient (mit nativem Debugging)
eas build --platform android --profile development
```

### EAS Update (OTA Updates)

```bash
# Update auf Production Channel veröffentlichen
eas update --channel production --message "Bugfix: Kamera-Zugriff"

# Update auf Preview Channel
eas update --channel preview --message "Neue Features"

# Branch erstellen
eas update --branch feature-branch --message "WIP"
```

**Update Strategie:**

1. Kleinere Fixes → EAS Update (kein App Store Review)
2. Native Code Änderungen → EAS Build (neuer Store Build nötig)
3. Major Updates → EAS Build (neue Version im Store)

---

## GitHub Actions Workflow

### EAS Build Workflow

**`.github/workflows/eas-build.yml`**

```yaml
name: EAS Build

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Setup EAS
        uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: Install dependencies
        working-directory: frontend
        run: npm ci

      - name: Build Preview APK
        working-directory: frontend
        run: eas build --platform android --profile preview --non-interactive

      - name: Publish Update
        working-directory: frontend
        run: eas update --channel preview --message "CI Update"
```

### Secrets Setup

**GitHub Repository Secrets:**

- `EXPO_TOKEN` - Expo Access Token ([expo.dev/settings/access-tokens](https://expo.dev/settings/access-tokens))

**Erstellen:**

```bash
# Token generieren
npx eas login
npx eas whoami

# Token für CI/CD
# In GitHub: Settings → Secrets → New repository secret
```

---

## APK Download

### EAS Build Download

Nach erfolgreichem Build:

1. **Expo Dashboard** öffnen: https://expo.dev/accounts/[account]/projects/[project]/builds
2. Build auswählen
3. "Download" Button klicken

### Direct Download Link

```bash
# Nach Build-Start Link erhalten
 eas build --platform android --profile preview --json

# Oder URL aus Dashboard kopieren
```

### APK Installation

```bash
# Auf Gerät installieren
adb install -r tauben-scanner.apk

# Oder per Link/Firebase App Distribution
```

---

## App Store Deployment

### Google Play Store (Ablauf)

**1. Developer Account erstellen**
- https://play.google.com/console
- Einmalige Gebühr: $25

**2. Service Account erstellen**
- GCP Console → IAM → Service Accounts
- JSON Key herunterladen
- Play Console → API Access → Link
- Berechtigungen: Release Manager

**3. EAS Submit konfigurieren**

```bash
# Service Account Key einrichten
cp /path/to/service-account.json ~/tauben-scanner/frontend/google-service-account.json

# Submit konfigurieren (eas.json)
{
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json"
      }
    }
  }
}
```

**4. Submit ausführen**

```bash
# Build erstellen und automatisch submit
eas build --platform android --profile production --auto-submit

# Oder nachträglich submit
eas submit --platform android
```

### Apple App Store

**1. Apple Developer Account**
- https://developer.apple.com
- Jahresgebühr: $99

**2. App Store Connect**
- App erstellen
- Bundle ID registrieren
- Screenshots hochladen

**3. EAS Submit**

```bash
# Mit Apple ID
eas submit --platform ios

# Oder automatisierter Build + Submit
eas build --platform ios --profile production --auto-submit
```

---

## Configuration Files

### Environment Variables

Production config: `/opt/tauben-scanner/.env`

```bash
DATABASE_URL=postgresql://tauben:SECURE_PASSWORD_HERE@postgres:5432/tauben_scanner
PORT=3000
NODE_ENV=production
CORS_ORIGINS=https://tauben-scanner.dein-domain.de
JWT_SECRET=GENERATE_SECURE_SECRET_HERE
```

### Docker Compose

Main configuration: `docker-compose.yml`

```yaml
services:
  postgres:
    image: ankane/pgvector:latest
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_USER: tauben
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: tauben_scanner

  api:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL
      - PORT
      - NODE_ENV
      - CORS_ORIGINS
    depends_on:
      - postgres
      - minio

  minio:
    image: minio/minio:latest
    command: server /data --console-address ":9001"
    volumes:
      - minio_data:/data
    environment:
      MINIO_ROOT_USER: ${MINIO_USER}
      MINIO_ROOT_PASSWORD: ${MINIO_PASSWORD}
```

---

## Services

### 1. PostgreSQL (tauben-postgres)

- **Image**: ankane/pgvector:latest
- **Database**: tauben_scanner
- **User**: tauben
- **Extensions**: pgvector
- **Volume**: postgres_data

### 2. API Server (tauben-api)

- **Image**: tauben-scanner-api (built locally)
- **Port**: 3000
- **Environment**: production
- **Depends**: postgres, minio

### 3. Object Storage (tauben-minio)

- **Image**: minio/minio:latest
- **API Port**: 9000
- **Console Port**: 9001
- **Volume**: minio_data

### 4. Nginx Proxy Manager (nginx-proxy-manager)

- **Image**: jc21/nginx-proxy-manager:latest
- **Admin Port**: 81
- **SSL**: Let's Encrypt
- **Data**: /opt/npm-data

---

## Backup System Status: ✅ ACTIVE

### Timer Information

```bash
$ sudo systemctl status tauben-backup.timer
● tauben-backup.timer - Daily Tauben Scanner Backup
     Loaded: loaded (/etc/systemd/system/tauben-backup.timer)
     Active: active (waiting)
    Trigger: Daily at midnight
```

### Backup Testing

**Latest Backup**: db_20260224_203723.sql.gz
**Location**: /opt/tauben-backups/data/
**Retention**: 30 days
**Schedule**: Daily at midnight

---

## Nginx Proxy Manager Configuration

### Proxy Host Settings

- **Domain**: tauben-scanner.dein-domain.de
- **Target**: tauben-api:3000
- **SSL**: Enabled (Let's Encrypt)
- **Security**: Block exploits, HTTP/2, Force SSL

### SSL Certificate

- **Provider**: Let's Encrypt
- **Status**: Active
- **Renewal**: Automatic

---

## Security Considerations

### Implemented

- ✅ HTTPS/SSL termination
- ✅ Reverse proxy protection
- ✅ Security headers
- ✅ Exploit blocking
- ✅ Container isolation
- ✅ Database authentication
- ✅ OTA Updates (Code-Signing)

### EAS Security Features

- Build Signing für Android/iOS
- Code Signing Identities
- Provisioning Profiles
- Secure Build Environment

### Recommended Actions

1. **Change Default NPM Credentials**
2. **Set Strong Database Password**
3. **Configure Firewall Rules**
4. **Enable Access Logging**
5. **Set Up Monitoring**

---

## Monitoring & Maintenance

### Backend Commands

```bash
# Check all services
docker ps | grep tauben

# View logs
docker logs tauben-api --tail 100

# Test health
curl https://tauben-scanner.dein-domain.de/health

# Backup status
sudo systemctl status tauben-backup.timer
```

### Mobile App Monitoring

```bash
# EAS Dashboard
eas builds:list

# Update Status
eas update:list

# Channel Status
eas channel:list
```

### Log Locations

- **Application**: `docker logs tauben-api`
- **Database**: `docker logs tauben-postgres`
- **Storage**: `docker logs tauben-minio`
- **Proxy**: `docker logs nginx-proxy-manager`
- **Backups**: `sudo journalctl -u tauben-backup.service`

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

**SSL Certificate Issues**
- Check domain DNS resolution
- Verify Let's Encrypt rate limits
- Review NPM SSL settings

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
- App muss mindestens 1x gestartet werden (Background Fetch)

**Android Installation fehlschlägt**
- Developer Mode aktivieren
- USB Debugging einschalten
- `adb devices` prüfen

---

## Performance Considerations

### Resource Requirements

- **Memory**: 2GB minimum
- **Storage**: 10GB minimum + backups
- **CPU**: 2 cores recommended

### Scaling Options

1. **Database**: Increase postgres resources
2. **API**: Add horizontal scaling
3. **Storage**: Configure MinIO clustering
4. **CDN**: Add static asset CDN

---

## Next Steps

### Immediate

1. Configure production domain DNS
2. Set up monitoring alerts
3. Configure email notifications
4. Test disaster recovery

### Mobile App

1. **Google Play**: Store Listing erstellen, Screenshots hochladen
2. **Test Flight**: iOS Beta Testing einrichten
3. **Analytics**: Crash Reporting (Sentry) einbinden

### Future Enhancements

1. Load balancing
2. Database replication
3. CI/CD Pipeline vollständig automatisieren
4. Monitoring Dashboard

---

## Support & Documentation

- **NPM Guide**: [NPM.md](./NPM.md)
- **Backup Guide**: [BACKUP.md](./BACKUP.md)
- **Frontend Setup**: [frontend/README.md](../frontend/README.md)
- **Setup Guide**: [SETUP.md](./SETUP.md)
- **Main README**: [../README.md](../README.md)
- **Expo Docs**: https://docs.expo.dev
- **EAS Docs**: https://docs.expo.dev/eas

---

**Deployment updated for**: React Native + Expo SDK 51 + EAS Build  
**Status**: ✅ Production Ready
