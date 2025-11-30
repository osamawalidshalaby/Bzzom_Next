import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "../../../_services/adminApi";
import toast from "react-hot-toast";
import { X, Image as ImageIcon } from "lucide-react";

export default function MenuItemModal({ editingItem, categories, onClose }) {
  const [formData, setFormData] = useState({
    name: editingItem?.name || "",
    name_en: editingItem?.name_en || "",
    category_id: editingItem?.category_id || "",
    price: editingItem?.price || "",
    description: editingItem?.description || "",
    sort_order: editingItem?.sort_order || 0,
    is_active:
      editingItem?.is_active !== undefined ? editingItem?.is_active : true,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(editingItem?.image || "");
  const queryClient = useQueryClient();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const createMutation = useMutation({
    mutationFn: (data) => adminApi.menuItems.createMenuItem(data, imageFile),
    onSuccess: () => {
      queryClient.invalidateQueries(["menu-items"]);
      toast.success("تم إضافة الصنف بنجاح!");
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) =>
      adminApi.menuItems.updateMenuItem(id, data, imageFile),
    onSuccess: () => {
      queryClient.invalidateQueries(["menu-items"]);
      toast.success("تم تحديث الصنف بنجاح!");
      onClose();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 border-b border-[#C49A6C]/20 flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-bold text-[#C49A6C]">
            {editingItem ? "تعديل الصنف" : "إضافة صنف جديد"}
          </h3>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 space-y-4 sm:space-y-6"
        >
          {/* Image Upload */}
          <div>
            <label className="block text-white font-medium mb-2">
              صورة الصنف
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1 w-full">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#C49A6C] file:text-black hover:file:bg-[#B8895A]"
                />
              </div>
              {imagePreview && (
                <div className="relative shrink-0">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-medium mb-2">
                اسم الصنف (عربي) *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C] transition-colors"
                placeholder="أدخل اسم الصنف بالعربية"
                required
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                اسم الصنف (إنجليزي)
              </label>
              <input
                type="text"
                value={formData.name_en}
                onChange={(e) =>
                  setFormData({ ...formData, name_en: e.target.value })
                }
                className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C] transition-colors"
                placeholder="أدخل اسم الصنف بالإنجليزية"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-medium mb-2">
                الفئة *
              </label>
              <select
                value={formData.category_id}
                onChange={(e) =>
                  setFormData({ ...formData, category_id: e.target.value })
                }
                className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C49A6C] transition-colors"
                required
              >
                <option value="">اختر الفئة</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                السعر *
              </label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C] transition-colors"
                placeholder="مثال: 65 جنية"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">الوصف</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C] transition-colors"
              placeholder="أدخل وصف الصنف"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-medium mb-2">
                ترتيب العرض
              </label>
              <input
                type="number"
                value={formData.sort_order}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sort_order: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C] transition-colors"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-white font-medium mb-2">
                الحالة
              </label>
              <select
                value={formData.is_active}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    is_active: e.target.value === "true",
                  })
                }
                className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C49A6C] transition-colors"
              >
                <option value={true}>نشط</option>
                <option value={false}>غير نشط</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white px-4 sm:px-6 py-3 rounded-lg transition-colors order-2 sm:order-1"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-[#C49A6C] hover:bg-[#B8895A] disabled:bg-[#C49A6C]/50 text-black font-bold px-4 sm:px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 order-1 sm:order-2"
            >
              {isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  {editingItem ? "جاري التحديث..." : "جاري الإضافة..."}
                </>
              ) : editingItem ? (
                "تحديث"
              ) : (
                "إضافة"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
