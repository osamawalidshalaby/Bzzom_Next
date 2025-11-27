import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "../../../_services/adminApi";
import toast from "react-hot-toast";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Image as ImageIcon,
} from "lucide-react";

export default function MenuItemsTable({
  data,
  categories,
  isLoading,
  onAddNew,
  onEdit,
}) {
  const queryClient = useQueryClient();

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }) =>
      adminApi.menuItems.updateMenuItem(id, { is_active: isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries(["menu-items"]);
      toast.success("تم تحديث الحالة بنجاح!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminApi.menuItems.deleteMenuItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["menu-items"]);
      toast.success("تم حذف الصنف بنجاح!");
    },
  });

  const toggleActive = (id) => {
    const item = data.find((item) => item.id === id);
    if (!item) return;

    const newActiveState = !item.is_active;
    toggleMutation.mutate({ id, isActive: newActiveState });
  };

  const deleteItem = (id) => {
    if (!confirm("هل أنت متأكد من حذف هذا الصنف؟")) return;
    deleteMutation.mutate(id);
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "غير معروف";
  };

  const isMutationPending =
    toggleMutation.isPending || deleteMutation.isPending;

  return (
    <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-[#C49A6C]/20 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">أصناف الطعام</h3>
        <button
          onClick={onAddNew}
          className="bg-[#C49A6C] hover:bg-[#B8895A] text-black px-3 sm:px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm sm:text-base"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">إضافة صنف جديد</span>
          <span className="sm:hidden">إضافة صنف</span>
        </button>
      </div>

      {isLoading ? (
        <div className="p-8 text-center">
          <div className="inline-block w-6 h-6 border-2 border-[#C49A6C] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white/60 mt-2">جارٍ التحميل...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="p-8 text-center">
          <ImageIcon className="w-12 h-12 text-white/30 mx-auto mb-4" />
          <p className="text-white/60">لا توجد أصناف</p>
          <button
            onClick={onAddNew}
            className="mt-4 bg-[#C49A6C] hover:bg-[#B8895A] text-black px-4 py-2 rounded-lg transition-colors"
          >
            إضافة أول صنف
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-zinc-800">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-right text-xs sm:text-sm font-medium text-white/70">
                  الصورة
                </th>
                <th className="px-4 sm:px-6 py-3 text-right text-xs sm:text-sm font-medium text-white/70">
                  اسم الصنف
                </th>
                <th className="px-4 sm:px-6 py-3 text-right text-xs sm:text-sm font-medium text-white/70">
                  الفئة
                </th>
                <th className="px-4 sm:px-6 py-3 text-right text-xs sm:text-sm font-medium text-white/70">
                  السعر
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
              {data.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-800/50">
                  <td className="px-4 sm:px-6 py-4">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-zinc-800 rounded-lg flex items-center justify-center">
                        <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white/30" />
                      </div>
                    )}
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="text-xs sm:text-sm text-white font-medium">
                      {item.name}
                    </div>
                    {item.name_en && (
                      <div className="text-xs text-white/60">
                        {item.name_en}
                      </div>
                    )}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-white">
                    {getCategoryName(item.category_id)}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-white font-medium">
                    {item.price}
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        item.is_active
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {item.is_active ? "نشط" : "غير نشط"}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <button
                        onClick={() => toggleActive(item.id)}
                        disabled={isMutationPending}
                        className={`p-1 rounded ${
                          item.is_active
                            ? "text-green-400 hover:bg-green-500/20"
                            : "text-red-400 hover:bg-red-500/20"
                        } disabled:opacity-50`}
                        title={item.is_active ? "إخفاء" : "إظهار"}
                      >
                        {item.is_active ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => onEdit(item)}
                        className="p-1 rounded text-blue-400 hover:bg-blue-500/20"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
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
