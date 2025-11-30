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
} from "lucide-react";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem("adminAuthenticated");
    if (!auth) {
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    router.push("/admin/login");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-16">
        <div className="text-[#C49A6C] text-xl">جارٍ التحقق من الهوية...</div>
      </div>
    );
  }

  const menuItems = [
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
      title: "الإحصائيات",
      description: "عرض إحصائيات الموقع والمبيعات",
      icon: BarChart3,
      href: "/admin/stats",
      color: "bg-purple-500/20 text-purple-400",
    },
    {
      title: "إدارة المستخدمين",
      description: "إدارة حسابات المستخدمين والمراجعات",
      icon: Users,
      href: "/admin/users",
      color: "bg-orange-500/20 text-orange-400",
    },
    {
      title: "الإعدادات",
      description: "إعدادات النظام والموقع",
      icon: Settings,
      href: "/admin/settings",
      color: "bg-gray-500/20 text-gray-400",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-16">
      {" "}
      {/* Added pt-16 here */}
      {/* Header */}
      <header className="bg-zinc-900 border-b border-[#C49A6C]/20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#C49A6C]">
              لوحة تحكم بزوم
            </h1>
            <p className="text-white/60 text-sm">إدارة مطعم بزوم</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-2 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            تسجيل الخروج
          </button>
        </div>
      </header>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Users className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">إجمالي الطلبات</p>
                <p className="text-2xl font-bold text-white">1,234</p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <BarChart3 className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">الإيرادات اليومية</p>
                <p className="text-2xl font-bold text-white">2,450 جنية</p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Menu className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">أصناف الطعام</p>
                <p className="text-2xl font-bold text-white">24</p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Shield className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">المستخدمون النشطون</p>
                <p className="text-2xl font-bold text-white">156</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
