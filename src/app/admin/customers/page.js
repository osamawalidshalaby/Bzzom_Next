"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import {
  ArrowLeft,
  Users,
  User,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  Search,
  Package,
  Calendar,
} from "lucide-react";
import { authService } from "../../_services/auth.service";
import { supabase } from "../../_services/supabase";

export default function AdminCustomersPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      try {
        const isAuth = await authService.checkAuth();
        if (!isAuth) {
          router.push("/admin/login");
          return;
        }

        const role = authService.getCurrentRole();
        if (role !== "admin") {
          toast.error("غير مصرح لك بالوصول إلى هذه الصفحة");
          if (role === "chief") router.push("/kitchen");
          else if (role === "cashier") router.push("/orders");
          else router.push("/");
          return;
        }

        await loadCustomers();
      } catch (error) {
        console.error("Auth check error:", error);
        router.push("/admin/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndLoad();
  }, [router]);

  const loadCustomers = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      const response = await fetch("/api/admin/customers", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "فشل تحميل العملاء");
      }

      const result = await response.json();
      const list = result.customers || [];
      setCustomers(list);

      if (list.length > 0) {
        setSelectedCustomerId((prev) => prev || list[0].id);
      }
    } catch (error) {
      console.error("Load customers error:", error);
      toast.error("حدث خطأ في تحميل العملاء");
    }
  };

  useEffect(() => {
    if (!selectedCustomerId) {
      setSelectedCustomer(null);
      setOrders([]);
      return;
    }

    const customer = customers.find((c) => c.id === selectedCustomerId) || null;
    setSelectedCustomer(customer);
    if (customer) {
      loadCustomerOrders(customer.id);
    }
  }, [selectedCustomerId, customers]);

  const loadCustomerOrders = async (customerId) => {
    try {
      setOrdersLoading(true);
      if (!customerId) {
        setOrders([]);
        return;
      }
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      const response = await fetch(
        `/api/admin/customers/${encodeURIComponent(customerId)}/orders`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          cache: "no-store",
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message =
          errorData.error ||
          `فشل تحميل الطلبات (status ${response.status})`;
        throw new Error(message);
      }

      const result = await response.json();
      setOrders(result.orders || []);
    } catch (error) {
      console.error("Load orders error:", error);
      toast.error(error.message || "حدث خطأ في تحميل طلبات العميل");
    } finally {
      setOrdersLoading(false);
    }
  };

  const filteredCustomers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return customers;
    return customers.filter((c) => {
      return (
        (c.name || "").toLowerCase().includes(term) ||
        (c.email || "").toLowerCase().includes(term) ||
        (c.phone || "").toLowerCase().includes(term)
      );
    });
  }, [customers, searchTerm]);

  const stats = useMemo(() => {
    const total = customers.length;
    const active = customers.filter((c) => c.is_active).length;
    const verified = customers.filter((c) => c.email_verified).length;
    const withPhone = customers.filter((c) => c.phone).length;
    return { total, active, verified, withPhone };
  }, [customers]);

  const formatDateTime = (value) => {
    if (!value) return "غير معروف";
    try {
      return new Date(value).toLocaleString("ar-EG", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return value;
    }
  };

  const getOrderTypeText = (order) => {
    const type =
      order.order_type || (order.customer_address ? "delivery" : "");
    const map = {
      delivery: "توصيل",
      pickup: "استلام من الفرع",
      reservation: "حجز طاولة",
    };
    return map[type] || "غير معروف";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black pt-16 flex items-center justify-center">
        <div className="text-[#C49A6C] text-xl">جارٍ التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-16">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">إدارة العملاء</h1>
            <p className="text-white/60">
              عرض جميع العملاء وطلبات كل عميل
            </p>
          </div>
          <Link
            href="/admin"
            className="text-[#C49A6C] hover:text-[#B08A5C] flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            العودة للوحة الإدارة
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">إجمالي العملاء</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">العملاء النشطون</p>
                <p className="text-2xl font-bold text-white">{stats.active}</p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Mail className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">بريد مؤكد</p>
                <p className="text-2xl font-bold text-white">
                  {stats.verified}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Phone className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">أرقام مسجلة</p>
                <p className="text-2xl font-bold text-white">
                  {stats.withPhone}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customers List */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
                <input
                  type="text"
                  placeholder="ابحث بالاسم أو البريد أو الهاتف"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 pr-12 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C] transition-colors"
                />
              </div>
            </div>

            <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 overflow-hidden">
              {filteredCustomers.length === 0 ? (
                <div className="p-6 text-center text-white/60">
                  لا يوجد عملاء
                </div>
              ) : (
                <div className="max-h-[560px] overflow-y-auto bazzom-scroll">
                  {filteredCustomers.map((customer) => (
                    <button
                      key={customer.id}
                      onClick={() => setSelectedCustomerId(customer.id)}
                      className={`w-full text-right p-4 border-b border-white/5 hover:bg-white/5 transition-colors ${
                        selectedCustomerId === customer.id
                          ? "bg-[#C49A6C]/10"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#C49A6C]/20 flex items-center justify-center">
                          <User className="w-5 h-5 text-[#C49A6C]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">
                            {customer.name || "بدون اسم"}
                          </p>
                          <p className="text-white/60 text-xs truncate">
                            {customer.email}
                          </p>
                          {customer.phone && (
                            <p className="text-white/50 text-xs truncate">
                              {customer.phone}
                            </p>
                          )}
                        </div>
                        {customer.is_active ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Customer Details */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-5">
              {!selectedCustomer ? (
                <div className="text-center text-white/60">
                  اختر عميل لعرض التفاصيل
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {selectedCustomer.name || "بدون اسم"}
                      </h2>
                      <p className="text-white/60 text-sm">
                        {selectedCustomer.email}
                      </p>
                      {selectedCustomer.phone && (
                        <p className="text-white/60 text-sm">
                          {selectedCustomer.phone}
                        </p>
                      )}
                    </div>
                    <div className="text-xs text-white/50">
                      <Calendar className="w-4 h-4 inline ml-1" />
                      {formatDateTime(selectedCustomer.created_at)}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        selectedCustomer.is_active
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {selectedCustomer.is_active ? "نشط" : "غير نشط"}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        selectedCustomer.email_verified
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-gray-500/20 text-gray-300"
                      }`}
                    >
                      {selectedCustomer.email_verified
                        ? "البريد مؤكد"
                        : "البريد غير مؤكد"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#C49A6C]" />
                  طلبات العميل
                </h3>
                {selectedCustomer && (
                  <span className="text-white/60 text-sm">
                    {orders.length} طلب
                  </span>
                )}
              </div>

              {ordersLoading ? (
                <div className="text-center text-white/60 py-6">
                  جارٍ تحميل الطلبات...
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center text-white/60 py-6">
                  لا توجد طلبات لهذا العميل
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="p-3 bg-black/30 rounded-lg border border-white/10"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">
                            #{order.id?.slice(0, 8)}
                          </p>
                          <p className="text-white/60 text-xs">
                            {formatDateTime(order.created_at)}
                          </p>
                        </div>
                        <div className="text-left">
                          <p className="text-[#C49A6C] font-semibold text-sm">
                            {order.total_amount} ج.م
                          </p>
                          <p className="text-white/60 text-xs">
                            {getOrderTypeText(order)}
                          </p>
                        </div>
                      </div>
                      {order.order_type === "reservation" &&
                        order.reservation_date &&
                        order.reservation_time && (
                          <div className="text-xs text-green-300 mt-2">
                            موعد الحجز: {order.reservation_date} -{" "}
                            {order.reservation_time}
                          </div>
                        )}
                      <div className="mt-2 text-xs text-white/60">
                        الحالة: {order.status || "غير معروف"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
