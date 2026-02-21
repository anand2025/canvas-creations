"use client";
import React from 'react';
import { adminApi } from '@/services/adminApi';
import ReviewsDashboard from '@/components/reviews/ReviewsDashboard';
import { useReviews } from '@/hooks/useReviews';

export default function AdminReviews() {
  const {
    reviews,
    summaries,
    loading
  } = useReviews(adminApi.getReviews, adminApi.getReviewsSummary);

  return (
    <ReviewsDashboard 
      reviews={reviews}
      summaries={summaries}
      loading={loading}
      title="Global Review Management"
      subtitle="Monitor all customer feedback and product ratings across the platform"
    />
  );
}
