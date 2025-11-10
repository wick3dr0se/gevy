<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import Avatar from '../users/Avatar.svelte';
	import type { Profile } from '$lib/supabase';

	export let postId: string;
	export let user: Profile;

	let submitting = false;
	let content = '';

	async function handleSubmit(e: Event) {
		e.preventDefault();

		if (!content.trim() || submitting) return;

		submitting = true;

		try {
			const formData = new FormData();
			formData.append('postId', postId);
			formData.append('content', content.trim());

			const response = await fetch('/api/comments/create', {
				method: 'POST',
				body: formData
			});

			if (response.ok || response.redirected) {
				content = ''; // Clear textarea
				await invalidateAll(); // Refresh page data to show new comment
			} else {
				console.error('Failed to post comment');
			}
		} catch (err) {
			console.error('Error posting comment:', err);
		} finally {
			submitting = false;
		}
	}
</script>

<div class="border-t pt-4">
	<form on:submit={handleSubmit} class="flex gap-3">
		<Avatar {user} size={32} />

		<div class="flex-1">
			<textarea
				name="content"
				bind:value={content}
				placeholder="Write a comment..."
				required
				rows="2"
				disabled={submitting}
				class="w-full resize-none rounded-lg border bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] focus:ring-2 focus:ring-[var(--accent)] focus:outline-none disabled:opacity-50"
			></textarea>
			<div class="mt-2 flex justify-end">
				<button
					type="submit"
					disabled={submitting || !content.trim()}
					class="rounded-lg bg-[var(--accent)] px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
				>
					{submitting ? 'Posting...' : 'Comment'}
				</button>
			</div>
		</div>
	</form>
</div>
