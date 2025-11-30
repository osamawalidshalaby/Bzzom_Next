// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { adminApi } from "../../../_services/adminApi";
// import toast from "react-hot-toast";
// import {
//   Plus,
//   Edit,
//   Trash2,
//   Eye,
//   EyeOff,
//   Image as ImageIcon,
// } from "lucide-react";

// export default function DataTable({
//   type,
//   data,
//   columns,
//   isLoading,
//   onAddNew,
//   onEdit,
// }) {
//   const queryClient = useQueryClient();

//   // Toggle mutations
//   const toggleSlideMutation = useMutation({
//     mutationFn: ({ id, isActive }) =>
//       adminApi.home.updateSlide(id, { is_active: isActive }),
//     onSuccess: () => {
//       queryClient.invalidateQueries(["home-slides"]);
//       toast.success("تم تحديث الحالة بنجاح!");
//     },
//   });

//   const toggleDishMutation = useMutation({
//     mutationFn: ({ id, isActive }) =>
//       adminApi.featuredDishes.updateFeaturedDish(id, { is_active: isActive }),
//     onSuccess: () => {
//       queryClient.invalidateQueries(["featured-dishes"]);
//       toast.success("تم تحديث الحالة بنجاح!");
//     },
//   });

//   const toggleOfferMutation = useMutation({
//     mutationFn: ({ id, isActive }) =>
//       adminApi.offers.updateOffer(id, { is_active: isActive }),
//     onSuccess: () => {
//       queryClient.invalidateQueries(["offers"]);
//       toast.success("تم تحديث الحالة بنجاح!");
//     },
//   });

//   // Delete mutations
//   const deleteSlideMutation = useMutation({
//     mutationFn: (id) => adminApi.home.deleteSlide(id),
//     onSuccess: () => {
//       queryClient.invalidateQueries(["home-slides"]);
//       toast.success("تم حذف الشريحة بنجاح!");
//     },
//   });

//   const deleteDishMutation = useMutation({
//     mutationFn: (id) => adminApi.featuredDishes.deleteFeaturedDish(id),
//     onSuccess: () => {
//       queryClient.invalidateQueries(["featured-dishes"]);
//       toast.success("تم حذف الطبق بنجاح!");
//     },
//   });

//   const deleteOfferMutation = useMutation({
//     mutationFn: (id) => adminApi.offers.deleteOffer(id),
//     onSuccess: () => {
//       queryClient.invalidateQueries(["offers"]);
//       toast.success("تم حذف العرض بنجاح!");
//     },
//   });

//   const toggleActive = (id) => {
//     const item = data.find((item) => item.id === id);
//     if (!item) return;

//     const newActiveState = !item.is_active;

//     switch (type) {
//       case "slides":
//         toggleSlideMutation.mutate({ id, isActive: newActiveState });
//         break;
//       case "dishes":
//         toggleDishMutation.mutate({ id, isActive: newActiveState });
//         break;
//       case "offers":
//         toggleOfferMutation.mutate({ id, isActive: newActiveState });
//         break;
//     }
//   };

//   const deleteItem = (id) => {
//     if (!confirm("هل أنت متأكد من حذف هذا العنصر؟")) return;

//     switch (type) {
//       case "slides":
//         deleteSlideMutation.mutate(id);
//         break;
//       case "dishes":
//         deleteDishMutation.mutate(id);
//         break;
//       case "offers":
//         deleteOfferMutation.mutate(id);
//         break;
//     }
//   };

//   const getTableTitle = () => {
//     switch (type) {
//       case "slides":
//         return "الشرائح الرئيسية";
//       case "dishes":
//         return "الأطباق المميزة";
//       case "offers":
//         return "العروض الخاصة";
//       default:
//         return "";
//     }
//   };

//   const getCellContent = (item, column) => {
//     switch (column) {
//       case "الاسم":
//         return item.name;
//       case "العنوان":
//         return item.title;
//       case "السعر":
//         return item.price;
//       case "الوصف":
//         return item.subtitle || item.description || "";
//       case "الحالة":
//         return (
//           <span
//             className={`px-2 py-1 rounded-full text-xs ${
//               item.is_active
//                 ? "bg-green-500/20 text-green-400"
//                 : "bg-red-500/20 text-red-400"
//             }`}
//           >
//             {item.is_active ? "نشط" : "غير نشط"}
//           </span>
//         );
//       default:
//         return "";
//     }
//   };

//   const isMutationPending =
//     toggleSlideMutation.isPending ||
//     toggleDishMutation.isPending ||
//     toggleOfferMutation.isPending ||
//     deleteSlideMutation.isPending ||
//     deleteDishMutation.isPending ||
//     deleteOfferMutation.isPending;

