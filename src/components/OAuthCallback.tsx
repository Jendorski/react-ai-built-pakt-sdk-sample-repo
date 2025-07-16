import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthService } from '../services/authService';

const OAuthCallback: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');

      if (error) {
        setError('OAuth authentication was cancelled or failed');
        setIsLoading(false);
        return;
      }

      if (!code || !state) {
        setError('Invalid OAuth callback parameters');
        setIsLoading(false);
        return;
      }

      try {
        const userData = await AuthService.googleOAuthValidateState(state, code);
        
        if (userData.type === 'sign_up' && !userData.isVerified) {
          // New user needs email verification
          navigate('/verify-email');
        } else {
          // User is signed in, redirect to dashboard
          navigate('/dashboard');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'OAuth validation failed');
        setIsLoading(false);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  if (isLoading) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>Completing Authentication</h2>
          <p>Please wait while we complete your Google authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Authentication Failed</h2>
        <div className="error-message">{error}</div>
        <div style={{ marginTop: '20px' }}>
          <button 
            onClick={() => navigate('/login')} 
            className="auth-button"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default OAuthCallback;