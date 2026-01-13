#!/bin/sh
set -e

echo "Starting Laravel production entrypoint..."

# 1. Protect against Docker mount bugs
if [ -d "/var/www/laravel/.env" ]; then
    echo "CRITICAL: .env is a directory. Check Docker volume mounts!"
    exit 1
fi

# 2. Verify required environment variables
REQUIRED_VARS="APP_KEY DB_HOST DB_DATABASE DB_USERNAME DB_PASSWORD"

for VAR in $REQUIRED_VARS; do
    if [ -z "$(printenv "$VAR")" ]; then
        echo "CRITICAL: Environment variable $VAR is missing"
        exit 1
    fi
done

# 3. Wait for database to become ready
MAX_RETRIES=40
COUNT=1

until php -r "try { new PDO('mysql:host=' . getenv('DB_HOST') . 
            ';port=' . getenv('DB_PORT') . 
            ';dbname=' . getenv('DB_DATABASE'), 
            getenv('DB_USERNAME'), 
            getenv('DB_PASSWORD')); 
            exit(0); } 
            catch (Exception \$e) { exit(1); }"; do
            
    echo "Waiting for database connection... ($COUNT/$MAX_RETRIES)"

    if [ "$COUNT" -ge "$MAX_RETRIES" ]; then
        echo "Database not reachable after $MAX_RETRIES attempts. Exiting."
        exit 1
    fi

    COUNT=$((COUNT + 1))
    sleep 3
done

# 4. Fix permissions (optimized)
echo "Verifying storage permissions..."

# Only fix ownership when incorrect
find storage bootstrap/cache \
    ! -user www-data -exec chown www-data:www-data {} +

# Ensure required write permissions
chmod -R 775 storage bootstrap/cache

# 5. Laravel production lifecycle
echo "Running Laravel production setup..."

# Force a fresh discovery here
echo "Generating fresh package manifest..."
php artisan package:discover --ansi

php artisan optimize:clear

# Storage symlink is idempotent; failure should not stop container
php artisan storage:link --force || true

# Run migrations safely in production
php artisan migrate --force

# Rebuild optimized caches
php artisan optimize

# 6. Hand off to PHP-FPM
echo "Laravel is ready. Starting PHP-FPM..."
exec "$@"
