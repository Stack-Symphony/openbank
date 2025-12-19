

# Setup Minikube cluster for OpenBank

echo "Setting up Minikube cluster..."

# Start Minikube
minikube start --cpus=4 --memory=8192 --disk-size=20g

# Enable ingress addon
minikube addons enable ingress
minikube addons enable metrics-server

# Create namespace
kubectl create namespace openbank

# Create secrets
kubectl create secret generic openbank-secrets \
  --namespace=openbank \
  --from-literal=mongodb-root-username=admin \
  --from-literal=mongodb-root-password=password123 \
  --from-literal=jwt-secret=your-super-secret-jwt-key-change-this-in-production \
  --from-literal=mongodb-uri='mongodb://admin:password123@mongodb:27017/openbank?authSource=admin'

# Apply all Kubernetes manifests
kubectl apply -f kubernetes/

# Get Minikube IP
MINIKUBE_IP=$(minikube ip)

echo "========================================"
echo "OpenBank deployed successfully!"
echo ""
echo "Access URLs:"
echo "Frontend: http://$MINIKUBE_IP:30000"
echo "Backend API: http://$MINIKUBE_IP:30001/api/health"
echo ""
echo "To view logs:"
echo "  Backend: kubectl logs -n openbank deployment/openbank-backend -f"
echo "  Frontend: kubectl logs -n openbank deployment/openbank-frontend -f"
echo ""
echo "To scale backend:"
echo "  kubectl scale deployment/openbank-backend --replicas=3 -n openbank"
echo "========================================"