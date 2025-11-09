<script lang="ts">
	import Popover from './Popover.svelte';

	export let location: string;
</script>

<Popover>
	<span slot="trigger" class="flex cursor-pointer items-center gap-1 underline">
		<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
			/>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
			/>
		</svg>
		{location}
	</span>

	<div
		slot="content"
		class="absolute left-0 z-10 mt-2 w-80 rounded border bg-[var(--bg)] p-2 shadow-lg"
	>
		<iframe
			src={`https://www.google.com/maps?q=${encodeURIComponent(location)}&output=embed`}
			class="h-60 w-full"
			loading="lazy"
			title="Map of {location}"
			allowfullscreen
		></iframe>
	</div>
</Popover>
