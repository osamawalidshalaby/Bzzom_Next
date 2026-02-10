"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../home/_components/Header";
import GalleryManager from "../home/_components/GalleryManager";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { authService } from "../../_services/auth.service";
import { settingsService } from "../../_services/settings.service";
import {
  Save,
  AlertCircle,
  Phone,
  MapPin,
  Clock,
  DollarSign,
  Settings as SettingsIcon,
  CheckCircle,
  Edit,
} from "lucide-react";

export default function SettingsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("");
  const router = useRouter();

  // Form states
  const [restaurantSettings, setRestaurantSettings] = useState({
    name: "",
    phone: "",
    whatsapp: "",
    address: "",
    email: "",
    openingTime: "10:00",
    closingTime: "23:00",
    deliveryFee: "0",
    minOrderValue: "0",
    description: "",
    logo: "",
  });

  const [appSettings, setAppSettings] = useState({
    maintenanceMode: false,
    enableOnlinePayment: true,
    enableCashPayment: true,
    enableDelivery: true,
    enableDineIn: true,
    ramadanBannerEnabled: false,
    discountCardEnabled: false,
    maxOrdersPerDay: "100",
    avgDeliveryTime: "30",
  });

  const [discountData, setDiscountData] = useState({
    title: "خصم خاص",
    percentage: "20",
    description: "استفد من خصم خاص على جميع الطلبات",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showGallerySection, setShowGallerySection] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await authService.checkAuth();
      if (!isAuth) {
        router.push("/admin/login");
        return;
      }

      const role = authService.getCurrentRole();
      if (role !== "admin") {
        toast.error("فقط الإداريون يمكنهم الوصول إلى الإعدادات");
        router.push("/admin");
        return;
      }

      setUserRole(role);
      setIsAuthenticated(true);
    };

    checkAuth();
  }, [router]);

  // Fetch current settings
  const { data: currentSettings } = useQuery({
    queryKey: ["app-settings"],
    queryFn: async () => {
      const settings = await settingsService.getSettings();
      if (settings) {
        setRestaurantSettings((prev) => ({
          ...prev,
          ...settings.restaurant,
        }));
        setAppSettings((prev) => ({
          ...prev,
          ...settings.app,
        }));
        if (settings.app?.discountData) {
          setDiscountData(settings.app.discountData);
        }
      }
      return settings;
    },
    enabled: isAuthenticated,
  });

  // Save settings mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      setIsSaving(true);
      await settingsService.updateSettings({
        restaurant: restaurantSettings,
        app: {
          ...appSettings,
          discountData,
        },
      });
    },
    onSuccess: () => {
      toast.success("تم حفظ الإعدادات بنجاح!");
      setIsSaving(false);
    },
    onError: (error) => {
      toast.error(error.message || "حدث خطأ أثناء حفظ الإعدادات");
      setIsSaving(false);
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-16">
        <div className="text-[#C49A6C] text-xl">جارٍ التحقق من الهوية...</div>
      </div>
    );
  }

  if (userRole !== "admin") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-16">
        <div className="text-red-500 text-xl">
          فقط الإداريون يمكنهم الوصول إلى الإعدادات
        </div>
      </div>
    );
  }

  const handleRestaurantChange = (field, value) => {
    setRestaurantSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAppChange = (field, value) => {
    setAppSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    saveMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-black text-white pt-16">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1f2937",
            color: "#fff",
            border: "1px solid #C49A6C",
          },
        }}
      />

      <Header
        title="الإعدادات"
        subtitle="إدارة إعدادات الموقع والتطبيق"
        backUrl="/admin"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Restaurant Settings */}
        <div className="bg-zinc-900 border border-[#C49A6C]/20 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-[#C49A6C] mb-6 flex items-center gap-2">
            <SettingsIcon className="w-6 h-6" />
            إعدادات المطعم
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Restaurant Name */}
            <div>
              <label className="block text-white font-medium mb-2">
                اسم المطعم
              </label>
              <input
                type="text"
                value={restaurantSettings.name}
                onChange={(e) => handleRestaurantChange("name", e.target.value)}
                className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C] transition-colors"
                placeholder="أدخل اسم المطعم"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-white font-medium mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C49A6C]" />
                رقم الهاتف
              </label>
              <input
                type="tel"
                value={restaurantSettings.phone}
                onChange={(e) =>
                  handleRestaurantChange("phone", e.target.value)
                }
                className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C] transition-colors"
                placeholder="أدخل رقم الهاتف"
              />
            </div>

            {/* WhatsApp */}
            <div>
              <label className="block text-white font-medium mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C49A6C]" />
                رقم الواتس
              </label>
              <input
                type="tel"
                value={restaurantSettings.whatsapp}
                onChange={(e) =>
                  handleRestaurantChange("whatsapp", e.target.value)
                }
                className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C] transition-colors"
                placeholder="أدخل رقم الواتس"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-white font-medium mb-2">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={restaurantSettings.email}
                onChange={(e) =>
                  handleRestaurantChange("email", e.target.value)
                }
                className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C] transition-colors"
                placeholder="أدخل البريد الإلكتروني"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-white font-medium mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C49A6C]" />
                العنوان
              </label>
              <input
                type="text"
                value={restaurantSettings.address}
                onChange={(e) =>
                  handleRestaurantChange("address", e.target.value)
                }
                className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C] transition-colors"
                placeholder="أدخل عنوان المطعم"
              />
            </div>

            {/* Opening Time */}
            <div>
              <label className="block text-white font-medium mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C49A6C]" />
                وقت الفتح
              </label>
              <input
                type="time"
                value={restaurantSettings.openingTime}
                onChange={(e) =>
                  handleRestaurantChange("openingTime", e.target.value)
                }
                className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C] transition-colors"
              />
            </div>

            {/* Closing Time */}
            <div>
              <label className="block text-white font-medium mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C49A6C]" />
                وقت الإغلاق
              </label>
              <input
                type="time"
                value={restaurantSettings.closingTime}
                onChange={(e) =>
                  handleRestaurantChange("closingTime", e.target.value)
                }
                className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C] transition-colors"
              />
            </div>

            {/* Delivery Fee */}
            <div>
              <label className="block text-white font-medium mb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#C49A6C]" />
                رسوم التوصيل
              </label>
              <input
                type="number"
                value={restaurantSettings.deliveryFee}
                onChange={(e) =>
                  handleRestaurantChange("deliveryFee", e.target.value)
                }
                className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C] transition-colors"
                placeholder="0"
                min="0"
              />
            </div>

            {/* Minimum Order Value */}
            <div>
              <label className="block text-white font-medium mb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#C49A6C]" />
                الحد الأدنى للطلب
              </label>
              <input
                type="number"
                value={restaurantSettings.minOrderValue}
                onChange={(e) =>
                  handleRestaurantChange("minOrderValue", e.target.value)
                }
                className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C] transition-colors"
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-white font-medium mb-2">
              وصف المطعم
            </label>
            <textarea
              value={restaurantSettings.description}
              onChange={(e) =>
                handleRestaurantChange("description", e.target.value)
              }
              rows="4"
              className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C] transition-colors"
              placeholder="أدخل وصف المطعم"
            />
          </div>
        </div>

        {/* App Settings */}
        <div className="bg-zinc-900 border border-[#C49A6C]/20 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-[#C49A6C] mb-6">
            إعدادات التطبيق
          </h2>

          <div className="space-y-4 mb-6">
            {/* Toggle Settings */}
            {[
              { id: "maintenanceMode", label: "وضع الصيانة" },
              { id: "enableOnlinePayment", label: "تفعيل الدفع الإلكتروني" },
              { id: "enableCashPayment", label: "تفعيل الدفع النقدي" },
              { id: "enableDelivery", label: "تفعيل التوصيل" },
              { id: "enableDineIn", label: "تفعيل الطلب في المطعم" },
              { id: "ramadanBannerEnabled", label: "🌙 عرض بانر رمضان" },
              { id: "discountCardEnabled", label: "🎁 عرض بطاقة الخصم" },
            ].map((setting) => (
              <div
                key={setting.id}
                className="flex items-center justify-between p-4 bg-zinc-800 border border-[#C49A6C]/20 rounded-lg hover:border-[#C49A6C]/40 transition-colors"
              >
                <label
                  htmlFor={setting.id}
                  className="text-white font-medium cursor-pointer flex-1"
                >
                  {setting.label}
                </label>
                <input
                  id={setting.id}
                  type="checkbox"
                  checked={appSettings[setting.id] || false}
                  onChange={(e) =>
                    handleAppChange(setting.id, e.target.checked)
                  }
                  className="w-5 h-5 cursor-pointer accent-[#C49A6C]"
                />
              </div>
            ))}
          </div>

          {/* Numeric Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white font-medium mb-2">
                الحد الأقصى للطلبات يومياً
              </label>
              <input
                type="number"
                value={appSettings.maxOrdersPerDay}
                onChange={(e) =>
                  handleAppChange("maxOrdersPerDay", e.target.value)
                }
                className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C] transition-colors"
                placeholder="100"
                min="1"
              />
            </div>
            <div>
              <label className="block text-white font-medium mb-2">
                متوسط وقت التوصيل (بالدقائق)
              </label>
              <input
                type="number"
                value={appSettings.avgDeliveryTime}
                onChange={(e) =>
                  handleAppChange("avgDeliveryTime", e.target.value)
                }
                className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C] transition-colors"
                placeholder="30"
                min="1"
              />
            </div>
          </div>

          {/* Discount Card Settings */}
          {appSettings.discountCardEnabled && (
            <div className="mt-8 pt-8 border-t border-[#C49A6C]/20">
              <h3 className="text-xl font-bold text-[#C49A6C] mb-6">
                ⚙️ إعدادات بطاقة الخصم
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Discount Title */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    عنوان الخصم
                  </label>
                  <input
                    type="text"
                    value={discountData.title}
                    onChange={(e) =>
                      setDiscountData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C] transition-colors"
                    placeholder="خصم خاص"
                  />
                </div>

                {/* Discount Percentage */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    نسبة الخصم (%)
                  </label>
                  <input
                    type="number"
                    value={discountData.percentage}
                    onChange={(e) =>
                      setDiscountData((prev) => ({
                        ...prev,
                        percentage: e.target.value,
                      }))
                    }
                    className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C] transition-colors"
                    placeholder="20"
                    min="1"
                    max="100"
                  />
                </div>
              </div>

              {/* Discount Description */}
              <div>
                <label className="block text-white font-medium mb-2">
                  وصف الخصم
                </label>
                <textarea
                  value={discountData.description}
                  onChange={(e) =>
                    setDiscountData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows="3"
                  className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C] transition-colors"
                  placeholder="أدخل وصف الخصم"
                />
              </div>
            </div>
          )}
        </div>

        {/* Alert */}
        <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 mb-8 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-yellow-200 font-medium">تنبيه الحفظ</p>
            <p className="text-yellow-100 text-sm mt-1">
              تأكد من مراجعة جميع الإعدادات قبل الحفظ. بعض التغييرات قد تؤثر على
              تجربة المستخدم.
            </p>
          </div>
        </div>

        {/* Gallery Manager Section */}
        <div className="bg-zinc-900 border border-[#C49A6C]/20 rounded-lg p-6 mb-8">
          <button
            onClick={() => setShowGallerySection(!showGallerySection)}
            className="flex items-center gap-2 text-2xl font-bold text-[#C49A6C] hover:text-[#B8895A] transition-colors w-full"
          >
            <Edit className="w-6 h-6" />
            الصور والمعرض
            <span className="text-white/60 text-sm ml-auto">
              {showGallerySection ? "▼" : "◀"}
            </span>
          </button>
          {showGallerySection && (
            <div className="mt-6">
              <GalleryManager />
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-3 justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-[#C49A6C] hover:bg-[#B8895A] disabled:bg-[#C49A6C]/50 text-black font-bold px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                جاري الحفظ...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                حفظ الإعدادات
              </>
            )}
          </button>
        </div>

        {/* Success Message */}
        {saveMutation.isSuccess && (
          <div className="mt-6 bg-green-500/20 border border-green-500/50 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <p className="text-green-200">تم حفظ الإعدادات بنجاح!</p>
          </div>
        )}
      </div>
    </div>
  );
}
