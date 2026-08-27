#!/bin/bash
# ============================================================
# deploy.sh — Abroad Simplified VPS Deployment Script
# 
# Usage:
#   ./deploy.sh              Deploy (build + start)
#   ./deploy.sh --rollback   Rollback to the previous image
#   ./deploy.sh --logs       Tail live container logs
#   ./deploy.sh --status     Show container health & resource usage
#   ./deploy.sh --stop       Stop the running container
#   ./deploy.sh --restart    Restart without rebuilding
# ============================================================

set -euo pipefail

# ── Configuration ──────────────────────────────────────────
APP_NAME="abroad-simplified"
CONTAINER_NAME="abroad-simplified"
COMPOSE_FILE="docker-compose.yml"
BRANCH="${DEPLOY_BRANCH:-main}"
APP_PORT="${APP_PORT:-4000}"
HEALTH_URL="http://localhost:${APP_PORT}/"
HEALTH_RETRIES=15
HEALTH_INTERVAL=4

# ── Colors ─────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

log()   { echo -e "${CYAN}[DEPLOY]${NC} $1"; }
ok()    { echo -e "${GREEN}[  OK  ]${NC} $1"; }
warn()  { echo -e "${YELLOW}[ WARN ]${NC} $1"; }
fail()  { echo -e "${RED}[FAILED]${NC} $1"; exit 1; }

# ── Pre-flight checks ─────────────────────────────────────
preflight() {
  command -v docker >/dev/null 2>&1 || fail "Docker is not installed."
  command -v docker compose >/dev/null 2>&1 || fail "Docker Compose (v2 plugin) is not available."
  [ -f "$COMPOSE_FILE" ] || fail "$COMPOSE_FILE not found in $(pwd)."
  [ -f ".env" ] || warn ".env file not found — container may start with missing env vars."
}

# ── Health check ───────────────────────────────────────────
wait_healthy() {
  log "Waiting for container to become healthy..."
  for i in $(seq 1 $HEALTH_RETRIES); do
    if curl -sf --max-time 5 "$HEALTH_URL" > /dev/null 2>&1; then
      ok "Container is healthy and responding on port ${APP_PORT}."
      return 0
    fi
    echo -n "."
    sleep $HEALTH_INTERVAL
  done
  echo ""
  warn "Container did not respond after $((HEALTH_RETRIES * HEALTH_INTERVAL))s."
  warn "Showing recent logs:"
  docker compose -f "$COMPOSE_FILE" logs --tail=30 "$APP_NAME"
  return 1
}

# ── Commands ───────────────────────────────────────────────

do_deploy() {
  preflight

  log "=========================================="
  log "  Abroad Simplified — VPS Deployment"
  log "=========================================="

  # 1. Pull latest code
  log "Pulling latest code from '${BRANCH}'..."
  git pull origin "$BRANCH" || warn "Git pull failed — deploying from current working tree."

  # 2. Tag current image for rollback (if exists)
  if docker image inspect "${APP_NAME}:latest" > /dev/null 2>&1; then
    log "Tagging current image as rollback..."
    docker tag "${APP_NAME}:latest" "${APP_NAME}:rollback" 2>/dev/null || true
  fi

  # 3. Build and start
  log "Building and starting container on port ${APP_PORT}..."
  docker compose -f "$COMPOSE_FILE" up -d --build --remove-orphans

  # 4. Health check
  if wait_healthy; then
    ok "Deployment successful!"
  else
    warn "Deployment may have issues — check logs with: ./deploy.sh --logs"
  fi

  # 5. Prune dangling images
  log "Cleaning up dangling images..."
  docker image prune -f > /dev/null 2>&1

  # 6. Summary
  echo ""
  log "=========================================="
  ok "App URL:  http://localhost:${APP_PORT}"
  ok "Logs:     ./deploy.sh --logs"
  ok "Status:   ./deploy.sh --status"
  ok "Rollback: ./deploy.sh --rollback"
  log "=========================================="
}

do_rollback() {
  preflight
  if ! docker image inspect "${APP_NAME}:rollback" > /dev/null 2>&1; then
    fail "No rollback image found. Cannot rollback."
  fi
  log "Rolling back to previous image..."
  docker tag "${APP_NAME}:rollback" "${APP_NAME}:latest"
  docker compose -f "$COMPOSE_FILE" up -d --remove-orphans
  wait_healthy
  ok "Rollback complete."
}

do_logs() {
  docker compose -f "$COMPOSE_FILE" logs -f --tail=100
}

do_status() {
  echo ""
  log "Container Status:"
  docker compose -f "$COMPOSE_FILE" ps
  echo ""
  log "Resource Usage:"
  docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.PIDs}}" "$CONTAINER_NAME" 2>/dev/null || warn "Container not running."
  echo ""
  log "Health Check:"
  docker inspect --format='{{.State.Health.Status}}' "$CONTAINER_NAME" 2>/dev/null || echo "N/A"
  echo ""
}

do_stop() {
  log "Stopping container..."
  docker compose -f "$COMPOSE_FILE" down
  ok "Container stopped."
}

do_restart() {
  log "Restarting container (no rebuild)..."
  docker compose -f "$COMPOSE_FILE" restart
  wait_healthy
  ok "Restart complete."
}

# ── Entry point ────────────────────────────────────────────
case "${1:-}" in
  --rollback) do_rollback ;;
  --logs)     do_logs ;;
  --status)   do_status ;;
  --stop)     do_stop ;;
  --restart)  do_restart ;;
  --help|-h)
    echo "Usage: ./deploy.sh [--rollback|--logs|--status|--stop|--restart|--help]"
    echo ""
    echo "  (no args)    Full deploy: git pull → build → start → health check"
    echo "  --rollback   Revert to the previous Docker image"
    echo "  --logs       Tail live container logs"
    echo "  --status     Show container health, CPU, memory"
    echo "  --stop       Stop the container"
    echo "  --restart    Restart without rebuilding"
    ;;
  *)          do_deploy ;;
esac
