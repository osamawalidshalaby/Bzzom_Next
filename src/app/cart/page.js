// "use client";
// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   X,
//   ShoppingCart,
//   WheatIcon,
//   MapPin,
//   Navigation,
//   ChefHat,
//   CreditCard,
//   Phone,
//   User,
//   Clock,
// } from "lucide-react";
// import Link from "next/link";
// import toast, { Toaster } from "react-hot-toast";
// import { useApp } from "../layout-client";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { adminApi } from "../_services/adminApi";

// const Cart = () => {
//   const { cart, removeFromCart, updateQuantity, getTotalPrice, setCart } = useApp();
//   const [showOrderForm, setShowOrderForm] = useState(false);
//   const [orderMethod, setOrderMethod] = useState("whatsapp"); // 'whatsapp' أو 'website'
//   const [customerName, setCustomerName] = useState("");
//   const [customerPhone, setCustomerPhone] = useState("");
//   const [address, setAddress] = useState("");
//   const [chefNotes, setChefNotes] = useState("");
//   const [paymentMethod, setPaymentMethod] = useState("cash");
//   const [isGettingLocation, setIsGettingLocation] = useState(false);
//   const [location, setLocation] = useState(null);
//   const [estimatedTime, setEstimatedTime] = useState("");
//   const router = useRouter();
//   const queryClient = useQueryClient();

//   // طلب إنشاء طلب جديد باستخدام React Query
//   const createOrderMutation = useMutation({
//     mutationFn: async (orderData) => {
//       const cashierId = localStorage.getItem("userId");
//       return await adminApi.orders.createOrder(orderData, cashierId);
//     },
//     onSuccess: (data) => {
//       toast.success("تم إنشاء الطلب بنجاح! سيتم تجهيزه قريباً");

//       // إعادة تعيين الحالة
//       setCart([]);
//       setShowOrderForm(false);
//       resetForm();

//       // إعادة توجيه إلى صفحة تأكيد الطلب
//       router.push(`/order-confirmation/${data.id}`);

//       // إعادة تحميل بيانات الطلبات
//       queryClient.invalidateQueries({ queryKey: ["orders"] });
//     },
//     onError: (error) => {
//       console.error("Create order error:", error);
//       toast.error(error.message || "حدث خطأ في إنشاء الطلب");
//     },
//   });

//   useEffect(() => {
//     calculateEstimatedTime();
//   }, [cart]);

//   const calculateEstimatedTime = () => {
//     if (cart.length === 0) {
//       setEstimatedTime("");
//       return;
//     }

//     let totalTime = 0;

//     // حساب الوقت التقريبي بناء على العناصر
//     cart.forEach(item => {
//       let itemTime = 15; // وقت افتراضي

//       // وقت أطول للمشويات
//       if (item.category === 'grill' || item.name.includes('شواية')) {
//         itemTime = 25;
//       }

//       // وقت أطول للكميات الكبيرة
//       if (item.quantity > 2) {
//         itemTime += 5 * (item.quantity - 2);
//       }

//       totalTime += itemTime;
//     });

//     // إضافة وقت التوصيل
//     totalTime += 30; // 30 دقيقة للتوصيل

//     const now = new Date();
//     const deliveryTime = new Date(now.getTime() + totalTime * 60000);

//     setEstimatedTime(deliveryTime.toLocaleTimeString('ar-EG', {
//       hour: '2-digit',
//       minute: '2-digit'
//     }));
//   };

//   const getCurrentLocation = () => {
//     if (!navigator.geolocation) {
//       toast.error("المتصفح لا يدعم تحديد الموقع");
//       return;
//     }

//     setIsGettingLocation(true);
//     toast.loading("جاري تحديد موقعك...", { duration: 3000 });

//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;
//         setLocation({ latitude, longitude });

//         // إضافة العنوان التلقائي بناء على الإحداثيات
//         const mapsUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
//         setAddress(`الموقع المباشر: ${mapsUrl}`);

//         toast.success("تم تحديد موقعك بنجاح");
//         setIsGettingLocation(false);
//       },
//       (error) => {
//         console.error("Error getting location:", error);
//         let errorMessage = "تعذر تحديد الموقع";

