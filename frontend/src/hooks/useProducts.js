import { useState, useCallback, useEffect } from 'react';

export const useProducts = (fetchFn) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchFn();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const deleteProduct = async (id, deleteFn) => {
    if (!window.confirm("Are you sure you want to delete this painting?")) return false;
    try {
      await deleteFn(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (error) {
      console.error("Failed to delete product", error);
      return false;
    }
  };

  const toggleBestseller = async (id, currentStatus, toggleFn) => {
    try {
        await toggleFn(id, currentStatus);
        setProducts(prev => prev.map(p => 
            p.id === id ? { ...p, is_bestseller: currentStatus } : p
        ));
        return true;
    } catch (error) {
        console.error("Failed to toggle bestseller", error);
        return false;
    }
  };

  return {
    products,
    setProducts,
    loading,
    deleteProduct,
    toggleBestseller,
    refreshProducts: fetchProducts
  };
};
