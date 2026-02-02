"use client";
import React from "react";

const EmptyResults = ({ show, searchQuery = "", selectedCategory = "all" }) => {
  if (!show) return null;

  const hasSearch = searchQuery && searchQuery.trim() !== "";
  const isAllCategory = selectedCategory === "all";

  let message = "لا توجد عناصر في هذه الفئة.";

  if (hasSearch && isAllCategory) {
    message = `لا توجد نتائج للبحث "${searchQuery}" في جميع الأقسام.`;
  } else if (hasSearch && !isAllCategory) {
    message = `لا توجد نتائج للبحث "${searchQuery}" في قسم ${selectedCategory}.`;
  } else if (!hasSearch && isAllCategory) {
    message = "لا توجد عناصر متاحة حاليًا.";
  }

  return (
    <div className="text-center py-12">
      <div className="text-gray-400 text-lg mb-2">😕</div>
      <p className="text-gray-400">{message}</p>
      <p className="text-gray-500 text-sm mt-2">
        حاول البحث بكلمات مختلفة أو اختر قسم آخر.
      </p>
    </div>
  );
};

export default EmptyResults;
