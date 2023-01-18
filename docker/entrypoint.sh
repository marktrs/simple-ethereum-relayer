#!/bin/sh
# Change to the correct directory
cd /app;
# Run hardhat
yarn evm;
# Keep node alive
set -e
if [ "${1#-}" != "${1}" ] || [ -z "$(command -v "${1}")" ]; then
  set -- node "$@"
fi
exec "$@"