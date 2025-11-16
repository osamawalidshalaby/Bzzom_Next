

// "use client";
// import React, { useState, useEffect } from 'react';
// import { motion, useMotionValue, useTransform } from 'framer-motion';
// import Link from 'next/link';
// import { ChevronLeft, ChevronRight } from 'lucide-react';
// import Image from 'next/image';

// const HeroSection = ({ slides, currentSlide, goToSlide, scrollToOffers }) => {
//   const x = useMotionValue(0);
//   const backgroundX = useTransform(x, [-100, 0, 100], [50, 0, -50]);
//   const [autoPlay, setAutoPlay] = useState(true);
//   const [imagesLoaded, setImagesLoaded] = useState([]);
//   const [imageErrors, setImageErrors] = useState({});

//   // Auto-play functionality
  

//   const nextSlide = () => {
//     goToSlide((currentSlide + 1) % slides.length);
//   };

//   const prevSlide = () => {
//     goToSlide((currentSlide - 1 + slides.length) % slides.length);
//   };

//   const handleDragEnd = (event, info) => {
//     const threshold = 50;
    
//     if (info.offset.x < -threshold) {
//       nextSlide();
//     } else if (info.offset.x > threshold) {
//       prevSlide();
//     }
//   };

//   const handleImageLoad = (index) => {
//     setImagesLoaded(prev => [...prev, index]);
//   };

//   const handleImageError = (index) => {
//     setImageErrors(prev => ({
//       ...prev,
//       [index]: true
//     }));
//   };

//   useEffect(() => {
//     if (!autoPlay) return;
    
//     const interval = setInterval(() => {
//       nextSlide();
//     }, 5000);
    
//     return () => clearInterval(interval);
//   }, [autoPlay, currentSlide]);

//   // Keyboard navigation
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.key === 'ArrowLeft') nextSlide();
//       if (e.key === 'ArrowRight') prevSlide();
//     };

//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, [currentSlide]);

//   return (
//     <section 
//       className="h-screen relative overflow-hidden"
//       onMouseEnter={() => setAutoPlay(false)}
//       onMouseLeave={() => setAutoPlay(true)}
//       onFocus={() => setAutoPlay(false)}
//       onBlur={() => setAutoPlay(true)}
//     >
//       <motion.div 
//         className="relative w-full h-full"
//         drag="x"
//         dragConstraints={{ left: 0, right: 0 }}
//         onDragEnd={handleDragEnd}
//         style={{ x, cursor: 'grab' }}
//       >
//         {slides.map((slide, index) => (
//           <motion.div
//             key={slide.id}
//             initial={{ opacity: 0 }}
//             animate={{ 
//               opacity: index === currentSlide ? 1 : 0,
//               scale: index === currentSlide ? 1 : 1.1
//             }}
//             transition={{ duration: 0.8 }}
//             className={`absolute inset-0 bg-linear-to-r ${slide.bgColor} flex items-center justify-center`}
//             style={{ x: backgroundX }}
//           >
//             <div className="absolute inset-0 opacity-20">
//               {!imageErrors[index] ? (
//                 <Image 
//                   src={slide.image} 
//                   alt={slide.title}
//                   fill
//                   className="w-full h-full object-cover"
//                   priority={index === 0}
//                   onLoad={() => handleImageLoad(index)}
//                   onError={() => handleImageError(index)}
//                 />
//               ) : (
//                 <div className="w-full h-full bg-gray-300 flex items-center justify-center">
//                   <span className="text-gray-500">Failed to load image</span>
//                 </div>
//               )}
//             </div>
            
//             <div className="relative z-10 text-center px-4 w-full max-w-4xl">
//               <motion.div
//                 initial={{ y: 30, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.2 }}
//                 className="mb-4 flex justify-center"
//               >
//                 <Image 
//                   src="/logo.png"
//                   alt="Bazzom Logo"
//                   width={96}
//                   height={96}
//                   className="h-16 md:h-24 w-auto object-contain"
//                   priority
//                 />
//               </motion.div>
              
//               <motion.h1
//                 initial={{ y: 30, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.4 }}
//                 className="text-3xl md:text-5xl font-bold text-white mb-3 leading-tight" 
//               >
//                 {slide.title}
//               </motion.h1>
              
//               <motion.h2
//                 initial={{ y: 30, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.5 }}
//                 className="text-xl md:text-3xl text-white/90 mb-3 leading-tight" 
//               >
//                 {slide.subtitle}
//               </motion.h2>
              
//               <motion.p
//                 initial={{ y: 30, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.6 }}
//                 className="text-base md:text-lg text-white/80 mb-6 max-w-2xl mx-auto leading-relaxed" 
//               >
//                 {slide.description}
//               </motion.p>
              
