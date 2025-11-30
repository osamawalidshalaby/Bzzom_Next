"use client";
import React from 'react';
import { motion } from 'framer-motion';

const HorizontalScrollContainer = ({ children, className = '' }) => {
  return (
    <div className="relative">
      <div 
        className={`flex overflow-x-auto pb-4 gap-4 md:gap-6 scrollbar-hide ${className}`}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>
          {`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>
        {children}
      </div>
    </div>
  );
};

export default HorizontalScrollContainer;