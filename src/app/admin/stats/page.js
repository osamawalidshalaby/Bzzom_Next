"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../home/_components/Header";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { authService } from "../../_services/auth.service";
import { statsService } from "../../_services/stats.service";
import { ordersService } from "../../_services/orders.service";
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Calendar,
} from "lucide-react";

export default function StatsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await authService.checkAuth();
      if (!isAuth) {
        router.push("/admin/login");
        return;
      }

      const role = authService.getCurrentRole();
      if (!role || !["admin", "chief"].includes(role)) {
        toast.error("غير مصرح لك بالوصول إلى هذه الصفحة");
        router.push("/admin/dashboard");
        return;
      }

      setUserRole(role);
      setIsAuthenticated(true);
    };

    checkAuth();
  }, [router]);

  // Fetch dashboard stats
  const { data: dashboardStats = {} } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => statsService.getDashboardStats(),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch recent orders
  const { data: recentOrders = [] } = useQuery({
    queryKey: ["recent-orders"],
    queryFn: () => statsService.getRecentOrders(),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // Fetch sales stats
  const { data: salesStats = {} } = useQuery({
    queryKey: ["sales-stats", selectedPeriod],
    queryFn: () => statsService.getSalesStats(selectedPeriod),
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-16">
        <div className="text-[#C49A6C] text-xl">جارٍ التحقق من الهوية...</div>
      </div>
    );
  }

  if (!["admin", "chief"].includes(userRole)) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-16">
        <div className="text-red-500 text-xl">
          غير مصرح لك بالوصول إلى هذه الصفحة
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "إجمالي الطلبات",
      value: dashboardStats.totalOrders || 0,
      icon: ShoppingCart,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
    },
    {
      title: "إجمالي المبيعات",
      value: `${dashboardStats.totalRevenue || 0} جنية`,
      icon: DollarSign,
      color: "text-green-400",
      bgColor: "bg-green-500/20",
    },
    {
      title: "متوسط قيمة الطلب",
      value: `${dashboardStats.averageOrderValue || 0} جنية`,
      icon: TrendingUp,
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
    },
    {
      title: "المستخدمين النشطين",
      value: dashboardStats.activeUsers || 0,
      icon: Users,
      color: "text-orange-400",
      bgColor: "bg-orange-500/20",
    },
  ];

  const periods = [
    { id: "today", label: "اليوم" },
    { id: "week", label: "هذا الأسبوع" },
    { id: "month", label: "هذا الشهر" },
    { id: "year", label: "هذا العام" },
  ];

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
        title="الإحصائيات"
        subtitle="عرض إحصائيات الموقع والمبيعات"
        backUrl="/admin"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="bg-zinc-900 border border-[#C49A6C]/20 rounded-lg p-6 hover:border-[#C49A6C]/40 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className="text-white/60 text-xs">متحدث</span>
              </div>
              <h3 className="text-white/70 text-sm font-medium mb-2">
                {stat.title}
              </h3>
              <p className="text-2xl font-bold text-[#C49A6C]">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Sales Report Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Sales Chart */}
          <div className="lg:col-span-2 bg-zinc-900 border border-[#C49A6C]/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#C49A6C]">
                التقرير المالي
              </h2>
              <div className="flex gap-2">
                {periods.map((period) => (
                  <button
                    key={period.id}
                    onClick={() => setSelectedPeriod(period.id)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      selectedPeriod === period.id
                        ? "bg-[#C49A6C] text-black"
                        : "bg-white/5 text-white/70 hover:bg-white/10"
                    }`}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/70 text-sm">الإيرادات</span>
                  <span className="text-[#C49A6C] font-bold">
                    {salesStats.revenue || 0} جنية
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#C49A6C] to-[#D4A574] h-full rounded-full"
                    style={{
                      width: `${Math.min((salesStats.revenue || 0) / 1000, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/70 text-sm">عدد الطلبات</span>
                  <span className="text-[#C49A6C] font-bold">
                    {salesStats.orderCount || 0} طلب
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-400 h-full rounded-full"
                    style={{
                      width: `${Math.min((salesStats.orderCount || 0) / 100, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/70 text-sm">متوسط الطلب</span>
                  <span className="text-[#C49A6C] font-bold">
                    {salesStats.averageOrderValue || 0} جنية
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-400 h-full rounded-full"
                    style={{
                      width: `${Math.min(
                        (salesStats.averageOrderValue || 0) / 500,
                        100,
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-zinc-900 border border-[#C49A6C]/20 rounded-lg p-6">
            <h3 className="text-lg font-bold text-[#C49A6C] mb-4">ملخص سريع</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <span className="text-white/70 text-sm">فئات الطعام</span>
                <span className="text-[#C49A6C] font-bold">
                  {dashboardStats.categoriesCount || 0}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <span className="text-white/70 text-sm">أصناف الطعام</span>
                <span className="text-[#C49A6C] font-bold">
                  {dashboardStats.menuItems || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">الموظفين النشطين</span>
                <span className="text-[#C49A6C] font-bold">
                  {dashboardStats.activeUsers || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-zinc-900 border border-[#C49A6C]/20 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-[#C49A6C]/20">
            <h2 className="text-xl font-bold text-[#C49A6C] flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              الطلبات الأخيرة
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#C49A6C]/20">
                  <th className="px-6 py-3 text-right text-xs font-semibold text-white/70">
                    رقم الطلب
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-white/70">
                    العميل
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-white/70">
                    المبلغ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-white/70">
                    الحالة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-white/70">
                    التاريخ
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-[#C49A6C]/10 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-white font-medium">
                        #{order.id.substring(0, 8)}
                      </td>
                      <td className="px-6 py-4 text-sm text-white/80">
                        {order.customer}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#C49A6C] font-bold">
                        {order.total}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.status === "completed"
                              ? "bg-green-500/20 text-green-400"
                              : order.status === "pending"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : order.status === "preparing"
                                  ? "bg-blue-500/20 text-blue-400"
                                  : "bg-gray-500/20 text-gray-400"
                          }`}
                        >
                          {order.status === "completed"
                            ? "مكتمل"
                            : order.status === "pending"
                              ? "قيد الانتظار"
                              : order.status === "preparing"
                                ? "قيد الإعداد"
                                : "ملغى"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-white/60">
                        {order.date}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-8 text-center text-white/50"
                    >
                      لا توجد طلبات حتى الآن
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
