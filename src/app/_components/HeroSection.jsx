<<<<<<< HEAD
// HeroSection.jsx
"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const HeroSection = ({ slides, currentSlide, goToSlide }) => {
  const [autoPlay, setAutoPlay] = useState(true);
=======

"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "../_services/adminApi";

const HeroSection = ({  currentSlide, goToSlide }) => {
  const [autoPlay, setAutoPlay] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState([]);


  const {
    data: slides = [],
    isLoading: categoriesLoading,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: ["home_slides"],
    queryFn: adminApi.home.getSlides,
  });
>>>>>>> 90741381b159bb0bbfef273258d16b906108584a

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % slides.length);
  }, [currentSlide, goToSlide, slides.length]);

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  }, [currentSlide, goToSlide, slides.length]);

<<<<<<< HEAD
=======
  const handleImageLoad = useCallback((index) => {
    setImagesLoaded(prev => [...prev, index]);
  }, []);

>>>>>>> 90741381b159bb0bbfef273258d16b906108584a
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

  // دالة للانتقال إلى قسم العروض الخاصة
  const scrollToOffer = (offerId) => {
    const offersSection = document.getElementById("special-offers");
    if (offersSection) {
      offersSection.scrollIntoView({ behavior: "smooth" });
      
      // بعد الانتقال، قم بتمييز العرض المحدد
      setTimeout(() => {
        const targetOffer = document.getElementById(`offer-${offerId}`);
        if (targetOffer) {
          targetOffer.scrollIntoView({ behavior: "smooth", block: "center" });
          
          // إضافة تأثير تمييز مؤقت
          targetOffer.classList.add('ring-2', 'ring-[#C49A6C]');
          setTimeout(() => {
            targetOffer.classList.remove('ring-2', 'ring-[#C49A6C]');
          }, 2000);
        }
      }, 800);
    }
  };

<<<<<<< HEAD
=======
  


>>>>>>> 90741381b159bb0bbfef273258d16b906108584a
  return (
    <section 
      className="h-[40vh] min-h-[300px] relative overflow-hidden mt-16"
      onMouseEnter={() => setAutoPlay(false)}
      onMouseLeave={() => setAutoPlay(true)}
    >
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
<<<<<<< HEAD
          <div
            key={slide.id}
            className={`absolute inset-0 ${slide.bgColor} flex items-center justify-center transition-opacity duration-500 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
=======
          <motion.div
            key={slide.id}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: index === currentSlide ? 1 : 0,
            }}
            transition={{ duration: 0.5 }}
            className={`absolute inset-0 ${slide.bgColor} flex items-center justify-center`}
>>>>>>> 90741381b159bb0bbfef273258d16b906108584a
          >
            {/* الصورة مع رابط يؤدي للعرض الخاص */}
            <Link 
              href="#special-offers" 
              className="absolute inset-0 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                if (slide.offerId) {
                  scrollToOffer(slide.offerId);
                } else {
                  const offersSection = document.getElementById("special-offers");
                  if (offersSection) {
                    offersSection.scrollIntoView({ behavior: "smooth" });
                  }
                }
              }}
            >
              <div className="absolute inset-0">
                <Image 
                  src={slide.image} 
                  alt={slide.title}
                  fill
                  className="object-cover"
<<<<<<< HEAD
                  priority={true}
                  loading='eager'
=======
                  priority={index === 0}
                  onLoad={() => handleImageLoad(index)}
  
>>>>>>> 90741381b159bb0bbfef273258d16b906108584a
                />
              </div>
            </Link>
            
            {/* Overlay للتدرج السلس */}
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/30 to-black/80"></div>
            
<<<<<<< HEAD
            {/* المحتوة مع النصوص فقط */}
            <div className="relative z-10 text-center px-4 max-w-4xl">
              <h1 className="text-xl md:text-2xl font-bold text-white mb-2 drop-shadow-lg cursor-pointer"
=======
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
                className="text-xl md:text-2xl font-bold text-white mb-2 drop-shadow-lg cursor-pointer"
>>>>>>> 90741381b159bb0bbfef273258d16b906108584a
                onClick={(e) => {
                  e.stopPropagation();
                  if (slide.offerId) {
                    scrollToOffer(slide.offerId);
                  } else {
                    const offersSection = document.getElementById("special-offers");
                    if (offersSection) {
                      offersSection.scrollIntoView({ behavior: "smooth" });
                    }
                  }
                }}
              >
                {slide.title}
<<<<<<< HEAD
              </h1>
              
              <h2 className="text-base md:text-lg text-white/95 mb-1.5 drop-shadow-md cursor-pointer"
=======
              </motion.h1>
              
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-base md:text-lg text-white/95 mb-1.5 drop-shadow-md cursor-pointer"
>>>>>>> 90741381b159bb0bbfef273258d16b906108584a
                onClick={(e) => {
                  e.stopPropagation();
                  if (slide.offerId) {
                    scrollToOffer(slide.offerId);
                  } else {
                    const offersSection = document.getElementById("special-offers");
                    if (offersSection) {
                      offersSection.scrollIntoView({ behavior: "smooth" });
                    }
                  }
                }}
              >
                {slide.subtitle}
<<<<<<< HEAD
              </h2>
              
              <p className="text-white/90 max-w-2xl mx-auto text-xs md:text-sm drop-shadow-md cursor-pointer"
=======
              </motion.h2>
              
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-white/90 max-w-2xl mx-auto text-xs md:text-sm drop-shadow-md cursor-pointer"
>>>>>>> 90741381b159bb0bbfef273258d16b906108584a
                onClick={(e) => {
                  e.stopPropagation();
                  if (slide.offerId) {
                    scrollToOffer(slide.offerId);
                  } else {
                    const offersSection = document.getElementById("special-offers");
                    if (offersSection) {
                      offersSection.scrollIntoView({ behavior: "smooth" });
                    }
                  }
                }}
              >
                {slide.description}
<<<<<<< HEAD
              </p>

              {/* زر اضافي للانتقال للعروض */}
              <div className="mt-4">
=======
              </motion.p>

              {/* زر اضافي للانتقال للعروض */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-4"
              >
>>>>>>> 90741381b159bb0bbfef273258d16b906108584a
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (slide.offerId) {
                      scrollToOffer(slide.offerId);
                    } else {
                      const offersSection = document.getElementById("special-offers");
                      if (offersSection) {
                        offersSection.scrollIntoView({ behavior: "smooth" });
                      }
                    }
                  }}
<<<<<<< HEAD
                  className="bg-[#C49A6C] text-black px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:bg-[#d4af7c]"
                >
                  {slide.offerId ? 'اطلب هذا العرض' : 'استعرض العروض'}
                </button>
              </div>
            </div>
          </div>
=======
                  className="bg-[#C49A6C] text-black px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                >
                  {slide.offerId ? 'اطلب هذا العرض' : 'استعرض العروض'}
                </button>
              </motion.div>
            </div>
          </motion.div>
>>>>>>> 90741381b159bb0bbfef273258d16b906108584a
        ))}
      </div>

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
<<<<<<< HEAD
=======

      {/* Loading State */}
      {imagesLoaded.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-30 bg-gray-900/30">
          <div className="text-white text-xs">جاري التحميل...</div>
        </div>
      )}
>>>>>>> 90741381b159bb0bbfef273258d16b906108584a
    </section>
  );
};

export default HeroSection;