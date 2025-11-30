import { supabase } from "./supabase";

export const storageApi = {
  // Upload image to storage - معدل
  uploadFile: async (file, folder = "uploads") => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      console.log("Attempting to upload file:", filePath);

      const { data, error } = await supabase.storage
        .from("images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Supabase upload error:", error);
        throw new Error(`فشل في رفع الملف: ${error.message}`);
      }

      console.log("Upload successful, data:", data);

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("images").getPublicUrl(data.path);

      console.log("Public URL:", publicUrl);
      return publicUrl;
    } catch (error) {
      console.error("Upload error:", error);
      throw new Error(`فشل في رفع الملف: ${error.message}`);
    }
  },

  // Upload image with simpler approach
  uploadImage: async (file) => {
    return await storageApi.uploadFile(file, "images");
  },

  // Delete image from storage
  deleteImage: async (filePath) => {
    try {
      // Extract the path from URL if it's a full URL
      let path = filePath;
      if (filePath.includes("/storage/v1/object/public/images/")) {
        path = filePath.split("/storage/v1/object/public/images/")[1];
      }

      const { error } = await supabase.storage.from("images").remove([path]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error deleting image:", error);
      throw error;
    }
  },

  // List images in a folder
  listImages: async (folder = "") => {
    const { data, error } = await supabase.storage.from("images").list(folder);

    if (error) throw error;
    return data;
  },
};
