"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { settingsService } from '../_services/settings.service';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const RestaurantGallery = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  // Fetch gallery images from database
  const { data: photos = [], isLoading } = useQuery({
    queryKey: ['restaurant-gallery'],
    queryFn: () => settingsService.getGalleryImages(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  // Show loading state
  if (isLoading) {
    return (
      <section className="py-8 md:py-10 px-4 bg-linear-to-b from-zinc-900 to-black w-full relative">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center text-white/60">جاري تحميل المعرض...</div>
        </div>
      </section>
    );
  }

  // Show empty state for customers
  if (photos.length === 0) {
    return (
      <section className="py-8 md:py-10 px-4 bg-linear-to-b from-zinc-900 to-black w-full relative">
        <div className="max-w-7xl mx-auto w-full">
          <h2 className="text-3xl md:text-5xl font-bold text-[#C49A6C] mb-4 text-center">معرض المطعم</h2>
          <p className="text-lg md:text-xl text-white/60 text-center">سيتم إضافة صور المعرض قريباً</p>
        </div>
      </section>
    );
  }

  const nextImage = () => {
    setSelectedImageIndex((prev) =>
      prev === null ? 0 : (prev + 1) % photos.length
    );
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) =>
      prev === null ? photos.length - 1 : (prev - 1 + photos.length) % photos.length
    );
  };
  return (
    <section className="py-8 md:py-10 px-4 bg-linear-to-b from-zinc-900 to-black w-full relative">
      <div className="max-w-7xl mx-auto w-full">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold text-[#C49A6C] mb-4 text-center wrap-break-word"
        >
          معرض المطعم
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-white/60 mb-8 md:mb-12 text-center wrap-break-word"
        >
          تعرف على أجواء مطعمنا الاستثنائية
        </motion.p>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 w-full mb-8">
          {photos.slice(0, 6).map((photo, idx) => (
            <motion.button
              key={photo.id}
              onClick={() => setSelectedImageIndex(idx)}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="rounded-xl overflow-hidden h-32 md:h-48 lg:h-64 group cursor-pointer w-full relative"
            >
              <img 
                src={photo.image_url} 
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              {/* No title overlay as requested */}
            </motion.button>
          ))}
        </div>

        {/* View All Button */}
        {photos.length > 6 && (
          <div className="text-center">
            <button
              onClick={() => setSelectedImageIndex(0)}
              className="px-8 py-3 bg-[#C49A6C] hover:bg-[#B8895A] text-black font-bold rounded-lg transition-colors"
            >
              عرض الكل ({photos.length} صورة)
            </button>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          {/* Close Button */}
          <button
            onClick={() => setSelectedImageIndex(null)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Navigation Buttons */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          {/* Image Container */}
          <div className="relative w-full max-w-4xl max-h-[80vh] flex flex-col">
            <img
              src={photos[selectedImageIndex].image_url}
              alt={photos[selectedImageIndex].title}
              className="w-full h-full object-contain rounded-lg"
            />

            {/* Only show index/count, no title */}
            <div className="mt-4 text-center">
              <p className="text-white/70 text-sm">
                {selectedImageIndex + 1} من {photos.length}
              </p>
            </div>

            {/* Thumbnail Navigation */}
            <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
              {photos.map((photo, index) => (
                <button
                  key={photo.id}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    index === selectedImageIndex
                      ? "border-[#C49A6C]"
                      : "border-white/20 hover:border-white/40"
                  }`}
                >
                  <img
                    src={photo.image_url}
                    alt={photo.title}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Gradient to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-16 md:h-20 bg-gradient-to-b from-transparent to-black pointer-events-none"></div>
    </section>
  );
};

export default RestaurantGallery;