//   return (
//     <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 overflow-hidden">
//       <div className="p-4 sm:p-6 border-b border-[#C49A6C]/20 flex items-center justify-between">
//         <h3 className="text-lg font-bold text-white">{getTableTitle()}</h3>
//         <button
//           onClick={onAddNew}
//           className="bg-[#C49A6C] hover:bg-[#B8895A] text-black px-3 sm:px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm sm:text-base"
//         >
//           <Plus className="w-4 h-4" />
//           <span className="hidden sm:inline">إضافة جديد</span>
//           <span className="sm:hidden">إضافة</span>
//         </button>
//       </div>

//       {isLoading ? (
//         <div className="p-8 text-center">
//           <div className="inline-block w-6 h-6 border-2 border-[#C49A6C] border-t-transparent rounded-full animate-spin"></div>
//           <p className="text-white/60 mt-2">جارٍ التحميل...</p>
//         </div>
//       ) : data.length === 0 ? (
//         <div className="p-8 text-center">
//           <ImageIcon className="w-12 h-12 text-white/30 mx-auto mb-4" />
//           <p className="text-white/60">لا توجد بيانات</p>
//         </div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="w-full min-w-[600px]">
//             <thead className="bg-zinc-800">
//               <tr>
//                 {columns.map((col, idx) => (
//                   <th
//                     key={idx}
//                     className="px-4 sm:px-6 py-3 text-right text-xs sm:text-sm font-medium text-white/70"
//                   >
//                     {col}
//                   </th>
//                 ))}
//                 <th className="px-4 sm:px-6 py-3 text-right text-xs sm:text-sm font-medium text-white/70">
//                   الصورة
//                 </th>
//                 <th className="px-4 sm:px-6 py-3 text-right text-xs sm:text-sm font-medium text-white/70">
//                   الإجراءات
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-[#C49A6C]/10">
//               {data.map((item) => (
//                 <tr key={item.id} className="hover:bg-zinc-800/50">
//                   {columns.map((column, idx) => (
//                     <td
//                       key={idx}
//                       className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-white"
//                     >
//                       {getCellContent(item, column)}
//                     </td>
//                   ))}
//                   <td className="px-4 sm:px-6 py-4">
//                     {item.image ? (
//                       <img
//                         src={item.image}
//                         alt={item.title || item.name}
//                         className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover"
//                       />
//                     ) : (
//                       <div className="w-10 h-10 sm:w-12 sm:h-12 bg-zinc-800 rounded-lg flex items-center justify-center">
//                         <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white/30" />
//                       </div>
//                     )}
//                   </td>
//                   <td className="px-4 sm:px-6 py-4">
//                     <div className="flex items-center gap-1 sm:gap-2">
//                       <button
//                         onClick={() => toggleActive(item.id)}
//                         disabled={isMutationPending}
//                         className={`p-1 rounded ${
//                           item.is_active
//                             ? "text-green-400 hover:bg-green-500/20"
//                             : "text-red-400 hover:bg-red-500/20"
//                         } disabled:opacity-50`}
//                         title={item.is_active ? "إخفاء" : "إظهار"}
//                       >
//                         {item.is_active ? (
//                           <Eye className="w-4 h-4" />
//                         ) : (
//                           <EyeOff className="w-4 h-4" />
//                         )}
//                       </button>
//                       <button
//                         onClick={() => onEdit(item)}
//                         className="p-1 rounded text-blue-400 hover:bg-blue-500/20"
//                       >
//                         <Edit className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => deleteItem(item.id)}
//                         disabled={isMutationPending}
//                         className="p-1 rounded text-red-400 hover:bg-red-500/20 disabled:opacity-50"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }



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

export default function DataTable({
  type,
  data,
  columns,
  isLoading,
  onAddNew,
  onEdit,
}) {
  const queryClient = useQueryClient();

  // Toggle mutations
  const toggleSlideMutation = useMutation({
    mutationFn: ({ id, isActive }) =>
      adminApi.home.updateSlide(id, { is_active: isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries(["home-slides"]);
      toast.success("تم تحديث الحالة بنجاح!");
    },
  });

  const toggleDishMutation = useMutation({
    mutationFn: ({ id, isActive }) =>
      adminApi.featuredDishes.updateFeaturedDish(id, { is_active: isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries(["featured-dishes"]);
      toast.success("تم تحديث الحالة بنجاح!");
    },
  });

  const toggleOfferMutation = useMutation({
    mutationFn: ({ id, isActive }) =>
      adminApi.offers.updateOffer(id, { is_active: isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries(["offers"]);
      toast.success("تم تحديث الحالة بنجاح!");
    },
  });

  const toggleCategoryMutation = useMutation({
    mutationFn: ({ id, isActive }) =>
      adminApi.categories.updateCategory(id, { is_active: isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      toast.success("تم تحديث الحالة بنجاح!");
    },
  });

  // Delete mutations
  const deleteSlideMutation = useMutation({
    mutationFn: (id) => adminApi.home.deleteSlide(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["home-slides"]);
      toast.success("تم حذف الشريحة بنجاح!");
    },
  });

  const deleteDishMutation = useMutation({
    mutationFn: (id) => adminApi.featuredDishes.deleteFeaturedDish(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["featured-dishes"]);
      toast.success("تم حذف الطبق بنجاح!");
    },
  });

  const deleteOfferMutation = useMutation({
    mutationFn: (id) => adminApi.offers.deleteOffer(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["offers"]);
      toast.success("تم حذف العرض بنجاح!");
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id) => adminApi.categories.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      toast.success("تم حذف التصنيف بنجاح!");
    },
  });

  const toggleActive = (id) => {
    const item = data.find((item) => item.id === id);
    if (!item) return;

    const newActiveState = !item.is_active;

    switch (type) {
      case "slides":
        toggleSlideMutation.mutate({ id, isActive: newActiveState });
        break;
      case "dishes":
        toggleDishMutation.mutate({ id, isActive: newActiveState });
        break;
      case "offers":
        toggleOfferMutation.mutate({ id, isActive: newActiveState });
        break;
      case "categories":
        toggleCategoryMutation.mutate({ id, isActive: newActiveState });
        break;
    }
  };

  const deleteItem = (id) => {
    if (!confirm("هل أنت متأكد من حذف هذا العنصر؟")) return;

    switch (type) {
      case "slides":
        deleteSlideMutation.mutate(id);
        break;
      case "dishes":
        deleteDishMutation.mutate(id);
        break;
      case "offers":
        deleteOfferMutation.mutate(id);
        break;
      case "categories":
        deleteCategoryMutation.mutate(id);
        break;
    }
  };

  const getTableTitle = () => {
    switch (type) {
      case "slides":
        return "الشرائح الرئيسية";
      case "dishes":
        return "الأطباق المميزة";
      case "offers":
        return "العروض الخاصة";
      case "categories":
        return "التصنيفات";
      default:
        return "";
    }
  };

  const getCellContent = (item, column) => {
    switch (column) {
      case "الاسم":
        return item.name || item.name_ar;
      case "العنوان":
        return item.title;
      case "السعر":
        return item.price;
      case "الوصف":
        return item.subtitle || item.description || "";
      case "الاسم العربي":
        return item.name_ar;
      case "الاسم الإنجليزي":
        return item.name_en;
      case "الحالة":
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              item.is_active
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {item.is_active ? "نشط" : "غير نشط"}
          </span>
        );
      default:
        return "";
    }
  };

  const getImageUrl = (item) => {
    return item.image || item.image_url;
  };

  const isMutationPending =
    toggleSlideMutation.isPending ||
    toggleDishMutation.isPending ||
    toggleOfferMutation.isPending ||
    toggleCategoryMutation.isPending ||
    deleteSlideMutation.isPending ||
    deleteDishMutation.isPending ||
    deleteOfferMutation.isPending ||
    deleteCategoryMutation.isPending;

  return (
    <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-[#C49A6C]/20 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">{getTableTitle()}</h3>
        <button
          onClick={onAddNew}
          className="bg-[#C49A6C] hover:bg-[#B8895A] text-black px-3 sm:px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm sm:text-base"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">إضافة جديد</span>
          <span className="sm:hidden">إضافة</span>
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
          <p className="text-white/60">لا توجد بيانات</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-zinc-800">
              <tr>
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    className="px-4 sm:px-6 py-3 text-right text-xs sm:text-sm font-medium text-white/70"
                  >
                    {col}
                  </th>
                ))}
                <th className="px-4 sm:px-6 py-3 text-right text-xs sm:text-sm font-medium text-white/70">
                  الصورة
                </th>
                <th className="px-4 sm:px-6 py-3 text-right text-xs sm:text-sm font-medium text-white/70">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C49A6C]/10">
              {data.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-800/50">
                  {columns.map((column, idx) => (
                    <td
                      key={idx}
                      className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-white"
                    >
                      {getCellContent(item, column)}
                    </td>
                  ))}
                  <td className="px-4 sm:px-6 py-4">
                    {getImageUrl(item) ? (
                      <img
                        src={getImageUrl(item)}
                        alt={item.title || item.name || item.name_ar}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-zinc-800 rounded-lg flex items-center justify-center">
                        <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white/30" />
                      </div>
                    )}
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
