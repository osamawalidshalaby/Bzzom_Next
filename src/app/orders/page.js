"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import {
  ShoppingCart,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Bell,
  TrendingUp,
  User,
} from "lucide-react";
import { adminApi } from "../_services/adminApi";
import { queryKeys, setupRealtime } from "../_services/react-query";

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await adminApi.auth.checkAuth();
      if (!isAuth) {
        router.push("/admin/login");
        return;
      }

      const userRole = adminApi.auth.getCurrentRole();
      if (!["cashier", "admin"].includes(userRole)) {
        toast.error("غير مصرح لك بالوصول إلى هذه الصفحة");
        if (userRole === "chief") {
          router.push("/kitchen");
        } else {
          router.push("/");
        }
      }
    };

    checkAuth();
  }, [router]);

  // إعداد Supabase Realtime
  useEffect(() => {
    const cleanup = setupRealtime(
      adminApi.supabase,
      (newOrder) => {
        toast.success(`طلب جديد من ${newOrder.customer_name}`);
        queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      },
      (updatedOrder) => {
        if (updatedOrder.status === "ready") {
          toast.success(`الطلب #${updatedOrder.id.slice(0, 8)} جاهز للتسليم`);
        }
      }
    );

    return cleanup;
  }, [queryClient]);

  // استعلام الطلبات
  const {
    data: orders = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.orders.list({ status: statusFilter }),
    queryFn: () =>
      adminApi.orders.getOrders({
        status: statusFilter !== "all" ? statusFilter : undefined,
      }),
  });

  // استعلام الإحصائيات
  const { data: stats } = useQuery({
    queryKey: queryKeys.orders.stats(),
    queryFn: () => adminApi.orders.getOrderStats("today"),
  });

  // طلب تحديث حالة الطلب
  const updateOrderStatusMutation = useMutation({
    mutationFn: ({ orderId, newStatus }) =>
      adminApi.orders.updateOrderStatus(orderId, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.stats() });
    },
    onError: (error) => {
      toast.error(error.message || "حدث خطأ في تحديث حالة الطلب");
    },
  });

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    updateOrderStatusMutation.mutate({ orderId, newStatus });
  };

  const handleCreateOrder = () => {
    router.push("/cart");
  };

  const handleRefresh = () => {
    refetch();
    toast.success("تم تحديث البيانات");
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        color: "bg-yellow-500/20 text-yellow-400",
        icon: Clock,
        label: "قيد الانتظار",
      },
      preparing: {
        color: "bg-blue-500/20 text-blue-400",
        icon: Clock,
        label: "قيد التجهيز",
      },
      ready: {
        color: "bg-green-500/20 text-green-400",
        icon: CheckCircle,
        label: "جاهز للتسليم",
      },
      completed: {
        color: "bg-green-500/20 text-green-400",
        icon: CheckCircle,
        label: "مكتمل",
      },
      cancelled: {
        color: "bg-red-500/20 text-red-400",
        icon: XCircle,
        label: "ملغي",
      },
    };

    const config = statusConfig[status] || {
      color: "bg-gray-500/20 text-gray-400",
      icon: Clock,
      label: status,
    };
    const Icon = config.icon;

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${config.color}`}
      >
        <Icon className="w-4 h-4" />
        {config.label}
      </span>
    );
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_phone?.includes(searchTerm);

    return matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black pt-16 flex items-center justify-center">
        <div className="text-[#C49A6C] text-xl">جارٍ تحميل الطلبات...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-16">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">إدارة الطلبات</h1>
            <p className="text-white/60">إدارة ومتابعة طلبات العملاء</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
              تحديث
            </button>
            <button
              onClick={handleCreateOrder}
              className="bg-[#C49A6C] hover:bg-[#B8895A] text-black px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              طلب جديد
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-500/20 rounded-lg">
                <ShoppingCart className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">إجمالي الطلبات</p>
                <p className="text-2xl font-bold text-white">
                  {stats?.total || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">قيد الانتظار</p>
                <p className="text-2xl font-bold text-white">
                  {stats?.pending || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Clock className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">قيد التجهيز</p>
                <p className="text-2xl font-bold text-white">
                  {stats?.preparing || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">جاهز للتسليم</p>
                <p className="text-2xl font-bold text-white">
                  {stats?.ready || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">الإيرادات اليومية</p>
                <p className="text-2xl font-bold text-white">
                  {stats?.totalRevenue || 0} ج.م
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
              <input
                type="text"
                placeholder="ابحث برقم الطلب أو اسم العميل أو رقم الهاتف..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 pr-12 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C] transition-colors"
              />
            </div>
            <div className="flex gap-2">
              <Filter className="w-5 h-5 text-white/60 mt-3" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C49A6C]"
              >
                <option value="all">جميع الحالات</option>
                <option value="pending">قيد الانتظار</option>
                <option value="preparing">قيد التجهيز</option>
                <option value="ready">جاهز للتسليم</option>
                <option value="completed">مكتمل</option>
                <option value="cancelled">ملغي</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 overflow-hidden">
          {filteredOrders.length === 0 ? (
            <div className="p-8 text-center">
              <ShoppingCart className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/60">لا توجد طلبات</p>
              <button
                onClick={handleCreateOrder}
                className="mt-4 text-[#C49A6C] hover:text-[#B8895A]"
              >
                إنشاء أول طلب
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-right p-4 text-white/60">رقم الطلب</th>
                    <th className="text-right p-4 text-white/60">العميل</th>
                    <th className="text-right p-4 text-white/60">المبلغ</th>
                    <th className="text-right p-4 text-white/60">الحالة</th>
                    <th className="text-right p-4 text-white/60">التاريخ</th>
                    <th className="text-right p-4 text-white/60">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-white/5 hover:bg-white/5"
                    >
                      <td className="p-4 font-mono font-bold">
                        #{order.id?.slice(0, 8) || "N/A"}
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-white">
                            {order.customer_name}
                          </p>
                          <p className="text-white/60 text-sm">
                            {order.customer_phone}
                          </p>
                        </div>
                      </td>
                      <td className="p-4 font-bold">
                        {order.total_amount} ج.م
                      </td>
                      <td className="p-4">{getStatusBadge(order.status)}</td>
                      <td className="p-4 text-white/60">
                        {order.created_at
                          ? new Date(order.created_at).toLocaleDateString(
                              "ar-EG"
                            )
                          : "N/A"}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 justify-end">
                          {order.status === "ready" && (
                            <button
                              onClick={() =>
                                handleUpdateOrderStatus(order.id, "completed")
                              }
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm"
                            >
                              تأكيد التسليم
                            </button>
                          )}
                          {order.status === "pending" && (
                            <button
                              onClick={() =>
                                handleUpdateOrderStatus(order.id, "cancelled")
                              }
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm"
                            >
                              إلغاء الطلب
                            </button>
                          )}
                          <button
                            onClick={() =>
                              router.push(`/order-confirmation/${order.id}`)
                            }
                            className="text-[#C49A6C] hover:text-[#B8895A] p-2"
                            title="عرض التفاصيل"
                          >
                            <Bell className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
