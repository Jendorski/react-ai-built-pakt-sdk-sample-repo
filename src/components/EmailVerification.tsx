import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthService } from '../services/authService';

interface EmailVerificationProps {
  tempToken?: string;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({ tempToken }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const tokenFromUrl = searchParams.get('token');
  const tempTokenFromUrl = searchParams.get('tempToken');

  useEffect(() => {
    if (tokenFromUrl && (tempToken || tempTokenFromUrl)) {
      handleVerification(tempToken || tempTokenFromUrl!, tokenFromUrl);
    }
  }, [tokenFromUrl, tempToken, tempTokenFromUrl]);

  const handleVerification = async (temp: string, token: string) => {
    setIsLoading(true);
    setError('');

    try {
      await AuthService.verifyAccount(temp, token);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode.trim()) {
      setError('Please enter the verification code');
      return;
    }

    if (!tempToken && !tempTokenFromUrl) {
      setError('Missing temporary token. Please try registering again.');
      return;
    }

    await handleVerification(tempToken || tempTokenFromUrl!, verificationCode);
  };

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>Email Verified Successfully!</h2>
          <p>Your email has been verified. Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Verify Your Email</h2>
        <p>We've sent a verification code to your email. Please enter it below to verify your account.</p>
        
        {!tokenFromUrl && (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="verificationCode">Verification Code</label>
              <input
                type="text"
                id="verificationCode"
                name="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
                placeholder="Enter verification code"
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" disabled={isLoading} className="auth-button">
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>
        )}

        {tokenFromUrl && (
          <div className="verification-status">
            {isLoading && <p>Verifying your email...</p>}
            {error && <div className="error-message">{error}</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;