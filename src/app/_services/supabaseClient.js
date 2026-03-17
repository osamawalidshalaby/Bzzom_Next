import { createClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase client with lazy initialization.
 * This ensures errors only occur at runtime if env vars are missing,
 * not during build time.
 */
function createLazySupabaseClient(url, key, options = {}) {
  let client = null;

  return new Proxy(
    {},
    {
      get(target, prop) {
        if (!client) {
          if (!url || !key) {
            throw new Error(
              "Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY",
            );
          }

          client = createClient(url, key, options);
        }

        return client[prop];
      },
    },
  );
}

export { createLazySupabaseClient };
