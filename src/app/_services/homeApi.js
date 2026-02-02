// ملف: app/_lib/queries.js
import { supabase } from "../_services/supabase";

// 1. دالة لجلب الأطباق المميزة
export const fetchFeaturedDishes = async () => {
  try {
    const { data, error } = await supabase
      .from("featured_dishes")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching featured dishes:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error in fetchFeaturedDishes:", error);
    throw error;
  }
};

// 2. دالة لجلب العروض
export const fetchOffers = async () => {
  try {
    const { data, error } = await supabase
      .from("offers")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching offers:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error in fetchOffers:", error);
    throw error;
  }
};
