import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthService } from '../services/authService';

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get('token');
  const tempToken = searchParams.get('tempToken');

  useEffect(() => {
    const validateToken = async () => {
      if (!token || !tempToken) {
        setError('Invalid reset link. Please request a new password reset.');
        setValidatingToken(false);
        return;
      }

      try {
        await AuthService.validatePasswordToken(token, tempToken);
        setValidatingToken(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Invalid or expired reset link');
        setValidatingToken(false);
      }
    };

    validateToken();
  }, [token, tempToken]);

  const handleSubmit = async (e: React.FormEvent) => {
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

    if (!token || !tempToken) {
      setError('Invalid reset link. Please request a new password reset.');
      setIsLoading(false);
      return;
    }

    try {
      await AuthService.changePassword(token, tempToken, password);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Password reset failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (validatingToken) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>Validating Reset Link</h2>
          <p>Please wait while we validate your reset link...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>Password Reset Successful!</h2>
          <p>Your password has been successfully reset. Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (error && (!token || !tempToken)) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>Invalid Reset Link</h2>
          <div className="error-message">{error}</div>
          <div className="auth-link">
            <a href="/forgot-password">Request a new password reset</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Reset Your Password</h2>
        <p>Enter your new password below.</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              name="password"
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
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm new password"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={isLoading} className="auth-button">
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;