import { supabase } from "./supabase";
import { storageApi } from "./storage";

// Authentication API with Supabase Auth
export const authApi = {
  // التحقق إذا كان المستخدم موظفاً
  isEmployee: () => {
    const role = authApi.getCurrentRole();
    return ["admin", "cashier", "chief"].includes(role);
  },

  // إضافة دالة للتحقق من جلسة الموظف فقط
  checkEmployeeSession: async () => {
    try {
      const hasSession = await authApi.checkAuth();
      if (!hasSession) return false;

      const role = authApi.getCurrentRole();
      return ["admin", "cashier", "chief"].includes(role);
    } catch (error) {
      return false;
    }
  },

  // تسجيل الدخول
  login: async (email, password) => {
    try {
      

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("❌ خطأ في تسجيل الدخول:", error);
        throw error;
      }

      

      // الحصول على بيانات المستخدم من user_profiles
      const userId = data.user.id;
      let userProfile = null;
      let userRole = "cashier"; // قيمة افتراضية

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
            profileError.message,
          );

          // التحقق إذا كان المستخدم عميلاً
          const { data: customerData } = await supabase
            .from("customers")
            .select("*")
            .eq("id", userId)
            .single();

          if (customerData) {
            throw new Error("هذا الحساب خاص بعميل وليس موظفاً");
          }

          // إنشاء ملف مستخدم جديد إذا كان موظفاً
          
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
          
        } else {
          userProfile = profileData;
          userRole = profileData.role;
          
        }
      } catch (profileError) {
        console.error("❌ خطأ في معالجة ملف المستخدم:", profileError);
        throw profileError;
      }

      // تخزين البيانات في localStorage
      const roleToStore = userRole || "cashier";
      const nameToStore = userProfile?.name || data.user.email.split("@")[0];


      localStorage.setItem("userRole", roleToStore);
      localStorage.setItem("userId", userId);
      localStorage.setItem("userName", nameToStore);
      localStorage.setItem("adminAuthenticated", "true");
      localStorage.setItem("userEmail", data.user.email);

      // تنظيف بيانات العميل إذا كانت موجودة
      localStorage.removeItem("customerAuthenticated");
      localStorage.removeItem("customerId");

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

  // تسجيل الخروج
  logout: async () => {
    try {
      console.log("🚪 جاري تسجيل الخروج...");

      // مسح localStorage أولاً
      localStorage.removeItem("adminAuthenticated");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
      localStorage.removeItem("userEmail");

      // تسجيل الخروج من Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      console.log("✅ تسجيل الخروج ناجح");
      return true;
    } catch (error) {
      console.error("❌ خطأ في تسجيل الخروج:", error);
      throw error;
    }
  },

  isAuthenticated: () => {
    try {
      const adminAuth = localStorage.getItem("adminAuthenticated");
      const userRole = localStorage.getItem("userRole");

      // إذا كان هناك توثيق إدارة وكان الدور من أدوار الإدارة
      const isAdmin =
        !!adminAuth && ["admin", "cashier", "chief"].includes(userRole);

      return isAdmin;
    } catch (error) {
      console.error("❌ Error checking admin auth:", error);
      return false;
    }
  },

  // الحصول على اسم المستخدم
  getUserName: () => {
    return localStorage.getItem("userName") || "الإدارة";
  },

  // التحقق من المصادقة
  checkAuth: async () => {
    try {
      console.log("🔍 بدء التحقق من المصادقة...");

      // الحصول على الجلسة الحالية
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

      // محاولة الحصول على بيانات المستخدم من user_profiles
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
            profileError.message,
          );

          // التحقق إذا كان المستخدم عميلاً
          const { data: customerData } = await supabase
            .from("customers")
            .select("*")
            .eq("id", userId)
            .single();

          if (customerData) {
            console.log("⚠️ المستخدم عميل وليس موظفاً");
            return false;
          }

          // إذا كان المستخدم مسجلاً في Auth ولكن ليس في user_profiles ولا في customers
          // ننشئ له ملفاً تلقائياً
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

      // تخزين البيانات في localStorage
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

      // تنظيف بيانات العميل إذا كانت موجودة
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

  // الحصول على المستخدم الحالي
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

  // إنشاء حساب جديد (للمدير فقط)
  createUser: async (userData) => {
    try {
      console.log("👤 إنشاء مستخدم جديد:", userData.email);

      // التحقق من أن المستخدم الحالي مدير
      const currentRole = localStorage.getItem("userRole");
      if (currentRole !== "admin") {
        throw new Error("غير مصرح - للمدير فقط");
      }

      // التحقق من أن المستخدم غير موجود بالفعل
      console.log("🔍 التحقق من عدم وجود المستخدم مسبقاً...");
      const { data: existingUser } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("email", userData.email)
        .single();

      if (existingUser) {
        throw new Error("هذا البريد الإلكتروني مسجل بالفعل");
      }

      // إنشاء حساب في نظام المصادقة
      console.log("🆕 إنشاء حساب في نظام المصادقة...");
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            phone: userData.phone || "",
            role: userData.role,
          },
          emailRedirectTo: window.location.origin + "/admin/login",
        },
      });

      if (authError) {
        console.error("❌ خطأ في إنشاء حساب المصادقة:", authError);

        if (authError.message.includes("already registered")) {
          throw new Error("هذا البريد الإلكتروني مسجل بالفعل");
        } else if (authError.message.includes("Password")) {
          throw new Error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
        } else {
          throw new Error("فشل في إنشاء حساب: " + authError.message);
        }
      }

      // إنشاء ملف المستخدم
      console.log("📝 إنشاء ملف المستخدم...");
      const userProfile = {
        id: authData.user.id,
        email: userData.email,
        role: userData.role,
        name: userData.name,
        phone: userData.phone || "",
        is_active: true,
        created_at: new Date().toISOString(),
      };

      const { data: profileData, error: profileError } = await supabase
        .from("user_profiles")
        .insert([userProfile])
        .select()
        .single();

      if (profileError) {
        console.error("❌ خطأ في إنشاء ملف المستخدم:", profileError);

        // محاولة حذف حساب المصادقة إذا فشل إنشاء الملف
        try {
          await supabase.auth.admin.deleteUser(authData.user.id);
          console.log("🗑️ تم حذف حساب المصادقة بعد فشل إنشاء الملف");
        } catch (deleteError) {
          console.warn("⚠️ لا يمكن حذف حساب المصادقة:", deleteError.message);
        }

        throw new Error("فشل في إنشاء ملف المستخدم: " + profileError.message);
      }

      console.log("✅ تم إنشاء المستخدم بنجاح:", profileData);

      return profileData;
    } catch (error) {
      console.error("❌ Create user error:", error);
      throw error;
    }
  },

  // تحديث حالة المستخدم
  updateUserStatus: async (userId, isActive) => {
    try {
      // التحقق من أن المستخدم الحالي مدير
      const currentRole = localStorage.getItem("userRole");
      if (currentRole !== "admin") {
        throw new Error("غير مصرح - للمدير فقط");
      }

      // لا يمكن للمدير تعطيل نفسه
      const currentUserId = localStorage.getItem("userId");
      if (currentUserId === userId && !isActive) {
        throw new Error("لا يمكنك تعطيل حسابك الخاص");
      }

      const { data, error } = await supabase
        .from("user_profiles")
        .update({
          is_active: isActive,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Update user status error:", error);
      throw error;
    }
  },

  // تحديث دور المستخدم
  updateUserRole: async (userId, newRole) => {
    try {
      // التحقق من أن المستخدم الحالي مدير
      const currentRole = localStorage.getItem("userRole");
      if (currentRole !== "admin") {
        throw new Error("غير مصرح - للمدير فقط");
      }

      // لا يمكن تغيير دور النفس
      const currentUserId = localStorage.getItem("userId");
      if (currentUserId === userId) {
        throw new Error("لا يمكنك تغيير دور حسابك الخاص");
      }

      const { data, error } = await supabase
        .from("user_profiles")
        .update({
          role: newRole,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error("Update user role error:", error);
      throw error;
    }
  },

  // الحصول على جميع المستخدمين
  getAllUsers: async () => {
    try {
      // التحقق من أن المستخدم الحالي مدير
      const currentRole = localStorage.getItem("userRole") || "cashier";
      console.log("🎭 الدور الحالي في getAllUsers:", currentRole);

      if (currentRole !== "admin") {
        throw new Error("غير مصرح - للمدير فقط");
      }

      const { data: users, error } = await supabase
        .from("user_profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return users;
    } catch (error) {
      console.error("Get all users error:", error);
      throw error;
    }
  },

  // حذف مستخدم
  deleteUser: async (userId) => {
    try {
      // التحقق من أن المستخدم الحالي مدير
      const currentRole = authApi.getCurrentRole();
      if (currentRole !== "admin") {
        throw new Error("غير مصرح - للمدير فقط");
      }

      // لا يمكن حذف النفس
      const currentUserId = localStorage.getItem("userId");
      if (currentUserId === userId) {
        throw new Error("لا يمكنك حذف حسابك الخاص");
      }

      // التحقق من أن المستخدم المراد حذفه ليس المدير الأخير
      const { data: userToDelete } = await supabase
        .from("user_profiles")
        .select("role")
        .eq("id", userId)
        .single();

      if (userToDelete?.role === "admin") {
        const { data: adminUsers } = await supabase
          .from("user_profiles")
          .select("id")
          .eq("role", "admin")
          .eq("is_active", true);

        if (adminUsers && adminUsers.length <= 1) {
          throw new Error("لا يمكن حذف المدير الأخير النشط");
        }
      }

      // حذف من جدول user_profiles أولاً
      const { error: profileError } = await supabase
        .from("user_profiles")
        .delete()
        .eq("id", userId);

      if (profileError) {
        throw new Error("فشل في حذف ملف المستخدم: " + profileError.message);
      }

      // محاولة حذف من نظام المصادقة
      try {
        const { error: authError } =
          await supabase.auth.admin.deleteUser(userId);
        if (authError) {
          console.warn("⚠️ لا يمكن حذف حساب المصادقة:", authError.message);
          // استمر رغم ذلك لأن الملف الرئيسي تم حذفه
        }
      } catch (adminError) {
        console.warn("⚠️ خطأ في حذف حساب المصادقة:", adminError.message);
      }

      console.log("✅ تم حذف المستخدم بنجاح:", userId);
      return true;
    } catch (error) {
      console.error("❌ Delete user error:", error);
      throw error;
    }
  },

  // الحصول على دور المستخدم الحالي
  getCurrentRole: () => {
    const role = localStorage.getItem("userRole");
    console.log("🎭 الدور الحالي من localStorage:", role);

    if (!role) {
      console.warn(
        "⚠️ لم يتم العثور على دور في localStorage، استخدم 'cashier' كافتراضي",
      );
      return "cashier";
    }

    return role;
  },

  // التحقق من الصلاحية
  hasRole: (requiredRole) => {
    const userRole = authApi.getCurrentRole();
    const result = userRole === requiredRole;
    console.log(
      `🔐 التحقق من الصلاحية: ${userRole} === ${requiredRole} => ${result}`,
    );
    return result;
  },

  // التحقق من أن المستخدم مدير
  isAdmin: () => {
    return authApi.getCurrentRole() === "admin";
  },

  // التحقق من أن المستخدم شيف
  isChief: () => {
    return authApi.getCurrentRole() === "chief";
  },

  // التحقق من أن المستخدم كاشير
  isCashier: () => {
    return authApi.getCurrentRole() === "cashier";
  },

  // إصلاح بيانات المستخدم يدوياً
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

      // الحصول على بيانات المستخدم الحقيقية من قاعدة البيانات
      const { data: realProfile } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (!realProfile) {
        // التحقق إذا كان عميلاً
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

      // تصحيح البيانات في localStorage
      localStorage.setItem("userRole", realProfile.role);
      localStorage.setItem("userName", realProfile.name || userEmail);
      localStorage.setItem("userId", userId);
      localStorage.setItem("userEmail", userEmail);
      localStorage.setItem("adminAuthenticated", "true");

      // تنظيف بيانات العميل
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

  // اختبار الاتصال بقاعدة البيانات
  testConnection: async () => {
    try {
      console.log("🔗 اختبار الاتصال بقاعدة البيانات...");

      // اختبار الجداول المختلفة
      const tests = {};

      // اختبار جدول user_profiles
      const { data: users, error: usersError } = await supabase
        .from("user_profiles")
        .select("count")
        .limit(1);

      tests.user_profiles = !usersError;

      // اختبار جدول customers
      const { data: customers, error: customersError } = await supabase
        .from("customers")
        .select("count")
        .limit(1);

      tests.customers = !customersError;

      // اختبار جدول orders
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select("count")
        .limit(1);

      tests.orders = !ordersError;

      // اختبار auth
      const { data: authData, error: authError } =
        await supabase.auth.getSession();
      tests.auth = !authError;
      tests.hasSession = !!authData?.session;

      

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

  // دالة جديدة: التحقق من نوع المستخدم
  getUserType: async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        return "guest";
      }

      const userId = sessionData.session.user.id;

      // التحقق من جدول user_profiles أولاً
      const { data: userProfile } = await supabase
        .from("user_profiles")
        .select("role")
        .eq("id", userId)
        .single();

      if (userProfile) {
        return "employee";
      }

      // التحقق من جدول customers
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
};

// Orders API
export const ordersApi = {
  // الحصول على الطلبات مع التصفية
  getOrders: async (filters = {}) => {
    try {
      const userRole = authApi.getCurrentRole();
      
      let query = supabase.from("orders").select("*");

      // تطبيق الفلاتر بناء على الدور
      if (userRole === "chief") {
        query = query.in("status", ["pending", "preparing"]);
        
      }

      if (filters.status && filters.status !== "all") {
        query = query.eq("status", filters.status);
        
      }

      if (filters.search) {
        query = query.or(
          `customer_name.ilike.%${filters.search}%,customer_phone.ilike.%${filters.search}%,id.ilike.%${filters.search}%`,
        );
       
      }

      query = query.order("created_at", { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error("❌ خطأ في جلب الطلبات:", error);
        throw error;
      }

      
      return data || [];
    } catch (error) {
      console.error("Get orders error:", error);
      throw error;
    }
  },

  // الحصول على طلب بواسطة ID
  getOrderById: async (id) => {
    try {
      

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("❌ خطأ في جلب الطلب:", error);
        throw error;
      }

     
      return data;
    } catch (error) {
      console.error("Get order by id error:", error);
      throw error;
    }
  },

  // إنشاء طلب جديد
  createOrder: async (orderData) => {
    try {
      const cashierId = localStorage.getItem("userId");
      const cashierRole = localStorage.getItem("userRole");


      const orderToInsert = {
        customer_name: orderData.customer_name,
        customer_phone: orderData.customer_phone,
        customer_address: orderData.customer_address,
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

      

      // محاولة إرسال إشعار للشيف
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
        
      } catch (notifError) {
        console.warn("⚠️ لا يمكن إنشاء الإشعار:", notifError);
      }

      return data;
    } catch (error) {
      console.error("Create order error:", error);
      throw error;
    }
  },

  // تحديث حالة الطلب
  updateOrderStatus: async (orderId, newStatus) => {
    try {
      const userRole = authApi.getCurrentRole();
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

      

      // إرسال إشعار للكاشير إذا أصبح الطلب جاهزاً
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

  // الحصول على طلبات المطبخ
  getKitchenOrders: async () => {
    try {


      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .in("status", ["pending", "preparing"])
        .order("created_at", { ascending: true });

      if (error) {
        console.error("❌ خطأ في جلب طلبات المطبخ:", error);
        throw error;
      }

      
      return data || [];
    } catch (error) {
      console.error("Get kitchen orders error:", error);
      throw error;
    }
  },

  // الحصول على إحصائيات الطلبات
  getOrderStats: async (period = "today") => {
    try {
      

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

      return stats;
    } catch (error) {
      console.error("Get order stats error:", error);
      throw error;
    }
  },

  // حذف طلب
  deleteOrder: async (orderId) => {
    try {
      const userRole = authApi.getCurrentRole();
      

      const { error } = await supabase
        .from("orders")
        .delete()
        .eq("id", orderId);

      if (error) {
        console.error("❌ خطأ في حذف الطلب:", error);
        throw error;
      }

      
      return true;
    } catch (error) {
      console.error("Delete order error:", error);
      throw error;
    }
  },
};

// Home Slides API
export const homeApi = {
  getSlides: async () => {
    const { data, error } = await supabase
      .from("home_slides")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data;
  },

  createSlide: async (slideData, imageFile = null) => {
    try {
      if (imageFile) {
        const imageUrl = await storageApi.uploadFile(imageFile);
        slideData.image = imageUrl;
      }

      const dataToInsert = {
        title: slideData.title,
        subtitle: slideData.subtitle,
        description: slideData.description,
        image: slideData.image,
        button_text: slideData.button_text,
        bg_color: slideData.bg_color,
        sort_order: slideData.sort_order || 0,
        is_active:
          slideData.is_active !== undefined ? slideData.is_active : true,
      };

      const { data, error } = await supabase
        .from("home_slides")
        .insert([dataToInsert])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Create slide error:", error);
      throw error;
    }
  },

  updateSlide: async (id, updates, imageFile = null) => {
    try {
      if (imageFile) {
        const imageUrl = await storageApi.uploadFile(imageFile);
        updates.image = imageUrl;
      }

      const { data, error } = await supabase
        .from("home_slides")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Update slide error:", error);
      throw error;
    }
  },

  deleteSlide: async (id) => {
    const { error } = await supabase.from("home_slides").delete().eq("id", id);
    if (error) throw error;
    return true;
  },
};

// Featured Dishes API
export const featuredDishesApi = {
  getFeaturedDishes: async () => {
    const { data, error } = await supabase
      .from("featured_dishes")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data;
  },

  createFeaturedDish: async (dishData, imageFile = null) => {
    try {
      if (imageFile) {
        const imageUrl = await storageApi.uploadFile(imageFile);
        dishData.image = imageUrl;
      }

      const dataToInsert = {
        name: dishData.name,
        name_en: dishData.name_en,
        price: dishData.price,
        original_price: dishData.original_price,
        description: dishData.description,
        image: dishData.image,
        rating: dishData.rating,
        details: dishData.details,
        sort_order: dishData.sort_order || 0,
        is_active: dishData.is_active !== undefined ? dishData.is_active : true,
      };

      const { data, error } = await supabase
        .from("featured_dishes")
        .insert([dataToInsert])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Create dish error:", error);
      throw error;
    }
  },

  updateFeaturedDish: async (id, updates, imageFile = null) => {
    try {
      if (imageFile) {
        const imageUrl = await storageApi.uploadFile(imageFile);
        updates.image = imageUrl;
      }

      const { data, error } = await supabase
        .from("featured_dishes")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Update dish error:", error);
      throw error;
    }
  },

  deleteFeaturedDish: async (id) => {
    const { error } = await supabase
      .from("featured_dishes")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  },
};

// Offers API
export const offersApi = {
  getOffers: async () => {
    const { data, error } = await supabase
      .from("offers")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data;
  },

  createOffer: async (offerData, imageFile = null) => {
    try {
      if (imageFile) {
        const imageUrl = await storageApi.uploadFile(imageFile);
        offerData.image = imageUrl;
      }

      const dataToInsert = {
        title: offerData.title,
        description: offerData.description,
        price: offerData.price,
        original_price: offerData.original_price,
        image: offerData.image,
        details: offerData.details,
        sort_order: offerData.sort_order || 0,
        is_active:
          offerData.is_active !== undefined ? offerData.is_active : true,
      };

      const { data, error } = await supabase
        .from("offers")
        .insert([dataToInsert])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Create offer error:", error);
      throw error;
    }
  },

  updateOffer: async (id, updates, imageFile = null) => {
    try {
      if (imageFile) {
        const imageUrl = await storageApi.uploadFile(imageFile);
        updates.image = imageUrl;
      }

      const { data, error } = await supabase
        .from("offers")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Update offer error:", error);
      throw error;
    }
  },

  deleteOffer: async (id) => {
    const { error } = await supabase.from("offers").delete().eq("id", id);
    if (error) throw error;
    return true;
  },
};

// Categories API
export const categoriesApi = {
  getCategories: async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data;
  },

  createCategory: async (categoryData, imageFile = null) => {
    try {
      if (imageFile) {
        const imageUrl = await storageApi.uploadFile(imageFile);
        categoryData.image_url = imageUrl;
      }

      const dataToInsert = {
        name_ar: categoryData.name_ar,
        name_en: categoryData.name_en,
        description: categoryData.description,
        image_url: categoryData.image_url,
        sort_order: categoryData.sort_order || 0,
        is_active:
          categoryData.is_active !== undefined ? categoryData.is_active : true,
      };

      const { data, error } = await supabase
        .from("categories")
        .insert([dataToInsert])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Create category error:", error);
      throw error;
    }
  },

  updateCategory: async (id, updates, imageFile = null) => {
    try {
      if (imageFile) {
        const imageUrl = await storageApi.uploadFile(imageFile);
        updates.image_url = imageUrl;
      }

      const { data, error } = await supabase
        .from("categories")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Update category error:", error);
      throw error;
    }
  },

  deleteCategory: async (id) => {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) throw error;
    return true;
  },
};

// Menu Items API
export const menuItemsApi = {
  getMenuItems: async () => {
    const { data, error } = await supabase
      .from("menu_items")
      .select(
        `
        *,
        menu_categories(name, name_en)
      `,
      )
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data;
  },

  getFilteredMenuItems: async (category = "all", search = "", limit = 20) => {
    try {
      

      // Step 1: Get all active categories
      const { data: categories, error: catError } = await supabase
        .from("menu_categories")
        .select("*")
        .eq("is_active", true);

      if (catError) throw catError;
      

      // Step 2: Build the base query
      let query = supabase
        .from("menu_items")
        .select(
          `
          *,
          menu_categories(name, name_en)
        `,
        )
        .eq("is_active", true);

      // Step 3: Filter by category if specified (not "all")
      if (category !== "all" && categories && categories.length > 0) {
        const foundCategory = categories.find((cat) => {
          const catName = cat.name_en?.toLowerCase() || cat.name.toLowerCase();
          return catName === category.toLowerCase();
        });

        if (foundCategory) {
          query = query.eq("category_id", foundCategory.id);
        }
      }

      // Step 4: Add search filter (يتم تطبيقه دائماً إذا كان هناك بحث)
      if (search && search.trim() !== "") {
        const searchTerm = `%${search}%`;
        query = query.or(
          `name.ilike.${searchTerm},name_en.ilike.${searchTerm},description.ilike.${searchTerm}`,
        );
        
      }

      // Step 5: Add limit ONLY if:
      // 1. It's "all" category AND
      // 2. There's NO search query (إذا كان هناك بحث، نريد كل النتائج)
      if (category === "all" && (!search || search.trim() === "")) {
        query = query.limit(limit);
      }

      // Step 6: Execute query with ordering
      const { data, error } = await query.order("sort_order", {
        ascending: true,
      });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      throw error;
    }
  },

  // دالة جديدة خاصة للبحث فقط
  searchAllItems: async (searchTerm, limit = 50) => {
    if (!searchTerm || searchTerm.trim() === "") {
      return [];
    }

    const { data, error } = await supabase
      .from("menu_items")
      .select(
        `
        *,
        menu_categories(name, name_en)
      `,
      )
      .eq("is_active", true)
      .or(
        `name.ilike.%${searchTerm}%,name_en.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`,
      )
      .order("sort_order", { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  getMenuItemsPaginated: async (page = 1, limit = 20) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("menu_items")
      .select(
        `
        *,
        menu_categories(name, name_en)
      `,
        { count: "exact" },
      )
      .order("sort_order", { ascending: true })
      .range(from, to);

    if (error) throw error;
    return { data, total: count };
  },

  getMenuItemsByCategory: async (categoryId) => {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("category_id", categoryId)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data;
  },

  createMenuItem: async (itemData, imageFile = null) => {
    try {
      // التحقق من الصلاحية
      const userRole = authApi.getCurrentRole();
      if (!["chief", "admin"].includes(userRole)) {
        throw new Error("غير مصرح لك بإضافة أصناف جديدة");
      }

      if (imageFile) {
        const imageUrl = await storageApi.uploadFile(imageFile);
        itemData.image = imageUrl;
      }

      const { data, error } = await supabase
        .from("menu_items")
        .insert([itemData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Create menu item error:", error);
      throw error;
    }
  },

  updateMenuItem: async (id, updates, imageFile = null) => {
    try {
      // التحقق من الصلاحية
      const userRole = authApi.getCurrentRole();
      if (!["chief", "admin"].includes(userRole)) {
        throw new Error("غير مصرح لك بتعديل الأصناف");
      }

      if (imageFile) {
        const imageUrl = await storageApi.uploadFile(imageFile);
        updates.image = imageUrl;
      }

      const { data, error } = await supabase
        .from("menu_items")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Update menu item error:", error);
      throw error;
    }
  },

  deleteMenuItem: async (id) => {
    // التحقق من الصلاحية
    const userRole = authApi.getCurrentRole();
    if (!["chief", "admin"].includes(userRole)) {
      throw new Error("غير مصرح لك بحذف الأصناف");
    }

    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    if (error) throw error;
    return true;
  },
};

// Menu Categories API
export const menuCategoriesApi = {
  getCategories: async () => {
    const { data, error } = await supabase
      .from("menu_categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data;
  },

  createCategory: async (categoryData) => {
    try {
      const { data, error } = await supabase
        .from("menu_categories")
        .insert([categoryData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Create menu category error:", error);
      throw error;
    }
  },

  updateCategory: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from("menu_categories")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Update menu category error:", error);
      throw error;
    }
  },

  deleteCategory: async (id) => {
    const { error } = await supabase
      .from("menu_categories")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  },
};

// Statistics API
export const statsApi = {
  getDashboardStats: async () => {
    try {
      const today = new Date().toISOString().split("T")[0];

      let stats = {
        totalOrders: 0,
        dailyRevenue: 0,
        menuItems: 0,
        activeUsers: 0,
      };

      // Get total orders
      const { data: ordersData } = await supabase
        .from("orders")
        .select("id, total_amount, created_at, status");

      if (ordersData) {
        stats.totalOrders = ordersData.length;
        stats.dailyRevenue = ordersData
          .filter(
            (order) =>
              order.created_at?.startsWith(today) &&
              order.status === "completed",
          )
          .reduce((sum, order) => sum + (order.total_amount || 0), 0);
      }

      // Get menu items count
      const { data: menuItemsData } = await supabase
        .from("menu_items")
        .select("id");

      if (menuItemsData) {
        stats.menuItems = menuItemsData.length;
      }

      // Get active users count (admin only)
      const userRole = authApi.getCurrentRole();
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
        dailyRevenue: 0,
        menuItems: 0,
        activeUsers: 0,
      };
    }
  },

  getRecentOrders: async (limit = 10) => {
    try {
      const userRole = authApi.getCurrentRole();

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

  getSalesStats: async (period = "monthly") => {
    try {
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
        .select("total_amount, created_at, status")
        .gte("created_at", startDate.toISOString());

      if (error) throw error;

      const stats = {
        totalSales: 0,
        averageOrderValue: 0,
        completedOrders: 0,
      };

      if (data && data.length > 0) {
        const completedOrders = data.filter(
          (order) => order.status === "completed",
        );
        stats.completedOrders = completedOrders.length;
        stats.totalSales = completedOrders.reduce(
          (sum, order) => sum + (order.total_amount || 0),
          0,
        );
        stats.averageOrderValue =
          stats.completedOrders > 0
            ? stats.totalSales / stats.completedOrders
            : 0;
      }

      return stats;
    } catch (error) {
      console.error("Get sales stats error:", error);
      throw error;
    }
  },
};

// Utility functions for Supabase
export const supabaseUtils = {
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

  cleanupSubscriptions: (channel) => {
    if (channel) {
      supabase.removeChannel(channel);
    }
  },
};

// Settings API
export const settingsApi = {
  getSettings: async () => {
    try {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .single();

      if (error) throw error;
      return data || {};
    } catch (error) {
      console.error("Get settings error:", error);
      return {};
    }
  },

  updateSettings: async (settings) => {
    try {
      const { data, error } = await supabase
        .from("settings")
        .upsert(settings)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Update settings error:", error);
      throw error;
    }
  },

  // إعدادات المطعم
  getRestaurantSettings: async () => {
    try {
      const { data, error } = await supabase
        .from("restaurant_settings")
        .select("*")
        .single();

      if (error && error.code !== "PGRST116") throw error; // PGRST116 means no rows
      return (
        data || {
          name: "مطعم بزوم",
          phone: "01000000000",
          address: "عنوان المطعم",
          whatsapp_number: "201010882822",
          delivery_fee: 20,
          min_order_amount: 50,
          opening_hours: "10:00 - 02:00",
          is_open: true,
        }
      );
    } catch (error) {
      console.error("Get restaurant settings error:", error);
      return {
        name: "مطعم بزوم",
        phone: "01000000000",
        address: "عنوان المطعم",
        whatsapp_number: "201010882822",
        delivery_fee: 20,
        min_order_amount: 50,
        opening_hours: "10:00 - 02:00",
        is_open: true,
      };
    }
  },

  updateRestaurantSettings: async (settings) => {
    try {
      const { data, error } = await supabase
        .from("restaurant_settings")
        .upsert(settings, { onConflict: "id" })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Update restaurant settings error:", error);
      throw error;
    }
  },
};

// Export all APIs together
export const adminApi = {
  auth: authApi,
  orders: ordersApi,
  home: homeApi,
  featuredDishes: featuredDishesApi,
  offers: offersApi,
  categories: categoriesApi,
  menuCategories: menuCategoriesApi,
  menuItems: menuItemsApi,
  stats: statsApi,
  settings: settingsApi,
  supabaseUtils: supabaseUtils,
  supabase: supabase,
};

export default adminApi;
