# Nginx Proxy Manager Configuration

## Overview

Nginx Proxy Manager (NPM) is configured as a reverse proxy for the Tauben Scanner application.

## Setup

NPM is already running as a Docker container:

```bash
Container: nginx-proxy-manager
Image: jc21/nginx-proxy-manager:latest
Ports: 80, 443, 81
Volumes: /opt/npm-data, /opt/npm-letsencrypt
```

## Access

- **Admin Interface**: http://localhost:81
- **Default Credentials**: admin@example.com / changeme

## Proxy Host Configuration

### Basic Setup

1. Navigate to **Hosts** → **Proxy Hosts**
2. Click **Add Proxy Host**

### Settings

**Details Tab:**
- **Domain Names**: tauben-scanner.dein-domain.de
- **Scheme**: http
- **Forward Hostname/IP**: tauben-api
- **Forward Port**: 3000
- **Block Common Exploits**: ✅
- **Websockets Support**: ✅
- **Cache Assets**: ✅

**SSL Tab:**
- **SSL Certificate**: Request a new SSL Certificate
- **Agree to Let's Encrypt Terms of Service**: ✅
- **Force SSL**: ✅
- **HTTP/2 Support**: ✅

**Custom Locations** (if needed):
```
Location: /api
Scheme: http
Forward Hostname/IP: tauben-api
Forward Port: 3000
```

## Security Headers

Add these custom locations for enhanced security:

```
Location: /
Custom Location: /api
```

**Headers Tab:**
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: "1; mode=block"
- Strict-Transport-Security: max-age=31536000; includeSubDomains

## Troubleshooting

### Common Issues

1. **502 Bad Gateway**: Check if tauben-api container is running
2. **SSL Certificate Issues**: Verify domain DNS configuration
3. **Connection Timeout**: Check firewall rules

### Logs

```bash
# NPM logs
docker logs nginx-proxy-manager

# Tauben API logs
docker logs tauben-api
```

### Container Status

```bash
docker ps | grep nginx-proxy-manager
docker ps | grep tauben-api
```

## Maintenance

### Backup NPM Configuration

```bash
sudo cp -r /opt/npm-data /opt/npm-data-backup
```

### Update NPM

```bash
# Pull latest image
docker pull jc21/nginx-proxy-manager:latest

# Recreate container
docker stop nginx-proxy-manager
docker rm nginx-proxy-manager
docker run -d \
  --name nginx-proxy-manager \
  --restart unless-stopped \
  -p 80:80 \
  -p 443:443 \
  -p 81:81 \
  -v /opt/npm-data:/data \
  -v /opt/npm-letsencrypt:/etc/letsencrypt \
  jc21/nginx-proxy-manager:latest
```