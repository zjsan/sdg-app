#!/bin/sh
set -e

echo "Starting Laravel production entrypoint..."

# 1. Check essential environment
if [ ! -f .env ]; then
    echo "ERROR: .env file not found!"
    exit 1
fi

if [ -z "$APP_KEY" ]; then
    echo "ERROR: APP_KEY not set!"
    exit 1
fi

# 2. Wait for DB (max 20 retries)
MAX_RETRIES=20
COUNT=0
until php artisan migrate:status >/dev/null 2>&1; do
    echo "⏳ Waiting for database connection..."
    COUNT=$((COUNT+1))
    if [ $COUNT -ge $MAX_RETRIES ]; then
        echo "Database not reachable after $MAX_RETRIES attempts. Exiting."
        exit 1
    fi
    sleep 3
done

# 3. Force permissions (important for mounted volumes)
echo "🔐 Setting folder permissions..."
chown -R www-data:www-data storage bootstrap/cache public/build
chmod -R 775 storage storage/logs storage/framework bootstrap/cache

# 4. Clear stale caches
php artisan optimize:clear

# 5. Ensure storage symlink exists
php artisan storage:link --force || true

# 6. Run migrations safely
# Optionally add a lock file to prevent race conditions in multi-container setups
php artisan migrate --force

# 7. Rebuild optimized cache for production
php artisan optimize

echo "Laravel is ready. Starting PHP-FPM..."

exec "$@"
