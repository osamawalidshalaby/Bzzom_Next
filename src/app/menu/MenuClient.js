// // app/menu/MenuClient.js (Client Component)
// "use client";
// import React, { useState, useMemo } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import MenuCard from "../_components/MenuCard";
// import ItemModal from "../_components/ItemModal";
// import { useCartSound } from "../_hooks/useCartSound";
// import toast, { Toaster } from "react-hot-toast";
// import { useApp } from "../layout-client";
// import { adminApi } from "../_services/adminApi";
// import { useQuery } from "@tanstack/react-query";

// // Components
// import SearchBar from "./_components/SearchBar";
// import CategoryFilter from "./_components/CategoryFilter";
// import MenuHeader from "./_components/MenuHeader";
// import MenuGrid from "./_components/MenuGrid";
// import EmptyResults from "./_components/EmptyResults";

// const MenuClient = () => {
//   const { addToCart } = useApp();
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedItem, setSelectedItem] = useState(null);
//   const { playAddToCartSound } = useCartSound();

//   // جلب البيانات من Supabase
//   const { data: menuItemsData = [], isLoading: menuItemsLoading } = useQuery({
//     queryKey: ["menu_items"],
//     queryFn: adminApi.menuItems.getMenuItems,
//   });

//   console.log(menuItemsData)

//   const { data: categoriesData = [], isLoading: categoriesLoading } = useQuery({
//     queryKey: ["menu_categories"],
//     queryFn: adminApi.menuCategories.getCategories,
//   });

//   const showToast = (message) => {
//     toast.success(message, {
//       duration: 2000,
//       position: "bottom-left",
//       style: {
//         background: "#1f2937",
//         color: "#fff",
//         border: "1px solid #C49A6C",
//       },
//       icon: "✅",
//     });
//   };

//   // تجميع البيانات حسب الفئات
//   const organizedMenuData = useMemo(() => {
//     if (!menuItemsData.length || !categoriesData.length) return { all: [] };

//     const organizedData = { all: [] };

//     categoriesData.forEach((category) => {
//       const categoryItems = menuItemsData.filter(
//         (item) => item.category_id === category.id && item.is_active !== false
//       );

//       // استخدام name_en كـ key أو name إذا لم يوجد name_en
//       const categoryKey =
//         category.name_en?.toLowerCase() || category.name.toLowerCase();
//       organizedData[categoryKey] = categoryItems;
//       organizedData.all.push(...categoryItems);
//     });

//     return organizedData;
//   }, [menuItemsData, categoriesData]);

//   const getFilteredMenu = () => {
//     if (!organizedMenuData[selectedCategory]) return [];

//     let items = organizedMenuData[selectedCategory];

//     if (searchQuery.trim()) {
//       items = items.filter(
//         (dish) =>
//           dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           (dish.name_en &&
//             dish.name_en.toLowerCase().includes(searchQuery.toLowerCase())) ||
//           (dish.description &&
//             dish.description.toLowerCase().includes(searchQuery.toLowerCase()))
//       );
//     }

//     return items;
//   };

//   const handleAddToCart = (dish) => {
//     addToCart({
//       id: dish.id,
//       name: dish.name,
//       nameEn: dish.name_en || "",
//       price: dish.price,
//       desc: dish.description || "",
//       image: dish.image || "",
//       quantity: 1,
//     });

//     showToast(`تم إضافة ${dish.name} إلى السلة! 🛒`);
//     playAddToCartSound();
//   };

//   const openItemDetails = (item) => {
//     setSelectedItem(item);
//   };

//   const closeItemDetails = () => {
//     setSelectedItem(null);
//   };

//   const handleModalAddToCart = (itemWithQuantity) => {
//     addToCart(itemWithQuantity);
//     showToast(`تم إضافة ${itemWithQuantity.name} إلى السلة! 🛒`);
//     playAddToCartSound();
//   };

//   const filteredMenu = getFilteredMenu();
//   const isLoading = menuItemsLoading || categoriesLoading;

//   // إعداد خيارات الفئات للـ CategoryFilter
//   const categoryOptions = useMemo(() => {
//     const options = [{ id: "all", name: "الكل", nameEn: "All" }];

//     if (categoriesData.length) {
//       categoriesData.forEach((category) => {
//         if (category.is_active !== false) {
//           options.push({
//             id: category.name_en?.toLowerCase() || category.name.toLowerCase(),
//             name: category.name,
//             nameEn: category.name_en || category.name,
//           });
//         }
//       });
//     }

//     return options;
//   }, [categoriesData]);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4">
//         <div className="max-w-7xl mx-auto">
//           <div className="flex justify-center items-center h-64">
//             <div className="text-xl">جاري تحميل البيانات...</div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <Toaster
//         position="bottom-left"
//         toastOptions={{
//           duration: 2000,
//           style: {
//             background: "#1f2937",
//             color: "#fff",
//             border: "1px solid #C49A6C",
//           },
//         }}
//       />

//       <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4">
//         <div className="max-w-7xl mx-auto">
//           <MenuHeader />

//           <SearchBar
//             searchQuery={searchQuery}
//             setSearchQuery={setSearchQuery}
//           />

//           <CategoryFilter
//             selectedCategory={selectedCategory}
//             setSelectedCategory={setSelectedCategory}
//             categories={categoryOptions}
//           />

