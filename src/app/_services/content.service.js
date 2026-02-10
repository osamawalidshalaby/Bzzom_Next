import { supabase } from "./supabase";
import { storageService } from "./storage.service";

/**
 * Content Service
 * Handles home slides, featured dishes, offers, and categories
 */

// Home Slides API
export const homeSlidesService = {
  getSlides: async () => {
    const { data, error } = await supabase
      .from("home_slides")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data;
  },

  createSlide: async (slideData, imageFile = null) => {
    try {
      if (imageFile) {
        const imageUrl = await storageService.uploadFile(imageFile);
        slideData.image = imageUrl;
      }

      const dataToInsert = {
        title: slideData.title,
        subtitle: slideData.subtitle,
        description: slideData.description,
        image: slideData.image,
        button_text: slideData.button_text,
        bg_color: slideData.bg_color,
        type: slideData.type || "normal",
        sort_order: slideData.sort_order || 0,
        is_active:
          slideData.is_active !== undefined ? slideData.is_active : true,
      };

      const { data, error } = await supabase
        .from("home_slides")
        .insert([dataToInsert])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Create slide error:", error);
      throw error;
    }
  },

  updateSlide: async (id, updates, imageFile = null) => {
    try {
      if (imageFile) {
        const imageUrl = await storageService.uploadFile(imageFile);
        updates.image = imageUrl;
      }

      const { data, error } = await supabase
        .from("home_slides")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Update slide error:", error);
      throw error;
    }
  },

  deleteSlide: async (id) => {
    const { error } = await supabase.from("home_slides").delete().eq("id", id);
    if (error) throw error;
    return true;
  },
};

// Featured Dishes API
export const featuredDishesService = {
  getFeaturedDishes: async () => {
    const { data, error } = await supabase
      .from("featured_dishes")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data;
  },

  createFeaturedDish: async (dishData, imageFile = null) => {
    try {
      if (imageFile) {
        const imageUrl = await storageService.uploadFile(imageFile);
        dishData.image = imageUrl;
      }

      const dataToInsert = {
        name: dishData.name,
        name_en: dishData.name_en,
        price: dishData.price,
        original_price: dishData.original_price,
        description: dishData.description,
        image: dishData.image,
        rating: dishData.rating,
        details: dishData.details,
        sort_order: dishData.sort_order || 0,
        is_active: dishData.is_active !== undefined ? dishData.is_active : true,
      };

      const { data, error } = await supabase
        .from("featured_dishes")
        .insert([dataToInsert])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Create dish error:", error);
      throw error;
    }
  },

  updateFeaturedDish: async (id, updates, imageFile = null) => {
    try {
      if (imageFile) {
        const imageUrl = await storageService.uploadFile(imageFile);
        updates.image = imageUrl;
      }

      const { data, error } = await supabase
        .from("featured_dishes")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Update dish error:", error);
      throw error;
    }
  },

  deleteFeaturedDish: async (id) => {
    const { error } = await supabase
      .from("featured_dishes")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  },
};

// Offers API
export const offersService = {
  getOffers: async () => {
    const { data, error } = await supabase
      .from("offers")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data;
  },

  createOffer: async (offerData, imageFile = null) => {
    try {
      if (imageFile) {
        const imageUrl = await storageService.uploadFile(imageFile);
        offerData.image = imageUrl;
      }

      const dataToInsert = {
        title: offerData.title,
        description: offerData.description,
        price: offerData.price,
        original_price: offerData.original_price,
        image: offerData.image,
        details: offerData.details,
        sort_order: offerData.sort_order || 0,
        is_active:
          offerData.is_active !== undefined ? offerData.is_active : true,
      };

      const { data, error } = await supabase
        .from("offers")
        .insert([dataToInsert])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Create offer error:", error);
      throw error;
    }
  },

  updateOffer: async (id, updates, imageFile = null) => {
    try {
      if (imageFile) {
        const imageUrl = await storageService.uploadFile(imageFile);
        updates.image = imageUrl;
      }

      const { data, error } = await supabase
        .from("offers")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Update offer error:", error);
      throw error;
    }
  },

  deleteOffer: async (id) => {
    const { error } = await supabase.from("offers").delete().eq("id", id);
    if (error) throw error;
    return true;
  },
};

// Categories API (for home page)
export const categoriesService = {
  getCategories: async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data;
  },

  createCategory: async (categoryData, imageFile = null) => {
    try {
      if (imageFile) {
        const imageUrl = await storageService.uploadFile(imageFile);
        categoryData.image_url = imageUrl;
      }

      const dataToInsert = {
        name_ar: categoryData.name_ar,
        name_en: categoryData.name_en,
        description: categoryData.description,
        image_url: categoryData.image_url,
        sort_order: categoryData.sort_order || 0,
        is_active:
          categoryData.is_active !== undefined ? categoryData.is_active : true,
      };

      const { data, error } = await supabase
        .from("categories")
        .insert([dataToInsert])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Create category error:", error);
      throw error;
    }
  },

  updateCategory: async (id, updates, imageFile = null) => {
    try {
      if (imageFile) {
        const imageUrl = await storageService.uploadFile(imageFile);
        updates.image_url = imageUrl;
      }

      const { data, error } = await supabase
        .from("categories")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Update category error:", error);
      throw error;
    }
  },

  deleteCategory: async (id) => {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) throw error;
    return true;
  },
};

export default {
  homeSlides: homeSlidesService,
  featuredDishes: featuredDishesService,
  offers: offersService,
  categories: categoriesService,
};
