import React, { useState, useEffect } from 'react';
import { AuthService } from '../services/authService';
import { IUser } from 'pakt-sdk';

const UserDetails: React.FC = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        const userData = await AuthService.getUser();
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch user data');
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="user-details-container">
        <div className="user-details-card">
          <p>Loading user details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-details-container">
        <div className="user-details-card">
          <h2>Error</h2>
          <p style={{ color: 'red' }}>{error}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="user-details-container">
        <div className="user-details-card">
          <p>No user data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-details-container">
      <div className="user-details-card">
        <h2>User Details</h2>
        <div className="user-info">
          <div className="info-item">
            <strong>ID:</strong> {user._id}
          </div>
          <div className="info-item">
            <strong>Email:</strong> {user.email}
          </div>
          <div className="info-item">
            <strong>First Name:</strong> {user.firstName}
          </div>
          <div className="info-item">
            <strong>Last Name:</strong> {user.lastName}
          </div>
          <div className="info-item">
            <strong>Type:</strong> {user.type}
          </div>
          <div className="info-item">
            <strong>Score:</strong> {user.score}
          </div>
          <div className="info-item">
            <strong>Profile Completeness:</strong> {user.profileCompleteness}%
          </div>
          {user.profile?.bio?.title && (
            <div className="info-item">
              <strong>Title:</strong> {user.profile.bio.title}
            </div>
          )}
          {user.profile?.bio?.description && (
            <div className="info-item">
              <strong>Bio:</strong> {user.profile.bio.description}
            </div>
          )}
          {user.profile?.talent?.availability && (
            <div className="info-item">
              <strong>Availability:</strong> {user.profile.talent.availability}
            </div>
          )}
          {user.profile?.contact?.city && (
            <div className="info-item">
              <strong>City:</strong> {user.profile.contact.city}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetails;