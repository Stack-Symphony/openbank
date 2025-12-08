import React, { useState } from 'react';
import { ChevronLeftIcon, TransferIcon, CheckCircleIcon, InfoIcon } from './CustomIcons';

export const TransferPage = ({ onBack, accounts, onTransfer, initialFromAccount = '' }) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [amount, setAmount] = useState('');
  const [fromAccount, setFromAccount] = useState(initialFromAccount);
  const [toAccount, setToAccount] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const accountTypes = [
    { id: 'savings', label: 'Savings Account' },
    { id: 'checking', label: 'Checking Account' },
    { id: 'business', label: 'Business Account' },
    { id: 'investment', label: 'Investment Account' }
  ];

  // Helper to format currency for display
  const formatZAR = (val) => val.toLocaleString('en-ZA', { style: 'currency', currency: 'ZAR' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!fromAccount || !toAccount) {
      setError('Please select both a source and destination account.');
      return;
    }
    if (fromAccount === toAccount) {
      setError('Source and destination accounts cannot be the same.');
      return;
    }

    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      setError('Please enter a valid amount.');
      return;
    }

    if (accounts[fromAccount] < val) {
      setError('Insufficient funds in the source account.');
      return;
    }

    onTransfer(fromAccount, toAccount, val, description);
    setIsSuccess(true);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setAmount('');
    setDescription('');
    setFromAccount(initialFromAccount);
    setToAccount('');
    setError('');
  };

  return (
    <div className="dashboard-layout">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content" style={{ justifyContent: 'flex-start' }}>
          <button 
            onClick={onBack}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'var(--color-text-main)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              fontSize: '1rem', 
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <ChevronLeftIcon size={20} />
            Transfer Funds
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-container" style={{ maxWidth: '500px' }}>
          <div className="dashboard-card" style={{ padding: '2.5rem 2rem' }}>
            
            {!isSuccess ? (
              <>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <div style={{ 
                    width: '64px', height: '64px', borderRadius: '50%', 
                    backgroundColor: 'rgba(62, 130, 247, 0.1)', color: '#3e82f7',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1rem auto'
                  }}>
                    <TransferIcon size={28} />
                  </div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Internal Transfer</h2>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Move money between your accounts</p>
                </div>

                <form className="form-group" onSubmit={handleSubmit}>
                  
                  {error && (
                    <div style={{ 
                      backgroundColor: 'rgba(239, 68, 68, 0.1)', 
                      border: '1px solid rgba(239, 68, 68, 0.2)', 
                      color: '#ef4444', 
                      padding: '0.75rem', 
                      borderRadius: '0.5rem', 
                      fontSize: '0.875rem',
                      textAlign: 'center',
                      marginBottom: '1rem'
                    }}>
                      {error}
                    </div>
                  )}

                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                      From Account
                    </label>
                    <select 
                      value={fromAccount}
                      onChange={(e) => setFromAccount(e.target.value)}
                      required
                    >
                      <option value="">Select source account</option>
                      {accountTypes.map(acc => (
                        <option key={acc.id} value={acc.id}>
                          {acc.label} ({formatZAR(accounts[acc.id] || 0)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ textAlign: 'center', marginBottom: '1.25rem', color: 'var(--color-primary)', opacity: 0.8 }}>
                     <TransferIcon size={20} style={{ transform: 'rotate(90deg)' }} />
                  </div>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                      To Account
                    </label>
                    <select 
                      value={toAccount}
                      onChange={(e) => setToAccount(e.target.value)}
                      required
                    >
                      <option value="">Select destination account</option>
                      {accountTypes.map(acc => (
                        <option key={acc.id} value={acc.id} disabled={acc.id === fromAccount}>
                          {acc.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                      Amount (R)
                    </label>
                    <input 
                      type="number" 
                      placeholder="e.g. 500.00" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      min="0.01"
                      step="0.01"
                      required 
                    />
                  </div>

                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                      Description (Optional)
                    </label>
                    <input 
                      type="text" 
                      placeholder="Transfer reference" 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="btn-primary" style={{ backgroundColor: '#3e82f7', boxShadow: '0 4px 6px -1px rgba(62, 130, 247, 0.2)' }}>
                    Confirm Transfer
                  </button>
                </form>
              </>
            ) : (
              /* Success State */
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                 <div style={{ 
                    width: '72px', height: '72px', borderRadius: '50%', 
                    backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1.5rem auto'
                  }}>
                    <CheckCircleIcon size={36} />
                  </div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '0.5rem' }}>Transfer Successful</h2>
                  <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                    You have successfully transferred <strong>{formatZAR(parseFloat(amount))}</strong> from {accountTypes.find(a => a.id === fromAccount)?.label} to {accountTypes.find(a => a.id === toAccount)?.label}.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <button onClick={onBack} className="btn-primary" style={{ backgroundColor: 'var(--color-input-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text-main)' }}>
                      Return to Dashboard
                    </button>
                    <button 
                      onClick={handleReset} 
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: 'var(--color-text-muted)', 
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        textDecoration: 'underline'
                      }}
                    >
                      Make another transfer
                    </button>
                  </div>
              </div>
            )}
            
          </div>
        </div>
      </main>
    </div>
  );
};
