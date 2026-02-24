# GitHub Actions Workflows

## Build APK (`build-apk.yml`)

Automatischer Build der Android APK bei jedem Push.

### Triggers
- Push zu `main`, `master`, `develop` (nur wenn `frontend/` geändert)
- Pull Requests
- Manuell via `workflow_dispatch` (Debug oder Release)

### Outputs

| Build Type | Ausgabe | Download |
|------------|---------|----------|
| Debug | `app-debug.apk` | 30 Tage verfügbar |
| Release | `app-release-signed.apk` | 90 Tage verfügbar |
| Release | `app-release.aab` (Play Store) | 90 Tage verfügbar |

### Release Build konfigurieren (optional)

Für Release-Builds mit Signing:

1. **Keystore erstellen:**
```bash
cd frontend/android
keytool -genkey -v \
  -keystore taubenscanner.keystore \
  -alias taubenscanner \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

2. **Konvertieren zu Base64:**
```bash
base64 taubenscanner.keystore > keystore.b64
```

3. **Secrets im GitHub Repo hinterlegen:**
- `Settings → Secrets and variables → Actions → New repository secret`

| Secret Name | Wert |
|-------------|------|
| `KEYSTORE_BASE64` | Inhalt von `keystore.b64` |
| `KEYSTORE_PASSWORD` | Dein Keystore-Passwort |
| `KEY_ALIAS` | `taubenscanner` |
| `KEY_PASSWORD` | Dein Key-Passwort (meist gleich) |

## Manuelle Builds

### Debug APK
```bash
# Im GitHub Repo
Actions → Build APK → Run workflow → build_type: debug
```

### Release APK
```bash
# Nur wenn Secrets konfiguriert
Actions → Build APK → Run workflow → build_type: release
```

## Download APK

1. Workflow abschließen lassen
2. Actions → Build APK → Dein Run
3. Artifacts → `app-debug` oder `app-release`
4. ZIP herunterladen, entpacken, auf Android installieren
