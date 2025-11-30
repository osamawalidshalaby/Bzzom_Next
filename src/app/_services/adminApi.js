// import { supabase } from "./supabase";
// import { storageApi } from "./storage";

// // Home Slides API
// export const homeApi = {
//   // Get all slides
//   getSlides: async () => {
//     const { data, error } = await supabase
//       .from("home_slides")
//       .select("*")
//       .order("sort_order", { ascending: true });

//     if (error) throw error;
//     return data;
//   },

//   // Create slide
//   createSlide: async (slideData, imageFile = null) => {
//     try {
//       // Upload image if provided
//       if (imageFile) {
//         const imageUrl = await storageApi.uploadFile(imageFile);
//         slideData.image = imageUrl;
//       }

//       // تأكد من أن البيانات تتطابق مع أسماء الأعمدة في الجدول
//       const dataToInsert = {
//         title: slideData.title,
//         subtitle: slideData.subtitle,
//         description: slideData.description, // هذا هو العمود الصحيح
//         image: slideData.image,
//         button_text: slideData.button_text,
//         bg_color: slideData.bg_color,
//         sort_order: slideData.sort_order || 0,
//         is_active:
//           slideData.is_active !== undefined ? slideData.is_active : true,
//       };

//       const { data, error } = await supabase
//         .from("home_slides")
//         .insert([dataToInsert])
//         .select()
//         .single();

//       if (error) throw error;
//       return data;
//     } catch (error) {
//       console.error("Create slide error:", error);
//       throw error;
//     }
//   },

//   // Update slide
//   updateSlide: async (id, updates, imageFile = null) => {
//     try {
//       // Upload new image if provided
//       if (imageFile) {
//         const imageUrl = await storageApi.uploadFile(imageFile);
//         updates.image = imageUrl;
//       }

//       // تأكد من أسماء الأعمدة
//       const dataToUpdate = {};
//       if (updates.title !== undefined) dataToUpdate.title = updates.title;
//       if (updates.subtitle !== undefined)
//         dataToUpdate.subtitle = updates.subtitle;
//       if (updates.description !== undefined)
//         dataToUpdate.description = updates.description;
//       if (updates.image !== undefined) dataToUpdate.image = updates.image;
//       if (updates.button_text !== undefined)
//         dataToUpdate.button_text = updates.button_text;
//       if (updates.bg_color !== undefined)
//         dataToUpdate.bg_color = updates.bg_color;
//       if (updates.sort_order !== undefined)
//         dataToUpdate.sort_order = updates.sort_order;
//       if (updates.is_active !== undefined)
//         dataToUpdate.is_active = updates.is_active;

//       const { data, error } = await supabase
//         .from("home_slides")
//         .update(dataToUpdate)
//         .eq("id", id)
//         .select()
//         .single();

//       if (error) throw error;
//       return data;
//     } catch (error) {
//       console.error("Update slide error:", error);
//       throw error;
//     }
//   },

//   // Delete slide
//   deleteSlide: async (id) => {
//     const { error } = await supabase.from("home_slides").delete().eq("id", id);

//     if (error) throw error;
//     return true;
//   },
// };

// // Featured Dishes API
// export const featuredDishesApi = {
//   getFeaturedDishes: async () => {
//     const { data, error } = await supabase
//       .from("featured_dishes")
//       .select("*")
//       .order("sort_order", { ascending: true });

//     if (error) throw error;
//     return data;
//   },

//   createFeaturedDish: async (dishData, imageFile = null) => {
//     try {
//       // Upload image if provided
//       if (imageFile) {
//         const imageUrl = await storageApi.uploadFile(imageFile);
//         dishData.image = imageUrl;
//       }

//       const dataToInsert = {
//         name: dishData.name,
//         name_en: dishData.name_en,
//         price: dishData.price,
//         original_price: dishData.original_price,
//         description: dishData.description,
//         image: dishData.image,
//         rating: dishData.rating,
//         details: dishData.details,
//         sort_order: dishData.sort_order || 0,
//         is_active: dishData.is_active !== undefined ? dishData.is_active : true,
//       };

//       const { data, error } = await supabase
//         .from("featured_dishes")
//         .insert([dataToInsert])
//         .select()
//         .single();

//       if (error) throw error;
//       return data;
//     } catch (error) {
//       console.error("Create dish error:", error);
//       throw error;
//     }
//   },

//   updateFeaturedDish: async (id, updates, imageFile = null) => {
//     try {
//       // Upload new image if provided
//       if (imageFile) {
//         const imageUrl = await storageApi.uploadFile(imageFile);
//         updates.image = imageUrl;
//       }

