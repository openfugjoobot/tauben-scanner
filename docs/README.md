# KI Tauben Scanner Dokumentation

Willkommen in der offiziellen Dokumentation des KI Tauben Scanners!

**Tech Stack**: React Native + Expo SDK 51 + Express.js + PostgreSQL + pgvector

---

## 📚 Dokumentation Index

| Dokument | Beschreibung |
|----------|--------------|
| [**README.md**](../README.md) | Hauptdokumentation mit Überblick, Features, Quick Start |
| [**API.md**](API.md) | Vollständige API Referenz mit Axios + React Query |
| [**ARCHITECTURE.md**](ARCHITECTURE.md) | Systemarchitektur (React Native + Expo + Zustand) |
| [**DATABASE.md**](DATABASE.md) | Datenbank Schema, Indizes, Queries |
| [**DEPLOYMENT.md**](DEPLOYMENT.md) | Docker-, SSL-, EAS Build- und Deployment-Guide |
| [**MOBILE.md**](MOBILE.md) | Mobile App Entwicklung (React Native + Expo) |
| [**SETUP.md**](SETUP.md) | Development Setup für React Native Expo |
| [**WORKFLOW.md**](WORKFLOW.md) | Entwicklungs- und Deployment-Workflow |
| [**../frontend/README.md**](../frontend/README.md) | Frontend Dokumentation |
| [**../frontend/STATE_MANAGEMENT.md**](../frontend/STATE_MANAGEMENT.md) | Zustand + React Query Docs |

---

## 🚀 Schnelleinstieg

### Für Entwickler

1. **[Hauptdokumentation](../README.md)** lesen - Überblick über das Projekt
2. **[SETUP.md](SETUP.md)** - Development Setup
3. **[API.md](API.md)** - API Endpoints verstehen
4. **[ARCHITECTURE.md](ARCHITECTURE.md)** - Tech Stack verstehen

### Für Mobile Entwickler

1. **[SETUP.md](SETUP.md)** - React Native Expo Setup
2. **[../frontend/README.md](../frontend/README.md)** - Frontend Struktur
3. **[../frontend/STATE_MANAGEMENT.md](../frontend/STATE_MANAGEMENT.md)** - State Management
4. **[API.md](API.md)** - API Integration

### Für Administratoren

1. **[DEPLOYMENT.md](DEPLOYMENT.md)** - System aufsetzen
2. **[DATABASE.md](DATABASE.md)** - Backup-Strategie
3. **[WORKFLOW.md](WORKFLOW.md)** - CI/CD Prozess

---

## 🏗️ Architektur Überblick

```
┌─────────────────────────────────────────────────────────────┐
│                      React Native App                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │  Scan    │  │ Pigeons  │  │ History  │  │ Settings │    │
│  │  (Expo   │  │ (React   │  │ (Tab     │  │ (Stack)  │    │
│  │  Camera) │  │  Query)  │  │  View)   │  │          │    │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘    │
│       │             │             │             │           │
│       └─────────────┴──────┬──────┴─────────────┘           │
│                            │                               │
│                    Zustand Stores                            │
└────────────────────────────┼────────────────────────────────┘
                             │
                           Axios
                             │
┌────────────────────────────┼────────────────────────────────┐
│                      Express.js API                          │
│  ┌──────────┬──────────────┴──────────────┬──────────┐    │
│  │ POST     │ /api/images/match           │ Embed    │    │
│  │ POST     │ /api/pigeons                │ & Store │    │
│  │ GET      │ /api/pigeons/:id            │          │    │
│  └──────────┴─────────────────────────────┴──────────┘    │
│                                                             │
│  MobileNet-V3 (TensorFlow.js) - Server-side ML              │
└─────────────────────────────┬───────────────────────────────┘
                              │
┌─────────────────────────────┼───────────────────────────────┐
│                      PostgreSQL + pgvector                   │
│  ┌──────────┬───────────────┴───────────────┬──────────┐     │
│  │ pigeons  │ embeddings (1024-d)         │ HNSW     │     │
│  │ images   │ sightings                   │ Index    │     │
│  └──────────┴───────────────────────────────┴──────────┘     │
└──────────────────────────────────────────────────────────────┘
```

**Architektur-Migration:**
- Früher: Capacitor (WebView Hybrid)
- Jetzt: React Native (Native UI) + Expo SDK 51

---

## 🛠️ Tech Stack

### Frontend (Mobile)
| Technologie | Zweck |
|-------------|-------|
| **React Native** | Native Mobile UI |
| **Expo SDK 51** | Development & Build Platform |
| **React Navigation v7** | Screen Navigation |
| **React Native Paper** | Material Design 3 UI |
| **Zustand** | Global State Management |
| **React Query** | Server-State & Caching |
| **Axios** | HTTP Requests |
| **MMKV** | Local Persistence |

### Backend
| Technologie | Zweck |
|-------------|-------|
| **Express.js 5** | API Server |
| **TypeScript** | Typisierung |
| **MobileNet-V3** | Server-side ML |
| **pg 8** | PostgreSQL Client |

### Datenbank
| Technologie | Zweck |
|-------------|-------|
| **PostgreSQL 15+** | Hauptdatenbank |
| **pgvector** | Vektor-Erweiterung |
| **HNSW** | Nearest Neighbor Search |

### DevOps
| Technologie | Zweck |
|-------------|-------|
| **Docker** | Containerisierung |
| **Docker Compose** | Multi-Service Orchestration |
| **EAS Build** | Cloud-Builds für Mobile |
| **EAS Update** | OTA Updates |

---

## 📞 Support

- **GitHub Issues:** [github.com/openfugjoobot/tauben-scanner/issues](https://github.com/openfugjoobot/tauben-scanner/issues)
- **Backend Fehler:** Siehe [DEPLOYMENT.md#troubleshooting](DEPLOYMENT.md#troubleshooting)
- **App Fehler:** Siehe [SETUP.md#troubleshooting](SETUP.md#troubleshooting)
- **Expo Docs:** [docs.expo.dev](https://docs.expo.dev)

---

## 📝 Beitragen

Wir freuen uns über Verbesserungen an der Dokumentation!

1. Fork das Repository
2. Erstelle einen Branch: `docs/update-beschreibung`
3. Commit: `docs: Verbessere API Beschreibung`
4. Pull Request erstellen

---

**Made with ❤️ by OpenFugjooBot**

*Migration complete: Capacitor → React Native + Expo SDK 51*  
*Letzte Aktualisierung: 2026-02-26*
