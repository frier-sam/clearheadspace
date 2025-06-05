import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'medium', color = 'primary', message = '' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const colorClasses = {
    primary: 'border-primary-500',
    secondary: 'border-secondary-500',
    accent: 'border-accent-500',
    white: 'border-white'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        {/* Outer spinning ring */}
        <motion.div
          className={`${sizeClasses[size]} border-4 border-gray-200 rounded-full`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Inner spinning ring */}
        <motion.div
          className={`absolute inset-0 ${sizeClasses[size]} border-4 ${colorClasses[color]} rounded-full border-t-transparent`}
          animate={{ rotate: -360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Center dot */}
        <motion.div
          className={`absolute inset-0 m-auto ${size === 'small' ? 'w-2 h-2' : size === 'medium' ? 'w-3 h-3' : size === 'large' ? 'w-4 h-4' : 'w-6 h-6'} ${colorClasses[color].replace('border-', 'bg-')} rounded-full`}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </div>
      
      {message && (
        <motion.p
          className="text-gray-600 text-sm font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {message}
        </motion.p>
      )}
    </div>
  );
};

export default LoadingSpinner;
