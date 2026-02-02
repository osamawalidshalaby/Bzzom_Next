

// // ملف: app/_services/customerApi.js
// import { supabase } from "./supabase";

// const CUSTOMER_STORAGE_KEY = "bazzom_customer";

// export const customerApi = {
//   // ===== تسجيل الدخول بحساب جوجل =====
//   signInWithGoogle: async () => {
//     try {
//       console.log("👤 تسجيل دخول بحساب جوجل...");

//       const { data, error } = await supabase.auth.signInWithOAuth({
//         provider: "google",
//         options: {
//           redirectTo: `${window.location.origin}/auth/callback`,
//         },
//       });

//       if (error) throw error;
//       return data;
//     } catch (error) {
//       console.error("❌ Google sign in error:", error);
//       throw new Error("فشل تسجيل الدخول بحساب جوجل");
//     }
//   },

//   signOut: async () => {
//     try {
//       const { error } = await supabase.auth.signOut();
//       if (error) throw error;

//       localStorage.removeItem(CUSTOMER_STORAGE_KEY);
//       localStorage.removeItem("customerAuthenticated");
//       localStorage.removeItem("customerId");
//       localStorage.removeItem("lastOrderInfo");

//       return true;
//     } catch (error) {
//       console.error("❌ Customer sign out error:", error);
//       throw error;
//     }
//   },

//   // ===== الحصول على بيانات العميل الحالي =====
//   getCurrentCustomer: async () => {
//     try {
//       // التحقق من الجلسة النشطة
//       const {
//         data: { session },
//         error: sessionError,
//       } = await supabase.auth.getSession();

//       if (sessionError || !session) {
//         console.log("⚠️ No active session found");
//         return null;
//       }

//       const user = session.user;

//       // التأكد من وجود العميل في جدول customers
//       let { data: customer, error: customerError } = await supabase
//         .from("customers")
//         .select("*")
//         .eq("id", user.id)
//         .maybeSingle();

//       // إذا لم يكن موجود، أنشئه
//       if (!customer) {
//         console.log("🔄 Creating customer for:", user.email);

//         const { data: newCustomer, error: createError } = await supabase
//           .from("customers")
//           .insert({
//             id: user.id,
//             email: user.email,
//             name:
//               user.user_metadata?.full_name ||
//               user.user_metadata?.name ||
//               user.email.split("@")[0],
//             phone: "",
//             addresses: [],
//             favorite_dishes: [],
//             is_active: true,
//             email_verified: true,
//             created_at: new Date().toISOString(),
//             updated_at: new Date().toISOString(),
//           })
//           .select()
//           .single();

//         if (createError) {
//           console.error("❌ Error creating customer:", createError);
//           throw createError;
//         }

//         customer = newCustomer;
//       }

//       const customerData = {
//         id: customer.id,
//         email: customer.email,
//         name: customer.name,
//         phone: customer.phone || "",
//         addresses: customer.addresses || [],
//         created_at: customer.created_at,
//         updated_at: customer.updated_at,
//       };

//       // حفظ في localStorage
//       localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customerData));
//       localStorage.setItem("customerAuthenticated", "true");
//       localStorage.setItem("customerId", customer.id);

//       return customerData;
//     } catch (error) {
//       console.error("❌ Get current customer error:", error);
//       return null;
//     }
//   },

//   // ===== تحديث الملف الشخصي - تم الإصلاح =====
//   updateProfile: async (updates) => {
//     try {
//       const customerId = localStorage.getItem("customerId");
//       if (!customerId) throw new Error("العميل غير مسجل الدخول");

//       const { data, error } = await supabase
//         .from("customers")
//         .update({
//           name: updates.name || "",
//           phone: updates.phone || "",
//           updated_at: new Date().toISOString(),
//         })
//         .eq("id", customerId)
//         .select()
//         .single();

//       if (error) throw error;

