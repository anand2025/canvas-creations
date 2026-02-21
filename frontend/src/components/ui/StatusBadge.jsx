"use client";
import React from 'react';
import { getStatusColorClasses } from '@/utils/statusStyles';

const StatusBadge = ({ status, variant = 'outline' }) => {
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${getStatusColorClasses(status, variant)}`}>
      {status || 'Unknown'}
    </span>
  );
};

export default StatusBadge;
