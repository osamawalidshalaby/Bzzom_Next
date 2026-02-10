import { supabase } from "./supabase";

/**
 * Realtime Service
 * Handles Supabase realtime subscriptions
 */
export const realtimeService = {
  // Setup realtime subscriptions for orders
  setupRealtimeSubscriptions: (onNewOrder, onOrderUpdate) => {
    const ordersChannel = supabase
      .channel("orders-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        (payload) => {
          console.log("Order change received:", payload);

          if (
            payload.eventType === "INSERT" &&
            payload.new.status === "pending"
          ) {
            if (onNewOrder) onNewOrder(payload.new);
          } else if (payload.eventType === "UPDATE") {
            if (onOrderUpdate) onOrderUpdate(payload.new);
          }
        },
      )
      .subscribe();

    return ordersChannel;
  },

  // Clean up subscription
  cleanupSubscriptions: (channel) => {
    if (channel) {
      supabase.removeChannel(channel);
    }
  },
};

export default realtimeService;