//         switch (error.code) {
//           case error.PERMISSION_DENIED:
//             errorMessage =
//               "تم رفض الإذن لتحديد الموقع - يرجى السماح بالوصول إلى الموقع";
//             break;
//           case error.POSITION_UNAVAILABLE:
//             errorMessage = "معلومات الموقع غير متاحة - تأكد من تشغيل GPS";
//             break;
//           case error.TIMEOUT:
//             errorMessage = "انتهت مهلة طلب الموقع - حاول مرة أخرى";
//             break;
//         }

//         toast.error(errorMessage);
//         setIsGettingLocation(false);
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 15000,
//         maximumAge: 60000,
//       }
//     );
//   };

//   const formatQuantity = (item) => {
//     if (item.selectedSize) {
//       const sizeLabels = {
//         0.25: "ربع كيلو",
//         0.33: "تلت كيلو",
//         0.5: "نص كيلو",
//       };
//       const sizeLabel =
//         sizeLabels[item.selectedSize] || `${item.selectedSize} `;
//       return `${sizeLabel} × ${item.quantity}`;
//     } else {
//       if (item.quantity === 1) {
//         return "1 ";
//       } else {
//         return `${item.quantity} `;
//       }
//     }
//   };

//   const handleUpdateQuantity = (id, newQuantity) => {
//     if (newQuantity <= 0) {
//       removeFromCart(id);
//     } else {
//       updateQuantity(id, newQuantity);
//     }
//   };

//   const handleUpdateGrillQuantity = (item, newQuantity) => {
//     if (newQuantity <= 0) {
//       removeFromCart(item.id);
//     } else {
//       const basePrice = parseFloat(
//         item.price.toString().replace(/[^0-9.]/g, "")
//       );
//       const calculatedPrice = Math.round(
//         basePrice * item.selectedSize * newQuantity
//       );

//       const updatedItem = {
//         ...item,
//         quantity: newQuantity,
//         calculatedPrice: calculatedPrice,
//       };

//       setCart((prevCart) =>
//         prevCart.map((cartItem) =>
//           cartItem.id === item.id ? updatedItem : cartItem
//         )
//       );
//     }
//   };

//   // إرسال الطلب عبر الواتساب (يبقى كما هو)
//   const sendWhatsAppOrder = () => {
//     if (cart.length === 0) return;

//     if (!customerName.trim() || !customerPhone.trim()) {
//       toast.error("يرجى إدخال الاسم ورقم الهاتف");
//       return;
//     }

//     if (!address.trim() && !location) {
//       toast.error("يرجى إدخال العنوان أو تحديد الموقع تلقائياً");
//       return;
//     }

//     const phoneNumber = "201010882822";
//     let message = "السلام عليكم 🌹\n\n";
//     message += `👤 *الاسم:* ${customerName}\n`;
//     message += `📞 *رقم الهاتف:* ${customerPhone}\n\n`;

//     message += "🛒 *الطلبات:*\n";
//     cart.forEach((item) => {
//       const quantityText = formatQuantity(item);
//       const itemPrice = item.calculatedPrice || item.price;
//       message += `• ${quantityText} ${item.name} - ${itemPrice} ج.م\n`;
//     });

//     message += `\n💰 *المجموع:* ${getTotalPrice()} جنية\n`;
//     message += `💳 *طريقة الدفع:* ${paymentMethod === 'cash' ? 'نقدي عند الاستلام' : 'بطاقة ائتمان'}\n`;

//     if (address.trim()) {
//       message += `\n📍 *العنوان:*\n${address}\n`;
//     }

//     if (location) {
//       const { latitude, longitude } = location;
//       const liveLocationUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
//       message += `\n🗺️ *الموقع المباشر:*\n${liveLocationUrl}\n`;
//     }

//     if (chefNotes.trim()) {
//       message += `\n👨‍🍳 *ملاحظات للشيف:*\n${chefNotes}\n`;
//     }

//     message += `\nشكراً لكم! 🙏`;

//     const encodedMessage = encodeURIComponent(message);
//     const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

//     window.open(whatsappURL, "_blank");
//     resetForm();
//   };

//   // إنشاء طلب من خلال الموقع
//   const createWebsiteOrder = async () => {
//     if (cart.length === 0) {
//       toast.error("السلة فارغة");
//       return;
//     }

//     if (!customerName.trim() || !customerPhone.trim()) {
//       toast.error("يرجى إدخال الاسم ورقم الهاتف");
//       return;
//     }

