<script lang="ts">
	export let followingId: string;
	export let isFollowing: boolean;
	export let fullWidth: boolean = false;
	export let className: string = '';

	let loading = false;
	let following = isFollowing; // reactive local copy so UI updates instantly

	async function handleClick() {
		if (loading) return;
		loading = true;

		const original = following;
		following = !following;

		try {
			const res = await fetch('/api/follow', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ followingId })
			});

			if (!res.ok) throw new Error('Follow request failed');

			const data = await res.json();
			following = data.isFollowing;
		} catch (err) {
			console.error('Follow error:', err);
			alert('Failed to follow/unfollow. Please try again.');
			following = original;
		} finally {
			loading = false;
		}
	}
</script>

<button
	on:click={handleClick}
	disabled={loading}
	class={`follow-button rounded-lg px-4 py-2 font-medium transition-colors
		${fullWidth ? 'w-full' : ''}
		${
			following
				? 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
				: 'bg-[var(--accent)] text-white hover:bg-blue-700'
		}
		${className}`}
>
	{#if loading}
		{following ? 'Unfollowing…' : 'Following…'}
	{:else}
		{following ? 'Following' : 'Follow'}
	{/if}
</button>
