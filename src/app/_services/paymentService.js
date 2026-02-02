// // app/_services/paymentService.js
// import { customerApi } from "./customerApi";

// class PaymentService {
//   constructor() {
//     this.baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
//     console.log("PaymentService baseUrl:", this.baseUrl);
//   }

//   async createPaymobPayment(orderId, amount, billingData) {
//     try {
//       console.log("Starting Paymob payment process...");
//       console.log("Order ID:", orderId);
//       console.log("Amount:", amount);
//       console.log("Billing Data:", billingData);

//       // 1. التحقق من تسجيل الدخول
//       const isAuth = customerApi.isAuthenticated();
//       if (!isAuth) {
//         throw new Error("يرجى تسجيل الدخول أولاً");
//       }

//       // 2. محاولة تحديث الجلسة إذا لزم الأمر
//       let token = await customerApi.getToken();

//       if (!token) {
//         throw new Error("انتهت جلسة العمل. يرجى تسجيل الدخول مرة أخرى");
//       }

//       console.log("Auth token obtained:", token ? "YES" : "NO");

//       // 3. إعداد بيانات الطلب
//       const requestBody = {
//         order_id: orderId,
//         amount: amount,
//         billing_data: billingData,
//         currency: "EGP",
//       };

//       console.log("Request body:", requestBody);

//       // 4. إرسال الطلب إلى Edge Function
//       const response = await fetch(
//         `${this.baseUrl}/functions/v1/paymob-create-payment`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//             Accept: "application/json",
//           },
//           body: JSON.stringify(requestBody),
//         }
//       );

//       console.log("Response status:", response.status, response.statusText);

//       // 5. معالجة الاستجابة
//       if (!response.ok) {
//         if (response.status === 401) {
//           throw new Error("انتهت جلسة العمل. يرجى تسجيل الدخول مرة أخرى");
//         }

//         let errorMessage = "فشل في إنشاء عملية الدفع";
//         try {
//           const errorData = await response.json();
//           console.error("Error response:", errorData);
//           errorMessage = errorData.error || errorMessage;
//         } catch {
//           errorMessage = `خطأ ${response.status}: ${response.statusText}`;
//         }
//         throw new Error(errorMessage);
//       }

//       // 6. معالجة الاستجابة الناجحة
//       const data = await response.json();
//       console.log("Payment created successfully:", data);

//       if (!data.success) {
//         throw new Error(data.error || "فشل في إنشاء عملية الدفع");
//       }

//       return data;
//     } catch (error) {
//       console.error("Payment creation error:", error);

//       // تحسين رسائل الخطأ للمستخدم
//       let userMessage = error.message;

//       if (error.message.includes("انتهت جلسة العمل")) {
//         userMessage = "انتهت جلسة العمل. يرجى تسجيل الدخول مرة أخرى";
//       } else if (
//         error.name === "TypeError" &&
//         error.message.includes("Failed to fetch")
//       ) {
//         userMessage =
//           "تعذر الاتصال بخادم الدفع. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.";
//       } else if (
//         error.message.includes("network") ||
//         error.message.includes("Network")
//       ) {
//         userMessage = "خطأ في الشبكة. يرجى التحقق من اتصال الإنترنت.";
//       }

//       throw new Error(userMessage);
//     }
//   }

//   redirectToPaymobIframe(paymentKey, iframeId) {
//     if (!paymentKey) {
//       throw new Error("مفتاح الدفع غير صالح");
//     }

//     const iframeIdToUse =
//       iframeId || process.env.NEXT_PUBLIC_PAYMOB_IFRAME_ID || "817045";
//     const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${iframeIdToUse}?payment_token=${paymentKey}`;

//     console.log("Redirecting to Paymob iframe:", iframeUrl);

//     // فتح في نافذة جديدة
//     window.open(iframeUrl, "_blank");

//     // أو إعادة التوجيه في نفس النافذة
//     // window.location.href = iframeUrl
//   }

