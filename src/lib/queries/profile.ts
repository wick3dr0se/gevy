import { shouldSyncProfile, syncGitHubProfile } from "../services/github-sync";
import { marked } from "marked";
import type { Profile } from "../supabase";

export async function getProfileWithSync(
  supabase: any,
  username: string,
  providerToken?: string | null,
): Promise<Profile | null> {
  let { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (!profile) return null;

  // Sync GitHub data if stale
  if (providerToken && shouldSyncProfile(profile)) {
    await syncGitHubProfile(profile.id, providerToken, supabase);
    const { data: refreshed } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", profile.id)
      .single();
    if (refreshed) profile = refreshed;
  }

  if (!profile.readme_html && profile.readme_markdown) {
    profile.readme_html = await marked.parse(profile.readme_markdown);
  }

  return profile;
}
