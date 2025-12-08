
<img width="1600" height="723" alt="OpenBank" src="https://github.com/Stack-Symphony/openbank/blob/main/OpenBank.PNG" />

## OpenBank

Deployment link: https://openbank-nine.vercel.app/

A modern, responsive digital banking frontend application built with React. This project represents **Week 1** of the development lifecycle, focusing on environment setup, component architecture, and high-fidelity UI/UX implementation.




## 🚀 Features

### 🔐 Authentication & Security
*   **Secure Login/Registration:** Form validation including South African ID number (13-digit check) and mobile number formatting (+27).
*   **Profile Management:** Edit personal details and toggle security settings.
*   **Mock Security:** Visual simulation of Two-Factor Authentication (2FA) and password visibility toggles.

### 💳 Interactive Dashboard
*   **3D Digital Card:** Interactive flip animation revealing sensitive card details (CVV, Expiry) on the back.
*   **Account Overview:** Real-time summary of Savings, Checking, Business, and Investment account balances.
*   **Responsive Design:** Fully responsive layout adapting from mobile (stacked) to desktop (split-screen/grid).

### 💸 Transaction Management
*   **Deposits:** Support for simulated Card and EFT deposits.
*   **Withdrawals:** Logic for EFT and "Instant Money" (Cash Send) with voucher code generation.
*   **Internal Transfers:** Move funds seamlessly between internal accounts.
*   **Notifications:** Simulated SMS toast notifications for every successful transaction.

### 📄 History & Statements
*   **Transaction Log:** Detailed history of all account activities.
*   **PDF Statements:** Client-side generation of professional PDF bank statements using `jspdf` and `jspdf-autotable`.

---

## 🛠️ Tech Stack

*   **Frontend Framework:** [React 19](https://react.dev/)
*   **Language:** JavaScript (ES6+)
*   **Styling:** Native CSS3 with CSS Variables (Theming support)
*   **Icons:** Custom SVG Component Library (No external icon font dependencies)
*   **Utilities:** `jspdf` (PDF Generation), `localStorage` (Mock Database persistence)

---

## 📂 Project Structure

```bash
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
    ├── DepositPage.js         # Deposit Logic
    ├── WithdrawPage.js        # Withdrawal Logic
    └── ProfilePage.js         # User Settings
```

---

## 🏁 Getting Started

### Prerequisites
*   Node.js (v18 or higher)
*   npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://https://github.com/Stack-Symphony/openbank.git
    cd openbank
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the application:**
    ```bash
    npm start
    ```

4.  **Open in Browser:**
    Navigate to `http://localhost:3000` to view the app.

---

## 🧪 How to Use (Mock Data)

Since there is no backend connected yet (Week 2 Goal), the app uses `localStorage` to simulate a database.

1.  **Default Login:**
    *   **SA ID:** `8001015009087`
    *   **Password:** `password123`
2.  **Registration:** You can create a new account via the "Sign up" link. The data will persist in your browser's local storage even after refreshing.
3.  **Reset:** To clear all data, run `localStorage.clear()` in your browser console.

---

## 📅 Roadmap

| Phase | Focus | Status |
| :--- | :--- | :--- |
| **Week 1** | **Frontend Foundation, UI/UX, React Setup** | ✅ Completed |
| Week 2 | Backend API (Node/Express) & Database (MongoDB) |  🚧 Planned|
| Week 3 | Dockerization & CI/CD Pipelines | 📝 Planned |
| Week 4 | Deployment & Final Polish | 📝 Planned |

---

