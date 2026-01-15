const client = require("prom-client");

// Enable default Node.js metrics
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 10000, prefix: "openbank_node_" });

// Business-specific metrics
const transactionCounter = new client.Counter({
  name: "openbank_transactions_total",
  help: "Total number of transactions",
  labelNames: ["type", "status", "currency"]
});

const accountCreationCounter = new client.Counter({
  name: "openbank_accounts_created_total",
  help: "Total number of accounts created",
  labelNames: ["account_type"]
});

const userRegistrationCounter = new client.Counter({
  name: "openbank_users_registered_total",
  help: "Total number of user registrations",
  labelNames: ["user_type"]
});

const loanApplicationCounter = new client.Counter({
  name: "openbank_loan_applications_total",
  help: "Total number of loan applications",
  labelNames: ["status", "loan_type"]
});

// Financial metrics
const totalBalanceGauge = new client.Gauge({
  name: "openbank_total_balance",
  help: "Total balance across all accounts",
  labelNames: ["currency"]
});

const averageTransactionValue = new client.Gauge({
  name: "openbank_average_transaction_value",
  help: "Average transaction value",
  labelNames: ["currency"]
});

// Performance metrics
const apiResponseTime = new client.Histogram({
  name: "openbank_api_response_time_seconds",
  help: "API response time in seconds",
  labelNames: ["endpoint", "method", "status"],
  buckets: [0.1, 0.5, 1, 2, 5, 10]
});

const databaseQueryDuration = new client.Histogram({
  name: "openbank_database_query_duration_seconds",
  help: "Database query duration in seconds",
  labelNames: ["operation", "collection"],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2]
});

// Rate limiting metrics
const rateLimitCounter = new client.Counter({
  name: "openbank_rate_limit_hits_total",
  help: "Total number of rate limit hits",
  labelNames: ["endpoint", "ip_address"]
});

// Export all metrics
module.exports = {
  client,
  transactionCounter,
  accountCreationCounter,
  userRegistrationCounter,
  loanApplicationCounter,
  totalBalanceGauge,
  averageTransactionValue,
  apiResponseTime,
  databaseQueryDuration,
  rateLimitCounter,
  
  // Helper functions
  incrementTransaction: (type, status = "completed", currency = "ZAR") => {
    transactionCounter.inc({ type, status, currency });
  },
  
  incrementAccountCreation: (accountType) => {
    accountCreationCounter.inc({ account_type: accountType });
  },
  
  recordApiResponseTime: (endpoint, method, status, duration) => {
    apiResponseTime.labels(endpoint, method, status).observe(duration);
  },
  
  recordDatabaseQuery: (operation, collection, duration) => {
    databaseQueryDuration.labels(operation, collection).observe(duration);
  },
  
  updateTotalBalance: (currency, amount) => {
    totalBalanceGauge.set({ currency }, amount);
  }
};