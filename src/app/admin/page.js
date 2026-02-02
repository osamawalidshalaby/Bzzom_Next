
// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import {
//   LogOut,
//   Home,
//   Menu,
//   BarChart3,
//   Users,
//   Settings,
//   Shield,
//   ShoppingCart,
//   ChefHat,
//   CreditCard,
// } from "lucide-react";
// import { adminApi } from "../_services/adminApi";
// import toast from "react-hot-toast";

// export default function AdminDashboard() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [userRole, setUserRole] = useState("");
//   const router = useRouter();

//   useEffect(() => {
//     const checkAuth = async () => {
//       const isAuth = await adminApi.auth.checkAuth();
//       if (!isAuth) {
//         router.push("/admin/login");
//         return;
//       }

//       const role = adminApi.auth.getCurrentRole();
//       if (!role) {
//         toast.error("لم يتم العثور على صلاحيات المستخدم");
//         router.push("/admin/login");
//         return;
//       }

//       setUserRole(role);
//       setIsAuthenticated(true);
//     };

//     checkAuth();
//   }, [router]);

//   const handleLogout = async () => {
//     try {
//       await adminApi.auth.logout();
//       router.push("/admin/login");
//     } catch (error) {
//       toast.error("حدث خطأ أثناء تسجيل الخروج");
//     }
//   };

//   if (!isAuthenticated) {
//     return (
//       <div className="min-h-screen bg-black flex items-center justify-center pt-16">
//         <div className="text-[#C49A6C] text-xl">جارٍ التحقق من الهوية...</div>
//       </div>
//     );
//   }

//   const getMenuItems = () => {
    

//     const adminItems = [
//       {
//         title: "إدارة الصفحة الرئيسية",
//         description: "إدارة الشرائح والأطباق المميزة والعروض",
//         icon: Home,
//         href: "/admin/home",
//         color: "bg-blue-500/20 text-blue-400",
//       },
//       {
//         title: "إدارة قائمة الطعام",
//         description: "إدارة أصناف الطعام والفئات",
//         icon: Menu,
//         href: "/admin/menu",
//         color: "bg-green-500/20 text-green-400",
//       },
//       {
//         title: "الإحصائيات",
//         description: "عرض إحصائيات الموقع والمبيعات",
//         icon: BarChart3,
//         href: "/admin/stats",
//         color: "bg-purple-500/20 text-purple-400",
//       },
//       {
//         title: "إدارة المستخدمين",
//         description: "إدارة حسابات الموظفين",
//         icon: Users,
//         href: "/admin/users",
//         color: "bg-orange-500/20 text-orange-400",
//       },
//       {
//         title: "الإعدادات",
//         description: "إعدادات النظام والموقع",
//         icon: Settings,
//         href: "/admin/settings",
//         color: "bg-gray-500/20 text-gray-400",
//       },
//     ];

//     const cashierItems = [
//       {
//         title: "إدارة الطلبات",
//         description: "إنشاء ومتابعة طلبات العملاء",
//         icon: ShoppingCart,
//         href: "/orders",
//         color: "bg-red-500/20 text-red-400",
//       },
//       {
//         title: "إنشاء طلب جديد",
//         description: "إضافة طلب جديد يدوياً",
//         icon: CreditCard,
//         href: "/orders/new",
//         color: "bg-green-500/20 text-green-400",
//       },
//     ];

//     const chiefItems = [
//       {
//         title: "لوحة المطبخ",
//         description: "متابعة طلبات المطبخ",
//         icon: ChefHat,
//         href: "/kitchen",
//         color: "bg-yellow-500/20 text-yellow-400",
//       },
//     ];

//     if (userRole === "admin") {
//       return [ ...adminItems, ...cashierItems, ...chiefItems];
//     } else if (userRole === "cashier") {
//       return [...commonItems, ...cashierItems];
//     } else if (userRole === "chief") {
//       return [...commonItems, ...chiefItems];
//     }

//     return commonItems;
//   };

//   const menuItems = getMenuItems();

