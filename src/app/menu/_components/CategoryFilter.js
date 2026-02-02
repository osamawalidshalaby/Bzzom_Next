import { motion } from "framer-motion";

const CategoryFilter = ({
  selectedCategory,
  setSelectedCategory,
  categories = [],
}) => {
  // إذا لم يتم تمرير الفئات، نستخدم الفئات الافتراضية
  const defaultCategories = [
    { id: "all", name: "الكل" },
    { id: "appetizers", name: "المقبلات" },
    { id: "mains", name: "الأطباق الرئيسية" },
    { id: "desserts", name: "الحلويات" },
    { id: "drinks", name: "المشروبات" },
  ];

  const displayCategories =
    categories.length > 1 ? categories : defaultCategories;

  return (
    <div className="mb-8 md:mb-12">
      {/* Desktop: عرض عادي */}
      <div className="hidden md:flex flex-wrap justify-center gap-4">
        {displayCategories.map((cat) => (
          <motion.button
            key={cat.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-3 rounded-lg font-semibold transition-all text-base ${
              selectedCategory === cat.id
                ? "bg-[#C49A6C] text-black shadow-lg shadow-[#C49A6C]/20"
                : "bg-zinc-900 text-white hover:bg-zinc-800"
            }`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.name}
          </motion.button>
        ))}
      </div>

      {/* Mobile & Tablet: Scroll أفقي بسيط */}
      <div className="md:hidden">
        <div className="flex gap-2 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory">
          {/* إخفاء Scrollbar ولكن مع إبقاء إمكانية السحب */}
          <style jsx>{`
            .overflow-x-auto {
              -webkit-overflow-scrolling: touch;
              scrollbar-width: none;
              -ms-overflow-style: none;
            }
            .overflow-x-auto::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {/* مسافة فارغة على اليمين لتحسين UX */}
          <div className="flex gap-2 pr-4">
            {displayCategories.map((cat) => (
              <motion.button
                key={cat.id}
                whileTap={{ scale: 0.95 }}
                className={`flex-shrink-0 px-4 py-3 rounded-lg font-semibold transition-all text-sm whitespace-nowrap snap-start ${
                  selectedCategory === cat.id
                    ? "bg-[#C49A6C] text-black shadow-lg shadow-[#C49A6C]/30"
                    : "bg-zinc-900 text-white hover:bg-zinc-800"
                }`}
                onClick={() => {
                  setSelectedCategory(cat.id);

                  // Smooth scroll to center the selected button
                  const container = document.querySelector(".overflow-x-auto");
                  const button = document.activeElement;
                  if (container && button) {
                    const containerWidth = container.offsetWidth;
                    const buttonLeft = button.offsetLeft;
                    const buttonWidth = button.offsetWidth;
                    const scrollLeft =
                      buttonLeft - containerWidth / 2 + buttonWidth / 2;

                    container.scrollTo({
                      left: scrollLeft,
                      behavior: "smooth",
                    });
                  }
                }}
              >
                {cat.name}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
