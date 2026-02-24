# Deployment Guide

Diese Anleitung beschreibt das Deployment des KI Tauben Scanner in Produktionsumgebungen.

**Zielplattformen:**
- Docker Compose (empfohlen)
- VPS / Dedicated Server
- Cloud (AWS, GCP, Azure - manuelle Konfiguration)

---

## 📋 Inhaltsverzeichnis

- [Voraussetzungen](#voraussetzungen)
- [Docker Compose Deployment](#docker-compose-deployment)
- [Umgebungsvariablen](#umgebungsvariablen)
- [Nginx Proxy Manager](#nginx-proxy-manager)
- [SSL-Zertifikate](#ssl-zertifikate)
- [Backup-Strategie](#backup-strategie)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)
- [Performance-Optimierung](#performance-optimierung)

---

## Voraussetzungen

### Hardware

| Komponente | Minimum | Empfohlen |
|------------|---------|-----------|
| CPU | 2 Cores | 4 Cores |
| RAM | 2 GB | 4 GB |
| Storage | 20 GB SSD | 50 GB SSD |
| Netzwerk | Öffentliche IP | Domäne + SSL |

### Software

- **Docker** 24.0+
- **Docker Compose** 2.20+
- **Git** (für Cloning)

### Ports

| Port | Service | Extern erreichbar |
|------|---------|-------------------|
| 80 | HTTP | Ja |
| 443 | HTTPS | Ja |
| 3000 | API (via Proxy) | Optional |
| 5432 | PostgreSQL | Nein |
| 9000 | MinIO API | Optional |
| 9001 | MinIO Console | Optional |

---

## Docker Compose Deployment

### 1. Repository klonen

```bash
git clone https://github.com/openfugjoobot/tauben-scanner.git
cd tauben-scanner
```

### 2. Umgebungsvariablen konfigurieren

```bash
cp .env.example .env
nano .env  # oder vi .env
```

**Wichtige Werte:**
```bash
# Starke Passwörter setzen!
DB_PASSWORD=$(openssl rand -base64 32)
MINIO_PASSWORD=$(openssl rand -base64 32)

echo "PORT=3000" > .env
echo "NODE_ENV=production" >> .env
echo "DB_PASSWORD=$DB_PASSWORD" >> .env
echo "MINIO_USER=minioadmin" >> .env
echo "MINIO_PASSWORD=$MINIO_PASSWORD" >> .env
echo "DATABASE_URL=postgresql://tauben:$DB_PASSWORD@postgres:5432/tauben_scanner" >> .env
echo "CORS_ORIGINS=https://taube.dein-domain.com" >> .env
```

### 3. Production Docker Compose erstellen

Erstelle eine `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  # PostgreSQL Database
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
    networks:
      - tauben-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U tauben"]
      interval: 10s
      timeout: 5s
      retries: 5

  # API Backend
  api:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: tauben-api
    restart: unless-stopped
    environment:
      NODE_ENV: production
      PORT: 3000
      DATABASE_URL: ${DATABASE_URL}
      CORS_ORIGINS: ${CORS_ORIGINS}
    networks:
      - tauben-network
    depends_on:
      postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # MinIO Object Storage
  minio:
    image: minio/minio:latest
    container_name: tauben-minio
    restart: unless-stopped
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: ${MINIO_USER:-admin}
      MINIO_ROOT_PASSWORD: ${MINIO_PASSWORD}
      MINIO_BROWSER_REDIRECT_URL: https://minio-console.dein-domain.com
    volumes:
      - minio_data:/data
    networks:
      - tauben-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 30s
      timeout: 20s
      retries: 3

volumes:
  postgres_data:
    driver: local
  minio_data:
    driver: local

networks:
  tauben-network:
    driver: bridge
```

### 4. Starten

```bash
# Production Stack starten
docker-compose -f docker-compose.prod.yml up -d

# Logs prüfen
docker-compose -f docker-compose.prod.yml logs -f api

# Status prüfen
docker-compose -f docker-compose.prod.yml ps
```

---

## Umgebungsvariablen

### Erforderliche Variablen

| Variable | Beschreibung | Beispiel |
|----------|--------------|----------|
| `PORT` | API Port | `3000` |
| `NODE_ENV` | Umgebung | `production` |
| `DATABASE_URL` | PostgreSQL Connection | `postgresql://...` |
| `DB_PASSWORD` | DB Passwort | `[starkes-passwort]` |
| `MINIO_USER` | MinIO Username | `admin` |
| `MINIO_PASSWORD` | MinIO Passwort | `[starkes-passwort]` |
| `CORS_ORIGINS` | Erlaubte Origins | `https://domain.com` |

### Optionale Variablen

| Variable | Default | Beschreibung |
|----------|---------|--------------|
| `LOG_LEVEL` | `info` | Log Ausführlichkeit |
| `API_TOKENS` | - | Komma-separierte API Keys |
| `MAX_FILE_SIZE` | `10mb` | Maximale Upload-Größe |
| `RATE_LIMIT_WINDOW` | `15` | Rate Limit Zeitfenster (Minuten) |
| `RATE_LIMIT_MAX` | `100` | Max Requests pro Zeitfenster |

---

## Nginx Proxy Manager

Für SSL-Terminierung und Reverse Proxy empfehlen wir **Nginx Proxy Manager**.

### 1. NPM installieren

```bash
# docker-compose für NPM
cat >> docker-compose.yml << 'EOF'

  # Nginx Proxy Manager
  npm:
    image: 'jc21/nginx-proxy-manager:latest'
    container_name: npm
    restart: unless-stopped
    ports:
      - '80:80'
      - '443:443'
      - '81:81'  # Admin UI
    volumes:
      - npm_data:/data
      - npm_letsencrypt:/etc/letsencrypt
    networks:
      - tauben-network

volumes:
  npm_data:
  npm_letsencrypt:
EOF
```

### 2. NPM starten

```bash
docker-compose up -d npm
```

### 3. Einrichtung

1. **Admin UI öffnen:** `http://deine-ip:81`
2. **Login:**
   - Email: `admin@example.com`
   - Passwort: `changeme`
3. **Sicheres Passwort setzen**
4. **Proxy Hosts hinzufügen:**

#### API Proxy

| Einstellung | Wert |
|-------------|------|
| Domain Names | `api.taube.dein-domain.com` |
| Scheme | `http` |
| Forward Hostname / IP | `tauben-api` |
| Forward Port | `3000` |

**Advanced Settings:**
```nginx
# API spezifisch
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";

# Upload Größe
client_max_body_size 50M;
```

#### MinIO Console Proxy

| Einstellung | Wert |
|-------------|------|
| Domain Names | `minio-console.dein-domain.com` |
| Scheme | `http` |
| Forward Hostname / IP | `tauben-minio` |
| Forward Port | `9001` |

---

## SSL-Zertifikate

### Automatisch mit Let's Encrypt

1. **NPM Admin UI öffnen:** `http://deine-ip:81`
2. **SSL Certificates** → **Add SSL Certificate**
3. **Let's Encrypt** auswählen
4. **Domain** eingeben
5. **Agree to terms** akzeptieren
6. **Save**

### Manuelle Zertifikate

Wenn du eigene Zertifikate hast:

```bash
# Zertifikate in NPM Volume kopieren
docker cp dein-cert.pem npm:/data/certbot/live/dein-domain/cert.pem
docker cp dein-key.pem npm:/data/certbot/live/dein-domain/privkey.pem
```

### Cloudflare DNS-01 Challenge

Für interne Netzwerke oder Wildcard-Zertifikate:

1. Cloudflare API Token erstellen
2. In NPM unter **SSL Certificates** → **Add SSL Certificate**
3. **DNS Challenge** auswählen
4. **DNS Provider:** Cloudflare
5. API Token eingeben

---

## Backup-Strategie

### Automatisierte Backups

Erstelle ein Backup-Script `backup.sh`:

```bash
#!/bin/bash
# backup.sh - Automatische Backups für Tauben Scanner

set -e

# Konfiguration
BACKUP_DIR="/opt/backups/tauben-scanner"
RETENTION_DAYS=30
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
CONTAINER_NAME="tauben-postgres"
DB_NAME="tauben_scanner"
DB_USER="tauben"

# Verzeichnis erstellen
mkdir -p "$BACKUP_DIR"

# PostgreSQL Backup
echo "Erstelle Datenbank-Backup..."
docker exec $CONTAINER_NAME pg_dump \
  -U $DB_USER \
  -d $DB_NAME \
  -F custom \
  -f /tmp/db_backup_$TIMESTAMP.dump

docker cp $CONTAINER_NAME:/tmp/db_backup_$TIMESTAMP.dump \
  $BACKUP_DIR/db_backup_$TIMESTAMP.dump

docker exec $CONTAINER_NAME rm /tmp/db_backup_$TIMESTAMP.dump

# MinIO Backup (falls verwendet)
echo "Erstelle MinIO Backup..."
docker run --rm \
  --volumes-from tauben-minio \
  -v $BACKUP_DIR:/backup \
  alpine tar czf /backup/minio_data_$TIMESTAMP.tar.gz /data

# .env Backup
echo "Backup .env..."
cp .env $BACKUP_DIR/env_backup_$TIMESTAMP

# Alte Backups löschen
echo "Lösche alte Backups (älter als $RETENTION_DAYS Tage)..."
find $BACKUP_DIR -name "db_backup_*.dump" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -name "minio_data_*.tar.gz" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -name "env_backup_*" -mtime +$RETENTION_DAYS -delete

echo "Backup abgeschlossen: $BACKUP_DIR/db_backup_$TIMESTAMP.dump"
```

### Cron einrichten

```bash
# Script ausführbar machen
chmod +x backup.sh

# Alle Tage um 2 Uhr
sudo crontab -e

# Hinzufügen:
0 2 * * * /pfad/zu/tauben-scanner/backup.sh >> /var/log/tauben-backup.log 2>>1
```

### Backup-Restore

```bash
# PostgreSQL Restore
dockerexec -i tauben-postgres pg_restore \
  -U tauben \
  -d tauben_scanner \
  --clean --if-exists \
  < db_backup_20240115_020000.dump

# MinIO Restore
docker run --rm \
  --volumes-from tauben-minio \
  -v $(pwd):/backup \
  alpine sh -c "cd /data && tar xzf /backup/minio_data_20240115_020000.tar.gz"
```

---

## Monitoring

### Health Checks

```bash
# API Health
curl -f https://api.taube.dein-domain.com/health

# Datenbank
docker exec tauben-postgres pg_isready -U tauben

# Alle Services
docker-compose -f docker-compose.prod.yml ps
```

### Prometheus + Grafana (Optional)

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'tauben-scanner'
    static_configs:
      - targets: ['tauben-api:3000']
    metrics_path: '/metrics'
```

### Simple Monitoring

Bash-Script für Watchdog:

```bash
#!/bin/bash
# monitor.sh

API_URL="https://api.taube.dein-domain.com/health"
WEBHOOK_URL="https://hooks.slack.com/services/..."

if ! curl -f -s $API_URL > /dev/null; then
  echo "$(date): API nicht erreichbar!"
  # Alert senden (Slack, Discord, PagerDuty)
  curl -X POST -H 'Content-type: application/json' \
    --data '{"text":"🚨 Tauben Scanner API DOWN!"}' \
    $WEBHOOK_URL
fi
```

---

## Troubleshooting

### Datenbank startet nicht

```bash
# Logs prüfen
docker logs tauben-postgres

# Volume überprüfen
docker volume ls | grep postgres

# Rechte prüfen
docker exec tauben-postgres ls -la /var/lib/postgresql/data

# Manuelles Initialisieren
docker exec -i tauben-postgres psql -U tauben -d tauben_scanner < docker/init.sql
```

### API Connection refused

```bash
# API-Logs prüfen
docker logs tauben-api --tail 100

# DATABASE_URL überprüfen
docker exec tauben-api env | grep DATABASE

# Netzwerk prüfen
docker network inspect tauben-network

# Container neustarten
docker-compose -f docker-compose.prod.yml restart api
```

### SSL-Zertifikat Fehler

```bash
# Certbot-Logs prüfen
docker logs npm --tail 50

# Zertifikat manuell erneuern
docker exec npm certbot renew

# NPM neustarten
docker-compose restart npm
```

### Hohe CPU/Memory Nutzung

```bash
# Resource Usage
docker stats

# Logs mit Resource-Errors
docker logs tauben-api 2>&1 | grep -i "memory\|heap"

# Container Limits setzen (docker-compose.yml)
services:
  api:
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 2G
        reservations:
          cpus: '0.5'
          memory: 512M
```

### Bild-Matching langsam

```sql
-- In PostgreSQL
-- Index Status prüfen
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'pigeons';

-- VACUUM ausführen
VACUUM ANALYZE pigeons;

-- Index neu aufbauen
REINDEX INDEX pigeons_embedding_idx;
```

---

## Performance-Optimierung

### Database Tuning

Editiere `docker/init.sql` oder führe nachträglich aus:

```sql
-- PostgreSQL Tuning für pgvector
ALTER SYSTEM SET shared_buffers = '1GB';
ALTER SYSTEM SET effective_cache_size = '3GB';
ALTER SYSTEM SET work_mem = '256MB';
ALTER SYSTEM SET maintenance_work_mem = '512MB';
ALTER SYSTEM SET max_connections = 100;

-- Neustart erforderlich
```

### API Caching

```yaml
# docker-compose.prod.yml
services:
  api:
    deploy:
      resources:
        limits:
          memory: 1GB
    environment:
      NODE_OPTIONS: "--max-old-space-size=768"
```

### Reverse Proxy Caching

```nginx
# In NPM oder Nginx
location /api/pigeons {
    proxy_pass http://tauben-api:3000;
    
    # Cache API-Responses
    proxy_cache_path /app/cache levels=1:2 keys_zone=api_cache:10m;
    proxy_cache_valid 200 5m;
    proxy_cache_use_stale error timeout updating;
    
    # Gzip Komprimierung
    gzip on;
    gzip_types application/json;
}
```

---

## Sicherheit

### Firewall

```bash
# U FW (Ubuntu)
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow http
ufw allow https
ufw enable
```

### Fail2Ban

```bash
sudo apt install fail2ban

# Konfiguration /etc/fail2ban/jail.local
cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[nginx-http-auth]
enabled = true

[nginx-botsearch]
enabled = true

[nginx-limit-req]
enabled = true

[custom-api]
enabled = true
port = http,https
filter = custom-api
logpath = /var/log/tauben-api.log
maxretry = 10
EOF
```

### Security Headers

Über Nginx Proxy Manager oder in API hinzufügen:

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; img-src 'self' data:;" always;
```

---

## Update/Upgrade

### Zero-Downtime Update

```bash
# 1. Neues Image builden
docker-compose -f docker-compose.prod.yml build api

# 2. Neue Version starten (ohne alte zu stoppen)
# Für echtes Zero-Downtime: Blue-Green oder Rolling Update

# 3. Neustart mit kurzem Downtime
docker-compose -f docker-compose.prod.yml up -d --no-deps api

# 4. Alte Images aufräumen
docker image prune -f
```

### Datenbank Migrationen

```bash
# Backup vor Migration
./backup.sh

# Migration ausführen (falls vorhanden)
docker exec -i tauben-postgres psql -U tauben -d tauben_scanner < migrations/001_add_field.sql
```

---

**Zurück zur [Hauptdokumentation](../README.md)**
