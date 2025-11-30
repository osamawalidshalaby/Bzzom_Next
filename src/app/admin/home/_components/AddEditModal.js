// import { useState } from "react";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { adminApi } from "../../../_services/adminApi";
// import toast from "react-hot-toast";
// import { X, Image as ImageIcon } from "lucide-react";

// export default function AddEditModal({ type, editingItem, onClose }) {
//   const [formData, setFormData] = useState({
//     title: editingItem?.title || "",
//     subtitle: editingItem?.subtitle || "",
//     description: editingItem?.description || "",
//     name: editingItem?.name || "",
//     price: editingItem?.price || "",
//     original_price: editingItem?.original_price || "",
//     button_text: editingItem?.button_text || "",
//     bg_color: editingItem?.bg_color || "",
//     details: editingItem?.details || "",
//     sort_order: editingItem?.sort_order || 0,
//     is_active:
//       editingItem?.is_active !== undefined ? editingItem?.is_active : true,
//   });

//   const [imageFile, setImageFile] = useState(null);
//   const [imagePreview, setImagePreview] = useState(editingItem?.image || "");
//   const queryClient = useQueryClient();

//   // Handle image upload
//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImageFile(file);
//       const previewUrl = URL.createObjectURL(file);
//       setImagePreview(previewUrl);
//     }
//   };

//   // Create mutations
//   const createSlideMutation = useMutation({
//     mutationFn: (data) => adminApi.home.createSlide(data, imageFile),
//     onSuccess: () => {
//       queryClient.invalidateQueries(["home-slides"]);
//       toast.success("تم إضافة الشريحة بنجاح!");
//       onClose();
//     },
//   });

//   const createDishMutation = useMutation({
//     mutationFn: (data) =>
//       adminApi.featuredDishes.createFeaturedDish(data, imageFile),
//     onSuccess: () => {
//       queryClient.invalidateQueries(["featured-dishes"]);
//       toast.success("تم إضافة الطبق بنجاح!");
//       onClose();
//     },
//   });

//   const createOfferMutation = useMutation({
//     mutationFn: (data) => adminApi.offers.createOffer(data, imageFile),
//     onSuccess: () => {
//       queryClient.invalidateQueries(["offers"]);
//       toast.success("تم إضافة العرض بنجاح!");
//       onClose();
//     },
//   });

//   // Update mutations
//   const updateSlideMutation = useMutation({
//     mutationFn: ({ id, data }) =>
//       adminApi.home.updateSlide(id, data, imageFile),
//     onSuccess: () => {
//       queryClient.invalidateQueries(["home-slides"]);
//       toast.success("تم تحديث الشريحة بنجاح!");
//       onClose();
//     },
//   });

//   const updateDishMutation = useMutation({
//     mutationFn: ({ id, data }) =>
//       adminApi.featuredDishes.updateFeaturedDish(id, data, imageFile),
//     onSuccess: () => {
//       queryClient.invalidateQueries(["featured-dishes"]);
//       toast.success("تم تحديث الطبق بنجاح!");
//       onClose();
//     },
//   });

