import type { APIRoute } from "astro";
import { createServerSupabaseClient } from "../../../../lib/supabase";

export const GET: APIRoute = async ({ params, cookies }) => {
  const supabase = createServerSupabaseClient(cookies);
  const { userId, type } = params;

  if (!userId || (type !== "followers" && type !== "following")) {
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    let query;

    if (type === "followers") {
      // Get users who follow this user
      query = supabase
        .from("follows")
        .select(
          `
          follower_id,
          profiles!follows_follower_id_fkey (
            id,
            username,
            display_name,
            avatar_url,
            github_username,
            github_avatar_url,
            bio
          )
        `,
        )
        .eq("following_id", userId);
    } else {
      // Get users this user follows
      query = supabase
        .from("follows")
        .select(
          `
          following_id,
          profiles!follows_following_id_fkey (
            id,
            username,
            display_name,
            avatar_url,
            github_username,
            github_avatar_url,
            bio
          )
        `,
        )
        .eq("follower_id", userId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching followers/following:", error);
      return new Response(JSON.stringify({ error: "Failed to fetch" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Extract profiles from the join
    const users =
      data
        ?.map((item) => (type === "followers" ? item.profiles : item.profiles))
        .filter(Boolean) || [];

    return new Response(JSON.stringify({ users }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
