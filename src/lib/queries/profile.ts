import type { SupabaseClient } from '@supabase/supabase-js';
import type { Profile } from '$lib/supabase';

export async function getProfileWithSync(
	supabase: SupabaseClient,
	username: string,
	providerToken?: string
): Promise<Profile | null> {
	const { data: profile, error } = await supabase
		.from('profiles')
		.select('*')
		.eq('username', username)
		.single();

	if (error || !profile) {
		return null;
	}

	// If we have a provider token and the profile is stale, sync GitHub data
	if (providerToken && profile.github_username) {
		const lastSync = new Date(profile.github_synced_at || 0);
		const hoursSinceSync = (Date.now() - lastSync.getTime()) / (1000 * 60 * 60);

		// Sync if older than 24 hours
		if (hoursSinceSync > 24) {
			try {
				const githubRes = await fetch(`https://api.github.com/users/${profile.github_username}`, {
					headers: {
						Authorization: `Bearer ${providerToken}`,
						Accept: 'application/vnd.github.v3+json'
					}
				});

				if (githubRes.ok) {
					const githubUser = await githubRes.json();

					// Update profile with fresh GitHub data
					await supabase
						.from('profiles')
						.update({
							github_name: githubUser.name,
							github_bio: githubUser.bio,
							github_location: githubUser.location,
							github_blog: githubUser.blog,
							twitter_username: githubUser.twitter_username,
							github_public_repos: githubUser.public_repos,
							github_followers_count: githubUser.followers,
							github_following_count: githubUser.following,
							github_synced_at: new Date().toISOString()
						})
						.eq('id', profile.id);

					// Fetch updated profile
					const { data: updatedProfile } = await supabase
						.from('profiles')
						.select('*')
						.eq('username', username)
						.single();

					return updatedProfile || profile;
				}
			} catch (err) {
				console.error('GitHub sync failed:', err);
			}
		}
	}

	return profile;
}
