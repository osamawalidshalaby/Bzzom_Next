"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Users, Star, Clock, CreditCard } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    { icon: Users, number: '50,000+', label: 'عميل سعيد' },
    { icon: Star, number: '4.9', label: 'تقييم متوسط' },
    { icon: Clock, number: '12+', label: 'سنوات خبرة' },
    { icon: CreditCard, number: '100+', label: 'طبق مميز' }
  ];

  return (
    <section className="py-12 md:py-16 bg-zinc-900 w-full">
      <div className="max-w-7xl mx-auto px-4 w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="text-center"
            >
              <stat.icon className="text-[#C49A6C] mx-auto mb-2 md:mb-4" size={32} />
              <p className="text-2xl md:text-4xl font-bold text-white mb-1 md:mb-2">{stat.number}</p>
              <p className="text-white/60 text-sm md:text-lg">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;