<script lang="ts">
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	//import type { PageData } from './$types';

	//export let data: PageData;

	const message = $page.url.searchParams.get('message');
	const emailParam = $page.url.searchParams.get('email');
	const redirectUrl = browser ? `${window.location.origin}/auth/callback` : '';

	// Listen for auth completion in other tabs
	if (browser) {
		window.addEventListener('storage', (e) => {
			if (e.key === 'auth-complete') {
				localStorage.removeItem('auth-complete');
				goto('/dashboard');
			}
		});
	}
</script>

<svelte:head>
	<title>Gevy - Connect with Developers</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-[var(--bg)] px-4">
	<div class="w-full max-w-md text-center">
		<h1 class="mb-4 text-4xl font-bold">Gevy</h1>
		<p class="mb-8 text-xl text-[var(--subtext)]">A social platform for developers</p>

		{#if message === 'check-email'}
			<div class="mb-4 rounded-lg bg-[var(--success)] p-4 text-white">
				✉️ Check your email for the magic link!
			</div>
		{/if}

		<div class="rounded-lg border p-8 shadow-lg">
			<div class="mb-6">
				<div class="mb-4 text-6xl">👨‍💻</div>
				<h2 class="mb-2 text-2xl font-semibold">Get Started</h2>
				<p class="text-[var(--subtext)]">
					Sign in to connect with developers, share posts, and build your network.
				</p>
			</div>

			<!-- GitHub login -->
			<form action="/api/auth/signin/github" method="GET">
				<input type="hidden" name="redirectUrl" value={redirectUrl} />
				<button
					type="submit"
					class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--text)] px-6 py-3 font-medium text-[var(--bg)] transition-colors hover:bg-[var(--subtext)]"
				>
					<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
						<path
							d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
						></path>
					</svg>
					Sign in with GitHub
				</button>
			</form>

			<div class="my-6 flex items-center">
				<span class="flex-1 border-t"></span>
				<span class="px-3 text-sm text-[var(--subtext)]">or</span>
				<span class="flex-1 border-t"></span>
			</div>

			<!-- Email magic link login -->
			<form action="/api/auth/signin/email" method="POST">
				<input type="hidden" name="redirectUrl" value={redirectUrl} />
				<input
					type="email"
					name="email"
					placeholder="you@example.com"
					value={emailParam || ''}
					required
					class="mb-2 w-full rounded border px-4 py-2 focus:ring-2 focus:ring-[var(--accent)] focus:outline-none"
				/>
				<button
					type="submit"
					class="w-full rounded bg-[var(--accent)] px-4 py-2 text-white transition-colors hover:bg-blue-700"
				>
					Send Magic Link
				</button>
			</form>

			<div class="mt-6 text-left text-sm text-[var(--subtext)]">
				<h2 class="mb-1 text-lg font-semibold">Features:</h2>
				<ul class="space-y-1">
					<li>✓ Share posts and updates</li>
					<li>✓ Like and comment on posts</li>
					<li>✓ Follow other developers</li>
					<li>✓ View GitHub activity feeds</li>
					<li>✓ Discover new developers</li>
				</ul>
			</div>
		</div>
	</div>
</div>
