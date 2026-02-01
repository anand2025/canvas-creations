'use client';

import { useState } from 'react';
import { apiRequest } from '@/services/api';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import styles from './profile.module.css';

export default function AccountSettings() {
  const { logout } = useAuth();
  const router = useRouter();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const handleChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('New passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await apiRequest('/profile/password', {
        method: 'PUT',
        body: JSON.stringify({
          current_password: passwordData.current_password,
          new_password: passwordData.new_password,
        }),
      });

      toast.success('Password changed successfully!');
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
      setShowPasswordForm(false);
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

    const levels = [
      { strength: 0, label: 'Very Weak', color: '#ff4444' },
      { strength: 1, label: 'Weak', color: '#ff8844' },
      { strength: 2, label: 'Fair', color: '#ffbb44' },
      { strength: 3, label: 'Good', color: '#44bb44' },
      { strength: 4, label: 'Strong', color: '#44ff44' },
      { strength: 5, label: 'Very Strong', color: '#00ff00' },
    ];

    return levels[strength];
  };

  const passwordStrength = getPasswordStrength(passwordData.new_password);

  const handleDeactivate = async () => {
    setLoading(true);
    try {
      await apiRequest('/profile', {
        method: 'DELETE',
      });
      toast.success('Your account has been deactivated. Goodbye!');
      logout();
      router.push('/');
    } catch (error) {
      console.error('Error deactivating account:', error);
      toast.error(error.message || 'Failed to deactivate account');
    } finally {
      setLoading(false);
      setShowDeactivateModal(false);
    }
  };

  return (
    <div className={styles.section} role="region" aria-label="Account Settings">
      <div className={styles.sectionHeader}>
        <h2>Account Settings</h2>
      </div>

      {/* Password Change Section */}
      <div className={styles.settingCard}>
        <div className={styles.settingHeader}>
          <div>
            <h3><span aria-hidden="true">🔒</span> Password</h3>
            <p>Change your account password to keep your account secure</p>
          </div>
          {!showPasswordForm && (
            <button 
              className={styles.editButton}
              onClick={() => setShowPasswordForm(true)}
              aria-expanded={showPasswordForm}
              aria-controls="password-change-form"
            >
              Change Password
            </button>
          )}
        </div>

        {showPasswordForm && (
          <form 
            id="password-change-form"
            onSubmit={handleSubmit} 
            className={styles.passwordForm}
            aria-label="Change Password Form"
          >
            <div className={styles.formGroup}>
              <label htmlFor="current_password">Current Password *</label>
              <input
                type="password"
                id="current_password"
                name="current_password"
                value={passwordData.current_password}
                onChange={handleChange}
                required
                className={styles.input}
                placeholder="Enter current password"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="new_password">New Password *</label>
              <input
                type="password"
                id="new_password"
                name="new_password"
                value={passwordData.new_password}
                onChange={handleChange}
                required
                minLength={8}
                className={styles.input}
                placeholder="Enter new password"
                aria-describedby="password-requirements"
              />
              {passwordData.new_password && (
                <div className={styles.passwordStrength} aria-live="polite">
                  <div className={styles.strengthBarContainer}>
                    <div 
                      className={styles.strengthBar}
                      role="progressbar"
                      aria-valuenow={passwordStrength.strength}
                      aria-valuemin="0"
                      aria-valuemax="5"
                      style={{ 
                        width: `${(passwordStrength.strength / 5) * 100}%`,
                        backgroundColor: passwordStrength.color 
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-wider opacity-60">Strength</span>
                    <span className="text-sm font-black" style={{ color: passwordStrength.color }}>
                      {passwordStrength.label}
                    </span>
                  </div>
                </div>
              )}
              <div className={styles.passwordRequirements} id="password-requirements">
                <p>Password must contain:</p>
                <ul role="list">
                  <li className={passwordData.new_password.length >= 8 ? styles.met : ''}>
                    At least 8 characters
                  </li>
                  <li className={/[A-Z]/.test(passwordData.new_password) ? styles.met : ''}>
                    One uppercase letter
                  </li>
                  <li className={/[a-z]/.test(passwordData.new_password) ? styles.met : ''}>
                    One lowercase letter
                  </li>
                  <li className={/\d/.test(passwordData.new_password) ? styles.met : ''}>
                    One number
                  </li>
                  <li className={/[!@#$%^&*(),.?":{}|<>]/.test(passwordData.new_password) ? styles.met : ''}>
                    One special character
                  </li>
                </ul>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirm_password">Confirm New Password *</label>
              <input
                type="password"
                id="confirm_password"
                name="confirm_password"
                value={passwordData.confirm_password}
                onChange={handleChange}
                required
                className={styles.input}
                placeholder="Repeat new password"
              />
              {passwordData.confirm_password && (
                <div className={styles.passwordMatch} aria-live="polite">
                  {passwordData.new_password === passwordData.confirm_password ? (
                    <span className={styles.match}>✓ Passwords match</span>
                  ) : (
                    <span className={styles.noMatch}>✗ Passwords do not match</span>
                  )}
                </div>
              )}
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => {
                  setShowPasswordForm(false);
                  setPasswordData({
                    current_password: '',
                    new_password: '',
                    confirm_password: '',
                  });
                }}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={styles.saveButton}
                disabled={loading || !passwordData.new_password || passwordData.new_password !== passwordData.confirm_password}
              >
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Account Information */}
      <div className={styles.settingCard}>
        <div className={styles.settingHeader}>
          <div>
            <h3><span aria-hidden="true">📧</span> Email Notifications</h3>
            <p>Manage your email preferences and stay updated</p>
          </div>
        </div>
        <div className={styles.settingContent}>
          <p className={styles.comingSoon}>This feature is coming soon...</p>
        </div>
      </div>

      {/* Danger Zone */}
      <div className={`${styles.settingCard} ${styles.dangerZone}`}>
        <div className={styles.settingHeader}>
          <div>
            <h3><span aria-hidden="true">⚠️</span> Danger Zone</h3>
            <p>Irreversible account actions. Please handle with care.</p>
          </div>
        </div>
        <div className={styles.settingContent}>
          <button 
            className={styles.dangerButton} 
            onClick={() => setShowDeactivateModal(true)}
            aria-haspopup="dialog"
          >
            Deactivate Account
          </button>
        </div>
      </div>

      {/* Deactivation Confirmation Modal */}
      {showDeactivateModal && (
        <div className={styles.modal} onClick={() => setShowDeactivateModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Confirm Deactivation</h3>
              <button 
                className={styles.closeButton}
                onClick={() => setShowDeactivateModal(false)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">😿</div>
                <h4 className="text-2xl font-black mb-4">Are you absolutely sure?</h4>
                <p className="text-lg opacity-80 leading-relaxed">
                  Deactivating your account will disable your access to Canvas & Creations. 
                  This action is irreversible and you will be logged out immediately.
                </p>
              </div>
              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setShowDeactivateModal(false)}
                  disabled={loading}
                >
                  No, Keep My Account
                </button>
                <button
                  type="button"
                  className={styles.saveButton}
                  style={{ background: 'var(--gradient-vibrant)' }}
                  onClick={handleDeactivate}
                  disabled={loading}
                >
                  {loading ? 'Deactivating...' : 'Yes, Deactivate Account'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