//       // تحديث localStorage بشكل كامل
//       const currentData = JSON.parse(
//         localStorage.getItem(CUSTOMER_STORAGE_KEY) || "{}"
//       );
//       const updatedData = {
//         ...currentData,
//         name: updates.name || currentData.name,
//         phone: updates.phone || currentData.phone,
//       };
      
//       localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(updatedData));

//       return data;
//     } catch (error) {
//       console.error("❌ Update profile error:", error);
//       throw error;
//     }
//   },

//   // ===== إدارة العناوين =====
//   addAddress: async (addressData) => {
//     try {
//       const customerId = localStorage.getItem("customerId");
//       if (!customerId) throw new Error("العميل غير مسجل الدخول");

//       // الحصول على العناوين الحالية
//       const { data: customer } = await supabase
//         .from("customers")
//         .select("addresses")
//         .eq("id", customerId)
//         .single();

//       const addresses = customer?.addresses || [];
//       const newAddress = {
//         id: Date.now().toString(),
//         ...addressData,
//         createdAt: new Date().toISOString(),
//       };

//       addresses.push(newAddress);

//       const { error } = await supabase
//         .from("customers")
//         .update({
//           addresses,
//           updated_at: new Date().toISOString(),
//         })
//         .eq("id", customerId);

//       if (error) throw error;

//       // تحديث localStorage
//       const current = JSON.parse(
//         localStorage.getItem(CUSTOMER_STORAGE_KEY) || "{}"
//       );
//       localStorage.setItem(
//         CUSTOMER_STORAGE_KEY,
//         JSON.stringify({
//           ...current,
//           addresses,
//         })
//       );

//       return newAddress;
//     } catch (error) {
//       console.error("❌ Add address error:", error);
//       throw error;
//     }
//   },

//   updateAddress: async (addressId, updates) => {
//     try {
//       const customerId = localStorage.getItem("customerId");
//       if (!customerId) throw new Error("العميل غير مسجل الدخول");

//       const { data: customer } = await supabase
//         .from("customers")
//         .select("addresses")
//         .eq("id", customerId)
//         .single();

//       let addresses = customer?.addresses || [];
//       addresses = addresses.map((addr) =>
//         addr.id === addressId ? { ...addr, ...updates } : addr
//       );

//       const { error } = await supabase
//         .from("customers")
//         .update({
//           addresses,
//           updated_at: new Date().toISOString(),
//         })
//         .eq("id", customerId);

//       if (error) throw error;

//       // تحديث localStorage
//       const current = JSON.parse(
//         localStorage.getItem(CUSTOMER_STORAGE_KEY) || "{}"
//       );
//       localStorage.setItem(
//         CUSTOMER_STORAGE_KEY,
//         JSON.stringify({
//           ...current,
//           addresses,
//         })
//       );

//       return true;
//     } catch (error) {
//       console.error("❌ Update address error:", error);
//       throw error;
//     }
//   },

//   deleteAddress: async (addressId) => {
//     try {
//       const customerId = localStorage.getItem("customerId");
//       if (!customerId) throw new Error("العميل غير مسجل الدخول");

//       const { data: customer } = await supabase
//         .from("customers")
//         .select("addresses")
//         .eq("id", customerId)
//         .single();

//       let addresses = customer?.addresses || [];
//       addresses = addresses.filter((addr) => addr.id !== addressId);

//       const { error } = await supabase
//         .from("customers")
//         .update({
//           addresses,
//           updated_at: new Date().toISOString(),
//         })
//         .eq("id", customerId);

//       if (error) throw error;

//       // تحديث localStorage
//       const current = JSON.parse(
//         localStorage.getItem(CUSTOMER_STORAGE_KEY) || "{}"
//       );
//       localStorage.setItem(
//         CUSTOMER_STORAGE_KEY,
//         JSON.stringify({
//           ...current,
//           addresses,
//         })
//       );

//       return true;
//     } catch (error) {
//       console.error("❌ Delete address error:", error);
//       throw error;
//     }
//   },

