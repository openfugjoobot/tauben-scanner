# Changelog

Alle wichtigen Änderungen an der Dokumentation werden in dieser Datei dokumentiert.

---

## 2025-02-28 - Dokumentation Update

### Korrigierte Informationen

#### Expo SDK Version
- **Alt:** Expo SDK 51
- **Neu:** Expo SDK 52
- **Betroffene Dateien:** Alle docs/

#### React Native Version
- **Alt:** React Native 0.72+
- **Neu:** React Native 0.76
- **Betroffene Dateien:** Alle docs/

#### AI/ML Model
- **Alt:** MobileNet-V3 (mentioned in docs)
- **Neu:** MobileNet-V2 alpha 0.75 (actual implementation)
- **Embeddings:** 1024-dimensionale Vektoren
- **Betroffene Dateien:** ARCHITECTURE.md, DATABASE.md, README.md

#### Image Upload Format
- **Alt:** Dokumentation erwähnte FormData/multipart Uploads
- **Neu:** Base64 JSON Uploads (tatsächliche Implementierung)
- **Betroffene Dateien:** API.md

#### Storage
- **Alt:** MinIO als aktiver Storage beschrieben
- **Neu:** Lokales Dateisystem (`/uploads`) wird verwendet
- **Hinweis:** MinIO ist in docker-compose.yml definiert aber nicht aktiv
- **Betroffene Dateien:** DEPLOYMENT.md, ARCHITECTURE.md

#### Authentifizierung
- **Alt:** JWT/API-Key Auth erwähnt
- **Neu:** **Keine Authentifizierung** - Offene API
- **Empfohlene Maßnahme:** Auth für Produktion hinzufügen
- **Betroffene Dateien:** ARCHITECTURE.md, API.md, DEPLOYMENT.md

### Aktualisierte Dateien

1. **docs/ARCHITECTURE.md** - Komplett überarbeitet
   - Architektur-Diagramme aktualisiert
   - Base64 Upload Dokumentation
   - Keine Auth Informationen
   - MobileNet V2 korrekt beschrieben

2. **docs/API.md** - Komplett überarbeitet
   - Base64 Upload Beispiele
   - Keine FormData/Multipart Referenzen
   - Aktuelle Endpoints und Response Formate

3. **docs/MOBILE.md** - Aktualisiert
   - Expo SDK 52
   - React Native 0.76
   - Base64 Upload Beispiele

4. **docs/SETUP.md** - Aktualisiert
   - Expo SDK 52
   - React Native 0.76

5. **docs/DEPLOYMENT.md** - Aktualisiert
   - Lokale Storage Informationen
   - Keine MinIO als aktiv
   - Security Hinweise zur offenen API

6. **docs/DATABASE.md** - Aktualisiert
   - MobileNet V2 statt V3

7. **README.md** - Aktualisiert
   - Expo SDK 52
   - React Native 0.76
   - MobileNet V2

### Neue Documentation

- **docs/CHANGELOG.md** - Diese Datei

---

## Zusammenfassung des aktuellen Tech Stacks

### Frontend (Mobile)
- React Native 0.76
- Expo SDK 52
- React Navigation v7
- React Native Paper v5
- Zustand ^5.x
- React Query ^5.x
- MMKV ^2.x
- Axios ^1.x

### Backend
- Node.js + Express.js 5
- TypeScript 5.9
- MobileNet-V2 (TensorFlow.js) - 1024d embeddings
- PostgreSQL + pgvector
- Lokales Filesystem für Bilder (`/uploads`)

### Authentifizierung
- **Keine** (offene API)
- Für Produktion empfohlen: JWT oder API-Keys

### Image Upload
- Base64 JSON Format
- Kein Multipart/FormData

---

