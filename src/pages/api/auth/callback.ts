import type { APIRoute } from "astro";
import { createServerSupabaseClient } from "../../../lib/supabase";

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  const code = url.searchParams.get("code");

  if (!code) {
    return redirect("/?error=no_code");
  }

  const supabase = createServerSupabaseClient(cookies);
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Session error:", error);
    return redirect("/?error=session_failed");
  }

  const providerToken = data.session?.provider_token;

  if (providerToken) {
    try {
      const githubResponse = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${providerToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      });

      const githubUser = await githubResponse.json();

      await supabase.from("profiles").upsert({
        id: data.session.user.id,
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
      });
    } catch (error) {
      console.error("Profile creation error:", error);
    }
  }

  return redirect("/dashboard");
};