//     if (!address.trim() && !location) {
//       toast.error("يرجى إدخال العنوان أو تحديد الموقع تلقائياً");
//       return;
//     }

//     // تحضير بيانات الطلب
//     const orderData = {
//       customer_name: customerName,
//       customer_phone: customerPhone,
//       customer_address: address,
//       notes: chefNotes,
//       items: cart.map(item => ({
//         id: item.id,
//         name: item.name,
//         price: item.calculatedPrice || item.price,
//         quantity: item.quantity,
//         selectedSize: item.selectedSize,
//         image: item.image,
//       })),
//       total_amount: getTotalPrice(),
//       payment_method: paymentMethod,
//       chef_notes: chefNotes,
//       location: location,
//     };

//     // إرسال الطلب
//     createOrderMutation.mutate(orderData);
//   };

//   const getTotalItems = () => {
//     return cart.reduce((total, item) => total + item.quantity, 0);
//   };

//   const openOrderForm = () => {
//     if (cart.length === 0) {
//       toast.error("السلة فارغة");
//       return;
//     }
//     setShowOrderForm(true);
//   };

//   const closeOrderForm = () => {
//     setShowOrderForm(false);
//     resetForm();
//   };

//   const resetForm = () => {
//     setCustomerName("");
//     setCustomerPhone("");
//     setAddress("");
//     setChefNotes("");
//     setPaymentMethod("cash");
//     setOrderMethod("whatsapp");
//     setLocation(null);
//   };

//   const canSubmitOrder = () => {
//     return (
//       customerName.trim() &&
//       customerPhone.trim() &&
//       (address.trim() || location)
//     );
//   };

//   return (
//     <>
//       <Toaster
//         position="bottom-left"
//         toastOptions={{
//           duration: 3000,
//           style: {
//             background: "#1f2937",
//             color: "#fff",
//             border: "1px solid #C49A6C",
//           },
//         }}
//       />

//       <div className="min-h-screen bg-black text-white pt-20 pb-12 px-3 sm:px-4">
//         <div className="max-w-4xl mx-auto">
//           <div className="flex items-center justify-between mb-6 sm:mb-8 mt-4">
//             <Link
//               href="/"
//               className="flex items-center gap-2 text-[#C49A6C] hover:text-[#B08A5C] transition-all text-sm sm:text-base"
//             >
//               <X size={20} />
//               <span>العودة للقائمة</span>
//             </Link>
//             <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-[#C49A6C] text-center">
//               سلة الطلبات
//             </h1>
//             <div className="w-20 sm:w-24"></div>
//           </div>

//           {cart.length === 0 ? (
//             <div className="text-center py-16 sm:py-20">
//               <ShoppingCart
//                 size={60}
//                 className="text-white/30 mx-auto mb-4 sm:mb-6"
//               />
//               <h2 className="text-xl sm:text-2xl text-white/60 mb-3 sm:mb-4">
//                 السلة فارغة
//               </h2>
//               <p className="text-white/40 mb-6 sm:mb-8 text-sm sm:text-base">
//                 أضف بعض الأطباق من القائمة
//               </p>
//               <Link
//                 href="/"
//                 className="bg-[#C49A6C] text-black px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold hover:bg-[#B08A5C] transition-all text-sm sm:text-base inline-block"
//               >
//                 تصفح القائمة
//               </Link>
//             </div>
//           ) : (
//             <div className="bg-zinc-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#C49A6C]/20">
//               {/* Cart Items */}
//               <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
//                 {cart.map((item) => (
//                   <div
//                     key={item.id}
//                     className="flex items-center gap-3 sm:gap-4 bg-black/30 p-3 sm:p-4 rounded-lg border border-[#C49A6C]/10"
//                   >
//                     <Image
//                       src={item.image}
//                       alt={item.nameEn || item.name || "Bazzom"}
//                       width={64}
//                       height={64}
//                       className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover flex-shrink-0"
//                     />
//                     <div className="flex-1 min-w-0">
//                       <h3 className="text-sm sm:text-lg font-bold text-white mb-1 truncate">
//                         {item.name}
//                       </h3>
//                       <p className="text-[#C49A6C] text-xs sm:text-sm mb-1">
//                         {formatQuantity(item)}
//                       </p>
//                       <p className="text-[#C49A6C] text-xs sm:text-sm">
//                         {item.calculatedPrice || item.price} ج.م
//                       </p>
//                     </div>
//                     <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
//                       <button
//                         onClick={() =>
//                           item.selectedSize
//                             ? handleUpdateGrillQuantity(item, item.quantity - 1)
//                             : handleUpdateQuantity(item.id, item.quantity - 1)
//                         }
//                         className="w-6 h-6 sm:w-8 sm:h-8 bg-[#C49A6C] text-black rounded-full flex items-center justify-center text-sm sm:text-lg font-bold hover:bg-[#B08A5C] transition-all"
//                       >
//                         -
//                       </button>
//                       <span className="text-white w-8 sm:w-12 text-center text-sm sm:text-lg font-bold">
//                         {item.quantity}
//                       </span>
//                       <button
//                         onClick={() =>
//                           item.selectedSize
//                             ? handleUpdateGrillQuantity(item, item.quantity + 1)
//                             : handleUpdateQuantity(item.id, item.quantity + 1)
//                         }
//                         className="w-6 h-6 sm:w-8 sm:h-8 bg-[#C49A6C] text-black rounded-full flex items-center justify-center text-sm sm:text-lg font-bold hover:bg-[#B08A5C] transition-all"
//                       >
//                         +
//                       </button>
//                     </div>
//                     <button
//                       onClick={() => removeFromCart(item.id)}
//                       className="text-red-400 hover:text-red-300 p-1 sm:p-2 flex-shrink-0 transition-all"
//                     >
//                       <X size={16} className="sm:w-5 sm:h-5" />
//                     </button>
//                   </div>
//                 ))}
//               </div>

