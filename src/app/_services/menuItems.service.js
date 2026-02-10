import { supabase } from "./supabase";
import { authService } from "./auth.service";
import { storageService } from "./storage.service";

/**
 * Menu Items Service
 * Handles all menu item and menu category operations
 */
export const menuItemsService = {
  // Get all menu items
  getMenuItems: async () => {
    const { data, error } = await supabase
      .from("menu_items")
      .select(
        `
        *,
        menu_categories(name, name_en)
      `
      )
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data;
  },

  // Get filtered menu items
  getFilteredMenuItems: async (category = "all", search = "", limit = 20) => {
    try {
      console.log("🔍 Fetching with params:", { category, search, limit });

      // Step 1: Get all active categories
      const { data: categories, error: catError } = await supabase
        .from("menu_categories")
        .select("*")
        .eq("is_active", true);

      if (catError) throw catError;
      console.log("📂 Categories loaded:", categories?.length);

      // Step 2: Build the base query
      let query = supabase
        .from("menu_items")
        .select(
          `
          *,
          menu_categories(name, name_en)
        `
        )
        .eq("is_active", true);

      // Step 3: Filter by category if specified (not "all")
      if (category !== "all" && categories && categories.length > 0) {
        const foundCategory = categories.find((cat) => {
          const catName = cat.name_en?.toLowerCase() || cat.name.toLowerCase();
          return catName === category.toLowerCase();
        });

        if (foundCategory) {
          query = query.eq("category_id", foundCategory.id);
        }
      }

      // Step 4: Add search filter (always apply if search exists)
      if (search && search.trim() !== "") {
        const searchTerm = `%${search}%`;
        query = query.or(
          `name.ilike.${searchTerm},name_en.ilike.${searchTerm},description.ilike.${searchTerm}`
        );
        console.log(`🔎 Searching for: "${search}" in ALL categories`);
      }

      // Step 5: Add limit ONLY if:
      // 1. It's "all" category AND
      // 2. There's NO search query
      if (category === "all" && (!search || search.trim() === "")) {
        query = query.limit(limit);
      }

      // Step 6: Execute query with ordering
      const { data, error } = await query.order("sort_order", {
        ascending: true,
      });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      throw error;
    }
  },

  // Search all items
  searchAllItems: async (searchTerm, limit = 50) => {
    if (!searchTerm || searchTerm.trim() === "") {
      return [];
    }

    const { data, error } = await supabase
      .from("menu_items")
      .select(
        `
        *,
        menu_categories(name, name_en)
      `
      )
      .eq("is_active", true)
      .or(
        `name.ilike.%${searchTerm}%,name_en.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`
      )
      .order("sort_order", { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  // Get paginated menu items
  getMenuItemsPaginated: async (page = 1, limit = 20) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("menu_items")
      .select(
        `
        *,
        menu_categories(name, name_en)
      `,
        { count: "exact" }
      )
      .order("sort_order", { ascending: true })
      .range(from, to);

    if (error) throw error;
    return { data, total: count };
  },

  // Get menu items by category
  getMenuItemsByCategory: async (categoryId) => {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("category_id", categoryId)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data;
  },

  // Create menu item
  createMenuItem: async (itemData, imageFile = null) => {
    try {
      // Check permission
      const userRole = authService.getCurrentRole();
      if (!["chief", "admin"].includes(userRole)) {
        throw new Error("غير مصرح لك بإضافة أصناف جديدة");
      }

      if (imageFile) {
        const imageUrl = await storageService.uploadFile(imageFile);
        itemData.image = imageUrl;
      }

      const { data, error } = await supabase
        .from("menu_items")
        .insert([itemData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Create menu item error:", error);
      throw error;
    }
  },

  // Update menu item
  updateMenuItem: async (id, updates, imageFile = null) => {
    try {
      // Check permission
      const userRole = authService.getCurrentRole();
      if (!["chief", "admin"].includes(userRole)) {
        throw new Error("غير مصرح لك بتعديل الأصناف");
      }

      if (imageFile) {
        const imageUrl = await storageService.uploadFile(imageFile);
        updates.image = imageUrl;
      }

      const { data, error } = await supabase
        .from("menu_items")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Update menu item error:", error);
      throw error;
    }
  },

  // Delete menu item
  deleteMenuItem: async (id) => {
    // Check permission
    const userRole = authService.getCurrentRole();
    if (!["chief", "admin"].includes(userRole)) {
      throw new Error("غير مصرح لك بحذف الأصناف");
    }

    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    if (error) throw error;
    return true;
  },
};

/**
 * Menu Categories Service
 * Handles menu category operations
 */
export const menuCategoriesService = {
  // Get all menu categories
  getCategories: async () => {
    const { data, error } = await supabase
      .from("menu_categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data;
  },

  // Create menu category
  createCategory: async (categoryData) => {
    try {
      const { data, error } = await supabase
        .from("menu_categories")
        .insert([categoryData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Create menu category error:", error);
      throw error;
    }
  },

  // Update menu category
  updateCategory: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from("menu_categories")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Update menu category error:", error);
      throw error;
    }
  },

  // Delete menu category
  deleteCategory: async (id) => {
    const { error } = await supabase
      .from("menu_categories")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  },
};

export default menuItemsService;
