#!/usr/bin/env bash

# Colors for terminal output
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
PURPLE='\033[0;35m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${CYAN}================================================================${NC}"
echo -e "${CYAN}   English Speaking & Communication Platform - Unified Runner   ${NC}"
echo -e "${CYAN}================================================================${NC}"

# Cleanup child processes on exit (Ctrl+C)
cleanup() {
  echo -e "\n${YELLOW}==> Stopping all services...${NC}"
  kill $(jobs -p) 2>/dev/null || true
  exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# 1. Check Docker / Infrastructure
if command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1; then
  echo -e "${BLUE}[INFRA] Starting PostgreSQL, Redis, and MinIO via docker-compose...${NC}"
  docker-compose up -d 2>/dev/null || true
else
  echo -e "${YELLOW}[INFRA] Note: Docker daemon not running or not found. Skipping docker-compose.${NC}"
fi

# 2. Check and reverse ADB port if Android phone is connected
if command -v adb >/dev/null 2>&1; then
  if adb devices 2>/dev/null | grep -q "device$"; then
    echo -e "${GREEN}[ADB] Android device detected. Forwarding port 4000 to mobile...${NC}"
    adb reverse tcp:4000 tcp:4000 2>/dev/null || true
  fi
fi

# 3. Prisma generate if needed
if [ ! -d "backend/node_modules/.prisma" ]; then
  echo -e "${BLUE}[PRISMA] Generating Prisma Client...${NC}"
  npm run prisma:generate 2>/dev/null || true
fi

echo -e "\n${GREEN}==> Starting services simultaneously...${NC}"
echo -e "  - ${CYAN}Backend API:${NC}             http://localhost:4000"
echo -e "  - ${CYAN}Swagger Documentation:${NC}   http://localhost:4000/api/docs"
echo -e "  - ${CYAN}Learner Web Portal:${NC}      http://localhost:3000"
echo -e "  - ${CYAN}Admin Operations:${NC}        http://localhost:3001"
echo -e "${YELLOW}Press Ctrl+C to stop all services at once.${NC}\n"

# 4. Launch Backend, Learner Web, and Admin Web in parallel
npm --workspace=backend run start:dev &
PID_BACKEND=$!

npm --workspace=@english-platform/web run dev &
PID_WEB=$!

npm --workspace=@english-platform/admin run dev &
PID_ADMIN=$!

wait $PID_BACKEND $PID_WEB $PID_ADMIN
