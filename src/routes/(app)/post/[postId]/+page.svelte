<script lang="ts">
	import { page } from '$app/stores';
	import Header from '$lib/components/Header.svelte';
	import PostCard from '$lib/components/posts/PostCard.svelte';
	import CommentCard from '$lib/components/comments/CommentCard.svelte';
	import CommentForm from '$lib/components/comments/CommentForm.svelte';
	import type { Profile, PostWithMetadata, CommentWithProfile } from '$lib/supabase';

	export let data: {
		profile: Profile;
		post: PostWithMetadata;
		comments: CommentWithProfile[];
	};

	const error = $page.url.searchParams.get('error');

	const errorMessages: Record<string, string> = {
		empty_comment: 'Comment cannot be empty',
		comment_failed: 'Failed to post comment. Please try again.'
	};
</script>

<svelte:head>
	<title>Post - Gevy</title>
</svelte:head>

<Header user={data.profile} />

<main class="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
	<div class="space-y-6">
		<a
			href="/dashboard"
			class="inline-flex items-center gap-2 text-[var(--subtext)] hover:text-[var(--text)]"
		>
			← Back to Dashboard
		</a>

		{#if error}
			<div class="rounded-lg bg-[var(--danger)] p-4 text-white">
				{errorMessages[error] || 'An error occurred'}
			</div>
		{/if}

		<!-- Post -->
		<PostCard post={data.post} currentUserId={data.profile.id} />

		<!-- Comments Section -->
		<div class="rounded-lg border p-6 shadow-sm">
			<h2 class="mb-4 text-lg font-semibold">
				Comments ({data.comments.length})
			</h2>

			{#if data.comments.length === 0}
				<p class="py-8 text-center text-[var(--subtext)]">
					No comments yet. Be the first to comment!
				</p>
			{:else}
				<div class="divide-y divide-[var(--border)]">
					{#each data.comments as comment}
						<CommentCard {comment} />
					{/each}
				</div>
			{/if}

			<CommentForm postId={data.post.id} user={data.profile} />
		</div>
	</div>
</main>
