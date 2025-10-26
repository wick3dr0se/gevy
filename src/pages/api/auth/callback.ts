import type { APIRoute } from "astro";
import { createServerSupabaseClient } from "../../../lib/supabase";

export const GET: APIRoute = async ({ cookies, redirect, url }) => {
  const supabase = createServerSupabaseClient(cookies);
  const code = url.searchParams.get("code");

  if (!code) return redirect("/?error=no_code");

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Session exchange error:", error);
    return redirect("/?error=session_failed");
  }

  const user = data.session?.user;
  if (!user) return redirect("/?error=no_user");

  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id, avatar_url, username")
    .eq("id", user.id)
    .single();

  if (!existingProfile) {
    console.warn("Profile missing despite trigger — this should rarely happen");
    return redirect("/?error=no_profile");
  }

  if (!existingProfile.avatar_url) {
    await supabase
      .from("profiles")
      .update({
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${existingProfile.username}`,
      })
      .eq("id", user.id);
  }

  // GitHub OAuth sync
  const providerToken = data.session?.provider_token;
  if (providerToken) {
    try {
      const githubRes = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${providerToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      });

      if (githubRes.ok) {
        const githubUser = await githubRes.json();

        await supabase
          .from("profiles")
          .update({
            username: githubUser.login,
            github_username: githubUser.login,
            github_id: githubUser.id,
            github_name: githubUser.name,
            github_bio: githubUser.bio,
            github_location: githubUser.location,
            github_blog: githubUser.blog,
            twitter_username: githubUser.twitter_username,
            github_public_repos: githubUser.public_repos,
            github_followers_count: githubUser.followers,
            github_following_count: githubUser.following,
            // DO NOT overwrite avatar_url — the DB trigger already handles it
          })
          .eq("id", user.id);
      }
    } catch (err) {
      console.error("GitHub profile sync failed:", err);
    }
  }

  return redirect("/dashboard");
};