//   const updateOfferMutation = useMutation({
//     mutationFn: ({ id, data }) =>
//       adminApi.offers.updateOffer(id, data, imageFile),
//     onSuccess: () => {
//       queryClient.invalidateQueries(["offers"]);
//       toast.success("تم تحديث العرض بنجاح!");
//       onClose();
//     },
//   });

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (editingItem) {
//       // Update existing item
//       switch (type) {
//         case "slides":
//           updateSlideMutation.mutate({ id: editingItem.id, data: formData });
//           break;
//         case "dishes":
//           updateDishMutation.mutate({ id: editingItem.id, data: formData });
//           break;
//         case "offers":
//           updateOfferMutation.mutate({ id: editingItem.id, data: formData });
//           break;
//       }
//     } else {
//       // Create new item
//       switch (type) {
//         case "slides":
//           createSlideMutation.mutate(formData);
//           break;
//         case "dishes":
//           createDishMutation.mutate(formData);
//           break;
//         case "offers":
//           createOfferMutation.mutate(formData);
//           break;
//       }
//     }
//   };

//   const isPending =
//     createSlideMutation.isPending ||
//     createDishMutation.isPending ||
//     createOfferMutation.isPending ||
//     updateSlideMutation.isPending ||
//     updateDishMutation.isPending ||
//     updateOfferMutation.isPending;

//   const getModalTitle = () => {
//     const action = editingItem ? "تعديل" : "إضافة";
//     const itemType =
//       type === "slides" ? "شريحة" : type === "dishes" ? "طبق مميز" : "عرض";

//     return `${action} ${itemType}`;
//   };

//   const renderFormFields = () => {
//     switch (type) {
//       case "slides":
//         return (
//           <>
//             <div>
//               <label className="block text-white font-medium mb-2">
//                 العنوان
//               </label>
//               <input
//                 type="text"
//                 value={formData.title}
//                 onChange={(e) =>
//                   setFormData({ ...formData, title: e.target.value })
//                 }
//                 className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C] transition-colors"
//                 placeholder="أدخل العنوان"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-white font-medium mb-2">
//                 الوصف الفرعي
//               </label>
//               <input
//                 type="text"
//                 value={formData.subtitle}
//                 onChange={(e) =>
//                   setFormData({ ...formData, subtitle: e.target.value })
//                 }
//                 className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C] transition-colors"
//                 placeholder="أدخل الوصف الفرعي"
//               />
//             </div>
//             <div>
//               <label className="block text-white font-medium mb-2">الوصف</label>
//               <textarea
//                 value={formData.description}
//                 onChange={(e) =>
//                   setFormData({ ...formData, description: e.target.value })
//                 }
//                 rows={3}
//                 className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C] transition-colors"
//                 placeholder="أدخل الوصف الكامل"
//               />
//             </div>
//             <div>
//               <label className="block text-white font-medium mb-2">
//                 نص الزر
//               </label>
//               <input
//                 type="text"
//                 value={formData.button_text}
//                 onChange={(e) =>
//                   setFormData({ ...formData, button_text: e.target.value })
//                 }
//                 className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C] transition-colors"
//                 placeholder="مثال: اطلب الآن"
//               />
//             </div>
//           </>
//         );

//       case "dishes":
//         return (
//           <>
//             <div>
//               <label className="block text-white font-medium mb-2">
//                 اسم الطبق
//               </label>
//               <input
//                 type="text"
//                 value={formData.name}
//                 onChange={(e) =>
//                   setFormData({ ...formData, name: e.target.value })
//                 }
//                 className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C] transition-colors"
//                 placeholder="أدخل اسم الطبق"
//                 required
//               />
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-white font-medium mb-2">
//                   السعر
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.price}
//                   onChange={(e) =>
//                     setFormData({ ...formData, price: e.target.value })
//                   }
//                   className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C] transition-colors"
//                   placeholder="مثال: 65 جنية"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-white font-medium mb-2">
//                   السعر الأصلي
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.original_price}
//                   onChange={(e) =>
//                     setFormData({ ...formData, original_price: e.target.value })
//                   }
//                   className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C] transition-colors"
//                   placeholder="مثال: 80 جنية"
//                 />
//               </div>
//             </div>
//             <div>
//               <label className="block text-white font-medium mb-2">الوصف</label>
//               <textarea
//                 value={formData.description}
//                 onChange={(e) =>
//                   setFormData({ ...formData, description: e.target.value })
//                 }
//                 rows={3}
//                 className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C] transition-colors"
//                 placeholder="أدخل وصف الطبق"
//               />
//             </div>
//           </>
//         );

