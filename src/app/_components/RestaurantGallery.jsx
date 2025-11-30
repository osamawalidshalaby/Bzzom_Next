"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const RestaurantGallery = ({ photos }) => {
  return (
    <section className="py-16 md:py-20 px-4 bg-linear-to-b from-zinc-900 to-black w-full">
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

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 w-full">
          {photos.map((photo, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="rounded-xl overflow-hidden h-32 md:h-48 lg:h-64 group cursor-pointer w-full"
            >
              <Image 
                src={photo} 
                alt={`مطعم بزوم ${idx + 1}`}
                width={400}
                height={256}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RestaurantGallery;