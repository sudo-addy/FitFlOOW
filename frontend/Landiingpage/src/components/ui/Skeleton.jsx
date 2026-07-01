import React from 'react';
import './Skeleton.css';

export default function Skeleton({ width = '100%', height = '1.25rem', borderRadius = '4px', className = '' }) {
  return (
    <div 
      className={`shimmer-skeleton ${className}`}
      style={{
        width,
        height,
        borderRadius,
      }}
      aria-hidden="true"
    />
  );
}