//   upsertAddress: async (addressData) => {
//     try {
//       const customerId = localStorage.getItem("customerId");
//       if (!customerId) throw new Error("العميل غير مسجل الدخول");

//       const { data: customer } = await supabase
//         .from("customers")
//         .select("addresses")
//         .eq("id", customerId)
//         .single();

//       let addresses = customer?.addresses || [];

//       // إذا كان العنوان يحتوي على id، فهو تحديث، وإلا فهو إضافة جديدة
//       if (addressData.id) {
//         addresses = addresses.map((addr) =>
//           addr.id === addressData.id ? { ...addr, ...addressData } : addr
//         );
//       } else {
//         const newAddress = {
//           id: Date.now().toString(),
//           ...addressData,
//           createdAt: new Date().toISOString(),
//           isDefault: addresses.length === 0, // أول عنوان يصبح افتراضي
//         };
//         addresses.push(newAddress);
//       }

//       const { error } = await supabase
//         .from("customers")
//         .update({
//           addresses,
//           updated_at: new Date().toISOString(),
//         })
//         .eq("id", customerId);

//       if (error) throw error;

//       // تحديث localStorage
//       const current = JSON.parse(
//         localStorage.getItem(CUSTOMER_STORAGE_KEY) || "{}"
//       );
//       localStorage.setItem(
//         CUSTOMER_STORAGE_KEY,
//         JSON.stringify({
//           ...current,
//           addresses,
//         })
//       );

//       return addresses.find((addr) => addr.isDefault) || addresses[0];
//     } catch (error) {
//       console.error("❌ Upsert address error:", error);
//       throw error;
//     }
//   },

//   setDefaultAddress: async (addressId) => {
//     try {
//       const customerId = localStorage.getItem("customerId");
//       if (!customerId) throw new Error("العميل غير مسجل الدخول");

//       const { data: customer } = await supabase
//         .from("customers")
//         .select("addresses")
//         .eq("id", customerId)
//         .single();

//       let addresses = customer?.addresses || [];

//       // تحديث جميع العناوين: إلغاء التحديد الافتراضي من الكل، ثم تعيين العنوان المطلوب
//       addresses = addresses.map((addr) => ({
//         ...addr,
//         isDefault: addr.id === addressId,
//       }));

//       const { error } = await supabase
//         .from("customers")
//         .update({
//           addresses,
//           updated_at: new Date().toISOString(),
//         })
//         .eq("id", customerId);

//       if (error) throw error;

//       // تحديث localStorage
//       const current = JSON.parse(
//         localStorage.getItem(CUSTOMER_STORAGE_KEY) || "{}"
//       );
//       localStorage.setItem(
//         CUSTOMER_STORAGE_KEY,
//         JSON.stringify({
//           ...current,
//           addresses,
//         })
//       );

//       return true;
//     } catch (error) {
//       console.error("❌ Set default address error:", error);
//       throw error;
//     }
//   },

//   // ===== الحصول على طلبات العميل =====
//   getCustomerOrders: async () => {
//     try {
//       const customerId = localStorage.getItem("customerId");
//       if (!customerId) throw new Error("العميل غير مسجل الدخول");

//       const { data, error } = await supabase
//         .from("orders")
//         .select("*")
//         .eq("customer_id", customerId)
//         .order("created_at", { ascending: false });

//       if (error) throw error;
//       return data || [];
//     } catch (error) {
//       console.error("❌ Get customer orders error:", error);
//       throw error;
//     }
//   },

//   // ===== إدارة بيانات الطلب المحفوظة =====
//   getLastOrderInfo: () => {
//     try {
//       return JSON.parse(localStorage.getItem("lastOrderInfo") || "{}");
//     } catch {
//       return {};
//     }
//   },

//   saveLastOrderInfo: (orderInfo) => {
//     try {
//       localStorage.setItem("lastOrderInfo", JSON.stringify(orderInfo));
//       return true;
//     } catch {
//       return false;
//     }
//   },

