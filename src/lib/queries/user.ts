import type { Profile } from '$lib/supabase';

export function getDisplayName(user: Profile): string {
	return user.display_name || user.username || 'Developer';
}

export function getProfileLink(user: Profile): string {
	return `/profile/${user.username}`;
}

export function getProfileHandle(user: Profile): string {
	return `@${user.username || user.github_username || 'user'}`;
}

export function getAvatarUrl(user: Profile): string {
	return (
		user.avatar_url ||
		user.github_avatar_url ||
		`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`
	);
}
