"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi } from "../_services/adminApi";
import toast from "react-hot-toast";

export default function AdminLayout({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = await adminApi.auth.checkAuth();

        if (!isAuth) {
          router.push("/admin/login");
          return;
        }

        const userRole = adminApi.auth.getCurrentRole();
        if (!userRole) {
          toast.error("لم يتم العثور على صلاحيات المستخدم");
          router.push("/admin/login");
          return;
        }

        // توجيه المستخدم بناءً على صلاحياته
        const currentPath = window.location.pathname;

        if (userRole === "chief" && currentPath !== "/kitchen") {
          router.push("/kitchen");
        } else if (
          userRole === "cashier" &&
          !currentPath.startsWith("/orders")
        ) {
          router.push("/orders");
        } else if (userRole === "admin" && !currentPath.startsWith("/admin")) {
          router.push("/admin");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        router.push("/admin/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-[#C49A6C] text-xl">
          جارٍ التحقق من الصلاحيات...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
