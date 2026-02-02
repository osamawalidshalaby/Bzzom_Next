// ملف: app/profile/orders/page.jsx
"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  ChefHat,
  Package,
  Truck,
  ArrowLeft,
  Filter,
  Search,
  RefreshCw,
} from "lucide-react";
import { customerApi } from "../../_services/customerApi";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, statusFilter, searchTerm]);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const customerOrders = await customerApi.getCustomerOrders();
      setOrders(customerOrders || []);
    } catch (error) {
      console.error("Error loading orders:", error);
      toast.error("حدث خطأ في تحميل الطلبات");
    } finally {
      setIsLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(term) ||
          (order.customer_name || "").toLowerCase().includes(term) ||
          (order.customer_phone || "").includes(term)
      );
    }

    setFilteredOrders(filtered);
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        text: "قيد الانتظار",
        color: "text-yellow-400",
        bgColor: "bg-yellow-500/20",
        icon: Clock,
      },
      preparing: {
        text: "قيد التجهيز",
        color: "text-blue-400",
        bgColor: "bg-blue-500/20",
        icon: ChefHat,
      },
      ready: {
        text: "جاهز للتسليم",
        color: "text-green-400",
        bgColor: "bg-green-500/20",
        icon: Package,
      },
      completed: {
        text: "مكتمل",
        color: "text-green-400",
        bgColor: "bg-green-500/20",
        icon: CheckCircle,
      },
      cancelled: {
        text: "ملغي",
        color: "text-red-400",
        bgColor: "bg-red-500/20",
        icon: XCircle,
      },
    };

    return (
      configs[status] || {
        text: status,
        color: "text-gray-400",
        bgColor: "bg-gray-500/20",
        icon: Clock,
      }
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "غير معروف";
    try {
      return new Date(dateString).toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const getTotalItems = (order) => {
    if (!order.items || !Array.isArray(order.items)) return 0;
    return order.items.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-12 px-4">
      <Toaster position="top-center" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/profile"
            className="flex items-center gap-2 text-[#C49A6C] hover:text-[#B08A5C] transition-all mb-4"
          >
            <ArrowLeft size={20} />
            <span>العودة إلى حسابي</span>
          </Link>

          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-[#C49A6C]">طلباتي</h1>
              <p className="text-white/60 mt-2">
                تتبع جميع طلباتك السابقة والحالية
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={loadOrders}
                disabled={isLoading}
                className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg transition-all disabled:opacity-50"
              >
                <RefreshCw className={isLoading ? "animate-spin" : ""} size={18} />
                <span>تحديث</span>
              </button>

              <Link
                href="/menu"
                className="flex items-center gap-2 bg-[#C49A6C] hover:bg-[#B08A5C] text-black px-4 py-2 rounded-lg font-semibold transition-all"
              >
                <ShoppingBag size={18} />
                <span>طلب جديد</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
              <input
                type="text"
                placeholder="ابحث برقم الطلب أو الاسم..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 pr-12 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C] transition-colors"
              />
            </div>

            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-white/60" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C49A6C] min-w-[150px]"
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

        {/* Orders Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-3">
            <p className="text-white/60 text-sm">إجمالي الطلبات</p>
            <p className="text-2xl font-bold text-white">{orders.length}</p>
          </div>
          <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-3">
            <p className="text-white/60 text-sm">قيد الانتظار</p>
            <p className="text-2xl font-bold text-yellow-400">
              {orders.filter((o) => o.status === "pending").length}
            </p>
          </div>
          <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-3">
            <p className="text-white/60 text-sm">قيد التجهيز</p>
            <p className="text-2xl font-bold text-blue-400">
              {orders.filter((o) => o.status === "preparing").length}
            </p>
          </div>
          <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-3">
            <p className="text-white/60 text-sm">جاهزة</p>
            <p className="text-2xl font-bold text-green-400">
              {orders.filter((o) => o.status === "ready").length}
            </p>
          </div>
          <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-3">
            <p className="text-white/60 text-sm">مكتملة</p>
            <p className="text-2xl font-bold text-green-400">
              {orders.filter((o) => o.status === "completed").length}
            </p>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-zinc-900 rounded-2xl border border-[#C49A6C]/20 overflow-hidden">
          {isLoading ? (
            <div className="text-center py-16">
              <div className="w-12 h-12 border-4 border-[#C49A6C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white/60">جاري تحميل الطلبات...</p>
            </div>
          ) : filteredOrders.length > 0 ? (
            <div className="divide-y divide-white/10">
              {filteredOrders.map((order) => {
                const statusConfig = getStatusConfig(order.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-mono font-bold text-white">
                            #{order.id.slice(0, 8)}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${statusConfig.bgColor} ${statusConfig.color}`}
                          >
                            <StatusIcon className="w-4 h-4" />
                            {statusConfig.text}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-white/60 text-sm">المبلغ</p>
                            <p className="text-[#C49A6C] font-bold text-lg">
                              {order.total_amount} ج.م
                            </p>
                          </div>

                          <div>
                            <p className="text-white/60 text-sm">عدد العناصر</p>
                            <p className="text-white">{getTotalItems(order)}</p>
                          </div>

                          <div>
                            <p className="text-white/60 text-sm">التاريخ</p>
                            <p className="text-white">{formatDate(order.created_at)}</p>
                          </div>
                        </div>

                        {order.items && order.items.length > 0 && (
                          <div className="mt-3">
                            <p className="text-white/60 text-sm mb-1">العناصر:</p>
                            <div className="flex flex-wrap gap-2">
                              {order.items.slice(0, 3).map((item, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-zinc-800 rounded text-sm text-white/80"
                                >
                                  {item.quantity}x {item.name}
                                </span>
                              ))}
                              {order.items.length > 3 && (
                                <span className="px-2 py-1 bg-zinc-800 rounded text-sm text-white/60">
                                  +{order.items.length - 3} أكثر
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Link
                          href={`/order-confirmation/${order.id}`}
                          className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg transition-all"
                        >
                          <Package size={16} />
                          <span>عرض التفاصيل</span>
                        </Link>

                        {order.status === "ready" && (
                          <button
                            onClick={() => {
                              // إجراء عند استلام الطلب
                              toast.success("تم تأكيد استلام الطلب");
                            }}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all"
                          >
                            <CheckCircle size={16} />
                            <span>تأكيد الاستلام</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <ShoppingBag className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                لا توجد طلبات
              </h3>
              <p className="text-white/60 mb-6">
                {searchTerm || statusFilter !== "all"
                  ? "لم يتم العثور على طلبات تطابق بحثك"
                  : "لم تقم بأي طلبات حتى الآن"}
              </p>
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 bg-[#C49A6C] hover:bg-[#B08A5C] text-black px-6 py-3 rounded-lg font-semibold transition-all"
              >
                <ShoppingBag size={18} />
                <span>تصفح القائمة واطلب الآن</span>
              </Link>
            </div>
          )}
        </div>

        {/* Order Status Guide */}
        <div className="mt-8 p-5 bg-zinc-900 rounded-xl border border-[#C49A6C]/20">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <Truck size={20} />
            دليل حالة الطلبات
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div className="p-3 bg-yellow-500/10 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-yellow-400" />
                <span className="font-medium text-yellow-400">قيد الانتظار</span>
              </div>
              <p className="text-white/70 text-sm">تم استلام طلبك</p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <ChefHat className="w-4 h-4 text-blue-400" />
                <span className="font-medium text-blue-400">قيد التجهيز</span>
              </div>
              <p className="text-white/70 text-sm">جاري تحضير طلبك</p>
            </div>
            <div className="p-3 bg-green-500/10 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Package className="w-4 h-4 text-green-400" />
                <span className="font-medium text-green-400">جاهز للتسليم</span>
              </div>
              <p className="text-white/70 text-sm">طلبك جاهز للاستلام</p>
            </div>
            <div className="p-3 bg-green-500/10 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="font-medium text-green-400">مكتمل</span>
              </div>
              <p className="text-white/70 text-sm">تم تسليم الطلب</p>
            </div>
            <div className="p-3 bg-red-500/10 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <XCircle className="w-4 h-4 text-red-400" />
                <span className="font-medium text-red-400">ملغي</span>
              </div>
              <p className="text-white/70 text-sm">تم إلغاء الطلب</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}