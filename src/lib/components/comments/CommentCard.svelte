<script lang="ts">
	import Avatar from '../users/Avatar.svelte';
	import { getDisplayName, getProfileLink } from '$lib/queries/user';
	import type { CommentWithProfile } from '$lib/supabase';

	export let comment: CommentWithProfile;

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
</script>

<div class="flex gap-3 py-3">
	<a href={getProfileLink(comment.profiles)}>
		<Avatar user={comment.profiles} size={32} />
	</a>

	<div class="min-w-0 flex-1">
		<div class="flex items-center gap-2">
			<a href={getProfileLink(comment.profiles)} class="text-sm font-semibold hover:underline">
				{getDisplayName(comment.profiles)}
			</a>
			<span class="text-xs text-[var(--subtext)]">
				{getTimeAgo(comment.created_at)}
			</span>
		</div>

		<p class="mt-1 text-sm break-words whitespace-pre-wrap text-[var(--text)]">
			{comment.content}
		</p>
	</div>
</div>
