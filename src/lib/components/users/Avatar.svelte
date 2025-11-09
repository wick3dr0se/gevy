<script lang="ts">
	import type { Profile } from '$lib/supabase';

	export let user: Profile;
	export let size: number = 40;
	export let loading: 'eager' | 'lazy' = 'lazy';

	let className = '';
	export { className as class };

	$: avatarUrl =
		user.avatar_url ||
		user.github_avatar_url ||
		`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`;
</script>

<img
	src={avatarUrl}
	alt={user.username || 'User avatar'}
	width={size}
	height={size}
	{loading}
	class={className}
/>
