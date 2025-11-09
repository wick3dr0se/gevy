<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import UserCard from '$lib/components/users/UserCard.svelte';

	export let data;
	const { currentUserProfile, profiles, followingIds } = data;
</script>

<Header user={currentUserProfile} />

<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
	<h1 class="mb-6 text-2xl font-bold text-[var(--text)]">Discover Developers</h1>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each profiles as profile}
			<UserCard {profile} isFollowing={followingIds.includes(profile.id)} />
		{/each}
	</div>
</main>
