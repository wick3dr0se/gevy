<script lang="ts">
	import PostCard from './PostCard.svelte';
	import type { PostWithMetadata } from '$lib/supabase';

	export let posts: PostWithMetadata[];
	export let currentUserId: string;
	export let emptyMessage: string = 'No posts yet.';
	export let emptyAction: { text: string; href: string } | undefined = undefined;
</script>

<div class="space-y-6">
	{#if posts.length === 0}
		<div class="rounded-lg border p-12 text-center shadow-sm">
			<p class="mb-4 text-[var(--subtext)]">
				{emptyMessage}
			</p>
			{#if emptyAction}
				<a
					href={emptyAction.href}
					class="inline-block rounded-lg bg-[var(--accent)] px-6 py-2 text-white transition-colors hover:bg-blue-700"
				>
					{emptyAction.text}
				</a>
			{/if}
		</div>
	{:else}
		{#each posts as post}
			<PostCard {post} {currentUserId} />
		{/each}
	{/if}
</div>
