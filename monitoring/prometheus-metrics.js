const promClient = require('prom-client');

// Create a Registry to register the metrics
const register = new promClient.Registry();

// Add default metrics (CPU, memory, etc.)
promClient.collectDefaultMetrics({ register });

// Custom metrics
const httpRequestCounter = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'endpoint', 'status']
});

const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'endpoint'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

const transactionCounter = new promClient.Counter({
  name: 'transactions_total',
  help: 'Total transactions processed',
  labelNames: ['type', 'status']
});

const apiLatency = new promClient.Gauge({
  name: 'api_latency_seconds',
  help: 'API endpoint latency in seconds'
});

// Register all metrics
register.registerMetric(httpRequestCounter);
register.registerMetric(httpRequestDuration);
register.registerMetric(transactionCounter);
register.registerMetric(apiLatency);

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Middleware to track requests
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    
    httpRequestCounter.inc({
      method: req.method,
      endpoint: path,
      status: res.statusCode
    });
    
    httpRequestDuration.observe({
      method: req.method,
      endpoint: path
    }, duration);
  });
  
  next();
});

module.exports = {
  register,
  httpRequestCounter,
  httpRequestDuration,
  transactionCounter,
  apiLatency
};