//       case "offers":
//         return (
//           <>
//             <div>
//               <label className="block text-white font-medium mb-2">
//                 عنوان العرض
//               </label>
//               <input
//                 type="text"
//                 value={formData.title}
//                 onChange={(e) =>
//                   setFormData({ ...formData, title: e.target.value })
//                 }
//                 className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C] transition-colors"
//                 placeholder="أدخل عنوان العرض"
//                 required
//               />
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-white font-medium mb-2">
//                   السعر
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.price}
//                   onChange={(e) =>
//                     setFormData({ ...formData, price: e.target.value })
//                   }
//                   className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C] transition-colors"
//                   placeholder="مثال: 200 جنية"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-white font-medium mb-2">
//                   السعر الأصلي
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.original_price}
//                   onChange={(e) =>
//                     setFormData({ ...formData, original_price: e.target.value })
//                   }
//                   className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C] transition-colors"
//                   placeholder="مثال: 250 جنية"
//                 />
//               </div>
//             </div>
//             <div>
//               <label className="block text-white font-medium mb-2">
//                 تفاصيل العرض
//               </label>
//               <textarea
//                 value={formData.details}
//                 onChange={(e) =>
//                   setFormData({ ...formData, details: e.target.value })
//                 }
//                 rows={3}
//                 className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C] transition-colors"
//                 placeholder="أدخل تفاصيل العرض"
//               />
//             </div>
//           </>
//         );
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
//       <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//         <div className="p-4 sm:p-6 border-b border-[#C49A6C]/20 flex items-center justify-between">
//           <h3 className="text-lg sm:text-xl font-bold text-[#C49A6C]">
//             {getModalTitle()}
//           </h3>
//           <button onClick={onClose} className="text-white/60 hover:text-white">
//             <X className="w-6 h-6" />
//           </button>
//         </div>

//         <form
//           onSubmit={handleSubmit}
//           className="p-4 sm:p-6 space-y-4 sm:space-y-6"
//         >
//           {/* Image Upload */}
//           <div>
//             <label className="block text-white font-medium mb-2">الصورة</label>
//             <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
//               <div className="flex-1 w-full">
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImageChange}
//                   className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#C49A6C] file:text-black hover:file:bg-[#B8895A]"
//                 />
//               </div>
//               {imagePreview && (
//                 <div className="relative flex-shrink-0">
//                   <img
//                     src={imagePreview}
//                     alt="Preview"
//                     className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover"
//                   />
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Dynamic Form Fields */}
//           {renderFormFields()}

//           {/* Common Fields */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-white font-medium mb-2">
//                 ترتيب العرض
//               </label>
//               <input
//                 type="number"
//                 value={formData.sort_order}
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     sort_order: parseInt(e.target.value) || 0,
//                   })
//                 }
//                 className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C] transition-colors"
//                 placeholder="0"
//               />
//             </div>
//             <div>
//               <label className="block text-white font-medium mb-2">
//                 الحالة
//               </label>
//               <select
//                 value={formData.is_active}
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     is_active: e.target.value === "true",
//                   })
//                 }
//                 className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C49A6C] transition-colors"
//               >
//                 <option value={true}>نشط</option>
//                 <option value={false}>غير نشط</option>
//               </select>
//             </div>
//           </div>

//           {/* Submit Button */}
//           <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white px-4 sm:px-6 py-3 rounded-lg transition-colors order-2 sm:order-1"
//             >
//               إلغاء
//             </button>
//             <button
//               type="submit"
//               disabled={isPending}
//               className="flex-1 bg-[#C49A6C] hover:bg-[#B8895A] disabled:bg-[#C49A6C]/50 text-black font-bold px-4 sm:px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 order-1 sm:order-2"
//             >
//               {isPending ? (
//                 <>
//                   <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
//                   {editingItem ? "جاري التحديث..." : "جاري الإضافة..."}
//                 </>
//               ) : editingItem ? (
//                 "تحديث"
//               ) : (
//                 "إضافة"
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }



import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "../../../_services/adminApi";
import toast from "react-hot-toast";
import { X, Image as ImageIcon } from "lucide-react";

