# 🕊️ Tauben Scanner

> AI-powered mobile app for identifying and managing city pigeons using machine learning image recognition.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/Docker-ready-blue.svg)](https://www.docker.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791.svg)](https://www.postgresql.org/)
[![Expo](https://img.shields.io/badge/Expo-SDK%2052-000020.svg)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.76-61dafb.svg)](https://reactnative.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933.svg)](https://nodejs.org/)

![Tauben Scanner Screenshot](docs/assets/screenshot.png)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Configuration](#-configuration)
- [Development](#-development)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🔍 AI Image Recognition

- **MobileNet-V2 powered** pigeon identification with 1024-dimensional embeddings
- **Server-side feature extraction** using TensorFlow.js
- **Cosine similarity matching** with configurable threshold (0.50-0.99)
- **Multi-angle support** through multiple image storage per pigeon
- **Automatic embedding generation** for new registrations

### 📱 Mobile App

- **React Native 0.76 + Expo SDK 52** for cross-platform development
- **Real-time camera scanning** with \`expo-camera\`
- **Offline support** with local state persistence (Zustand + MMKV)
- **Material Design 3** UI components via React Native Paper
- **Location tracking** for sighting records
- **OTA updates** via EAS (Expo Application Services)

### 🔐 Backend Features

- **API key authentication** with rate limiting
- **Health checks** with detailed service monitoring
- **CORS handling** configured for mobile and web clients
- **Security headers** via Helmet
- **Request logging** with Morgan
- **Comprehensive test suite** (Jest + Supertest)

### 🗄️ Storage & Database

- **PostgreSQL 15+** with pgvector extension for vector similarity search
- **HNSW index** for fast 1024-d embedding lookups
- **Local filesystem storage** for images (\`/uploads\`)
- **MinIO** (optional/S3-compatible, configured but not actively used)

---

## 🛠️ Tech Stack

### Mobile App

| Technology | Version | Purpose |
|------------|---------|---------|
| React Native | 0.76 | Native mobile UI |
| Expo SDK | 52 | Development \& build platform |
| TypeScript | 5.9 | Type safety |
| React Navigation | v7 | Screen navigation |
| React Native Paper | v5 | Material Design 3 components |
| Zustand | ^5.x | Global state management |
| React Query | ^5.x | Server-state \& caching |
| MMKV | ^2.x | Local persistent storage |
| Axios | ^1.x | HTTP client |
| expo-camera | ~16.0 | Camera access |
| expo-location | ~18.0 | GPS tracking |

### Backend

| Technology | Purpose |
|------------|---------|
| Node.js + Express 5 | API server |
| TypeScript 5.9 | Type safety |
| MobileNet-V2 | AI feature extraction |
| TensorFlow.js | ML runtime |
| PostgreSQL + pgvector | Database \& embeddings |
| Helmet | Security headers |
| CORS | Cross-origin handling |

### DevOps & Infrastructure

| Technology | Purpose |
|------------|---------|
| Docker Compose | Multi-service orchestration |
| GitHub Actions | CI/CD pipelines |
| EAS Build | Mobile build service |
| Nginx Proxy Manager | Reverse proxy \& SSL |

---

## 📋 Prerequisites

### Required Software

| Tool | Version | Installation |
|------|---------|--------------|
| Docker | Latest | [docker.com](https://docker.com) |
| Docker Compose | v2.x | Included with Docker Desktop |
| Node.js | 20+ LTS | [nodejs.org](https://nodejs.org) |
| Git | 2.x | [git-scm.com](https://git-scm.com) |

### Hardware Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| RAM | 8 GB | 16 GB |
| Storage | 10 GB free | 20 GB free |
| CPU | 4 cores | 8 cores |

### Optional

- **Expo Account** (for EAS builds): [expo.dev/signup](https://expo.dev/signup)
- **Android Studio** (for emulator): [developer.android.com/studio](https://developer.android.com/studio)
- **Xcode** (for iOS, macOS only): [App Store](https://apps.apple.com/de/app/xcode/id497799835)

---

## 🚀 Quick Start

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/openfugjoobot/tauben-scanner.git
cd tauben-scanner
\`\`\`

### 2. Configure Environment

\`\`\`bash
# Copy environment files
cp .env.example .env
cp backend/.env.example backend/.env
cp mobile/.env.example mobile/.env
\`\`\`

### 3. Start Backend Services

\`\`\`bash
# Start all Docker services
docker-compose up -d

# Verify services are healthy
curl http://localhost:3000/health
curl -H "X-API-Key: your-key" http://localhost:3000/api/pigeons
\`\`\`

### 4. Start Mobile App

\`\`\`bash
cd mobile
npm install
npx expo start
\`\`\`

Then scan the QR code with **Expo Go** app on your device.

---

## ⚙️ Configuration

### Backend Environment Variables

Create \`backend/.env\` from \`backend/.env.example\`:

\`\`\`bash
# ============================================
# Required Configuration
# ============================================

# Database Connection (REQUIRED)
DATABASE_URL=postgresql://tauben:your_password@localhost:5432/tauben_scanner

# Server
PORT=3000
NODE_ENV=production

# API Key Authentication (Generate with: npm run generate-api-key)
API_KEY=your_secure_api_key_here_min_32_characters
cd backend && npm run generate-api-key
\`\`\`

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| \`DATABASE_URL\` | ✅ | - | PostgreSQL connection string |
| \`PORT\` | ✅ | 3000 | API server port |
| \`NODE_ENV\` | ✅ | production | Environment mode |
| \`API_KEY\` | ⚠️ | - | Authentication key (recommended for prod) |
| \`CORS_ORIGINS\` | ✅ | - | Comma-separated allowed origins |
| \`RATE_LIMIT_WINDOW_MS\` | ❌ | 900000 | Rate limit window (ms) |
| \`RATE_LIMIT_MAX_REQUESTS\` | ❌ | 100 | Max requests per window |
| \`RATE_LIMIT_UPLOAD_MAX\` | ❌ | 10 | Max upload requests per window |
| \`JWT_SECRET\` | ❌ | - | JWT token secret |
| \`UPLOADS_DIR\` | ❌ | /app/uploads | Image storage path |

### Mobile Environment Variables

Create \`mobile/.env\` from \`mobile/.env.example\`:

\`\`\`bash
# API URL (REQUIRED)
EXPO_PUBLIC_API_URL=http://localhost:3000/api

# For LAN development:
# EXPO_PUBLIC_API_URL=http://192.168.1.100:3000/api

# For production:
# EXPO_PUBLIC_API_URL=https://api.your-domain.com/api

# Storage Encryption Key (REQUIRED - 32+ chars)
EXPO_PUBLIC_STORAGE_KEY=your-secure-storage-key-change-in-production

# Debug Mode (optional)
EXPO_PUBLIC_ENABLE_DEBUG_MODE=false

# Offline Mode (optional)
EXPO_PUBLIC_ENABLE_OFFLINE_MODE=true
\`\`\`

| Variable | Required | Description |
|----------|----------|-------------|
| \`EXPO_PUBLIC_API_URL\` | ✅ | Backend API URL |
| \`EXPO_PUBLIC_STORAGE_KEY\` | ✅ | Local storage encryption key |
| \`EXPO_PUBLIC_DEFAULT_API_KEY\` | ❌ | Default API key for dev builds |
| \`EXPO_PUBLIC_ENABLE_DEBUG_MODE\` | ❌ | Enable debug features |
| \`EXPO_PUBLIC_ENABLE_OFFLINE_MODE\` | ❌ | Enable offline capabilities |
| \`EXPO_PUBLIC_SENTRY_DSN\` | ❌ | Sentry error tracking |
| \`EXPO_PUBLIC_SENTRY_ENVIRONMENT\` | ❌ | Sentry environment tag |

### API Key Generation

Generate a secure API key for production:

\`\`\`bash
cd backend
npm run generate-api-key

# Output example:
# === API Key Generator ===
# Generated API Key:
# ------------------
# 3a7f9b2c8e5d1a4b6c0f3e8d5a2b7c1f4e0d8a5b2c6f3e9d1a7b4c0f2e8d5a1
# ------------------
# Add this to your .env file: API_KEY=...
\`\`\`

Copy the generated key to your \`backend/.env\` file.

---

## 💻 Development

### Backend Development

\`\`\`bash
cd backend

# Install dependencies
npm install

# Run development server with hot reload
npm run dev

# Build TypeScript
npm run build

# Run tests
npm test
npm run test:coverage
npm run test:watch
\`\`\`

### Mobile Development

\`\`\`bash
cd mobile

# Install dependencies
npm install

# Start development server
npx expo start

# Run on Android emulator
npx expo run:android

# Run on iOS simulator (macOS only)
npx expo run:ios

# Clear cache and restart
npx expo start --clear

# Run tests
npm test
npm run test:coverage

# Lint and type check
npm run lint
npm run typecheck
\`\`\`

### Using Expo Go (Recommended for Development)

1. Install **Expo Go** on your device:
   - [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)

2. Start the dev server:
   \`\`\`bash
   cd mobile && npx expo start
   \`\`\`

3. Scan the QR code with Expo Go

4. The app will hot-reload on code changes

---

## 📚 API Documentation

### Base URL

- **Development:** \`http://localhost:3000\`
- **Production:** \`https://your-domain.com\`

### Authentication

API endpoints require authentication via one of these methods:

**Header: X-API-Key**
\`\`\`bash
curl -H "X-API-Key: YOUR_API_KEY" http://localhost:3000/api/pigeons
\`\`\`

**Header: Authorization Bearer**
\`\`\`bash
curl -H "Authorization: Bearer YOUR_API_KEY" http://localhost:3000/api/pigeons
\`\`\`

### Endpoints

#### Health Checks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | \`/health\` | Basic health check |
| GET | \`/health/detailed\` | Detailed service status |
| GET | \`/health/live\` | Liveness probe |
| GET | \`/health/ready\` | Readiness probe |

**Response Example:**
\`\`\`json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "services": {
    "database": "connected",
    "storage": "connected"
  }
}
\`\`\`

#### Image Matching

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | \`/api/images/match\` | Match pigeon photo against database |

**Request:**
\`\`\`json
{
  "photo": "data:image/jpeg;base64,/9j/4AAQSkZJRgAB...",
  "threshold": 0.80,
  "location": {
    "lat": 52.52,
    "lng": 13.405,
    "name": "Berlin"
  }
}
\`\`\`

**Response (Match Found):**
\`\`\`json
{
  "match": true,
  "pigeon": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Rudi Rothen",
    "photo_url": "/uploads/rudi_2024.jpg"
  },
  "confidence": 0.9234
}
\`\`\`

**Response (No Match):**
\`\`\`json
{
  "match": false,
  "confidence": 0,
  "suggestion": "Register as new pigeon?"
}
\`\`\`

#### Pigeons

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | \`/api/pigeons\` | List all pigeons (paginated) |
| POST | \`/api/pigeons\` | Register new pigeon |
| GET | \`/api/pigeons/:id\` | Get pigeon details |

**Create Pigeon Request:**
\`\`\`json
{
  "name": "Rudi Rothen",
  "photo": "data:image/jpeg;base64,/9j/4AAQSkZJRgAB...",
  "description": "Red ring on left foot",
  "location": { "lat": 52.52, "lng": 13.405, "name": "Berlin" }
}
\`\`\`

#### Sightings

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | \`/api/sightings\` | Record a new sighting |

For complete API documentation, see [docs/API.md](docs/API.md).

---

## 🚀 Deployment

### Docker Compose Deployment

\`\`\`bash
# Clone repository
git clone https://github.com/openfugjoobot/tauben-scanner.git
cd tauben-scanner

# Configure environment
cp .env.example .env
nano .env  # Edit your values

# Build and start services
docker-compose up -d --build

# View logs
docker-compose logs -f api
\`\`\`

### Production Checklist

- [ ] Set strong \`API_KEY\` in \`backend/.env\`
- [ ] Configure \`CORS_ORIGINS\` for your domain
- [ ] Set \`NODE_ENV=production\`
- [ ] Use strong \`DB_PASSWORD\` for PostgreSQL
- [ ] Enable HTTPS with reverse proxy (Nginx/Caddy)
- [ ] Set up SSL certificates
- [ ] Configure firewall rules (only 443/3000 exposed)
- [ ] Set up database backups (see [docs/BACKUP.md](docs/BACKUP.md))
- [ ] Configure monitoring (health checks)
- [ ] Set up log rotation
- [ ] Test rate limiting
- [ ] Verify API key authentication works

### EAS Build (Mobile App)

\`\`\`bash
cd mobile

# Login to Expo
npx expo login

# Configure EAS
npx eas build:configure

# Preview build (Android APK)
eas build --platform android --profile preview

# Production build (Android AAB)
eas build --platform android --profile production

# iOS build (requires Apple Developer account)
eas build --platform ios --profile production
\`\`\`

### OTA Updates (Expo)

\`\`\`bash
# Publish update to production channel
eas update --channel production --message "Bug fixes and improvements"

# Publish to preview channel
eas update --channel preview --message "New features preview"
\`\`\`

For detailed deployment instructions, see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

---

## 🔧 Troubleshooting

### Backend Issues

**"Cannot connect to Docker daemon"**
\`\`\`bash
sudo usermod -aG docker $USER
newgrp docker  # Or logout/login
\`\`\`

**"Port 3000 already in use"**
\`\`\`bash
# Find and kill process
sudo lsof -i :3000
sudo kill -9 <PID>
\`\`\`

**Database connection failed**
\`\`\`bash
# Check logs
docker-compose logs postgres

# Restart services
docker-compose down
docker-compose up -d
\`\`\`

**API key authentication fails**
\`\`\`bash
# Verify API_KEY is set
printf "${API_KEY}\n"  # In backend/.env

# Generate new key
cd backend && npm run generate-api-key
\`\`\`

### Mobile App Issues

**"expo command not found"**
\`\`\`bash
npm install -g @expo/cli
# Or: npx expo <command>
\`\`\`

**"Could not connect to development server"**
\`\`\`bash
# Check firewall
# Ensure device and computer are on same network
# Use tunnel mode
npx expo start --tunnel
\`\`\`

**Images not loading**
\`\`\`bash
# Check CORS_ORIGINS includes your API URL
# Verify API base URL in mobile/.env
# Check API key is valid
\`\`\`

**OTA updates not working**
\`\`\`bash
# Verify runtimeVersion in app.json
# Check channel name matches eas update command
# App must start at least once to receive updates
\`\`\`

### Common Issues

| Issue | Solution |
|-------|----------|
| 502 Bad Gateway | Check tauben-api container is running |
| CORS errors | Verify CORS_ORIGINS includes client origin |
| Images not serving | Verify uploads_data volume permissions |
| Slow matching | Check pgvector HNSW index is created |

For more troubleshooting, see [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md).

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create a branch:** \`git checkout -b feature/amazing-feature\`
3. **Commit your changes:** \`git commit -m 'feat: Add amazing feature'\`
4. **Push to the branch:** \`git push origin feature/amazing-feature\`
5. **Open a Pull Request**

### Commit Convention

- \`feat:\` New features
- \`fix:\` Bug fixes
- \`docs:\` Documentation changes
- \`refactor:\` Code refactoring
- \`test:\` Adding tests
- \`chore:\` Maintenance tasks

### Code Standards

- TypeScript strict mode enabled
- ESLint + Prettier configured
- All tests must pass
- API changes require documentation updates

---

## 📝 License

MIT License — see [LICENSE](LICENSE) file for details.

---

## 📖 Documentation Links

| Document | Description |
|----------|-------------|
| [docs/API.md](docs/API.md) | Complete REST API reference |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | System architecture & data flow |
| [docs/DATABASE.md](docs/DATABASE.md) | PostgreSQL schema & tables |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Production deployment guide |
| [docs/SETUP.md](docs/SETUP.md) | Development environment setup |
| [docs/MOBILE.md](docs/MOBILE.md) | Mobile app development |
| [docs/BACKUP.md](docs/BACKUP.md) | Backup strategies |
| [docs/CHANGELOG.md](docs/CHANGELOG.md) | Change history |

---

**Made with ❤️ by OpenFugjooBot**

For support, open an issue on GitHub or contact the maintainers.