//               {/* Delivery Time Estimate */}
//               {estimatedTime && (
//                 <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
//                   <div className="flex items-center gap-2 sm:gap-3">
//                     <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
//                     <div>
//                       <p className="text-blue-300 font-medium text-sm sm:text-base">
//                         ⏰ وقت التوصيل المتوقع
//                       </p>
//                       <p className="text-white/80 text-xs sm:text-sm">
//                         سيتم تسليم طلبك حوالي الساعة {estimatedTime}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               <div className="border-t border-white/20 pt-4 sm:pt-6 mb-4 sm:mb-6">
//                 <div className="flex justify-between items-center text-lg sm:text-2xl mb-4 sm:mb-6">
//                   <span className="text-white">المجموع:</span>
//                   <span className="text-[#C49A6C] font-bold">
//                     {getTotalPrice()} جنية
//                   </span>
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                   <button
//                     onClick={openOrderForm}
//                     className="bg-green-600 text-white py-3 sm:py-4 rounded-lg font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-lg"
//                   >
//                     <WheatIcon size={18} className="sm:w-6 sm:h-6" />
//                     طلب عبر الواتساب
//                   </button>

//                   <button
//                     onClick={openOrderForm}
//                     className="bg-[#C49A6C] text-black py-3 sm:py-4 rounded-lg font-semibold hover:bg-[#B08A5C] transition-all flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-lg"
//                   >
//                     <CreditCard size={18} className="sm:w-6 sm:h-6" />
//                     إتمام من خلال الموقع
//                   </button>

//                   <button
//                     onClick={() => setCart([])}
//                     className="col-span-1 sm:col-span-2 bg-red-600 text-white py-3 sm:py-4 rounded-lg font-semibold hover:bg-red-700 transition-all text-sm sm:text-lg"
//                   >
//                     إفراغ السلة
//                   </button>
//                 </div>
//               </div>

//               <div className="text-center mt-6 sm:mt-8">
//                 <Link
//                   href="/menu"
//                   className="text-[#C49A6C] hover:text-[#B08A5C] transition-all underline text-sm sm:text-base"
//                 >
//                   متابعة التسوق
//                 </Link>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Order Form Modal */}
//         <AnimatePresence>
//           {showOrderForm && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 bg-black/70 z-50 flex items-end md:items-center justify-center p-4"
//               onClick={closeOrderForm}
//             >
//               <motion.div
//                 initial={{ y: "100%" }}
//                 animate={{ y: 0 }}
//                 exit={{ y: "100%" }}
//                 transition={{ type: "spring", damping: 30 }}
//                 className="bg-zinc-900 rounded-t-2xl md:rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 {/* Header */}
//                 <div className="sticky top-0 bg-zinc-900 p-4 border-b border-zinc-700 flex justify-between items-center">
//                   <button
//                     onClick={closeOrderForm}
//                     className="p-2 rounded-full hover:bg-zinc-800 transition-colors"
//                   >
//                     <X size={24} />
//                   </button>
//                   <h2 className="text-xl font-bold text-[#C49A6C]">
//                     تأكيد الطلب
//                   </h2>
//                   <div className="w-10"></div>
//                 </div>

