<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		if (!browser) return;

		// Check if we were opened by clicking a link (magic link in email)
		// vs. OAuth redirect in same window (GitHub login)
		const isNewTab =
			window.opener !== null ||
			document.referrer.includes('gmail') ||
			document.referrer.includes('mail');

		if (isNewTab) {
			// Magic link flow - signal other tabs and close
			localStorage.setItem('auth-complete', Date.now().toString());
			setTimeout(() => {
				window.close();
			}, 1000);
		} else {
			// OAuth flow (same window) - just redirect to dashboard
			goto('/dashboard');
		}
	});
</script>

<svelte:head>
	<title>Signing you in...</title>
</svelte:head>

<div
	style="display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: system-ui; text-align: center;"
>
	<div>
		<h1>✓ Signed in successfully!</h1>
		<p>Redirecting to dashboard...</p>
	</div>
</div>
