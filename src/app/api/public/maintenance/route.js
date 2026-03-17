import { createLazySupabaseClient } from "@/app/_services/supabaseClient";

export const dynamic = "force-dynamic";

const supabaseAdmin = createLazySupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } },
);

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("settings")
      .select("app")
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }

    const maintenanceMode = data?.app?.maintenanceMode === true;
    return new Response(JSON.stringify({ maintenanceMode }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