//       const { data, error } = await supabase
//         .from("featured_dishes")
//         .update(updates)
//         .eq("id", id)
//         .select()
//         .single();

//       if (error) throw error;
//       return data;
//     } catch (error) {
//       console.error("Update dish error:", error);
//       throw error;
//     }
//   },

//   deleteFeaturedDish: async (id) => {
//     const { error } = await supabase
//       .from("featured_dishes")
//       .delete()
//       .eq("id", id);

//     if (error) throw error;
//     return true;
//   },
// };

// // Offers API
// export const offersApi = {
//   getOffers: async () => {
//     const { data, error } = await supabase
//       .from("offers")
//       .select("*")
//       .order("sort_order", { ascending: true });

//     if (error) throw error;
//     return data;
//   },

//   createOffer: async (offerData, imageFile = null) => {
//     try {
//       // Upload image if provided
//       if (imageFile) {
//         const imageUrl = await storageApi.uploadFile(imageFile);
//         offerData.image = imageUrl;
//       }

//       const dataToInsert = {
//         title: offerData.title,
//         description: offerData.description,
//         price: offerData.price,
//         original_price: offerData.original_price,
//         image: offerData.image,
//         details: offerData.details,
//         sort_order: offerData.sort_order || 0,
//         is_active:
//           offerData.is_active !== undefined ? offerData.is_active : true,
//       };

//       const { data, error } = await supabase
//         .from("offers")
//         .insert([dataToInsert])
//         .select()
//         .single();

//       if (error) throw error;
//       return data;
//     } catch (error) {
//       console.error("Create offer error:", error);
//       throw error;
//     }
//   },

//   updateOffer: async (id, updates, imageFile = null) => {
//     try {
//       // Upload new image if provided
//       if (imageFile) {
//         const imageUrl = await storageApi.uploadFile(imageFile);
//         updates.image = imageUrl;
//       }

//       const { data, error } = await supabase
//         .from("offers")
//         .update(updates)
//         .eq("id", id)
//         .select()
//         .single();

//       if (error) throw error;
//       return data;
//     } catch (error) {
//       console.error("Update offer error:", error);
//       throw error;
//     }
//   },

//   deleteOffer: async (id) => {
//     const { error } = await supabase.from("offers").delete().eq("id", id);

//     if (error) throw error;
//     return true;
//   },
// };

// // باقي ال APIs بنفس الطريقة...
// export const menuCategoriesApi = {
//   getCategories: async () => {
//     const { data, error } = await supabase
//       .from("menu_categories")
//       .select("*")
//       .order("sort_order", { ascending: true });

//     if (error) throw error;
//     return data;
//   },

//   createCategory: async (categoryData) => {
//     const { data, error } = await supabase
//       .from("menu_categories")
//       .insert([categoryData])
//       .select()
//       .single();

//     if (error) throw error;
//     return data;
//   },

//   updateCategory: async (id, updates) => {
//     const { data, error } = await supabase
//       .from("menu_categories")
//       .update(updates)
//       .eq("id", id)
//       .select()
//       .single();

//     if (error) throw error;
//     return data;
//   },

//   deleteCategory: async (id) => {
//     const { error } = await supabase
//       .from("menu_categories")
//       .delete()
//       .eq("id", id);

//     if (error) throw error;
//     return true;
//   },
// };

// export const menuItemsApi = {
//   getMenuItems: async () => {
//     const { data, error } = await supabase
//       .from("menu_items")
//       .select(
//         `
//         *,
//         menu_categories (name, name_en)
//       `
//       )
//       .order("sort_order", { ascending: true });

//     if (error) throw error;
//     return data;
//   },

//   getMenuItemsByCategory: async (categoryId) => {
//     const { data, error } = await supabase
//       .from("menu_items")
//       .select("*")
//       .eq("category_id", categoryId)
//       .order("sort_order", { ascending: true });

//     if (error) throw error;
//     return data;
//   },

//   createMenuItem: async (itemData, imageFile = null) => {
//     try {
//       // Upload image if provided
//       if (imageFile) {
//         const imageUrl = await storageApi.uploadFile(imageFile);
//         itemData.image = imageUrl;
//       }

//       const { data, error } = await supabase
//         .from("menu_items")
//         .insert([itemData])
//         .select()
//         .single();

//       if (error) throw error;
//       return data;
//     } catch (error) {
//       console.error("Create menu item error:", error);
//       throw error;
//     }
//   },

//   updateMenuItem: async (id, updates, imageFile = null) => {
//     try {
//       // Upload new image if provided
//       if (imageFile) {
//         const imageUrl = await storageApi.uploadFile(imageFile);
//         updates.image = imageUrl;
//       }

