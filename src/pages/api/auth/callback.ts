import type { APIRoute } from "astro";
import { createServerSupabaseClient } from "../../../lib/supabase";

function generateUsername(email: string, userId: string): string {
  const base =
    email
      .split("@")[0]
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "") || "user";
  const suffix = userId.slice(0, 6);
  return `${base}_${suffix}`;
}

export const GET: APIRoute = async ({ cookies, redirect, url }) => {
  const supabase = createServerSupabaseClient(cookies);
  const code = url.searchParams.get("code");

  if (!code) {
    return redirect("/?error=no_code");
  }

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Session exchange error:", error);
    return redirect("/?error=session_failed");
  }

  const user = data.session?.user;
  if (!user) {
    return redirect("/?error=no_user");
  }

  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  // If no profile, create one (fallback if DB trigger failed)
  if (!existingProfile) {
    console.log("Profile doesn't exist, creating fallback...");

    const profileData: any = {
      id: user.id,
      username: generateUsername(user.email || "user", user.id),
      display_name: user.email?.split("@")[0] || null,
      gevy_bio: null,
      custom_avatar_url: null,
      website_url: null,
      theme: "default",
      gevy_followers_count: 0,
      gevy_following_count: 0,
    };

    const { error: insertError } = await supabase
      .from("profiles")
      .insert(profileData);

    if (insertError) {
      console.error("Failed to create profile:", insertError);
      return redirect("/?error=profile_creation_failed");
    }
  }

  // If GitHub OAuth, enrich with GitHub data
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
            github_avatar_url: githubUser.avatar_url,
            github_name: githubUser.name,
            github_bio: githubUser.bio,
            github_location: githubUser.location,
            github_blog: githubUser.blog,
            twitter_username: githubUser.twitter_username,
            github_public_repos: githubUser.public_repos,
            github_followers_count: githubUser.followers,
            github_following_count: githubUser.following,
          })
          .eq("id", user.id);
      }
    } catch (err) {
      console.error("GitHub profile sync failed:", err);
    }
  }

  return redirect("/dashboard");
};
