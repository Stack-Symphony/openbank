const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes'); 
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

// Load environment variables
dotenv.config();

const app = express();

// Database Connection
connectDB();

// ----------------------------------------------------
// CRITICAL FIX: Global CORS Middleware (Single Configuration)
// ----------------------------------------------------
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:3000';

const corsOptions = {
    // 1. Specify the exact origin of  frontend
    origin: allowedOrigin,
    
    // 2. Allow credentials (crucial for cookies/sessions, even if you use Bearer tokens)
    credentials: true,
    
    // 3. CRITICAL: Explicitly allow headers needed for login and protected routes
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'], 
    
    // 4. Methods allowed
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    
    // 5. Status for successful preflight (standard is 204, 200 is safer for older clients)
    optionsSuccessStatus: 200 
};

// APPLY THE CORS MIDDLEWARE GLOBALLY
app.use(cors(corsOptions)); 
// ----------------------------------------------------


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/transactions', transactionRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'OpenBank API is running',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(` Health Check: http://localhost:${PORT}/api/health`);
  console.log(` CORS configured for: ${allowedOrigin}`);
});
