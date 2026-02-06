"use client";
import React from 'react';
import StarRating from './StarRating';

const ReviewList = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="py-12 text-center bg-secondary-bg rounded-3xl border border-dashed border-[var(--border-color)]">
        <p className="text-foreground/40 font-bold uppercase tracking-widest text-sm">No reviews yet. Be the first to review!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="p-6 rounded-3xl bg-secondary-bg border border-[var(--border-color)] transition-all hover:shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="font-black text-lg">{review.user_name}</h4>
              <div className="mt-1">
                <StarRating rating={review.rating} readOnly size="sm" />
              </div>
            </div>
            <span className="text-xs font-bold text-foreground/40 uppercase tracking-widest">
              {new Date(review.created_at).toLocaleDateString()}
            </span>
          </div>
          <p className="text-foreground/80 leading-relaxed italic">
            &quot;{review.comment}&quot;
          </p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
