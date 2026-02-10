import { supabase } from "./supabase";
import { authService } from "./auth.service";

/**
 * Admin Service
 * Handles admin-only user management operations
 */
export const adminService = {
  // Create new user (admin only)
  createUser: async (userData) => {
    try {
      console.log("👤 إنشاء مستخدم جديد:", userData.email);

      // Check if current user is admin
      const currentRole = localStorage.getItem("userRole");
      if (currentRole !== "admin") {
        throw new Error("غير مصرح - للمدير فقط");
      }

      // Check if user doesn't already exist
      console.log("🔍 التحقق من عدم وجود المستخدم مسبقاً...");
      const { data: existingUser } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("email", userData.email)
        .single();

      if (existingUser) {
        throw new Error("هذا البريد الإلكتروني مسجل بالفعل");
      }

      // Create auth account
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

      // Ensure auth data and user exist
      if (!authData || !authData.user || !authData.user.id) {
        console.error("❌ لم يعد authData.user بعد الإنشاء:", authData);
        throw new Error(
          "فشل في إنشاء حساب المصادقة: لم يتم إرجاع بيانات المستخدم",
        );
      }

      // Create user profile
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
        // Log full error details for easier debugging
        console.error(
          "❌ خطأ في إنشاء ملف المستخدم:",
          profileError,
          JSON.stringify(profileError),
        );

        const createdUserId = authData?.user?.id;

        // Detect foreign-key violation (Postgres 23503) or message hint
        const fkViolation =
          profileError?.code === "23503" ||
          (typeof profileError?.message === "string" &&
            profileError.message.includes("violates foreign key"));

        if (fkViolation && createdUserId) {
          console.log("⚙️ محاولة إصلاح FK: إضافة سجل أساسي إلى جدول users...");
          try {
            const minimalUser = {
              id: createdUserId,
              email: userData.email,
              created_at: new Date().toISOString(),
            };

            const { data: usersData, error: usersError } = await supabase
              .from("users")
              .insert([minimalUser])
              .select()
              .single();

            if (usersError) {
              console.warn("⚠️ فشل إنشاء سجل في users:", usersError);
            } else {
              console.log("✅ تم إنشاء سجل في users:", usersData?.id);

              // Retry inserting profile
              const { data: retryProfileData, error: retryProfileError } =
                await supabase
                  .from("user_profiles")
                  .insert([userProfile])
                  .select()
                  .single();

              if (!retryProfileError) {
                console.log(
                  "✅ تم إنشاء ملف المستخدم بعد إصلاح FK:",
                  retryProfileData,
                );
                return retryProfileData;
              }

              console.warn(
                "⚠️ إعادة محاولة إنشاء الملف فشلت:",
                retryProfileError,
              );
            }
          } catch (usersInsertCatch) {
            console.warn("⚠️ خطأ أثناء محاولة إصلاح FK:", usersInsertCatch);
          }
        }

        // If FK fix didn't apply or not applicable, attempt cleanup
        if (createdUserId) {
          try {
            await supabase.auth.admin.deleteUser(createdUserId);
            console.log("🗑️ تم حذف حساب المصادقة بعد فشل إنشاء الملف");
          } catch (deleteError) {
            console.warn(
              "⚠️ لا يمكن حذف حساب المصادقة:",
              deleteError?.message || deleteError,
            );
          }
        } else {
          console.warn("⚠️ معطيات المستخدم غير كاملة، تم تجاهل محاولة الحذف");
        }

        const errMsg =
          profileError?.message ||
          JSON.stringify(profileError) ||
          "خطأ غير معروف";
        throw new Error("فشل في إنشاء ملف المستخدم: " + errMsg);
      }

      console.log("✅ تم إنشاء المستخدم بنجاح:", profileData);
      return profileData;
    } catch (error) {
      console.error("❌ Create user error:", error);
      throw error;
    }
  },

  // Get all users (admin only)
  getAllUsers: async () => {
    try {
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

  // Update user status (admin only)
  updateUserStatus: async (userId, isActive) => {
    try {
      const currentRole = localStorage.getItem("userRole");
      if (currentRole !== "admin") {
        throw new Error("غير مصرح - للمدير فقط");
      }

      // Admin cannot disable themselves
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

  // Update user role (admin only)
  updateUserRole: async (userId, newRole) => {
    try {
      const currentRole = localStorage.getItem("userRole");
      if (currentRole !== "admin") {
        throw new Error("غير مصرح - للمدير فقط");
      }

      // Admin cannot change their own role
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

  // Delete user (admin only)
  deleteUser: async (userId) => {
    try {
      const currentRole = authService.getCurrentRole();
      if (currentRole !== "admin") {
        throw new Error("غير مصرح - للمدير فقط");
      }

      // Cannot delete self
      const currentUserId = localStorage.getItem("userId");
      if (currentUserId === userId) {
        throw new Error("لا يمكنك حذف حسابك الخاص");
      }

      // Check if user to delete is the last active admin
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

      // Delete from user_profiles first
      const { error: profileError } = await supabase
        .from("user_profiles")
        .delete()
        .eq("id", userId);

      if (profileError) {
        throw new Error("فشل في حذف ملف المستخدم: " + profileError.message);
      }

      // Try to delete from auth
      try {
        const { error: authError } =
          await supabase.auth.admin.deleteUser(userId);
        if (authError) {
          console.warn("⚠️ لا يمكن حذف حساب المصادقة:", authError.message);
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
};

export default adminService;
