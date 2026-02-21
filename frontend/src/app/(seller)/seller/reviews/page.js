"use client";
import React from 'react';
import { api } from '@/services/api';
import ReviewsDashboard from '@/components/reviews/ReviewsDashboard';
import { useReviews } from '@/hooks/useReviews';

const fetchSellerReviews = () => api.get('/seller/reviews');
const fetchSellerReviewsSummary = () => api.get('/seller/reviews/summary');

export default function SellerReviewsPage() {

  const {
    reviews,
    summaries,
    loading
  } = useReviews(fetchSellerReviews, fetchSellerReviewsSummary);

  return (
    <ReviewsDashboard 
      reviews={reviews}
      summaries={summaries}
      loading={loading}
      title="My Product Reviews"
      subtitle="Track feedback and ratings for your published artworks"
    />
  );
}
