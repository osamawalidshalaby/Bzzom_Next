import { supabase } from "./supabase";

/**
 * Authentication Service
 * Handles all user authentication and authorization logic
 */
export const authService = {
  // Check if user is an employee
  isEmployee: () => {
    const role = authService.getCurrentRole();
    return ["admin", "cashier", "chief"].includes(role);
  },

  // Check if user has an employee session
  checkEmployeeSession: async () => {
    try {
      const hasSession = await authService.checkAuth();
      if (!hasSession) return false;

      const role = authService.getCurrentRole();
      return ["admin", "cashier", "chief"].includes(role);
    } catch (error) {
      return false;
    }
  },

  // User login
  login: async (email, password) => {
    try {
      console.log("🔐 محاولة تسجيل الدخول...", email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("❌ خطأ في تسجيل الدخول:", error);
        throw error;
      }

      console.log("✅ تسجيل الدخول ناجح للمستخدم:", data.user.email);

      // Get user profile from user_profiles
      const userId = data.user.id;
      let userProfile = null;
      let userRole = "cashier"; // Default role

      try {
        console.log("🔍 جاري جلب ملف المستخدم...");
        const { data: profileData, error: profileError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (profileError) {
          console.warn(
            "⚠️ لم يتم العثور على ملف المستخدم:",
            profileError.message
          );

          // Check if user is a customer
          const { data: customerData } = await supabase
            .from("customers")
            .select("*")
            .eq("id", userId)
            .single();

          if (customerData) {
            throw new Error("هذا الحساب خاص بعميل وليس موظفاً");
          }

          // Create new user profile if they are an employee
          console.log("🆕 إنشاء ملف مستخدم جديد...");
          const newProfile = {
            id: userId,
            email: data.user.email,
            role: email.includes("admin")
              ? "admin"
              : email.includes("chief")
              ? "chief"
              : "cashier",
            name: data.user.email.split("@")[0],
            phone: "",
            is_active: true,
            created_at: new Date().toISOString(),
          };

          const { data: createdProfile, error: createError } = await supabase
            .from("user_profiles")
            .insert([newProfile])
            .select()
            .single();

          if (createError) {
            console.error("❌ فشل في إنشاء الملف:", createError);
            throw new Error("فشل في إنشاء ملف المستخدم");
          }

          userProfile = createdProfile;
          userRole = createdProfile.role;
          console.log("✅ تم إنشاء ملف مستخدم جديد:", userProfile);
        } else {
          userProfile = profileData;
          userRole = profileData.role;
          console.log("✅ تم العثور على ملف المستخدم:", userProfile);
        }
      } catch (profileError) {
        console.error("❌ خطأ في معالجة ملف المستخدم:", profileError);
        throw profileError;
      }

      // Store data in localStorage
      const roleToStore = userRole || "cashier";
      const nameToStore = userProfile?.name || data.user.email.split("@")[0];

      console.log("💾 تخزين البيانات في localStorage:", {
        role: roleToStore,
        name: nameToStore,
        userId: userId,
      });

      localStorage.setItem("userRole", roleToStore);
      localStorage.setItem("userId", userId);
      localStorage.setItem("userName", nameToStore);
      localStorage.setItem("adminAuthenticated", "true");
      localStorage.setItem("userEmail", data.user.email);

      // Clean up customer data if present
      localStorage.removeItem("customerAuthenticated");
      localStorage.removeItem("customerId");

      // Verify storage
      console.log("✅ البيانات المخزنة في localStorage:");
      console.log("- userRole:", localStorage.getItem("userRole"));
      console.log("- userId:", localStorage.getItem("userId"));
      console.log("- userName:", localStorage.getItem("userName"));

      return {
        user: data.user,
        profile: userProfile,
        role: roleToStore,
      };
    } catch (error) {
      console.error("❌ خطأ في عملية تسجيل الدخول:", error);
      throw new Error(error.message || "بيانات الدخول غير صحيحة");
    }
  },

  // User logout
  logout: async () => {
    try {
      console.log("🚪 جاري تسجيل الخروج...");

      // Clear localStorage first
      localStorage.removeItem("adminAuthenticated");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
      localStorage.removeItem("userEmail");

      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      console.log("✅ تسجيل الخروج ناجح");
      return true;
    } catch (error) {
      console.error("❌ خطأ في تسجيل الخروج:", error);
      throw error;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    try {
      const adminAuth = localStorage.getItem("adminAuthenticated");
      const userRole = localStorage.getItem("userRole");

      const isAdmin =
        !!adminAuth && ["admin", "cashier", "chief"].includes(userRole);

      return isAdmin;
    } catch (error) {
      console.error("❌ Error checking admin auth:", error);
      return false;
    }
  },

  // Get current user name
  getUserName: () => {
    return localStorage.getItem("userName") || "الإدارة";
  },

  // Check authentication and sync profile
  checkAuth: async () => {
    try {
      console.log("🔍 بدء التحقق من المصادقة...");

      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) {
        console.error("❌ خطأ في جلسة المصادقة:", sessionError);
        return false;
      }

      if (!sessionData.session) {
        console.log("⚠️ لا توجد جلسة نشطة");
        return false;
      }

      const userId = sessionData.session.user.id;
      const userEmail = sessionData.session.user.email;

      console.log("✅ جلسة موجودة للمستخدم:", { userId, userEmail });

      let userProfile = null;
      let userRole = "cashier";
      let userName = userEmail.split("@")[0];

      try {
        console.log("🔍 جاري جلب بيانات المستخدم...");
        const { data: profileData, error: profileError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (profileError) {
          console.warn(
            "⚠️ لم يتم العثور على ملف المستخدم:",
            profileError.message
          );

          // Check if user is a customer
          const { data: customerData } = await supabase
            .from("customers")
            .select("*")
            .eq("id", userId)
            .single();

          if (customerData) {
            console.log("⚠️ المستخدم عميل وليس موظفاً");
            return false;
          }

          // Auto-create profile if user is registered in Auth but not in user_profiles
          console.log("🆕 إنشاء ملف مستخدم تلقائياً...");
          const newProfile = {
            id: userId,
            email: userEmail,
            role: userEmail.includes("admin")
              ? "admin"
              : userEmail.includes("chief")
              ? "chief"
              : "cashier",
            name: userName,
            phone: "",
            is_active: true,
            created_at: new Date().toISOString(),
          };

          const { data: createdProfile, error: createError } = await supabase
            .from("user_profiles")
            .insert([newProfile])
            .select()
            .single();

          if (createError) {
            console.error("❌ فشل في إنشاء الملف:", createError);
            return false;
          } else {
            userProfile = createdProfile;
            userRole = createdProfile.role;
            userName = createdProfile.name || userName;
            console.log("✅ تم إنشاء ملف مستخدم جديد:", userProfile);
          }
        } else {
          userProfile = profileData;
          userRole = profileData.role || "cashier";
          userName = profileData.name || userName;
          console.log("✅ تم العثور على ملف المستخدم:", userProfile);
        }
      } catch (error) {
        console.error("❌ خطأ في جلب بيانات المستخدم:", error);
        return false;
      }

      // Store data in localStorage
      console.log("💾 تخزين البيانات في localStorage:", {
        role: userRole,
        name: userName,
        userId: userId,
      });

      localStorage.setItem("userRole", userRole);
      localStorage.setItem("userId", userId);
      localStorage.setItem("userName", userName);
      localStorage.setItem("adminAuthenticated", "true");
      localStorage.setItem("userEmail", userEmail);

      // Clean up customer data if present
      localStorage.removeItem("customerAuthenticated");
      localStorage.removeItem("customerId");

      console.log("✅ التحقق من المصادقة مكتمل:");
      console.log("- userRole:", localStorage.getItem("userRole"));
      console.log("- userId:", localStorage.getItem("userId"));

      return true;
    } catch (error) {
      console.error("❌ خطأ عام في التحقق من المصادقة:", error);
      return false;
    }
  },

  // Get current authenticated user
  getCurrentUser: async () => {
    try {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return null;

      const userId = data.user.id;
      const { data: userProfile } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .single();

      return {
        ...data.user,
        profile: userProfile || null,
      };
    } catch (error) {
      console.error("Get current user error:", error);
      return null;
    }
  },

  // Get current user role
  getCurrentRole: () => {
    const role = localStorage.getItem("userRole");
    console.log("🎭 الدور الحالي من localStorage:", role);

    if (!role) {
      console.warn(
        "⚠️ لم يتم العثور على دور في localStorage، استخدم 'cashier' كافتراضي"
      );
      return "cashier";
    }

    return role;
  },

  // Check if user has specific role
  hasRole: (requiredRole) => {
    const userRole = authService.getCurrentRole();
    const result = userRole === requiredRole;
    console.log(
      `🔐 التحقق من الصلاحية: ${userRole} === ${requiredRole} => ${result}`
    );
    return result;
  },

  // Check if user is admin
  isAdmin: () => {
    return authService.getCurrentRole() === "admin";
  },

  // Check if user is chef
  isChief: () => {
    return authService.getCurrentRole() === "chief";
  },

  // Check if user is cashier
  isCashier: () => {
    return authService.getCurrentRole() === "cashier";
  },

  // Fix user data manually
  fixUserData: async () => {
    try {
      console.log("🔧 إصلاح بيانات المستخدم...");

      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        throw new Error("لا توجد جلسة نشطة");
      }

      const userId = sessionData.session.user.id;
      const userEmail = sessionData.session.user.email;

      console.log("المستخدم الحالي:", { userId, userEmail });

      // Get real user data from database
      const { data: realProfile } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (!realProfile) {
        // Check if user is a customer
        const { data: customer } = await supabase
          .from("customers")
          .select("*")
          .eq("id", userId)
          .single();

        if (customer) {
          throw new Error("المستخدم عميل وليس موظفاً");
        }

        throw new Error("لم يتم العثور على ملف المستخدم في قاعدة البيانات");
      }

      console.log("البيانات الحقيقية من قاعدة البيانات:", realProfile);
      console.log("البيانات المخزنة حالياً في localStorage:", {
        role: localStorage.getItem("userRole"),
        name: localStorage.getItem("userName"),
      });

      // Fix data in localStorage
      localStorage.setItem("userRole", realProfile.role);
      localStorage.setItem("userName", realProfile.name || userEmail);
      localStorage.setItem("userId", userId);
      localStorage.setItem("userEmail", userEmail);
      localStorage.setItem("adminAuthenticated", "true");

      // Clean up customer data
      localStorage.removeItem("customerAuthenticated");
      localStorage.removeItem("customerId");

      console.log("✅ تم تصحيح البيانات:");
      console.log("- الدور الجديد:", localStorage.getItem("userRole"));
      console.log("- الاسم الجديد:", localStorage.getItem("userName"));

      return realProfile;
    } catch (error) {
      console.error("❌ فشل في إصلاح البيانات:", error);
      throw error;
    }
  },

  // Get user type (employee, customer, guest)
  getUserType: async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        return "guest";
      }

      const userId = sessionData.session.user.id;

      // Check user_profiles table first
      const { data: userProfile } = await supabase
        .from("user_profiles")
        .select("role")
        .eq("id", userId)
        .single();

      if (userProfile) {
        return "employee";
      }

      // Check customers table
      const { data: customer } = await supabase
        .from("customers")
        .select("id")
        .eq("id", userId)
        .single();

      if (customer) {
        return "customer";
      }

      return "guest";
    } catch (error) {
      console.error("Error getting user type:", error);
      return "guest";
    }
  },

  // Test database connection
  testConnection: async () => {
    try {
      console.log("🔗 اختبار الاتصال بقاعدة البيانات...");

      const tests = {};

      // Test user_profiles table
      const { data: users, error: usersError } = await supabase
        .from("user_profiles")
        .select("count")
        .limit(1);

      tests.user_profiles = !usersError;

      // Test customers table
      const { data: customers, error: customersError } = await supabase
        .from("customers")
        .select("count")
        .limit(1);

      tests.customers = !customersError;

      // Test orders table
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select("count")
        .limit(1);

      tests.orders = !ordersError;

      // Test auth
      const { data: authData, error: authError } =
        await supabase.auth.getSession();
      tests.auth = !authError;
      tests.hasSession = !!authData?.session;

      console.log("نتائج الاختبار:", tests);

      return {
        success: true,
        tests,
        currentUser: authData?.session?.user,
      };
    } catch (error) {
      console.error("❌ فشل اختبار الاتصال:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  },
};

export default authService;
