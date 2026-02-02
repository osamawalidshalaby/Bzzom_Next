// ملف: app/auth/callback/page.jsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { customerApi } from "../../_services/customerApi";
import { supabase } from "../../_services/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // معالجة استجابة المصادقة
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth error:", error);
          router.push("/auth/signin");
          return;
        }

        if (session) {
          // تحديث بيانات المستخدم
          await customerApi.getCurrentCustomer();
          
          // التوجيه إلى الصفحة الرئيسية أو الصفحة المطلوبة
          const redirectTo = localStorage.getItem("redirectAfterAuth") || "/";
          localStorage.removeItem("redirectAfterAuth");
          
          router.push(redirectTo);
        } else {
          router.push("/auth/signin");
        }
      } catch (error) {
        console.error("Callback error:", error);
        router.push("/auth/signin");
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#C49A6C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-[#C49A6C]">جاري تسجيل الدخول...</p>
        <p className="text-white/60 text-sm mt-2">يتم تحويلك الآن</p>
      </div>
    </div>
  );
}