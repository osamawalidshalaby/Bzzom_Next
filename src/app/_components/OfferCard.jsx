"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { useApp } from '../layout-client';
import Image from 'next/image';

const OfferCard = ({ 
  offer, 
  onItemClick, 
  onAddToCart,
  showAddButton = true 
}) => {
  const { addToCart } = useApp();

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="bg-black rounded-xl overflow-hidden shadow-xl border-2 border-[#C49A6C] relative shrink-0 w-72 md:w-96"
      onClick={() => onItemClick(offer, 'offer')}
    >
      <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-lg font-bold z-10 text-xs">
        خصم
      </div>
      <div className="h-40 md:h-48 overflow-hidden">
        <Image 
          src={offer.image} 
          alt={offer.title}
          width={384}
          height={192}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold text-[#C49A6C] mb-2 wrap-break-word">{offer.title}</h3>
        <p className="text-white/70 text-sm mb-4 line-clamp-2">{offer.description}</p>
        <div className="flex items-center gap-3 mb-4">
          <p className="text-xl font-bold text-white">{offer.price}</p>
          <p className="text-base text-white/40 line-through">{offer.originalPrice}</p>
        </div>
        {showAddButton && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(offer);
            }}
            className="w-full bg-[#C49A6C] text-black py-2 rounded-lg font-semibold hover:bg-[#B08A5C] transition-all text-sm flex items-center justify-center gap-2"
          >
            <ShoppingCart size={16} />
            <span>اطلب العرض</span>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default OfferCard;