//                 {/* Content */}
//                 <div className="p-6">
//                   {/* Order Method Selection */}
//                   <div className="mb-6">
//                     <h3 className="text-lg font-bold text-white mb-4">
//                       اختر طريقة الطلب
//                     </h3>
//                     <div className="grid grid-cols-2 gap-3">
//                       <button
//                         onClick={() => setOrderMethod("whatsapp")}
//                         className={`p-4 rounded-lg border-2 transition-all ${
//                           orderMethod === "whatsapp"
//                             ? "border-green-500 bg-green-900/20"
//                             : "border-zinc-700 bg-zinc-800 hover:border-green-500/50"
//                         }`}
//                       >
//                         <div className="flex flex-col items-center gap-2">
//                           <Phone className="w-6 h-6 text-green-400" />
//                           <span className="text-white font-medium">واتساب</span>
//                           <span className="text-white/60 text-xs">أسرع استجابة</span>
//                         </div>
//                       </button>

//                       <button
//                         onClick={() => setOrderMethod("website")}
//                         className={`p-4 rounded-lg border-2 transition-all ${
//                           orderMethod === "website"
//                             ? "border-[#C49A6C] bg-[#C49A6C]/10"
//                             : "border-zinc-700 bg-zinc-800 hover:border-[#C49A6C]/50"
//                         }`}
//                       >
//                         <div className="flex flex-col items-center gap-2">
//                           <CreditCard className="w-6 h-6 text-[#C49A6C]" />
//                           <span className="text-white font-medium">الموقع</span>
//                           <span className="text-white/60 text-xs">متابعة مباشرة</span>
//                         </div>
//                       </button>
//                     </div>
//                   </div>

//                   {/* Customer Info */}
//                   <div className="mb-6">
//                     <h3 className="text-lg font-bold text-white mb-4">
//                       معلومات العميل
//                     </h3>

//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-white font-semibold mb-2 text-right">
//                           <User className="w-4 h-4 inline mr-1" />
//                           الاسم الكامل *
//                         </label>
//                         <input
//                           type="text"
//                           value={customerName}
//                           onChange={(e) => setCustomerName(e.target.value)}
//                           placeholder="أدخل اسمك الكامل"
//                           className="w-full px-4 py-3 bg-zinc-800 border-2 border-[#C49A6C]/30 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#C49A6C] transition-all text-sm"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-white font-semibold mb-2 text-right">
//                           <Phone className="w-4 h-4 inline mr-1" />
//                           رقم الهاتف *
//                         </label>
//                         <input
//                           type="tel"
//                           value={customerPhone}
//                           onChange={(e) => setCustomerPhone(e.target.value)}
//                           placeholder="أدخل رقم هاتفك"
//                           className="w-full px-4 py-3 bg-zinc-800 border-2 border-[#C49A6C]/30 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#C49A6C] transition-all text-sm"
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   {/* Payment Method */}
//                   <div className="mb-6">
//                     <h3 className="text-lg font-bold text-white mb-4">
//                       طريقة الدفع
//                     </h3>
//                     <div className="grid grid-cols-2 gap-3">
//                       <button
//                         onClick={() => setPaymentMethod("cash")}
//                         className={`p-4 rounded-lg border-2 transition-all ${
//                           paymentMethod === "cash"
//                             ? "border-green-500 bg-green-900/20"
//                             : "border-zinc-700 bg-zinc-800 hover:border-green-500/50"
//                         }`}
//                       >
//                         <div className="flex flex-col items-center gap-2">
//                           <span className="text-2xl">💵</span>
//                           <span className="text-white font-medium">نقدي</span>
//                           <span className="text-white/60 text-xs">عند الاستلام</span>
//                         </div>
//                       </button>

