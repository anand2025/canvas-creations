"use client";
import React, { useState, useEffect } from 'react';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import { apiRequest } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

const ReviewSection = ({ paintingId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canReview, setCanReview] = useState(false);
  const [checkingEligibility, setCheckingEligibility] = useState(false);
  const { user } = useAuth();

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await apiRequest(`/paintings/${paintingId}/reviews`);
      setReviews(data);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkEligibility = async () => {
    if (!user) return;
    try {
      setCheckingEligibility(true);
      const data = await apiRequest(`/paintings/${paintingId}/can-review`);
      setCanReview(data.can_review);
    } catch (error) {
      console.error("Failed to check review eligibility:", error);
    } finally {
      setCheckingEligibility(false);
    }
  };

  useEffect(() => {
    if (paintingId) {
      fetchReviews();
    }
  }, [paintingId]);

  useEffect(() => {
    if (paintingId && user) {
      checkEligibility();
    }
  }, [paintingId, user]);

  const handleReviewSubmit = (newReview) => {
    setReviews([newReview, ...reviews]);
    setCanReview(false); // Disable form after submission (duplicate check)
  };

  return (
    <div className="mt-20 border-t border-[var(--border-color)] pt-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 md:gap-20">
        <div className="lg:col-span-1">
          <div className="sticky top-10">
            <h2 className="text-3xl font-black mb-8 uppercase tracking-tighter">Customer Reviews</h2>
            {user ? (
              checkingEligibility ? (
                <div className="p-8 text-center animate-pulse bg-secondary-bg rounded-3xl border border-[var(--border-color)]">
                  <span className="text-xs font-bold uppercase tracking-widest opacity-40">Verifying Purchase...</span>
                </div>
              ) : canReview ? (
                <ReviewForm paintingId={paintingId} onReviewSubmit={handleReviewSubmit} />
              ) : (
                <div className="p-8 rounded-3xl bg-secondary-bg border border-[var(--border-color)] text-center">
                  <p className="font-bold text-foreground/40 text-sm">Only verified buyers can leave a review. Purchase this product to share your feedback!</p>
                </div>
              )
            ) : (
              <div className="p-8 rounded-3xl bg-vibrant-pink/5 border border-vibrant-pink/20 text-center">
                <p className="font-bold text-foreground/60 mb-4 text-sm">You must be logged in to write a review.</p>
                <a href="/login" className="px-6 py-2 rounded-full bg-vibrant-pink text-white font-black uppercase text-xs tracking-widest hover:shadow-lg transition-all inline-block">Login Now</a>
              </div>
            )}
          </div>
        </div>
        <div className="lg:col-span-2">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-vibrant-teal/20 border-t-vibrant-teal rounded-full animate-spin"></div>
            </div>
          ) : (
            <ReviewList reviews={reviews} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;
