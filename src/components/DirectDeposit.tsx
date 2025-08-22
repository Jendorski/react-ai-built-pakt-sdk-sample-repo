import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { DirectDepositService } from '../services/directDepositService';
import { ICreateDirectDepositResponse, IBlockchainCoin } from 'pakt-sdk';

interface DirectDepositFormData {
  name: string;
  description: string;
  amount: number;
  coin: string;
  collectionType: string;
}

const DirectDeposit: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<DirectDepositFormData>({
    name: '',
    description: '',
    amount: 0,
    coin: 'usdc',
    collectionType: 'direct-deposit'
  });
  const [paymentMethods, setPaymentMethods] = useState<IBlockchainCoin[]>([]);
  const [depositResponse, setDepositResponse] = useState<ICreateDirectDepositResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'form' | 'payment' | 'confirmation'>('form');

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const methods = await DirectDepositService.fetchPaymentMethods();
      setPaymentMethods(methods.filter(method => method.active));
    } catch (error) {
      console.error('Failed to fetch payment methods:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      setError('User information not available');
      return;
    }

    if (!formData.name || !formData.description || formData.amount <= 0) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await DirectDepositService.createDirectDeposit({
        name: formData.name,
        description: formData.description,
        amount: formData.amount,
        coin: formData.coin,
        collectionType: formData.collectionType,
        owner: user.id
      });

      setDepositResponse(response);
      setStep('payment');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create direct deposit');
    } finally {
      setLoading(false);
    }
  };

  const handleValidateDeposit = async () => {
    if (!depositResponse?.collectionId) return;

    setLoading(true);
    try {
      await DirectDepositService.validateDirectDeposit({
        collection: depositResponse.collectionId,
        method: 'crypto',
        status: 'pending',
        release: false
      });
      
      setStep('confirmation');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to validate deposit');
    } finally {
      setLoading(false);
    }
  };

  const resetFlow = () => {
    setStep('form');
    setDepositResponse(null);
    setError('');
    setFormData({
      name: '',
      description: '',
      amount: 0,
      coin: 'usdc',
      collectionType: 'direct-deposit'
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (step === 'form') {
    return (
      <div className="auth-container">
        <div className="auth-card" style={{ maxWidth: '600px' }}>
          <h2>Create Direct Deposit</h2>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
            Set up a direct cryptocurrency deposit to receive funds instantly
          </p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Deposit Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter a name for this deposit"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the purpose of this deposit"
                rows={3}
                style={{
                  padding: '12px 16px',
                  border: '2px solid #e1e1e1',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="amount">Amount *</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="coin">Cryptocurrency *</label>
                <select
                  id="coin"
                  name="coin"
                  value={formData.coin}
                  onChange={handleInputChange}
                  style={{
                    padding: '12px 16px',
                    border: '2px solid #e1e1e1',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    backgroundColor: 'white'
                  }}
                  required
                >
                  {paymentMethods.map(method => (
                    <option key={method.symbol} value={method.symbol.toLowerCase()}>
                      {method.name} ({method.symbol.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Creating...' : 'Create Direct Deposit'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (step === 'payment' && depositResponse) {
    return (
      <div className="auth-container">
        <div className="auth-card" style={{ maxWidth: '700px' }}>
          <h2>Payment Details</h2>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
            Send cryptocurrency to the address below to complete your deposit
          </p>

          <div style={{ 
            background: '#f8f9fa', 
            border: '1px solid #e9ecef', 
            borderRadius: '8px', 
            padding: '20px', 
            marginBottom: '20px' 
          }}>
            <div style={{ marginBottom: '15px' }}>
              <strong>Deposit Information:</strong>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <strong>Name:</strong> {formData.name}
            </div>
            <div style={{ marginBottom: '10px' }}>
              <strong>Description:</strong> {formData.description}
            </div>
            <div style={{ marginBottom: '10px' }}>
              <strong>Amount:</strong> {depositResponse.collectionAmount} {depositResponse.coin.toUpperCase()}
            </div>
            <div style={{ marginBottom: '10px' }}>
              <strong>USD Value:</strong> ${depositResponse.usdAmount}
            </div>
            <div style={{ marginBottom: '10px' }}>
              <strong>Fee:</strong> ${depositResponse.usdFee} ({depositResponse.feePercentage}%)
            </div>
            <div>
              <strong>Total to Pay:</strong> {depositResponse.amountToPay} {depositResponse.coin.toUpperCase()}
            </div>
          </div>

          <div style={{ 
            background: '#e8f4fd', 
            border: '1px solid #bee5eb', 
            borderRadius: '8px', 
            padding: '20px', 
            marginBottom: '20px' 
          }}>
            <div style={{ marginBottom: '15px' }}>
              <strong>Payment Address:</strong>
            </div>
            <div style={{ 
              background: 'white', 
              padding: '12px', 
              borderRadius: '4px', 
              fontFamily: 'monospace', 
              fontSize: '14px',
              wordBreak: 'break-all',
              border: '1px solid #ccc'
            }}>
              {depositResponse.address}
            </div>
            <button 
              onClick={() => copyToClipboard(depositResponse.address)}
              style={{
                marginTop: '10px',
                padding: '8px 16px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Copy Address
            </button>
          </div>

          <div style={{ 
            background: '#fff3cd', 
            border: '1px solid #ffeaa7', 
            borderRadius: '8px', 
            padding: '15px', 
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            <strong>Important:</strong> Send exactly {depositResponse.amountToPay} {depositResponse.coin.toUpperCase()} to the address above. 
            Make sure you're sending from the correct network (Chain ID: {depositResponse.chainId}).
          </div>

          {error && <div className="error-message">{error}</div>}

          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <button 
              onClick={handleValidateDeposit} 
              className="auth-button"
              disabled={loading}
            >
              {loading ? 'Validating...' : 'I Have Sent Payment'}
            </button>
            <button 
              onClick={resetFlow} 
              style={{
                background: 'transparent',
                color: '#666',
                border: '1px solid #ccc',
                padding: '14px 24px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Start Over
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'confirmation') {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>Deposit Submitted</h2>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ 
              background: '#d4edda', 
              color: '#155724', 
              padding: '20px', 
              borderRadius: '8px', 
              marginBottom: '20px' 
            }}>
              <strong>Success!</strong> Your direct deposit has been submitted for validation.
            </div>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Your payment will be processed and validated shortly. You will receive a confirmation once the transaction is complete.
            </p>
            <div style={{ marginBottom: '20px' }}>
              <strong>Collection ID:</strong> {depositResponse?.collectionId}
            </div>
            <button onClick={resetFlow} className="auth-button">
              Create Another Deposit
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default DirectDeposit;