//       const { data, error } = await supabase
//         .from("menu_items")
//         .update(updates)
//         .eq("id", id)
//         .select()
//         .single();

//       if (error) throw error;
//       return data;
//     } catch (error) {
//       console.error("Update menu item error:", error);
//       throw error;
//     }
//   },

//   deleteMenuItem: async (id) => {
//     const { error } = await supabase.from("menu_items").delete().eq("id", id);

//     if (error) throw error;
//     return true;
//   },
// };

// // Authentication API
// export const authApi = {
//   login: async (email, password) => {
//     // For demo - in production use proper auth
//     const { data, error } = await supabase
//       .from("admins")
//       .select("*")
//       .eq("email", email)
//       .single();

//     if (error) throw error;

//     // Simple password check - in production use hashing
//     if (data && password === "admin123") {
//       return data;
//     } else {
//       throw new Error("بيانات الدخول غير صحيحة");
//     }
//   },

//   logout: async () => {
//     // Clear local storage or session
//     localStorage.removeItem("adminAuthenticated");
//     return true;
//   },

//   checkAuth: async () => {
//     const auth = localStorage.getItem("adminAuthenticated");
//     return !!auth;
//   },
// };

// // Statistics API
// export const statsApi = {
//   getDashboardStats: async () => {
//     // Mock data for now - can be replaced with real queries
//     return {
//       totalOrders: 1234,
//       dailyRevenue: 2450,
//       menuItems: 24,
//       activeUsers: 156,
//     };
//   },

//   getRecentOrders: async () => {
//     // Mock recent orders
//     return [
//       { id: 1, customer: "أحمد محمد", total: "150 جنية", status: "مكتمل" },
//       {
//         id: 2,
//         customer: "فاطمة علي",
//         total: "200 جنية",
//         status: "قيد التجهيز",
//       },
//       { id: 3, customer: "خالد إبراهيم", total: "120 جنية", status: "مكتمل" },
//     ];
//   },
// };

// // Export all APIs together
// export const adminApi = {
//   home: homeApi,
//   featuredDishes: featuredDishesApi,
//   offers: offersApi,
//   menuCategories: menuCategoriesApi,
//   menuItems: menuItemsApi,
//   auth: authApi,
//   stats: statsApi,
// };

// export default adminApi;



import { supabase } from "./supabase";
import { storageApi } from "./storage";

