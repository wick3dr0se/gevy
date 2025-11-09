<script lang="ts">
	export let html: string;

	let className = '';
	export { className as class };
</script>

<div class="markdown-body {className}">
	{@html html}
</div>

<style>
	.markdown-body {
		background: none;
		color: var(--text);
	}

	/* Handle div alignment attributes */
	.markdown-body :global(div[align='center']) {
		text-align: center;
		display: block;
	}
	.markdown-body :global(div[align='right']) {
		text-align: right;
		display: block;
	}
	.markdown-body :global(div[align='left']) {
		text-align: left;
		display: block;
	}

	/* Inline images (direct children of divs) */
	.markdown-body :global(div > img) {
		display: inline-block;
		vertical-align: middle;
		margin: 0.25rem;
	}

	/* Inline links containing images */
	.markdown-body :global(div > a) {
		display: inline-block;
		margin: 0.25rem;
	}

	/* Basic markdown styling */
	.markdown-body :global(h1),
	.markdown-body :global(h2),
	.markdown-body :global(h3) {
		margin-top: 1.5em;
		margin-bottom: 0.5em;
		font-weight: 600;
	}

	.markdown-body :global(p) {
		margin: 0.5em 0;
	}

	.markdown-body :global(code) {
		background: var(--muted);
		padding: 0.2em 0.4em;
		border-radius: 3px;
		font-size: 0.9em;
	}

	.markdown-body :global(pre) {
		background: var(--muted);
		padding: 1em;
		border-radius: 6px;
		overflow-x: auto;
	}

	.markdown-body :global(a) {
		color: var(--accent);
		text-decoration: none;
	}

	.markdown-body :global(a:hover) {
		text-decoration: underline;
	}
</style>
