// server.js - FULL UPDATED CODE WITH METRICS
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes'); 
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const promBundle = require('express-prom-bundle');
const client = require('prom-client');

// Load environment variables
dotenv.config();

const app = express();

// Database Connection
connectDB();

// ----------------------------------------------------
// CORS Configuration - FIXED
// ----------------------------------------------------
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:8080',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173'
].filter(Boolean);

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // Check if origin is allowed
        if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('localhost') || origin.includes('127.0.0.1')) {
            callback(null, true);
        } else {
            console.log('CORS blocked for origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    allowedHeaders: [
        'Content-Type', 
        'Authorization', 
        'Accept', 
        'Origin', 
        'X-Requested-With',
        'X-Auth-Token',
        'X-CSRF-Token'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    maxAge: 86400,
    exposedHeaders: ['Authorization', 'Content-Length', 'X-Total-Count']
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests explicitly
//app.options('*', cors(corsOptions));

// ----------------------------------------------------
// PROMETHEUS METRICS CONFIGURATION
// ----------------------------------------------------
const metricsMiddleware = promBundle({
  includeMethod: true,
  includePath: true,
  includeStatusCode: true,
  includeUp: true,
  customLabels: { project: 'openbank' },
  promClient: {
    collectDefaultMetrics: {
      timeout: 5000
    }
  }
});

// Apply metrics middleware BEFORE other middleware
app.use(metricsMiddleware);

// ----------------------------------------------------
// CUSTOM METRICS
// ----------------------------------------------------
const transactionCounter = new client.Counter({
  name: 'openbank_transactions_total',
  help: 'Total number of transactions',
  labelNames: ['type', 'account', 'status']
});

const activeUsersGauge = new client.Gauge({
  name: 'openbank_active_users',
  help: 'Number of active users in the last 15 minutes'
});

const httpRequestDuration = new client.Histogram({
  name: 'openbank_http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

const databaseConnectionGauge = new client.Gauge({
  name: 'openbank_database_connection_status',
  help: 'Database connection status (1 = connected, 0 = disconnected)'
});

const errorCounter = new client.Counter({
  name: 'openbank_errors_total',
  help: 'Total number of errors',
  labelNames: ['type', 'endpoint']
});

// Track active users (you'd need to implement actual session tracking)
// For now, we'll track authenticated requests
let activeUsers = new Set();

app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .observe(duration);
  });
  
  // Track authenticated users
  if (req.user && req.user.id) {
    activeUsers.add(req.user.id);
    activeUsersGauge.set(activeUsers.size);
    
    // Remove user from active set after 15 minutes of inactivity
    setTimeout(() => {
      activeUsers.delete(req.user.id);
      activeUsersGauge.set(activeUsers.size);
    }, 15 * 60 * 1000); // 15 minutes
  }
  
  next();
});

// Update database connection status
const updateDatabaseStatus = () => {
  const status = mongoose.connection.readyState === 1 ? 1 : 0;
  databaseConnectionGauge.set(status);
};

mongoose.connection.on('connected', () => {
  console.log('Database connected - updating metrics');
  updateDatabaseStatus();
});

mongoose.connection.on('disconnected', () => {
  console.log('Database disconnected - updating metrics');
  updateDatabaseStatus();
});

// ----------------------------------------------------
// METRICS ENDPOINT
// ----------------------------------------------------
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', client.register.contentType);
    const metrics = await client.register.metrics();
    res.end(metrics);
  } catch (error) {
    res.status(500).end(error);
  }
});

// ----------------------------------------------------
// BODY PARSER MIDDLEWARE
// ----------------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ----------------------------------------------------
// API Routes
// ----------------------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/transactions', transactionRoutes);

// ----------------------------------------------------
// HEALTH CHECK ROUTE WITH METRICS
// ----------------------------------------------------
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  const uptime = process.uptime();
  
  res.status(200).json({
    status: 'success',
    message: 'OpenBank API is running',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`,
    database: dbStatus,
    metrics: {
      endpoint: '/metrics',
      activeUsers: activeUsers.size
    },
    cors: {
      allowedOrigins: allowedOrigins,
      credentials: true
    }
  });
});

// Test route without auth
app.get('/api/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend is working!',
    timestamp: new Date().toISOString(),
    metrics: 'Available at /metrics endpoint'
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'OpenBank Backend API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/user',
      transactions: '/api/transactions',
      health: '/api/health',
      test: '/api/test',
      metrics: '/metrics'
    },
    cors: {
      allowedOrigins: allowedOrigins
    }
  });
});

// ----------------------------------------------------
// ERROR HANDLING MIDDLEWARE WITH METRICS
// ----------------------------------------------------
app.use((err, req, res, next) => {
  // Handle CORS errors specifically
  if (err.message.includes('CORS')) {
    errorCounter.inc({ type: 'cors_error', endpoint: req.path });
    return res.status(403).json({
      status: 'error',
      message: 'CORS Error: Request blocked. Check your frontend URL.',
      allowedOrigins: allowedOrigins
    });
  }
  
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  
  // Track errors in metrics
  errorCounter.inc({ type: 'server_error', endpoint: req.path });
  
  res.json({
    status: 'error',
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// 404 Handler
app.use((req, res) => {
  errorCounter.inc({ type: 'not_found', endpoint: req.path });
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: [
      '/api/auth',
      '/api/user', 
      '/api/transactions',
      '/api/health',
      '/api/test',
      '/metrics'
    ]
  });
});

// ----------------------------------------------------
// HELPER FUNCTION TO INCREMENT TRANSACTION COUNTER
// ----------------------------------------------------
const incrementTransactionCounter = (type, account, status = 'completed') => {
  transactionCounter.inc({
    type: type,
    account: account,
    status: status
  });
};

// Export the increment function and metrics for use in other files
module.exports = {
  incrementTransactionCounter,
  errorCounter,
  activeUsersGauge,
  app
};

// ----------------------------------------------------
// SERVER STARTUP
// ----------------------------------------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  updateDatabaseStatus(); // Initial status update
  
  console.log(`=======================================`);
  console.log(` Server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(` Port: ${PORT}`);
  console.log(`=======================================`);
  console.log(` Health Check: http://localhost:${PORT}/api/health`);
  console.log(` Test Route: http://localhost:${PORT}/api/test`);
  console.log(` Metrics: http://localhost:${PORT}/metrics`);
  console.log(` CORS configured for origins: ${allowedOrigins.join(', ')}`);
  console.log(` API Base URL: http://localhost:${PORT}`);
  console.log(`=======================================`);
  console.log(` Prometheus metrics enabled:`);
  console.log(`   - Transaction tracking`);
  console.log(`   - Active user monitoring`);
  console.log(`   - Database connection status`);
  console.log(`   - HTTP request duration`);
  console.log(`   - Error tracking`);
  console.log(`=======================================`);
});