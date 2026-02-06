"use client";
import React from 'react';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Are you sure?", 
  message = "This action cannot be undone.", 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  type = "danger" // danger, warning, info
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger': return 'bg-vibrant-pink shadow-[0_0_20px_rgba(255,0,127,0.3)]';
      case 'warning': return 'bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]';
      default: return 'bg-vibrant-teal shadow-[0_0_20px_rgba(20,184,166,0.3)]';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'danger': return '⚠️';
      case 'warning': return '🔔';
      default: return 'ℹ️';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/60 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-card border border-[var(--border-color)] rounded-[2.5rem] shadow-2xl p-8 animate-in fade-in zoom-in duration-300">
        <div className="text-center space-y-6">
          {/* Icon/Visual */}
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-3xl mb-4 ${getTypeStyles()}`}>
            {getIcon()}
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black uppercase tracking-tighter text-foreground">
              {title}
            </h2>
            <p className="text-foreground/60 font-medium leading-relaxed">
              {message}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <button 
              onClick={onClose}
              className="px-6 py-3.5 rounded-full bg-secondary-bg hover:bg-secondary-hover border border-[var(--border-color)] font-black uppercase text-xs tracking-widest transition-all"
            >
              {cancelText}
            </button>
            <button 
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`px-6 py-3.5 rounded-full text-white font-black uppercase text-xs tracking-widest transition-all transform hover:scale-105 active:scale-95 ${getTypeStyles()}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
