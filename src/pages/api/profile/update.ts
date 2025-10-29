import type { APIRoute } from "astro";
import { createServerSupabaseClient } from "../../../lib/supabase";
import { Filter } from "bad-words";

const filter = new Filter();
const USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,20}$/;
const RESERVED = ["admin", "mod", "gevy", "support", "api", "root"];

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const supabase = createServerSupabaseClient(cookies);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return new Response("Unauthorized", { status: 401 });

  const formData = await request.formData();
  const username = formData.get("username")?.toString().trim();
  const display_name = formData.get("display_name")?.toString().trim();
  const bio = formData.get("bio")?.toString().trim();

  // Get current profile to build redirect URL
  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  const redirectTo = `/profile/${username || currentProfile?.username}`;

  // Validate username if changed
  if (username && username !== currentProfile?.username) {
    if (!USERNAME_REGEX.test(username)) {
      return redirect(`${redirectTo}?error=invalid_format`);
    }

    if (RESERVED.includes(username.toLowerCase())) {
      return redirect(`${redirectTo}?error=reserved`);
    }

    if (filter.isProfane(username)) {
      return redirect(`${redirectTo}?error=inappropriate`);
    }

    // Check uniqueness
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .neq("id", user.id)
      .single();

    if (existing) {
      return redirect(`${redirectTo}?error=taken`);
    }
  }

  // Validate display name for profanity
  if (display_name && filter.isProfane(display_name)) {
    return redirect(`${redirectTo}?error=inappropriate_display_name`);
  }

  // Validate bio for profanity
  if (bio && filter.isProfane(bio)) {
    return redirect(`${redirectTo}?error=inappropriate_bio`);
  }

  // Update profile
  const updates: any = {};
  if (username) updates.username = username;
  if (display_name !== undefined) updates.display_name = display_name || null;
  if (bio !== undefined) updates.bio = bio || null;

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id);

  if (error) {
    console.error("Profile update error:", error);
    return redirect(`${redirectTo}?error=failed`);
  }

  return redirect(
    `/profile/${username || currentProfile?.username}?success=updated`,
  );
};
