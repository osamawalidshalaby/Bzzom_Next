// ملف: app/_hooks/useQueries.js
"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchFeaturedDishes, fetchOffers } from "../_services/homeApi";

// Hook للأطباق المميزة
export const useFeaturedDishes = () => {
  return useQuery({
    queryKey: ["featuredDishes"],
    queryFn: fetchFeaturedDishes,
    staleTime: 5 * 60 * 1000, // 5 دقائق
    cacheTime: 10 * 60 * 1000, // 10 دقائق
    retry: 2, // محاولتين
    refetchOnWindowFocus: false, // عدم إعادة الجلب عند التركيز
  });
};

// Hook للعروض
export const useOffers = () => {
  return useQuery({
    queryKey: ["offers"],
    queryFn: fetchOffers,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

// Hook لجميع البيانات معًا (اختياري)
export const useHomeData = () => {
  const featuredDishesQuery = useFeaturedDishes();
  const offersQuery = useOffers();

  return {
    featuredDishes: featuredDishesQuery.data || [],
    offers: offersQuery.data || [],
    isLoading: featuredDishesQuery.isLoading || offersQuery.isLoading,
    isError: featuredDishesQuery.isError || offersQuery.isError,
    error: featuredDishesQuery.error || offersQuery.error,
    refetch: () => {
      featuredDishesQuery.refetch();
      offersQuery.refetch();
    },
  };
};
