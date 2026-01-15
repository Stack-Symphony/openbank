// server.js - FIXED VERSION
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes"); 
const userRoutes = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const promBundle = require("express-prom-bundle");
const client = require("prom-client");
const dbMetricsMiddleware = require("./src/middleware/dbMetrics");

// Import metrics from central file
const {
  transactionCounter,
  activeUsersGauge,
  httpRequestDuration,
  errorCounter,
  apiRequestsCounter,
  responseSizeHistogram,
  databaseConnectionGauge,
  incrementTransactionCounter,
  recordError,
  getActiveUsersCount
} = require("./src/metrics");

// Load environment variables
dotenv.config();

const app = express();

// Database Connection
connectDB();

// ----------------------------------------------------
// CORS Configuration
// ----------------------------------------------------
const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:8080",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "http://localhost:3001"
].filter(Boolean);

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || origin.includes("localhost") || origin.includes("127.0.0.1")) {
            callback(null, true);
        } else {
            console.log("CORS blocked for origin:", origin);
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    allowedHeaders: [
        "Content-Type", "Authorization", "Accept", "Origin", 
        "X-Requested-With", "X-Auth-Token", "X-CSRF-Token"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    maxAge: 86400,
    exposedHeaders: ["Authorization", "Content-Length", "X-Total-Count"]
};
app.use(dbMetricsMiddleware);
app.use(cors(corsOptions));

// ----------------------------------------------------
// Prometheus Metrics Middleware
// ----------------------------------------------------
const metricsMiddleware = promBundle({
  includeMethod: true,
  includePath: true,
  includeStatusCode: true,
  includeUp: true,
  customLabels: { 
    project_name: "openbank", 
    project_type: "api",
    environment: process.env.NODE_ENV || "development"
  },
  promClient: {
    collectDefaultMetrics: {
      timeout: 1000,
      prefix: "openbank_nodejs_"
    }
  },
  normalizePath: [
    ["^/api/user/.+", "/api/user/#id"],
    ["^/api/transactions/.+", "/api/transactions/#id"],
    ["^/api/auth/.+", "/api/auth/#action"]
  ],
  httpDurationMetricName: "openbank_http_request_duration_seconds"
});

app.use(metricsMiddleware);

// ----------------------------------------------------
// Active Users Tracking
// ----------------------------------------------------
let activeUsers = new Map();

// Middleware to record metrics
app.use((req, res, next) => {
  const start = Date.now();
  const originalSend = res.send;
  let responseBody = "";

  res.send = function(body) {
    if (typeof body === "string") responseBody = body;
    else if (Buffer.isBuffer(body)) responseBody = body.toString();
    else if (typeof body === "object") responseBody = JSON.stringify(body);
    return originalSend.call(this, body);
  };

  res.on("finish", () => {
    const duration = (Date.now() - start) / 1000;
    const endpointType = req.path.startsWith("/api/") ? "api" : "system";

    httpRequestDuration
      .labels(req.method, req.route?.path || req.path, res.statusCode, endpointType)
      .observe(duration);

    if (endpointType === "api") {
      apiRequestsCounter.inc({
        method: req.method,
        endpoint: req.path,
        status_code: res.statusCode
      });
    }

    if (responseBody) {
      responseSizeHistogram
        .labels(req.path)
        .observe(Buffer.byteLength(responseBody, "utf8"));
    }
  });

  if (req.user && req.user.id) {
    const userId = req.user.id;
    activeUsers.set(userId, Date.now());

    const fifteenMinutesAgo = Date.now() - (15 * 60 * 1000);
    for (const [id, timestamp] of activeUsers.entries()) {
      if (timestamp < fifteenMinutesAgo) activeUsers.delete(id);
    }

    activeUsersGauge.set(activeUsers.size);
  }

  next();
});

// ----------------------------------------------------
// Database Connection Status
// ----------------------------------------------------
const updateDatabaseStatus = () => {
  const status = mongoose.connection.readyState === 1 ? 1 : 0;
  databaseConnectionGauge.set(status);
};

mongoose.connection.on("connected", () => updateDatabaseStatus());
mongoose.connection.on("disconnected", () => updateDatabaseStatus());

// ----------------------------------------------------
// Metrics Endpoint
// ----------------------------------------------------
app.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", client.register.contentType);

    const fifteenMinutesAgo = Date.now() - (15 * 60 * 1000);
    for (const [id, timestamp] of activeUsers.entries()) {
      if (timestamp < fifteenMinutesAgo) activeUsers.delete(id);
    }
    activeUsersGauge.set(activeUsers.size);

    const metrics = await client.register.metrics();
    res.end(metrics);
  } catch (error) {
    console.error("Metrics endpoint error:", error);
    errorCounter.inc({ type: "metrics_error", endpoint: "/metrics", status_code: 500 });
    res.status(500).json({ error: "Failed to generate metrics" });
  }
});

