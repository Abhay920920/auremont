#!/usr/bin/env bash
# ==============================================================================
# RARE NUTS / AUREMONT — Production PostgreSQL / Neon Automated Backup Script
# ==============================================================================
# Supports direct Neon Serverless connection, local staging, and remote instances.
# Never leaks DATABASE_URL credentials to stdout or logs.
#
# Usage:
#   export DATABASE_URL="postgresql://user:pass@host/neondb?sslmode=require"
#   ./scripts/backup-neon.sh [OUTPUT_DIR]
# ==============================================================================

set -euo pipefail

BACKUP_DIR="${1:-./backups}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/auremont_neon_${TIMESTAMP}.dump"
GZ_FILE="${BACKUP_FILE}.gz"
SHA_FILE="${GZ_FILE}.sha256"
RETENTION_DAYS=14

# Ensure output directory exists
mkdir -p "${BACKUP_DIR}"

# Validate DATABASE_URL is present
if [ -z "${DATABASE_URL:-}" ]; then
  # Attempt to source from backend .env if available
  if [ -f "./auremont-backend/.env" ]; then
    echo "[INFO] Loading DATABASE_URL from ./auremont-backend/.env..."
    DATABASE_URL=$(grep -E '^DATABASE_URL=' ./auremont-backend/.env | cut -d '=' -f2- | tr -d '"' | tr -d "'")
  fi
fi

if [ -z "${DATABASE_URL:-}" ]; then
  echo "[ERROR] DATABASE_URL environment variable is missing." >&2
  exit 1
fi

# Sanitize display of host for audit logging without leaking credentials
DB_HOST=$(echo "${DATABASE_URL}" | sed -E 's|.*@([^:/]+).*|\1|')
echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] Starting backup of host: ${DB_HOST}..."

# Execute pg_dump with custom format (-F c) for maximum compression and restore flexibility
if ! pg_dump "${DATABASE_URL}" \
    --format=custom \
    --no-owner \
    --no-acl \
    --file="${BACKUP_FILE}" 2>/dev/null; then
  echo "[ERROR] pg_dump execution failed! Check network connectivity or database access." >&2
  rm -f "${BACKUP_FILE}"
  exit 2
fi

# Compress the dump
gzip -9 "${BACKUP_FILE}"

# Generate SHA-256 checksum for integrity verification
if command -v sha256sum >/dev/null 2>&1; then
  sha256sum "${GZ_FILE}" > "${SHA_FILE}"
elif command -v shasum >/dev/null 2>&1; then
  shasum -a 256 "${GZ_FILE}" > "${SHA_FILE}"
fi

FILESIZE=$(ls -lh "${GZ_FILE}" | awk '{print $5}')
echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] Backup completed successfully: ${GZ_FILE} (${FILESIZE})"
echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] Checksum written to: ${SHA_FILE}"

# Cleanup old backups exceeding retention days
echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] Cleaning up local backups older than ${RETENTION_DAYS} days..."
find "${BACKUP_DIR}" -type f -name "auremont_neon_*.dump.gz*" -mtime +"${RETENTION_DAYS}" -exec rm -f {} +

echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] Backup routine finished cleanly."
exit 0
