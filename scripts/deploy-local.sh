
# Local deployment script

echo "Building Docker images..."
docker-compose build

echo "Starting services..."
docker-compose up -d

echo "Waiting for services to start..."
sleep 10

echo "Checking services..."
docker-compose ps

echo "Health checks:"
curl -f http://localhost:5000/api/health || echo "Backend health check failed"
curl -f http://localhost:3000 || echo "Frontend health check failed"

echo ""
echo "Services running at:"
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:5000/api/health"
echo "Mongo Express: http://localhost:8081"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop: docker-compose down"