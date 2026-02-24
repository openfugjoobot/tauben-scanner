# KI Tauben Scanner Dokumentation

Willkommen in der offiziellen Dokumentation des KI Tauben Scanner!

## 📚 Dokumentation Index

| Dokument | Beschreibung |
|----------|--------------|
| [**README.md**](../README.md) | Hauptdokumentation mit Überblick, Features, Quick Start |
| [**API.md**](API.md) | Vollständige API Referenz aller Endpoints |
| [**DATABASE.md**](DATABASE.md) | Datenbank Schema, Indizes, Queries |
| [**DEPLOYMENT.md**](DEPLOYMENT.md) | Docker-, SSL-, Backup- und Deployment-Guide |
| [**MOBILE.md**](MOBILE.md) | Android App Entwicklung und Build-Anleitung |

---

## 🚀 Schnelleinstieg

### Für Entwickler

1. **[Hauptdokumentation](../README.md)** lesen - Überblick über das Projekt
2. **[API.md](API.md)** - API Endpoints verstehen
3. **[DATABASE.md](DATABASE.md)** - Datenbank Schema kennenlernen

### Für Administratoren

1. **[DEPLOYMENT.md](DEPLOYMENT.md)** - System aufsetzen
2. **[DATABASE.md](DATABASE.md)** - Backup-Strategie
3. **[API.md](API.md)** - Integration mit externen Systemen

### Für Mobile Entwickler

1. **[MOBILE.md](MOBILE.md)** - App-Entwicklung und Build-Prozess
2. **[API.md](API.md)** - API Integration
3. **[Hauptdokumentation](../README.md)** - Project Vision

---

## 🏗️ Architektur Überblick

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│    Mobile App   │────▶│   REST API       │────▶│   PostgreSQL    │
│   (Capacitor)   │◄────│   (Express.js)   │◄────│   + pgvector    │
└─────────────────┘     └──────────────────┘     └─────────────────┘
        │                       │                       │
        ▼                       ▼                       ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  TensorFlow.js  │     │  MinIO (S3)     │     │   HNSW Index    │
│  MobileNet-V3   │     │  Image Storage  │     │  (Cosine Sim.)  │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend (Mobile)
- **React 19** - UI Framework
- **TypeScript 5.9** - Typisierung
- **Capacitor 8** - Mobile Wrapper
- **TensorFlow.js** - On-device ML

### Backend
- **Node.js** + **Express.js 5** - API Server
- **TypeScript** - Server-Code
- **Helmet** - Security
- **CORS** - Cross-Origin

### Datenbank
- **PostgreSQL 15+** - Hauptdatenbank
- **pgvector** - Vektor-Erweiterung
- **HNSW** - Approximate Nearest Neighbor
- **GIN** - Full-Text Search

### DevOps
- **Docker** - Containerisierung
- **Docker Compose** - Orchestration
- **Nginx Proxy Manager** - Reverse Proxy

---

## 📞 Support

- **GitHub Issues:** [github.com/openfugjoobot/tauben-scanner/issues](https://github.com/openfugjoobot/tauben-scanner/issues)
- **API Fehler:** Siehe [API.md#fehlerbehandlung](API.md#fehlerbehandlung)
- **Deployment:** Siehe [DEPLOYMENT.md#troubleshooting](DEPLOYMENT.md#troubleshooting)

---

## 📝 Beitragen

Wir freuen uns über Verbesserungen an der Dokumentation!

1. Fork das Repository
2. Erstelle einen Branch: `docs/update-beschreibung`
3. Commit: `docs: Verbessere API Beschreibung`
4. Pull Request erstellen

---

**Made with ❤️ by OpenFugjooBot**

_Letzte Aktualisierung: 2024-02-24_
