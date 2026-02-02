// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { useForm } from "react-hook-form";
// import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";
// import toast, { Toaster } from "react-hot-toast";
// import supabase from "../../_services/supabase";

// export default function AdminLogin() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const router = useRouter();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();

//   const onSubmit = async (data) => {
//     setIsLoading(true);
//     try {
//       // For demo purposes, using simple auth
//       // In production, use proper authentication
//       if (data.email === "admin@bazzom.com" && data.password === "admin123") {
//         localStorage.setItem("adminAuthenticated", "true");
//         toast.success("تم تسجيل الدخول بنجاح!");
//         router.push("/admin");
//       } else {
//         toast.error("بيانات الدخول غير صحيحة");
//       }
//     } catch (error) {
//       toast.error("حدث خطأ في تسجيل الدخول");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-black flex items-center justify-center px-4">
//       <Toaster
//         position="top-center"
//         toastOptions={{
//           duration: 3000,
//           style: {
//             background: "#1f2937",
//             color: "#fff",
//             border: "1px solid #C49A6C",
//           },
//         }}
//       />

//       <div className="max-w-md w-full">
//         {/* Logo */}
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-[#C49A6C] mb-2">بزوم</h1>
//           <p className="text-white/60">لوحة تحكم الإدارة</p>
//         </div>

//         {/* Login Form */}
//         <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-8">
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//             {/* Email Field */}
//             <div>
//               <label className="block text-white font-medium mb-2">
//                 البريد الإلكتروني
//               </label>
//               <div className="relative">
//                 <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#C49A6C] w-5 h-5" />
//                 <input
//                   type="email"
//                   {...register("email", {
//                     required: "البريد الإلكتروني مطلوب",
//                     pattern: {
//                       value: /^\S+@\S+$/i,
//                       message: "البريد الإلكتروني غير صحيح",
//                     },
//                   })}
//                   className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 pr-12 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C] transition-colors"
//                   placeholder="admin@bazzom.com"
//                 />
//               </div>
//               {errors.email && (
//                 <p className="text-red-400 text-sm mt-1">
//                   {errors.email.message}
//                 </p>
//               )}
//             </div>

//             {/* Password Field */}
//             <div>
//               <label className="block text-white font-medium mb-2">
//                 كلمة المرور
//               </label>
//               <div className="relative">
//                 <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#C49A6C] w-5 h-5" />
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   {...register("password", {
//                     required: "كلمة المرور مطلوبة",
//                     minLength: {
//                       value: 6,
//                       message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
//                     },
//                   })}
//                   className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 pr-12 pl-12 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C] transition-colors"
//                   placeholder="أدخل كلمة المرور"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#C49A6C] hover:text-white transition-colors"
//                 >
//                   {showPassword ? (
//                     <EyeOff className="w-5 h-5" />
//                   ) : (
//                     <Eye className="w-5 h-5" />
//                   )}
//                 </button>
//               </div>
//               {errors.password && (
//                 <p className="text-red-400 text-sm mt-1">
//                   {errors.password.message}
//                 </p>
//               )}
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full bg-[#C49A6C] hover:bg-[#B8895A] disabled:bg-[#C49A6C]/50 text-black font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
//             >
//               {isLoading ? (
//                 <>
//                   <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
//                   جارٍ تسجيل الدخول...
//                 </>
//               ) : (
//                 <>
//                   تسجيل الدخول
//                   <ArrowRight className="w-5 h-5" />
//                 </>
//               )}
//             </button>
//           </form>

          
         
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  ChefHat,
  ShoppingBag,
  Shield,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { adminApi } from "../../_services/adminApi";

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await adminApi.auth.login(data.email, data.password);

      if (result.user) {
        const role = result.profile?.role || "cashier";
        const userName = result.profile?.name || result.user.email;

        toast.success(`مرحباً ${userName}`);

        // توجيه المستخدم بناءً على دوره
        switch (role) {
          case "admin":
            router.push("/admin");
            break;
          case "chief":
            router.push("/kitchen");
            break;
          case "cashier":
            router.push("/orders");
            break;
          default:
            router.push("/");
        }
      }
    } catch (error) {
      toast.error(error.message || "بيانات الدخول غير صحيحة");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-8">
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

      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#C49A6C] mb-2">بزوم</h1>
          <p className="text-white/60">
            نظام إدارة المطعم - تسجيل دخول الموظفين
          </p>

          <div className="mt-4 flex justify-center gap-3">
            <div className="flex items-center gap-1 bg-blue-500/10 px-3 py-1 rounded-full">
              <Shield className="w-3 h-3 text-blue-400" />
              <span className="text-blue-400 text-xs">مدير</span>
            </div>
            <div className="flex items-center gap-1 bg-green-500/10 px-3 py-1 rounded-full">
              <ChefHat className="w-3 h-3 text-green-400" />
              <span className="text-green-400 text-xs">شيف</span>
            </div>
            <div className="flex items-center gap-1 bg-purple-500/10 px-3 py-1 rounded-full">
              <ShoppingBag className="w-3 h-3 text-purple-400" />
              <span className="text-purple-400 text-xs">كاشير</span>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-white font-medium mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#C49A6C] w-5 h-5" />
                <input
                  type="email"
                  {...register("email", {
                    required: "البريد الإلكتروني مطلوب",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "البريد الإلكتروني غير صحيح",
                    },
                  })}
                  className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 pr-12 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C] transition-colors"
                  placeholder="أدخل البريد الإلكتروني"
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-white font-medium mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#C49A6C] w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "كلمة المرور مطلوبة",
                    minLength: {
                      value: 6,
                      message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
                    },
                  })}
                  className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 pr-12 pl-12 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C] transition-colors"
                  placeholder="أدخل كلمة المرور"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#C49A6C] hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#C49A6C] hover:bg-[#B8895A] disabled:bg-[#C49A6C]/50 text-black font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  جارٍ تسجيل الدخول...
                </>
              ) : (
                <>
                  تسجيل الدخول
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>


          </form>
        </div>
      </div>
    </div>
  );
}