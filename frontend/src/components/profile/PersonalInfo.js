'use client';

import { useState, useEffect } from 'react';
import { apiRequest } from '@/services/api';
import styles from './profile.module.css';

export default function PersonalInfo() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    date_of_birth: '',
    profile_image: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await apiRequest('/profile');
      setProfileData({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        date_of_birth: data.date_of_birth || '',
        profile_image: data.profile_image || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage({ type: 'error', text: 'Failed to load profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const updateData = {
        name: profileData.name,
        phone: profileData.phone || null,
        address: profileData.address || null,
        date_of_birth: profileData.date_of_birth || null,
      };

      const data = await apiRequest('/profile', {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });

      setProfileData({
        ...profileData,
        ...data,
      });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'An error occurred' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2>Personal Information</h2>
        {!isEditing && (
          <button 
            className={styles.editButton}
            onClick={() => setIsEditing(true)}
          >
            ✏️ Edit
          </button>
        )}
      </div>

      {message.text && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={profileData.name}
              onChange={handleChange}
              disabled={!isEditing}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={profileData.email}
              disabled
              className={`${styles.input} ${styles.disabled}`}
              title="Email cannot be changed"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={profileData.phone}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="+91 1234567890"
              className={styles.input}
            />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              value={profileData.address}
              onChange={handleChange}
              disabled={!isEditing}
              rows="3"
              placeholder="Enter your address"
              className={styles.textarea}
            />
          </div>
        </div>

        {isEditing && (
          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => {
                setIsEditing(false);
                fetchProfile();
                setMessage({ type: '', text: '' });
              }}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
