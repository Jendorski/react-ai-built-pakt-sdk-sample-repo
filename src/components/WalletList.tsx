import React, { useState, useEffect } from 'react';
import { WalletService } from '../services/walletService';
import { IWalletResponseDto, IWalletDto } from 'pakt-sdk';

const WalletList: React.FC = () => {
  const [walletData, setWalletData] = useState<IWalletResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await WalletService.getWallets();
        setWalletData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch wallet data');
        console.error('Error fetching wallet data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, []);

  if (loading) {
    return (
      <div className="wallet-container">
        <div className="wallet-card">
          <p>Loading wallets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wallet-container">
        <div className="wallet-card">
          <h2>Error</h2>
          <p style={{ color: 'red' }}>{error}</p>
        </div>
      </div>
    );
  }

  if (!walletData) {
    return (
      <div className="wallet-container">
        <div className="wallet-card">
          <p>No wallet data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="wallet-container">
      <div className="wallet-card">
        <h2>My Wallets</h2>
        
        <div className="wallet-summary" style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <div className="summary-item">
            <strong>Total Balance:</strong> ${walletData.totalBalance.toFixed(2)}
          </div>
          <div className="summary-item">
            <strong>Portfolio Value:</strong> ${walletData.value.toFixed(2)}
          </div>
          <div className="summary-item">
            <strong>Total Wallets:</strong> {walletData.wallets.length}
          </div>
        </div>

        <div className="wallets-list">
          <h3>Individual Wallets</h3>
          {walletData.wallets.length === 0 ? (
            <p>No wallets found</p>
          ) : (
            <div className="wallet-grid" style={{ display: 'grid', gap: '20px' }}>
              {walletData.wallets.map((wallet: IWalletDto) => (
                <div key={wallet._id} className="wallet-item" style={{ 
                  border: '1px solid #ddd', 
                  borderRadius: '8px', 
                  padding: '20px',
                  backgroundColor: '#fff'
                }}>
                  <div className="wallet-header" style={{ marginBottom: '15px' }}>
                    <h4 style={{ margin: '0', color: '#333' }}>{wallet.coin.toUpperCase()}</h4>
                    <span className={`status ${wallet.status}`} style={{ 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      fontSize: '12px',
                      backgroundColor: wallet.status === 'active' ? '#d4edda' : '#f8d7da',
                      color: wallet.status === 'active' ? '#155724' : '#721c24'
                    }}>
                      {wallet.status}
                    </span>
                  </div>
                  
                  <div className="wallet-details">
                    <div className="detail-row" style={{ marginBottom: '8px' }}>
                      <strong>Amount:</strong> {wallet.amount.toFixed(8)} {wallet.coin.toUpperCase()}
                    </div>
                    <div className="detail-row" style={{ marginBottom: '8px' }}>
                      <strong>USD Value:</strong> ${wallet.usdValue.toFixed(2)}
                    </div>
                    <div className="detail-row" style={{ marginBottom: '8px' }}>
                      <strong>Spendable:</strong> {wallet.spendable.toFixed(8)} {wallet.coin.toUpperCase()}
                    </div>
                    <div className="detail-row" style={{ marginBottom: '8px' }}>
                      <strong>Locked:</strong> {wallet.lock.toFixed(8)} {wallet.coin.toUpperCase()}
                    </div>
                    <div className="detail-row" style={{ marginBottom: '8px' }}>
                      <strong>USD Rate:</strong> ${wallet.usdRate.toFixed(2)}
                    </div>
                    <div className="detail-row" style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}>
                      <strong>Address:</strong> 
                      <span style={{ wordBreak: 'break-all' }}>{wallet.address}</span>
                    </div>
                    {wallet.owner && (
                      <div className="wallet-owner" style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                        <strong>Owner:</strong> {wallet.owner.firstName} {wallet.owner.lastName}
                        <br />
                        <small>Score: {wallet.owner.score} | Type: {wallet.owner.type}</small>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletList;