#!/bin/sh

# Health check for Docker container
if curl -f http://localhost:5000/health/liveness; then
    echo "Backend is alive"
    exit 0
else
    echo "Backend is not responding"
    exit 1
fi