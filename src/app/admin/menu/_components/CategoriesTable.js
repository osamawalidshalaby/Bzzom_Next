import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "../../../_services/adminApi";
import toast from "react-hot-toast";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";

export default function CategoriesTable({ data, isLoading, onAddNew, onEdit }) {
  const queryClient = useQueryClient();

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }) =>
      adminApi.menuCategories.updateCategory(id, { is_active: isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries(["menu-categories"]);
      toast.success("تم تحديث الحالة بنجاح!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminApi.menuCategories.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["menu-categories"]);
      toast.success("تم حذف الفئة بنجاح!");
    },
  });

  const toggleActive = (id) => {
    const category = data.find((item) => item.id === id);
    if (!category) return;

    const newActiveState = !category.is_active;
    toggleMutation.mutate({ id, isActive: newActiveState });
  };

  const deleteCategory = (id) => {
    if (
      !confirm(
        "هل أنت متأكد من حذف هذه الفئة؟ سيتم حذف جميع الأصناف المرتبطة بها."
      )
    )
      return;
    deleteMutation.mutate(id);
  };

  const isMutationPending =
    toggleMutation.isPending || deleteMutation.isPending;

  return (
    <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-[#C49A6C]/20 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">فئات الطعام</h3>
        <button
          onClick={onAddNew}
          className="bg-[#C49A6C] hover:bg-[#B8895A] text-black px-3 sm:px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm sm:text-base"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">إضافة فئة جديدة</span>
          <span className="sm:hidden">إضافة فئة</span>
        </button>
      </div>

      {isLoading ? (
        <div className="p-8 text-center">
          <div className="inline-block w-6 h-6 border-2 border-[#C49A6C] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white/60 mt-2">جارٍ التحميل...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="p-8 text-center">
          <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Plus className="w-6 h-6 text-white/30" />
          </div>
          <p className="text-white/60">لا توجد فئات</p>
          <button
            onClick={onAddNew}
            className="mt-4 bg-[#C49A6C] hover:bg-[#B8895A] text-black px-4 py-2 rounded-lg transition-colors"
          >
            إضافة أول فئة
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-zinc-800">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-right text-xs sm:text-sm font-medium text-white/70">
                  اسم الفئة
                </th>
                <th className="px-4 sm:px-6 py-3 text-right text-xs sm:text-sm font-medium text-white/70">
                  الاسم بالإنجليزية
                </th>
                <th className="px-4 sm:px-6 py-3 text-right text-xs sm:text-sm font-medium text-white/70">
                  ترتيب العرض
                </th>
                <th className="px-4 sm:px-6 py-3 text-right text-xs sm:text-sm font-medium text-white/70">
                  الحالة
                </th>
                <th className="px-4 sm:px-6 py-3 text-right text-xs sm:text-sm font-medium text-white/70">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C49A6C]/10">
              {data.map((category) => (
                <tr key={category.id} className="hover:bg-zinc-800/50">
                  <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-white">
                    {category.name}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-white/70">
                    {category.name_en || "-"}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-white">
                    {category.sort_order}
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        category.is_active
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {category.is_active ? "نشط" : "غير نشط"}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <button
                        onClick={() => toggleActive(category.id)}
                        disabled={isMutationPending}
                        className={`p-1 rounded ${
                          category.is_active
                            ? "text-green-400 hover:bg-green-500/20"
                            : "text-red-400 hover:bg-red-500/20"
                        } disabled:opacity-50`}
                        title={category.is_active ? "إخفاء" : "إظهار"}
                      >
                        {category.is_active ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => onEdit(category)}
                        className="p-1 rounded text-blue-400 hover:bg-blue-500/20"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteCategory(category.id)}
                        disabled={isMutationPending}
                        className="p-1 rounded text-red-400 hover:bg-red-500/20 disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
