import React from 'react';

interface LoadingSpinnerProps {
  size?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'h-10 w-10' }) => {
  return (
    <div className={`animate-spin rounded-full ${size} border-t-2 border-b-2 border-[#EF4444]`}></div>
  );
};

export default LoadingSpinner;
