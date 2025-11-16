// app/layout-client.js (Client Component)
"use client";
import { useState, createContext, useContext } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import Navigation from "../app/_components/Navigation";
import "./globals.css";

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
            staleTime: 60 * 1000, // 1 دقيقة
            refetchOnWindowFocus: false,
          },
        },
      })
  );
  const [cart, setCart] = useState([]);
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: "عمر الشمري",
      rating: 5,
      message: "تجربة رائعة وطعام لذيذ جداً",
    },
    {
      id: 2,
      name: "Sara Ahmed",
      rating: 5,
      message: "Best Arabic restaurant in town!",
    },
  ]);

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
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
    reviews,
    setReviews,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    setCart,
  };

  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="theme-color" content="#e63946" />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <AppContext.Provider value={value}>
            <div className="font-['Tajawal'] bg-black min-h-screen">
              <Navigation />
              <AnimatePresence mode="wait">{children}</AnimatePresence>
            </div>
          </AppContext.Provider>
        </QueryClientProvider>
      </body>
      {typeof window !== "undefined" && (
        <script>
          {`
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/sw.js");
      }
    `}
        </script>
      )}
    </html>
  );
}
