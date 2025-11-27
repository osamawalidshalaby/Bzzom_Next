import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "../../../_services/adminApi";
import toast from "react-hot-toast";
import { X } from "lucide-react";

export default function CategoryModal({ editingCategory, onClose }) {
  const [formData, setFormData] = useState({
    name: editingCategory?.name || "",
    name_en: editingCategory?.name_en || "",
    sort_order: editingCategory?.sort_order || 0,
    is_active:
      editingCategory?.is_active !== undefined
        ? editingCategory?.is_active
        : true,
  });

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data) => adminApi.menuCategories.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["menu-categories"]);
      toast.success("تم إضافة الفئة بنجاح!");
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) =>
      adminApi.menuCategories.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["menu-categories"]);
      toast.success("تم تحديث الفئة بنجاح!");
      onClose();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 border-b border-[#C49A6C]/20 flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-bold text-[#C49A6C]">
            {editingCategory ? "تعديل الفئة" : "إضافة فئة جديدة"}
          </h3>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 space-y-4 sm:space-y-6"
        >
          <div>
            <label className="block text-white font-medium mb-2">
              اسم الفئة (عربي) *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C] transition-colors"
              placeholder="أدخل اسم الفئة بالعربية"
              required
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              اسم الفئة (إنجليزي)
            </label>
            <input
              type="text"
              value={formData.name_en}
              onChange={(e) =>
                setFormData({ ...formData, name_en: e.target.value })
              }
              className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C] transition-colors"
              placeholder="أدخل اسم الفئة بالإنجليزية"
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
                  {editingCategory ? "جاري التحديث..." : "جاري الإضافة..."}
                </>
              ) : editingCategory ? (
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
