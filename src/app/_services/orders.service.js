import { supabase } from "./supabase";
import { authService } from "./auth.service";

/**
 * Orders Service
 * Handles all order-related operations
 */
export const ordersService = {
  // Get orders with filtering
  getOrders: async (filters = {}) => {
    try {
      const userRole = authService.getCurrentRole();
      console.log(`📋 جلب الطلبات للمستخدم بدور: ${userRole}`);

      let query = supabase.from("orders").select("*");

      // Apply filters based on role
      if (userRole === "chief") {
        query = query.in("status", ["pending", "preparing"]);
        console.log("👨‍🍳 الشيف: عرض طلبات المطبخ فقط");
      }

      if (filters.status && filters.status !== "all") {
        query = query.eq("status", filters.status);
        console.log(`🔍 تصفية بالحالة: ${filters.status}`);
      }

      if (filters.search) {
        query = query.or(
          `customer_name.ilike.%${filters.search}%,customer_phone.ilike.%${filters.search}%,id.ilike.%${filters.search}%`,
        );
        console.log(`🔍 بحث عن: ${filters.search}`);
      }

      query = query.order("created_at", { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error("❌ خطأ في جلب الطلبات:", error);
        throw error;
      }

      console.log(`✅ تم جلب ${data?.length || 0} طلب`);
      return data || [];
    } catch (error) {
      console.error("Get orders error:", error);
      throw error;
    }
  },

  // Get single order by ID
  getOrderById: async (id) => {
    try {
      console.log(`🔍 جلب الطلب: ${id}`);

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("❌ خطأ في جلب الطلب:", error);
        throw error;
      }

      console.log(`✅ تم جلب الطلب: ${id}`);
      return data;
    } catch (error) {
      console.error("Get order by id error:", error);
      throw error;
    }
  },

  // Create new order
  createOrder: async (orderData) => {
    try {
      const cashierId = localStorage.getItem("userId");
      const cashierRole = localStorage.getItem("userRole");

      console.log("🛒 إنشاء طلب جديد:", {
        cashierId,
        cashierRole,
        customer: orderData.customer_name,
      });

      const orderToInsert = {
        customer_name: orderData.customer_name,
        customer_phone: orderData.customer_phone,
        customer_address: orderData.customer_address,
        order_type: orderData.order_type,
        reservation_people: orderData.reservation_people,
        reservation_date: orderData.reservation_date,
        reservation_time: orderData.reservation_time,
        notes: orderData.notes,
        items: orderData.items,
        total_amount: orderData.total_amount,
        status: "pending",
        payment_method: orderData.payment_method,
        chef_notes: orderData.chef_notes,
        location: orderData.location,
        cashier_id: cashierId,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("orders")
        .insert([orderToInsert])
        .select()
        .single();

      if (error) {
        console.error("❌ خطأ في إنشاء الطلب:", error);
        throw error;
      }

      console.log(`✅ تم إنشاء الطلب بنجاح: ${data.id}`);

      // Try to send notification to chef
      try {
        await supabase.from("notifications").insert([
          {
            type: "new_order",
            title: "طلب جديد",
            message: `طلب جديد من ${orderData.customer_name}`,
            data: { order_id: data.id },
            created_at: new Date().toISOString(),
          },
        ]);
        console.log("📢 تم إرسال إشعار للشيف");
      } catch (notifError) {
        console.warn("⚠️ لا يمكن إنشاء الإشعار:", notifError);
      }

      return data;
    } catch (error) {
      console.error("Create order error:", error);
      throw error;
    }
  },

  // Update order status
  updateOrderStatus: async (orderId, newStatus) => {
    try {
      const userRole = authService.getCurrentRole();
      console.log(
        `🔄 تحديث حالة الطلب ${orderId.slice(
          0,
          8,
        )} إلى ${newStatus} بواسطة ${userRole}`,
      );

      const updates = {
        status: newStatus,
        updated_at: new Date().toISOString(),
      };

      if (newStatus === "preparing") {
        updates.started_preparing_at = new Date().toISOString();
      } else if (newStatus === "ready") {
        updates.completed_preparing_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from("orders")
        .update(updates)
        .eq("id", orderId)
        .select()
        .single();

      if (error) {
        console.error("❌ خطأ في تحديث حالة الطلب:", error);
        throw error;
      }

      console.log(`✅ تم تحديث حالة الطلب إلى ${newStatus}`);

      // Send notification to cashier when order is ready
      if (newStatus === "ready") {
        try {
          await supabase.from("notifications").insert([
            {
              type: "order_ready",
              title: "طلب جاهز",
              message: `الطلب #${orderId.slice(0, 8)} جاهز للتسليم`,
              data: { order_id: orderId },
              created_at: new Date().toISOString(),
            },
          ]);
          console.log("📢 تم إرسال إشعار للكاشير");
        } catch (notifError) {
          console.warn("⚠️ لا يمكن إنشاء الإشعار:", notifError);
        }
      }

      return data;
    } catch (error) {
      console.error("Update order status error:", error);
      throw error;
    }
  },

  // Get kitchen orders (pending and preparing)
  getKitchenOrders: async () => {
    try {
      console.log("👨‍🍳 جلب طلبات المطبخ...");

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .in("status", ["pending", "preparing"])
        .order("created_at", { ascending: true });

      if (error) {
        console.error("❌ خطأ في جلب طلبات المطبخ:", error);
        throw error;
      }

      console.log(`✅ تم جلب ${data?.length || 0} طلب للمطبخ`);
      return data || [];
    } catch (error) {
      console.error("Get kitchen orders error:", error);
      throw error;
    }
  },

  // Get order statistics
  getOrderStats: async (period = "today") => {
    try {
      console.log(`📊 جلب إحصائيات الطلبات للفترة: ${period}`);

      let startDate = new Date();
      if (period === "today") {
        startDate.setHours(0, 0, 0, 0);
      } else if (period === "week") {
        startDate.setDate(startDate.getDate() - 7);
      } else if (period === "month") {
        startDate.setMonth(startDate.getMonth() - 1);
      }

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .gte("created_at", startDate.toISOString());

      if (error) {
        console.error("❌ خطأ في جلب الإحصائيات:", error);
        throw error;
      }

      const orders = data || [];

      const stats = {
        total: orders.length,
        pending: orders.filter((o) => o.status === "pending").length,
        preparing: orders.filter((o) => o.status === "preparing").length,
        ready: orders.filter((o) => o.status === "ready").length,
        completed: orders.filter((o) => o.status === "completed").length,
        cancelled: orders.filter((o) => o.status === "cancelled").length,
        totalRevenue: orders
          .filter((o) => o.status === "completed")
          .reduce((sum, order) => sum + (order.total_amount || 0), 0),
      };

      console.log("📈 الإحصائيات:", stats);

      return stats;
    } catch (error) {
      console.error("Get order stats error:", error);
      throw error;
    }
  },

  // Delete order
  deleteOrder: async (orderId) => {
    try {
      const userRole = authService.getCurrentRole();
      console.log(`🗑️ حذف الطلب ${orderId.slice(0, 8)} بواسطة ${userRole}`);

      const { error } = await supabase
        .from("orders")
        .delete()
        .eq("id", orderId);

      if (error) {
        console.error("❌ خطأ في حذف الطلب:", error);
        throw error;
      }

      console.log("✅ تم حذف الطلب بنجاح");
      return true;
    } catch (error) {
      console.error("Delete order error:", error);
      throw error;
    }
  },
};

export default ordersService;
