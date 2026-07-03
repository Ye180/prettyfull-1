#!/bin/sh
set -e

if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
  echo "Running database migrations..."
  node_modules/.bin/medusa db:migrate
  echo "Migrations completed."
fi

exec node_modules/.bin/medusa start
