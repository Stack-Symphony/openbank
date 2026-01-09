<img width="1600" height="723" alt="OpenBank" src="https://github.com/Stack-Symphony/openbank/blob/main/OpenBank.PNG" />

# OpenBank - Complete Banking System Documentation

## 📋 Project Overview

OpenBank is a modern, secure, end-to-end digital banking system built with React (frontend), Node.js/Express (backend), and MongoDB. This project represents Weeks 1-2 of the development lifecycle, delivering a complete banking solution with authentication, account management, and transaction workflows.

**Live Demo**: coming soon

---

##  Architecture

### **Frontend** (Week 1 Focus)
- **Framework**: React 19
- **Language**: JavaScript (ES6+)
- **Styling**: Native CSS3 with CSS Variables
- **State Management**: LocalStorage (mock), Context API
- **PDF Generation**: jsPDF with AutoTable
- **Icons**: Custom SVG Component Library

### **Backend** (Week 2 Focus)
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.x
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + bcryptjs
- **Security**: CORS, Input Validation, Rate Limiting

---

##  Quick Setup Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community)
- [VS Code](https://code.visualstudio.com/) or any code editor
- Git (optional, for cloning)
- Postman (for API testing)

### Critical Startup Order
1. **Start MongoDB** → Port 27017
2. **Start Backend** → Port 5000
3. **Start Frontend** → Port 3000

### Terminal Setup (Three Terminals)

**Terminal 1: MongoDB**
```bash
# Windows (adjust path as needed)
cd "C:\Program Files\MongoDB\Server\8.2\bin"
mongod

# macOS/Linux
sudo systemctl start mongod
# or
mongod --config /usr/local/etc/mongod.conf
```

**Terminal 2: Backend**
```bash
cd backend
npm install
npm install express mongoose dotenv cors bcrypt jsonwebtoken validator nodemon --save
# Create .env file (copy from .env.example)
# Add your environment variables
npm start
# or for development
npm run dev
```

**Terminal 3: Frontend**
```bash
cd frontend
npm install
npm start
```

---

##  Project Structure

### Frontend (`/openbank`)
```
OpenBank/
├── index.html                 # Entry point & Global Styles
├── index.js                   # React Root
├── App.js                     # Main Router & Global State Manager
└── components/
    ├── CustomIcons.js         # SVG Icon System
    ├── BrandingPanel.js       # Auth Screen Visuals
    ├── RegisterForm.js        # Login/Signup Logic
    ├── Dashboard.js           # Main User Interface
    ├── AccountDetailsPage.js  # Specific Account History
    ├── TransactionHistoryPage.js # Global History & PDF Export
    ├── TransferPage.js        # Internal Transfer Form
    ├── DepositPage.js        # Deposit Logic
    ├── WithdrawPage.js       # Withdrawal Logic
    └── ProfilePage.js        # User Settings
```

### Backend (`/openbank-backend`)
```
openbank-backend/
├── config/                 # Configuration files
│   └── db.js              # Database connection setup
├── controllers/           # Business logic
│   ├── authController.js  # Authentication logic
│   └── transactionController.js # Transaction processing
├── middleware/            # Express middleware
│   └── authMiddleware.js  # JWT authentication
├── models/               # MongoDB schemas
│   ├── User.js           # User model with validation
│   └── Transaction.js    # Transaction model
├── routes/               # API routes
│   ├── authRoutes.js     # Authentication endpoints
│   ├── userRoutes.js     # User profile endpoints
│   └── transactionRoutes.js # Transaction endpoints
├── tests/                # Test files
├── .env                  # Environment variables
├── .env.example          # Environment template
├── package.json         # Dependencies
├── package-lock.json    # Lock file
├── server.js           # Application entry point
└── README.md           # Project documentation
```

---

##  Environment Configuration

### Backend `.env` File
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/openbank
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:3000
```

### Generating JWT Secret
```bash
# Method 1: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Method 2: Using OpenSSL
openssl rand -hex 32

# Method 3: Create generateSecret.js
const crypto = require('crypto');
console.log(crypto.randomBytes(32).toString('hex'));
```

---

##  Frontend Features

### Authentication & Security
- **Secure Login/Registration**: Form validation including South African ID number (13-digit check)
- **Mobile Number Formatting**: Automatic +27 formatting
- **Mock Security Features**: Visual simulation of Two-Factor Authentication (2FA)
- **Password Visibility**: Toggle to show/hide passwords

### Interactive Dashboard
- **3D Digital Card**: Interactive flip animation revealing CVV and expiry details
- **Account Overview**: Real-time summary of multiple account types:
  - Savings Account
  - Checking Account
  - Business Account
  - Investment Account
- **Responsive Design**: Mobile-first approach with desktop optimizations

### Transaction Management
- **Deposits**: Support for Card and EFT deposits
- **Withdrawals**: EFT and "Instant Money" (Cash Send) with voucher code generation
- **Internal Transfers**: Seamless movement between accounts
- **Notifications**: Simulated SMS toast notifications for transactions

### History & Statements
- **Transaction Log**: Detailed history of all account activities
- **PDF Statements**: Client-side generation using jsPDF and jspdf-autotable
- **Export Options**: Download statements in PDF format

### Mock Data System
- **Default Login Credentials**:
  - SA ID: `8001015009087`
  - Password: `password123`
- **LocalStorage Persistence**: Data persists across browser sessions
- **Reset Option**: Use `localStorage.clear()` in console to clear all data

---

##  Backend API Features

### Authentication & Security
- **JWT-Based Authentication**: Secure token-based authentication with 30-day expiry
- **Password Security**: bcrypt hashing with salt rounds
- **Protected Routes**: Middleware for securing sensitive endpoints
- **Input Validation**: Comprehensive validation for all user inputs
- **CORS Protection**: Configured for secure frontend-backend communication

### API Features
- **RESTful Architecture**: Clean, predictable API endpoints
- **Error Handling**: Comprehensive error responses with proper HTTP codes
- **Rate Limiting**: Protection against brute force attacks
- **Request Logging**: Detailed logging for debugging and monitoring
- **Health Checks**: API status monitoring endpoints

---

## 📡 API Documentation

### Base URL
- **Development**: `http://localhost:5000/api`
- **Production**: `https://your-backend-api.com/api`

### Authentication Endpoints

#### Register a New User
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "saIdNumber": "8001015009087",
  "email": "john.doe@example.com",
  "phoneNumber": "0821234567",
  "password": "password123"
}
```

#### User Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "saIdNumber": "8001015009087",
  "password": "password123"
}
```

