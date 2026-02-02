// ملف: app/profile/add-address/page.jsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeft, Save, MapPin, Home, Briefcase } from "lucide-react";
import { customerApi } from "../../_services/customerApi";
import Link from "next/link";

export default function AddAddressPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    address: "",
    isDefault: false,
  });
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.address.trim()) {
      toast.error("الرجاء ملء جميع الحقول المطلوبة");
      return;
    }

    try {
      setIsLoading(true);
      await customerApi.addAddress(formData);
      toast.success("تم إضافة العنوان بنجاح");
      router.push("/profile");
    } catch (error) {
      console.error("Error adding address:", error);
      toast.error("حدث خطأ في إضافة العنوان");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-16 pb-12 px-4">
      <Toaster position="top-center" />
      
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/profile"
            className="flex items-center gap-2 text-white/60 hover:text-white transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">رجوع</span>
          </Link>
          <h1 className="text-xl font-bold text-[#C49A6C]">إضافة عنوان جديد</h1>
          <div className="w-10"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Address Type */}
          <div>
            <label className="block text-white mb-3 text-sm font-medium">
              نوع العنوان
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: Home, label: "المنزل", value: "المنزل" },
                { icon: Briefcase, label: "العمل", value: "العمل" },
                { icon: MapPin, label: "آخر", value: "آخر" },
              ].map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, title: type.value }))}
                  className={`p-3 rounded-lg border transition-all ${
                    formData.title === type.value
                      ? "border-[#C49A6C] bg-[#C49A6C]/10"
                      : "border-white/20 bg-zinc-900 hover:border-[#C49A6C]/50"
                  }`}
                >
                  <type.icon className={`w-5 h-5 mx-auto mb-1 ${
                    formData.title === type.value ? "text-[#C49A6C]" : "text-white/60"
                  }`} />
                  <span className={`text-xs ${
                    formData.title === type.value ? "text-[#C49A6C]" : "text-white/60"
                  }`}>
                    {type.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Title */}
          {formData.title === "آخر" && (
            <div>
              <label className="block text-white mb-2 text-sm font-medium">
                اسم العنوان المخصص
              </label>
              <input
                type="text"
                value={formData.customTitle || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="مثال: منزل الأهل، الشقة الثانية..."
                className="w-full px-4 py-3 bg-zinc-900 border border-[#C49A6C]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#C49A6C] transition-all text-sm"
              />
            </div>
          )}

          {/* Address Details */}
          <div>
            <label className="block text-white mb-2 text-sm font-medium">
              العنوان التفصيلي *
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="أدخل العنوان بالتفصيل: المنطقة، الشارع، رقم المبني، الشقة..."
              rows="4"
              className="w-full px-4 py-3 bg-zinc-900 border border-[#C49A6C]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#C49A6C] transition-all resize-none text-sm"
              required
            />
          </div>

          {/* Default Address */}
          <div className="flex items-center gap-2 p-3 bg-zinc-900/50 rounded-lg">
            <input
              type="checkbox"
              id="isDefault"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
              className="w-4 h-4 text-[#C49A6C] rounded focus:ring-[#C49A6C] focus:ring-offset-2 focus:ring-offset-black"
            />
            <label htmlFor="isDefault" className="text-white/80 text-sm">
              تعيين كعنوان افتراضي
            </label>
          </div>

          {/* Notes */}
          <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <p className="text-blue-300 text-xs">
              💡 <strong>ملاحظة:</strong> سيتم استخدام العنوان الافتراضي تلقائياً عند طلب الطعام
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#C49A6C] hover:bg-[#B08A5C] text-black py-3 rounded-lg font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                جاري الإضافة...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                إضافة العنوان
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}