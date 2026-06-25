# Variables
COMPOSE_PROD = docker compose -f docker-compose.prod.yml --env-file ./laravel/.env
PHP_CONT = sdg-php

.PHONY: build-fresh deploy seed help

# 1. Full Frontend/Build Refresh
build-fresh:
	@echo "refreshing frontend volume to ensure a clean slate..."
	docker volume rm sdg-app_laravel_public || true
	@echo "building and deploying containers without cache..."
	$(COMPOSE_PROD) build --no-cache
	$(COMPOSE_PROD) up -d
	$(MAKE) optimize

# Full Frontend/Build Refresh + DB Refresh
build-db-fresh:
	docker volume rm sdg-app_laravel_public || true
	
	$(MAKE) seed-fresh

# Full Frontend/Build Refresh + DB seeding
build-db:
	docker volume rm sdg-app_laravel_public || true
	
	$(MAKE) seed

build-normal:
	@echo "Starting full build and deployment cycle..."
	@echo "Removing existing frontend volume to ensure a clean slate..."

	docker volume rm sdg-app_laravel_public || true

	@echo "Building and deploying containers without cache..."
	$(COMPOSE_PROD) build --no-cache

	@echo "Starting containers in detached mode..."
	$(COMPOSE_PROD) up -d

	@echo "optimizing application and clearing caches..."
	$(MAKE) optimize


# 2. Config/Dependency Changes and frontend building
deploy:
	@echo "Pulling changes and building updated layers safely..."
	$(COMPOSE_PROD) build
	@echo "Restarting containers with zero downtime..."
	$(COMPOSE_PROD) up -d --remove-orphans
	$(MAKE) optimize

# 3. Database Seeding
seed:
	$(COMPOSE_PROD) build --no-cache
	$(COMPOSE_PROD) up -d
	docker exec $(PHP_CONT) php artisan db:seed --force
	$(MAKE) optimize

# 4. Full DB Refresh + Seeding
seed-fresh:
	$(COMPOSE_PROD) build --no-cache
	$(COMPOSE_PROD) up -d
	docker exec $(PHP_CONT) php artisan migrate:fresh --seed --force
	$(MAKE) optimize


# 5. Frontend and Database Refresh (clean build + migrate refresh and seed)
start-refresh:
	docker volume rm sdg-app_laravel_public || true
	
	$(MAKE) seed-fresh

# 6. Fresh Start (Recovery Mode)
nucleus-start:
	$(COMPOSE_PROD) down -v --rmi local
	
	$(MAKE) seed-fresh

# Refresh only the Organization Power BI links
refresh-links:
	$(COMPOSE_PROD) build --no-cache
	$(COMPOSE_PROD) up -d
	docker exec $(PHP_CONT) php artisan db:seed --class=OrganizationSeeder --force
	
	$(MAKE) optimize
	@echo "Power BI links have been synchronized successfully."

update-whitelist:
	$(COMPOSE_PROD) build --no-cache
	$(COMPOSE_PROD) up -d
	docker exec $(PHP_CONT) php artisan db:seed --class=AllowedEmailsSeeder --force
	
	$(MAKE) optimize
	@echo "Allowed emails have been updated successfully."

# Helper: Optimization logic
optimize:
	docker exec $(PHP_CONT) php artisan optimize:clear
	@echo "Validating application state..."
	docker exec $(PHP_CONT) php artisan optimize
	@echo "Deployment cycle complete."