//           <MenuGrid
//             items={filteredMenu}
//             onAddToCart={handleAddToCart}
//             onItemClick={openItemDetails}
//           />

//           <EmptyResults show={filteredMenu.length === 0 && !isLoading} />
//         </div>

//         <AnimatePresence>
//           {selectedItem && (
//             <ItemModal
//               isOpen={!!selectedItem}
//               onClose={closeItemDetails}
//               item={selectedItem}
//               onAddToCart={handleModalAddToCart}
//               playAddToCartSound={playAddToCartSound}
//             />
//           )}
//         </AnimatePresence>
//       </div>
//     </>
//   );
// };

// export default MenuClient;


"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { useCartSound } from "../_hooks/useCartSound";
import toast, { Toaster } from "react-hot-toast";
import { useApp } from "../layout-client";
import { adminApi } from "../_services/adminApi";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

// Components
import SearchBar from "./_components/SearchBar";
import CategoryFilter from "./_components/CategoryFilter";
import MenuHeader from "./_components/MenuHeader";
import MenuGrid from "./_components/MenuGrid";
import EmptyResults from "./_components/EmptyResults";
import ItemModal from "../_components/ItemModal";

const MenuClient = () => {
  const { addToCart } = useApp();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const { playAddToCartSound } = useCartSound();
  const searchParams = useSearchParams();
  const searchTimeoutRef = useRef(null);

  // Get category from URL
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      const decodedCategory = decodeURIComponent(categoryParam);
      setSelectedCategory(decodedCategory.toLowerCase());
    }
  }, [searchParams]);

  // Get categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["menu_categories"],
    queryFn: adminApi.menuCategories.getCategories,
  });

  // Custom hook for debouncing
  const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };

  const debouncedSearch = useDebounce(searchQuery, 500);

  // Get filtered menu items
  const {
    data: menuItems = [],
    isLoading: itemsLoading,
    refetch,
  } = useQuery({
    queryKey: ["menu_items", selectedCategory, debouncedSearch],
    queryFn: async () => {
      // إذا كان هناك بحث، نبحث في كل الأقسام بغض النظر عن الفئة المحددة
      if (debouncedSearch && debouncedSearch.trim() !== "") {

        // استخدام دالة البحث الخاصة
        const searchResults = await adminApi.menuItems.searchAllItems(
          debouncedSearch,
          50
        );

        // إذا كان هناك فئة محددة غير "all"، نفلتر النتائج حسب الفئة
        if (selectedCategory !== "all") {
          // البحث عن الفئة المحددة
          const category = categories?.find((cat) => {
            const catKey = cat.name_en?.toLowerCase() || cat.name.toLowerCase();
            return catKey === selectedCategory;
          });

          if (category) {
            return searchResults.filter(
              (item) => item.category_id === category.id
            );
          }
        }

        return searchResults;
      }

      // إذا لم يكن هناك بحث، نستخدم الفلترة العادية
      return await adminApi.menuItems.getFilteredMenuItems(
        selectedCategory,
        "", // لا بحث
        20
      );
    },
    enabled: !categoriesLoading, // انتظار تحميل الفئات أولاً
  });

  // Handle category change
  const handleCategoryChange = useCallback((categoryId) => {
    setSelectedCategory(categoryId);
    setSearchQuery(""); // إعادة تعيين البحث عند تغيير الفئة
  }, []);

  // Handle search input change
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    // لا داعي لـ refetch هنا لأن useQuery سيتحسس للتغيير في debouncedSearch
  };

  const handleAddToCart = (dish) => {
    addToCart({
      id: dish.id,
      name: dish.name,
      nameEn: dish.name_en || "",
      price: dish.price,
      desc: dish.description || "",
      image: dish.image || "",
      quantity: 1,
    });

    toast.success(`تم إضافة ${dish.name} إلى السلة! 🛒`, {
      position: "bottom-left",
      style: {
        background: "#1f2937",
        color: "#fff",
        border: "1px solid #C49A6C",
      },
    });

    playAddToCartSound();
  };

  const openItemDetails = (item) => setSelectedItem(item);
  const closeItemDetails = () => setSelectedItem(null);

  // Prepare category options
  const categoryOptions = [
    { id: "all", name: "الكل", nameEn: "All" },
    ...(categories || [])
      .filter((cat) => cat.is_active !== false)
      .map((cat) => ({
        id: cat.name_en?.toLowerCase() || cat.name.toLowerCase(),
        name: cat.name,
        nameEn: cat.name_en || cat.name,
      })),
  ];

  const isLoading = categoriesLoading || itemsLoading;


  return (
    <>
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
          <MenuHeader />

          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={handleSearchChange}
          />

          <CategoryFilter
            selectedCategory={selectedCategory}
            setSelectedCategory={handleCategoryChange}
            categories={categoryOptions}
          />

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-xl">جاري تحميل البيانات...</div>
            </div>
          ) : (
            <>
              <MenuGrid
                items={menuItems || []}
                onAddToCart={handleAddToCart}
                onItemClick={openItemDetails}
              />

              <EmptyResults
                show={menuItems?.length === 0 && !isLoading}
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
              />
            </>
          )}
        </div>

        <AnimatePresence>
          {selectedItem && (
            <ItemModal
              isOpen={!!selectedItem}
              onClose={closeItemDetails}
              item={selectedItem}
              onAddToCart={handleAddToCart}
              playAddToCartSound={playAddToCartSound}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default MenuClient;