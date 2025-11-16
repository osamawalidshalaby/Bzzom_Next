"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { menuData } from "../_data/menuData";
import MenuCard from "../_components/MenuCard";
import ItemModal from "../_components/ItemModal";
import { useCartSound } from "../_hooks/useCartSound";
import toast, { Toaster } from "react-hot-toast";
import { useApp } from "../layout-client";

const Menu = () => {
  const { addToCart } = useApp();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const { playAddToCartSound } = useCartSound();

  const showToast = (message) => {
    toast.success(message, {
      duration: 2000,
      position: "bottom-left",
      style: {
        background: "#1f2937",
        color: "#fff",
        border: "1px solid #C49A6C",
      },
      icon: "✅",
    });
  };

  const getFilteredMenu = () => {
    let items =
      selectedCategory === "all"
        ? [
            ...menuData.appetizers,
            ...menuData.mains,
            ...menuData.desserts,
            ...menuData.drinks,
          ]
        : menuData[selectedCategory] || [];

    if (searchQuery.trim()) {
      items = items.filter(
        (dish) =>
          dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dish.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dish.desc.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return items;
  };

  const handleAddToCart = (dish) => {
    addToCart({
      ...dish,
      quantity: 1,
    });

    showToast(`تم إضافة ${dish.name} إلى السلة! 🛒`);
    playAddToCartSound();
  };

  const openItemDetails = (item) => {
    setSelectedItem({ ...item, type: "dish" });
  };

  const closeItemDetails = () => {
    setSelectedItem(null);
  };

  const handleModalAddToCart = (itemWithQuantity) => {
    addToCart(itemWithQuantity);
    showToast(`تم إضافة ${itemWithQuantity.name} إلى السلة! 🛒`);
  };

  return (
    <>
      {/* Toast Container */}
      <Toaster
        position="bottom-left"
        toastOptions={{
          duration: 2000,
          style: {
            background: "#1f2937",
            color: "#fff",
            border: "1px solid #C49A6C",
          },
        }}
      />

      <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-[#C49A6C] mb-6 text-center"
          >
            قائمة الطعام
          </motion.h1>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <input
              type="text"
              placeholder="ابحث عن طبق... | Search for a dish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 md:px-6 py-3 md:py-4 bg-zinc-900 border-2 border-[#C49A6C]/30 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#C49A6C] transition-all text-sm md:text-base"
            />
          </motion.div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8 md:mb-12">
            {[
              { key: "all", label: "الكل" },
              { key: "appetizers", label: "المشويات" },
              { key: "mains", label: "الأطباق الرئيسية" },
              { key: "desserts", label: "الطواجن" },
              { key: "drinks", label: "المشروبات" },
              { key: "adds", label: "المقبلات" },
            ].map((cat) => (
              <motion.button
                key={cat.key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-3 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-all text-xs md:text-base ${
                  selectedCategory === cat.key
                    ? "bg-[#C49A6C] text-black"
                    : "bg-zinc-900 text-white hover:bg-zinc-800"
                }`}
                onClick={() => setSelectedCategory(cat.key)}
              >
                {cat.label}
              </motion.button>
            ))}
          </div>

          {/* Menu Items */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
            {getFilteredMenu().map((dish, idx) => (
              <MenuCard
                key={dish.id}
                dish={dish}
                onAddToCart={handleAddToCart}
                onItemClick={openItemDetails}
              />
            ))}
          </div>

          {/* No Results Message */}
          {getFilteredMenu().length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-white/60 text-xl">لا توجد نتائج</p>
            </motion.div>
          )}
        </div>

        {/* Item Modal */}
        <AnimatePresence>
          {selectedItem && (
            <ItemModal
              isOpen={!!selectedItem}
              onClose={closeItemDetails}
              item={selectedItem}
              type={selectedItem.type}
              onAddToCart={handleModalAddToCart}
              playAddToCartSound={playAddToCartSound}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Menu;
