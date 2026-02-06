"use client";
import React, { useEffect, useState } from 'react';
import { adminApi } from '@/services/adminApi';
import StarRating from '@/components/reviews/StarRating';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [reviewsData, summariesData] = await Promise.all([
        adminApi.getReviews(),
        adminApi.getReviewsSummary()
      ]);
      setReviews(reviewsData);
      setSummaries(summariesData);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-[400px] flex items-center justify-center">
       <div className="w-12 h-12 border-4 border-vibrant-teal/20 border-t-vibrant-teal rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-10 py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-4xl font-black text-foreground uppercase tracking-tighter">Review Management</h1>
           <p className="text-foreground/50 font-bold uppercase tracking-widest text-xs">Monitor customer feedback and product ratings</p>
        </div>
      </div>

      {/* Review Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {summaries.map((summary) => (
              <div key={summary.painting_id} className="p-6 rounded-[32px] bg-card border border-[var(--border-color)] shadow-sm hover:shadow-xl transition-all group">
                  <h3 className="font-black text-lg mb-2 group-hover:text-vibrant-pink transition-colors line-clamp-1">{summary.title}</h3>
                  <div className="flex items-center gap-3 mb-4">
                      <StarRating rating={summary.avg_rating} readOnly size="sm" />
                      <span className="text-2xl font-black text-vibrant-teal">{summary.avg_rating}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-foreground/40">
                      <span>Total Reviews</span>
                      <span className="text-foreground">{summary.review_count}</span>
                  </div>
              </div>
          ))}
          {summaries.length === 0 && (
              <div className="col-span-full py-12 text-center bg-secondary-bg rounded-[32px] border border-dashed border-[var(--border-color)]">
                  <p className="text-foreground/40 font-bold uppercase tracking-widest text-sm">No rating summaries available.</p>
              </div>
          )}
      </div>

      {/* All Reviews Table */}
      <div className="space-y-4">
          <h2 className="text-2xl font-black uppercase tracking-tighter">All Recent Reviews</h2>
          <div className="bg-card rounded-[32px] shadow-sm border border-[var(--border-color)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead className="bg-secondary-bg border-b border-[var(--border-color)]">
                  <tr>
                    <th className="px-8 py-5 text-xs font-black text-foreground/40 uppercase tracking-widest">Product</th>
                    <th className="px-8 py-5 text-xs font-black text-foreground/40 uppercase tracking-widest">User</th>
                    <th className="px-8 py-5 text-xs font-black text-foreground/40 uppercase tracking-widest">Rating</th>
                    <th className="px-8 py-5 text-xs font-black text-foreground/40 uppercase tracking-widest">Comment</th>
                    <th className="px-8 py-5 text-xs font-black text-foreground/40 uppercase tracking-widest">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y border-[var(--border-color)]">
                  {reviews.map((review) => (
                    <tr key={review.id} className="hover:bg-vibrant-pink/5 transition-colors group">
                      <td className="px-8 py-5">
                          <span className="text-sm font-bold text-foreground group-hover:text-vibrant-pink transition-colors">
                              {review.painting_id ? review.painting_id.substring(0, 8) : 'N/A'}...
                          </span>
                      </td>
                      <td className="px-8 py-5">
                          <span className="font-black text-foreground uppercase text-xs tracking-tighter">
                              {review.user_name || 'Guest'}
                          </span>
                      </td>
                      <td className="px-8 py-5">
                          <StarRating rating={review.rating} readOnly size="sm" />
                      </td>
                      <td className="px-8 py-5 text-foreground/70 font-medium max-w-xs truncate italic">
                          &quot;{review.comment}&quot;
                      </td>
                      <td className="px-8 py-5 text-xs font-bold text-foreground/40 uppercase tracking-widest">
                          {review.created_at ? new Date(review.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                   {reviews.length === 0 && (
                    <tr>
                        <td colSpan="5" className="px-8 py-20 text-center text-gray-500">
                            No reviews yet.
                        </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
      </div>
    </div>
  );
}
