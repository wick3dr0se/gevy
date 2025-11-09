<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	export let closeOthers = false;
	export let closeOthersSelector = '';

	let showPopover = false;
	let triggerEl: HTMLElement;
	let popoverEl: HTMLElement;

	function togglePopover() {
		if (closeOthers && closeOthersSelector && browser) {
			// Close all other popovers matching the selector
			document.querySelectorAll(closeOthersSelector).forEach((el) => {
				if (el !== popoverEl && el instanceof HTMLElement) {
					el.style.display = 'none';
				}
			});
		}

		showPopover = !showPopover;

		// Dispatch custom event for external listeners
		if (showPopover && popoverEl) {
			popoverEl.dispatchEvent(new CustomEvent('popover:show', { bubbles: true }));
		}
	}

	function closePopover() {
		showPopover = false;
	}

	onMount(() => {
		// Close on outside click
		function handleClickOutside(e: MouseEvent) {
			if (
				showPopover &&
				triggerEl &&
				popoverEl &&
				!triggerEl.contains(e.target as Node) &&
				!popoverEl.contains(e.target as Node)
			) {
				closePopover();
			}
		}

		document.addEventListener('click', handleClickOutside);

		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});
</script>

<div class="relative inline-block">
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div bind:this={triggerEl} on:click={togglePopover}>
		<slot name="trigger" />
	</div>

	{#if showPopover}
		<div bind:this={popoverEl}>
			<slot name="content" />
		</div>
	{/if}
</div>
