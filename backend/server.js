

// server.js - FULL UPDATED CODE
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


// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ----------------------------------------------------
// API Routes
// ----------------------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/transactions', transactionRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'OpenBank API is running',
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
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
        timestamp: new Date().toISOString()
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
            test: '/api/test'
        },
        cors: {
            allowedOrigins: allowedOrigins
        }
    });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    // Handle CORS errors specifically
    if (err.message.includes('CORS')) {
        return res.status(403).json({
            status: 'error',
            message: 'CORS Error: Request blocked. Check your frontend URL.',
            allowedOrigins: allowedOrigins
        });
    }
    
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        status: 'error',
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: `Route ${req.originalUrl} not found`,
        availableRoutes: ['/api/auth', '/api/user', '/api/transactions', '/api/health', '/api/test']
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(` Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(` Health Check: http://localhost:${PORT}/api/health`);
    console.log(` Test Route: http://localhost:${PORT}/api/test`);
    console.log(` CORS configured for origins: ${allowedOrigins.join(', ')}`);
    console.log(` API Base URL: http://localhost:${PORT}`);
});