//               <motion.div
//                 initial={{ y: 30, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.8 }}
//                 className="flex flex-col sm:flex-row gap-3 justify-center items-center" 
//               >
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={scrollToOffers}
//                   className="bg-white text-black px-6 py-3 rounded-lg text-base font-semibold hover:bg-gray-100 transition-all shadow-lg min-w-[140px]"
//                   aria-label="View offers" 
//                 >
//                   {slide.buttonText}
//                 </motion.button>
                
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="border-2 border-white text-white px-6 py-3 rounded-lg text-base font-semibold hover:bg-white hover:text-black transition-all min-w-[140px]"
//                   aria-label="Learn more about us"
//                 >
//                   <Link href="/about" className="block w-full">تعرف علينا</Link>
//                 </motion.button>
//               </motion.div>
//             </div>
//           </motion.div>
//         ))}
//       </motion.div>

      

//       {/* Slide Indicators */}
//       <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
//         {slides.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => goToSlide(index)}
//             className={`w-2 h-2 rounded-full transition-all ${
//               index === currentSlide ? 'bg-white' : 'bg-white/50'
//             }`}
//             aria-label={`Go to slide ${index + 1}`}
//             aria-current={index === currentSlide}
//           />
//         ))}
//       </div>

//       {/* Discover Menu Button */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 1 }}
//         className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-20"
//       >
//         <motion.button
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           className="bg-[#C49A6C] text-black px-6 py-3 rounded-lg text-base font-semibold hover:bg-[#B08A5C] transition-all shadow-lg"
//           aria-label="Discover menu"
//         >
//           <Link href="/menu" className="block w-full">اكتشف القائمة</Link>
//         </motion.button>
//       </motion.div>

//       {/* Loading State */}
//       {imagesLoaded.length === 0 && (
//         <div className="absolute inset-0 flex items-center justify-center z-30">
//           <div className="text-white text-lg">جاري التحميل...</div>
//         </div>
//       )}
//     </section>
//   );
// };

// export default HeroSection;

// "use client";
// import React, { useState, useEffect, useCallback } from 'react';
// import { motion, useMotionValue, useTransform } from 'framer-motion';
// import { ChevronLeft, ChevronRight } from 'lucide-react';
// import Image from 'next/image';

// const HeroSection = ({ slides, currentSlide, goToSlide }) => {
//   const x = useMotionValue(0);
//   const backgroundX = useTransform(x, [-100, 0, 100], [50, 0, -50]);
//   const [autoPlay, setAutoPlay] = useState(true);
//   const [imagesLoaded, setImagesLoaded] = useState([]);

//   const nextSlide = useCallback(() => {
//     goToSlide((currentSlide + 1) % slides.length);
//   }, [currentSlide, goToSlide, slides.length]);

//   const prevSlide = useCallback(() => {
//     goToSlide((currentSlide - 1 + slides.length) % slides.length);
//   }, [currentSlide, goToSlide, slides.length]);

//   const handleDragEnd = (event, info) => {
//     const threshold = 50;
    
//     if (info.offset.x < -threshold) {
//       nextSlide();
//     } else if (info.offset.x > threshold) {
//       prevSlide();
//     }
//   };

//   const handleImageLoad = useCallback((index) => {
//     setImagesLoaded(prev => [...prev, index]);
//   }, []);

//   useEffect(() => {
//     if (!autoPlay) return;
    
//     const interval = setInterval(() => {
//       nextSlide();
//     }, 5000);
    
//     return () => clearInterval(interval);
//   }, [autoPlay, nextSlide]);

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.key === 'ArrowLeft') prevSlide();
//       if (e.key === 'ArrowRight') nextSlide();
//     };

//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, [nextSlide, prevSlide]);

//   return (
//     <section 
//       className="h-[33vh] min-h-[250px] relative overflow-hidden"
//       onMouseEnter={() => setAutoPlay(false)}
//       onMouseLeave={() => setAutoPlay(true)}
//     >
//       <motion.div 
//         className="relative w-full h-full"
//         drag="x"
//         dragConstraints={{ left: 0, right: 0 }}
//         onDragEnd={handleDragEnd}
//         style={{ x, cursor: 'grab' }}
//       >
//         {slides.map((slide, index) => (
//           <motion.div
//             key={slide.id}
//             initial={{ opacity: 0 }}
//             animate={{ 
//               opacity: index === currentSlide ? 1 : 0,
//             }}
//             transition={{ duration: 0.5 }}
//             className={`absolute inset-0 ${slide.bgColor} flex items-center justify-center`}
//             style={{ x: backgroundX }}
//           >
//             {/* الصورة بدون opacity - واضحة تماماً */}
//             <div className="absolute inset-0">
//               <Image 
//                 src={slide.image} 
//                 alt={slide.title}
//                 fill
//                 className="object-cover"
//                 priority={index === 0}
//                 onLoad={() => handleImageLoad(index)}
//               />
//             </div>
            
//             {/* Overlay خفيف جداً لتحسين قراءة النص */}
//             <div className="absolute inset-0 bg-black/20"></div>
            
//             {/* المحتوى مع النصوص فقط */}
//             <div className="relative z-10 text-center px-4 max-w-4xl">
//               <motion.div
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.2 }}
//                 className="mb-4"
//               >
//               </motion.div>
              
