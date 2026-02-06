"use client";
import React, { useState } from 'react';
import StarRating from './StarRating';
import { apiRequest } from '@/services/api';
import { toast } from 'react-hot-toast';

const ReviewForm = ({ paintingId, onReviewSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiRequest('/reviews', {
        method: 'POST',
        body: JSON.stringify({
          painting_id: paintingId,
          rating,
          comment,
          user_id: "placeholder", // Backend handles this from Auth
          user_name: "placeholder" // Backend handles this from Auth
        })
      });

      toast.success("Review submitted successfully!");
      setRating(0);
      setComment('');
      if (onReviewSubmit) onReviewSubmit(response);
    } catch (error) {
      console.error("Failed to submit review:", error);
      toast.error(error.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-secondary-bg border border-[var(--border-color)] shadow-xl">
      <h3 className="text-xl font-black mb-4 uppercase tracking-tighter">Write a Review</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-foreground/40 mb-2">Rating</label>
          <StarRating rating={rating} setRating={setRating} />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-foreground/40 mb-2">Your Comment</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-4 rounded-2xl bg-background border border-[var(--border-color)] focus:border-vibrant-teal outline-none min-h-[100px] transition-all"
            placeholder="What do you think about this painting?"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 rounded-2xl bg-foreground text-background font-black uppercase tracking-tighter hover:bg-vibrant-teal hover:text-white transition-all transform active:scale-[0.98] disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
