#!/usr/bin/env bash
# ============================================================
#  Sinop Mübadele - Veritabanı Yedekleme Scripti (SQLite)
#  Kullanım (sunucuda):  bash scripts/backup-db.sh
#  Otomatik günlük yedek için cron örneği (her gün 03:00):
#     crontab -e
#     0 3 * * * /bin/bash /var/www/site/scripts/backup-db.sh >> /var/log/site-backup.log 2>&1
# ============================================================
set -e

# Proje kökü (script nerede olursa olsun doğru çalışsın)
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DB_FILE="$PROJECT_DIR/prisma/dev.db"
BACKUP_DIR="$PROJECT_DIR/backups"

mkdir -p "$BACKUP_DIR"

if [ ! -f "$DB_FILE" ]; then
    echo "[HATA] Veritabanı bulunamadı: $DB_FILE"
    exit 1
fi

STAMP="$(date +%Y-%m-%d_%H%M%S)"
DEST="$BACKUP_DIR/dev-$STAMP.db"

# SQLite güvenli kopyası (varsa sqlite3 ile, yoksa düz kopya)
if command -v sqlite3 >/dev/null 2>&1; then
    sqlite3 "$DB_FILE" ".backup '$DEST'"
else
    cp "$DB_FILE" "$DEST"
fi

# 30 günden eski yedekleri temizle
find "$BACKUP_DIR" -name "dev-*.db" -type f -mtime +30 -delete

echo "[OK] Yedek alındı: $DEST"