//   // ===== وظائف مساعدة =====
//   isAuthenticated: () => {
//     return localStorage.getItem("customerAuthenticated") === "true";
//   },

//   getCustomerId: () => {
//     return localStorage.getItem("customerId") || "";
//   },

//   getCustomerName: () => {
//     try {
//       const customer = JSON.parse(
//         localStorage.getItem(CUSTOMER_STORAGE_KEY) || "{}"
//       );
//       return customer.name || "";
//     } catch {
//       return "";
//     }
//   },

//   getCustomerEmail: () => {
//     try {
//       const customer = JSON.parse(
//         localStorage.getItem(CUSTOMER_STORAGE_KEY) || "{}"
//       );
//       return customer.email || "";
//     } catch {
//       return "";
//     }
//   },

//   getCustomerPhone: () => {
//     try {
//       const customer = JSON.parse(
//         localStorage.getItem(CUSTOMER_STORAGE_KEY) || "{}"
//       );
//       return customer.phone || "";
//     } catch {
//       return "";
//     }
//   },

//   getCustomerAddresses: () => {
//     try {
//       const customer = JSON.parse(
//         localStorage.getItem(CUSTOMER_STORAGE_KEY) || "{}"
//       );
//       return customer.addresses || [];
//     } catch {
//       return [];
//     }
//   },

//   getDefaultAddress: () => {
//     try {
//       const addresses = customerApi.getCustomerAddresses();
//       return addresses.find((addr) => addr.isDefault) || addresses[0] || null;
//     } catch {
//       return null;
//     }
//   },

//   ensureCustomerExists: async () => {
//     try {
//       const customerId = localStorage.getItem("customerId");
//       if (!customerId) return null;

//       const { data: customer, error } = await supabase
//         .from("customers")
//         .select("id")
//         .eq("id", customerId)
//         .maybeSingle();

//       if (error) throw error;
//       return !!customer;
//     } catch (error) {
//       console.error("❌ Ensure customer exists error:", error);
//       return false;
//     }
//   },
// };


// ملف: app/_services/customerApi.js
import { supabase } from "./supabase";

const CUSTOMER_STORAGE_KEY = "bazzom_customer";

