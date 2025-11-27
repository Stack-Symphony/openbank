import React, { useState, useEffect } from 'react';
import { RegisterForm } from './components/RegisterForm';
import { BrandingPanel } from './components/BrandingPanel';
import { Dashboard } from './components/Dashboard';
import { WithdrawPage } from './components/WithdrawPage';
import { DepositPage } from './components/DepositPage';
import { ProfilePage } from './components/ProfilePage';
import { TransferPage } from './components/TransferPage';
import { AccountDetailsPage } from './components/AccountDetailsPage';
import { TransactionHistoryPage } from './components/TransactionHistoryPage';
import { ToddlerIcon } from './components/CustomIcons';

interface Transaction {
  id: number;
  type: string;
  title: string;
  date: string;
  amount: string;
  account: string;
  fromAccount?: string;
  toAccount?: string;
}

export default function App() {
  const [view, setView] = useState('auth');
  const [theme, setTheme] = useState('dark');
  const [selectedAccount, setSelectedAccount] = useState('');
  
  // Toggle Theme Function
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (newTheme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  };
  
  // User Session State
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');

  // "Database" of Registered Users
  // Initialize from localStorage if available, otherwise use default
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const savedUsers = localStorage.getItem('openbank_users');
    if (savedUsers) {
      return JSON.parse(savedUsers);
    }
    return [
      {
        saIdNumber: '8001015009087',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phoneNumber: '082 123 4567'
      }
    ];
  });

  // Persist registered users to localStorage whenever the list changes
  useEffect(() => {
    localStorage.setItem('openbank_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  // Notification Preferences
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true
  });
  
  // Security Settings
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  
  // Simulated SMS State
  const [smsNotification, setSmsNotification] = useState(null);

  // Individual Account Balances
  const [accounts, setAccounts] = useState({
    savings: 1700.00,
    checking: 3050.00,
    business: 10200.00,
    investment: 14000.00
  });

  // Derived Total Balance
  const totalBalance = Object.values(accounts).reduce((acc, curr) => acc + curr, 0);

  // Lifted transaction state
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 1,
      type: 'withdrawal',
      title: 'ATM Withdrawal - Grocery Shopping',
      date: '11/16/2025, 3:30:17 PM',
      amount: '-R250.00',
      account: 'Checking',
    },
    {
      id: 2,
      type: 'deposit',
      title: 'Salary Deposit',
      date: '11/15/2025, 9:00:00 AM',
      amount: '+R1500.00',
      account: 'Checking',
    },
    {
      id: 3,
      type: 'deposit',
      title: 'Business Revenue Deposit',
      date: '11/14/2025, 4:45:12 PM',
      amount: '+R5000.00',
      account: 'Business',
    },
    {
      id: 4,
      type: 'withdrawal',
      title: 'Investment Transfer to Portfolio',
      date: '11/12/2025, 11:15:33 AM',
      amount: '-R800.00',
      account: 'Investment',
    },
    {
      id: 5,
      type: 'deposit',
      title: 'Investment Returns',
      date: '11/10/2025, 2:20:05 PM',
      amount: '+R2000.00',
      account: 'Investment',
    },
  ]);

  // Handle Authentication (Login/Register)
  const handleAuth = (mode, formData) => {
    if (mode === 'login') {
      // Find user matching ID and Password
      const user = registeredUsers.find(
        u => u.saIdNumber === formData.saIdNumber && u.password === formData.password
      );

      if (user) {
        // Successful Login
        setUserName(`${user.firstName} ${user.lastName}`);
        setEmail(user.email);
        setPhoneNumber(user.phoneNumber);
        
        // Setup mock account info for this session if empty (simplified for demo)
        if (!accountNumber) {
           setAccountNumber('1234567890');
           setCardNumber('4532 7612 9088 3456');
        }

        setView('dashboard');
        return { success: true };
      } else {
        // Failed Login
        return { success: false, message: 'Invalid ID number or password' };
      }

    } else if (mode === 'register') {
      // Check if user exists
      const exists = registeredUsers.find(u => u.saIdNumber === formData.saIdNumber);
      
      if (exists) {
        return { success: false, message: 'An account with this ID number already exists' };
      }

      // Successful Registration
      const newUser = {
        saIdNumber: formData.saIdNumber,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber
      };

      // Add to "database"
      setRegisteredUsers(prev => [...prev, newUser]);

      // Set Session Data
      setUserName(`${newUser.firstName} ${newUser.lastName}`);
      setEmail(newUser.email);
      setPhoneNumber(newUser.phoneNumber);
      
      // 1. Reset Balances to R0 for new user
      setAccounts({
        savings: 0,
        checking: 0,
        business: 0,
        investment: 0
      });

      // 2. Clear Transaction History
      setTransactions([]);

      // 3. Generate Unique Account Number (Random 10 digit)
      const newAccNum = Math.floor(Math.random() * 9000000000) + 1000000000;
      setAccountNumber(newAccNum.toString());

      // 4. Generate Digital Card Number (Random 16 digit formatted)
      const newCardNum = Array(4).fill(0).map(() => Math.floor(1000 + Math.random() * 9000)).join(' ');
      setCardNumber(newCardNum);
      
      setView('dashboard');
      return { success: true };
    }
    
    return { success: false, message: 'Unknown error occurred' };
  };

  const handleLogout = () => {
    setUserName('');
    setView('auth');
    if (theme === 'light') toggleTheme(); // Reset theme on logout
  };

  const handleUpdateProfile = (name, newEmail, phone) => {
    setUserName(name);
    setEmail(newEmail);
    setPhoneNumber(phone);
  };

  const handleToggleNotification = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Logic to toggle 2FA
  const handleToggleTwoFactor = () => {
    const newState = !twoFactorEnabled;
    setTwoFactorEnabled(newState);
    
    if (newState) {
      // Confirms enablement to both channels
      const msg = `Security Alert: 2FA Enabled. OTPs will be sent to ${email} and ${phoneNumber}.`;
      setSmsNotification(msg);
      setTimeout(() => setSmsNotification(null), 5000);
    } else {
      const msg = `Security Alert: 2FA has been disabled.`;
      setSmsNotification(msg);
      setTimeout(() => setSmsNotification(null), 5000);
    }
  };

  const addTransaction = (type, amountStr, title, accountType) => {
    // 1. Sanitize the amount string to get a valid number
    const cleanAmount = amountStr.replace(/[^0-9.]/g, '');
    const amountVal = parseFloat(cleanAmount);
    
    if (isNaN(amountVal)) return;

    // 2. Update Specific Account Balance
    const key = accountType.toLowerCase();
    
    if (accounts[key] !== undefined) {
      setAccounts(prev => ({
        ...prev,
        [key]: type === 'withdrawal' 
          ? prev[key] - amountVal 
          : prev[key] + amountVal
      }));
    }

    // 3. Format amount for history display
    const formattedAmount = `R${amountVal.toFixed(2)}`;
    const sign = type === 'withdrawal' ? '-' : '+';
    
    const newTx = {
      id: Date.now(),
      type,
      title,
      amount: `${sign}${formattedAmount}`,
      date: new Date().toLocaleString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true
      }),
      account: accountType.charAt(0).toUpperCase() + accountType.slice(1),
    };
    
    setTransactions(prev => [newTx, ...prev]);

    // 4. Trigger SMS Notification if enabled
    if (notifications.sms) {
      const msg = `Transaction Alert: ${type === 'withdrawal' ? 'Withdrawal' : 'Deposit'} of ${formattedAmount} successful on your ${accountType} account.`;
      setSmsNotification(msg);
      // Clear after 5 seconds
      setTimeout(() => setSmsNotification(null), 5000);
    }
  };

  const handleTransfer = (fromAccount, toAccount, amount, description) => {
     // 1. Update Account Balances
     setAccounts(prev => ({
       ...prev,
       [fromAccount]: prev[fromAccount] - amount,
       [toAccount]: prev[toAccount] + amount
     }));

     // 2. Add Transaction Record
     const formattedAmount = `R${amount.toFixed(2)}`;
     
     // Capitalize first letter helper
     const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
     
     const newTx = {
       id: Date.now(),
       type: 'transfer',
       title: description || `Transfer: ${capitalize(fromAccount)} to ${capitalize(toAccount)}`,
       amount: formattedAmount, // Neutral display for internal transfer
       date: new Date().toLocaleString('en-US', {
         month: 'numeric',
         day: 'numeric',
         year: 'numeric',
         hour: 'numeric',
         minute: 'numeric',
         second: 'numeric',
         hour12: true
       }),
       fromAccount: capitalize(fromAccount),
       toAccount: capitalize(toAccount),
       account: `${capitalize(fromAccount)}` // Assign to source for history visibility
     };
     
     // Optionally create a second entry for the receiver or just show one
     // For simplicity, we add one that shows up for the 'from' account mainly.
     // To make it show for 'to' account as well, we'd need more complex filtering or 2 records.
     // Let's create a 'received' transaction too for the destination
     const newTxIn = {
       id: Date.now() + 1,
       type: 'transfer',
       title: description || `Received from ${capitalize(fromAccount)}`,
       amount: formattedAmount,
       date: new Date().toLocaleString('en-US', {
         month: 'numeric',
         day: 'numeric',
         year: 'numeric',
         hour: 'numeric',
         minute: 'numeric',
         second: 'numeric',
         hour12: true
       }),
       fromAccount: capitalize(fromAccount),
       toAccount: capitalize(toAccount),
       account: `${capitalize(toAccount)}`
     }

     setTransactions(prev => [newTx, newTxIn, ...prev]);

     // 3. SMS Notification
     if (notifications.sms) {
       const msg = `Transfer Alert: ${formattedAmount} transferred from ${capitalize(fromAccount)} to ${capitalize(toAccount)}.`;
       setSmsNotification(msg);
       setTimeout(() => setSmsNotification(null), 5000);
     }
  };

  const handleSelectAccount = (accountType) => {
    setSelectedAccount(accountType);
    setView('account-details');
  };

  return (
    <div className="app-container">
      {/* Main Views */}
      {view === 'auth' ? (
        <div className="auth-card">
          <BrandingPanel />
          <RegisterForm onAuth={handleAuth} />
        </div>
      ) : (
        <>
          {smsNotification && (
            <div className="sms-notification">
              <div className="sms-header">
                <span>Messages • Now</span>
              </div>
              <div className="sms-body">
                <span className="sms-number">Sent to {phoneNumber || 'Your Number'}</span>
                <strong>OpenBank</strong><br/>
                {smsNotification}
              </div>
            </div>
          )}

          {view === 'withdraw' && (
            <WithdrawPage onBack={() => setView('dashboard')} onTransactionComplete={addTransaction} />
          )}

          {view === 'deposit' && (
            <DepositPage onBack={() => setView('dashboard')} onTransactionComplete={addTransaction} />
          )}

          {view === 'transfer' && (
            <TransferPage 
              onBack={() => setView('dashboard')} 
              accounts={accounts} 
              onTransfer={handleTransfer} 
              initialFromAccount={selectedAccount}
            />
          )}

          {view === 'transactions' && (
            <TransactionHistoryPage
              onBack={() => setView('dashboard')}
              transactions={transactions}
              userName={userName}
              accountNumber={accountNumber}
            />
          )}

          {view === 'account-details' && (
            <AccountDetailsPage 
              accountType={selectedAccount.charAt(0).toUpperCase() + selectedAccount.slice(1) + ' Account'}
              balance={accounts[selectedAccount]}
              transactions={transactions.filter(t => 
                // Flexible matching for account names
                t.account?.toLowerCase().includes(selectedAccount.toLowerCase()) ||
                (t.fromAccount?.toLowerCase() === selectedAccount.toLowerCase()) ||
                (t.toAccount?.toLowerCase() === selectedAccount.toLowerCase())
              )}
              userName={userName}
              accountNumber={accountNumber}
              onBack={() => {
                setSelectedAccount('');
                setView('dashboard');
              }}
              onTransfer={() => setView('transfer')}
            />
          )}

          {view === 'profile' && (
             <ProfilePage 
                onBack={() => setView('dashboard')}
                userName={userName}
                email={email}
                phoneNumber={phoneNumber}
                accountNumber={accountNumber}
                onUpdateProfile={handleUpdateProfile}
                notifications={notifications}
                onToggleNotification={handleToggleNotification}
                twoFactorEnabled={twoFactorEnabled}
                onToggleTwoFactor={handleToggleTwoFactor}
             />
          )}

          {view === 'dashboard' && (
            <Dashboard 
              userName={userName}
              totalBalance={totalBalance}
              accounts={accounts}
              accountNumber={accountNumber}
              cardNumber={cardNumber}
              onLogout={handleLogout} 
              onWithdraw={() => setView('withdraw')}
              onDeposit={() => setView('deposit')}
              onTransfer={() => {
                setSelectedAccount(''); // No pre-selection for generic transfer
                setView('transfer');
              }}
              onHistory={() => setView('transactions')}
              onProfile={() => setView('profile')}
              onSelectAccount={handleSelectAccount}
            />
          )}
        </>
      )}
    </div>
  );
}
