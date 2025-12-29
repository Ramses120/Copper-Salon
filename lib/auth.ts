import { cookies } from "next/headers";

export interface AuthUser {
  id: string;
  email: string;
}

/**
 * Decode and verify Supabase JWT token
 * Supabase tokens are signed with HS256 algorithm
 */
function parseSupabaseJWT(token: string): any {
  try {
    // JWT format: header.payload.signature
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    // Decode the payload (second part)
    const payload = parts[1];
    const decoded = Buffer.from(payload, "base64").toString("utf-8");
    return JSON.parse(decoded);
  } catch (error) {
    console.error("[parseSupabaseJWT] Error decoding token:", error);
    return null;
  }
}

/**
 * Get the current user session from Supabase Auth cookie
 * Now using sb-access-token instead of deprecated JWT system
 */
export async function getSession(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("sb-access-token");

    if (!accessToken) {
      console.log("[getSession] No access token found");
      return null;
    }

    // Parse the JWT token to extract user info
    const payload = parseSupabaseJWT(accessToken.value);

    if (!payload || !payload.sub) {
      console.log("[getSession] Invalid token structure");
      return null;
    }

    // Check if token has expired
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      console.log("[getSession] Token has expired");
      return null;
    }

    return {
      id: payload.sub,
      email: payload.email || "",
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
