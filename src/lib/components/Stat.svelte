<script lang="ts">
	export let label: string;
	export let value: number;
</script>

<div class="flex flex-col">
	<span class="text-lg font-semibold">{value}</span>
	<span class="text-sm text-[var(--subtext)]">{label}</span>
</div>
