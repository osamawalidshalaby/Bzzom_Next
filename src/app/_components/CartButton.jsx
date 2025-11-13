"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useApp } from '../context/AppContext';

const CartButton = () => {
  const { cart } = useApp();

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Link
        href="/cart"
        className="relative flex items-center px-3 py-2 text-white hover:text-[#C49A6C] transition-all"
      >
        <ShoppingCart size={20} />
        {cart.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-[#C49A6C] text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {getTotalItems()}
          </span>
        )}
      </Link>
    </motion.div>
  );
};

export default CartButton;