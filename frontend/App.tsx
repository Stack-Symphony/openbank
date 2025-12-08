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
import apiService from './utils/api';

interface Transaction {
  id: string;
  _id?: string;
  type: string;
  title: string;
  date: string;
  amount: string;
  displayAmount?: string;
  account: string;
  fromAccount?: string;
  toAccount?: string;
}

interface UserData {
  _id: string;
  name: string;
  email: string;
  accountNumber: string;
  cardNumber: string;
  balances: {
    savings: number;
    checking: number;
    business: number;
    investment: number;
  };
  token?: string;
}

export default function App() {
  const [view, setView] = useState('auth');
  const [theme, setTheme] = useState('dark');
  const [selectedAccount, setSelectedAccount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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
  const [userId, setUserId] = useState('');

  // Notification Preferences
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true
  });
  
  // Security Settings
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  
  // Simulated SMS State
  const [smsNotification, setSmsNotification] = useState<string | null>(null);

  // Individual Account Balances
  const [accounts, setAccounts] = useState({
    savings: 0,
    checking: 0,
    business: 0,
    investment: 0
  });

  // Derived Total Balance
  const totalBalance = Object.values(accounts).reduce((acc, curr) => acc + curr, 0);

  // Lifted transaction state
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Add this useEffect for debugging
  useEffect(() => {
    const testConnection = async () => {
      console.log('Testing backend connection...');
      const result = await apiService.testConnection();
      console.log('Connection test result:', result);
      
      // Also check if we have a token
      const token = localStorage.getItem('token');
      console.log('Current token in localStorage:', token ? 'Exists' : 'None');
    };
    
    testConnection();
  }, []);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and load user data
      loadUserData();
    }
  }, []);

  // Load user data from backend
  const loadUserData = async () => {
    try {
      setIsLoading(true);
      
      // Load profile
      const profileResponse = await apiService.getProfile();
      if (profileResponse.success && profileResponse.data) {
        const user = profileResponse.data;
        setUserName(`${user.firstName} ${user.lastName}`);
        setEmail(user.email);
        setPhoneNumber(user.phoneNumber || '');
        setAccountNumber(user.accountNumber);
        setCardNumber(user.cardNumber);
        setAccounts(user.balances);
        setUserId(user._id);
        setTwoFactorEnabled(user.twoFactorEnabled || false);
      }

      // Load transactions
      const transactionsResponse = await apiService.getTransactions();
      if (transactionsResponse.success && transactionsResponse.data) {
        const formattedTransactions = transactionsResponse.data.map((tx: any) => ({
          id: tx._id || tx.id,
          _id: tx._id,
          type: tx.type,
          title: tx.title,
          date: new Date(tx.date).toLocaleString('en-US', {
            month: 'numeric',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
          }),
          amount: tx.displayAmount || `R${tx.amount.toFixed(2)}`,
          displayAmount: tx.displayAmount,
          account: tx.account,
          fromAccount: tx.fromAccount,
          toAccount: tx.toAccount
        }));
        setTransactions(formattedTransactions);
      }

      setView('dashboard');
    } catch (err: any) {
      console.error('Failed to load user data:', err);
      // If token is invalid, logout
      if (err.message === 'Unauthorized' || err.message === 'Invalid token') {
        handleLogout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Authentication (Login/Register)
  const handleAuth = async (mode: string, formData: any) => {
    setIsLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        const result = await apiService.login({
          saIdNumber: formData.saIdNumber,
          password: formData.password
        });
        
        if (result.success && result.data) {
          setUserName(result.data.name);
          setEmail(result.data.email);
          setAccountNumber(result.data.accountNumber);
          setCardNumber(result.data.cardNumber);
          setAccounts(result.data.balances || {
            savings: 0,
            checking: 0,
            business: 0,
            investment: 0
          });
          setUserId(result.data._id);
          
          // Load transactions after login
          const transactionsResponse = await apiService.getTransactions();
          if (transactionsResponse.success && transactionsResponse.data) {
            const formattedTransactions = transactionsResponse.data.map((tx: any) => ({
              id: tx._id || tx.id,
              _id: tx._id,
              type: tx.type,
              title: tx.title,
              date: new Date(tx.date).toLocaleString('en-US', {
                month: 'numeric',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: true
              }),
              amount: tx.displayAmount || `R${tx.amount.toFixed(2)}`,
              displayAmount: tx.displayAmount,
              account: tx.account,
              fromAccount: tx.fromAccount,
              toAccount: tx.toAccount
            }));
            setTransactions(formattedTransactions);
          }
          
          setView('dashboard');
          return { success: true };
        } else {
          return { success: false, message: result.message || 'Login failed' };
        }
        
      } else if (mode === 'register') {
        const result = await apiService.register({
          firstName: formData.firstName,
          lastName: formData.lastName,
          saIdNumber: formData.saIdNumber,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          password: formData.password
        });
        
        if (result.success && result.data) {
          setUserName(result.data.name);
          setEmail(result.data.email);
          setAccountNumber(result.data.accountNumber);
          setCardNumber(result.data.cardNumber);
          setAccounts({ savings: 0, checking: 0, business: 0, investment: 0 });
          setTransactions([]);
          setUserId(result.data._id);
          setView('dashboard');
          
          // Show success notification
          setSmsNotification('Welcome to OpenBank! Your account has been created successfully.');
          setTimeout(() => setSmsNotification(null), 5000);
          
          return { success: true };
        } else {
          return { success: false, message: result.message || 'Registration failed' };
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      return { 
        success: false, 
        message: err.message || 'An error occurred during authentication' 
      };
    } finally {
      setIsLoading(false);
    }
    
    return { success: false, message: 'Unknown error occurred' };
  };

  const handleLogout = () => {
    apiService.logout();
    setUserName('');
    setEmail('');
    setPhoneNumber('');
    setAccountNumber('');
    setCardNumber('');
    setAccounts({ savings: 0, checking: 0, business: 0, investment: 0 });
    setTransactions([]);
    setUserId('');
    setView('auth');
    if (theme === 'light') toggleTheme(); // Reset theme on logout
    
    // Show logout notification
    setSmsNotification('You have been logged out successfully.');
    setTimeout(() => setSmsNotification(null), 3000);
  };

  const handleUpdateProfile = async (name: string, newEmail: string, phone: string) => {
    setIsLoading(true);
    try {
      const result = await apiService.updateProfile({
        email: newEmail,
        phoneNumber: phone
      });
      
      if (result.success && result.data) {
        setUserName(name);
        setEmail(newEmail);
        setPhoneNumber(phone);
        
        // Show success notification
        setSmsNotification('Profile updated successfully.');
        setTimeout(() => setSmsNotification(null), 3000);
        
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Update profile error:', err);
      setError(err.message || 'Failed to update profile');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleNotification = (key: string) => {
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

  const addTransaction = async (type: string, amountStr: string, title: string, accountType: string) => {
    setIsLoading(true);
    try {
      const result = await apiService.createTransaction({
        type,
        amount: amountStr,
        title,
        accountType,
        description: title
      });
      
      if (result.success && result.data) {
        // Update balances
        setAccounts(result.data.balances);
        
        // Add new transaction to state
        const newTx = {
          id: result.data.transaction._id || Date.now().toString(),
          _id: result.data.transaction._id,
          type,
          title: result.data.transaction.title,
          date: new Date().toLocaleString('en-US', {
            month: 'numeric',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
          }),
          amount: result.data.transaction.displayAmount,
          displayAmount: result.data.transaction.displayAmount,
          account: result.data.transaction.account,
          fromAccount: result.data.transaction.fromAccount,
          toAccount: result.data.transaction.toAccount
        };
        
        setTransactions(prev => [newTx, ...prev]);

        // Trigger SMS Notification if enabled
        if (notifications.sms) {
          const formattedAmount = result.data.transaction.displayAmount || `R${parseFloat(amountStr).toFixed(2)}`;
          const msg = `Transaction Alert: ${type === 'withdrawal' ? 'Withdrawal' : 'Deposit'} of ${formattedAmount} successful on your ${accountType} account.`;
          setSmsNotification(msg);
          // Clear after 5 seconds
          setTimeout(() => setSmsNotification(null), 5000);
        }
        
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Transaction error:', err);
      setError(err.message || 'Transaction failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransfer = async (fromAccount: string, toAccount: string, amount: number, description: string) => {
    setIsLoading(true);
    try {
      const result = await apiService.createTransaction({
        type: 'transfer',
        amount: amount.toString(),
        title: description || `Transfer from ${fromAccount} to ${toAccount}`,
        accountType: fromAccount,
        toAccountType: toAccount,
        description
      });
      
      if (result.success && result.data) {
        // Update balances
        setAccounts(result.data.balances);
        
        // Add transfer transaction to state (both directions for display)
        const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
        
        const newTx = {
          id: result.data.transaction._id || Date.now().toString(),
          _id: result.data.transaction._id,
          type: 'transfer',
          title: result.data.transaction.title,
          date: new Date().toLocaleString('en-US', {
            month: 'numeric',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
          }),
          amount: result.data.transaction.displayAmount,
          displayAmount: result.data.transaction.displayAmount,
          account: result.data.transaction.account,
          fromAccount: result.data.transaction.fromAccount,
          toAccount: result.data.transaction.toAccount
        };
        
        // Also create a received transaction for the destination account
        const newTxIn = {
          id: (result.data.transaction._id || Date.now().toString()) + '_in',
          _id: (result.data.transaction._id || '') + '_in',
          type: 'transfer',
          title: description || `Received from ${capitalize(fromAccount)}`,
          date: new Date().toLocaleString('en-US', {
            month: 'numeric',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
          }),
          amount: result.data.transaction.displayAmount,
          displayAmount: result.data.transaction.displayAmount,
          account: capitalize(toAccount),
          fromAccount: capitalize(fromAccount),
          toAccount: capitalize(toAccount)
        };

        setTransactions(prev => [newTx, newTxIn, ...prev]);

        // SMS Notification
        if (notifications.sms) {
          const formattedAmount = result.data.transaction.displayAmount || `R${amount.toFixed(2)}`;
          const msg = `Transfer Alert: ${formattedAmount} transferred from ${capitalize(fromAccount)} to ${capitalize(toAccount)}.`;
          setSmsNotification(msg);
          setTimeout(() => setSmsNotification(null), 5000);
        }
        
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Transfer error:', err);
      setError(err.message || 'Transfer failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAccount = (accountType: string) => {
    setSelectedAccount(accountType);
    setView('account-details');
  };

  // Refresh transactions when returning to dashboard
  const refreshTransactions = async () => {
    try {
      const result = await apiService.getTransactions();
      if (result.success && result.data) {
        const formattedTransactions = result.data.map((tx: any) => ({
          id: tx._id || tx.id,
          _id: tx._id,
          type: tx.type,
          title: tx.title,
          date: new Date(tx.date).toLocaleString('en-US', {
            month: 'numeric',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
          }),
          amount: tx.displayAmount || `R${tx.amount.toFixed(2)}`,
          displayAmount: tx.displayAmount,
          account: tx.account,
          fromAccount: tx.fromAccount,
          toAccount: tx.toAccount
        }));
        setTransactions(formattedTransactions);
      }
    } catch (err) {
      console.error('Failed to refresh transactions:', err);
    }
  };

  // Refresh user data when returning to dashboard
  const refreshUserData = async () => {
    try {
      const result = await apiService.getProfile();
      if (result.success && result.data) {
        const user = result.data;
        setAccounts(user.balances);
      }
    } catch (err) {
      console.error('Failed to refresh user data:', err);
    }
  };

  return (
    <div className="app-container">
      {/* Loading Overlay */}
      {isLoading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'var(--color-card-bg)',
            padding: '2rem',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <ToddlerIcon size={48} />
            <p style={{ marginTop: '1rem' }}>Processing...</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(239, 68, 68, 0.9)',
          color: 'white',
          padding: '1rem 2rem',
          borderRadius: '8px',
          zIndex: 1001,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>{error}</span>
          <button 
            onClick={() => setError(null)}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1.2rem'
            }}
          >
            ×
          </button>
        </div>
      )}

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
            <WithdrawPage 
              onBack={() => {
                setView('dashboard');
                refreshUserData();
                refreshTransactions();
              }} 
              onTransactionComplete={addTransaction} 
            />
          )}

          {view === 'deposit' && (
            <DepositPage 
              onBack={() => {
                setView('dashboard');
                refreshUserData();
                refreshTransactions();
              }} 
              onTransactionComplete={addTransaction} 
            />
          )}

          {view === 'transfer' && (
            <TransferPage 
              onBack={() => {
                setView('dashboard');
                refreshUserData();
                refreshTransactions();
              }} 
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
              balance={accounts[selectedAccount] || 0}
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