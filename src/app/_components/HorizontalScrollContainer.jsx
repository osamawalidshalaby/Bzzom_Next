"use client";
import React, { use, useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import { ChevronLeft } from 'lucide-react';
const HorizontalScrollContainer = ({ children, className = '' }) => {
  function scrollLeft() {
    if (div.current) {
      div.current.scrollBy({
        left: -500,
        behavior: 'smooth'
      });
    }
  }

  function scrollRight() {
    if (div.current) {
      div.current.scrollBy({
        left: 500,
        behavior: 'smooth'
      });
    }
  }

  const div = useRef(null);
  return (
    <div className="relative flex flex-row justify-between items-center container mx-auto">
      <button onClick={scrollRight} className=' hidden lg:block rounded-full ml-[-60px] bg-[#C49A6C]/40 backdrop-blur-sm hover:bg-[#C49A6C]/50 transition z-1 border border-[#C49A6C] cursor-pointer p-2.5'><ChevronRight/></button>
      <div ref={div}
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
      <button onClick={scrollLeft} className=' hidden lg:block rounded-full mr-[-60px] bg-[#C49A6C]/40 backdrop-blur-sm hover:bg-[#C49A6C]/50 z-1 cursor-pointer border border-[#C49A6C] p-2.5'><ChevronLeft/></button>
    </div>
  );
};

export default HorizontalScrollContainer;


// "use client";
// import React from 'react';
// import { motion } from 'framer-motion';

// const HorizontalScrollContainer = ({ children, className = '' }) => {
//   return (
//     <div className="relative">
//       <div 
//         className={`flex overflow-x-auto  pb-4 gap-4 md:gap-6  ${className}`}
//         style={{ scrollbarWidth: "auto", scrollbarColor: '#C49A6C transparent' }}
//       >
//         {children}
//       </div>
//     </div>
//   );
// };

// export default HorizontalScrollContainer;