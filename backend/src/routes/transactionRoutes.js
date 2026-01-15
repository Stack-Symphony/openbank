const express = require("express");
const router = express.Router();
const { 
  incrementTransaction,
  recordApiResponseTime 
} = require("/backend/src/metrics");

// Add metrics middleware to transaction routes
router.use((req, res, next) => {
  const start = Date.now();
  
  res.on("finish", () => {
    const duration = (Date.now() - start) / 1000;
    recordApiResponseTime(req.path, req.method, res.statusCode, duration);
  });
  
  next();
});

// Example transaction creation route with metrics
router.post("/", async (req, res) => {
  const start = Date.now();
  
  try {
    // Your existing transaction logic...
    const transaction = await Transaction.create(req.body);
    
    // Record transaction metrics
    incrementTransaction(
      transaction.type, 
      "completed", 
      transaction.currency
    );
    
    // Update total balance if needed
    // updateTotalBalance(transaction.currency, newTotal);
    
    res.status(201).json(transaction);
  } catch (error) {
    // Record failed transaction
    incrementTransaction(
      req.body.type || "unknown", 
      "failed", 
      req.body.currency || "ZAR"
    );
    
    // Record error metrics
    recordApiResponseTime(req.path, req.method, 500, (Date.now() - start) / 1000);
    
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;