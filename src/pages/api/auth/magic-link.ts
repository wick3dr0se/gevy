import type { APIRoute } from "astro";
import { createServerSupabaseClient } from "../../../lib/supabase";

export const POST: APIRoute = async ({ request, cookies, url }) => {
  const supabase = createServerSupabaseClient(cookies);
  const body = await request.formData();
  const email = body.get("email")?.toString();

  if (!email) {
    return new Response("Email required", { status: 400 });
  }

  const redirectTo = `${url.origin}/api/auth/callback`;

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectTo,
      shouldCreateUser: true,
    },
  });

  if (error) {
    console.error("Magic link error:", error);
    return new Response(error.message, { status: 400 });
  }

  return new Response("Magic link sent! Check your email.", { status: 200 });
};
