import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon } from './CustomIcons';

export const RegisterForm = ({ onAuth }) => {
  const [authMode, setAuthMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({});
  
  const [formData, setFormData] = useState({
    firstName: 'Fletcher',
    lastName: '',
    saIdNumber: '',
    email: '',
    phoneNumber: '',
    password: '',
    agreed: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear specific error when user types
    if (name === 'saIdNumber') {
      setErrors(prev => ({ ...prev, saIdNumber: undefined }));
    }
    if (name === 'password') {
      setErrors(prev => ({ ...prev, password: undefined }));
    }
    // Clear global auth error on input change
    if (errors.auth) {
      setErrors(prev => ({ ...prev, auth: undefined }));
    }
  };

  const toggleMode = (e, mode) => {
    e.preventDefault();
    setAuthMode(mode);
    setResetSent(false);
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (authMode === 'forgot') {
      // Simulate sending reset email
      setResetSent(true);
    } else {
      // Validate ID Number for Login and Register
      if (authMode === 'login' || authMode === 'register') {
        const id = formData.saIdNumber;
        // Regex checks for exactly 13 digits
        if (!/^\d{13}$/.test(id)) {
          setErrors({ saIdNumber: 'ID number must be exactly 13 digits' });
          return;
        }
      }

      // Attempt Authentication
      const result = onAuth(authMode, formData);
      
      if (!result.success) {
        setErrors(prev => ({ ...prev, auth: result.message }));
      }
      // If success, App component handles the view switch
    }
  };

  // Render Success Message for Forgot Password
  if (resetSent && authMode === 'forgot') {
    return (
      <div className="form-panel">
        <div className="header-text">
          <h2>Check your email</h2>
          <p className="sub-text">
            We've sent password reset instructions to <strong style={{ color: 'white' }}>{formData.email || 'your email address'}</strong>.
          </p>
        </div>
        
        <button 
          className="btn-primary" 
          onClick={(e) => toggleMode(e, 'login')}
        >
          Return to Log in
        </button>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <p className="sub-text">
            Did not receive the email?{' '}
            <a href="#" onClick={() => setResetSent(false)}>Resend</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="form-panel">
      <div className="header-text">
        {authMode === 'forgot' ? (
          <>
            <h2>Reset password</h2>
            <p className="sub-text">
              Enter the email address associated with your account and we'll send you a link to reset your password.
            </p>
          </>
        ) : (
          <>
            <h2>{authMode === 'login' ? 'Welcome' : 'Create an account'}</h2>
            <p className="sub-text">
              {authMode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
              <a href="#" onClick={(e) => toggleMode(e, authMode === 'login' ? 'register' : 'login')}>
                {authMode === 'login' ? 'Sign up' : 'Log in'}
              </a>
            </p>
          </>
        )}
      </div>

      <form className="form-group" onSubmit={handleSubmit}>
        
        {/* Auth Error Message */}
        {errors.auth && (
          <div style={{ 
            backgroundColor: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.2)', 
            color: '#ef4444', 
            padding: '0.75rem', 
            borderRadius: '0.5rem', 
            fontSize: '0.875rem',
            textAlign: 'center'
          }}>
            {errors.auth}
          </div>
        )}

        {authMode === 'register' && (
          /* Name Row */
            <div className="row">
              <div className="col">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                  className="has-border"
                  required
                />
              </div>
              <div className="col">
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  required
                />
              </div>
            </div>
        )}

        {/* SA ID Number - Shown for Login and Register */}
        {(authMode === 'login' || authMode === 'register') && (
          <div>
            <input
              type="text"
              name="saIdNumber"
              value={formData.saIdNumber}
              onChange={handleChange}
              placeholder="South African ID number"
              maxLength={13}
              required
              style={errors.saIdNumber ? { borderColor: '#ef4444' } : {}}
            />
            {errors.saIdNumber && (
              <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.5rem', display: 'block' }}>
                {errors.saIdNumber}
              </span>
            )}
          </div>
        )}

        {/* Email and Phone Section */}
        {authMode === 'register' ? (
          <div className="row">
            <div className="col">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
              />
            </div>
            <div className="col">
              <div className="input-wrapper">
                 <span style={{ 
                     position: 'absolute', 
                     left: '1rem', 
                     top: '50%', 
                     transform: 'translateY(-50%)', 
                     color: 'var(--color-text-muted)',
                     fontSize: '0.875rem',
                     fontWeight: 500,
                     borderRight: '1px solid var(--color-border)',
                     paddingRight: '0.75rem',
                     lineHeight: '1'
                 }}>
                   +27
                 </span>
                 <input
                  type="tel" 
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                    handleChange({ target: { name: 'phoneNumber', value: val, type: 'tel' } });
                  }}
                  placeholder="Mobile number"
                  style={{ paddingLeft: '4.5rem' }}
                  required
                />
              </div>
            </div>
          </div>
        ) : authMode === 'forgot' ? (
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
          </div>
        ) : null}

        {/* Password - Shown for Login and Register */}
        {authMode !== 'forgot' && (
          <div>
            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                style={errors.password ? { borderColor: '#ef4444' } : {}}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="eye-btn"
              >
                {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
              </button>
            </div>
            {errors.password && (
              <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.5rem', display: 'block' }}>
                {errors.password}
              </span>
            )}
          </div>
        )}

        {/* Forgot Password Link - Only for Login */}
        {authMode === 'login' && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-0.5rem' }}>
            <a 
              href="#" 
              onClick={(e) => toggleMode(e, 'forgot')}
              style={{ fontSize: '0.85rem', textDecoration: 'none' }}
            >
              Forgot Password?
            </a>
          </div>
        )}

        {authMode === 'register' && (
          /* Checkbox */
          <div className="checkbox-group">
            <div className="checkbox-wrapper">
              <input
                type="checkbox"
                id="terms"
                name="agreed"
                checked={formData.agreed}
                onChange={handleChange}
                required
              />
              <svg
                className="check-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <label htmlFor="terms" className="checkbox-label">
              I agree to the <a href="#" className="checkbox-link">Terms & Conditions</a>
            </label>
          </div>
        )}

        {/* Submit Button */}
        <button type="submit" className="btn-primary">
          {authMode === 'login' ? 'Log in' : authMode === 'register' ? 'Create account' : 'Send reset link'}
        </button>

        {/* Back to Login for Forgot Password */}
        {authMode === 'forgot' && (
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <a 
              href="#" 
              onClick={(e) => toggleMode(e, 'login')}
              style={{ fontSize: '0.875rem' }}
            >
              Back to Log in
            </a>
          </div>
        )}
      </form>
    </div>
  );
};
