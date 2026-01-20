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

To make sure the application works correctly during testing and production, you need to map the domain in your system's **hosts file**.  
There are two simple ways to do this: using **Notepad** or using **PowerShell**.

---

### Option 1: Update Using Notepad (Windows)

1. **Open Notepad as Administrator**
   - Search for "Notepad" in the Start menu.
   - Right-click it and select **Run as Administrator**.

2. **Open the Hosts File**
   - In Notepad, go to **File > Open**.
   - Navigate to:  
     `C:\Windows\System32\drivers\etc\hosts`
   - At the bottom-right, change the dropdown to **All Files** so you can see the file.
   - Select the file and open it.

3. **Add Configuration**
   - Scroll to the bottom and paste one of the following lines:
     - For testing:
       ```
       127.0.0.1    app.sdg-dashboard.com
       ```
     - For live production:
       ```
       13.251.136.207    app.sdg-dashboard.com
       ```

4. **Save and Close**
   - Press **Ctrl + S** to save.
   - Close Notepad.

---

### Option 2: Update Using PowerShell (Windows)

1. **Open PowerShell as Administrator**
   - Search for "PowerShell" in the Start menu.
   - Right-click it and select **Run as Administrator**.

2. **Add the Configuration**
   - Copy and paste one of these commands into PowerShell, then press **Enter**:
     - For **Live Production**:
       ```
       Add-Content -Path "$env:windir\System32\drivers\etc\hosts" -Value "`n13.251.136.207`tapp.sdg-dashboard.com" -Force
       ```
     - For **Testing (local setup)**:
       ```
       Add-Content -Path "$env:windir\System32\drivers\etc\hosts" -Value "`n127.0.0.1`tapp.sdg-dashboard.com" -Force
       ```

3. **Refresh DNS Cache**
   - Run this command:
     ```
     ipconfig /flushdns
     ```

---

### How to Remove the Configuration (PowerShell)

For deleting the entry:

1. **Open PowerShell as Administrator**
   - Same as above.

2. **Run the Removal Command**
   - Choose one of the following depending on what you want to remove:
     - To remove **Live Production** entry:
       ```
       $hosts = "$env:windir\System32\drivers\etc\hosts"
       (Get-Content $hosts) |
         Where-Object { $_ -notmatch '^\s*13\.251\.136\.207\s+app\.sdg-dashboard\.com\s*$' } |
         Set-Content $hosts
       ```
     - To remove **Testing (local setup)** entry:
       ```
       $hosts = "$env:windir\System32\drivers\etc\hosts"
       (Get-Content $hosts) |
         Where-Object { $_ -notmatch '^\s*127\.0\.0\.1\s+app\.sdg-dashboard\.com\s*$' } |
         Set-Content $hosts
       ```

3. **Refresh DNS Cache Again**
   - Run:
     ```
     ipconfig /flushdns
     ```

## 5. Environment Variable

For developers / operators only

- Ensure ./laravel/.env exists
- .env must be a file, not a directory
- Must use Unix line endings (LF) ( avoid potential errors)

### Frontend Environment Configuration (Production)

To prevent the `GET /undefined/auth/google/redirect` error in production builds, define the API URL for the frontend:

- Ensure `./laravel/.env.production.localfrontend` exists
- Ensure the file uses **Unix line endings (LF)**.
- This variable will be injected into the frontend build process, ensuring that API requests are correctly routed to the backend service.

## 6. Local Development Workflow

    # 1. Build and start containers
    docker compose up -d --build

    # 2. Check containers
    docker compose ps

    # 3. Start Frontend Hot Module Replacement (HMR)
    docker exec -it sdg-node npm run dev

**Access via:** http://localhost:8080

## 7. Production Deployment Workflow

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

**Standard Update - Source code changes**

- Controller logic
- Blade/Vue files
- Pinia Stores
- Vue routers
- Middleware
- API logic

```
  git pull
  docker-compose -f docker-compose.prod.yml up -d --build


  # Fix permissions
  docker exec -it sdg-php chown -R www-data:www-data storage bootstrap/cache
  docker exec -it sdg-php chmod -R 775 storage bootstrap/cache

  docker exec -it sdg-php php artisan optimize:clear

```

**Config or Dependency Changes**

- any `.env` changes
- `composer.json`
- `package.json`
- Cache/session/database driver changes

```
 git pull
 docker-compose -f docker-compose.prod.yml down
 docker-compose -f docker-compose.prod.yml build --no-cache
 docker-compose -f docker-compose.prod.yml up -d

 # Fix permissions
 docker exec -it sdg-php chown -R www-data:www-data storage bootstrap/cache
 docker exec -it sdg-php chmod -R 775 storage bootstrap/cache

 docker exec -it sdg-php php artisan optimize:clear

 # Optimize ONLY after validation (totally working)
 docker exec -it sdg-php php artisan optimize

```

**Docker / Infrastructure Changes**

- Dockerfile
- docker-compose.prod.yml
- Nginx config
- Entrypoint script

```
  docker-compose -f docker-compose.prod.yml down
  git pull
  docker-compose -f docker-compose.prod.yml build --no-cache
  docker-compose -f docker-compose.prod.yml up -d

  # Fix permissions
  docker exec -it sdg-php chown -R www-data:www-data storage bootstrap/cache
  docker exec -it sdg-php chmod -R 775 storage bootstrap/cache

  docker exec -it sdg-php php artisan optimize:clear

  # Optimize ONLY after validation (totally working)
  docker exec -it sdg-php php artisan optimize

```

**Fresh Start (Recovery Mode)**

Use this to fix stale volumes or cached configuration bugs.This will permanently delete database data, sessions, and Docker volumes:

- First-Time Production Deployment
- Severe Production Bugs (State Corruption)
- Docker Volume / Cache Corruption
- Switching Critical Infrastructure Settings

```
 # Stop and wipe volumes/images

 docker-compose -f docker-compose.prod.yml down -v --rmi local

 git pull #if there are changes in repo

 # Fix .env directory bugs and line endings

 find ./laravel/.env -maxdepth 0 -type d -exec rm -rf {} +
 sed -i 's/\r$//' ./laravel/.env

 # Clean up Frontend .env

 find ./laravel/.env.production.localfrontend -maxdepth 0 -type d -exec rm -rf {} +
 sed -i 's/\r$//' ./laravel/.env.production.localfrontend

 # Rebuild and launch clean stack

 docker-compose -f docker-compose.prod.yml build --no-cache
 docker-compose -f docker-compose.prod.yml up -d

```

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
