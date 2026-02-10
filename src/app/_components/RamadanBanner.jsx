"use client";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { settingsService } from "../_services/settings.service";

export default function RamadanBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await settingsService.getSettings();
        if (settings?.app?.ramadanBannerEnabled) {
          setIsEnabled(true);
          setShowBanner(true);
        }
      } catch (error) {
        console.error("خطأ في جلب إعدادات رمضان:", error);
      }
    };

    fetchSettings();
  }, []);

  if (!showBanner || !isEnabled) return null;

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-[#1a1a1a] via-[#2d1810] to-[#1a1a1a] border-b-2 border-[#C49A6C]">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(196,154,108,0.3)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(196,154,108,0.3)_0%,transparent_50%)]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between gap-4">
          {/* Main content */}
          <div className="flex items-center gap-4 flex-1">
            {/* Islamic geometric design */}
            <div className="flex-shrink-0">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 bg-[#C49A6C] rounded-full opacity-10"></div>
                <div className="absolute inset-2 border-2 border-[#C49A6C] rounded-full opacity-50"></div>
                <div className="absolute inset-4 flex items-center justify-center">
                  <div className="text-2xl">🌙</div>
                </div>
              </div>
            </div>

            {/* Text content */}
            <div className="flex-1">
              <h3 className="text-2xl sm:text-3xl font-bold text-[#C49A6C] mb-1">
                رمضــــان كريم
              </h3>
              <p className="text-white/80 text-sm sm:text-base">
                نتمنى لكم شهراً مباركاً وكل عام وأنتم بألف خير
              </p>
              <p className="text-[#C49A6C]/70 text-xs sm:text-sm mt-2">
                نقدم لكم أفضل الأطباق الشهية لمائدتكم الرمضانية
              </p>
            </div>

            {/* Right side decoration */}
            <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 h-8 bg-[#C49A6C] rounded-full"
                    style={{
                      animation: `pulse ${1 + i * 0.1}s infinite`,
                      opacity: 0.6 + (i * 0.08),
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={() => setShowBanner(false)}
            className="flex-shrink-0 p-2 hover:bg-[#C49A6C]/10 rounded-lg transition-colors"
            aria-label="إغلاق البانر"
          >
            <X className="w-5 h-5 text-[#C49A6C]" />
          </button>
        </div>
      </div>

      {/* Animated top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C49A6C]/0 via-[#C49A6C] to-[#C49A6C]/0 animate-pulse"></div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
