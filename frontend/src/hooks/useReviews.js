import { useState, useCallback, useEffect } from 'react';

export const useReviews = (fetchReviewsFn, fetchSummaryFn) => {
  const [reviews, setReviews] = useState([]);
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [reviewsData, summariesData] = await Promise.all([
        fetchReviewsFn(),
        fetchSummaryFn()
      ]);
      setReviews(reviewsData || []);
      setSummaries(summariesData || []);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    } finally {
      setLoading(false);
    }
  }, [fetchReviewsFn, fetchSummaryFn]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    reviews,
    summaries,
    loading,
    refreshReviews: fetchData
  };
};
