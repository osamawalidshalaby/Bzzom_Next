
"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu as MenuIcon, X, Users, MessageSquare, ChefHat, Home as HomeIcon, Utensils, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '../layout-client';
import Image from 'next/image';

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();
  const { cart } = useApp();

  // Check if user is admin
  useEffect(() => {
    const auth = localStorage.getItem("adminAuthenticated");
    setIsAdmin(!!auth);
  }, []);

  const navItems = [
    { key: 'home', label: 'الرئيسية', icon: HomeIcon, path: '/', show: true },
    { key: 'menu', label: 'القائمة', icon: Utensils, path: '/menu', show: true },
    { key: 'kitchen', label: 'المطبخ', icon: ChefHat, path: '/kitchen', show: isAdmin }, // يظهر فقط للادمن
    { key: 'about', label: 'عن المطعم', icon: Users, path: '/about', show: true },
    { key: 'reviews', label: 'التقييمات', icon: MessageSquare, path: '/reviews', show: true },
    { key: 'admin', label: 'الإدارة', icon: Users, path: '/admin', show: isAdmin } // يظهر فقط للادمن
  ];

  // Filter nav items based on show condition
  const filteredNavItems = navItems.filter(item => item.show);

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    
    <nav className="fixed top-0 left-0 right-0 bg-linear-to-b from-black/95 to-black/70 backdrop-blur-sm z-50 border-b border-[#C49A6C]/20">
      <h1 className="sr-only">مطعم بزوم</h1>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            <Link href="/" className="flex items-center gap-3">
              <Image 
                src="/logo.png"
                alt="Bazzom Logo"
                width={32}
                height={32}
                loading="eager"
                className="h-8 w-auto object-contain" 
              />
              <div className="block sm:block">
                <div className="text-lg font-bold text-[#C49A6C]">Bazzom</div>
                <div className="text-xs text-white/60">الطعم الأصيل</div>
              </div>
            </Link>
          </motion.div>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-2 space-x-reverse">
            {filteredNavItems.map(item => (
              <motion.div
                key={item.key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${
                    pathname === item.path 
                      ? 'bg-[#C49A6C] text-black font-semibold' 
                      : 'text-white hover:text-[#C49A6C] hover:bg-white/5'
                  }`}
                >
                  <item.icon size={16} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </motion.div>
            ))}

            {/* Cart Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/cart"
                className={`relative flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${
                  pathname === '/cart'
                    ? 'bg-[#C49A6C] text-black font-semibold'
                    : 'text-white hover:text-[#C49A6C] hover:bg-white/5'
                }`}
              >
                <ShoppingCart size={16} />
                <span className="font-medium">السلة</span>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold border border-black text-[10px]">
                    {getTotalItems()}
                  </span>
                )}
              </Link>
            </motion.div>
          </div>

          {/* Tablet & Mobile Menu */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Cart Button - Icon Only */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/cart"
                className="relative flex items-center p-2 text-white hover:text-[#C49A6C] transition-all rounded-lg hover:bg-white/5"
              >
                <ShoppingCart size={20} />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold border border-black text-[10px]">
                    {getTotalItems()}
                  </span>
                )}
              </Link>
            </motion.div>

            {/* Menu Toggle Button */}
            <motion.button 
              className="text-white p-2 rounded-lg hover:bg-white/5 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <MenuIcon size={20} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden pb-3 bg-black/95 backdrop-blur-sm rounded-lg mt-2 border border-[#C49A6C]/20"
            >
              <div className="space-y-1 p-2">
                {filteredNavItems.map(item => (
                  <motion.div
                    key={item.key}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href={item.path}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${
                        pathname === item.path 
                          ? 'bg-[#C49A6C] text-black font-semibold' 
                          : 'text-white hover:bg-white/10'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon size={18} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </motion.div>
                ))}
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href="/cart"
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${
                      pathname === '/cart' 
                        ? 'bg-[#C49A6C] text-black font-semibold' 
                        : 'text-white hover:bg-white/10'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <ShoppingCart size={18} />
                    <span className="font-medium">السلة</span>
                    {cart.length > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold mr-auto text-[10px]">
                        {getTotalItems()}
                      </span>
                    )}
                  </Link>
                </motion.div>

                {/* Admin Badge في الموبايل */}
                {isAdmin && (
                  <div className="px-3 py-2">
                    <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">
                      وضع الإدارة
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navigation;