
"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingCart } from 'lucide-react';
import Image from 'next/image';

const MenuCard = ({ 
  dish, 
  onItemClick,
  showAddButton = true,
  onAddToCart,
}) => {
  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(dish);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-zinc-900 rounded-xl overflow-hidden shadow-xl border border-[#C49A6C]/20 group cursor-pointer w-full"
      onClick={() => onItemClick(dish)}
    >
      <div className="h-32 md:h-40 overflow-hidden relative">
        <Image 
          src={dish.image || "/placeholder-image.jpg"} 
          alt={dish.name}
          width={300}
          height={160}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            e.target.src = "/placeholder-image.jpg";
          }}
        />
        {dish.rating && (
          <div className="absolute top-2 left-2 bg-[#C49A6C] text-black px-2 py-1 rounded-full flex items-center gap-1 text-xs">
            <Star size={12} className="fill-current" />
            <span className="font-bold">{dish.rating}</span>
          </div>
        )}
        {dish.originalPrice && (
          <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-lg font-bold text-xs">
            خصم
          </div>
        )}
      </div>
      <div className="p-3 md:p-4">
        <h3 className="text-sm md:text-base font-bold text-[#C49A6C] mb-1 wrap-break-word">{dish.name}</h3>
        
        {dish.name_en && dish.name_en.trim() !== "" && (
          <p className="text-white/60 text-xs mb-1">{dish.name_en}</p>
        )}
        
        {dish.description && dish.description.trim() !== "" && (
          <p className="text-white/70 text-xs mb-2 md:mb-3 line-clamp-2">{dish.description}</p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-sm md:text-base font-bold text-white">{dish.price} ج.م</p>
            {dish.original_price && (
              <p className="text-xs text-white/40 line-through">{dish.original_price} ج.م</p>
            )}
          </div>
          {showAddButton && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToCart}
              className="bg-[#C49A6C] text-black p-2 rounded-lg font-semibold hover:bg-[#B08A5C] transition-all flex items-center gap-1 text-xs"
              title="أضف إلى السلة"
            >
              <ShoppingCart size={14} />
              <span>أضف</span>
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MenuCard;