//                       <button
//                         onClick={() => setPaymentMethod("card")}
//                         className={`p-4 rounded-lg border-2 transition-all ${
//                           paymentMethod === "card"
//                             ? "border-blue-500 bg-blue-900/20"
//                             : "border-zinc-700 bg-zinc-800 hover:border-blue-500/50"
//                         }`}
//                       >
//                         <div className="flex flex-col items-center gap-2">
//                           <CreditCard className="w-6 h-6 text-blue-400" />
//                           <span className="text-white font-medium">بطاقة</span>
//                           <span className="text-white/60 text-xs">ائتمان/مدين</span>
//                         </div>
//                       </button>
//                     </div>
//                   </div>

//                   {/* Address Section */}
//                   <div className="mb-6">
//                     <label className="block text-white font-semibold mb-3 text-right">
//                       <MapPin className="w-4 h-4 inline mr-1" />
//                       العنوان *
//                     </label>

//                     <div className="mb-4">
//                       <button
//                         onClick={getCurrentLocation}
//                         disabled={isGettingLocation}
//                         className="w-full flex items-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm justify-center"
//                       >
//                         <Navigation size={16} />
//                         {isGettingLocation
//                           ? "جاري تحديد الموقع..."
//                           : "تحديد الموقع تلقائياً"}
//                       </button>

//                       {location && (
//                         <div className="mt-3 p-3 bg-green-900/20 border border-green-600/30 rounded-lg">
//                           <p className="text-green-400 text-sm flex items-center gap-2">
//                             <MapPin size={16} />✅ تم تحديد موقعك بنجاح
//                           </p>
//                         </div>
//                       )}
//                     </div>

//                     <div>
//                       <label className="block text-white font-semibold mb-2 text-right">
//                         أو اكتب العنوان يدوياً
//                       </label>
//                       <textarea
//                         value={address}
//                         onChange={(e) => setAddress(e.target.value)}
//                         placeholder="أدخل عنوانك بالتفصيل (المنطقة، الشارع، رقم المبني، الشقة...)"
//                         className="w-full px-4 py-3 bg-zinc-800 border-2 border-[#C49A6C]/30 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#C49A6C] transition-all resize-none min-h-[100px] text-sm"
//                         rows="4"
//                       />
//                     </div>
//                   </div>

//                   {/* Chef Notes Section */}
//                   <div className="mb-6">
//                     <label className="block text-white font-semibold mb-2 text-right">
//                       <ChefHat size={18} className="inline ml-1" />
//                       ملاحظات للشيف (اختياري)
//                     </label>
//                     <textarea
//                       value={chefNotes}
//                       onChange={(e) => setChefNotes(e.target.value)}
//                       placeholder="أي ملاحظات خاصة للشيف حول طريقة التحضير أو التغليف..."
//                       className="w-full px-4 py-3 bg-zinc-800 border-2 border-[#C49A6C]/30 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#C49A6C] transition-all resize-none min-h-[80px] text-sm"
//                       rows="3"
//                     />
//                   </div>

//                   {/* Order Summary */}
//                   <div className="mb-6">
//                     <h3 className="text-lg font-bold text-white mb-4">
//                       ملخص الطلب
//                     </h3>
//                     <div className="bg-black/30 rounded-lg p-4 space-y-3">
//                       <div className="space-y-2 max-h-40 overflow-y-auto">
//                         {cart.map((item) => (
//                           <div key={item.id} className="flex justify-between items-center">
//                             <span className="text-white text-sm">
//                               {formatQuantity(item)} {item.name}
//                             </span>
//                             <span className="text-[#C49A6C] text-sm">
//                               {item.calculatedPrice || item.price} ج.م
//                             </span>
//                           </div>
//                         ))}
//                       </div>
//                       <div className="border-t border-white/20 pt-3">
//                         <div className="flex justify-between items-center">
//                           <span className="text-white font-bold">المجموع</span>
//                           <span className="text-[#C49A6C] font-bold text-xl">
//                             {getTotalPrice()} ج.م
//                           </span>
//                         </div>
//                         {estimatedTime && (
//                           <div className="flex justify-between items-center mt-2">
//                             <span className="text-white/70 text-sm">وقت التوصيل</span>
//                             <span className="text-blue-400 text-sm">{estimatedTime}</span>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="flex flex-col gap-3">
//                     {orderMethod === "whatsapp" ? (
//                       <motion.button
//                         whileHover={{ scale: 1.02 }}
//                         whileTap={{ scale: 0.98 }}
//                         onClick={sendWhatsAppOrder}
//                         disabled={!canSubmitOrder()}
//                         className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                       >
//                         <Phone size={20} />
//                         <span>إرسال الطلب عبر الواتساب</span>
//                       </motion.button>
//                     ) : (
//                       <motion.button
//                         whileHover={{ scale: 1.02 }}
//                         whileTap={{ scale: 0.98 }}
//                         onClick={createWebsiteOrder}
//                         disabled={!canSubmitOrder() || createOrderMutation.isPending}
//                         className="w-full bg-[#C49A6C] text-black py-4 rounded-xl font-bold text-lg hover:bg-[#B08A5C] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                       >
//                         {createOrderMutation.isPending ? (
//                           <>
//                             <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
//                             جاري إنشاء الطلب...
//                           </>
//                         ) : (
//                           <>
//                             <CreditCard size={20} />
//                             <span>إتمام الطلب من خلال الموقع</span>
//                           </>
//                         )}
//                       </motion.button>
//                     )}

