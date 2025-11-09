<script lang="ts">
	import { browser } from '$app/environment';
	import Avatar from '../Avatar.svelte';
	import FollowButton from '../FollowButton.svelte';
	import Minimap from '../../Minimap.svelte';
	import Stat from '../../Stat.svelte';
	import Readme from '../../Readme.svelte';
	import FollowList from '../FollowList.svelte';
	import { getDisplayName, getProfileHandle } from '$lib/queries/user';
	import type { Profile, GitHubRepo } from '$lib/supabase';

	export let profile: Profile;
	export let isOwnProfile: boolean;
	export let isFollowing: boolean;
	export let stats: {
		posts: number;
		projects: number;
		followers: number;
		following: number;
	} = {
		posts: 0,
		projects: 0,
		followers: profile.followers_count || 0,
		following: profile.following_count || 0
	};

	let showModal = false;
	const githubRepos: GitHubRepo[] = profile.repos || [];
	const githubReadmeHtml = profile.readme_html || null;

	function openModal() {
		showModal = true;
	}

	function closeModal() {
		showModal = false;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && showModal) {
			closeModal();
		}
	}

	$: if (browser) {
		if (showModal) {
			document.addEventListener('keydown', handleKeydown);
		} else {
			document.removeEventListener('keydown', handleKeydown);
		}
	}
</script>

<div class="rounded-lg border p-6 shadow-sm">
	<div class="flex flex-wrap items-start gap-6">
		<Avatar user={profile} size={100} />

		<div class="flex-1">
			<div class="flex flex-wrap items-center justify-between gap-4">
				<div>
					<h1 class="text-2xl font-bold">
						{getDisplayName(profile)}
					</h1>
					<p class="text-[var(--subtext)]">
						{getProfileHandle(profile)}
					</p>
				</div>

				{#if isOwnProfile}
					<button
						on:click={openModal}
						class="rounded-lg border px-4 py-2 transition-colors hover:bg-[var(--accent)] hover:text-white"
					>
						Edit Profile
					</button>
				{:else}
					<FollowButton followingId={profile.id} {isFollowing} />
				{/if}
			</div>

			{#if profile.bio || profile.github_bio}
				<p class="mt-3 text-[var(--subtext)]">
					{profile.bio || profile.github_bio}
				</p>
			{/if}

			<div class="mt-4 flex flex-wrap gap-6">
				<Stat label="posts" value={stats.posts} />
				<Stat label="projects" value={stats.projects} />
				<FollowList userId={profile.id} type="followers" count={profile.followers_count || 0} />
				<FollowList userId={profile.id} type="following" count={profile.following_count || 0} />
			</div>

			{#if profile.github_location || profile.website_url || profile.github_blog}
				<div class="mt-4 flex flex-wrap gap-4 text-sm text-[var(--subtext)]">
					{#if profile.github_location}
						<Minimap location={profile.github_location} />
					{/if}
					{#if profile.website_url || profile.github_blog}
						<a
							href={profile.website_url || profile.github_blog}
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center gap-1 transition-colors hover:text-[var(--text)]"
						>
							🔗 {profile.website_url || profile.github_blog}
						</a>
					{/if}
				</div>
			{/if}
		</div>
	</div>

	<details class="mt-6 border-t border-[var(--border)] pt-6">
		<summary
			class="flex cursor-pointer items-center gap-2 text-sm font-semibold text-[var(--subtext)] hover:text-[var(--text)]"
		>
			<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
				<path
					d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
				></path>
			</svg>
			GitHub Stats & Repositories
		</summary>

		<div class="mt-4 flex flex-wrap gap-6 text-sm text-[var(--subtext)]">
			<Stat label="public repos" value={profile.github_public_repos || 0} />
			<Stat label="followers" value={profile.github_followers_count || 0} />
			<Stat label="following" value={profile.github_following_count || 0} />
		</div>

		{#if githubRepos.length > 0}
			<div class="mt-6 border-t border-[var(--border)] pt-6">
				<h2 class="mb-4 text-lg font-semibold">Top Repositories</h2>
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					{#each githubRepos as repo}
						<a
							href={repo.html_url}
							target="_blank"
							rel="noopener noreferrer"
							class="rounded-lg border p-4 transition-colors hover:!border-[var(--accent)]"
						>
							<h3 class="truncate font-semibold">{repo.name}</h3>
							{#if repo.description}
								<p class="mt-1 line-clamp-2 text-sm text-[var(--subtext)]">
									{repo.description}
								</p>
							{/if}
							<div class="mt-3 flex items-center gap-4 text-sm text-[var(--subtext)]">
								{#if repo.language}
									<span class="flex items-center gap-1">
										<span class="h-3 w-3 rounded-full bg-[var(--accent)]"></span>
										{repo.language}
									</span>
								{/if}
								<span>⭐ {repo.stargazers_count}</span>
								<span>🔱 {repo.forks_count}</span>
							</div>
						</a>
					{/each}
				</div>
			</div>
		{/if}

		{#if githubReadmeHtml}
			<div class="mt-4 rounded-lg border p-4">
				<h3 class="mb-3 text-sm font-semibold text-[var(--text)]">GitHub Profile README</h3>
				<Readme html={githubReadmeHtml} />
			</div>
		{/if}
	</details>
</div>

<!-- Edit Profile Modal -->
{#if isOwnProfile && showModal}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4"
		on:click={closeModal}
	>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
		<div
			class="w-full max-w-md rounded-lg border bg-[var(--bg)] p-6 shadow-xl"
			on:click|stopPropagation
			role="dialog"
			tabindex="0"
			aria-modal="true"
		>
			<div class="mb-6 flex items-center justify-between">
				<h2 class="text-2xl font-bold">Edit Profile</h2>
				<button
					on:click={closeModal}
					class="text-2xl leading-none text-[var(--subtext)] hover:text-[var(--text)]"
				>
					✕
				</button>
			</div>

			<form method="POST" action="/api/profile/update" class="space-y-4">
				<div>
					<label for="username" class="mb-2 block text-sm font-medium">Username</label>
					<input
						type="text"
						id="username"
						name="username"
						value={profile.username}
						pattern="[a-zA-Z0-9_-]&#123;3,20&#125;"
						minlength="3"
						maxlength="20"
						required
						class="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-[var(--accent)] focus:outline-none"
					/>
					<p class="mt-1 text-xs text-[var(--subtext)]">
						3-20 characters. Letters, numbers, _, - only.
					</p>
				</div>

				<div>
					<label for="display_name" class="mb-2 block text-sm font-medium">Display Name</label>
					<input
						type="text"
						id="display_name"
						name="display_name"
						value={profile.display_name || ''}
						maxlength="50"
						class="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-[var(--accent)] focus:outline-none"
					/>
				</div>

				<div>
					<label for="bio" class="mb-2 block text-sm font-medium">Bio</label>
					<textarea
						id="bio"
						name="bio"
						rows="3"
						maxlength="160"
						class="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-[var(--accent)] focus:outline-none"
						value={profile.bio || ''}
					></textarea>
					<p class="mt-1 text-xs text-[var(--subtext)]">Max 160 characters</p>
				</div>

				<div class="flex gap-2 pt-2">
					<button
						type="submit"
						class="flex-1 rounded-lg bg-[var(--accent)] px-4 py-2 font-medium text-white transition-colors hover:bg-[var(--accent-hover)]"
					>
						Save Changes
					</button>
					<button
						type="button"
						on:click={closeModal}
						class="rounded-lg border px-4 py-2 transition-colors hover:bg-[var(--danger)]"
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
