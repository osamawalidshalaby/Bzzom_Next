"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ShoppingCart,
  WheatIcon,
  MapPin,
  Navigation,
  ChefHat,
} from "lucide-react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { useApp } from "../layout-client";
import Image from "next/image";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, setCart } =
    useApp();
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [address, setAddress] = useState("");
  const [chefNotes, setChefNotes] = useState("");
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [location, setLocation] = useState(null);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("المتصفح لا يدعم تحديد الموقع");
      return;
    }

    setIsGettingLocation(true);
    toast.loading("جاري تحديد موقعك...", { duration: 3000 });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });

        // إضافة العنوان التلقائي بناء على الإحداثيات
        const mapsUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
        setAddress(`الموقع المباشر: ${mapsUrl}`);

        toast.success("تم تحديد موقعك بنجاح");
        setIsGettingLocation(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        let errorMessage = "تعذر تحديد الموقع";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "تم رفض الإذن لتحديد الموقع - يرجى السماح بالوصول إلى الموقع";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "معلومات الموقع غير متاحة - تأكد من تشغيل GPS";
            break;
          case error.TIMEOUT:
            errorMessage = "انتهت مهلة طلب الموقع - حاول مرة أخرى";
            break;
        }

        toast.error(errorMessage);
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000,
      }
    );
  };

  // دالة لتحويل الكميات إلى كيلو ونص كيلو
  const formatQuantity = (quantity) => {
    if (quantity === 1.5) {
      return "كيلو ونص";
    } else if (quantity === 0.5) {
      return "نص كيلو";
    } else {
      return `${quantity} كيلو`;
    }
  };

  // دالة لتحديث الكمية مع دعم الكسور
  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  // إضافة كيلو ونص كيلو
  const addHalfKilo = (id, currentQuantity) => {
    const newQuantity = currentQuantity + 0.5;
    updateQuantity(id, newQuantity);
  };

  const sendWhatsAppOrder = () => {
    if (cart.length === 0) return;

    if (!customerName.trim() || !customerPhone.trim()) {
      toast.error("يرجى إدخال الاسم ورقم الهاتف");
      return;
    }

    if (!address.trim() && !location) {
      toast.error("يرجى إدخال العنوان أو تحديد الموقع تلقائياً");
      return;
    }

    const phoneNumber = "201010882822";
    let message = "السلام عليكم 🌹\n\n";
    message += `👤 *الاسم:* ${customerName}\n`;
    message += `📞 *رقم الهاتف:* ${customerPhone}\n\n`;

    message += "🛒 *الطلبات:*\n";
    cart.forEach((item) => {
      const quantityText = formatQuantity(item.quantity);
      message += `• ${quantityText} ${item.name}\n`;
    });

    message += `\n💰 *المجموع:* ${getTotalPrice()} جنية\n`;

    // إضافة العنوان أو الموقع
    if (address.trim()) {
      message += `\n📍 *العنوان:*\n${address}\n`;
    }

    if (location) {
      const { latitude, longitude } = location;
      const liveLocationUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
      message += `\n🗺️ *الموقع المباشر:*\n${liveLocationUrl}\n`;
    }

    // إضافة ملاحظات الشيف إذا كانت موجودة
    if (chefNotes.trim()) {
      message += `\n👨‍🍳 *ملاحظات للشيف:*\n${chefNotes}\n`;
    }

    message += `\nشكراً لكم! 🙏`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappURL, "_blank");
    setShowAddressForm(false);
    setCustomerName("");
    setCustomerPhone("");
    setAddress("");
    setChefNotes("");
    setLocation(null);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const openAddressForm = () => {
    if (cart.length === 0) {
      toast.error("السلة فارغة");
      return;
    }
    setShowAddressForm(true);
  };

  const closeAddressForm = () => {
    setShowAddressForm(false);
    setCustomerName("");
    setCustomerPhone("");
    setAddress("");
    setChefNotes("");
    setLocation(null);
  };

  // التحقق من صحة البيانات قبل الإرسال
  const canSubmitOrder = () => {
    return (
      customerName.trim() &&
      customerPhone.trim() &&
      (address.trim() || location)
    );
  };

  return (
    <>
      {/* Toast Container */}
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

      <div className="min-h-screen bg-black text-white pt-20 pb-12 px-3 sm:px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6 sm:mb-8 mt-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-[#C49A6C] hover:text-[#B08A5C] transition-all text-sm sm:text-base"
            >
              <X size={20} />
              <span>العودة للقائمة</span>
            </Link>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-[#C49A6C] text-center">
              سلة الطلبات
            </h1>
            <div className="w-20 sm:w-24"></div>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-16 sm:py-20">
              <ShoppingCart
                size={60}
                className="text-white/30 mx-auto mb-4 sm:mb-6"
              />
              <h2 className="text-xl sm:text-2xl text-white/60 mb-3 sm:mb-4">
                السلة فارغة
              </h2>
              <p className="text-white/40 mb-6 sm:mb-8 text-sm sm:text-base">
                أضف بعض الأطباق من القائمة
              </p>
              <Link
                href="/"
                className="bg-[#C49A6C] text-black px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold hover:bg-[#B08A5C] transition-all text-sm sm:text-base inline-block"
              >
                تصفح القائمة
              </Link>
            </div>
          ) : (
            <div className="bg-zinc-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#C49A6C]/20">
              {/* Cart Items */}
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 sm:gap-4 bg-black/30 p-3 sm:p-4 rounded-lg border border-[#C49A6C]/10"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-lg font-bold text-white mb-1 truncate">
                        {item.name}
                      </h3>
                      <p className="text-[#C49A6C] text-xs sm:text-sm">
                        {item.price}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-6 h-6 sm:w-8 sm:h-8 bg-[#C49A6C] text-black rounded-full flex items-center justify-center text-sm sm:text-lg font-bold hover:bg-[#B08A5C] transition-all"
                      >
                        -
                      </button>
                      <span className="text-white w-8 sm:w-12 text-center text-sm sm:text-lg font-bold">
                        {formatQuantity(item.quantity)}
                      </span>
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-6 h-6 sm:w-8 sm:h-8 bg-[#C49A6C] text-black rounded-full flex items-center justify-center text-sm sm:text-lg font-bold hover:bg-[#B08A5C] transition-all"
                        >
                          +
                        </button>
                        <button
                          onClick={() => addHalfKilo(item.id, item.quantity)}
                          className="w-6 h-4 sm:w-8 sm:h-5 bg-[#B08A5C] text-black rounded-full flex items-center justify-center text-xs font-bold hover:bg-[#A07A4C] transition-all"
                          title="إضافة نصف كيلو"
                        >
                          .5
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400 hover:text-red-300 p-1 sm:p-2 flex-shrink-0 transition-all"
                    >
                      <X size={16} className="sm:w-5 sm:h-5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/20 pt-4 sm:pt-6 mb-4 sm:mb-6">
                <div className="flex justify-between items-center text-lg sm:text-2xl mb-4 sm:mb-6">
                  <span className="text-white">المجموع:</span>
                  <span className="text-[#C49A6C] font-bold">
                    {getTotalPrice()} جنية
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button
                    onClick={openAddressForm}
                    className="flex-1 bg-green-600 text-white py-3 sm:py-4 rounded-lg font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-lg"
                  >
                    <WheatIcon size={18} className="sm:w-6 sm:h-6" />
                    طلب عبر الواتساب
                  </button>

                  <button
                    onClick={() => setCart([])}
                    className="px-4 sm:px-8 bg-red-600 text-white py-3 sm:py-4 rounded-lg font-semibold hover:bg-red-700 transition-all text-sm sm:text-lg"
                  >
                    إفراغ السلة
                  </button>
                </div>
              </div>

              <div className="text-center mt-6 sm:mt-8">
                <Link
                  href="/menu"
                  className="text-[#C49A6C] hover:text-[#B08A5C] transition-all underline text-sm sm:text-base"
                >
                  متابعة التسوق
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Address Form Modal */}
        <AnimatePresence>
          {showAddressForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-50 flex items-end md:items-center justify-center p-4"
              onClick={closeAddressForm}
            >
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 30 }}
                className="bg-zinc-900 rounded-t-2xl md:rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="sticky top-0 bg-zinc-900 p-4 border-b border-zinc-700 flex justify-between items-center">
                  <button
                    onClick={closeAddressForm}
                    className="p-2 rounded-full hover:bg-zinc-800 transition-colors"
                  >
                    <X size={24} />
                  </button>
                  <h2 className="text-xl font-bold text-[#C49A6C]">
                    تأكيد الطلب
                  </h2>
                  <div className="w-10"></div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Customer Info */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-white mb-4">
                      معلومات العميل
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-white font-semibold mb-2 text-right">
                          👤 الاسم
                        </label>
                        <input
                          type="text"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="أدخل اسمك الكامل"
                          className="w-full px-4 py-3 bg-zinc-800 border-2 border-[#C49A6C]/30 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#C49A6C] transition-all text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-white font-semibold mb-2 text-right">
                          📞 رقم الهاتف
                        </label>
                        <input
                          type="tel"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="أدخل رقم هاتفك"
                          className="w-full px-4 py-3 bg-zinc-800 border-2 border-[#C49A6C]/30 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#C49A6C] transition-all text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address Section */}
                  <div className="mb-6">
                    <label className="block text-white font-semibold mb-3 text-right">
                      📍 العنوان
                    </label>

                    <div className="mb-4">
                      <button
                        onClick={getCurrentLocation}
                        disabled={isGettingLocation}
                        className="w-full flex items-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm justify-center"
                      >
                        <Navigation size={16} />
                        {isGettingLocation
                          ? "جاري تحديد الموقع..."
                          : "تحديد الموقع تلقائياً"}
                      </button>

                      {location && (
                        <div className="mt-3 p-3 bg-green-900/20 border border-green-600/30 rounded-lg">
                          <p className="text-green-400 text-sm flex items-center gap-2">
                            <MapPin size={16} />✅ تم تحديد موقعك بنجاح
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2 text-right">
                        أو اكتب العنوان يدوياً
                      </label>
                      <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="أدخل عنوانك بالتفصيل (المنطقة، الشارع، رقم المبني، الشقة...)"
                        className="w-full px-4 py-3 bg-zinc-800 border-2 border-[#C49A6C]/30 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#C49A6C] transition-all resize-none min-h-[100px] text-sm"
                        rows="4"
                      />
                    </div>

                    <p className="text-white/60 text-xs mt-2 text-right">
                      * يجب تحديد الموقع تلقائياً أو كتابة العنوان
                    </p>
                  </div>

                  {/* Chef Notes Section */}
                  <div className="mb-6">
                    <label className="block text-white font-semibold mb-2 text-right">
                      <ChefHat size={18} className="inline ml-1" />
                      ملاحظات للشيف (اختياري)
                    </label>
                    <textarea
                      value={chefNotes}
                      onChange={(e) => setChefNotes(e.target.value)}
                      placeholder="أي ملاحظات خاصة للشيف حول طريقة التحضير أو التغليف..."
                      className="w-full px-4 py-3 bg-zinc-800 border-2 border-[#C49A6C]/30 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#C49A6C] transition-all resize-none min-h-[80px] text-sm"
                      rows="3"
                    />
                  </div>

                  {/* Order Summary - السعر فقط */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-white mb-4">
                      ملخص الطلب
                    </h3>
                    <div className="bg-black/30 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-bold">
                          المجموع الكلي
                        </span>
                        <span className="text-[#C49A6C] font-bold text-xl">
                          {getTotalPrice()} جنية
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={sendWhatsAppOrder}
                      disabled={!canSubmitOrder()}
                      className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <WheatIcon size={20} />
                      <span>إرسال الطلب عبر الواتساب</span>
                    </motion.button>

                    <button
                      onClick={closeAddressForm}
                      className="w-full bg-zinc-700 text-white py-3 rounded-xl font-semibold hover:bg-zinc-600 transition-all"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Cart;