export default function AddEditModal({ type, editingItem, onClose }) {
  const [formData, setFormData] = useState({
    title: editingItem?.title || "",
    subtitle: editingItem?.subtitle || "",
    description: editingItem?.description || "",
    name: editingItem?.name || "",
    name_ar: editingItem?.name_ar || "",
    name_en: editingItem?.name_en || "",
    price: editingItem?.price || "",
    original_price: editingItem?.original_price || "",
    button_text: editingItem?.button_text || "",
    bg_color: editingItem?.bg_color || "",
    details: editingItem?.details || "",
    sort_order: editingItem?.sort_order || 0,
    is_active:
      editingItem?.is_active !== undefined ? editingItem?.is_active : true,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(editingItem?.image || editingItem?.image_url || "");
  const queryClient = useQueryClient();

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Create mutations
  const createSlideMutation = useMutation({
    mutationFn: (data) => adminApi.home.createSlide(data, imageFile),
    onSuccess: () => {
      queryClient.invalidateQueries(["home-slides"]);
      toast.success("تم إضافة الشريحة بنجاح!");
      onClose();
    },
  });

  const createDishMutation = useMutation({
    mutationFn: (data) =>
      adminApi.featuredDishes.createFeaturedDish(data, imageFile),
    onSuccess: () => {
      queryClient.invalidateQueries(["featured-dishes"]);
      toast.success("تم إضافة الطبق بنجاح!");
      onClose();
    },
  });

  const createOfferMutation = useMutation({
    mutationFn: (data) => adminApi.offers.createOffer(data, imageFile),
    onSuccess: () => {
      queryClient.invalidateQueries(["offers"]);
      toast.success("تم إضافة العرض بنجاح!");
      onClose();
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: (data) => adminApi.categories.createCategory(data, imageFile),
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      toast.success("تم إضافة التصنيف بنجاح!");
      onClose();
    },
  });

  // Update mutations
  const updateSlideMutation = useMutation({
    mutationFn: ({ id, data }) =>
      adminApi.home.updateSlide(id, data, imageFile),
    onSuccess: () => {
      queryClient.invalidateQueries(["home-slides"]);
      toast.success("تم تحديث الشريحة بنجاح!");
      onClose();
    },
  });

  const updateDishMutation = useMutation({
    mutationFn: ({ id, data }) =>
      adminApi.featuredDishes.updateFeaturedDish(id, data, imageFile),
    onSuccess: () => {
      queryClient.invalidateQueries(["featured-dishes"]);
      toast.success("تم تحديث الطبق بنجاح!");
      onClose();
    },
  });

  const updateOfferMutation = useMutation({
    mutationFn: ({ id, data }) =>
      adminApi.offers.updateOffer(id, data, imageFile),
    onSuccess: () => {
      queryClient.invalidateQueries(["offers"]);
      toast.success("تم تحديث العرض بنجاح!");
      onClose();
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }) =>
      adminApi.categories.updateCategory(id, data, imageFile),
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      toast.success("تم تحديث التصنيف بنجاح!");
      onClose();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingItem) {
      // Update existing item
      switch (type) {
        case "slides":
          updateSlideMutation.mutate({ id: editingItem.id, data: formData });
          break;
        case "dishes":
          updateDishMutation.mutate({ id: editingItem.id, data: formData });
          break;
        case "offers":
          updateOfferMutation.mutate({ id: editingItem.id, data: formData });
          break;
        case "categories":
          updateCategoryMutation.mutate({ id: editingItem.id, data: formData });
          break;
      }
    } else {
      // Create new item
      switch (type) {
        case "slides":
          createSlideMutation.mutate(formData);
          break;
        case "dishes":
          createDishMutation.mutate(formData);
          break;
        case "offers":
          createOfferMutation.mutate(formData);
          break;
        case "categories":
          createCategoryMutation.mutate(formData);
          break;
      }
    }
  };

  const isPending =
    createSlideMutation.isPending ||
    createDishMutation.isPending ||
    createOfferMutation.isPending ||
    createCategoryMutation.isPending ||
    updateSlideMutation.isPending ||
    updateDishMutation.isPending ||
    updateOfferMutation.isPending ||
    updateCategoryMutation.isPending;

  const getModalTitle = () => {
    const action = editingItem ? "تعديل" : "إضافة";
    const itemType =
      type === "slides" 
        ? "شريحة" 
        : type === "dishes" 
        ? "طبق مميز" 
        : type === "offers" 
        ? "عرض" 
        : "تصنيف";

    return `${action} ${itemType}`;
  };

  const renderFormFields = () => {
    switch (type) {
      case "slides":
        return (
          <>
            <div>
              <label className="block text-white font-medium mb-2">
                العنوان
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C] transition-colors"
                placeholder="أدخل العنوان"
                required
              />
            </div>
            <div>
              <label className="block text-white font-medium mb-2">
                الوصف الفرعي
              </label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) =>
                  setFormData({ ...formData, subtitle: e.target.value })
                }
                className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C] transition-colors"
                placeholder="أدخل الوصف الفرعي"
              />
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
                placeholder="أدخل الوصف الكامل"
              />
            </div>
            <div>
              <label className="block text-white font-medium mb-2">
                نص الزر
              </label>
              <input
                type="text"
                value={formData.button_text}
                onChange={(e) =>
                  setFormData({ ...formData, button_text: e.target.value })
                }
                className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C] transition-colors"
                placeholder="مثال: اطلب الآن"
              />
            </div>
          </>
        );

      case "dishes":
        return (
          <>
            <div>
              <label className="block text-white font-medium mb-2">
                اسم الطبق
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C] transition-colors"
                placeholder="أدخل اسم الطبق"
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-medium mb-2">
                  السعر
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
              <div>
                <label className="block text-white font-medium mb-2">
                  السعر الأصلي
                </label>
                <input
                  type="text"
                  value={formData.original_price}
                  onChange={(e) =>
                    setFormData({ ...formData, original_price: e.target.value })
                  }
                  className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C] transition-colors"
                  placeholder="مثال: 80 جنية"
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
                placeholder="أدخل وصف الطبق"
              />
            </div>
          </>
        );

      case "offers":
        return (
          <>
            <div>
              <label className="block text-white font-medium mb-2">
                عنوان العرض
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C] transition-colors"
                placeholder="أدخل عنوان العرض"
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-medium mb-2">
                  السعر
                </label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C] transition-colors"
                  placeholder="مثال: 200 جنية"
                  required
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">
                  السعر الأصلي
                </label>
                <input
                  type="text"
                  value={formData.original_price}
                  onChange={(e) =>
                    setFormData({ ...formData, original_price: e.target.value })
                  }
                  className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C] transition-colors"
                  placeholder="مثال: 250 جنية"
                />
              </div>
            </div>
            <div>
              <label className="block text-white font-medium mb-2">
                تفاصيل العرض
              </label>
              <textarea
                value={formData.details}
                onChange={(e) =>
                  setFormData({ ...formData, details: e.target.value })
                }
                rows={3}
                className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C] transition-colors"
                placeholder="أدخل تفاصيل العرض"
              />
            </div>
          </>
        );

      case "categories":
        return (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-medium mb-2">
                  الاسم بالعربية
                </label>
                <input
                  type="text"
                  value={formData.name_ar}
                  onChange={(e) =>
                    setFormData({ ...formData, name_ar: e.target.value })
                  }
                  className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C] transition-colors"
                  placeholder="أدخل الاسم بالعربية"
                  required
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">
                  الاسم بالإنجليزية
                </label>
                <input
                  type="text"
                  value={formData.name_en}
                  onChange={(e) =>
                    setFormData({ ...formData, name_en: e.target.value })
                  }
                  className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C] transition-colors"
                  placeholder="أدخل الاسم بالإنجليزية"
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
                placeholder="أدخل وصف التصنيف"
              />
            </div>
          </>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 border-b border-[#C49A6C]/20 flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-bold text-[#C49A6C]">
            {getModalTitle()}
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
            <label className="block text-white font-medium mb-2">الصورة</label>
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
                <div className="relative flex-shrink-0">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Dynamic Form Fields */}
          {renderFormFields()}

          {/* Common Fields */}
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

          {/* Submit Button */}
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
