import { cookies } from "next/headers";
import { createClient, type User } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Admin client lives only on the server; used to validate tokens securely.
const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey || supabaseAnonKey
);

export interface AuthContext {
  user: User;
  token: string;
}

export async function getAuthTokenFromCookies(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("sb-access-token")?.value || null;
}

/**
 * Validate the Supabase access token against Supabase Auth.
 * Returns the user and token if valid; otherwise null.
 */
export async function getValidatedSession(): Promise<AuthContext | null> {
  const token = await getAuthTokenFromCookies();
  if (!token) return null;

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) {
    return null;
  }

  return { user: data.user, token };
}

/**
 * Creates a Supabase client scoped to the current user (or anon if no token).
 */
export function createUserSupabaseClient(token?: string) {
  const accessToken = token || null;
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: accessToken
      ? { headers: { Authorization: `Bearer ${accessToken}` } }
      : {},
  });
}
