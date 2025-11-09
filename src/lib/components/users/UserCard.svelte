<script lang="ts">
	import { getProfileLink, getDisplayName, getProfileHandle } from '$lib/queries/user';
	import Avatar from './Avatar.svelte';
	import FollowButton from './FollowButton.svelte';
	import FollowList from './FollowList.svelte';

	export let profile: any;
	export let isFollowing: boolean;
</script>

<div class="rounded-lg border p-6 shadow-sm">
	<div class="flex items-start gap-4">
		<Avatar
			user={{
				username: profile.username,
				github_username: profile.github_username,
				github_avatar_url: profile.github_avatar_url,
				avatar_url: profile.avatar_url
			} as any}
			size={64}
		/>

		<div class="min-w-0 flex-1">
			<a href={getProfileLink(profile)} class="block truncate font-semibold hover:underline">
				{getDisplayName(profile)}
			</a>

			<p class="truncate text-sm text-[var(--subtext)]">
				{getProfileHandle(profile)}
			</p>

			{#if profile.bio}
				<p class="mt-2 line-clamp-2 text-sm text-[var(--subtext)]">
					{profile.bio}
				</p>
			{/if}

			<div class="mt-3 flex gap-4 text-xs">
				<FollowList userId={profile.id} type="followers" count={profile.followers_count || 0} />
			</div>

			<FollowButton
				followingId={profile.id}
				{isFollowing}
				fullWidth={true}
				className="mt-4 text-sm"
			/>
		</div>
	</div>
</div>
