import React, { useState, useEffect } from 'react';
import { 
  ChevronLeftIcon, UserIcon, MailIcon, PhoneIcon, 
  MapPinIcon, LockIcon, BellIcon, ShieldIcon, CheckCircleIcon 
} from './CustomIcons';

export const ProfilePage = ({ 
  onBack, 
  userName, 
  email, 
  phoneNumber, 
  accountNumber, 
  onUpdateProfile,
  notifications,
  onToggleNotification,
  twoFactorEnabled,
  onToggleTwoFactor
}) => {
  const [formData, setFormData] = useState({
    name: userName,
    email: email,
    phone: phoneNumber || '082 123 4567',
    address: '42 Sandton Drive, Sandton, 2196'
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Helper to get initials
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    onUpdateProfile(formData.name, formData.email, formData.phone);
    setIsSuccess(true);
    setIsEditing(false);
    
    // Reset success message after 3 seconds
    setTimeout(() => {
      setIsSuccess(false);
    }, 3000);
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
            Profile Management
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-container">
          
          {/* Success Notification */}
          {isSuccess && (
            <div className="alert-success" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <CheckCircleIcon size={20} />
              <span>Profile updated successfully!</span>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            
            {/* Left Column: Personal Details */}
            <div className="dashboard-card" style={{ height: 'fit-content' }}>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                marginBottom: '2rem',
                borderBottom: '1px solid var(--color-border)',
                paddingBottom: '2rem'
              }}>
                <div style={{ 
                  width: '100px', 
                  height: '100px', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #7e60e8 0%, #3e82f7 100%)',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  color: 'white',
                  marginBottom: '1rem',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
                }}>
                  {getInitials(userName)}
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.25rem' }}>{userName}</h2>
                <p style={{ color: 'var(--color-text-muted)' }}>Customer ID: {accountNumber}</p>
                <div style={{ marginTop: '1rem' }}>
                   <span style={{ 
                     background: 'rgba(16, 185, 129, 0.1)', 
                     color: '#10b981', 
                     padding: '0.25rem 0.75rem', 
                     borderRadius: '2rem', 
                     fontSize: '0.75rem', 
                     fontWeight: 600 
                   }}>Verified Account</span>
                </div>
              </div>

              <form onSubmit={handleSave}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Personal Information</h3>
                  {!isEditing && (
                    <button 
                      type="button" 
                      onClick={() => setIsEditing(true)}
                      style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontSize: '0.875rem' }}
                    >
                      Edit
                    </button>
                  )}
                </div>

                <div className="form-group">
                  <div className="input-wrapper">
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '0.5rem' }}>Full Name</label>
                    <div style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }}>
                        <UserIcon size={18} />
                      </div>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        style={{ paddingLeft: '2.5rem', opacity: isEditing ? 1 : 0.7 }}
                      />
                    </div>
                  </div>

                  <div className="input-wrapper">
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '0.5rem' }}>Email Address</label>
                    <div style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }}>
                        <MailIcon size={18} />
                      </div>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        style={{ paddingLeft: '2.5rem', opacity: isEditing ? 1 : 0.7 }}
                      />
                    </div>
                  </div>

                  <div className="input-wrapper">
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '0.5rem' }}>Phone Number</label>
                    <div style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }}>
                        <PhoneIcon size={18} />
                      </div>
                      <input 
                        type="text" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        style={{ paddingLeft: '2.5rem', opacity: isEditing ? 1 : 0.7 }}
                      />
                    </div>
                  </div>

                  <div className="input-wrapper">
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '0.5rem' }}>Residential Address</label>
                    <div style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '1rem', top: '1rem', color: '#6b7280' }}>
                        <MapPinIcon size={18} />
                      </div>
                      <textarea 
                        name="address"
                        value={formData.address}
                        onChange={(e) => setFormData(prev => ({...prev, address: e.target.value}))}
                        disabled={!isEditing}
                        style={{ 
                          width: '100%', 
                          backgroundColor: 'var(--color-input-bg)', 
                          border: '1px solid transparent', 
                          borderRadius: '0.5rem', 
                          padding: '0.75rem 1rem 0.75rem 2.5rem',
                          color: 'white',
                          fontFamily: 'inherit',
                          fontSize: '0.875rem',
                          minHeight: '80px',
                          resize: 'none',
                          opacity: isEditing ? 1 : 0.7
                        }}
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                      <button type="submit" className="btn-primary">Save Changes</button>
                      <button 
                        type="button" 
                        onClick={() => setIsEditing(false)}
                        className="btn-primary" 
                        style={{ backgroundColor: 'transparent', border: '1px solid var(--color-border)' }}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Right Column: Security & Preferences */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Security Card */}
              <div className="dashboard-card">
                 <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   <ShieldIcon size={20} className="text-primary" style={{ color: '#7e60e8' }} /> Security
                 </h3>
                 
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <div>
                        <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>Password</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Last changed 3 months ago</div>
                      </div>
                      <button style={{ background: 'rgba(255,255,255,0.1)', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', color: 'white', cursor: 'pointer', fontSize: '0.8rem' }}>Change</button>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0' }}>
                      <div>
                        <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>Two-Factor Authentication</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                          {/* 2FA Implementation Note: Uses both registered channels (Email & Phone) */}
                          Secure your account with 2FA using both <strong>Email</strong> and <strong>Contact Number</strong>
                        </div>
                      </div>
                      {/* 2FA Toggle Switch - Interactive */}
                      <div 
                         onClick={onToggleTwoFactor}
                         style={{ 
                           width: '40px', 
                           height: '20px', 
                           backgroundColor: twoFactorEnabled ? 'var(--color-success)' : 'var(--color-border)', 
                           borderRadius: '20px', 
                           position: 'relative',
                           cursor: 'pointer',
                           transition: 'background-color 0.2s' 
                         }}
                      >
                        <div style={{ 
                          width: '16px', 
                          height: '16px', 
                          backgroundColor: 'white', 
                          borderRadius: '50%', 
                          position: 'absolute', 
                          top: '2px', 
                          left: twoFactorEnabled ? '22px' : '2px',
                          transition: 'left 0.2s'
                        }} />
                      </div>
                    </div>
                 </div>
              </div>

              {/* Preferences Card */}
              <div className="dashboard-card">
                 <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   <BellIcon size={20} style={{ color: '#3e82f7' }} /> Notifications
                 </h3>
                 
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <div>
                        <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>Email Notifications</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Receive updates via email</div>
                      </div>
                      <div 
                         onClick={() => onToggleNotification('email')}
                         style={{ 
                           width: '40px', 
                           height: '20px', 
                           backgroundColor: notifications.email ? 'var(--color-primary)' : 'var(--color-border)', 
                           borderRadius: '20px', 
                           position: 'relative',
                           cursor: 'pointer',
                           transition: 'background-color 0.2s'
                         }}
                      >
                        <div style={{ 
                          width: '16px', 
                          height: '16px', 
                          backgroundColor: 'white', 
                          borderRadius: '50%', 
                          position: 'absolute', 
                          top: '2px', 
                          left: notifications.email ? '22px' : '2px',
                          transition: 'left 0.2s'
                        }} />
                      </div>
                    </div>

                    {/* Marketing Notification Removed */}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0' }}>
                      <div>
                        <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>SMS Notifications</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Receive updates via SMS</div>
                      </div>
                      <div 
                         onClick={() => onToggleNotification('sms')}
                         style={{ 
                           width: '40px', 
                           height: '20px', 
                           backgroundColor: notifications.sms ? 'var(--color-primary)' : 'var(--color-border)', 
                           borderRadius: '20px', 
                           position: 'relative',
                           cursor: 'pointer',
                           transition: 'background-color 0.2s'
                         }}
                      >
                         <div style={{ 
                          width: '16px', 
                          height: '16px', 
                          backgroundColor: 'white', 
                          borderRadius: '50%', 
                          position: 'absolute', 
                          top: '2px', 
                          left: notifications.sms ? '22px' : '2px',
                          transition: 'left 0.2s'
                        }} />
                      </div>
                    </div>

                 </div>
              </div>

            </div>

          </div>
        </div>
      </main>
    </div>
  );
};
