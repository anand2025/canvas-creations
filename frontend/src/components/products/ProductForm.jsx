"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { uploadImage } from '@/services/api';

const ProductForm = ({ 
    initialData = null, 
    onSubmit, 
    onCancel,
    isLoading = false,
    title = "Product Form",
    subtitle = "Fill out the details below",
    submitLabel = "Save Product"
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
    artist: '',
    image_url: '',
    category: 'Abstract',
    dimensions: '12x12'
  });
  
  const [uploading, setUploading] = useState(false);
  const [customCategory, setCustomCategory] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        price: initialData.price || '',
        stock: initialData.stock || '',
        artist: initialData.artist || '',
        image_url: initialData.image_url || '',
        category: initialData.category || 'Abstract',
        dimensions: initialData.dimensions || '12x12'
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-foreground mb-2 uppercase tracking-tight">{title}</h1>
        <p className="text-foreground/50 font-medium tracking-tight">{subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 shadow-sm border border-[var(--border-color)] space-y-6 transition-colors duration-500">
        
        {/* Title & Artist */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Title <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              name="title" 
              value={formData.title} 
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-secondary-bg border-none focus:ring-1 focus:ring-vibrant-teal text-foreground transition-all placeholder:text-foreground/30 font-medium shadow-sm"
              placeholder="e.g. Neon Sunset"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Artist <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              name="artist" 
              value={formData.artist} 
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-secondary-bg border-none focus:ring-1 focus:ring-vibrant-teal text-foreground transition-all placeholder:text-foreground/30 font-medium shadow-sm"
              placeholder="e.g. Jane Doe"
              required
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Description</label>
          <textarea 
            name="description" 
            value={formData.description} 
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-3 rounded-xl bg-secondary-bg border-none focus:ring-1 focus:ring-vibrant-teal text-foreground transition-all placeholder:text-foreground/30 font-medium"
            placeholder="Tell us about the artwork..."
          ></textarea>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Price */}
           <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Price (₹) <span className="text-red-500">*</span></label>
            <input 
              type="number" 
              name="price" 
              value={formData.price} 
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-4 py-3 rounded-xl bg-secondary-bg border-none focus:ring-1 focus:ring-vibrant-teal text-foreground transition-all placeholder:text-foreground/30 font-medium shadow-sm"
              placeholder="0.00"
              required
            />
          </div>

          {/* Stock */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Stock <span className="text-red-500">*</span></label>
            <input 
              type="number" 
              name="stock" 
              value={formData.stock} 
              onChange={handleChange}
              min="0"
              step="1"
              className="w-full px-4 py-3 rounded-xl bg-secondary-bg border-none focus:ring-1 focus:ring-vibrant-teal text-foreground transition-all placeholder:text-foreground/30 font-medium shadow-sm"
              placeholder="1"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
               <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Category</label>
                  <button 
                      type="button" 
                      onClick={() => setCustomCategory(!customCategory)}
                      className="text-xs text-vibrant-teal hover:underline font-bold"
                  >
                      {customCategory ? 'Select Existing' : 'Add New'}
                  </button>
               </div>
               
               {customCategory ? (
                   <input 
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-secondary-bg border-none focus:ring-1 focus:ring-vibrant-teal text-foreground transition-all placeholder:text-foreground/30 font-medium shadow-sm"
                      placeholder="Enter new category"
                   />
               ) : (
                   <select 
                     name="category" 
                     value={formData.category} 
                     onChange={handleChange}
                     className="w-full px-4 py-3 rounded-xl bg-secondary-bg border-none focus:ring-1 focus:ring-vibrant-teal text-foreground transition-all appearance-none font-medium"
                   >
                      <option value="Abstract">Abstract</option>
                      <option value="Landscape">Landscape</option>
                      <option value="Portrait">Portrait</option>
                      <option value="Modern">Modern</option>
                      <option value="Nature">Nature</option>
                      <option value="Pop Art">Pop Art</option>
                   </select>
               )}
          </div>
        </div>

        {/* Image URL / Upload */}
        <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Image <span className="text-red-500">*</span></label>
            
            <div className="flex flex-col gap-4">
                {/* Upload Button */}
                <div className="flex items-center gap-4">
                    <label className="cursor-pointer bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-600 dark:text-gray-300 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                        {uploading ? 'Uploading...' : 'Upload Image'}
                        <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={async (e) => {
                                const file = e.target.files[0];
                                if (!file) return;
                                setUploading(true);
                                try {
                                    const res = await uploadImage(file);
                                    setFormData(prev => ({ ...prev, image_url: res.url }));
                                } catch (err) {
                                    alert('Upload failed');
                                } finally {
                                    setUploading(false);
                                }
                            }}
                        />
                    </label>
                    <span className="text-sm text-gray-500">OR</span>
                    <input 
                      type="url" 
                      name="image_url" 
                      value={formData.image_url} 
                      onChange={handleChange}
                      className="flex-1 px-4 py-2 rounded-lg bg-secondary-bg border-none focus:ring-1 focus:ring-vibrant-teal text-foreground transition-all placeholder:text-foreground/30 font-medium shadow-sm"
                      placeholder="Enter Image URL directly"
                    />
                </div>

                {formData.image_url && (
                    <div className="mt-4 relative h-48 w-full rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-800 border-2 border-dashed border-gray-200 dark:border-zinc-700">
                        <Image src={formData.image_url} alt="Preview" fill className="object-contain" />
                    </div>
                )}
            </div>
        </div>

        {/* Actions */}
        <div className="pt-4 flex items-center justify-end gap-4">
            <button 
              type="button"
              onClick={onCancel}
              className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isLoading || uploading}
              className={`px-8 py-3 rounded-xl font-bold text-white bg-vibrant-pink hover:bg-pink-600 transition-all shadow-lg shadow-pink-500/30 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Processing...' : submitLabel}
            </button>
        </div>

      </form>
    </div>
  );
};

export default ProductForm;
