import { supabase } from "./supabase";
import { authService } from "./auth.service";

/**
 * Statistics Service
 * Handles dashboard statistics and reporting
 */
export const statsService = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    try {
      const today = new Date().toISOString().split("T")[0];

      let stats = {
        totalOrders: 0,
        totalRevenue: 0,
        dailyRevenue: 0,
        menuItems: 0,
        categoriesCount: 0,
        activeUsers: 0,
        averageOrderValue: 0,
      };

      // Get total orders
      const { data: ordersData } = await supabase
        .from("orders")
        .select("id, total_amount, created_at, status");

      if (ordersData && ordersData.length > 0) {
        const completedOrders = ordersData.filter(
          (order) => order.status === "completed",
        );
        stats.totalOrders = ordersData.length;
        stats.totalRevenue = completedOrders.reduce(
          (sum, order) => sum + (order.total_amount || 0),
          0,
        );
        stats.averageOrderValue =
          completedOrders.length > 0
            ? stats.totalRevenue / completedOrders.length
            : 0;
        stats.dailyRevenue = completedOrders
          .filter((order) => order.created_at?.startsWith(today))
          .reduce((sum, order) => sum + (order.total_amount || 0), 0);
      }

      // Get menu items count
      const { data: menuItemsData } = await supabase
        .from("menu_items")
        .select("id");

      if (menuItemsData) {
        stats.menuItems = menuItemsData.length;
      }

      // Get categories count
      const { data: categoriesData } = await supabase
        .from("categories")
        .select("id");

      if (categoriesData) {
        stats.categoriesCount = categoriesData.length;
      }

      // Get active users count (admin only)
      const userRole = authService.getCurrentRole();
      if (userRole === "admin") {
        const { data: usersData } = await supabase
          .from("user_profiles")
          .select("id")
          .eq("is_active", true);

        if (usersData) {
          stats.activeUsers = usersData.length;
        }
      } else {
        stats.activeUsers = "N/A";
      }

      return stats;
    } catch (error) {
      console.error("Get dashboard stats error:", error);
      return {
        totalOrders: 0,
        totalRevenue: 0,
        dailyRevenue: 0,
        menuItems: 0,
        categoriesCount: 0,
        activeUsers: 0,
        averageOrderValue: 0,
      };
    }
  },

  // Get recent orders
  getRecentOrders: async (limit = 10) => {
    try {
      const userRole = authService.getCurrentRole();

      let query = supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      // Chief can only see pending/preparing orders
      if (userRole === "chief") {
        query = query.in("status", ["pending", "preparing"]);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data.map((order) => ({
        id: order.id,
        customer: order.customer_name || "عميل",
        total: `${order.total_amount || 0} ج.م`,
        status: order.status,
        date: order.created_at
          ? new Date(order.created_at).toLocaleDateString("ar-EG")
          : "N/A",
      }));
    } catch (error) {
      console.error("Get recent orders error:", error);
      return [];
    }
  },

  // Get sales statistics
  getSalesStats: async (period = "month") => {
    try {
      let startDate = new Date();

      // حساب تاريخ البداية حسب الفترة المختارة
      if (period === "today") {
        startDate.setHours(0, 0, 0, 0);
      } else if (period === "week") {
        // بداية الأسبوع الحالي (الأحد)
        const day = startDate.getDay();
        const diff = startDate.getDate() - day;
        startDate.setDate(diff);
        startDate.setHours(0, 0, 0, 0);
      } else if (period === "month") {
        // بداية الشهر الحالي
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
      } else if (period === "year") {
        // بداية السنة الحالية
        startDate.setMonth(0);
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
      }

      // فحص صحة startDate
      const startDateString = startDate.toISOString();
      console.log(
        `📊 جلب الإحصائيات للفترة: ${period}، من: ${startDateString}`,
      );

      // جلب الطلبات مع تطبيق الفلتر على startDate
      const { data, error } = await supabase
        .from("orders")
        .select("total_amount, created_at, status")
        .gte("created_at", startDateString);

      if (error) throw error;

      const stats = {
        revenue: 0,
        orderCount: 0,
        averageOrderValue: 0,
      };

      if (data && data.length > 0) {
        // فلترة الطلبات المكتملة فقط
        const completedOrders = data.filter(
          (order) => order.status === "completed",
        );

        stats.orderCount = completedOrders.length;
        stats.revenue = completedOrders.reduce(
          (sum, order) => sum + (order.total_amount || 0),
          0,
        );
        stats.averageOrderValue =
          stats.orderCount > 0
            ? Math.round(stats.revenue / stats.orderCount)
            : 0;

        console.log(`✅ إحصائيات ${period}:`, {
          طلبات_مكتملة: stats.orderCount,
          إجمالي_الإيرادات: stats.revenue,
          متوسط_الطلب: stats.averageOrderValue,
        });
      }

      return stats;
    } catch (error) {
      console.error("❌ خطأ في جلب الإحصائيات:", error);
      return {
        revenue: 0,
        orderCount: 0,
        averageOrderValue: 0,
      };
    }
  },
};

export default statsService;
