// ملف: app/auth/signin/page.jsx (محدث للجوال)
"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { ChefHat, ArrowRight, LogIn, Home } from "lucide-react";
import { customerApi } from "../../_services/customerApi";
import { authApi } from "../../_services/adminApi";
import Image from "next/image";

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  useEffect(() => {
    // إذا كان المستخدم مسجلاً كمستخدم عادي، توجيهه
    if (customerApi.isAuthenticated()) {
      router.push(redirectTo);
    }
    
    // إذا كان مسجلاً كـ admin/cashier، توجيهه للوحة التحكم
    if (authApi.isAuthenticated()) {
      router.push("/admin/dashboard");
    }
  }, [router, redirectTo]);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await customerApi.signInWithGoogle();
      // الانتظار للمصادقة ستتم من خلال Supabase Auth callback
    } catch (error) {
      console.error("Google sign in error:", error);
      toast.error("فشل تسجيل الدخول بحساب جوجل");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-16 pb-12 px-4">
      <Toaster position="top-center" />
      
      <div className="max-w-md mx-auto mt-8">
        

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-6 mb-6"
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-[#C49A6C]/10 rounded-full flex items-center justify-center">
              <LogIn className="w-8 h-8 text-[#C49A6C]" />
            </div>
            <p className="text-white/80 text-sm mb-6">
              سجل دخولك لطلب الطعام وتتبع الطلبات وحفظ العناوين
            </p>
          </div>

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full bg-white text-black py-3 rounded-lg font-medium hover:bg-gray-100 transition-all flex items-center justify-center gap-3 disabled:opacity-50 text-sm"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                جاري تسجيل الدخول...
              </>
            ) : (
              <>
                <Image
                  src="https://www.google.com/favicon.ico"
                  alt="Google"
                  width={20}
                  height={20}
                />
                <span>تسجيل الدخول بحساب جوجل</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Admin/Cashier Login Link */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-white/60 text-sm text-center mb-3">
              أنت موظف في المطعم؟
            </p>
            <Link
              href="/admin/login"
              className="block w-full bg-zinc-800 hover:bg-zinc-700 text-white py-2 rounded-lg text-sm text-center transition-all"
            >
              تسجيل دخول الموظفين
            </Link>
          </div>
        </motion.div>

        {/* Continue as Guest */}
        <div className="text-center">
          <Link
            href={redirectTo}
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-all text-sm"
          >
            <Home className="w-4 h-4" />
            متابعة كزائر
          </Link>
        </div>

        {/* Features Grid - Mobile Optimized */}
        <div className="mt-8 grid grid-cols-2 gap-3">
          <div className="p-4 bg-zinc-900/50 rounded-lg">
            <div className="w-8 h-8 bg-[#C49A6C]/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <ChefHat className="w-4 h-4 text-[#C49A6C]" />
            </div>
            <h3 className="font-medium text-white text-sm text-center">طلبات سريعة</h3>
          </div>
          
          <div className="p-4 bg-zinc-900/50 rounded-lg">
            <div className="w-8 h-8 bg-[#C49A6C]/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-4 h-4 text-[#C49A6C]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
            <h3 className="font-medium text-white text-sm text-center">تتبع مباشر</h3>
          </div>
        </div>
      </div>
    </div>
  );
}