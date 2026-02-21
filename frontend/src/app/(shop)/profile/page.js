'use client';

import { useState, useEffect } from 'react';
import PersonalInfo from '@/components/profile/PersonalInfo';
import OrderHistory from '@/components/profile/OrderHistory';
import AddressBook from '@/components/profile/AddressBook';
import AccountSettings from '@/components/profile/AccountSettings';
import ProfileStats from '@/components/profile/ProfileStats';
import styles from '@/components/profile/profile.module.css';
import { getStatusColorClasses } from '@/utils/statusStyles';
import OrderDetailsModal from '@/components/ui/OrderDetailsModal';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('personal');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Body Scroll Lock
  useEffect(() => {
    if (selectedOrder) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedOrder]);


  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: '👤' },
    { id: 'orders', label: 'Order History', icon: '📦' },
    { id: 'addresses', label: 'Address Book', icon: '📍' },
    { id: 'settings', label: 'Account Settings', icon: '⚙️' },
  ];

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <h1>My Profile</h1>
        <p>Manage your account and preferences</p>
      </div>

      <ProfileStats />

      <div className={styles.profileContent}>
        {/* Sidebar Navigation */}
        <div className={styles.sidebar}>
          <nav className={styles.tabNav}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className={styles.tabIcon}>{tab.icon}</span>
                <span className={styles.tabLabel}>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className={styles.mainContent}>
          {activeTab === 'personal' && <PersonalInfo />}
          {activeTab === 'orders' && <OrderHistory onSelectOrder={setSelectedOrder} />}
          {activeTab === 'addresses' && <AddressBook />}
          {activeTab === 'settings' && <AccountSettings />}
        </div>
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal 
        order={selectedOrder} 
        isOpen={!!selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
      />
    </div>
  );
}
