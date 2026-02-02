"use client";
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // دقيقة واحدة
      gcTime: 1000 * 60 * 5, // 5 دقائق
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const queryKeys = {
  orders: {
    all: ["orders"],
    list: (filters) => [...queryKeys.orders.all, "list", filters],
    detail: (id) => [...queryKeys.orders.all, "detail", id],
    stats: () => [...queryKeys.orders.all, "stats"],
    kitchen: () => [...queryKeys.orders.all, "kitchen"],
  },
  users: {
    all: ["users"],
    list: () => [...queryKeys.users.all, "list"],
  },
  menuItems: {
    all: ["menuItems"],
    list: () => [...queryKeys.menuItems.all, "list"],
  },
};

export const setupRealtime = (supabase, onNewOrder, onOrderUpdate) => {
  // الاشتراك في الطلبات الجديدة
  const ordersChannel = supabase
    .channel("orders-realtime")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "orders",
      },
      (payload) => {
        console.log("New order received:", payload);
        if (onNewOrder) onNewOrder(payload.new);

        // تشغيل صوت التنبيه
        if (typeof window !== "undefined") {
          const audio = new Audio("/sounds/notification.mp3");
          audio.volume = 0.3;
          audio.play().catch(console.error);
        }
      }
    )
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "orders",
      },
      (payload) => {
        console.log("Order updated:", payload);
        if (onOrderUpdate) onOrderUpdate(payload.new);

        // إلغاء صلاحية الاستعلامات
        queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(ordersChannel);
  };
};