//   return (
//     <div className="min-h-screen bg-black text-white pt-16">
//       <header className="bg-zinc-900 border-b border-[#C49A6C]/20 px-6 py-4">
//         <div className="max-w-7xl mx-auto flex items-center justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-[#C49A6C]">
//               لوحة تحكم بزوم
//             </h1>
//             <p className="text-white/60 text-sm">
//               {userRole === "admin" && "مدير النظام"}
//               {userRole === "chief" && "شيف المطبخ"}
//               {userRole === "cashier" && "كاشير"}
//             </p>
//           </div>
//           <div className="flex items-center gap-3">
//             <span className="text-white/60 text-sm">
//               مرحباً، {localStorage.getItem("userName") || "مستخدم"}
//             </span>
//             <button
//               onClick={handleLogout}
//               className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
//             >
//               <LogOut className="w-4 h-4" />
//               تسجيل الخروج
//             </button>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-6 py-8">
//         {/* Dashboard Header */}
//         <div className="mb-8">
//           <h2 className="text-2xl font-bold text-white mb-2">
//             لوحة التحكم الرئيسية
//           </h2>
//           <p className="text-white/60">اختر الخدمة التي تريد الوصول إليها</p>
//         </div>

//         {/* Dashboard Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {menuItems.map((item, index) => (
//             <Link
//               key={index}
//               href={item.href}
//               className="group bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4 hover:border-[#C49A6C] transition-all duration-300 hover:shadow-lg hover:shadow-[#C49A6C]/10"
//             >
//               <div className="flex items-start gap-4">
//                 <div
//                   className={`p-3 rounded-lg ${item.color} group-hover:scale-110 transition-transform`}
//                 >
//                   <item.icon className="w-6 h-6" />
//                 </div>
//                 <div className="flex-1">
//                   <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#C49A6C] transition-colors">
//                     {item.title}
//                   </h3>
//                   <p className="text-white/60 text-sm leading-relaxed">
//                     {item.description}
//                   </p>
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>

