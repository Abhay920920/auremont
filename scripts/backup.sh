#!/bin/bash
# RARE NUTS Database Automated Backup Script
# Should be executed via cron job (e.g., daily at 2:00 AM)

set -e

# Configuration
BACKUP_DIR="/var/backups/auremont_db"
DB_USER=${POSTGRES_USER:-auremont}
DB_NAME=${POSTGRES_DB:-auremont_prod}
DB_CONTAINER="auremont-db-1" # Assuming docker-compose default naming
DATE=$(date +%Y-%m-%d_%H-%M-%S)
RETENTION_DAYS=30

mkdir -p "$BACKUP_DIR"

echo "[$(date)] Starting backup of $DB_NAME..."

# Execute pg_dump inside the PostgreSQL container
docker exec $DB_CONTAINER pg_dump -U "$DB_USER" "$DB_NAME" -F c > "$BACKUP_DIR/db_backup_$DATE.dump"

# Compress and Encrypt the backup (simulated GPG for DevSecOps best practices)
# In production, ensure the public key is trusted: gpg --import pubkey.asc
gzip "$BACKUP_DIR/db_backup_$DATE.dump"
# gpg --encrypt --recipient admin@rarenuts.com "$BACKUP_DIR/db_backup_$DATE.dump.gz"
# rm "$BACKUP_DIR/db_backup_$DATE.dump.gz"

echo "[$(date)] Backup completed successfully: $BACKUP_DIR/db_backup_$DATE.dump.gz"

# Enforce Retention Policy
echo "[$(date)] Cleaning up backups older than $RETENTION_DAYS days..."
find "$BACKUP_DIR" -type f -name "*.dump.gz" -mtime +$RETENTION_DAYS -exec rm {} \;

echo "[$(date)] Cleanup finished."