//   // دالة مساعدة لاختبار الاتصال
//   // async testConnection() {
//   //   try {
//   //     const token = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // أو service role key لو تعديل
//   //     const response = await fetch(
//   //       `${this.baseUrl}/functions/v1/paymob-webhook`,
//   //       {
//   //         method: "GET",
//   //         headers: {
//   //           Authorization: `Bearer ${token}`,
//   //           apikey: token,
//   //           "Content-Type": "application/json",
//   //         },
//   //       }
//   //     );
//   //     return await response.json();
//   //   } catch (error) {
//   //     console.error("Connection test failed:", error);
//   //     throw error;
//   //   }
//   // }

//   async testConnection() {
//     try {
//       const token = await customerApi.refreshSessionIfNeeded();
//       if (!token) throw new Error("لا يوجد توكن صالح");

//       const response = await fetch(
//         `${this.baseUrl}/functions/v1/paymob-webhook`,
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       return await response.json();
//     } catch (error) {
//       console.error("Connection test failed:", error);
//       throw error;
//     }
//   }
// }

// export const paymentService = new PaymentService();


// app/_services/paymentService.js
import { customerApi } from "./customerApi";

class PaymentService {
  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    console.log("PaymentService baseUrl:", this.baseUrl);
  }

  /**
   * إنشاء دفعة Paymob مع دعم return_url
   * @param {string} orderId - رقم الطلب
   * @param {number} amount - المبلغ الإجمالي
   * @param {object} billingData - بيانات العميل (first_name, last_name, email, phone_number)
   * @param {string} returnUrl - رابط إعادة التوجيه بعد الدفع
   */
  async createPaymobPayment(orderId, amount, billingData, returnUrl) {
    try {
      console.log("Starting Paymob payment process...");
      console.log("Order ID:", orderId);
      console.log("Amount:", amount);
      console.log("Billing Data:", billingData);
      console.log("Return URL:", returnUrl);

      // 1. التحقق من تسجيل الدخول
      const isAuth = customerApi.isAuthenticated();
      if (!isAuth) throw new Error("يرجى تسجيل الدخول أولاً");

      // 2. الحصول على التوكن أو إعادة المصادقة
      let token = await customerApi.getToken();
      if (!token) {
        throw new Error("انتهت جلسة العمل. يرجى تسجيل الدخول مرة أخرى");
      }

      console.log("Auth token obtained:", token ? "YES" : "NO");

      // 3. إعداد البيانات لإرسالها للـ Edge Function
      const requestBody = {
        order_id: orderId,
        amount,
        billing_data: billingData,
        currency: "EGP",
        return_url: returnUrl // هنا بنمرر رابط إعادة التوجيه
      };

      console.log("Request body:", requestBody);

      // 4. إرسال الطلب إلى Edge Function
      const response = await fetch(
        `${this.baseUrl}/functions/v1/paymob-create-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      console.log("Response status:", response.status, response.statusText);

      // 5. معالجة الاستجابة
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("انتهت جلسة العمل. يرجى تسجيل الدخول مرة أخرى");
        }
        let errorMessage = "فشل في إنشاء عملية الدفع";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
          console.error("Error response:", errorData);
        } catch {}
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Payment created successfully:", data);

      if (!data.success) {
        throw new Error(data.error || "فشل في إنشاء عملية الدفع");
      }

      return data;
    } catch (error) {
      console.error("Payment creation error:", error);
      let userMessage = error.message;

      if (error.message.includes("انتهت جلسة العمل")) {
        userMessage = "انتهت جلسة العمل. يرجى تسجيل الدخول مرة أخرى";
      } else if (
        error.name === "TypeError" &&
        error.message.includes("Failed to fetch")
      ) {
        userMessage =
          "تعذر الاتصال بخادم الدفع. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.";
      } else if (
        error.message.includes("network") ||
        error.message.includes("Network")
      ) {
        userMessage = "خطأ في الشبكة. يرجى التحقق من اتصال الإنترنت.";
      }

      throw new Error(userMessage);
    }
  }

  redirectToPaymobIframe(paymentKey, iframeId) {
    if (!paymentKey) throw new Error("مفتاح الدفع غير صالح");

    const iframeIdToUse =
      iframeId || process.env.NEXT_PUBLIC_PAYMOB_IFRAME_ID || "817045";
    const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${iframeIdToUse}?payment_token=${paymentKey}`;

    console.log("Redirecting to Paymob iframe:", iframeUrl);
    window.open(iframeUrl, "_blank"); // فتح في نافذة جديدة
  }
}

export const paymentService = new PaymentService();
