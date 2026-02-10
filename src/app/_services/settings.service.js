import { supabase } from "./supabase";
import { storageService } from "./storage.service";

/**
 * Settings Service
 * Handles app and restaurant settings and gallery
 */
export const settingsService = {
  // Get general settings
  getSettings: async () => {
    try {
      const { data, error } = await supabase
        .from("settings")
        .select("id, restaurant, app, created_at, updated_at")
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") throw error; // PGRST116 = no rows

      // If no settings found, return empty defaults
      if (!data) {
        return {
          restaurant: {
            name: "",
            phone: "",
            address: "",
            email: "",
            openingTime: "10:00",
            closingTime: "23:00",
            deliveryFee: "0",
            minOrderValue: "0",
            description: "",
            logo: "",
          },
          app: {
            maintenanceMode: false,
            enableOnlinePayment: true,
            enableCashPayment: true,
            enableDelivery: true,
            enableDineIn: true,
            ramadanBannerEnabled: false,
            discountCardEnabled: false,
            discountData: {
              title: "خصم خاص",
              percentage: "20",
              description: "استفد من خصم خاص على جميع الطلبات",
            },
            maxOrdersPerDay: "100",
            avgDeliveryTime: "30",
          },
        };
      }

      return data;
    } catch (error) {
      console.error("Get settings error:", error);
      return {};
    }
  },

  // Update general settings
  updateSettings: async (settings) => {
    try {
      // Get first settings ID if exists
      const { data: existingSettings } = await supabase
        .from("settings")
        .select("id")
        .limit(1)
        .single();

      let response;
      if (existingSettings?.id) {
        // Update existing
        response = await supabase
          .from("settings")
          .update({
            restaurant: settings.restaurant,
            app: settings.app,
          })
          .eq("id", existingSettings.id)
          .select()
          .single();
      } else {
        // Insert new
        response = await supabase
          .from("settings")
          .insert({
            restaurant: settings.restaurant,
            app: settings.app,
          })
          .select()
          .single();
      }

      if (response.error) throw response.error;
      return response.data;
    } catch (error) {
      console.error("Update settings error:", error);
      throw error;
    }
  },

  // Get restaurant settings
  getRestaurantSettings: async () => {
    try {
      const { data, error } = await supabase
        .from("restaurant_settings")
        .select("*")
        .single();

      if (error && error.code !== "PGRST116") throw error; // PGRST116 means no rows
      return (
        data || {
          name: "مطعم بزوم",
          phone: "01000000000",
          address: "عنوان المطعم",
          whatsapp_number: "201010882822",
          delivery_fee: 20,
          min_order_amount: 50,
          opening_hours: "10:00 - 02:00",
          is_open: true,
        }
      );
    } catch (error) {
      console.error("Get restaurant settings error:", error);
      return {
        name: "مطعم بزوم",
        phone: "01000000000",
        address: "عنوان المطعم",
        whatsapp_number: "201010882822",
        delivery_fee: 20,
        min_order_amount: 50,
        opening_hours: "10:00 - 02:00",
        is_open: true,
      };
    }
  },

  // Update restaurant settings
  updateRestaurantSettings: async (settings) => {
    try {
      const { data, error } = await supabase
        .from("restaurant_settings")
        .upsert(settings, { onConflict: "id" })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Update restaurant settings error:", error);
      throw error;
    }
  },

  // Gallery Management Functions
  // Get all gallery images
  getGalleryImages: async () => {
    try {
      const { data, error } = await supabase
        .from("restaurant_gallery")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Get gallery images error:", error);
      return [];
    }
  },

  // Upload gallery image
  uploadGalleryImage: async (imageFile, title = "") => {
    try {
      // Validate image file
      if (!imageFile) {
        throw new Error("Image file is required");
      }

      if (!imageFile.type.startsWith("image/")) {
        throw new Error("File must be an image");
      }

      // Upload image to storage
      const timestamp = Date.now();
      const filename = `gallery/${timestamp}_${imageFile.name}`;

      console.log("🖼️ Uploading image:", filename);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("restaurant-gallery")
        .upload(filename, imageFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("❌ Storage upload error:", uploadError);
        throw new Error(
          `Upload failed: ${uploadError.message || JSON.stringify(uploadError)}`,
        );
      }

      if (!uploadData) {
        throw new Error("No upload data returned from storage");
      }

      console.log("✅ Image uploaded to storage:", uploadData.path);

      // Get public URL
      try {
        const { data: urlData } = supabase.storage
          .from("restaurant-gallery")
          .getPublicUrl(filename);

        if (!urlData || !urlData.publicUrl) {
          throw new Error("Failed to get public URL");
        }

        console.log("✅ Public URL generated:", urlData.publicUrl);

        // Save to database
        const { data, error: dbError } = await supabase
          .from("restaurant_gallery")
          .insert({
            image_url: urlData.publicUrl,
            storage_path: uploadData.path,
            title: title || imageFile.name,
            sort_order: Math.floor(Date.now() / 1000),
          })
          .select()
          .single();

        if (dbError) {
          console.error("❌ Database insert error:", dbError);
          throw new Error(
            `Database insert failed: ${dbError.message || JSON.stringify(dbError)}`,
          );
        }

        if (!data) {
          throw new Error("No data returned from database insert");
        }

        console.log("✅ Gallery image saved to database:", data.id);
        return data;
      } catch (urlError) {
        console.error("❌ URL or DB error:", urlError);
        // Try to clean up uploaded file if database failed
        try {
          await supabase.storage.from("restaurant-gallery").remove([filename]);
        } catch (deleteError) {
          console.warn("⚠️ Could not delete uploaded file:", deleteError);
        }
        throw urlError;
      }
    } catch (error) {
      console.error("❌ Upload gallery image error:", error);
      throw error;
    }
  },

  // Add gallery image from URL
  addGalleryImageFromUrl: async (imageUrl, title = "") => {
    try {
      // Validate URL
      try {
        new URL(imageUrl);
      } catch {
        throw new Error("الرابط غير صحيح");
      }

      console.log("🔗 Adding image from URL:", imageUrl);

      // Save to database without storage_path (since it's from external URL)
      const { data, error: dbError } = await supabase
        .from("restaurant_gallery")
        .insert({
          image_url: imageUrl,
          storage_path: null,
          title: title || "صورة من الويب",
          is_external: true,
          sort_order: Math.floor(Date.now() / 1000),
        })
        .select()
        .single();

      if (dbError) {
        console.error("❌ Database insert error:", dbError);
        throw new Error(
          `Database insert failed: ${dbError.message || JSON.stringify(dbError)}`,
        );
      }

      if (!data) {
        throw new Error("No data returned from database insert");
      }

      console.log("✅ Gallery image from URL saved to database:", data.id);
      return data;
    } catch (error) {
      console.error("❌ Add gallery image from URL error:", error);
      throw error;
    }
  },

  // Delete gallery image
  deleteGalleryImage: async (id, storagePath) => {
    try {
      // Delete from storage
      if (storagePath) {
        const { error: storageError } = await supabase.storage
          .from("restaurant-gallery")
          .remove([storagePath]);

        if (storageError)
          console.warn("Storage deletion warning:", storageError);
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from("restaurant_gallery")
        .delete()
        .eq("id", id);

      if (dbError) throw dbError;
      return true;
    } catch (error) {
      console.error("Delete gallery image error:", error);
      throw error;
    }
  },

  // Update gallery image details
  updateGalleryImageDetails: async (id, updateData) => {
    try {
      const { data, error } = await supabase
        .from("restaurant_gallery")
        .update({
          title: updateData.title,
          description: updateData.description,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Update gallery image details error:", error);
      throw error;
    }
  },

  // Update gallery image order
  updateGalleryOrder: async (images) => {
    try {
      if (!Array.isArray(images)) {
        throw new Error("Invalid images payload, expected array");
      }

      // Update each image's sort_order individually to preserve correctness
      const results = await Promise.all(
        images.map(async (img, index) => {
          const sort_order = index * 10;
          try {
            const { data, error } = await supabase
              .from("restaurant_gallery")
              .update({ sort_order, updated_at: new Date().toISOString() })
              .eq("id", img.id)
              .select()
              .single();

            if (error) {
              console.warn(
                `⚠️ Failed to update gallery image ${img.id}:`,
                error,
              );
              return { id: img.id, success: false, error };
            }

            return { id: img.id, success: true, data };
          } catch (e) {
            console.warn(`⚠️ Exception updating gallery image ${img.id}:`, e);
            return { id: img.id, success: false, error: e };
          }
        }),
      );

      const failed = results.filter((r) => !r.success);
      if (failed.length > 0) {
        console.error("Update gallery order completed with failures:", failed);
        throw new Error("Failed to update some gallery items");
      }

      return true;
    } catch (error) {
      console.error("Update gallery order error:", error);
      throw error;
    }
  },
};

export default settingsService;
