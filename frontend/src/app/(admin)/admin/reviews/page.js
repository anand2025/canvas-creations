"use client";
import React, { useEffect, useState } from 'react';
import { adminApi } from '@/services/adminApi';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const data = await adminApi.getReviews();
      setReviews(data);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
      return [...Array(5)].map((_, i) => (
          <svg key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
      ));
  };

  if (loading) return <div className="p-8 text-center">Loading Reviews...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-black text-gray-900 dark:text-white">Reviews</h1>
           <p className="text-gray-500 dark:text-gray-400">See what customers are saying</p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
             <thead className="bg-gray-50 dark:bg-zinc-950/50 border-b dark:border-zinc-800">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Product ID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Comment</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
              {reviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono text-gray-500">
                      {review.painting_id ? review.painting_id.substring(0, 8) : 'N/A'}...
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {review.user_id ? review.user_id.substring(0, 8) : 'Guest'}
                  </td>
                  <td className="px-6 py-4">
                      <div className="flex">{renderStars(review.rating)}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300 max-w-xs truncate">
                      {review.comment}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                      {review.date ? new Date(review.date).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))}
               {reviews.length === 0 && (
                <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                        No reviews yet.
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
