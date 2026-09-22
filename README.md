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

| Mode                        | URL                              | Purpose               |
| :-------------------------- | :------------------------------- | :-------------------- |
| **Development**             | `http://local.sdg-dashboard.com` | Active development    |
| **Production (local test)** | `127.0.0.1`                      | Production simulation |
| **Production (live)**       | `13.251.136.207`                 | Real users            |

## 3. Infrastructure Overview

- **Production IP**: 13.251.136.207
- **Production Domain (available through internet)**: https://sdgph.org
- **Testing Domain (Local)**: local.sdg-dashboard.com (Mapped to 127.0.0.1)

To access Live Prod: **13.251.136.207** or **sdgph.org**

## 4. Hosts File Configuration

To ensure the application functions properly during development, testing, and staging (mimic of the production server), map the target domain in Windows **hosts file**.

---

### Step-by-Step Guide (Windows Notepad)

#### 1. Add Configuration

1. **Open Notepad as Administrator**
   - Press the **Windows Key**, search for **Notepad**.
   - Right-click **Notepad** and select **Run as Administrator**.

2. **Open the Hosts File**
   - In Notepad, go to **File > Open**.
   - Navigate to:  
     `C:\Windows\System32\drivers\etc\`
   - Change the file type dropdown in the bottom-right corner from **Text Documents (\*.txt)** to **All Files (_._)**.
   - Select `hosts` and click **Open**.

3. **Add the Required Entry**
   - Scroll to the bottom of the file and paste the appropriate entry:
     - **For Local Testing (WSL / Ubuntu):**
       ```text
       127.0.0.1    local.sdg-dashboard.com`
       ```
     - **For Live Production test (local machine):**
       ```text
       13.251.136.207   sdgph.org
       ```

4. **Save the File**
   - Press **Ctrl + S** to save, then close Notepad.

5. **Flush DNS Cache**
   - Open `powershell` and **run as administrator**.
   - Run the following command to apply the changes immediately:
     ```cmd
     ipconfig /flushdns
     ```

---

#### 2. Remove Configuration

1. **Open Notepad as Administrator**
   - Right-click **Notepad** in the Start menu and select **Run as Administrator**.

2. **Open the Hosts File**
   - Go to **File > Open**, navigate to `C:\Windows\System32\drivers\etc\`, select **All Files (_._)**, and open `hosts`.

3. **Delete the Entry**
   - Locate and delete the line containing `local.sdg-dashboard.com` or `sdgph.org`.
   - Press **Ctrl + S** to save the changes, then close Notepad.

4. **Flush DNS Cache**
   - PowerShell and clear the cached DNS entries:
     ```cmd
     ipconfig /flushdns
     ```

### Checking logs and Fixing potential error

1. **Verify addition - shows the last two lines**
   - Run:
     ```
     Get-Content "$env:windir\System32\drivers\etc\hosts" -Tail 2
     ```

2. **Run this to fix glued entry error if already appended in the host file**
   - Run:

   ```
    $hosts = "$env:windir\System32\drivers\etc\hosts"

    # create backup
    $backupPath = Join-Path (Split-Path $hosts) "host-backup.bak"
    Copy-Item -Path $hosts -Destination $backupPath -Force
    Write-Host "Backup created at $backupPath" -ForegroundColor Cyan

    # read content
    $content = Get-Content $hosts -Raw

    # use Universal Regex (Compatible with all PowerShell versions)
    # [ \t]* replaces \h* to avoid "Unrecognized escape sequence" errors
    $pattern = '([^\s])[ \t]*((?:13\.\s*251\.\s*136\.\s*207)\s*app\.sdg-dashboard\.com)'
    $replacement = '$1' + "`r`n" + '$2'

    # Apply fix
    if ($content -match $pattern) {
        $content = $content -replace $pattern, $replacement
        Set-Content -Path $hosts -Value $content -Encoding ASCII -Force
        Write-Host "SUCCESS: Fixed the glued entry." -ForegroundColor Green
    } else {
        Write-Host "No problematic entries found or already fixed." -ForegroundColor Yellow
    }

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

## MakeFile Automated script using Makefile

## 1. Prerequisites

### Installing Make on Ubuntu/Linux

Before using the automation scripts, you must ensure that the `make` utility is installed on your system.

```
  sudo apt update
  sudo apt install make
  make --version

```

**Rebuild and refresh frontend assets**:

- Updating Vue components
- Modifying frontend assets
- Encountering stale frontend builds

```
  make build-fresh

```

**Run full deployment process including pulling updates and rebuilding containers**:

- Clean Docker rebuild and restart
- Backend or configuration changes are made
- New environment variables are added
- Middleware, routes, or API logic changes

```
  make deploy

```

**Database Seeding**:

- Rebuilds and restarts the production environment.
- Executes the Laravel Seeder to insert initial or dummy data.
- Ensures the application state is optimized post-seeding.

```
  make seed

```

**Full DB Refresh + Seeding**:

- Warning: This will drop all tables and data.
- Rolls back all migrations and runs them again from scratch.
- Seeds the database immediately after the migration.
- Ideal for staging environments or local recovery

```
  make seed-fresh

```

**Advanced Commands**

| Command             | Description                                                                        |
| ------------------- | ---------------------------------------------------------------------------------- |
| make build-db-fresh | Combined routine: Clears frontend public volumes and runs a fresh migration/seed.  |
| make build-db       | Combined routine: Clears frontend public volumes and runs migration/seed.          |
| make build-normal   | Standard up --build without clearing caches or volumes.                            |
| make nucleus-start  | Recovery Mode: Removes all volumes and local images before a fresh seed-migration. |
| make optimize       | Clears and regenerates Laravel config, route, and view caches.                     |

## Manual commands

**Standard Update - Source code changes**

- Controller logic
- Blade/Vue files
- Pinia Stores
- Vue routers
- Middleware
- API logic

```
  git pull
  docker compose -f docker-compose.prod.yml up -d --build


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
 docker compose -f docker-compose.prod.yml down
 docker compose -f docker-compose.prod.yml build --no-cache
 docker compose -f docker-compose.prod.yml up -d

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
  docker compose -f docker-compose.prod.yml down
  git pull
  docker compose -f docker-compose.prod.yml build --no-cache
  docker compose -f docker-compose.prod.yml up -d

  # Fix permissions
  docker exec -it sdg-php chown -R www-data:www-data storage bootstrap/cache
  docker exec -it sdg-php chmod -R 775 storage bootstrap/cache

  docker exec -it sdg-php php artisan optimize:clear

  # Optimize ONLY after validation (totally working)
  docker exec -it sdg-php php artisan optimize

```

**Frontend Changes**

- Vue Components
- Frontend Links

```
  docker compose -f docker-compose.prod.yml down
  git pull
  docker volume rm sdg-app_laravel_public

  docker compose -f docker-compose.prod.yml build --no-cache
  docker compose -f docker-compose.prod.yml up -d


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

 docker compose -f docker-compose.prod.yml down -v --rmi local

 git pull #if there are changes in repo

 # Fix .env directory bugs and line endings

 find ./laravel/.env -maxdepth 0 -type d -exec rm -rf {} +
 sed -i 's/\r$//' ./laravel/.env

 # Clean up Frontend .env

 find ./laravel/.env.production.localfrontend -maxdepth 0 -type d -exec rm -rf {} +
 sed -i 's/\r$//' ./laravel/.env.production.localfrontend

 # Rebuild and launch clean stack

 docker compose -f docker-compose.prod.yml build --no-cache
 docker compose -f docker-compose.prod.yml up -d

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
