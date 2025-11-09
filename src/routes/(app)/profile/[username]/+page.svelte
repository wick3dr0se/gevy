<script lang="ts">
	import { page } from '$app/stores';
	import Header from '$lib/components/Header.svelte';
	import ProfileCard from '$lib/components/users/profile/ProfileCard.svelte';
	import { getDisplayName } from '$lib/queries/user';
	import type { Profile, PostWithMetadata } from '$lib/supabase';
	import PostList from '$lib/components/posts/PostList.svelte';

	export let data: {
		currentUserProfile: Profile;
		profile: Profile;
		isOwnProfile: boolean;
		isFollowing: boolean;
		posts: PostWithMetadata[];
	};

	const error = $page.url.searchParams.get('error');
	const success = $page.url.searchParams.get('success');

	const errorMessages: Record<string, string> = {
		invalid_format: 'Username must be 3-20 characters (letters, numbers, _, -)',
		reserved: 'This username is reserved',
		inappropriate: 'This username is not allowed',
		inappropriate_display_name: 'Display name contains inappropriate content',
		inappropriate_bio: 'Bio contains inappropriate content',
		taken: 'This username is already taken',
		failed: 'Failed to update profile. Please try again.'
	};
</script>

<svelte:head>
	<title>{getDisplayName(data.profile)} - Gevy</title>
</svelte:head>

<Header user={data.currentUserProfile} />

<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
	{#if success === 'updated'}
		<div class="mb-4 rounded-lg bg-[var(--success)] p-4 text-white">
			✓ Profile updated successfully!
		</div>
	{/if}

	{#if error}
		<div class="mb-4 rounded-lg bg-[var(--danger)] p-4 text-white">
			{errorMessages[error] || 'An error occurred'}
		</div>
	{/if}

	<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
		<div class="space-y-8 lg:col-span-2">
			<ProfileCard
				profile={data.profile}
				isOwnProfile={data.isOwnProfile}
				isFollowing={data.isFollowing}
			/>

			<!-- Posts -->
			<div class="space-y-6">
				<h2 class="text-xl font-semibold">Posts</h2>
				<PostList posts={data.posts} currentUserId={data.profile.id} emptyMessage="No posts yet." />
			</div>
		</div>

		<div class="lg:col-span-1">
			<div class="rounded-lg border p-6 shadow-sm">
				<a
					href="/dashboard"
					class="inline-flex items-center gap-2 text-[var(--subtext)] hover:text-[var(--text)]"
				>
					← Back to Dashboard
				</a>
			</div>
		</div>
	</div>
</main>
