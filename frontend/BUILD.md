# Build-Anleitung - Tauben Scanner

Diese Anleitung beschreibt, wie du die Android-APK für den Tauben Scanner mit EAS (Expo Application Services) erstellst.

## Voraussetzungen

- Node.js 20 oder höher
- npm
- EAS CLI: `npm install -g eas-cli`

## EAS Konfiguration

Die EAS-Konfiguration befindet sich in `eas.json`:

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
      }
    },
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

## Lokaler Build

### 1. EAS Login

```bash
eas login
```

### 2. Lokaler Build für Android

Um eine Test-APK zu erstellen:

```bash
eas build --platform android --profile preview --local
```

Um einen Release-Build zu erstellen:

```bash
eas build --platform android --profile production --local
```

## Remote Build (Cloud)

Um den Build in der EAS Cloud auszuführen:

```bash
# Preview Build (interne Verteilung)
eas build --platform android --profile preview

# Production Build
eas build --platform android --profile production
```

## APK Download

Nach einem erfolgreichen Build in der Cloud:

1. Öffne die EAS Dashboard: https://expo.dev/accounts/[account]/projects/[project]/builds
2. Suche deinen Build in der Liste
3. Klicke auf den Build, um Details zu sehen
4. Lade die APK-Datei herunter

Alternativ erhälst du einen direkten Download-Link in der Konsole nach dem Build.

## GitHub Actions CI/CD

Ein GitHub Actions Workflow ist eingerichtet unter `.github/workflows/build.yml`, der automatisch bei Push auf `main` ausgelöst wird.

### Manuelle Ausführung:

Gehe zu **Actions** → **Build APK with EAS** → **Run workflow**

### Secrets konfigurieren:

Damit der Workflow funktioniert, muss das Secret `EXPO_TOKEN` in den GitHub Repository-Einstellungen hinterlegt werden:

1. Generiere ein Expo Access Token: https://expo.dev/settings/access-tokens
2. Gehe zu GitHub → Repository Settings → Secrets and variables → Actions
3. Erstelle ein neues Secret mit dem Namen `EXPO_TOKEN`

## App Konfiguration

Die App-Konfiguration befindet sich in `app.json`:

- **Name:** Tauben Scanner
- **Package ID:** `com.openfugjoobot.taubenscanner`
- **Version:** 1.0.0

## Troubleshooting

### Build schlägt fehl

1. Lösche `node_modules` und `package-lock.json`:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Lösche die EAS-Build-Caches:
   ```bash
   eas build --clear-cache
   ```

### Expo Token Fehler

Stelle sicher, dass der Expo Access Token gültig ist und nicht abgelaufen ist.

## Unterstützte Befehle

| Befehl | Beschreibung |
|--------|--------------|
| `eas build:list` | Zeigt alle Builds an |
| `eas build:view [ID]` | Zeigt Details eines Builds |
| `eas build:cancel [ID]` | Bricht einen laufenden Build ab |
| `eas build:delete [ID]` | Löscht einen Build |
