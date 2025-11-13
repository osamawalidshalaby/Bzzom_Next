"use client";
import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const HeroSection = ({ slides, currentSlide, goToSlide, scrollToOffers }) => {
  const x = useMotionValue(0);
  const backgroundX = useTransform(x, [-100, 0, 100], [50, 0, -50]);

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  };

  const handleDragEnd = (event, info) => {
    const threshold = 50;
    
    if (info.offset.x < -threshold) {
      nextSlide();
    } else if (info.offset.x > threshold) {
      prevSlide();
    }
  };

  return (
    <section className="h-screen relative overflow-hidden">
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
              scale: index === currentSlide ? 1 : 1.1
            }}
            transition={{ duration: 0.8 }}
            className={`absolute inset-0 bg-linear-to-r ${slide.bgColor} flex items-center justify-center`}
            style={{ x: backgroundX }}
          >
            <div className="absolute inset-0 opacity-20">
              <Image 
                src={slide.image} 
                alt={slide.title}
                fill
                className="w-full h-full object-cover" 
              />
            </div>
            
            <div className="relative z-10 text-center px-4 w-full max-w-4xl">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-4 flex justify-center"
              >
                <Image 
                  src="/logo.png"
                  alt="Bazzom Logo"
                  width={96}
                  height={96}
                  className="h-16 md:h-24 w-auto object-contain" 
                />
              </motion.div>
              
              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-3xl md:text-5xl font-bold text-white mb-3 leading-tight" 
              >
                {slide.title}
              </motion.h1>
              
              <motion.h2
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xl md:text-3xl text-white/90 mb-3 leading-tight" 
              >
                {slide.subtitle}
              </motion.h2>
              
              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-base md:text-lg text-white/80 mb-6 max-w-2xl mx-auto leading-relaxed" 
              >
                {slide.description}
              </motion.p>
              
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-3 justify-center items-center" 
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={scrollToOffers}
                  className="bg-white text-black px-6 py-3 rounded-lg text-base font-semibold hover:bg-gray-100 transition-all shadow-lg min-w-[140px]" 
                >
                  {slide.buttonText}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white text-white px-6 py-3 rounded-lg text-base font-semibold hover:bg-white hover:text-black transition-all min-w-[140px]" 
                >
                  <Link href="/about" className="block w-full">تعرف علينا</Link>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Navigation Arrows */}
      <div className="hidden md:flex absolute inset-y-0 left-0 right-0 items-center justify-between px-6 z-20">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={prevSlide}
          className="bg-black/50 text-white p-3 rounded-full backdrop-blur-sm hover:bg-black/70 transition-all"
        >
          <ChevronRight size={28} />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={nextSlide}
          className="bg-black/50 text-white p-3 rounded-full backdrop-blur-sm hover:bg-black/70 transition-all"
        >
          <ChevronLeft size={28} />
        </motion.button>
      </div>

      {/* Swipe Indicator */}
      <motion.div 
        className="md:hidden absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-2 bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <ChevronLeft size={16} className="text-white/70" />
        <span className="text-white/70 text-sm">اسحب للتغيير</span>
        <ChevronRight size={16} className="text-white/70" />
      </motion.div>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-20"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#C49A6C] text-black px-6 py-3 rounded-lg text-base font-semibold hover:bg-[#B08A5C] transition-all shadow-lg"
        >
          <Link href="/menu" className="block w-full">اكتشف القائمة</Link>
        </motion.button>
      </motion.div>
    </section>
  );
};

export default HeroSection;