# Backup System for Tauben Scanner

## Overview

Automated backup system using systemd timers for daily database backups with 30-day retention.

## Setup

### Directory Structure

```
/opt/tauben-backups/
├── scripts/
│   └── backup.sh          # Main backup script
└── data/                  # Backup storage location
```

### Backup Script

Location: `/opt/tauben-backups/scripts/backup.sh`

```bash
#!/bin/bash
# Tauben Scanner Backup Script
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/tauben-backups/data"
DB_CONTAINER="tauben-postgres"
RETENTION_DAYS=30

# PostgreSQL backup
docker exec $DB_CONTAINER pg_dump -U tauben tauben_scanner > "$BACKUP_DIR/db_$DATE.sql"

# Compress backup
gzip "$BACKUP_DIR/db_$DATE.sql"

# Delete old backups (30 days)
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +$RETENTION_DAYS -delete

# Log
logger "Tauben Scanner backup completed: db_$DATE.sql.gz"
```

### Systemd Timer

**Service File:** `/etc/systemd/system/tauben-backup.service`
```ini
[Unit]
Description=Tauben Scanner Backup

[Service]
Type=oneshot
ExecStart=/opt/tauben-backups/scripts/backup.sh
```

**Timer File:** `/etc/systemd/system/tauben-backup.timer`
```ini
[Unit]
Description=Daily Tauben Scanner Backup

[Timer]
OnCalendar=daily
Persistent=true

[Install]
WantedBy=timers.target
```

## Usage

### Manual Backup

```bash
# Run backup manually
sudo /opt/tauben-backups/scripts/backup.sh

# Check output
ls -la /opt/tauben-backups/data/
```

### Timer Management

```bash
# Check timer status
sudo systemctl status tauben-backup.timer

# Enable timer (starts on boot)
sudo systemctl enable tauben-backup.timer

# Start timer
sudo systemctl start tauben-backup.timer

# Stop timer
sudo systemctl stop tauben-backup.timer

# Check last run
sudo systemctl status tauben-backup.service

# List all timers
systemctl list-timers --all
```

## Backup Files

### Naming Convention

Backups are named with timestamp: `db_YYYYMMDD_HHMMSS.sql.gz`

Example: `db_20260224_203015.sql.gz`

### File Structure

```bash
# Compressed SQL dump
db_20260224_203015.sql.gz

# Contains:
-- Database schema
-- All tables and data
-- Indexes and constraints
-- pgvector extension data
```

## Restoration

### Full Database Restore

```bash
# Stop the application
docker-compose stop api

# Extract backup (if needed)
gunzip /opt/tauben-backups/data/db_20260224_203015.sql.gz

# Restore database
docker exec -i tauben-postgres psql -U tauben -c "DROP DATABASE IF EXISTS tauben_scanner;"
docker exec -i tauben-postgres psql -U tauben -c "CREATE DATABASE tauben_scanner;"
docker exec -i tauben-postgres psql -U tauben tauben_scanner < /opt/tauben-backups/data/db_20260224_203015.sql

# restart the application
docker-compose start api
```

### Point-in-Time Restore (Advanced)

For specific table restoration or partial recovery:

```bash
# Export specific table from backup
docker exec tauben-postgres pg_dump -U tauben -t table_name tauben_scanner > table_backup.sql

# Restore specific table
docker exec -i tauben-postgres psql -U tauben tauben_scanner < table_backup.sql
```

## Monitoring

### Check Backup Logs

```bash
# System logs
sudo journalctl -u tauben-backup.service

# Specific date
sudo journalctl -u tauben-backup.service --since "2026-02-24"

# Real-time
sudo journalctl -f -u tauben-backup.service
```

### Backup Verification

```bash
# List recent backups
ls -lh /opt/tauben-backups/data/ | tail -10

# Check file integrity
gzip -t /opt/tauben-backups/data/db_20260224_203015.sql.gz

# Count backup files
find /opt/tauben-backups/data -name "*.sql.gz" | wc -l

# Check total size
du -sh /opt/tauben-backups/data/
```

### Email Notifications (Optional)

Add to backup script for email notifications:

```bash
# Add to backup.sh after logger line
if [ $? -eq 0 ]; then
    echo "Backup successful: db_$DATE.sql.gz" | mail -s "Tauben Scanner Backup Success" admin@example.com
else
    echo "Backup failed on $(date)" | mail -s "Tauben Scanner Backup FAILED" admin@example.com
fi
```

## Maintenance

### Cleanup Old Backups

RetentionPolicy: 30 days (configured in script)

```bash
# Manual cleanup (older than 7 days)
find /opt/tauben-backups/data -name "*.sql.gz" -mtime +7 -delete

# Check what would be deleted
find /opt/tauben-backups/data -name "*.sql.gz" -mtime +30
```

### Backup Script Updates

```bash
# Edit script
sudo nano /opt/tauben-backups/scripts/backup.sh

# Test changes
sudo /opt/tauben-backups/scripts/backup.sh

# Reload systemd if needed
sudo systemctl daemon-reload
```

## Troubleshooting

### Common Issues

1. **Permission Denied**: ensure backup script is executable
2. **Docker connection**: verify tauben-postgres container is running
3. **Database connection**: check PostgreSQL credentials
4. **Disk space**: monitor partition usage

### Debug Commands

```bash
# Test database connection
docker exec tauben-postgres psql -U tauben -c "SELECT version();"

# Check available space
df -h /opt/tauben-backups/data

# Test script dry run
bash -x /opt/tauben-backups/scripts/backup.sh
```