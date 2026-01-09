import { cookies } from "next/headers";
import { getValidatedSession } from "./serverAuth";

export interface AuthUser {
  id: string;
  email: string;
}

/**
 * Get the current user session from Supabase Auth cookie, validating it
 * against Supabase to prevent forged/expired tokens.
 */
export async function getSession(): Promise<AuthUser | null> {
  try {
    const session = await getValidatedSession();
    if (!session) {
      return null;
    }

    return {
      id: session.user.id,
      email: session.user.email || "",
    };
  } catch (error) {
    console.error("[getSession] Error:", error);
    return null;
  }
}

/**
 * Clear all auth cookies on logout
 */
export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("sb-access-token");
  cookieStore.delete("sb-refresh-token");
}