export const customerApi = {
  isCustomerOnly: () => {
    try {
      // التحقق من أن المستخدم عميل وليس موظفاً
      const isCustomer = customerApi.isAuthenticated();
      if (!isCustomer) return false;

      // التحقق من أن ليس لديه صلاحيات موظف
      const adminAuth = localStorage.getItem("adminAuthenticated");
      const userRole = localStorage.getItem("userRole");

      const isEmployee =
        !!adminAuth && ["admin", "cashier", "chief"].includes(userRole);

      // إذا كان موظفاً، فهو ليس عميلاً فقط
      return !isEmployee;
    } catch (error) {
      return false;
    }
  },
  // ===== تسجيل الدخول بحساب جوجل =====
  signInWithGoogle: async () => {
    try {
      console.log("👤 تسجيل دخول بحساب جوجل...");

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("❌ Google sign in error:", error);
      throw new Error("فشل تسجيل الدخول بحساب جوجل");
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      localStorage.removeItem(CUSTOMER_STORAGE_KEY);
      localStorage.removeItem("customerAuthenticated");
      localStorage.removeItem("customerId");
      localStorage.removeItem("lastOrderInfo");

      return true;
    } catch (error) {
      console.error("❌ Customer sign out error:", error);
      throw error;
    }
  },

  // ===== الحصول على بيانات العميل الحالي =====
  getCurrentCustomer: async () => {
    try {
      // التحقق من الجلسة النشطة
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        console.log("⚠️ No active session found");
        return null;
      }

      const user = session.user;

      // التأكد من وجود العميل في جدول customers
      let { data: customer, error: customerError } = await supabase
        .from("customers")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      // إذا لم يكن موجود، أنشئه
      if (!customer) {
        console.log("🔄 Creating customer for:", user.email);

        const { data: newCustomer, error: createError } = await supabase
          .from("customers")
          .insert({
            id: user.id,
            email: user.email,
            name:
              user.user_metadata?.full_name ||
              user.user_metadata?.name ||
              user.email.split("@")[0],
            phone: "",
            addresses: [],
            favorite_dishes: [],
            is_active: true,
            email_verified: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (createError) {
          console.error("❌ Error creating customer:", createError);
          throw createError;
        }

        customer = newCustomer;
      }

      const customerData = {
        id: customer.id,
        email: customer.email,
        name: customer.name,
        phone: customer.phone || "",
        addresses: customer.addresses || [],
        created_at: customer.created_at,
        updated_at: customer.updated_at,
      };

      // حفظ في localStorage
      localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customerData));
      localStorage.setItem("customerAuthenticated", "true");
      localStorage.setItem("customerId", customer.id);

      return customerData;
    } catch (error) {
      console.error("❌ Get current customer error:", error);
      return null;
    }
  },

  // ===== تحديث الملف الشخصي - تم الإصلاح =====
  updateProfile: async (updates) => {
    try {
      const customerId = localStorage.getItem("customerId");
      if (!customerId) throw new Error("العميل غير مسجل الدخول");

      const { data, error } = await supabase
        .from("customers")
        .update({
          name: updates.name || "",
          phone: updates.phone || "",
          updated_at: new Date().toISOString(),
        })
        .eq("id", customerId)
        .select()
        .single();

      if (error) throw error;

      // تحديث localStorage بشكل كامل
      const currentData = JSON.parse(
        localStorage.getItem(CUSTOMER_STORAGE_KEY) || "{}"
      );
      const updatedData = {
        ...currentData,
        name: updates.name || currentData.name,
        phone: updates.phone || currentData.phone,
      };

      localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(updatedData));

      return data;
    } catch (error) {
      console.error("❌ Update profile error:", error);
      throw error;
    }
  },

  // ===== إدارة العناوين =====
  addAddress: async (addressData) => {
    try {
      const customerId = localStorage.getItem("customerId");
      if (!customerId) throw new Error("العميل غير مسجل الدخول");

      // الحصول على العناوين الحالية
      const { data: customer } = await supabase
        .from("customers")
        .select("addresses")
        .eq("id", customerId)
        .single();

      const addresses = customer?.addresses || [];
      const newAddress = {
        id: Date.now().toString(),
        ...addressData,
        createdAt: new Date().toISOString(),
      };

      addresses.push(newAddress);

      const { error } = await supabase
        .from("customers")
        .update({
          addresses,
          updated_at: new Date().toISOString(),
        })
        .eq("id", customerId);

      if (error) throw error;

      // تحديث localStorage
      const current = JSON.parse(
        localStorage.getItem(CUSTOMER_STORAGE_KEY) || "{}"
      );
      localStorage.setItem(
        CUSTOMER_STORAGE_KEY,
        JSON.stringify({
          ...current,
          addresses,
        })
      );

      return newAddress;
    } catch (error) {
      console.error("❌ Add address error:", error);
      throw error;
    }
  },

  updateAddress: async (addressId, updates) => {
    try {
      const customerId = localStorage.getItem("customerId");
      if (!customerId) throw new Error("العميل غير مسجل الدخول");

      const { data: customer } = await supabase
        .from("customers")
        .select("addresses")
        .eq("id", customerId)
        .single();

      let addresses = customer?.addresses || [];
      addresses = addresses.map((addr) =>
        addr.id === addressId ? { ...addr, ...updates } : addr
      );

      const { error } = await supabase
        .from("customers")
        .update({
          addresses,
          updated_at: new Date().toISOString(),
        })
        .eq("id", customerId);

      if (error) throw error;

      // تحديث localStorage
      const current = JSON.parse(
        localStorage.getItem(CUSTOMER_STORAGE_KEY) || "{}"
      );
      localStorage.setItem(
        CUSTOMER_STORAGE_KEY,
        JSON.stringify({
          ...current,
          addresses,
        })
      );

      return true;
    } catch (error) {
      console.error("❌ Update address error:", error);
      throw error;
    }
  },

  deleteAddress: async (addressId) => {
    try {
      const customerId = localStorage.getItem("customerId");
      if (!customerId) throw new Error("العميل غير مسجل الدخول");

      const { data: customer } = await supabase
        .from("customers")
        .select("addresses")
        .eq("id", customerId)
        .single();

      let addresses = customer?.addresses || [];
      addresses = addresses.filter((addr) => addr.id !== addressId);

      const { error } = await supabase
        .from("customers")
        .update({
          addresses,
          updated_at: new Date().toISOString(),
        })
        .eq("id", customerId);

      if (error) throw error;

      // تحديث localStorage
      const current = JSON.parse(
        localStorage.getItem(CUSTOMER_STORAGE_KEY) || "{}"
      );
      localStorage.setItem(
        CUSTOMER_STORAGE_KEY,
        JSON.stringify({
          ...current,
          addresses,
        })
      );

      return true;
    } catch (error) {
      console.error("❌ Delete address error:", error);
      throw error;
    }
  },

  upsertAddress: async (addressData) => {
    try {
      const customerId = localStorage.getItem("customerId");
      if (!customerId) throw new Error("العميل غير مسجل الدخول");

      const { data: customer } = await supabase
        .from("customers")
        .select("addresses")
        .eq("id", customerId)
        .single();

      let addresses = customer?.addresses || [];

      // إذا كان العنوان يحتوي على id، فهو تحديث، وإلا فهو إضافة جديدة
      if (addressData.id) {
        addresses = addresses.map((addr) =>
          addr.id === addressData.id ? { ...addr, ...addressData } : addr
        );
      } else {
        const newAddress = {
          id: Date.now().toString(),
          ...addressData,
          createdAt: new Date().toISOString(),
          isDefault: addresses.length === 0, // أول عنوان يصبح افتراضي
        };
        addresses.push(newAddress);
      }

      const { error } = await supabase
        .from("customers")
        .update({
          addresses,
          updated_at: new Date().toISOString(),
        })
        .eq("id", customerId);

      if (error) throw error;

      // تحديث localStorage
      const current = JSON.parse(
        localStorage.getItem(CUSTOMER_STORAGE_KEY) || "{}"
      );
      localStorage.setItem(
        CUSTOMER_STORAGE_KEY,
        JSON.stringify({
          ...current,
          addresses,
        })
      );

      return addresses.find((addr) => addr.isDefault) || addresses[0];
    } catch (error) {
      console.error("❌ Upsert address error:", error);
      throw error;
    }
  },

  setDefaultAddress: async (addressId) => {
    try {
      const customerId = localStorage.getItem("customerId");
      if (!customerId) throw new Error("العميل غير مسجل الدخول");

      const { data: customer } = await supabase
        .from("customers")
        .select("addresses")
        .eq("id", customerId)
        .single();

      let addresses = customer?.addresses || [];

      // تحديث جميع العناوين: إلغاء التحديد الافتراضي من الكل، ثم تعيين العنوان المطلوب
      addresses = addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === addressId,
      }));

      const { error } = await supabase
        .from("customers")
        .update({
          addresses,
          updated_at: new Date().toISOString(),
        })
        .eq("id", customerId);

      if (error) throw error;

      // تحديث localStorage
      const current = JSON.parse(
        localStorage.getItem(CUSTOMER_STORAGE_KEY) || "{}"
      );
      localStorage.setItem(
        CUSTOMER_STORAGE_KEY,
        JSON.stringify({
          ...current,
          addresses,
        })
      );

      return true;
    } catch (error) {
      console.error("❌ Set default address error:", error);
      throw error;
    }
  },

  // ===== الحصول على طلبات العميل =====
  getCustomerOrders: async () => {
    try {
      const customerId = localStorage.getItem("customerId");
      if (!customerId) throw new Error("العميل غير مسجل الدخول");

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("customer_id", customerId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("❌ Get customer orders error:", error);
      throw error;
    }
  },

  // ===== إدارة بيانات الطلب المحفوظة =====
  getLastOrderInfo: () => {
    try {
      return JSON.parse(localStorage.getItem("lastOrderInfo") || "{}");
    } catch {
      return {};
    }
  },

  saveLastOrderInfo: (orderInfo) => {
    try {
      localStorage.setItem("lastOrderInfo", JSON.stringify(orderInfo));
      return true;
    } catch {
      return false;
    }
  },

  // ===== وظائف مساعدة =====
  isAuthenticated: () => {
    return localStorage.getItem("customerAuthenticated") === "true";
  },

  getCustomerId: () => {
    return localStorage.getItem("customerId") || "";
  },

  // دالة جديدة: الحصول على توكن المصادقة
  getToken: async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log("Session data:", session ? "Session exists" : "No session");
      return session?.access_token || null;
    } catch (error) {
      console.error("❌ Get token error:", error);

      // محاولة الحصول من localStorage
      try {
        const authData = localStorage.getItem("supabase.auth.token");
        if (authData) {
          const parsed = JSON.parse(authData);
          console.log(
            "Token from localStorage:",
            parsed?.currentSession?.access_token ? "Exists" : "Not found"
          );
          return parsed?.currentSession?.access_token || null;
        }
      } catch (e) {
        console.error("Error parsing localStorage token:", e);
      }

      return null;
    }
  },

  isValidToken: async () => {
    try {
      const token = await customerApi.getToken();
      if (!token) return false;

      // التحقق من الصلاحية مع Supabase
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser(token);
      return !error && !!user;
    } catch (error) {
      console.error("Token validation error:", error);
      return false;
    }
  },

  // دالة جديدة: إعادة المصادقة إذا انتهت الجلسة
  refreshSessionIfNeeded: async () => {
    try {
      const isValid = await customerApi.isValidToken();
      if (!isValid) {
        console.log("Session expired, attempting to refresh...");
        const { data, error } = await supabase.auth.refreshSession();
        if (error) throw error;
        return data.session?.access_token;
      }
      return await customerApi.getToken();
    } catch (error) {
      console.error("Session refresh error:", error);
      return null;
    }
  },

  getCustomerName: () => {
    try {
      const customer = JSON.parse(
        localStorage.getItem(CUSTOMER_STORAGE_KEY) || "{}"
      );
      return customer.name || "";
    } catch {
      return "";
    }
  },

  getCustomerEmail: () => {
    try {
      const customer = JSON.parse(
        localStorage.getItem(CUSTOMER_STORAGE_KEY) || "{}"
      );
      return customer.email || "";
    } catch {
      return "";
    }
  },

  getCustomerPhone: () => {
    try {
      const customer = JSON.parse(
        localStorage.getItem(CUSTOMER_STORAGE_KEY) || "{}"
      );
      return customer.phone || "";
    } catch {
      return "";
    }
  },

  getCustomerAddresses: () => {
    try {
      const customer = JSON.parse(
        localStorage.getItem(CUSTOMER_STORAGE_KEY) || "{}"
      );
      return customer.addresses || [];
    } catch {
      return [];
    }
  },

  getDefaultAddress: () => {
    try {
      const addresses = customerApi.getCustomerAddresses();
      return addresses.find((addr) => addr.isDefault) || addresses[0] || null;
    } catch {
      return null;
    }
  },

  ensureCustomerExists: async () => {
    try {
      const customerId = localStorage.getItem("customerId");
      if (!customerId) return null;

      const { data: customer, error } = await supabase
        .from("customers")
        .select("id")
        .eq("id", customerId)
        .maybeSingle();

      if (error) throw error;
      return !!customer;
    } catch (error) {
      console.error("❌ Ensure customer exists error:", error);
      return false;
    }
  },
};