### User Profile Endpoints

#### Get User Profile (Protected)
```http
GET /api/user/profile
Authorization: Bearer <your_jwt_token>
```

#### Update User Profile (Protected)
```http
PUT /api/user/profile
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "email": "new.email@example.com",
  "phoneNumber": "0829876543",
  "twoFactorEnabled": true
}
```

### Transaction Endpoints

#### Get Transaction History (Protected)
```http
GET /api/transactions
Authorization: Bearer <your_jwt_token>
```

#### Create Deposit (Protected)
```http
POST /api/transactions
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "type": "deposit",
  "amount": "500.00",
  "title": "Salary Deposit",
  "accountType": "checking",
  "description": "Monthly salary"
}
```

#### Create Withdrawal (Protected)
```http
POST /api/transactions
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "type": "withdrawal",
  "amount": "250.00",
  "title": "ATM Withdrawal",
  "accountType": "checking",
  "description": "Grocery shopping"
}
```

#### Create Transfer (Protected)
```http
POST /api/transactions
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "type": "transfer",
  "amount": "1000.00",
  "title": "Savings Transfer",
  "accountType": "checking",
  "toAccountType": "savings",
  "description": "Monthly savings"
}
```

### System Endpoints

#### Health Check
```http
GET /api/health
```

---

##  Database Setup

### Option 1: Local MongoDB
```bash
# macOS
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Ubuntu/Debian
sudo apt update
sudo apt install mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Windows
net start MongoDB
```

### Option 2: MongoDB Atlas (Cloud)
1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/openbank?retryWrites=true&w=majority
   ```
4. Update `MONGO_URI` in `.env` file

### Option 3: Docker (Recommended for Development)
```bash
# Start MongoDB with Docker
docker run -d -p 27017:27017 --name openbank-mongo mongo:latest

# Or use Docker Compose
docker-compose up -d
```

### Initialize Sample Data
```javascript
// Connect to MongoDB shell
mongosh

// Create database
use openbank

