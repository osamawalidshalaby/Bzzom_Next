"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, ShoppingCart } from "lucide-react";
import Image from "next/image";

export default function MenuItemCard({
  item,
  onItemClick,
  onAddToCart,
  showAddButton = true,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -3 }}
      className="bg-zinc-900 rounded-lg overflow-hidden shadow-lg border border-[#C49A6C]/20 group cursor-pointer flex flex-col h-full"
      onClick={() => onItemClick(item, "dish")}
    >
      {/* Image Container */}
      <div className="h-32 sm:h-40 overflow-hidden relative">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {item.rating && (
          <div className="absolute top-2 left-2 bg-[#C49A6C] text-black px-2 py-1 rounded-full flex items-center gap-1 text-xs">
            <Star size={12} className="fill-current" />
            <span className="font-bold">{item.rating}</span>
          </div>
        )}
        {item.original_price && (
          <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-0.5 rounded-lg font-bold text-xs">
            خصم
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-[#C49A6C] mb-1 line-clamp-2">
            {item.name}
          </h3>
          <p className="text-white/60 text-xs mb-1">{item.name_en}</p>
          <p className="text-white/70 text-xs line-clamp-1">{item.description}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#C49A6C]/10">
          <p className="text-sm font-bold text-white">{item.price} ج.م</p>
          {showAddButton && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(item);
              }}
              className="bg-[#C49A6C] hover:bg-[#D4A574] text-black p-1.5 rounded-lg transition-colors"
              title="أضف إلى السلة"
            >
              <ShoppingCart size={14} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