// ----------------------------------------------------
// Health Endpoints
// ----------------------------------------------------
app.get("/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();

  res.status(200).json({
    status: "UP",
    timestamp: new Date().toISOString(),
    service: "openbank-backend",
    version: "1.0.0",
    uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`,
    database: dbStatus,
    node: {
      version: process.version,
      memory: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`
      }
    },
    metrics: {
      endpoint: "/metrics",
      activeUsers: activeUsers.size
    },
    cors: { allowedOrigins, credentials: true }
  });
});

// ----------------------------------------------------
// Body Parser & Routes
// ----------------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/transactions", transactionRoutes);

app.get("/api/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is working!",
    timestamp: new Date().toISOString(),
    metrics: "Available at /metrics endpoint"
  });
});

// ----------------------------------------------------
// Error Handling
// ----------------------------------------------------
app.use((err, req, res, next) => {
  if (err.message.includes("CORS")) {
    errorCounter.inc({ type: "cors_error", endpoint: req.path, status_code: 403 });
    return res.status(403).json({ status: "error", message: "CORS Error" });
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  errorCounter.inc({ type: "server_error", endpoint: req.path, status_code:
 
  // Record error in metrics
  errorCounter.inc({ 
    type: "server_error", 
    endpoint: req.path,
    status_code: statusCode
  });
  
  res.status(statusCode).json({
    status: "error",
    message: err.message,
    timestamp: new Date().toISOString(),
    path: req.path,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

// 404 Handler with metrics
app.use((req, res) => {
  errorCounter.inc({ 
    type: "not_found", 
    endpoint: req.path, 
    status_code: 404 
  });
  
  res.status(404).json({
    status: "error",
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString(),
    availableRoutes: [
      "/api/auth/*",
      "/api/user/*", 
      "/api/transactions/*",
      "/health",
      "/health/liveness",
      "/health/readiness",
      "/api/health",
      "/api/test",
      "/metrics"
    ]
  });
});

// ----------------------------------------------------
// METRICS HELPER FUNCTIONS (for use in other files)
// ----------------------------------------------------
const incrementTransactionCounter = (type, accountType, status = "completed", currency = "ZAR") => {
  transactionCounter.inc({ 
    type, 
    account_type: accountType, 
    status, 
    currency 
  });
};

const recordError = (type, endpoint, statusCode = 500) => {
  errorCounter.inc({ type, endpoint, status_code: statusCode });
};

const getActiveUsersCount = () => activeUsers.size;

// ----------------------------------------------------
// REGISTER METRICS FOR EXPORT
// ----------------------------------------------------
const metrics = {
  transactionCounter,
  activeUsersGauge,
  errorCounter,
  apiRequestsCounter,
  responseSizeHistogram,
  databaseConnectionGauge,
  httpRequestDuration,
  incrementTransactionCounter,
  recordError,
  getActiveUsersCount
};

module.exports = {
  metrics,
  app
};

// ----------------------------------------------------
// SERVER STARTUP WITH ENHANCED LOGGING
// ----------------------------------------------------
const PORT = process.env.PORT || 5000;

// Start server with graceful shutdown
const server = app.listen(PORT, () => {
  updateDatabaseStatus();
  
  console.log("\n" + "=".repeat(55));
  console.log("OPENBANK BACKEND SERVER STARTED");
  console.log("=".repeat(55));
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`Port: ${PORT}`);
  console.log(`Database: ${mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"}`);
  console.log("-".repeat(55));
  console.log("ENDPOINTS:");
  console.log(`   Metrics:     http://localhost:${PORT}/metrics`);
  console.log(`   Health:      http://localhost:${PORT}/health`);
  console.log(`   Liveness:    http://localhost:${PORT}/health/liveness`);
  console.log(`   Readiness:   http://localhost:${PORT}/health/readiness`);
  console.log(`   API Test:    http://localhost:${PORT}/api/test`);
  console.log(`   API Root:    http://localhost:${PORT}/`);
  console.log("-".repeat(55));
  console.log("CORS Origins:");
  allowedOrigins.forEach(origin => console.log(`   - ${origin}`));
  console.log("=".repeat(55));
  console.log("PROMETHEUS METRICS ENABLED:");
  console.log("   - HTTP Request tracking & timing");
  console.log("   - Active user monitoring");
  console.log("   - Transaction counters");
  console.log("   - Database connection status");
  console.log("   - Error tracking & categorization");
  console.log("   - Response size monitoring");
  console.log("=".repeat(55) + "\n");
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("Server closed.");
    mongoose.connection.close(false, () => {
      console.log("Database connection closed.");
      process.exit(0);
    });
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down gracefully...");
  server.close(() => {
    console.log("Server closed.");
    mongoose.connection.close(false, () => {
      console.log("Database connection closed.");
      process.exit(0);
    });
  });
});