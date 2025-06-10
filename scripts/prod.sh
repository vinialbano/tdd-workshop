#!/bin/bash

# Production docker-compose helper script
# Usage: ./scripts/prod.sh <command>
# Example: ./scripts/prod.sh up -d

set -e

# Source environment variables
set -a
source apps/api/.env
set +a

# Run docker-compose with production configuration
docker-compose -f docker-compose.base.yml -f docker-compose.prod.yml "$@" 