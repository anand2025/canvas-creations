'use client';

import { useState, useEffect } from 'react';
import { apiRequest } from '@/services/api';
import styles from './profile.module.css';

export default function ProfileStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await apiRequest('/profile/stats');
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.statsGrid}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={styles.statCard}>
            <div className={styles.skeleton}></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      label: 'Total Orders',
      value: stats.total_orders,
      icon: '📦',
      color: 'var(--vibrant-pink)',
    },
    {
      label: 'Total Spent',
      value: `₹${Math.round(stats.total_spent).toLocaleString()}`,
      icon: '💰',
      color: 'var(--vibrant-teal)',
    },
    {
      label: 'Items Purchased',
      value: stats.total_items_purchased,
      icon: '🎨',
      color: 'var(--vibrant-orange)',
    },
    {
      label: 'Member Since',
      value: new Date(stats.member_since).toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric' 
      }),
      icon: '⭐',
      color: 'var(--vibrant-purple)',
    },
  ];

  return (
    <div className={styles.statsGrid}>
      {statCards.map((stat, index) => (
        <div 
          key={index} 
          className={styles.statCard}
          style={{ '--stat-color': stat.color }}
        >
          <div className={styles.statIcon}>{stat.icon}</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stat.value}</div>
            <div className={styles.statLabel}>{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
