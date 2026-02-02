"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import {
  ChefHat,
  Clock,
  CheckCircle,
  Timer,
  Search,
  Eye,
  Check,
  X,
  Utensils,
  RefreshCw,
} from "lucide-react";
import { adminApi } from "../_services/adminApi";
import { queryKeys, setupRealtime } from "../_services/react-query";

export default function KitchenPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await adminApi.auth.checkAuth();
      if (!isAuth) {
        router.push("/admin/login");
        return;
      }

      const userRole = adminApi.auth.getCurrentRole();
      if (!["chief", "admin"].includes(userRole)) {
        toast.error("غير مصرح لك بالوصول إلى المطبخ");
        router.push("/");
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
        queryClient.invalidateQueries({ queryKey: queryKeys.orders.kitchen() });
      },
      (updatedOrder) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.orders.kitchen() });
      }
    );

    return cleanup;
  }, [queryClient]);

  // استعلام طلبات المطبخ
  const {
    data: orders = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.orders.kitchen(),
    queryFn: () => adminApi.orders.getKitchenOrders(),
    refetchInterval: 15000, // تحديث كل 15 ثانية
  });

  // طلب تحديث حالة الطلب
  const updateOrderStatusMutation = useMutation({
    mutationFn: ({ orderId, newStatus }) =>
      adminApi.orders.updateOrderStatus(orderId, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.kitchen() });
      toast.success("تم تحديث حالة الطلب");
    },
    onError: (error) => {
      toast.error(error.message || "حدث خطأ في تحديث حالة الطلب");
    },
  });

  const handleStartPreparing = (orderId) => {
    updateOrderStatusMutation.mutate({ orderId, newStatus: "preparing" });
  };

  const handleMarkAsReady = (orderId) => {
    updateOrderStatusMutation.mutate({ orderId, newStatus: "ready" });
  };

  const handleCancelOrder = (orderId) => {
    if (!confirm("هل أنت متأكد من إلغاء هذا الطلب؟")) return;
    updateOrderStatusMutation.mutate({ orderId, newStatus: "cancelled" });
  };

  const handleRefresh = () => {
    refetch();
    toast.success("تم تحديث البيانات");
  };

  const getOrderTime = (createdAt) => {
    if (!createdAt) return "غير معروف";
    const orderTime = new Date(createdAt);
    const now = new Date();
    const diffMinutes = Math.floor((now - orderTime) / (1000 * 60));

    if (diffMinutes < 1) return "الآن";
    if (diffMinutes < 60) return `قبل ${diffMinutes} دقيقة`;

    const diffHours = Math.floor(diffMinutes / 60);
    return `قبل ${diffHours} ساعة`;
  };

  const getOrderItemsCount = (items) => {
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_phone?.includes(searchTerm)
  );

  const pendingOrders = filteredOrders.filter(
    (order) => order.status === "pending"
  );
  const preparingOrders = filteredOrders.filter(
    (order) => order.status === "preparing"
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black pt-16 flex items-center justify-center">
        <div className="text-[#C49A6C] text-xl">جارٍ تحميل طلبات المطبخ...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-16">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <ChefHat className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                لوحة تحكم المطبخ
              </h1>
              <p className="text-white/60">
                إدارة طلبات المطبخ ومتابعة حالة التجهيز
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="bg-[#C49A6C] hover:bg-[#B8895A] text-black px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
              تحديث
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
            <input
              type="text"
              placeholder="ابحث عن طلب باسم العميل أو رقم الهاتف..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 pr-12 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C] transition-colors"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">طلبات جديدة</p>
                <p className="text-2xl font-bold text-white">
                  {pendingOrders.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Timer className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">قيد التجهيز</p>
                <p className="text-2xl font-bold text-white">
                  {preparingOrders.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Utensils className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">إجمالي العناصر</p>
                <p className="text-2xl font-bold text-white">
                  {filteredOrders.reduce(
                    (total, order) => total + getOrderItemsCount(order.items),
                    0
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Orders */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-400" />
                طلبات جديدة
                <span className="bg-yellow-500/20 text-yellow-400 text-sm px-2 py-1 rounded-full">
                  {pendingOrders.length}
                </span>
              </h2>
            </div>

            {pendingOrders.length === 0 ? (
              <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-8 text-center">
                <Clock className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/60">لا توجد طلبات جديدة</p>
              </div>
            ) : (
              pendingOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  type="pending"
                  onStartPreparing={handleStartPreparing}
                  onCancel={handleCancelOrder}
                  getOrderTime={getOrderTime}
                />
              ))
            )}
          </div>

          {/* Preparing Orders */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Timer className="w-5 h-5 text-blue-400" />
                قيد التجهيز
                <span className="bg-blue-500/20 text-blue-400 text-sm px-2 py-1 rounded-full">
                  {preparingOrders.length}
                </span>
              </h2>
            </div>

            {preparingOrders.length === 0 ? (
              <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-8 text-center">
                <Timer className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/60">لا توجد طلبات قيد التجهيز</p>
              </div>
            ) : (
              preparingOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  type="preparing"
                  onMarkAsReady={handleMarkAsReady}
                  getOrderTime={getOrderTime}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// مكون بطاقة الطلب
function OrderCard({
  order,
  type,
  onStartPreparing,
  onMarkAsReady,
  onCancel,
  getOrderTime,
}) {
  const router = useRouter();

  const viewOrderDetails = () => {
    router.push(`/order-confirmation/${order.id}`);
  };

  return (
    <div
      className={`bg-zinc-900 rounded-xl border ${
        type === "pending" ? "border-yellow-500/30" : "border-blue-500/30"
      } p-4`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono font-bold text-lg">
              #{order.id?.slice(0, 8) || "N/A"}
            </span>
            <span className="text-white/60 text-sm">
              {getOrderTime(order.created_at)}
            </span>
          </div>
          <p className="font-medium text-white">{order.customer_name}</p>
          <p className="text-white/60 text-sm">{order.customer_phone}</p>
          {order.notes && (
            <p className="text-white/60 text-sm mt-1">📝 {order.notes}</p>
          )}
          {order.chef_notes && (
            <p className="text-yellow-400/80 text-sm mt-1">
              👨‍🍳 {order.chef_notes}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              type === "pending"
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-blue-500/20 text-blue-400"
            }`}
          >
            {type === "pending" ? "جديد" : "قيد التجهيز"}
          </span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {Array.isArray(order.items) &&
          order.items.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-zinc-800/50 rounded-lg p-2"
            >
              <div className="flex items-center gap-2">
                <span className="text-white/70">{item.name}</span>
                <span className="text-white/40 text-sm">× {item.quantity}</span>
                {item.selectedSize && (
                  <span className="text-white/40 text-sm">
                    ({item.selectedSize})
                  </span>
                )}
              </div>
              <span className="text-[#C49A6C] text-sm">{item.price} ج.م</span>
            </div>
          ))}
      </div>

      <div className="flex gap-2">
        {type === "pending" ? (
          <>
            <button
              onClick={() => onStartPreparing(order.id)}
              className="flex-1 bg-[#C49A6C] hover:bg-[#B8895A] text-black px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Check className="w-4 h-4" />
              بدء التجهيز
            </button>
            <button
              onClick={() => onCancel(order.id)}
              className="px-4 py-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onMarkAsReady(order.id)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              تم التجهيز
            </button>
          </>
        )}
        <button
          onClick={viewOrderDetails}
          className="px-4 py-2 border border-[#C49A6C]/30 text-[#C49A6C] hover:bg-[#C49A6C]/10 rounded-lg transition-colors"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
