#!/bin/sh
# Starts the app. With a backup bucket set up, the database is first restored from it
# when the volume is empty (a new or replaced volume), then every change is streamed to it.
set -e
APP="node_modules/.bin/next start -p 3000"

if [ -n "$BUCKET_NAME" ]; then
  litestream restore -config /etc/litestream.yml -if-db-not-exists -if-replica-exists /data/app.db
  exec litestream replicate -config /etc/litestream.yml -exec "$APP"
fi

echo "No backup bucket set (BUCKET_NAME); running without database backup" >&2
exec $APP
