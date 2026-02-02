// ملف: app/not-found.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Home, ChefHat, Utensils, ArrowRight, Clock, Phone, MapPin } from "lucide-react";

export default function NotFound() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // تحديث الوقت كل دقيقة
    const timer = setInterval(() => setTime(new Date()), 60000);
    
    return () => clearInterval(timer);
  }, []);

  // تحقق إذا كان المطعم مفتوحاً (افتراضياً من 10 صباحاً إلى 2 صباحاً)
  const isOpen = time.getHours() >= 10 || time.getHours() < 2;

  const openingHours = [
    { day: "الأحد - الخميس", hours: "10:00 ص - 02:00 ص" },
    { day: "الجمعة - السبت", hours: "10:00 ص - 03:00 ص" }
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 pt-24">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto text-center mb-8">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="relative w-32 h-32 mx-auto mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-[#C49A6C] to-yellow-600 rounded-full blur-xl opacity-30"></div>
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="text-6xl font-bold text-[#C49A6C]">404</div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-[#C49A6C]">عذراً</span>، الصفحة غير موجودة
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            يبدو أن الصفحة التي تبحث عنها قد أُزيلت أو غيرت عنوانها.
            <br />
            لكن لا تقلق، لدينا الكثير من الخيارات الأخرى!
          </p>
        </motion.div>

        {/* Status Badge */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
          style={{
            backgroundColor: isOpen ? "#05966920" : "#DC262620",
            color: isOpen ? "#10B981" : "#EF4444",
            border: `1px solid ${isOpen ? "#10B98130" : "#EF444430"}`
          }}
        >
          <Clock size={16} />
          <span className="font-medium">
            {isOpen ? "المطعم مفتوح الآن" : "المطعم مغلق الآن"}
          </span>
          <span className="text-sm opacity-80">
            {time.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })}
          </span>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Quick Actions */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="lg:col-span-2 space-y-4"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <ArrowRight className="rotate-180" />
              <span>ماذا تريد أن تفعل؟</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/"
                className="group bg-zinc-900 border border-[#C49A6C]/20 rounded-xl p-6 hover:border-[#C49A6C] hover:bg-zinc-800/50 transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-[#C49A6C]/20 rounded-lg">
                    <Home className="w-6 h-6 text-[#C49A6C]" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-white group-hover:text-[#C49A6C] transition-colors">
                      العودة للرئيسية
                    </h3>
                    <p className="text-white/60 text-sm">الصفحة الرئيسية للمطعم</p>
                  </div>
                </div>
                <div className="text-[#C49A6C] text-sm flex items-center gap-1">
                  <span>اذهب الآن</span>
                  <ArrowRight className="w-3 h-3 rotate-180" />
                </div>
              </Link>

              <Link
                href="/menu"
                className="group bg-zinc-900 border border-[#C49A6C]/20 rounded-xl p-6 hover:border-[#C49A6C] hover:bg-zinc-800/50 transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-[#C49A6C]/20 rounded-lg">
                    <Utensils className="w-6 h-6 text-[#C49A6C]" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-white group-hover:text-[#C49A6C] transition-colors">
                      قائمة الطعام
                    </h3>
                    <p className="text-white/60 text-sm">استعرض جميع الأصناف</p>
                  </div>
                </div>
                <div className="text-[#C49A6C] text-sm flex items-center gap-1">
                  <span>استعرض القائمة</span>
                  <ArrowRight className="w-3 h-3 rotate-180" />
                </div>
              </Link>

              <Link
                href="/about"
                className="group bg-zinc-900 border border-[#C49A6C]/20 rounded-xl p-6 hover:border-[#C49A6C] hover:bg-zinc-800/50 transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-[#C49A6C]/20 rounded-lg">
                    <ChefHat className="w-6 h-6 text-[#C49A6C]" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-white group-hover:text-[#C49A6C] transition-colors">
                      عن المطعم
                    </h3>
                    <p className="text-white/60 text-sm">تعرف على قصتنا</p>
                  </div>
                </div>
                <div className="text-[#C49A6C] text-sm flex items-center gap-1">
                  <span>تعرف علينا</span>
                  <ArrowRight className="w-3 h-3 rotate-180" />
                </div>
              </Link>

              <div className="group bg-zinc-900 border border-[#C49A6C]/20 rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-[#C49A6C]/20 rounded-lg">
                    <Phone className="w-6 h-6 text-[#C49A6C]" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-white">
                      اتصل بنا
                    </h3>
                    <p className="text-white/60 text-sm">للحجز والاستفسارات</p>
                  </div>
                </div>
                <a 
                  href="tel:+201010882822" 
                  className="text-[#C49A6C] text-sm flex items-center gap-1 hover:underline"
                >
                  <span>01010882822</span>
                  <ArrowRight className="w-3 h-3 rotate-180" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Restaurant Info */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-zinc-900 border border-[#C49A6C]/20 rounded-xl p-6"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <MapPin className="text-[#C49A6C]" />
              <span>معلومات المطعم</span>
            </h2>
            
            <div className="space-y-6">
              {/* Opening Hours */}
              <div>
                <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                  <Clock size={18} />
                  أوقات العمل
                </h3>
                <div className="space-y-2">
                  {openingHours.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="text-white/70">{item.day}</span>
                      <span className="text-[#C49A6C] font-medium">{item.hours}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                  <Phone size={18} />
                  معلومات الاتصال
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 py-2">
                    <div className="w-2 h-2 bg-[#C49A6C] rounded-full"></div>
                    <a href="tel:+201010882822" className="text-white/70 hover:text-[#C49A6C] transition-colors">
                      01010882822
                    </a>
                  </div>
                  <div className="flex items-center gap-2 py-2">
                    <div className="w-2 h-2 bg-[#C49A6C] rounded-full"></div>
                    <span className="text-white/70">بزوم@gmail.com</span>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                  <MapPin size={18} />
                  العنوان
                </h3>
                <p className="text-white/70 leading-relaxed">
                  شارع المطاعم، منطقة التسوق،
                  <br />
                  القاهرة الجديدة، مصر
                </p>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="mt-8 p-4 bg-[#C49A6C]/10 rounded-lg border border-[#C49A6C]/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-[#C49A6C]/20 rounded-lg">
                  <ChefHat className="w-4 h-4 text-[#C49A6C]" />
                </div>
                <div>
                  <h4 className="font-bold text-white">التوصيل السريع</h4>
                  <p className="text-white/60 text-sm">خدمة توصيل 24/7</p>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-white/70">رسوم التوصيل</span>
                <span className="text-[#C49A6C] font-bold">20 ج.م</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search Suggestion */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-gradient-to-r from-[#C49A6C]/10 to-yellow-600/10 border border-[#C49A6C]/20 rounded-xl p-8 text-center max-w-3xl mx-auto mb-8"
        >
          <h3 className="text-2xl font-bold mb-4 text-white">
            هل تبحث عن شيء محدد؟
          </h3>
          <p className="text-white/70 mb-6">
            ربما يمكننا مساعدتك في العثور على ما تبحث عنه
          </p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 bg-[#C49A6C] text-black font-bold px-8 py-3 rounded-lg hover:bg-[#C49A6C]/90 transition-colors"
          >
            <Utensils className="w-5 h-5" />
            <span>استعرض جميع الأصناف</span>
            <ArrowRight className="w-5 h-5 rotate-180" />
          </Link>
        </motion.div>

        {/* Error Details (Collapsible) */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="bg-zinc-900/50 border border-white/10 rounded-xl p-6 max-w-3xl mx-auto"
        >
          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer text-white/70 hover:text-white transition-colors">
              <span>تفاصيل التقنية</span>
              <ArrowRight className="w-4 h-4 transform group-open:rotate-90 transition-transform" />
            </summary>
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <div>
                    <p className="text-sm font-mono text-white/90">خطأ 404 - الصفحة غير موجودة</p>
                    <p className="text-xs text-white/60">
                      الرابط الذي طلبتَه إما غير صحيح أو تم نقله إلى صفحة أخرى
                    </p>
                  </div>
                </div>
                <div className="text-xs text-white/50 font-mono bg-black/30 p-3 rounded-lg overflow-x-auto">
      {`// URL المعنية: ${typeof window !== "undefined" ? window.location.pathname : "unknown"}`}
                </div>
              </div>
            </div>
          </details>
        </motion.div>
      </div>

      {/* Footer Note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="text-white/40 text-sm mt-12 text-center max-w-2xl mx-auto"
      >
        © {new Date().getFullYear()} مطعم بزوم. جميع الحقوق محفوظة.
        <br />
        إذا كنت تواجه مشكلة مستمرة، يرجى <a href="mailto:bazzom@gmail.com" className="text-[#C49A6C] hover:underline">الاتصال بنا</a>
      </motion.p>
    </div>
  );
}