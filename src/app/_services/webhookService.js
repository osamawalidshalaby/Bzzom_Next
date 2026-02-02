// app/_services/webhookService.js

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

export async function callPaymobWebhook(params = {}) {
  try {
    // تحويل params إلى query string
    const queryString = new URLSearchParams(params).toString();
    const url = `${SUPABASE_URL}/functions/v1/paymob-webhook?${queryString}`;

    const response = await fetch(url, {
      method: "GET", // أو POST إذا أحببت
      headers: {
        "Content-Type": "application/json",
        // Authorization غير مطلوب للـ webhook لأنه يستخدم SERVICE_ROLE_KEY داخليًا
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Webhook response:", data);
    return data;
  } catch (error) {
    console.error("Failed to call Paymob webhook:", error);
    throw error;
  }
}
