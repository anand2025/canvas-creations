export const getStatusColorClasses = (status, variant = 'outline') => {
  const s = status?.toLowerCase() || '';
  
  if (variant === 'solid') {
    switch (s) {
      case 'pending': return 'bg-amber-500 text-white border-amber-600 shadow-[0_0_15px_rgba(245,158,11,0.4)]';
      case 'processing': return 'bg-vibrant-teal text-white border-vibrant-teal shadow-[0_0_15px_rgba(20,184,166,0.4)]';
      case 'shipped': return 'bg-vibrant-purple text-white border-vibrant-purple shadow-[0_0_15px_rgba(168,85,247,0.4)]';
      case 'delivered': return 'bg-emerald-500 text-white border-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.4)]';
      case 'cancelled': return 'bg-vibrant-pink text-white border-vibrant-pink shadow-[0_0_15px_rgba(255,0,127,0.4)]';
      default: return 'bg-gray-500 text-white border-gray-600';
    }
  }

  // Default: Outline variant
  switch (s) {
    case 'pending': return 'bg-amber-100/10 text-amber-500 border-amber-500/20';
    case 'processing': return 'bg-blue-100/10 text-blue-500 border-blue-500/20';
    case 'shipped': return 'bg-purple-100/10 text-purple-500 border-purple-500/20';
    case 'delivered': return 'bg-emerald-100/10 text-emerald-500 border-emerald-500/20';
    case 'cancelled': return 'bg-rose-100/10 text-rose-500 border-rose-500/20';
    default: return 'bg-secondary-bg text-foreground/70 border-[var(--border-color)]';
  }
};
