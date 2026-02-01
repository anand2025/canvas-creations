'use client';

import { useState, useEffect } from 'react';
import { apiRequest } from '@/services/api';
import { toast } from 'react-hot-toast';
import styles from './profile.module.css';

export default function AddressBook() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
    is_default: false,
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const data = await apiRequest('/addresses');
      setAddresses(data);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const endpoint = editingAddress 
        ? `/addresses/${editingAddress.id}`
        : '/addresses';
      
      const method = editingAddress ? 'PUT' : 'POST';

      await apiRequest(endpoint, {
        method,
        body: JSON.stringify(formData),
      });

      toast.success(editingAddress ? 'Address updated successfully!' : 'Address added successfully!');
      fetchAddresses();
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error(error.message || 'Failed to save address');
    }
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData({
      full_name: address.full_name,
      phone: address.phone,
      address_line1: address.address_line1,
      address_line2: address.address_line2 || '',
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      country: address.country,
      address_type: address.address_type,
      is_default: address.is_default,
    });
    setShowModal(true);
  };

  const handleDelete = async (addressId) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      await apiRequest(`/addresses/${addressId}`, {
        method: 'DELETE',
      });
      toast.success('Address deleted successfully!');
      fetchAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address');
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      await apiRequest(`/addresses/${addressId}/default`, {
        method: 'PUT',
      });
      toast.success('Default address updated!');
      fetchAddresses();
    } catch (error) {
      console.error('Error setting default:', error);
      toast.error('Failed to update default address');
    }
  };

  const resetForm = () => {
    setFormData({
      full_name: '',
      phone: '',
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'India',
      is_default: false,
    });
    setEditingAddress(null);
  };


  if (loading) {
    return (
      <div className={styles.section} aria-busy="true" aria-label="Loading addresses">
        <div className={styles.sectionHeader}>
          <div className={`${styles.skeleton} ${styles.skeletonTitle}`}></div>
        </div>
        <div className={styles.addressGrid}>
          {[1, 2].map((i) => (
            <div key={i} className={`${styles.addressCard} overflow-hidden`}>
              <div className={`${styles.skeleton} ${styles.skeletonTitle} w-3/4 mb-4`}></div>
              <div className={`${styles.skeleton} ${styles.skeletonText} w-full mb-2`}></div>
              <div className={`${styles.skeleton} ${styles.skeletonText} w-full mb-2`}></div>
              <div className={`${styles.skeleton} ${styles.skeletonText} w-1/2`}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.section} role="region" aria-label="Address Book">
      <div className={styles.sectionHeader}>
        <h2>Address Book</h2>
        <button 
          className={styles.addButton}
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          aria-haspopup="dialog"
        >
          <span aria-hidden="true">+</span> Add New Address
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📍</div>
          <h3>No addresses saved</h3>
          <p>Add your first address to make checkout faster</p>
        </div>
      ) : (
        <div className={styles.addressGrid}>
          {addresses.map((address) => (
            <div key={address.id} className={styles.addressCard}>
              <div className={styles.addressHeader}>
                {address.is_default && (
                  <div className={styles.defaultBadge}>Primary</div>
                )}
              </div>
              
              <div className={styles.addressContent}>
                <h4>{address.full_name}</h4>
                <div role="address">
                  <div className={styles.addressLine}>
                    <span className={styles.icon} aria-hidden="true">📍</span>
                    <span>{address.address_line1}</span>
                  </div>
                  {address.address_line2 && (
                    <div className={styles.addressLine}>
                      <span className={styles.icon} aria-hidden="true" style={{ opacity: 0 }}>📍</span>
                      <span style={{ opacity: 0.8 }}>{address.address_line2}</span>
                    </div>
                  )}
                  <div className={styles.addressLine}>
                    <span className={styles.icon} aria-hidden="true" style={{ opacity: 0 }}>📍</span>
                    <span>{address.city}, {address.state} {address.postal_code}</span>
                  </div>
                  <div className={styles.addressLine}>
                    <span className={styles.icon} aria-hidden="true" style={{ opacity: 0 }}>📍</span>
                    <span>{address.country}</span>
                  </div>
                  
                  <div className={styles.phoneBox}>
                    <span className={styles.icon} aria-hidden="true">📞</span>
                    <span>{address.phone}</span>
                  </div>
                </div>
              </div>

              <div className={styles.addressActions}>
                <button 
                  className={styles.iconButton}
                  onClick={() => handleEdit(address)}
                  title="Edit Address"
                  aria-label={`Edit address for ${address.full_name}`}
                >
                  ✏️
                </button>
                {!address.is_default && (
                  <button 
                    className={styles.iconButton}
                    onClick={() => handleSetDefault(address.id)}
                    title="Set as Default"
                    aria-label={`Set ${address.full_name}'s address as primary`}
                  >
                    ⭐
                  </button>
                )}
                <button 
                  className={styles.iconButton}
                  onClick={() => handleDelete(address.id)}
                  title="Delete"
                  aria-label={`Delete address for ${address.full_name}`}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Address Form Modal */}
      {showModal && (
        <div className={styles.modal} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
              <button 
                className={styles.closeButton}
                onClick={() => setShowModal(false)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.modalBody} aria-label="Address Form">
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="full_name">Full Name *</label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                    className={styles.input}
                    placeholder="Enter full name"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className={styles.input}
                  />
                </div>

                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label htmlFor="address_line1">Address Line 1 *</label>
                  <input
                    type="text"
                    id="address_line1"
                    name="address_line1"
                    value={formData.address_line1}
                    onChange={handleChange}
                    required
                    className={styles.input}
                  />
                </div>

                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label htmlFor="address_line2">Address Line 2</label>
                  <input
                    type="text"
                    id="address_line2"
                    name="address_line2"
                    value={formData.address_line2}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="city">City *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="state">State *</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="postal_code">Postal Code *</label>
                  <input
                    type="text"
                    id="postal_code"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleChange}
                    required
                    pattern="[0-9]{6}"
                    className={styles.input}
                  />
                </div>

                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="is_default"
                      checked={formData.is_default}
                      onChange={handleChange}
                    />
                    Set as default address
                  </label>
                </div>
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.saveButton}>
                  {editingAddress ? 'Update Address' : 'Add Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