//               <motion.h1
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.3 }}
//                 className="text-2xl md:text-3xl font-bold text-white mb-2" 
//               >
//                 {slide.title}
//               </motion.h1>
              
//               <motion.h2
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.4 }}
//                 className="text-lg md:text-xl text-white/95 mb-2" 
//               >
//                 {slide.subtitle}
//               </motion.h2>
              
//               <motion.p
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.5 }}
//                 className="text-white/90 max-w-2xl mx-auto text-sm md:text-base" 
//               >
//                 {slide.description}
//               </motion.p>
//             </div>
//           </motion.div>
//         ))}
//       </motion.div>

//       {/* Navigation Arrows */}
//       <button
//         onClick={prevSlide}
//         className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-1 rounded-full transition-colors z-20"
//         aria-label="Previous slide"
//       >
//         <ChevronLeft size={16} />
//       </button>
      
//       <button
//         onClick={nextSlide}
//         className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-1 rounded-full transition-colors z-20"
//         aria-label="Next slide"
//       >
//         <ChevronRight size={16} />
//       </button>

//       {/* Slide Indicators */}
//       <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1 z-20">
//         {slides.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => goToSlide(index)}
//             className={`w-1.5 h-1.5 rounded-full transition-colors ${
//               index === currentSlide ? 'bg-white' : 'bg-white/50'
//             }`}
//             aria-label={`Go to slide ${index + 1}`}
//           />
//         ))}
//       </div>

//       {/* Loading State */}
//       {imagesLoaded.length === 0 && (
//         <div className="absolute inset-0 flex items-center justify-center z-30 bg-gray-900/30">
//           <div className="text-white text-xs">جاري التحميل...</div>
//         </div>
//       )}
//     </section>
//   );
// };

// export default HeroSection;

"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const HeroSection = ({ slides, currentSlide, goToSlide }) => {
  const x = useMotionValue(0);
  const backgroundX = useTransform(x, [-100, 0, 100], [50, 0, -50]);
  const [autoPlay, setAutoPlay] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState([]);

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % slides.length);
  }, [currentSlide, goToSlide, slides.length]);

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  }, [currentSlide, goToSlide, slides.length]);

  const handleDragEnd = (event, info) => {
    const threshold = 50;
    
    if (info.offset.x < -threshold) {
      nextSlide();
    } else if (info.offset.x > threshold) {
      prevSlide();
    }
  };

  const handleImageLoad = useCallback((index) => {
    setImagesLoaded(prev => [...prev, index]);
  }, []);

  useEffect(() => {
    if (!autoPlay) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [autoPlay, nextSlide]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  return (
    <section 
      className="h-[40vh] min-h-[300px] relative overflow-hidden"
      onMouseEnter={() => setAutoPlay(false)}
      onMouseLeave={() => setAutoPlay(true)}
    >
      <motion.div 
        className="relative w-full h-full"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        style={{ x, cursor: 'grab' }}
      >
        {slides.map((slide, index) => (
          <motion.div
            key={slide.id}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: index === currentSlide ? 1 : 0,
            }}
            transition={{ duration: 0.5 }}
            className={`absolute inset-0 ${slide.bgColor} flex items-center justify-center`}
            style={{ x: backgroundX }}
          >
            {/* الصورة بدون opacity - واضحة تماماً */}
            <div className="absolute inset-0">
              <Image 
                src={slide.image} 
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
                onLoad={() => handleImageLoad(index)}
              />
            </div>
            
            {/* Overlay للتدرج السلس */}
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/30 to-black/80"></div>
            
            {/* المحتوى مع النصوص فقط */}
            <div className="relative z-10 text-center px-4 max-w-4xl">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-4"
              >
              </motion.div>
              
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xl md:text-2xl font-bold text-white mb-2 drop-shadow-lg" 
              >
                {slide.title}
              </motion.h1>
              
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-base md:text-lg text-white/95 mb-1.5 drop-shadow-md" 
              >
                {slide.subtitle}
              </motion.h2>
              
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-white/90 max-w-2xl mx-auto text-xs md:text-sm drop-shadow-md" 
              >
                {slide.description}
              </motion.p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-[#C49A6C]/20 hover:bg-[#C49A6C]/40 backdrop-blur-sm text-white p-1.5 rounded-full transition-all z-20 border border-[#C49A6C]/30"
        aria-label="Previous slide"
      >
        <ChevronLeft size={18} />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#C49A6C]/20 hover:bg-[#C49A6C]/40 backdrop-blur-sm text-white p-1.5 rounded-full transition-all z-20 border border-[#C49A6C]/30"
        aria-label="Next slide"
      >
        <ChevronRight size={18} />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1.5 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide 
                ? 'bg-[#C49A6C] w-6' 
                : 'bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Loading State */}
      {imagesLoaded.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-30 bg-gray-900/30">
          <div className="text-white text-xs">جاري التحميل...</div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;