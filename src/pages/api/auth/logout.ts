import type { APIRoute } from "astro";
import { createServerSupabaseClient } from "../../../lib/supabase";

const handler: APIRoute = async ({ cookies, redirect }) => {
  const supabase = createServerSupabaseClient(cookies);

  // Wait for signOut to complete
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Logout error:", error);
  }

  // Force clear all auth cookies
  const projectRef = import.meta.env.PUBLIC_SUPABASE_URL?.match(
    /https:\/\/(.+?)\.supabase\.co/,
  )?.[1];

  if (projectRef) {
    cookies.delete(`sb-${projectRef}-auth-token`, { path: "/" });
    cookies.delete(`sb-${projectRef}-auth-token.0`, { path: "/" });
    cookies.delete(`sb-${projectRef}-auth-token.1`, { path: "/" });
  }

  // Also delete generic cookie names
  cookies.delete("sb-access-token", { path: "/" });
  cookies.delete("sb-refresh-token", { path: "/" });

  return redirect("/?logout=true");
};

export const GET = handler;
export const POST = handler;
