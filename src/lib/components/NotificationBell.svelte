<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { getDisplayName } from '$lib/queries/user';
	import type { NotificationWithActor } from '$lib/supabase';

	let notifications: NotificationWithActor[] = [];
	let unreadCount = 0;
	let showDropdown = false;
	let loading = false;

	async function fetchNotifications() {
		if (loading) return;
		loading = true;

		try {
			const response = await fetch('/api/notifications');
			if (response.ok) {
				const data = await response.json();
				notifications = data.notifications || [];
				unreadCount = data.unreadCount || 0;
			}
		} catch (err) {
			console.error('Failed to fetch notifications:', err);
		} finally {
			loading = false;
		}
	}

	async function markAsRead(notificationId?: string) {
		try {
			await fetch('/api/notifications/mark-read', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ notificationId })
			});

			if (notificationId) {
				notifications = notifications.map((n) =>
					n.id === notificationId ? { ...n, is_read: true } : n
				);
				unreadCount = Math.max(0, unreadCount - 1);
			} else {
				notifications = notifications.map((n) => ({ ...n, is_read: true }));
				unreadCount = 0;
			}
		} catch (err) {
			console.error('Failed to mark as read:', err);
		}
	}

	function toggleDropdown() {
		showDropdown = !showDropdown;
		if (showDropdown && notifications.length === 0) {
			fetchNotifications();
		}
	}

	function getNotificationText(notification: NotificationWithActor): string {
		const actorName = getDisplayName(notification.actor);

		switch (notification.type) {
			case 'like':
				return `${actorName} liked your post`;
			case 'comment':
				return `${actorName} commented on your post`;
			case 'follow':
				return `${actorName} started following you`;
			default:
				return 'New notification';
		}
	}

	function getNotificationLink(notification: NotificationWithActor): string {
		switch (notification.type) {
			case 'like':
			case 'comment':
				return notification.post_id ? `/post/${notification.post_id}` : '/dashboard';
			case 'follow':
				return `/profile/${notification.actor.username}`;
			default:
				return '/dashboard';
		}
	}

	function getTimeAgo(date: string): string {
		const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);

		if (seconds < 60) return 'just now';
		if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
		if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
		if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
		return new Date(date).toLocaleDateString();
	}

	function handleClickOutside(event: MouseEvent) {
		if (showDropdown && browser) {
			const target = event.target as HTMLElement;
			const dropdown = document.querySelector('.notification-dropdown');
			const button = document.querySelector('.notification-button');

			if (dropdown && button && !dropdown.contains(target) && !button.contains(target)) {
				showDropdown = false;
			}
		}
	}

	onMount(() => {
		fetchNotifications();

		// Poll for new notifications every 30 seconds
		const interval = setInterval(fetchNotifications, 30000);

		if (browser) {
			document.addEventListener('click', handleClickOutside);
		}

		return () => {
			clearInterval(interval);
			if (browser) {
				document.removeEventListener('click', handleClickOutside);
			}
		};
	});
</script>

<div class="relative">
	<button
		type="button"
		class="notification-button relative rounded-full p-2 text-[var(--text)] transition-colors hover:bg-[var(--muted)]"
		on:click={toggleDropdown}
		aria-label="Notifications"
	>
		<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
			/>
		</svg>

		{#if unreadCount > 0}
			<span
				class="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
			>
				{unreadCount > 9 ? '9+' : unreadCount}
			</span>
		{/if}
	</button>

	{#if showDropdown}
		<div
			class="notification-dropdown absolute right-0 z-50 mt-2 max-h-[32rem] w-96 overflow-y-auto rounded-lg border border-[var(--border)] bg-[var(--bg)] shadow-xl"
		>
			<div class="flex items-center justify-between border-b border-[var(--border)] p-4">
				<h3 class="text-lg font-semibold">Notifications</h3>
				{#if unreadCount > 0}
					<button
						type="button"
						on:click={() => markAsRead()}
						class="text-sm text-[var(--accent)] hover:underline"
					>
						Mark all as read
					</button>
				{/if}
			</div>

			{#if loading && notifications.length === 0}
				<div class="p-8 text-center text-[var(--subtext)]">Loading...</div>
			{:else if notifications.length === 0}
				<div class="p-8 text-center text-[var(--subtext)]">No notifications yet</div>
			{:else}
				<div class="divide-y divide-[var(--border)]">
					{#each notifications as notification}
						<a
							href={getNotificationLink(notification)}
							class="block p-4 transition-colors hover:bg-[var(--muted)] {!notification.is_read
								? 'bg-blue-50 dark:bg-blue-900/10'
								: ''}"
							on:click={() => markAsRead(notification.id)}
						>
							<div class="flex items-start gap-3">
								<img
									src={notification.actor.avatar_url ||
										notification.actor.github_avatar_url ||
										`https://api.dicebear.com/7.x/avataaars/svg?seed=${notification.actor.username}`}
									alt={getDisplayName(notification.actor)}
									class="h-10 w-10 rounded-full"
								/>
								<div class="min-w-0 flex-1">
									<p class="text-sm text-[var(--text)]">
										{getNotificationText(notification)}
									</p>
									{#if notification.post && notification.type !== 'follow'}
										<p class="mt-1 truncate text-sm text-[var(--subtext)]">
											"{notification.post.content}"
										</p>
									{/if}
									<p class="mt-1 text-xs text-[var(--subtext)]">
										{getTimeAgo(notification.created_at)}
									</p>
								</div>
								{#if !notification.is_read}
									<div class="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500"></div>
								{/if}
							</div>
						</a>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>
