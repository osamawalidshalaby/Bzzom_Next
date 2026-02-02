// // ملف: app/middleware.js
// import { NextResponse } from "next/server";

// export async function middleware(request) {
//   const { pathname } = request.nextUrl;

//   // تحميل الكوكيز
//   const adminAuth = request.cookies.get("adminAuthenticated")?.value;
//   const userRole = request.cookies.get("userRole")?.value;
//   const customerAuth = request.cookies.get("customerAuthenticated")?.value;

//   // تحديد إذا كان المستخدم موظفاً
//   const isEmployee =
//     adminAuth && ["admin", "cashier", "chief"].includes(userRole);
//   const isCustomer = customerAuth === "true";

//   // صفحات الإدارة (للموظفين فقط)
//   const adminPaths = [
//     "/admin",
//     "/admin/",
//     "/admin/home",
//     "/admin/menu",
//     "/admin/users",
//     "/admin/stats",
//     "/admin/settings",
//   ];
//   const isAdminPath = adminPaths.some((path) => pathname.startsWith(path));

//   // صفحات المطبخ (للموظفين فقط)
//   const kitchenPaths = ["/kitchen"];
//   const isKitchenPath = kitchenPaths.some((path) => pathname.startsWith(path));

//   // صفحات الطلبات (للكاشير والمدير فقط)
//   const orderPaths = ["/orders", "/orders/new"];
//   const isOrderPath = orderPaths.some((path) => pathname.startsWith(path));

//   // صفحات العميل (للعملاء فقط، ليس للموظفين)
//   const customerPaths = ["/profile", "/auth/signin", "/auth/callback"];
//   const isCustomerPath = customerPaths.some((path) =>
//     pathname.startsWith(path)
//   );

//   // إذا كان يحاول الوصول لصفحات الإدارة وهو ليس موظفاً
//   if (isAdminPath && !isEmployee) {
//     const loginUrl = new URL("/admin/login", request.url);
//     return NextResponse.redirect(loginUrl);
//   }

//   // إذا كان يحاول الوصول للمطبخ وهو ليس شيفاً أو مديراً
//   if (
//     isKitchenPath &&
//     (!isEmployee || (userRole !== "chief" && userRole !== "admin"))
//   ) {
//     if (isEmployee) {
//       if (userRole === "cashier") {
//         const ordersUrl = new URL("/orders", request.url);
//         return NextResponse.redirect(ordersUrl);
//       } else {
//         const adminUrl = new URL("/admin/", request.url);
//         return NextResponse.redirect(adminUrl);
//       }
//     } else {
//       const loginUrl = new URL("/admin/login", request.url);
//       return NextResponse.redirect(loginUrl);
//     }
//   }

//   // إذا كان يحاول الوصول لصفحات الطلبات وهو ليس كاشيراً أو مديراً
//   if (
//     isOrderPath &&
//     (!isEmployee || (userRole !== "cashier" && userRole !== "admin"))
//   ) {
//     if (isEmployee) {
//       if (userRole === "chief") {
//         const kitchenUrl = new URL("/kitchen", request.url);
//         return NextResponse.redirect(kitchenUrl);
//       } else {
//         const adminUrl = new URL("/admin/", request.url);
//         return NextResponse.redirect(adminUrl);
//       }
//     } else {
//       const loginUrl = new URL("/admin/login", request.url);
//       return NextResponse.redirect(loginUrl);
//     }
//   }

//   // إذا كان موظفاً ويحاول الوصول لصفحات العميل
//   if (isCustomerPath && isEmployee) {
//     if (userRole === "admin") {
//       const adminUrl = new URL("/admin/", request.url);
//       return NextResponse.redirect(adminUrl);
//     } else if (userRole === "cashier") {
//       const ordersUrl = new URL("/orders", request.url);
//       return NextResponse.redirect(ordersUrl);
//     } else if (userRole === "chief") {
//       const kitchenUrl = new URL("/kitchen", request.url);
//       return NextResponse.redirect(kitchenUrl);
//     }
//   }

//   // السماح لجميع الطلبات الأخرى بالمرور
//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/admin/:path*",
//     "/kitchen/:path*",
//     "/orders/:path*",
//     "/profile/:path*",
//     "/auth/:path*",
//   ],
// };

// ملف: app/middleware.js
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // إنشاء عميل Supabase للميدلوير
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          const response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // الحصول على جلسة المستخدم
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // الحصول على دور المستخدم من قاعدة البيانات مباشرة
  let userRole = null;
  let isEmployee = false;
  let isCustomer = false;

  if (session?.user?.id) {
    try {
      // التحقق من جدول user_profiles (الموظفين)
      const { data: userProfile } = await supabase
        .from("user_profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (userProfile) {
        userRole = userProfile.role;
        isEmployee = ["admin", "cashier", "chief"].includes(userRole);
      } else {
        // التحقق من جدول customers (العملاء)
        const { data: customer } = await supabase
          .from("customers")
          .select("id")
          .eq("id", session.user.id)
          .single();

        if (customer) {
          isCustomer = true;
        }
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  }

  // تعريف المسارات المحمية
  const adminPaths = ["/admin", "/admin/", "/admin/:path*"];
  const employeePaths = ["/kitchen", "/orders"];
  const customerPaths = ["/profile", "/auth/signin", "/auth/callback"];

  const isAdminPath = adminPaths.some((path) =>
    pathname.startsWith(path.replace("/:path*", ""))
  );
  const isEmployeePath = employeePaths.some((path) =>
    pathname.startsWith(path)
  );
  const isCustomerPath = customerPaths.some((path) =>
    pathname.startsWith(path)
  );

  // التحقق من الوصول للمسارات الإدارية
  if (isAdminPath) {
    if (!session) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    if (!isEmployee || userRole !== "admin") {
      const redirectUrl = new URL("/", request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // التحقق من الوصول لمسارات الموظفين
  if (isEmployeePath) {
    if (!session) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    if (!isEmployee) {
      const redirectUrl = new URL("/", request.url);
      return NextResponse.redirect(redirectUrl);
    }

    // صلاحيات محددة لكل دور
    if (pathname.startsWith("/kitchen") && !["chief", "admin"].includes(userRole)) {
      const redirectUrl = new URL("/", request.url);
      return NextResponse.redirect(redirectUrl);
    }

    if (pathname.startsWith("/orders") && !["cashier", "admin"].includes(userRole)) {
      const redirectUrl = new URL("/", request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // التحقق من الوصول لمسارات العملاء
  if (isCustomerPath) {
    if (!session) {
      const signinUrl = new URL("/auth/signin", request.url);
      return NextResponse.redirect(signinUrl);
    }

    // منع الموظفين من الوصول لصفحات العملاء
    if (isEmployee) {
      const redirectUrl = new URL("/", request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/kitchen/:path*",
    "/orders/:path*",
    "/profile/:path*",
    "/auth/:path*",
  ],
};
