#!/bin/bash
BACKUP_DIR=~/backups/ecokon
mkdir -p $BACKUP_DIR
DATE=$(date +%Y%m%d_%H%M)
docker exec ecokon-db pg_dump -U ecokon ecokon | gzip > $BACKUP_DIR/ecokon_$DATE.sql.gz
# Удалять бэкапы старше 30 дней
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
echo "Backup done: ecokon_$DATE.sql.gz"