//         {/* Quick Stats - للادمن فقط */}
//         {userRole === "admin" && (
//           <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-green-500/20 rounded-lg">
//                   <Users className="w-5 h-5 text-green-400" />
//                 </div>
//                 <div>
//                   <p className="text-white/60 text-sm">الموظفون النشطون</p>
//                   <p className="text-2xl font-bold text-white">3</p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-blue-500/20 rounded-lg">
//                   <ShoppingCart className="w-5 h-5 text-blue-400" />
//                 </div>
//                 <div>
//                   <p className="text-white/60 text-sm">الطلبات النشطة</p>
//                   <p className="text-2xl font-bold text-white">12</p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-purple-500/20 rounded-lg">
//                   <BarChart3 className="w-5 h-5 text-purple-400" />
//                 </div>
//                 <div>
//                   <p className="text-white/60 text-sm">الإيرادات اليومية</p>
//                   <p className="text-2xl font-bold text-white">2,450 ج.م</p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-orange-500/20 rounded-lg">
//                   <Shield className="w-5 h-5 text-orange-400" />
//                 </div>
//                 <div>
//                   <p className="text-white/60 text-sm">الأصناف المتاحة</p>
//                   <p className="text-2xl font-bold text-white">24</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LogOut,
  Home,
  Menu,
  BarChart3,
  Users,
  Settings,
  Shield,
  ShoppingCart,
  ChefHat,
  CreditCard,
  Package,
  DollarSign,
  Clock,
} from "lucide-react";
import { adminApi } from "../_services/adminApi";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [stats, setStats] = useState({
    totalOrders: 0,
    dailyRevenue: 0,
    menuItems: 0,
    activeUsers: 0,
  });
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await adminApi.auth.checkAuth();
      if (!isAuth) {
        router.push("/admin/login");
        return;
      }

      const role = adminApi.auth.getCurrentRole();
      if (!role) {
        toast.error("لم يتم العثور على صلاحيات المستخدم");
        router.push("/admin/login");
        return;
      }

      setUserRole(role);
      setIsAuthenticated(true);

      // تحميل الإحصائيات
      loadStats();
    };

    checkAuth();
  }, [router]);

  const loadStats = async () => {
    try {
      const statsData = await adminApi.stats.getDashboardStats();
      setStats(statsData);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await adminApi.auth.logout();
      router.push("/admin/login");
    } catch (error) {
      toast.error("حدث خطأ أثناء تسجيل الخروج");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-16">
        <div className="text-[#C49A6C] text-xl">جارٍ التحقق من الهوية...</div>
      </div>
    );
  }

  const getMenuItems = () => {
    const commonItems = [];

    if (userRole === "admin") {
      return [
        {
          title: "إدارة الصفحة الرئيسية",
          description: "إدارة الشرائح والأطباق المميزة والعروض",
          icon: Home,
          href: "/admin/home",
          color: "bg-blue-500/20 text-blue-400",
        },
        {
          title: "إدارة قائمة الطعام",
          description: "إدارة أصناف الطعام والفئات",
          icon: Menu,
          href: "/admin/menu",
          color: "bg-green-500/20 text-green-400",
        },
        {
          title: "إدارة المستخدمين",
          description: "إدارة حسابات الموظفين",
          icon: Users,
          href: "/admin/users",
          color: "bg-orange-500/20 text-orange-400",
        },
        {
          title: "الإحصائيات",
          description: "عرض إحصائيات الموقع والمبيعات",
          icon: BarChart3,
          href: "/admin/stats",
          color: "bg-purple-500/20 text-purple-400",
        },
        {
          title: "الإعدادات",
          description: "إعدادات النظام والموقع",
          icon: Settings,
          href: "/admin/settings",
          color: "bg-gray-500/20 text-gray-400",
        },
        {
          title: "إدارة الطلبات",
          description: "إنشاء ومتابعة طلبات العملاء",
          icon: ShoppingCart,
          href: "/orders",
          color: "bg-red-500/20 text-red-400",
        },
        {
          title: "لوحة المطبخ",
          description: "متابعة طلبات المطبخ",
          icon: ChefHat,
          href: "/kitchen",
          color: "bg-yellow-500/20 text-yellow-400",
        },
      ];
    } else if (userRole === "cashier") {
      return [
        {
          title: "الطلبات النشطة",
          description: "متابعة الطلبات الحالية",
          icon: Clock,
          href: "/orders",
          color: "bg-blue-500/20 text-blue-400",
        },
        {
          title: "إنشاء طلب جديد",
          description: "إضافة طلب جديد يدوياً",
          icon: CreditCard,
          href: "/orders/new",
          color: "bg-green-500/20 text-green-400",
        },
        {
          title: "المبيعات اليومية",
          description: "عرض إحصائيات المبيعات",
          icon: DollarSign,
          href: "/orders?view=stats",
          color: "bg-purple-500/20 text-purple-400",
        },
      ];
    } else if (userRole === "chief") {
      return [
        {
          title: "لوحة المطبخ",
          description: "متابعة طلبات المطبخ",
          icon: ChefHat,
          href: "/kitchen",
          color: "bg-yellow-500/20 text-yellow-400",
        },
        {
          title: "الطلبات المنتظرة",
          description: "الطلبات الجديدة للمطبخ",
          icon: Package,
          href: "/kitchen?status=pending",
          color: "bg-red-500/20 text-red-400",
        },
        {
          title: "الطلبات قيد التحضير",
          description: "الطلبات قيد التنفيذ",
          icon: Clock,
          href: "/kitchen?status=preparing",
          color: "bg-orange-500/20 text-orange-400",
        },
      ];
    }

    return commonItems;
  };

  const menuItems = getMenuItems();

  return (
    <div className="min-h-screen bg-black text-white pt-16">
      <header className="bg-zinc-900 border-b border-[#C49A6C]/20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#C49A6C]">
              {userRole === "admin" && "لوحة تحكم الإدارة"}
              {userRole === "cashier" && "لوحة تحكم الكاشير"}
              {userRole === "chief" && "لوحة تحكم الشيف"}
            </h1>
            <p className="text-white/60 text-sm">
              مرحباً، {localStorage.getItem("userName") || "مستخدم"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              تسجيل الخروج
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        
        

        {/* Stats Cards - للمدير فقط */}
        {userRole === "admin" && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Users className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">الموظفون النشطون</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.activeUsers}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <ShoppingCart className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">الطلبات النشطة</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.totalOrders}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <DollarSign className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">الإيرادات اليومية</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.dailyRevenue} ج.م
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <Package className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">الأصناف المتاحة</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.menuItems}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards - للكاشير فقط */}
        {userRole === "cashier" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <ShoppingCart className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">الطلبات النشطة</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.totalOrders}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">المبيعات اليومية</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.dailyRevenue} ج.م
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <Clock className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">متوسط وقت التوصيل</p>
                  <p className="text-2xl font-bold text-white">30 دقيقة</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards - للشيف فقط */}
        {userRole === "chief" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <Package className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">الطلبات المنتظرة</p>
                  <p className="text-2xl font-bold text-white">5</p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <Clock className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">قيد التحضير</p>
                  <p className="text-2xl font-bold text-white">3</p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <ChefHat className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">منتهية اليوم</p>
                  <p className="text-2xl font-bold text-white">12</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="group bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4 hover:border-[#C49A6C] transition-all duration-300 hover:shadow-lg hover:shadow-[#C49A6C]/10"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-lg ${item.color} group-hover:scale-110 transition-transform`}
                >
                  <item.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#C49A6C] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}