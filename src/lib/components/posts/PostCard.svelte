<script lang="ts">
	import Avatar from '../users/Avatar.svelte';
	import { getDisplayName, getProfileLink } from '$lib/queries/user';
	import type { PostWithMetadata } from '$lib/supabase';

	export let post: PostWithMetadata;
	export let currentUserId: string;

	function getTimeAgo(date: string): string {
		const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
		const intervals = {
			year: 31536000,
			month: 2592000,
			week: 604800,
			day: 86400,
			hour: 3600,
			minute: 60
		};
		for (const [unit, secondsInUnit] of Object.entries(intervals)) {
			const interval = Math.floor(seconds / secondsInUnit);
			if (interval >= 1) {
				return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
			}
		}
		return 'just now';
	}

	// Local reactive state for likes
	let isLiked = post.is_liked;
	let likesCount = post.likes_count;

	async function toggleLike() {
		try {
			const res = await fetch('/api/posts/like', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ postId: post.id })
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data?.error || 'Failed to like/unlike');
			isLiked = data.is_liked;
			likesCount += data.is_liked ? 1 : -1;
		} catch (err) {
			console.error(err);
		}
	}
</script>

<div class="rounded-lg border p-6 shadow-sm">
	<div class="flex gap-4">
		<a href={getProfileLink(post.profiles)}>
			<Avatar user={post.profiles} size={40} />
		</a>

		<div class="min-w-0 flex-1">
			<div class="flex items-center gap-2">
				<a href={getProfileLink(post.profiles)} class="font-semibold hover:underline">
					{getDisplayName(post.profiles)}
				</a>
				<span class="text-[var(--subtext)]">·</span>
				<span class="text-sm text-[var(--subtext)]">
					{getTimeAgo(post.created_at)}
				</span>
			</div>

			<p class="mt-2 whitespace-pre-wrap text-[var(--text)]">
				{post.content}
			</p>

			<div class="mt-4 flex items-center gap-6">
				<!-- Like button -->
				<button
					on:click={toggleLike}
					class="flex items-center gap-2 text-gray-500 transition-colors hover:text-red-600"
				>
					<span class={isLiked ? 'text-red-600' : ''}>
						{isLiked ? '❤️' : '🤍'}
					</span>
					<span class="text-sm">{likesCount}</span>
				</button>

				<!-- Comments -->
				<a
					href="/post/{post.id}"
					class="flex items-center gap-2 text-gray-500 transition-colors hover:text-[var(--accent)]"
				>
					<span>💬</span>
					<span class="text-sm">{post.comments_count || 0}</span>
				</a>
			</div>
		</div>
	</div>
</div>
