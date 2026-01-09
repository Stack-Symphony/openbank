import React, { useState } from 'react';
import { ChevronLeftIcon, RandSignIcon, CheckCircleIcon } from './CustomIcons';

export const WithdrawPage = ({ onBack, onTransactionComplete }) => {
  const [transferType, setTransferType] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherPin, setVoucherPin] = useState('');
  
  // Form State
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('');
  // EFT Fields
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simulate processing
    if (transferType === 'instant') {
      // Generate a random 10-digit voucher code
      const code = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      // Generate a random 4-digit PIN
      const pin = Math.floor(1000 + Math.random() * 9000).toString();
      
      setVoucherCode(code);
      setVoucherPin(pin);
      onTransactionComplete('withdrawal', amount, description || 'Instant Money Withdrawal', selectedAccount);
    } else if (transferType === 'eft') {
      const descText = description || `EFT to ${bankName} (${accountHolder})`;
      setVoucherCode('');
      setVoucherPin('');
      onTransactionComplete('withdrawal', amount, descText, selectedAccount);
    } else {
      setVoucherCode('');
      setVoucherPin('');
      onTransactionComplete('withdrawal', amount, description || 'Withdrawal', selectedAccount);
    }
    
    setIsSuccess(true);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setVoucherCode('');
    setVoucherPin('');
    setTransferType('');
    setAmount('');
    setDescription('');
    setBankName('');
    setAccountNumber('');
    setAccountHolder('');
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
              color: 'white', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              fontSize: '1rem', 
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <ChevronLeftIcon size={20} />
            Withdraw Money
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-container" style={{ maxWidth: '500px' }}>
          <div className="dashboard-card" style={{ padding: '2.5rem 2rem' }}>
            
            {!isSuccess ? (
              /* Form State */
              <>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <div style={{ 
                    width: '64px', height: '64px', borderRadius: '50%', 
                    backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1rem auto'
                  }}>
                    <RandSignIcon size={28} />
                  </div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Withdraw Funds</h2>
                </div>

                <form className="form-group" onSubmit={handleSubmit}>
                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '0.5rem' }}>
                      Withdraw From Account
                    </label>
                    <select 
                      value={selectedAccount}
                      onChange={(e) => setSelectedAccount(e.target.value)}
                      required
                    >
                      <option value="">Select account to withdraw from</option>
                      <option value="savings">Savings Account</option>
                      <option value="checking">Checking Account</option>
                      <option value="business">Business Account</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '0.5rem' }}>
                      Amount to Withdraw (R)
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. 500.00" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required 
                    />
                  </div>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '0.5rem' }}>
                      Transfer Type
                    </label>
                    <select 
                      value={transferType} 
                      onChange={(e) => setTransferType(e.target.value)}
                      required
                    >
                      <option value="">Select transfer type</option>
                      <option value="eft">EFT</option>
                      <option value="instant">Instant Money (Cash Send)</option>
                    </select>
                  </div>

                  {transferType === 'eft' && (
                    <>
                      <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '0.5rem' }}>
                          Bank Name
                        </label>
                        <select 
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          required
                        >
                          <option value="">Select Bank</option>
                          <option value="Absa">Absa</option>
                          <option value="Capitec">Capitec</option>
                          <option value="FNB">FNB</option>
                          <option value="Nedbank">Nedbank</option>
                          <option value="Standard Bank">Standard Bank</option>
                          <option value="TymeBank">TymeBank</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '0.5rem' }}>
                          Account Number
                        </label>
                        <input 
                          type="text" 
                          placeholder="Enter account number" 
                          value={accountNumber}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 11);
                            setAccountNumber(val);
                          }}
                          required 
                        />
                      </div>

                      <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '0.5rem' }}>
                          Account Holder Name
                        </label>
                        <input 
                          type="text" 
                          placeholder="Enter account holder name" 
                          value={accountHolder}
                          onChange={(e) => setAccountHolder(e.target.value)}
                          required 
                        />
                      </div>
                    </>
                  )}

                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '0.5rem' }}>
                      Description (Optional)
                    </label>
                    <input 
                      type="text" 
                      placeholder="What's this withdrawal for?" 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="btn-primary btn-danger">
                    Confirm Withdrawal
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
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '0.5rem' }}>Withdrawal Successful</h2>
                  <p style={{ color: '#a1a1aa', marginBottom: '2rem' }}>
                    Your transaction has been processed successfully.
                  </p>

                  {/* Voucher Display for Instant Money */}
                  {voucherCode && (
                    <div style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.03)', 
                      border: '1px dashed var(--color-border)',
                      borderRadius: '0.75rem',
                      padding: '1.5rem',
                      marginBottom: '2rem'
                    }}>
                      <div style={{ marginBottom: '1.5rem' }}>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: '#a1a1aa', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Instant Money Voucher
                        </span>
                        <div style={{ 
                          fontSize: '2rem', 
                          fontFamily: 'monospace', 
                          fontWeight: 700, 
                          color: 'white', 
                          letterSpacing: '0.1em'
                        }}>
                          {voucherCode}
                        </div>
                      </div>
                      
                      {voucherPin && (
                        <div>
                          <span style={{ display: 'block', fontSize: '0.75rem', color: '#a1a1aa', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Cash Send PIN
                          </span>
                          <div style={{ 
                            fontSize: '1.75rem', 
                            fontFamily: 'monospace', 
                            fontWeight: 700, 
                            color: 'var(--color-primary)', 
                            letterSpacing: '0.1em'
                          }}>
                            {voucherPin}
                          </div>
                        </div>
                      )}
                      
                      <div style={{ fontSize: '0.8rem', color: '#a1a1aa', marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                        Share these details with the recipient. They will need both the voucher code and PIN to withdraw cash at the ATM.
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <button onClick={onBack} className="btn-primary" style={{ backgroundColor: 'var(--color-input-bg)', border: '1px solid var(--color-border)' }}>
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
                      Make another withdrawal
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
