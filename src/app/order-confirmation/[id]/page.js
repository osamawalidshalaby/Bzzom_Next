"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  CheckCircle,
  Clock,
  ChefHat,
  ShoppingBag,
  User,
  Phone,
  MapPin,
  CreditCard,
  Printer,
  Share2,
  Home,
  ArrowLeft,
  Utensils,
  Package,
  Truck,
  XCircle,
  AlertCircle,
  CircleDollarSign,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { supabase } from "../../_services/supabase";
import { customerApi } from "../../_services/customerApi";
import { realtimeService } from "../../_services/realtime.service";

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [paymentPolling, setPaymentPolling] = useState(null);
  const [ordersChannel, setOrdersChannel] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!id) {
          setError("معرف الطلب غير موجود");
          return;
        }

        console.log("جاري جلب الطلب:", id);

        // الحصول على الطلب من قاعدة البيانات
        const { data: orderData, error: orderError } = await supabase
          .from("orders")
          .select("*")
          .eq("id", id)
          .single();

        if (orderError) {
          console.error("خطأ في جلب الطلب:", orderError);
          setError("لم يتم العثور على الطلب");
          return;
        }

        setOrder(orderData);

        // إذا كان الدفع عبر Paymob، تتبع حالة الدفع
        if (orderData?.payment_method === "paymob") {
          setPaymentStatus(orderData.payment_status || "pending");

          // إذا كان الدفع معلقاً، ابدأ في تتبع الحالة
          if (orderData.payment_status === "pending") {
            startPaymentPolling(id);
          }
        }
      } catch (error) {
        console.error("خطأ في جلب الطلب:", error);
        setError(error.message || "حدث خطأ في تحميل بيانات الطلب");
        toast.error("فشل في تحميل بيانات الطلب");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();

    // تنظيف التتبع عند مغادرة الصفحة
    return () => {
      if (paymentPolling) {
        clearInterval(paymentPolling);
      }
    };
  }, [id]);

  // تنظيف قناة realtime
  useEffect(() => {
    return () => {
      if (ordersChannel) {
        supabase.removeChannel(ordersChannel);
      }
    };
  }, []);

  // إعداد الاشتراك في تحديثات الطلب الفورية
  useEffect(() => {
    if (!id) return;

    console.log("📡 إعداد الاشتراك في تحديثات الطلب الفورية:", id);

    // الاستماع للتحديثات على هذا الطلب المحدد
    const channel = supabase
      .channel(`order-${id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${id}`,
        },
        (payload) => {
          console.log("🔄 تحديث الطلب المستقبل:", payload);
          const updatedOrder = payload.new;
          setOrder(updatedOrder);

          // تحديث حالة الدفع إذا تغيرت
          if (updatedOrder.payment_status) {
            setPaymentStatus(updatedOrder.payment_status);
          }
        },
      )
      .subscribe();

    setOrdersChannel(channel);

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  // تتبع حالة الدفع لطلبات Paymob
  const startPaymentPolling = (orderId) => {
    const interval = setInterval(async () => {
      try {
        const { data: updatedOrder, error: fetchError } = await supabase
          .from("orders")
          .select("payment_status, paymob_order_id, payment_provider")
          .eq("id", orderId)
          .single();

        if (!fetchError && updatedOrder) {
          const newStatus = updatedOrder.payment_status;

          if (newStatus !== paymentStatus) {
            setPaymentStatus(newStatus);

            if (newStatus === "paid") {
              toast.success("✅ تم تأكيد الدفع بنجاح!");
            } else if (newStatus === "failed") {
              toast.error("❌ فشل عملية الدفع");
            }
          }

          // إذا كانت الحالة نهائية، توقف عن التتبع
          if (["paid", "failed", "cancelled"].includes(newStatus)) {
            clearInterval(interval);
            setPaymentPolling(null);
          }
        }
      } catch (error) {
        console.error("خطأ في تتبع حالة الدفع:", error);
      }
    }, 5000); // التحقق كل 5 ثواني

    setPaymentPolling(interval);

    // إيقاف التتبع تلقائياً بعد 10 دقائق
    setTimeout(() => {
      if (interval) {
        clearInterval(interval);
        setPaymentPolling(null);
      }
    }, 600000);
  };

  // التحقق اليدوي من حالة الدفع
  const checkPaymentStatus = async () => {
    if (!order || order.payment_method !== "paymob") return;

    setIsCheckingPayment(true);
    try {
      const { data: updatedOrder, error: fetchError } = await supabase
        .from("orders")
        .select(
          "payment_status, paymob_order_id, payment_provider, payment_metadata",
        )
        .eq("id", id)
        .single();

      if (!fetchError && updatedOrder) {
        setPaymentStatus(updatedOrder.payment_status);

        if (updatedOrder.payment_status === "paid") {
          toast.success("✅ تم تأكيد الدفع بنجاح!");
        } else if (updatedOrder.payment_status === "failed") {
          toast.error("❌ فشل عملية الدفع");
        } else {
          toast.info("⏳ مازال الدفع قيد المعالجة");
        }
      }
    } catch (error) {
      console.error("خطأ في التحقق من حالة الدفع:", error);
      toast.error("حدث خطأ في التحقق من حالة الدفع");
    } finally {
      setIsCheckingPayment(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        text: "قيد الانتظار",
        color: "text-yellow-400",
        bgColor: "bg-yellow-500/20",
        borderColor: "border-yellow-500/30",
        icon: Clock,
        description: "تم استلام طلبك وجاري مراجعته",
      },
      preparing: {
        text: "قيد التجهيز",
        color: "text-blue-400",
        bgColor: "bg-blue-500/20",
        borderColor: "border-blue-500/30",
        icon: ChefHat,
        description: "جاري تحضير طلبك في المطبخ",
      },
      ready: {
        text: "جاهز للتسليم",
        color: "text-green-400",
        bgColor: "bg-green-500/20",
        borderColor: "border-green-500/30",
        icon: ShoppingBag,
        description: "طلبك جاهز للتسليم",
      },
      completed: {
        text: "مكتمل",
        color: "text-green-400",
        bgColor: "bg-green-500/20",
        borderColor: "border-green-500/30",
        icon: CheckCircle,
        description: "تم تسليم طلبك بنجاح",
      },
      cancelled: {
        text: "ملغي",
        color: "text-red-400",
        bgColor: "bg-red-500/20",
        borderColor: "border-red-500/30",
        icon: XCircle,
        description: "تم إلغاء الطلب",
      },
    };

    return (
      configs[status] || {
        text: "غير معروف",
        color: "text-gray-400",
        bgColor: "bg-gray-500/20",
        borderColor: "border-gray-500/30",
        icon: Clock,
        description: "حالة غير معروفة",
      }
    );
  };

  const getPaymentStatusConfig = (status) => {
    const configs = {
      pending: {
        text: "⏳ في انتظار الدفع",
        color: "text-yellow-400",
        bgColor: "bg-yellow-500/20",
        borderColor: "border-yellow-500/30",
        icon: Clock,
      },
      paid: {
        text: "✅ تم الدفع بنجاح",
        color: "text-green-400",
        bgColor: "bg-green-500/20",
        borderColor: "border-green-500/30",
        icon: CheckCircle,
      },
      failed: {
        text: "❌ فشل الدفع",
        color: "text-red-400",
        bgColor: "bg-red-500/20",
        borderColor: "border-red-500/30",
        icon: XCircle,
      },
      cancelled: {
        text: "🚫 ملغي",
        color: "text-red-400",
        bgColor: "bg-red-500/20",
        borderColor: "border-red-500/30",
        icon: XCircle,
      },
      refunded: {
        text: "↩️ تم الاسترجاع",
        color: "text-blue-400",
        bgColor: "bg-blue-500/20",
        borderColor: "border-blue-500/30",
        icon: CircleDollarSign,
      },
    };

    return (
      configs[status] || {
        text: "غير معروف",
        color: "text-gray-400",
        bgColor: "bg-gray-500/20",
        borderColor: "border-gray-500/30",
        icon: AlertCircle,
      }
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "غير معروف";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("ar-EG", {
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

  const formatTime = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString("ar-EG", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  const formatDateOnly = (dateString) => {
    if (!dateString) return "ØºÙŠØ± Ù…Ø¹Ø±ÙˆÙ";
    try {
      const date = new Date(`${dateString}T00:00:00`);
      return date.toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const formatTimeOnly = (timeString) => {
    if (!timeString) return "غير معروف";
    try {
      const date = new Date(`1970-01-01T${timeString}`);
      return date.toLocaleTimeString("ar-EG", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return timeString;
    }
  };

  const getOrderTypeText = (type) => {
    const types = {
      delivery: "توصيل للعنوان",
      pickup: "استلام من الفرع",
      reservation: "حجز طاولة",
    };
    return types[type] || "غير معروف";
  };

  const resolveOrderType = (currentOrder) => {
    if (!currentOrder) return "";
    if (currentOrder.order_type) return currentOrder.order_type;
    if (currentOrder.customer_address) return "delivery";
    return "";
  };

  const getPaymentMethodText = (method) => {
    const methods = {
      cash: "💵 نقدي عند الاستلام",
      card: "💳 بطاقة ائتمان",
      paymob: "💳 Paymob - بطاقة ائتمان",
      "paymob-card": "💳 Paymob - بطاقة ائتمان",
    };
    return methods[method] || method || "نقدي";
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const url = window.location.href;
    const orderNumber = order?.id?.slice(0, 8) || "غير معروف";
    const text = `متابعة طلبي #${orderNumber} من مطعم بزوم`;

    if (navigator.share) {
      navigator
        .share({
          title: "طلب بزوم",
          text: text,
          url: url,
        })
        .catch(console.error);
    } else {
      navigator.clipboard.writeText(url);
      toast.success("تم نسخ رابط الطلب إلى الحافظة");
    }
  };

  const calculateTotalItems = () => {
    if (!order?.items || !Array.isArray(order.items)) return 0;
    return order.items.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#C49A6C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#C49A6C] text-xl">جاري تحميل تفاصيل الطلب...</p>
          <p className="text-white/60 text-sm mt-2">#{id?.slice(0, 8)}</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-black pt-20 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            لم يتم العثور على الطلب
          </h2>
          <p className="text-white/60 mb-6">
            {error ||
              "تعذر العثور على الطلب المطلوب. قد يكون الرابط غير صحيح أو تم حذف الطلب."}
          </p>
          <p className="text-white/40 text-sm mb-6">
            رقم الطلب: #{id?.slice(0, 8) || "غير معروف"}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="bg-[#C49A6C] hover:bg-[#B08A5C] text-black px-6 py-3 rounded-lg font-semibold transition-all"
            >
              <Home className="w-4 h-4 inline mr-2" />
              العودة للرئيسية
            </Link>
            <Link
              href="/cart"
              className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              <ShoppingBag className="w-4 h-4 inline mr-2" />
              عودة للسلة
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;
  const paymentStatusConfig = getPaymentStatusConfig(
    paymentStatus || order.payment_status,
  );
  const PaymentStatusIcon = paymentStatusConfig.icon;

  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-12 px-4">
      <Toaster position="top-center" />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-[#C49A6C] hover:text-[#B08A5C] transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>العودة</span>
          </Link>
          <h1 className="text-3xl font-bold text-[#C49A6C] text-center">
            تفاصيل الطلب
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="p-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
              title="طباعة"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button
              onClick={handleShare}
              className="p-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
              title="مشاركة"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Order Status Card */}
        <div
          className={`${statusConfig.bgColor} border ${statusConfig.borderColor} rounded-2xl p-6 mb-6`}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-full ${statusConfig.color} bg-black/20`}
              >
                <StatusIcon className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  الطلب #{order.id?.slice(0, 8) || "غير معروف"}
                </h2>
                <p className={`${statusConfig.color} font-medium`}>
                  {statusConfig.text}
                </p>
                <p className="text-white/70 text-sm mt-1">
                  {statusConfig.description}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-sm">وقت الاستلام</p>
              <p className="text-white font-bold">
                {formatDate(order.created_at)}
              </p>
              {order.started_preparing_at && (
                <p className="text-white/60 text-sm mt-1">
                  بدء التجهيز: {formatTime(order.started_preparing_at)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Payment Status (للدفع الإلكتروني) */}
        {order.payment_method === "paymob" && (
          <div
            className={`${paymentStatusConfig.bgColor} border ${paymentStatusConfig.borderColor} rounded-2xl p-6 mb-6`}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-full ${paymentStatusConfig.color} bg-black/20`}
                >
                  <PaymentStatusIcon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">حالة الدفع</h3>
                  <p
                    className={`${paymentStatusConfig.color} font-medium text-lg`}
                  >
                    {paymentStatusConfig.text}
                  </p>
                  <p className="text-white/70 text-sm mt-1">
                    {order.payment_method === "paymob"
                      ? "Paymob - بطاقة ائتمان"
                      : "طريقة دفع إلكترونية"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-3">
                {order.payment_method === "paymob" && order.paymob_order_id && (
                  <p className="text-white/60 text-sm">
                    معرّف Paymob: {order.paymob_order_id}
                  </p>
                )}

                {paymentStatus === "pending" && (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-white/80 text-sm">
                      جاري تتبع حالة الدفع...
                    </span>
                  </div>
                )}

                <button
                  onClick={checkPaymentStatus}
                  disabled={isCheckingPayment}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isCheckingPayment ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      جاري التحقق...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      تحديث حالة الدفع
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* معلومات إضافية للدفع المعلق */}
            {paymentStatus === "pending" && (
              <div className="mt-4 p-4 bg-black/30 rounded-lg border border-dashed border-white/20">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-yellow-300 font-medium mb-1">
                      💡 معلومات هامة
                    </p>
                    <ul className="text-white/80 text-sm space-y-1">
                      <li>• يتم تتبع حالة الدفع تلقائياً كل 5 ثواني</li>
                      <li>• قد يستغرق تأكيد الدفع حتى 10 دقائق</li>
                      <li>• سيتم تحديث حالة الطلب تلقائياً عند اكتمال الدفع</li>
                      <li>
                        • يمكنك استخدام زر &quot;تحديث حالة الدفع&quot; للتحقق
                        يدوياً
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Customer Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <User className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">العميل</p>
                <p className="text-white font-bold">
                  {order.customer_name || "غير معروف"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Phone className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">رقم الهاتف</p>
                <p className="text-white font-bold">
                  {order.customer_phone || "غير معروف"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <CreditCard className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">طريقة الدفع</p>
                <p className="text-white font-bold">
                  {getPaymentMethodText(order.payment_method)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {resolveOrderType(order) && (
          <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-indigo-500/20 rounded-lg mt-1">
                <Truck className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="flex-1">
                <p className="text-white/60 text-sm mb-1">نوع الطلب</p>
                <p className="text-white font-bold">
                  {getOrderTypeText(resolveOrderType(order))}
                </p>
                {resolveOrderType(order) === "reservation" && (
                  <div className="mt-2 text-white/70 text-sm space-y-1">
                    <div>عدد الأفراد: {order.reservation_people || "—"}</div>
                    <div>
                      اليوم:{" "}
                      {order.reservation_date
                        ? formatDateOnly(order.reservation_date)
                        : "—"}
                    </div>
                    <div>
                      الساعة:{" "}
                      {order.reservation_time
                        ? formatTimeOnly(order.reservation_time)
                        : "—"}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Address Section */}
        {order.customer_address && (
          <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg mt-1">
                <MapPin className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="flex-1">
                <p className="text-white/60 text-sm mb-1">📍 العنوان</p>
                <p className="text-white">{order.customer_address}</p>
              </div>
            </div>
          </div>
        )}

        {/* Order Items */}
        <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-[#C49A6C]" />
              العناصر المطلوبة
            </h3>
            <div className="px-3 py-1 bg-[#C49A6C]/20 text-[#C49A6C] rounded-full text-sm">
              {calculateTotalItems()} عنصر
            </div>
          </div>

          <div className="space-y-3">
            {Array.isArray(order.items) && order.items.length > 0 ? (
              order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-black/30 p-4 rounded-lg border border-white/5"
                >
                  <div className="flex-1">
                    <p className="font-bold text-white mb-1">
                      {item.name || "عنصر غير معروف"}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-white/60">
                      <span>الكمية: {item.quantity || 1}</span>
                      {item.selectedSize && (
                        <span>الحجم: {item.selectedSize}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[#C49A6C] font-bold text-lg">
                      {item.price || 0} ج.م
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-white/40 text-xs">
                        {item.price * item.quantity} ج.م (الإجمالي)
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Utensils className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <p className="text-white/60">لا توجد عناصر في هذا الطلب</p>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="border-t border-white/20 pt-6 mt-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/70">عدد العناصر</span>
                <span className="text-white">{calculateTotalItems()}</span>
              </div>
              {order.notes && (
                <div className="flex justify-between items-start">
                  <span className="text-white/70">ملاحظات إضافية</span>
                  <span className="text-white text-right max-w-xs">
                    {order.notes}
                  </span>
                </div>
              )}
              <div className="border-t border-white/20 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-white">
                    المجموع الكلي
                  </span>
                  <span className="text-2xl font-bold text-[#C49A6C]">
                    {order.total_amount || 0} ج.م
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Timeline */}
        <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-6 mb-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#C49A6C]" />
            مراحل الطلب
          </h3>

          <div className="space-y-8">
            {/* Stage 1: Order Received */}
            <div className="flex items-start gap-4 relative">
              <div className="flex-shrink-0 relative">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    order.status ? "bg-green-500" : "bg-gray-600"
                  }`}
                >
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-0.5 h-8 bg-gray-600"></div>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white mb-1">استلام الطلب</h4>
                <p className="text-white/60">تم استلام طلبك بنجاح في نظامنا</p>
                <p className="text-white/40 text-sm mt-1">
                  {formatDate(order.created_at)}
                </p>
              </div>
            </div>

            {/* Stage 2: Payment (لـ Paymob فقط) */}
            {order.payment_method === "paymob" && (
              <div className="flex items-start gap-4 relative">
                <div className="flex-shrink-0 relative">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      paymentStatus === "paid"
                        ? "bg-green-500"
                        : paymentStatus === "failed"
                          ? "bg-red-500"
                          : paymentStatus === "pending"
                            ? "bg-yellow-500"
                            : "bg-gray-600"
                    }`}
                  >
                    <CircleDollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-0.5 h-8 bg-gray-600"></div>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white mb-1">الدفع</h4>
                  <p className="text-white/60">
                    {paymentStatus === "paid"
                      ? "تم الدفع بنجاح عبر Paymob"
                      : paymentStatus === "pending"
                        ? "في انتظار تأكيد الدفع عبر Paymob"
                        : paymentStatus === "failed"
                          ? "فشل عملية الدفع عبر Paymob"
                          : "حالة الدفع غير معروفة"}
                  </p>
                  {order.paymob_order_id && (
                    <p className="text-white/40 text-sm mt-1">
                      رقم العملية: {order.paymob_order_id}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Stage 3: Preparing */}
            <div className="flex items-start gap-4 relative">
              <div className="flex-shrink-0 relative">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    ["preparing", "ready", "completed"].includes(order.status)
                      ? "bg-green-500"
                      : order.status === "pending"
                        ? "bg-yellow-500"
                        : order.status === "cancelled"
                          ? "bg-red-500"
                          : "bg-gray-600"
                  }`}
                >
                  <ChefHat className="w-6 h-6 text-white" />
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-0.5 h-8 bg-gray-600"></div>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white mb-1">التجهيز</h4>
                <p className="text-white/60">
                  {order.status === "pending"
                    ? "في انتظار البدء في التجهيز"
                    : order.status === "preparing"
                      ? "جاري تجهيز طلبك حالياً"
                      : order.status === "ready" || order.status === "completed"
                        ? "تم تجهيز طلبك بنجاح"
                        : order.status === "cancelled"
                          ? "تم إلغاء التجهيز"
                          : "قيد الانتظار"}
                </p>
                {order.started_preparing_at && (
                  <p className="text-white/40 text-sm mt-1">
                    بدء التجهيز: {formatTime(order.started_preparing_at)}
                  </p>
                )}
                {order.completed_preparing_at && (
                  <p className="text-white/40 text-sm mt-1">
                    انتهاء التجهيز: {formatTime(order.completed_preparing_at)}
                  </p>
                )}
              </div>
            </div>

            {/* Stage 4: Ready/Delivery */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    ["ready", "completed"].includes(order.status)
                      ? "bg-green-500"
                      : order.status === "cancelled"
                        ? "bg-red-500"
                        : "bg-gray-600"
                  }`}
                >
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white mb-1">جاهز للتسليم</h4>
                <p className="text-white/60">
                  {order.status === "ready"
                    ? "طلبك جاهز للتسليم - يمكنك التواصل مع المطعم"
                    : order.status === "completed"
                      ? "تم تسليم طلبك بنجاح - شكراً لاختياركم بزوم"
                      : order.status === "cancelled"
                        ? "تم إلغاء الطلب"
                        : "في انتظار انتهاء التجهيز"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Chef Notes */}
        {order.chef_notes && (
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <ChefHat className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-yellow-300 font-medium mb-1">
                  👨‍🍳 ملاحظات خاصة من الشيف
                </p>
                <p className="text-yellow-200/80">{order.chef_notes}</p>
              </div>
            </div>
          </div>
        )}

        {/* Contact Info */}
        <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-6 mb-6">
          <h3 className="text-xl font-bold text-white mb-4">للتواصل معنا</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black/30 rounded-lg p-4">
              <p className="text-white/60 text-sm mb-1">📞 رقم الهاتف</p>
              <p className="text-white font-bold">01007576444</p>
            </div>
            <div className="bg-black/30 rounded-lg p-4">
              <p className="text-white/60 text-sm mb-1">🕒 أوقات العمل</p>
              <p className="text-white font-bold">
                يومياً من 10:00 صباحاً إلى 2:00 ليلاً
              </p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <p className="text-blue-300 text-sm">
              💡 <strong>ملاحظة:</strong> يمكنك استخدام رقم الطلب أعلاه
              للاستفسار عن حالة طلبك
            </p>
            {order.payment_method === "paymob" && order.paymob_order_id && (
              <p className="text-purple-300 text-sm mt-1">
                💳 <strong>لمساعدات الدفع:</strong> رقم عملية Paymob:{" "}
                {order.paymob_order_id}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/"
            className="flex-1 bg-[#C49A6C] hover:bg-[#B08A5C] text-black font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            العودة للرئيسية
          </Link>
          <button
            onClick={handlePrint}
            className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Printer className="w-5 h-5" />
            طباعة الطلب
          </button>
          <Link
            href="/cart"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            طلب جديد
          </Link>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-white/60 text-sm">
            شكراً لاختياركم مطعم بزوم - نتمنى لكم وجبة شهية! 🍽️
          </p>
          <p className="text-white/40 text-xs mt-2">
            رقم الطلب: #{order.id || "غير معروف"} | آخر تحديث:{" "}
            {formatDate(order.updated_at || order.created_at)}
          </p>
        </div>
      </div>
    </div>
  );
}