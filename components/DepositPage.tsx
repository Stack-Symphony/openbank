import React, { useState } from 'react';
import { ChevronLeftIcon, PlusIcon, InfoIcon, CheckCircleIcon } from './CustomIcons';

export const DepositPage = ({ onBack, onTransactionComplete }) => {
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Form State
  const [amount, setAmount] = useState('20.00');
  const [source, setSource] = useState('eft');
  const [reference, setReference] = useState('');
  const [description, setDescription] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('business');
  
  // Card Details State
  const [cardDetails, setCardDetails] = useState({
    number: '',
    cvv: '',
    expiry: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Use user description or fallback based on source
    let finalTitle = description;
    if (!finalTitle) {
       if (source === 'eft') finalTitle = 'EFT Deposit';
       else if (source === 'card') finalTitle = 'Card Deposit';
       else finalTitle = 'Deposit';
    }

    onTransactionComplete('deposit', amount, finalTitle, selectedAccount);
    setIsSuccess(true);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setAmount('20.00');
    setReference('');
    setDescription('');
    setCardDetails({ number: '', cvv: '', expiry: '' });
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({ ...prev, [name]: value }));
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
            Deposit Money
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
                    backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1rem auto'
                  }}>
                    <PlusIcon size={28} />
                  </div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Add Funds</h2>
                </div>

                <form className="form-group" onSubmit={handleSubmit}>
                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '0.5rem' }}>
                      Deposit to Account
                    </label>
                    <select 
                      value={selectedAccount}
                      onChange={(e) => setSelectedAccount(e.target.value)}
                    >
                      <option value="savings">Savings Account</option>
                      <option value="checking">Checking Account</option>
                      <option value="business">Business Account</option>
                      <option value="investment">Investment Account</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '0.5rem' }}>
                      Amount to Deposit (R)
                    </label>
                    <input 
                      type="text" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </div>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '0.5rem' }}>
                      Deposit Source
                    </label>
                    <select 
                      value={source} 
                      onChange={(e) => setSource(e.target.value)}
                      style={{ borderColor: 'var(--color-success)' }}
                    >
                      <option value="eft">EFT / Bank Transfer</option>
                      <option value="card">Credit / Debit Card</option>
                    </select>
                  </div>

                  {/* Card Inputs */}
                  {source === 'card' && (
                    <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem', marginBottom: '1.25rem', border: '1px solid var(--color-border)' }}>
                      <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '0.5rem' }}>
                          Card Number
                        </label>
                        <input 
                          type="text" 
                          name="number"
                          placeholder="0000 0000 0000 0000" 
                          value={cardDetails.number}
                          onChange={handleCardChange}
                          required 
                          maxLength={19}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                          <label style={{ display: 'block', fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '0.5rem' }}>
                            Expiry Date
                          </label>
                          <input 
                            type="text" 
                            name="expiry"
                            placeholder="MM/YY" 
                            value={cardDetails.expiry}
                            onChange={handleCardChange}
                            required 
                            maxLength={5}
                            style={{ textAlign: 'center' }}
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <label style={{ display: 'block', fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '0.5rem' }}>
                            CVV
                          </label>
                          <input 
                            type="text" 
                            name="cvv"
                            placeholder="123" 
                            value={cardDetails.cvv}
                            onChange={handleCardChange}
                            required 
                            maxLength={3}
                            style={{ textAlign: 'center' }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '0.5rem' }}>
                      Reference
                    </label>
                    <input 
                      type="text" 
                      placeholder="Enter deposit reference" 
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                    />
                  </div>

                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '0.5rem' }}>
                      Description (Optional)
                    </label>
                    <input 
                      type="text" 
                      placeholder="What's this deposit for?" 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="btn-primary btn-success">
                    Confirm Deposit
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
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '0.5rem' }}>Deposit Successful</h2>
                  <p style={{ color: '#a1a1aa', marginBottom: '2rem' }}>
                    Your funds have been added successfully.
                  </p>

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
                      Make another deposit
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
