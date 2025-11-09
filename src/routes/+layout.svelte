<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import favicon from '$lib/assets/logo.svg';

	let { children } = $props();

	onMount(() => {
		const step = 15;
		const initialDelay = 300;

		type KeyName = 'w' | 'a' | 's' | 'd' | 'h' | 'j' | 'k' | 'l';

		const keys: Record<KeyName, boolean> = {
			w: false,
			a: false,
			s: false,
			d: false,
			h: false,
			j: false,
			k: false,
			l: false
		};

		let animationFrameId: number | null = null;
		let delayTimeoutId: number | null = null;

		function scrollPage() {
			let x = 0;
			let y = 0;
			if (keys.w || keys.k) y -= step;
			if (keys.s || keys.j) y += step;
			if (keys.a || keys.h) x -= step;
			if (keys.d || keys.l) x += step;

			if (x || y) {
				window.scrollBy({ top: y, left: x, behavior: 'instant' as ScrollBehavior });
			}
		}

		function animate() {
			scrollPage();
			const anyKeyPressed = Object.values(keys).some((pressed) => pressed);
			if (anyKeyPressed) animationFrameId = requestAnimationFrame(animate);
			else animationFrameId = null;
		}

		function startScrolling() {
			if (animationFrameId === null) animate();
		}

		window.addEventListener('keydown', (e: KeyboardEvent) => {
			const tag = (document.activeElement as HTMLElement)?.tagName;
			if (
				['INPUT', 'TEXTAREA'].includes(tag) ||
				(document.activeElement as HTMLElement)?.isContentEditable
			)
				return;

			const key = e.key.toLowerCase() as KeyName;
			if (!(key in keys)) return;

			if (!keys[key]) {
				keys[key] = true;
				scrollPage();

				if (delayTimeoutId) clearTimeout(delayTimeoutId);
				delayTimeoutId = window.setTimeout(() => {
					startScrolling();
					delayTimeoutId = null;
				}, initialDelay);
			}

			e.preventDefault();
		});

		window.addEventListener('keyup', (e: KeyboardEvent) => {
			const key = e.key.toLowerCase() as KeyName;
			if (key in keys) {
				keys[key] = false;
				if (delayTimeoutId) {
					clearTimeout(delayTimeoutId);
					delayTimeoutId = null;
				}
				e.preventDefault();
			}
		});
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

<footer
	class="mt-12 border-t border-[var(--border)] py-6 text-center text-sm text-[var(--subtext)]"
>
	<div
		class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 sm:flex-row sm:px-6 lg:px-8"
	>
		<p>© {new Date().getFullYear()} Gevy</p>
		<a href="/privacy" class="hover:text-[var(--text)]">Privacy</a>
	</div>
</footer>