//                     <button
//                       onClick={closeOrderForm}
//                       className="w-full bg-zinc-700 text-white py-3 rounded-xl font-semibold hover:bg-zinc-600 transition-all"
//                     >
//                       إلغاء
//                     </button>
//                   </div>
//                 </div>
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </>
//   );
// };

// export default Cart;

// ملف: app/cart/page.jsx
"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  X,
  ShoppingCart,
  CreditCard,
  ArrowLeft,
  Clock,
  AlertCircle,
  Plus,
  Minus,
  Trash2,
  Package
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { useApp } from "../layout-client";
import Image from "next/image";
import { customerApi } from "../_services/customerApi";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, setCart } = useApp();
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = () => {
    const isAuth = customerApi.isAuthenticated();
    setIsUserLoggedIn(isAuth);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error("السلة فارغة");
      return;
    }

    if (!isUserLoggedIn) {
      // حفظ السلة مؤقتاً
      localStorage.setItem("pendingCart", JSON.stringify(cart));
      localStorage.setItem("redirectAfterAuth", "/checkout");
      
      toast.loading("جاري توجيهك لتسجيل الدخول...");
      setTimeout(() => {
        router.push("/auth/signin");
      }, 1000);
      return;
    }

    // توجيه مباشر إلى صفحة تاكيد الطلب
    router.push("/checkout");
  };

  const formatQuantity = (item) => {
    if (item.selectedSize) {
      const sizeLabels = {
        0.25: "ربع كيلو",
        0.33: "تلت كيلو",
        0.5: "نص كيلو",
      };
      const sizeLabel = sizeLabels[item.selectedSize] || `${item.selectedSize} `;
      return `${sizeLabel} × ${item.quantity}`;
    } else {
      return item.quantity === 1 ? "1 " : `${item.quantity} `;
    }
  };

  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleUpdateGrillQuantity = (item, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(item.id);
    } else {
      const basePrice = parseFloat(item.price.toString().replace(/[^0-9.]/g, ""));
      const calculatedPrice = Math.round(basePrice * item.selectedSize * newQuantity);

      const updatedItem = {
        ...item,
        quantity: newQuantity,
        calculatedPrice: calculatedPrice,
      };

      setCart(prevCart =>
        prevCart.map(cartItem =>
          cartItem.id === item.id ? updatedItem : cartItem
        )
      );
    }
  };

  const calculateEstimatedTime = () => {
    if (cart.length === 0) return "";

    let totalTime = 0;
    cart.forEach(item => {
      let itemTime = 15;
      if (item.category === "grill" || item.name.includes("شواية")) {
        itemTime = 25;
      }
      if (item.quantity > 2) {
        itemTime += 5 * (item.quantity - 2);
      }
      totalTime += itemTime;
    });

    totalTime += 30;
    const now = new Date();
    const deliveryTime = new Date(now.getTime() + totalTime * 60000);

    return deliveryTime.toLocaleTimeString("ar-EG", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const estimatedTime = calculateEstimatedTime();

  return (
    <>
      <Toaster
        position="bottom-left"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1f2937",
            color: "#fff",
            border: "1px solid #C49A6C",
          },
        }}
      />

      <div className="min-h-screen bg-black text-white pt-16 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/menu"
              className="flex items-center gap-2 text-[#C49A6C] hover:text-[#B08A5C] transition-all text-sm"
            >
              <ArrowLeft size={20} />
              <span>العودة للقائمة</span>
            </Link>
            <h1 className="text-xl font-bold text-[#C49A6C] text-center">سلة الطلبات</h1>
            <div className="w-10"></div>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart size={60} className="text-white/30 mx-auto mb-4" />
              <h2 className="text-lg text-white/60 mb-3">السلة فارغة</h2>
              <p className="text-white/40 mb-6 text-sm">أضف بعض الأطباق من القائمة</p>
              <Link
                href="/menu"
                className="bg-[#C49A6C] text-black px-6 py-2 rounded-lg font-semibold hover:bg-[#B08A5C] transition-all text-sm inline-block"
              >
                تصفح القائمة
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Cart Items */}
              <div className="space-y-3">
                {cart.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 bg-zinc-900 p-3 rounded-lg border border-[#C49A6C]/10"
                  >
                    <Image
                      src={item.image}
                      alt={item.nameEn || item.name || "Bazzom"}
                      width={60}
                      height={60}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-white mb-1 truncate">
                        {item.name}
                      </h3>
                      <p className="text-[#C49A6C] text-xs mb-1">
                        {formatQuantity(item)}
                      </p>
                      <p className="text-[#C49A6C] text-xs">
                        {item.calculatedPrice || item.price} ج.م
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() =>
                          item.selectedSize
                            ? handleUpdateGrillQuantity(item, item.quantity - 1)
                            : handleUpdateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-6 h-6 bg-[#C49A6C] text-black rounded-full flex items-center justify-center text-sm font-bold hover:bg-[#B08A5C] transition-all"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-white w-8 text-center text-sm font-bold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          item.selectedSize
                            ? handleUpdateGrillQuantity(item, item.quantity + 1)
                            : handleUpdateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-6 h-6 bg-[#C49A6C] text-black rounded-full flex items-center justify-center text-sm font-bold hover:bg-[#B08A5C] transition-all"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400 hover:text-red-300 p-1 flex-shrink-0 transition-all"
                    >
                      <X size={16} />
                    </button>
                  </motion.div>
                ))}
              </div>

              {/* Delivery Time Estimate */}
              {estimatedTime && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-blue-300 font-medium text-sm">⏰ وقت التوصيل المتوقع</p>
                      <p className="text-white/80 text-xs">
                        سيتم تسليم طلبك حوالي الساعة {estimatedTime}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="border-t border-white/20 pt-4"
              >
                <div className="flex justify-between items-center text-lg mb-4">
                  <span className="text-white">المجموع:</span>
                  <span className="text-[#C49A6C] font-bold">
                    {getTotalPrice()} ج.م
                  </span>
                </div>

                {/* Authentication Alert */}
                {!isUserLoggedIn && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-4 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg"
                  >
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-yellow-300 font-medium text-sm mb-1">
                          ⚠️ لتتمكن من إكمال الطلب
                        </p>
                        <p className="text-white/80 text-xs">
                          الرجاء تسجيل الدخول بحساب جوجل
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="grid grid-cols-1 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCheckout}
                    disabled={isLoading}
                    className="bg-[#C49A6C] text-black py-3 rounded-lg font-semibold hover:bg-[#B08A5C] transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        جاري التحميل...
                      </>
                    ) : (
                      <>
                        <CreditCard size={18} />
                        {isUserLoggedIn ? "إتمام الطلب" : "سجل الدخول لإتمام الطلب"}
                      </>
                    )}
                  </motion.button>

                  <button
                    onClick={() => {
                      if (confirm("هل أنت متأكد من إفراغ السلة؟")) {
                        setCart([]);
                        toast.success("تم إفراغ السلة");
                      }
                    }}
                    className="bg-red-600/80 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-all text-sm flex items-center justify-center gap-2"
                  >
                    <Trash2 size={16} />
                    إفراغ السلة
                  </button>
                </div>
              </motion.div>

              <div className="text-center pt-4">
                <Link
                  href="/menu"
                  className="text-[#C49A6C] hover:text-[#B08A5C] transition-all underline text-sm"
                >
                  متابعة التسوق
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;