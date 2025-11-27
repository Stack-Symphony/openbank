import React, { useState, useEffect } from 'react';
import { OpenBankLogo, LockIcon, RandSignIcon, PlusIcon, ClipboardIcon, TransferIcon } from './CustomIcons';

export const Dashboard = ({ userName, totalBalance, accounts, accountNumber, cardNumber, onLogout, onWithdraw, onDeposit, onTransfer, onHistory, onProfile, onSelectAccount }) => {
  // Slideshow State
  const [currentSlide, setCurrentSlide] = useState(0);
  // Card Flip State
  const [isFlipped, setIsFlipped] = useState(false);

  // Slides Data
  const slides = [
    {
      id: 1,
      title: "Bank-Level Security",
      description: "Your money is protected with advanced encryption, multi-factor authentication, and 24/7 fraud monitoring.",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1470&auto=format&fit=crop"
    },
    {
      id: 3,
      title: "Global Access",
      description: "Seamless international transactions and borderless banking wherever life takes you.",
      image: "https://images.unsplash.com/photo-1500835556837-99ac94a94552?q=80&w=1470&auto=format&fit=crop"
    },
    {
      id: 4,
      title: "High-Yield Savings",
      description: "Maximize your returns with industry-leading interest rates on all savings accounts.",
      image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=1470&auto=format&fit=crop"
    }
  ];

  // Auto-rotate slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Get current time in South Africa (SAST)
  const getSATime = () => {
    const now = new Date();
    const timeFormatter = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZone: 'Africa/Johannesburg'
    });
    return `Today, ${timeFormatter.format(now)}`;
  };

  const lastLoginTime = getSATime();

  // Format currency helper
  const formatZAR = (amount) => {
    return amount.toLocaleString('en-ZA', { 
      style: 'currency', 
      currency: 'ZAR' 
    });
  };

  return (
    <div className="dashboard-layout">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="header-logo-circle">
               <OpenBankLogo style={{ width: '24px', height: '24px' }} />
            </div>
            <span className="header-brand">Open <strong>Bank</strong></span>
          </div>
          <button className="sign-out-btn" onClick={onLogout}>
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-container">
          
          {/* Welcome Card */}
          <div className="dashboard-card welcome-card">
            <div className="welcome-text">
              <h2>Welcome back!</h2>
              <p>Hello, <a href="#" onClick={(e) => { e.preventDefault(); onProfile(); }} style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>{userName}</a></p>
            </div>
            <div className="welcome-info">
              <span className="info-label">Last login</span>
              <span className="info-value">{lastLoginTime}</span>
            </div>
          </div>

          {/* Grid for Cards and Overview */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            
            {/* My Cards Section */}
            <div className="dashboard-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '320px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>My Card</h3>
                <span 
                  onClick={() => setIsFlipped(!isFlipped)} 
                  style={{ 
                    fontSize: '0.75rem', 
                    color: 'var(--color-primary)', 
                    cursor: 'pointer',
                    fontWeight: 500 
                  }}
                >
                  {isFlipped ? 'Show Front' : 'Show Details'}
                </span>
              </div>
              
              {/* 3D Flip Container */}
              <div 
                style={{ 
                  perspective: '1000px', 
                  width: '100%', 
                  height: '220px', 
                  cursor: 'pointer' 
                }}
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <div style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    transition: 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}>
                    
                    {/* Front Face: Account Info */}
                    <div style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        background: 'linear-gradient(135deg, #7e60e8 0%, #3e82f7 100%)',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        color: 'white',
                        boxShadow: '0 10px 15px -3px rgba(62, 130, 247, 0.3)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        overflow: 'hidden',
                        zIndex: 2
                    }}>
                        {/* Decorative Circle */}
                        <div style={{ position: 'absolute', top: '-50%', right: '-20%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)' }} />

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
                            <span style={{ fontWeight: 600, fontSize: '1rem', letterSpacing: '0.05em' }}>Open Bank</span>
                            <OpenBankLogo style={{ width: '32px', height: '32px', filter: 'brightness(0) invert(1)' }} />
                        </div>

                        {/* Front Content: Account Info */}
                        <div style={{ zIndex: 1 }}>
                            <div style={{ marginBottom: '1.5rem' }}>
                              <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.8, marginBottom: '4px' }}>Account Number</div>
                              <div style={{ fontSize: '1.4rem', fontFamily: 'monospace', fontWeight: 600, letterSpacing: '0.05em' }}>
                                  {accountNumber}
                              </div>
                            </div>
                            
                            <div>
                              <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.8, marginBottom: '4px' }}>Card Holder</div>
                              <div style={{ fontSize: '1rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{userName}</div>
                            </div>
                        </div>
                        
                        {/* Chip Icon for realistic feel */}
                        <div style={{ display: 'flex', justifyContent: 'flex-start', zIndex: 1 }}>
                            <div style={{ width: '45px', height: '35px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '6px', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.3)' }} />
                        </div>
                    </div>

                    {/* Back Face: Card Sensitive Info */}
                    <div style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        background: 'linear-gradient(135deg, #3e82f7 0%, #7e60e8 100%)',
                        borderRadius: '16px',
                        padding: '1.5rem 0',
                        color: 'white',
                        boxShadow: '0 10px 15px -3px rgba(62, 130, 247, 0.3)',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden'
                    }}>
                        {/* Magnetic Strip */}
                        <div style={{ width: '100%', height: '40px', backgroundColor: '#1c1c24', marginTop: '10px' }}></div>

                        <div style={{ padding: '0 1.5rem', marginTop: '1.5rem' }}>
                            {/* Signature & CVV */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{ 
                                  flex: 2, 
                                  height: '34px', 
                                  backgroundColor: 'rgba(255,255,255,0.9)', 
                                  borderRadius: '4px', 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'flex-start',
                                  paddingLeft: '10px',
                                  backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)'
                                }}>
                                  <span style={{ fontFamily: 'cursive', color: '#333', fontSize: '0.8rem' }}>Authorized Signature</span>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.8, marginBottom: '2px' }}>CVV</div>
                                    <div style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '1rem' }}>452</div> 
                                </div>
                            </div>

                            {/* Card Number */}
                            <div style={{ marginBottom: '0.5rem' }}>
                                <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.8, marginBottom: '4px' }}>Card Number</div>
                                <div style={{ fontSize: '1.1rem', fontFamily: 'monospace', fontWeight: 600, letterSpacing: '0.1em' }}>
                                    {cardNumber}
                                </div>
                            </div>
                            
                            {/* Expiry */}
                            <div style={{ textAlign: 'right', marginTop: '10px' }}>
                                <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.8 }}>Expires</div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>12/29</div>
                            </div>
                        </div>
                    </div>

                </div>
              </div>
            </div>

            {/* Account Overview */}
            <div className="dashboard-card overview-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0 }}>Account Overview</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', backgroundColor: 'var(--color-input-bg)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                  Acc: {accountNumber}
                </span>
              </div>
              
              <div className="total-balance">
                <span className="balance-label">Total Balance</span>
                <span className="balance-amount">{formatZAR(totalBalance)}</span>
              </div>

              <div className="account-grid">
                <div className="account-item" onClick={() => onSelectAccount('savings')}>
                  <span className="acc-name">Savings Account</span>
                  <span className="acc-val">{formatZAR(accounts.savings)}</span>
                </div>
                <div className="account-item" onClick={() => onSelectAccount('checking')}>
                  <span className="acc-name">Checking Account</span>
                  <span className="acc-val">{formatZAR(accounts.checking)}</span>
                </div>
                <div className="account-item" onClick={() => onSelectAccount('business')}>
                  <span className="acc-name">Business Account</span>
                  <span className="acc-val">{formatZAR(accounts.business)}</span>
                </div>
                <div className="account-item" onClick={() => onSelectAccount('investment')}>
                  <span className="acc-name">Investment Account</span>
                  <span className="acc-val">{formatZAR(accounts.investment)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions / Features */}
          <div className="actions-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            {/* Withdraw */}
            <div className="dashboard-card action-card" onClick={onWithdraw}>
              <div className="action-icon-wrapper icon-withdraw">
                <RandSignIcon size={24} />
              </div>
              <h4>Withdraw</h4>
              <p className="action-desc">Withdraw money from your account</p>
            </div>

            {/* Deposit */}
            <div className="dashboard-card action-card" onClick={onDeposit}>
              <div className="action-icon-wrapper icon-deposit">
                <PlusIcon size={24} />
              </div>
              <h4>Deposit</h4>
              <p className="action-desc">Add money to your account</p>
            </div>

            {/* Transaction History */}
            <div className="dashboard-card action-card" onClick={onHistory}>
              <div className="action-icon-wrapper icon-history">
                <ClipboardIcon size={24} />
              </div>
              <h4>Transaction History</h4>
              <p className="action-desc">View your transaction history</p>
            </div>

            {/* Transfer */}
            <div className="dashboard-card action-card" onClick={onTransfer}>
              <div className="action-icon-wrapper" style={{ backgroundColor: 'rgba(62, 130, 247, 0.15)', color: '#3e82f7' }}>
                <TransferIcon size={24} />
              </div>
              <h4>Transfer</h4>
              <p className="action-desc">Transfer between accounts</p>
            </div>
          </div>

          {/* Offerings Slideshow */}
          <div className="dashboard-card" style={{ 
            padding: 0, 
            overflow: 'hidden', 
            position: 'relative', 
            minHeight: '320px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {slides.map((slide, index) => (
              <div 
                key={slide.id}
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: index === currentSlide ? 1 : 0,
                  transition: 'opacity 0.8s ease-in-out',
                  zIndex: index === currentSlide ? 1 : 0
                }}
              >
                {/* Background Image */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url(${slide.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }} />

                {/* Gradient Overlay */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.3))'
                }} />

                {/* Content */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '2rem',
                  textAlign: 'center',
                  color: 'white',
                  zIndex: 2
                }}>
                  {index === 0 && (
                    <div className="security-icon-circle" style={{ marginBottom: '1rem', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' }}>
                      <LockIcon size={32} />
                    </div>
                  )}
                  <h3 style={{ 
                    fontSize: '1.75rem', 
                    marginBottom: '0.75rem', 
                    fontWeight: 700,
                    textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                  }}>
                    {slide.title}
                  </h3>
                  <p style={{ 
                    fontSize: '1rem', 
                    maxWidth: '500px', 
                    lineHeight: '1.6',
                    textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                    opacity: 0.9
                  }}>
                    {slide.description}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Pagination Dots */}
            <div style={{ 
              position: 'absolute', 
              bottom: '1.5rem', 
              left: '50%', 
              transform: 'translateX(-50%)', 
              display: 'flex', 
              gap: '0.75rem',
              zIndex: 10 
            }}>
              {slides.map((_, index) => (
                <div 
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  style={{
                    width: index === currentSlide ? '24px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    backgroundColor: index === currentSlide ? 'var(--color-primary)' : 'rgba(255,255,255,0.3)',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                />
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};
