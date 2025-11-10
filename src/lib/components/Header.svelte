<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import Avatar from './users/Avatar.svelte';
	import NotificationBell from './NotificationBell.svelte';
	import { getDisplayName, getProfileLink } from '$lib/queries/user';
	import type { Profile } from '$lib/supabase';
	import logo from '$lib/assets/logo.svg';

	export let user: Profile;

	function toggleTheme() {
		if (!browser) return;

		document.documentElement.classList.toggle('dark');
		const isDark = document.documentElement.classList.contains('dark');
		localStorage.setItem('theme', isDark ? 'dark' : 'light');
	}

	onMount(() => {
		// Initialize theme from localStorage
		const savedTheme = localStorage.getItem('theme');
		if (savedTheme === 'dark') {
			document.documentElement.classList.add('dark');
		}
	});
</script>

<header class="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center justify-between">
			<div class="flex items-center gap-4 sm:gap-8">
				<a href="/dashboard" class="flex items-center gap-2">
					<img src={logo} alt="Gevy logo" width="38" height="38" loading="eager" />
					<span class="text-xl font-bold">Gevy</span>
				</a>

				{#if user}
					<nav class="flex gap-3 sm:gap-6">
						<a
							href="/dashboard"
							class="flex items-center gap-2 text-[var(--subtext)] transition-colors hover:text-[var(--accent)]"
							title="Dashboard"
						>
							<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
								/>
							</svg>
							<span class="hidden md:inline">Dashboard</span>
						</a>

						<a
							href="/feed"
							class="flex items-center gap-2 text-[var(--subtext)] transition-colors hover:text-[var(--accent)]"
							title="Feed"
						>
							<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
								/>
							</svg>
							<span class="hidden md:inline">Feed</span>
						</a>

						<a
							href="/discover"
							class="flex items-center gap-2 text-[var(--subtext)] transition-colors hover:text-[var(--accent)]"
							title="Discover"
						>
							<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
							<span class="hidden md:inline">Discover</span>
						</a>
					</nav>
				{/if}
			</div>

			{#if user}
				<div class="flex items-center gap-2 sm:gap-4">
					<NotificationBell />
					<a
						href={getProfileLink(user)}
						class="group flex items-center gap-2"
						title={user.username}
					>
						<Avatar
							{user}
							size={28}
							loading="eager"
							class="rounded-full transition-all duration-200 group-hover:ring-2 group-hover:ring-[var(--accent)] group-hover:ring-offset-2 group-hover:ring-offset-[var(--bg)]"
						/>
						<span
							class="hidden text-[var(--subtext)] transition-colors duration-200 group-hover:text-[var(--accent)] sm:inline"
						>
							{getDisplayName(user)}
						</span>
					</a>

					<button
						type="button"
						class="theme-toggle flex items-center justify-center rounded-full p-2 text-[var(--text)] transition-colors duration-150 hover:bg-[var(--muted)]"
						aria-label="Toggle theme"
						on:click={toggleTheme}
					>
						<svg
							class="icon sun h-5 w-5"
							fill="currentColor"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<circle cx="12" cy="12" r="5" />
							<line x1="12" y1="1" x2="12" y2="3" stroke-width="2" />
							<line x1="12" y1="21" x2="12" y2="23" stroke-width="2" />
							<line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke-width="2" />
							<line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke-width="2" />
							<line x1="1" y1="12" x2="3" y2="12" stroke-width="2" />
							<line x1="21" y1="12" x2="23" y2="12" stroke-width="2" />
							<line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke-width="2" />
							<line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke-width="2" />
						</svg>

						<svg class="icon moon h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
							<path d="M21.64 13a9 9 0 11-10.64-10.64 9 9 0 0010.64 10.64z" />
						</svg>
					</button>

					<form action="/api/auth/logout" method="POST" class="hidden sm:block">
						<button
							type="submit"
							class="text-sm text-[var(--subtext)] transition-colors hover:text-[var(--danger)]"
						>
							Logout
						</button>
					</form>
				</div>
			{/if}
		</div>
	</div>
</header>

<style>
	.icon {
		display: block;
	}
	.moon {
		display: none;
	}

	:global(html.dark) .sun {
		display: none;
	}
	:global(html.dark) .moon {
		display: block;
	}
</style>
