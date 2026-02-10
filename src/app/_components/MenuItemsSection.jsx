"use client";

import MenuItemCard from "./MenuItemCard";

export default function MenuItemsSection({
  menuItems,
  onItemClick,
  onAddToCart,
}) {
  if (!menuItems || menuItems.length === 0) {
    return null;
  }

  return (
    <section className="py-8 md:py-12 px-4 bg-linear-to-b from-zinc-900 to-black w-full relative">
      <div className="max-w-7xl mx-auto w-full">
        <h2 className="text-3xl md:text-5xl font-bold text-[#C49A6C] mb-4 text-center wrap-break-word">
          من قائمة الطعام
        </h2>
        <p className="text-lg md:text-xl text-white/60 mb-8 md:mb-12 text-center wrap-break-word">
          اختر من تشكيلة واسعة من أشهى الأطباق
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 md:gap-5">
          {menuItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              onItemClick={onItemClick}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </div>

      {/* Gradient overlay at bottom (lighter & shorter to avoid covering cards) */}
      <div className="absolute bottom-0 left-0 right-0 h-12 md:h-16 bg-gradient-to-b from-transparent to-black/30 pointer-events-none"></div>
    </section>
  );
}
