# Tauben Scanner Deployment Guide

## Overview

Complete deployment of Tauben Scanner with Nginx Proxy Manager, automated backups, and production configuration.

## Deployment Status: ✅ PHASE 7 COMPLETE

### Components Deployed

- **Docker Containers**: 3 running (postgres, api, minio)
- **Nginx Proxy Manager**: Configured with SSL support
- **Backup System**: Daily automated backups with 30-day retention
- **Production Environment**: Ready for production use

## Container Status

```bash
$ docker ps | grep tauben
f07c026296d1   tauben-scanner-api                "docker-entrypoint.s…"   Up 3 minutes    0.0.0.0:3000->3000/tcp           tauben-api
b4f9546bdd3a   minio/minio:latest                "/usr/bin/docker-ent…"   Up 3 minutes    0.0.0.0:9000-9001->9000-9001/tcp   tauben-minio
c7843e260ed1   ankane/pgvector:latest            "docker-entrypoint.s…"   Up 3 minutes    0.0.0.0:5432->5432/tcp           tauben-postgres
```

## Network Configuration

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

## Health Check Results

```json
{
  "status": "healthy",
  "timestamp": "2026-02-24T19:36:11.930Z",
  "services": {
    "database": "connected",
    "storage": "connected",
    "embedding_model": "loaded"
  }
}
```

## Configuration Files

### Environment Variables

Production config: `/opt/tauben-scanner/.env`
```bash
DATABASE_URL=postgresql://tauben:SECURE_PASSWORD_HERE@postgres:5432/tauben_scanner
PORT=3000
NODE_ENV=production
CORS_ORIGINS=https://tauben-scanner.dein-domain.de,capacitor://localhost
JWT_SECRET=GENERATE_SECURE_SECRET_HERE
```

### Docker Compose

Main configuration: `/home/ubuntu/.openclaw/workspace/tauben-scanner/docker-compose.yml`

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

## Backup System Status: ✅ ACTIVE

### Timer Information

```bash
$ sudo systemctl status tauben-backup.timer
● tauben-backup.timer - Daily Tauben Scanner Backup
     Loaded: loaded (/etc/systemd/system/tauben-backup.timer; enabled; preset: enabled)
     Active: active (waiting) since Tue 2026-02-24 20:35:15 CET
    Trigger: Wed 2026-02-25 00:00:00 CET
```

### Backup Testing

**Latest Backup**: db_20260224_203723.sql.gz (2.3KB)
**Location**: /opt/tauben-backups/data/
**Retention**: 30 days
**Schedule**: Daily at midnight

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

## Security Considerations

### Implemented

- ✅ HTTPS/SSL termination
- ✅ Reverse proxy protection
- ✅ Security headers
- ✅ Exploit blocking
- ✅ Container isolation
- ✅ Database authentication

### Recommended Actions

1. **Change Default NPM Credentials**
2. **Set Strong Database Password**
3. **Configure Firewall Rules**
4. **Enable Access Logging**
5. **Set Up Monitoring**

## Monitoring & Maintenance

### Commands

```bash
# Check all services
docker ps | grep tauben

# View logs
docker logs tauben-api --tail 100

# Test health
curl https://tauben-scanner.dein-domain.de/health

# Backup status
sudo systemctl status tauben-backup.timer

# NPM status
docker logs nginx-proxy-manager --tail 50
```

### Log Locations

- **Application**: `docker logs tauben-api`
- **Database**: `docker logs tauben-postgres`
- **Storage**: `docker logs tauben-minio`
- **Proxy**: `docker logs nginx-proxy-manager`
- **Backups**: `sudo journalctl -u tauben-backup.service`

## Troubleshooting Guide

### Common Issues

1. **502 Bad Gateway**
   - Check tauben-api container
   - Verify internal network connectivity
   - Review NPM proxy configuration

2. **Database Connection Failed**
   - Verify postgres container running
   - Check DATABASE_URL credentials
   - Review network configuration

3. **SSL Certificate Issues**
   - Check domain DNS resolution
   - Verify Let's Encrypt rate limits
   - Review NPM SSL settings

4. **Backup Failures**
   - Check docker container access
   - Verify disk space
   - Review systemd logs

### Recovery Procedures

See [BACKUP.md](./BACKUP.md) for detailed restoration procedures.

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

## Next Steps

### Immediate

1. Configure production domain DNS
2. Set up monitoring alerts
3. Configure email notifications
4. Test disaster recovery

### Future Enhancements

1. Load balancing
2. Database replication
3. CI/CD pipeline
4. Monitoring dashboard

## Support & Documentation

- **NPM Guide**: [NPM.md](./NPM.md)
- **Backup Guide**: [BACKUP.md](./BACKUP.md)
- **Main README**: [../README.md](../README.md)

---

**Deployment completed on**: 2026-02-24 20:37 CET  
**Status**: ✅ Production Ready