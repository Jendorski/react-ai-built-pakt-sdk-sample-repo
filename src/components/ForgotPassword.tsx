import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthService } from '../services/authService';

type Step = 'email' | 'otp' | 'password' | 'success';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [tempToken, setTempToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await AuthService.resetPassword(email);
      setTempToken(response.tempToken);
      setStep('otp');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Password reset failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await AuthService.validatePasswordToken(otp, tempToken);
      setStep('password');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }

    try {
      await AuthService.changePassword(otp, tempToken, password);
      setStep('success');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Password change failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>Password Reset Successful!</h2>
          <p>Your password has been successfully reset. Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (step === 'password') {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>Set New Password</h2>
          <p>Enter your new password below.</p>
          <form onSubmit={handlePasswordSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="password">New Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter new password"
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm new password"
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" disabled={isLoading} className="auth-button">
              {isLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (step === 'otp') {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>Enter OTP</h2>
          <p>We've sent a verification code to {email}. Please enter the code below.</p>
          <form onSubmit={handleOtpSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="otp">Verification Code</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                placeholder="Enter 6-digit code"
                maxLength={6}
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" disabled={isLoading} className="auth-button">
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </button>
          </form>
          <p className="auth-link">
            <button 
              onClick={() => setStep('email')} 
              style={{ background: 'none', border: 'none', color: 'inherit', textDecoration: 'underline', cursor: 'pointer' }}
            >
              Back to Email
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Forgot Password</h2>
        <p>Enter your email address and we'll send you a verification code to reset your password.</p>
        <form onSubmit={handleEmailSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={isLoading} className="auth-button">
            {isLoading ? 'Sending...' : 'Send Verification Code'}
          </button>
        </form>
        <p className="auth-link">
          Remember your password? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;