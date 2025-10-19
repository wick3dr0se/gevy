import { GitHubAPI } from "./github";
import type { Profile } from "./supabase";
import { marked } from "marked";

export async function syncGitHubProfile(
  userId: string,
  providerToken: string,
  supabaseClient: any
) {
  const github = new GitHubAPI(providerToken);
  const githubUser = await github.getUser();

  let repos: any[] = [];
  let readmeHtml: string | null = null;
  let markdown: string | null = null;

  try {
    repos = await github.getRepos(githubUser.login, 6);
    console.log("Got repos:", repos.length);
  } catch (e) {
    console.warn("Failed to fetch repos", e);
  }

  try {
    const readmeResponse = await github.getReadme(githubUser.login);
    markdown = Buffer.from(readmeResponse.content, "base64").toString("utf-8");
    readmeHtml = await marked.parse(markdown);
    console.log("README processed:", {
      markdownLength: markdown.length,
      htmlLength: readmeHtml.length,
    });
  } catch (e) {
    console.warn("Failed to fetch README", e);
  }

  const { data, error } = await supabaseClient
    .from("profiles")
    .update({
      avatar_url: githubUser.avatar_url,
      name: githubUser.name,
      bio: githubUser.bio,
      public_repos: githubUser.public_repos,
      followers_count: githubUser.followers,
      following_count: githubUser.following,
      repos,
      readme_html: readmeHtml,
      readme_markdown: markdown,
      updated_at: new Date().toISOString(),
      github_synced_at: new Date().toISOString(),
    })
    .eq("id", userId);
}

export function shouldSyncProfile(profile: Profile): boolean {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  return (
    !profile.github_synced_at || new Date(profile.github_synced_at) < oneHourAgo
  );
}
