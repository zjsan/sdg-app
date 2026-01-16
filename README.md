# SDG Dashboard

Production & Development Document

## 1. Architecture Overview

The system consists of:

- **Frontend**: Vue (built via Vite, static in production)
- **Backend**: Laravel (API + iframe backend logic + whitelist table)
- **Web Server**: Nginx
- **Containerization**: Docker / Docker Compose
- **PHP Runtime**: PHP-FPM
- **MySQL**: MySQL 8
- **Auth**: Google OAuth + allowed email whitelist
- **Power BI**: Embedded using iframe and via signed URLs + one-time cache token approach

## 2. Environment Modes

| Mode                        | URL                     | Purpose               |
| :-------------------------- | :---------------------- | :-------------------- |
| **Development**             | `http://localhost:8080` | Active development    |
| **Production (local test)** | `127.0.0.1`             | Production simulation |
| **Production (live)**       | `13.251.136.207`        | Real users            |

## 3. Infrastructure Overview

- **Production IP**: 13.251.136.207
- **Production Domain (DNS not yet public)**: https://app.sdg-dashboard.com
- **Testing Domain (Local)**: app.sdg-dashboard.com (Mapped to 127.0.0.1)
- **Testing Production Domain**: app.sdg-dashboard.com (Mapped to 13.251.136.207)

To access Live Prod: **13.251.136.207** -> automatically redirected to https://app.sdg-dashboard.com by nginx config

## 4. Hosts File Configuration

To ensure the application resolves correctly during testing and production, must map the domain in the system's `hosts` file.

### How to Update (Windows)

1.  **Open Notepad as Administrator**: Search for "Notepad" in the Start menu, right-click it, and select **Run as Administrator**.
2.  **Open the Hosts File**: Go to `File > Open` and navigate to:
    `C:\Windows\System32\drivers\etc\hosts`
    _(Note: Ensure "All Files" is selected in the bottom-right dropdown to see the file)._ Then select again notepad.
3.  **Add Configuration**: Scroll to the bottom and paste the appropriate line:
    - **For testing of production setup:** `127.0.0.1 app.sdg-dashboard.com`
    - **For Live Production:** `13.251.136.207 app.sdg-dashboard.com`
4.  **Save and Close**: Press `Ctrl + S` to save and close the file.

## 5. Environment Variable

For developers / operators only

- Ensure ./laravel/.env exists
- .env must be a file, not a directory
- Must use Unix line endings (LF) ( avoid potential errors)

## 6. Local Development Workflow

    # 1. Build and start containers
    docker compose up -d --build

    # 2. Check containers
    docker compose ps

    # 3. Start Frontend Hot Module Replacement (HMR)
    docker exec -it sdg-node npm run dev

**Access via:** http://localhost:8080

## 7. Production Deployment

## Docker Entrypoint File

The `docker-entrypoint.sh` script is the brain of the container.Attached within the `Dockerfile.prod`. It ensures the environment is safe before the app starts. It performs the following critical tasks:

- **Mount Protection**: Checks if `.env` is accidentally mounted as a directory (a common Docker bug) and aborts if so.
- **Environment Validation**: Verifies that required variables like `APP_KEY` and `DB_PASSWORD` are present.
- **Database Readiness**: Pauses the startup process until the MySQL service is reachable (up to 40 retries).
- **Permission Sync**: Automatically runs `chown` and `chmod` on storage and bootstrap/cache to prevent "Permission Denied" errors.
- **Lifecycle Management**:
  - Clears stale bootstrap caches.
  - Forces `storage:link`.
  - Runs database migrations (`migrate --force`).
  - Pre-caches the application for production performance.

**Standard Update**

    docker-compose -f docker-compose.prod.yml down
    git pull #if there are changes in repo
    docker-compose -f docker-compose.prod.yml build --no-cache
    docker-compose -f docker-compose.prod.yml up -d

**Fresh Start (Recovery Mode)**

Use this to fix stale volumes or cached configuration bugs:

    # Stop and wipe volumes/images
    docker-compose -f docker-compose.prod.yml down -v --rmi local

    # Fix .env directory bugs and line endings
    find ./laravel/.env -maxdepth 0 -type d -exec rm -rf {} +
    sed -i 's/\r$//' ./laravel/.env

    # Rebuild and launch
    docker-compose -f docker-compose.prod.yml build --no-cache
    docker-compose -f docker-compose.prod.yml up -d

## 8. Maintenance Commands

**Post-Deployment Optimization Commands**

    # 1. Fix Permissions
    docker exec -it sdg-php chown -R www-data:www-data storage bootstrap/cache
    docker exec -it sdg-php chmod -R 775 storage bootstrap/cache

    # 2. Seed Whitelisted Emails
    docker exec -it sdg-php php artisan db:seed --class=AllowedEmailsSeeder --force

    #Check emails if successfully seeded:
    docker exec -it sdg-php php artisan tinker --execute="print_r(DB::table ('allowed_emails')->pluck('email'))"

    # 3. Clear & Optimize Cache
    docker exec -it sdg-php php artisan optimize:clear
    docker exec -it sdg-php php artisan optimize

## 9. Monitoring & Logs

1. Real-Time "Live" Monitoring:

| Service         | Command                       | Purpose                                                                      |
| :-------------- | :---------------------------- | :--------------------------------------------------------------------------- |
| **Full Stack**  | `docker compose logs -f`      | Watch all services at once (useful for seeing inter-service errors).         |
| **Laravel/PHP** | `docker logs -f sdg-php`      | Monitor application logic, validation errors, and Power BI token generation. |
| **Web Server**  | `docker logs -f sdg-nginx`    | Debug 404s, 502 Bad Gateway, and static asset issues.                        |
| **Database**    | `docker logs -f sdgapp-mysql` | Monitor query performance and connection issues.                             |

2. Laravel Error Monitoring:

- View last 50 entries in the Laravel log file
  - docker exec -it sdg-php tail -n 50 storage/logs/laravel.log
- Search for specific Errors (Grep)
  - docker logs sdg-php 2>&1 | grep "SQLSTATE"

## 10. Proxy & HTTPS Configuration

    // bootstrap/app.php
    $middleware->trustProxies(at: '*');

Why this is required

- App runs behind Nginx + Docker
- Laravel must trust X-Forwarded-\* headers
- HTTPS detection and signed URLs depend on it
- Fixes Power BI iframe and signed route validation
