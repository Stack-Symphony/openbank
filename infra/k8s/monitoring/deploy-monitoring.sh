#!/bin/bash

# Create monitoring namespace
kubectl create namespace monitoring

# Deploy Prometheus
kubectl apply -f prometheus-config.yaml
kubectl apply -f prometheus-deployment.yaml

# Create Grafana secrets
kubectl create secret generic grafana-secrets \
  --namespace=monitoring \
  --from-literal=admin-password=admin123

# Deploy Grafana
kubectl apply -f grafana-datasources.yaml
kubectl apply -f grafana-dashboards.yaml
kubectl apply -f grafana-deployment.yaml

# Create Ingress for monitoring tools
cat <<EOF | kubectl apply -f -
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: monitoring-ingress
  namespace: monitoring
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  rules:
  - host: monitor.openbank.local
    http:
      paths:
      - path: /grafana
        pathType: Prefix
        backend:
          service:
            name: grafana
            port:
              number: 3000
      - path: /prometheus
        pathType: Prefix
        backend:
          service:
            name: prometheus
            port:
              number: 9090
EOF

echo "Monitoring stack deployed!"
echo "Access Grafana at: http://monitor.openbank.local/grafana"
echo "Username: admin"
echo "Password: admin123"
echo ""
echo "Access Prometheus at: http://monitor.openbank.local/prometheus"