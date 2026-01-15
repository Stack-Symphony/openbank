#!/bin/bash
# setup-monitoring.sh - Run from OPENBANK-MAIN root

echo "🔧 Setting up OpenBank Monitoring..."

# Create monitoring directories
mkdir -p monitoring/prometheus
mkdir -p monitoring/grafana/{provisioning/datasources,provisioning/dashboards,dashboards}

# Create Prometheus config
cat > monitoring/prometheus/prometheus.yml << 'EOF'
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'openbank-backend'
    static_configs:
      - targets: ['backend:5000']
    metrics_path: '/metrics'
    scrape_interval: 15s

  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']

  - job_name: 'mongodb-exporter'
    static_configs:
      - targets: ['mongodb-exporter:9216']
EOF

# Create Grafana datasource
cat > monitoring/grafana/provisioning/datasources/datasource.yml << 'EOF'
apiVersion: 1
datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
EOF

# Create Grafana dashboard provisioning
cat > monitoring/grafana/provisioning/dashboards/dashboard.yml << 'EOF'
apiVersion: 1
providers:
  - name: 'default'
    orgId: 1
    folder: ''
    type: file
    options:
      path: /var/lib/grafana/dashboards
EOF

# Create sample dashboard
cat > monitoring/grafana/dashboards/openbank-dashboard.json << 'EOF'
{
  "dashboard": {
    "title": "OpenBank System Dashboard",
    "panels": []
  }
}
EOF

# Update backend dependencies
cd backend
if [ -f "package.json" ]; then
  npm install prom-client express-prom-bundle --save
fi
cd ..

echo "📁 Created monitoring structure:"
echo "  ✅ monitoring/prometheus/prometheus.yml"
echo "  ✅ monitoring/grafana/provisioning/datasources/datasource.yml"
echo "  ✅ monitoring/grafana/provisioning/dashboards/dashboard.yml"
echo "  ✅ monitoring/grafana/dashboards/openbank-dashboard.json"
echo ""
echo "🚀 To start everything:"
echo "  docker-compose down"
echo "  docker-compose up -d"
echo ""
echo "📊 Access:"
echo "  Grafana:    http://localhost:3001 (admin/admin)"
echo "  Prometheus: http://localhost:9090"
EOF