// Insert sample user
db.users.insertOne({
  "firstName": "John",
  "lastName": "Doe",
  "saIdNumber": "8001015009087",
  "email": "john.doe@example.com",
  "phoneNumber": "0821234567",
  "password": "$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqaG3vv1iyVFK",
  "accountNumber": "1234567890",
  "cardNumber": "4532 7612 9088 3456",
  "balances": {
    "savings": 1700.00,
    "checking": 3050.00,
    "business": 10200.00,
    "investment": 14000.00
  },
  "twoFactorEnabled": false,
  "createdAt": new Date()
});
```

---

##  Testing

### Frontend Testing
```bash
# Run development server
npm start

# Build for production
npm run build
```

### Backend Testing

#### Unit Tests
```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

#### API Testing
```bash
# Install test dependencies
npm install --save-dev jest supertest mongodb-memory-server

# Run API tests
npm run test:api
```

### Postman Collection Setup
1. **Locate Collection File**: Find `postman_collection.json` in project files
2. **Import into Postman**: File → Import → Select the collection file
3. **Set Up Environment Variables**:
   - Create new environment "OpenBank Development"
   - Add variables:
     ```
     base_url: http://localhost:5000
     token: (will be set after login)
     ```

4. **Testing Workflow**:
   1. Test `/api/health` - Verify server is running
   2. Register a test user via `/api/auth/register`
   3. Login via `/api/auth/login` - Copy token to environment
   4. Test protected endpoints with token

---

##  Deployment

### Production Environment Variables
```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/openbank?retryWrites=true&w=majority
JWT_SECRET=your_strong_production_secret_here
JWT_EXPIRE=30d
FRONTEND_URL=https://your-frontend-app.com
```

### Using PM2 (Recommended for Backend)
```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start server.js --name "openbank-api"

# Save process list
pm2 save

# Setup startup script
pm2 startup

# Monitor application
pm2 monit
```

### Frontend Integration
```javascript
// Update frontend App.tsx to use real API
const API_BASE_URL = 'http://localhost:5000/api';

// Example API call for login
const login = async (saIdNumber: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ saIdNumber, password })
  });
  
  const data = await response.json();
  if (data.success) {
    localStorage.setItem('token', data.data.token);
  }
  return data;
};
```

---

##  Troubleshooting

### Common Issues

#### 1. MongoDB Connection Failed
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Ensure MongoDB is running:
```bash
sudo systemctl status mongodb
# or
brew services list | grep mongodb
```

#### 2. JWT Token Not Working
```
Error: Not authorized, token failed
```
**Solution**:
- Check `JWT_SECRET` in `.env` matches
- Verify token hasn't expired (30 days default)
- Ensure token is included in Authorization header

#### 3. CORS Errors
```
Access-Control-Allow-Origin error
```
**Solution**: Update `FRONTEND_URL` in `.env` file

#### 4. Port Conflicts
- **Backend**: `http://localhost:5000`
- **Frontend**: `http://localhost:3000`
- **MongoDB**: `mongodb://localhost:27017`

#### 5. Missing node_modules
```bash
# Delete and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Debug Mode
```bash
# Enable debug logging
export DEBUG=express:*
export NODE_ENV=development
npm run dev
```

---

##  Performance Monitoring

### Enable Monitoring
```bash
# Install monitoring tools
npm install --save express-status-monitor morgan

# Access monitoring dashboard at:
# http://localhost:5000/status
```

### Logging
```bash
# View logs with PM2
pm2 logs openbank-api

# Or with Docker
docker logs -f openbank-api
```

---

##  Development Guidelines

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/amazing-feature

# Commit changes
git commit -m 'Add amazing feature'

# Push to branch
git push origin feature/amazing-feature

# Open Pull Request
```

### Code Standards
- Follow JavaScript Standard Style
- Write meaningful commit messages
- Add tests for new features
- Update documentation
- Use meaningful variable names
- Implement proper error handling

---

##  License
This project is licensed under the MIT License - see the LICENSE file for details.

---

##  Acknowledgments
- Express.js team for the amazing framework
- MongoDB for the database
- JWT for authentication
- All contributors and testers
- React team for the frontend framework

---

##  Useful Links
- **Frontend Repository**: https://github.com/Stack-Symphony/openbank
- **Backend Repository**: https://github.com/yourusername/openbank-backend
- **Live Demo**: Coming soon 
- **API Documentation**: Included in Postman collection

---

##  Support
For issues or questions:
1. Check the Troubleshooting section
2. Review API documentation
3. Examine server logs
4. Contact development team