// Home Slides API
export const homeApi = {
  // Get all slides
  getSlides: async () => {
    const { data, error } = await supabase
      .from("home_slides")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data;
  },

  // Create slide
  createSlide: async (slideData, imageFile = null) => {
    try {
      // Upload image if provided
      if (imageFile) {
        const imageUrl = await storageApi.uploadFile(imageFile);
        slideData.image = imageUrl;
      }

      // تأكد من أن البيانات تتطابق مع أسماء الأعمدة في الجدول
      const dataToInsert = {
        title: slideData.title,
        subtitle: slideData.subtitle,
        description: slideData.description, // هذا هو العمود الصحيح
        image: slideData.image,
        button_text: slideData.button_text,
        bg_color: slideData.bg_color,
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

  // Update slide
  updateSlide: async (id, updates, imageFile = null) => {
    try {
      // Upload new image if provided
      if (imageFile) {
        const imageUrl = await storageApi.uploadFile(imageFile);
        updates.image = imageUrl;
      }

      // تأكد من أسماء الأعمدة
      const dataToUpdate = {};
      if (updates.title !== undefined) dataToUpdate.title = updates.title;
      if (updates.subtitle !== undefined)
        dataToUpdate.subtitle = updates.subtitle;
      if (updates.description !== undefined)
        dataToUpdate.description = updates.description;
      if (updates.image !== undefined) dataToUpdate.image = updates.image;
      if (updates.button_text !== undefined)
        dataToUpdate.button_text = updates.button_text;
      if (updates.bg_color !== undefined)
        dataToUpdate.bg_color = updates.bg_color;
      if (updates.sort_order !== undefined)
        dataToUpdate.sort_order = updates.sort_order;
      if (updates.is_active !== undefined)
        dataToUpdate.is_active = updates.is_active;

      const { data, error } = await supabase
        .from("home_slides")
        .update(dataToUpdate)
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

  // Delete slide
  deleteSlide: async (id) => {
    const { error } = await supabase.from("home_slides").delete().eq("id", id);

    if (error) throw error;
    return true;
  },
};

// Featured Dishes API
export const featuredDishesApi = {
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
      // Upload image if provided
      if (imageFile) {
        const imageUrl = await storageApi.uploadFile(imageFile);
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
      // Upload new image if provided
      if (imageFile) {
        const imageUrl = await storageApi.uploadFile(imageFile);
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
export const offersApi = {
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
      // Upload image if provided
      if (imageFile) {
        const imageUrl = await storageApi.uploadFile(imageFile);
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
      // Upload new image if provided
      if (imageFile) {
        const imageUrl = await storageApi.uploadFile(imageFile);
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

// Categories API - الجديد
export const categoriesApi = {
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
      // Upload image if provided
      if (imageFile) {
        const imageUrl = await storageApi.uploadFile(imageFile);
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
      // Upload new image if provided
      if (imageFile) {
        const imageUrl = await storageApi.uploadFile(imageFile);
        updates.image_url = imageUrl;
      }

      const dataToUpdate = {};
      if (updates.name_ar !== undefined) dataToUpdate.name_ar = updates.name_ar;
      if (updates.name_en !== undefined) dataToUpdate.name_en = updates.name_en;
      if (updates.description !== undefined)
        dataToUpdate.description = updates.description;
      if (updates.image_url !== undefined)
        dataToUpdate.image_url = updates.image_url;
      if (updates.sort_order !== undefined)
        dataToUpdate.sort_order = updates.sort_order;
      if (updates.is_active !== undefined)
        dataToUpdate.is_active = updates.is_active;

      const { data, error } = await supabase
        .from("categories")
        .update(dataToUpdate)
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

// باقي ال APIs...
export const menuCategoriesApi = {
  getCategories: async () => {
    const { data, error } = await supabase
      .from("menu_categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data;
  },

  createCategory: async (categoryData) => {
    const { data, error } = await supabase
      .from("menu_categories")
      .insert([categoryData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  updateCategory: async (id, updates) => {
    const { data, error } = await supabase
      .from("menu_categories")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  deleteCategory: async (id) => {
    const { error } = await supabase
      .from("menu_categories")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  },
};

export const menuItemsApi = {
  getMenuItems: async () => {
    const { data, error } = await supabase
      .from("menu_items")
      .select(
        `
        *,
        menu_categories (name, name_en)
      `
      )
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data;
  },

  getMenuItemsByCategory: async (categoryId) => {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("category_id", categoryId)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data;
  },

  createMenuItem: async (itemData, imageFile = null) => {
    try {
      // Upload image if provided
      if (imageFile) {
        const imageUrl = await storageApi.uploadFile(imageFile);
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

  updateMenuItem: async (id, updates, imageFile = null) => {
    try {
      // Upload new image if provided
      if (imageFile) {
        const imageUrl = await storageApi.uploadFile(imageFile);
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

  deleteMenuItem: async (id) => {
    const { error } = await supabase.from("menu_items").delete().eq("id", id);

    if (error) throw error;
    return true;
  },
};

// Authentication API
export const authApi = {
  login: async (email, password) => {
    // For demo - in production use proper auth
    const { data, error } = await supabase
      .from("admins")
      .select("*")
      .eq("email", email)
      .single();

    if (error) throw error;

    // Simple password check - in production use hashing
    if (data && password === "admin123") {
      return data;
    } else {
      throw new Error("بيانات الدخول غير صحيحة");
    }
  },

  logout: async () => {
    // Clear local storage or session
    localStorage.removeItem("adminAuthenticated");
    return true;
  },

  checkAuth: async () => {
    const auth = localStorage.getItem("adminAuthenticated");
    return !!auth;
  },
};

// Statistics API
export const statsApi = {
  getDashboardStats: async () => {
    // Mock data for now - can be replaced with real queries
    return {
      totalOrders: 1234,
      dailyRevenue: 2450,
      menuItems: 24,
      activeUsers: 156,
    };
  },

  getRecentOrders: async () => {
    // Mock recent orders
    return [
      { id: 1, customer: "أحمد محمد", total: "150 جنية", status: "مكتمل" },
      {
        id: 2,
        customer: "فاطمة علي",
        total: "200 جنية",
        status: "قيد التجهيز",
      },
      { id: 3, customer: "خالد إبراهيم", total: "120 جنية", status: "مكتمل" },
    ];
  },
};

// Export all APIs together
export const adminApi = {
  home: homeApi,
  featuredDishes: featuredDishesApi,
  offers: offersApi,
  categories: categoriesApi, // تمت الإضافة
  menuCategories: menuCategoriesApi,
  menuItems: menuItemsApi,
  auth: authApi,
  stats: statsApi,
};

export default adminApi;
