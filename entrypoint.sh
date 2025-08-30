#!/bin/sh
set -e

echo "Running seed script..."
node seed.js

echo "Starting server..."
exec node server.js
