#!/bin/bash

# OpenBank Kubernetes Deployment Script
# Run this from the project root directory

echo "========================================="
echo "   OpenBank Kubernetes Deployment"
echo "========================================="
echo ""

# Get the project root directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
K8S_DIR="$PROJECT_ROOT/infra/k8s"

echo "Project root: $PROJECT_ROOT"
echo "K8S directory: $K8S_DIR"
echo ""

# Check if kubectl is available
command -v kubectl >/dev/null 2>&1 || {
    echo "ERROR: kubectl is not installed. Please install kubectl first."
    echo "Installation guide: https://kubernetes.io/docs/tasks/tools/"
    exit 1
}

# Check if Minikube is running
echo "Checking Minikube status..."
if ! minikube status 2>/dev/null | grep -q "Running"; then
    echo "Minikube is not running. Starting Minikube..."
    minikube start --cpus=4 --memory=8192 --disk-size=20g
    echo "Minikube started successfully!"
fi

# Enable required addons
echo "Enabling required Minikube addons..."
minikube addons enable ingress
minikube addons enable metrics-server  # Required for HPA

echo ""
echo "=== Deploying to Kubernetes ==="
echo ""

# Change to k8s directory
cd "$K8S_DIR"

# 1. Create namespace
echo "1. Creating namespace..."
kubectl apply -f namespace.yaml

# 2. Apply ConfigMap
echo "2. Applying ConfigMap..."
kubectl apply -f configmap.yaml

# 3. Apply Secrets
echo "3. Applying Secrets..."
kubectl apply -f secrets.yaml

# 4. Deploy MongoDB (using simple deployment for Minikube)
echo "4. Deploying MongoDB..."
kubectl apply -f mongo-simple.yaml
echo "   Waiting for MongoDB to be ready..."
for i in {1..30}; do
    if kubectl get pods -n openbank -l app=mongo 2>/dev/null | grep -q "Running"; then
        echo "   MongoDB is ready!"
        break
    fi
    echo "   Waiting for MongoDB... ($i/30)"
    sleep 2
done

# 5. Deploy Backend
echo "5. Deploying Backend..."
kubectl apply -f backend-deployment.yaml
kubectl apply -f backend-service.yaml

# 6. Deploy Frontend
echo "6. Deploying Frontend..."
kubectl apply -f frontend-deployment.yaml
kubectl apply -f frontend-service.yaml

# 7. Wait for deployments
echo "7. Waiting for deployments to be ready..."
sleep 20

# 8. Apply HPA
echo "8. Applying Horizontal Pod Autoscalers..."
kubectl apply -f hpa.yaml

# 9. Apply Ingress
echo "9. Applying Ingress..."
kubectl apply -f ingress.yaml

# 10. Apply Network Policy
echo "10. Applying Network Policy..."
kubectl apply -f network-policy.yaml

echo ""
echo "=== Deployment Complete! ==="
echo ""

# Display status
echo "=== Deployment Status ==="
kubectl get all -n openbank

echo ""
echo "=== Pods Status ==="
kubectl get pods -n openbank -o wide

echo ""
echo "=== Services ==="
kubectl get svc -n openbank

echo ""
echo "=== Ingress ==="
kubectl get ingress -n openbank

echo ""
echo "=== HPA Status ==="
kubectl get hpa -n openbank

echo ""
echo "=== Access Information ==="
MINIKUBE_IP=$(minikube ip)
echo "Minikube IP: $MINIKUBE_IP"
echo ""

# Detect OS
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" || "$OSTYPE" == "cygwin" ]]; then
    # Windows
    echo "For Windows users:"
    echo "1. Run PowerShell as Administrator"
    echo "2. Run this command:"
    echo "   Add-Content -Path \"C:\\Windows\\System32\\drivers\\etc\\hosts\" -Value \"$MINIKUBE_IP openbank.local\""
    echo ""
    echo "Or manually edit C:\\Windows\\System32\\drivers\\etc\\hosts and add:"
    echo "$MINIKUBE_IP openbank.local"
else
    # Linux/Mac
    echo "For Linux/Mac users:"
    echo "Run: sudo sh -c 'echo \"$MINIKUBE_IP openbank.local\" >> /etc/hosts'"
fi

echo ""
echo "=== Application URLs ==="
echo "Frontend: http://openbank.local"
echo "Backend API: http://openbank.local/api"
echo "Backend Health: http://openbank.local/api/health"
echo ""

echo "=== Testing Connection ==="
echo "Testing backend health..."
sleep 5
echo "From inside cluster:"
kubectl run -n openbank test-backend --image=curlimages/curl --rm -i --restart=Never -- curl -s http://openbank-backend:5000/api/health || echo "   (Test may need more time to initialize)"

echo ""
echo "From your machine (if hosts file is configured):"
echo "Run: curl http://openbank.local/api/health"
echo ""

echo "=== Useful Commands ==="
echo "View all resources:    kubectl get all -n openbank"
echo "View pod details:      kubectl describe pods -n openbank"
echo "View logs (backend):   kubectl logs -n openbank deployment/openbank-backend -f"
echo "View logs (frontend):  kubectl logs -n openbank deployment/openbank-frontend -f"
echo "Delete deployment:     kubectl delete namespace openbank"
echo "Port forwarding:"
echo "  Backend:  kubectl port-forward -n openbank svc/openbank-backend 5000:5000"
echo "  Frontend: kubectl port-forward -n openbank svc/openbank-frontend 3000:3000"
echo ""
echo "=== Docker vs Kubernetes ==="
echo "For local development:  ./scripts/deploy-local.sh"
echo "For Kubernetes:         ./scripts/deploy-k8s.sh"
echo "========================================="
