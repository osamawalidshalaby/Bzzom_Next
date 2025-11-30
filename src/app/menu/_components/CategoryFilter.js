


// app/menu/components/CategoryFilter.js
import { motion } from "framer-motion";

const CategoryFilter = ({ selectedCategory, setSelectedCategory, categories = [] }) => {
  // إذا لم يتم تمرير الفئات، نستخدم الفئات الافتراضية
  const defaultCategories = [
    { id: "all", name: "الكل" },
    { id: "appetizers", name: "المقبلات" },
    { id: "mains", name: "الأطباق الرئيسية" },
    { id: "desserts", name: "الحلويات" },
    { id: "drinks", name: "المشروبات" },
  ];

  const displayCategories = categories.length > 1 ? categories : defaultCategories;

  return (
    <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8 md:mb-12">
      {displayCategories.map((cat) => (
        <motion.button
          key={cat.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-3 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-all text-xs md:text-base ${
            selectedCategory === cat.id
              ? "bg-[#C49A6C] text-black"
              : "bg-zinc-900 text-white hover:bg-zinc-800"
          }`}
          onClick={() => setSelectedCategory(cat.id)}
        >
          {cat.name}
        </motion.button>
      ))}
    </div>
  );
};

export default CategoryFilter;