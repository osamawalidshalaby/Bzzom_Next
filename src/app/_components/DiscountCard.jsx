"use client";
import { useState, useEffect } from "react";
import { X, Gift } from "lucide-react";
import { settingsService } from "../_services/settings.service";

export default function DiscountCard() {
  const [showCard, setShowCard] = useState(false);
  const [discountData, setDiscountData] = useState({
    isEnabled: false,
    title: "خصم خاص",
    percentage: "20",
    description: "استفد من خصم خاص على جميع الطلبات",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await settingsService.getSettings();
        if (settings?.app?.discountCardEnabled && settings?.app?.discountData) {
          const discount = settings.app.discountData;
          setDiscountData({
            isEnabled: settings.app.discountCardEnabled,
            title: discount?.title || "خصم خاص",
            percentage: String(discount?.percentage || "20"),
            description: discount?.description || "استفد من خصم خاص على جميع الطلبات",
          });
          setShowCard(true);
        }
      } catch (error) {
        console.error("خطأ في جلب إعدادات الخصم:", error);
      }
    };

    fetchSettings();
  }, []);

  if (!showCard || !discountData.isEnabled) return null;

  return (
    <div className="relative w-full py-8 px-4 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Main Discount Card */}
        <div className="relative bg-gradient-to-r from-[#2d1810] via-[#1a1a1a] to-[#2d1810] border-2 border-[#C49A6C] rounded-2xl overflow-hidden shadow-2xl">
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C49A6C] rounded-full blur-3xl opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#8B6F47] rounded-full blur-3xl opacity-20"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 p-6 md:p-10 flex items-center justify-between gap-8">
            {/* Left side - Text content */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Gift className="w-8 h-8 md:w-10 md:h-10 text-[#C49A6C]" />
                <h3 className="text-xl md:text-3xl font-bold text-[#C49A6C]">
                  {discountData.title}
                </h3>
              </div>

              <p className="text-white/80 text-sm md:text-base leading-relaxed mb-4">
                {discountData.description}
              </p>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs md:text-sm text-[#C49A6C]/70">
                  استفد الآن من هذا العرض الحصري
                </span>
              </div>
            </div>

            {/* Right side - Discount Badge */}
            <div className="flex-shrink-0 flex flex-col items-center">
              <div className="relative w-28 h-28 md:w-36 md:h-36">
                {/* Outer circle background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#C49A6C] to-[#8B6F47] rounded-full flex items-center justify-center shadow-lg">
                  {/* Inner white circle */}
                  <div className="absolute inset-2 bg-black rounded-full flex items-center justify-center border-2 border-[#C49A6C]">
                    <div className="text-center">
                      <div className="text-4xl md:text-5xl font-bold text-[#C49A6C]">
                        {discountData.percentage}%
                      </div>
                      <div className="text-xs md:text-sm text-white/60 mt-1">
                        خصم
                      </div>
                    </div>
                  </div>
                </div>

                {/* Animated shine effect */}
                <div className="absolute inset-0 rounded-full animate-pulse bg-gradient-to-r from-transparent via-white to-transparent opacity-10"></div>
              </div>
            </div>
          </div>

          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C49A6C] to-transparent"></div>

          {/* Close button */}
          <button
            onClick={() => setShowCard(false)}
            className="absolute top-3 right-3 md:top-4 md:right-4 p-2 hover:bg-[#C49A6C]/20 rounded-lg transition-colors z-20"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5 text-[#C49A6C]" />
          </button>
        </div>

        {/* Optional: Bottom dots indicator */}
        <div className="flex justify-center gap-2 mt-4">
          <div className="w-2 h-2 rounded-full bg-[#C49A6C]"></div>
          <div className="w-2 h-2 rounded-full bg-[#C49A6C]/30"></div>
          <div className="w-2 h-2 rounded-full bg-[#C49A6C]/30"></div>
        </div>
      </div>
    </div>
  );
}
