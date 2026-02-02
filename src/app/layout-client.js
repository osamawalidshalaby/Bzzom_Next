// app/layout-client.js (Client Component)
"use client";
import { useState, createContext, useContext, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import Navigation from "../app/_components/Navigation";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Tajawal } from "next/font/google";
import "./globals.css";

const tajawal = Tajawal({
  subsets: ["latin"],
  display: "swap",
  weight: ["200", "300", "400", "500", "700", "800"],
});

// إنشاء Context
const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

export default function ClientLayout({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60, // دقيقة واحدة
            gcTime: 1000 * 60 * 5, // 5 دقائق
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);

      // إذا كان العنصر له حجم محدد (مشويات)، لا ندمج مع العناصر الأخرى
      if (item.selectedSize) {
        // نتحقق إذا كان نفس العنصر بنفس الحجم موجود
        const existingItemWithSameSize = prevCart.find(
          (cartItem) =>
            cartItem.id === item.id &&
            cartItem.selectedSize === item.selectedSize
        );

        if (existingItemWithSameSize) {
          // نزيد الكمية فقط إذا كان نفس العنصر بنفس الحجم
          return prevCart.map((cartItem) =>
            cartItem.id === item.id &&
            cartItem.selectedSize === item.selectedSize
              ? {
                  ...cartItem,
                  quantity: cartItem.quantity + (item.quantity || 1),
                  calculatedPrice:
                    (cartItem.calculatedPrice ||
                      parseFloat(
                        cartItem.price.toString().replace(/[^0-9.]/g, "")
                      )) +
                    (item.calculatedPrice ||
                      parseFloat(
                        item.price.toString().replace(/[^0-9.]/g, "")
                      ) * (item.quantity || 1)),
                }
              : cartItem
          );
        } else {
          // إضافة عنصر جديد بحجم مختلف
          return [
            ...prevCart,
            {
              ...item,
              quantity: item.quantity || 1,
              calculatedPrice:
                item.calculatedPrice ||
                parseFloat(item.price.toString().replace(/[^0-9.]/g, "")) *
                  (item.quantity || 1),
            },
          ];
        }
      } else {
        // العناصر العادية (بدون أحجام)
        if (existingItem) {
          return prevCart.map((cartItem) =>
            cartItem.id === item.id
              ? {
                  ...cartItem,
                  quantity: cartItem.quantity + (item.quantity || 1),
                  calculatedPrice: cartItem.calculatedPrice
                    ? cartItem.calculatedPrice +
                      (item.calculatedPrice ||
                        parseFloat(
                          item.price.toString().replace(/[^0-9.]/g, "")
                        ) * (item.quantity || 1))
                    : null,
                }
              : cartItem
          );
        } else {
          return [
            ...prevCart,
            {
              ...item,
              quantity: item.quantity || 1,
              calculatedPrice: item.calculatedPrice || null,
            },
          ];
        }
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(itemId);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const price = parseInt(item.price.replace(/[^0-9]/g, ""));
      return total + price * item.quantity;
    }, 0);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    setCart,
  };

  return (
    <html lang="ar" dir="rtl">
      <body className={tajawal.className}>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <AppContext.Provider value={value}>
            <div className="font-['Tajawal'] bg-black min-h-screen">
              <Navigation />
              <AnimatePresence mode="wait">{children}</AnimatePresence>
            </div>
          </AppContext.Provider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
