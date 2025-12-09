---
<img width="1600" height="723" alt="OpenBank" src="https://github.com/Stack-Symphony/openbank/blob/main/OpenBank.PNG" />
# OpenBank — Fullstack Digital Banking Platform

OpenBank is a modern, secure, end-to-end digital banking system built with React (frontend), Node.js/Express (backend), and MongoDB. It delivers a clean UI, realistic financial actions, user authentication, account management, and full transaction workflows. This version reflects the Week 1 (frontend) and Week 2 (backend) development milestones, with space to extend into Docker, CI/CD, and cloud deployment.

---

## Frontend Overview

**Live Deployment:**
[https://openbank-nine.vercel.app/](https://openbank-nine.vercel.app/)
**Repository:**
[https://github.com/Stack-Symphony/openbank](https://github.com/Stack-Symphony/openbank)

A responsive banking interface built with React 19, focusing on authentication, dashboard interaction, and financial workflows.

### Key Features

* Login and registration with SA ID validation, mobile number formatting, and mock 2FA simulation.
* Account dashboard with a 3D flip-card, multi-account balance views, and responsive layouts for mobile and desktop.
* Deposit, withdrawal, internal transfers, voucher-code withdrawals, and SMS-style notifications.
* Transaction history with client-side PDF statement generation using jsPDF.
* LocalStorage-based mock database for development before backend integration.

### Technology

React 19, JavaScript (ES6+), CSS3 with variables, custom SVG icons, jsPDF, LocalStorage.

### Structure

Core components include Authentication pages, Dashboard, Transaction pages, Profile management, and PDF export utilities.

---

## Backend API Overview

**Repository:**
[https://github.com/yourusername/openbank-backend](https://github.com/yourusername/openbank-backend)
**API Base URL:** (update after deployment)
`https://your-backend-api.com/api`

A secure and scalable REST API built using Node.js, Express, MongoDB, and JWT authentication.

### Key Features

* JWT authentication with bcrypt password hashing and protected routes.
* RESTful endpoints for users, authentication, and transactions.
* Full transaction logic for deposits, withdrawals, and account transfers.
* Error handling, rate limiting, request logging, and CORS configuration.
* Health check endpoint for monitoring and automation.

### Technology

Node.js 18+, Express 4, MongoDB 6+, Mongoose, JWT, bcrypt, dotenv, PM2 (optional), Docker-ready structure.

### API Structure

* Controllers for authentication, user management, and transactions
* Routes split by responsibility
* Middleware for authentication and validation
* Mongoose models for User and Transaction
* Config folder for database and environment logic

---

## Quick Setup

### Frontend

```bash
git clone https://github.com/Stack-Symphony/openbank.git
cd openbank
npm install
npm start
```

Runs at `http://localhost:3000`.

### Backend

```bash
git clone https://github.com/yourusername/openbank-backend.git
cd openbank-backend
npm install
cp .env.example .env
npm run dev
```

Runs at `http://localhost:5000/api`.

Update `.env` with:

```
PORT=5000
MONGO_URI=your_connection_string
JWT_SECRET=your_secret
FRONTEND_URL=http://localhost:3000
```

---

## API Endpoints (Summary)

### Authentication

* POST `/auth/register`
* POST `/auth/login`

### User

* GET `/user/profile` (protected)
* PUT `/user/profile` (protected)

### Transactions

* GET `/transactions`
* POST `/transactions` (deposit, withdrawal, transfer)

### System

* GET `/health`

---

## Roadmap

Week 1: Frontend system and UI buildout
Week 2: Backend architecture, authentication, transaction logic
Week 3: Docker containers, CI/CD workflows
Week 4: Deployment, optimization, and production hardening

(Future Docker instructions can be inserted here before deployment.)

---

If you want, I can also generate
• A combined fullstack architecture diagram
• A polished Docker Compose file linking both services
• A clean API docs site format
• A portfolio-friendly project summary page
