
"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
import Image from 'next/image';

const ItemModal = ({ 
  isOpen, 
  onClose, 
  item, 
  onAddToCart,
  playAddToCartSound
}) => {
  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (!item) return;

    const itemToAdd = {
      ...item,
      quantity: quantity
    };

    onAddToCart(itemToAdd);
    
    if (playAddToCartSound) {
      playAddToCartSound();
    }
    
    onClose();
    setQuantity(1);
  };

  if (!isOpen || !item) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 z-50 flex items-end md:items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30 }}
        className="bg-zinc-900 rounded-t-2xl md:rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-zinc-900 p-4 border-b border-zinc-700 flex justify-between items-center">
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-zinc-800 transition-colors text-white"
          >
            <X size={24} />
          </button>
          <h2 className="text-xl font-bold text-[#C49A6C]">{item.name}</h2>
          <div className="w-10"></div>
        </div>

        {/* Image */}
        <div className="h-64 overflow-hidden">
          <Image 
            src={item.image || "/placeholder-image.jpg"} 
            alt={item.name}
            width={400}
            height={256}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "/placeholder-image.jpg";
            }}
          />
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">{item.name}</h1>
              {item.name_en && item.name_en.trim() !== "" && (
                <p className="text-white/60">{item.name_en}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-[#C49A6C]">{item.price} ج.م</p>
              {item.original_price && (
                <p className="text-white/40 line-through">{item.original_price} ج.م</p>
              )}
            </div>
          </div>

          {item.description && item.description.trim() !== "" && (
            <div className="mb-6">
              <p className="text-white/80 leading-relaxed">{item.description}</p>
            </div>
          )}

          {/* Quantity Selector & Add to Cart */}
          <div className="border-t border-zinc-700 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">الكمية</h3>
              <div className="flex items-center gap-4">
                <button 
                  onClick={decreaseQuantity}
                  className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors text-white"
                >
                  <Minus size={20} />
                </button>
                <span className="text-xl font-bold w-8 text-center text-white">{quantity}</span>
                <button 
                  onClick={increaseQuantity}
                  className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors text-white"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              className="w-full bg-[#C49A6C] text-black py-4 rounded-xl font-bold text-lg hover:bg-[#B08A5C] transition-all flex items-center justify-center gap-2"
            >
              <ShoppingCart size={20} />
              <span>أضف إلى السلة ({quantity}) - {item.price} ج.م</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ItemModal;