<script lang="ts">
	import { onMount } from 'svelte';
	import Popover from '../Popover.svelte';
	import { getDisplayName, getProfileHandle, getProfileLink } from '$lib/queries/user';
	import type { Profile } from '$lib/supabase';

	export let userId: string;
	export let type: 'followers' | 'following';
	export let count: number;

	let users: Profile[] = [];
	let loading = false;
	let fetched = false;
	let error = false;
	let popoverEl: HTMLElement;

	async function fetchUsers() {
		if (fetched) return;

		loading = true;
		error = false;
		fetched = true;

		try {
			const response = await fetch(`/api/users/${userId}/${type}`);
			if (!response.ok) throw new Error('Failed to fetch');

			const data = await response.json();
			users = data.users || [];
		} catch (err) {
			console.error('Failed to load users:', err);
			error = true;
		} finally {
			loading = false;
		}
	}

	function handlePopoverShow() {
		fetchUsers();
	}

	onMount(() => {
		if (popoverEl) {
			popoverEl.addEventListener('popover:show', handlePopoverShow);
			return () => {
				popoverEl.removeEventListener('popover:show', handlePopoverShow);
			};
		}
	});

	function getAvatarUrl(user: Profile): string {
		return (
			user.avatar_url ||
			user.github_avatar_url ||
			`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`
		);
	}
</script>

<Popover closeOthers={true} closeOthersSelector=".followers-popover">
	<span slot="trigger" class="flex cursor-pointer flex-col underline hover:text-[var(--accent)]">
		<span class="text-lg font-semibold">{count}</span>
		<span class="text-sm text-[var(--subtext)]">{type}</span>
	</span>

	<div
		bind:this={popoverEl}
		slot="content"
		class="followers-popover absolute left-0 z-10 mt-2 max-h-96 w-80 overflow-y-auto rounded-lg border bg-[var(--bg)] shadow-lg"
	>
		{#if loading}
			<div class="p-3 text-center text-[var(--subtext)]">Loading...</div>
		{:else if error}
			<div class="py-4 text-center text-[var(--danger)]">Failed to load</div>
		{:else if users.length === 0}
			<div class="py-4 text-center text-[var(--subtext)]">No {type} yet</div>
		{:else}
			<div class="space-y-1 p-3">
				{#each users as user}
					<a
						href={getProfileLink(user)}
						class="flex items-center gap-3 rounded-lg p-2 transition hover:bg-[var(--muted)]"
					>
						<img
							src={getAvatarUrl(user)}
							alt={getDisplayName(user)}
							class="h-10 w-10 rounded-full"
						/>
						<div class="min-w-0 flex-1">
							<p class="truncate font-semibold text-[var(--text)]">{getDisplayName(user)}</p>
							<p class="truncate text-sm text-[var(--subtext)]">{getProfileHandle(user)}</p>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</Popover>
