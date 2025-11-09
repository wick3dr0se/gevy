<script lang="ts">
	import { enhance } from '$app/forms';
	import Avatar from '../users/Avatar.svelte';
	import type { Profile } from '$lib/supabase';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let user: Profile;

	let submitting = false;
	let content = '';

	async function handleSubmit() {
		submitting = true;
		const res = await fetch('/api/posts/create', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ content })
		});

		if (res.ok) {
			const { post } = await res.json();
			dispatch('newPost', post); // send to parent
			content = '';
		}
		submitting = false;
	}
</script>

<div class="rounded-lg border p-6 shadow-sm">
	<form action="/api/posts/create" method="POST" class="space-y-4" use:enhance={handleSubmit}>
		<div class="flex gap-4">
			<Avatar {user} size={40} />
			<textarea
				name="content"
				bind:value={content}
				placeholder="Share what you're working on..."
				required
				rows="3"
				disabled={submitting}
				class="flex-1 resize-none rounded-lg border bg-[var(--bg)] px-4 py-2 text-[var(--text)] focus:ring-2 focus:ring-[var(--accent)] focus:outline-none disabled:opacity-50"
			></textarea>
		</div>
		<div class="flex justify-end">
			<button
				type="submit"
				disabled={submitting || !content.trim()}
				class="rounded-lg bg-[var(--accent)] px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
			>
				{submitting ? 'Posting...' : 'Post'}
			</button>
		</div>
	</form>
</div>
