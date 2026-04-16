# Variables
COMPOSE_PROD = docker compose -f docker-compose.prod.yml
PHP_CONT = sdg-php

.PHONY: build-fresh deploy seed help

# 1. Full Frontend/Build Refresh
build-fresh:
	docker volume rm sdg-app_laravel_public || true
	$(COMPOSE_PROD) build --no-cache
	$(COMPOSE_PROD) up -d
	$(MAKE) optimize

# 2. Config/Dependency Changes
deploy:
	$(COMPOSE_PROD) build --no-cache
	$(COMPOSE_PROD) up -d
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
	docker exec $(PHP_CONT) php artisan migrate:refresh --seed --force
	$(MAKE) optimize

# 5. Normal Build (no cache, but no DB changes)
build-normal:
	$(COMPOSE_PROD) up -d --build
	$(MAKE) optimize

# 6. Frontend and Database Refresh (clean build + migrate refresh and seed)
start-refresh:
	docker volume rm sdg-app_laravel_public || true
	
	$(MAKE) seed
	$(MAKE) optimize

# 7. Fresh Start (Recovery Mode)
nucleus-start:
	$(COMPOSE_PROD) down -v --rmi local
	
	$(MAKE) seed
	$(MAKE) optimize

# Helper: Optimization logic
optimize:
	docker exec $(PHP_CONT) php artisan optimize:clear
	@echo "Validating application state..."
	docker exec $(PHP_CONT) php artisan optimize
	@echo "Deployment cycle complete."