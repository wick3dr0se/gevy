<div class="flex min-h-screen items-center justify-center px-4 py-12">
	<div class="w-full max-w-2xl">
		<div class="mb-8 text-center">
			<h1 class="mb-4 text-4xl font-bold">Privacy & Data</h1>
			<p class="text-xl text-[var(--subtext)]">Your data, your control</p>
		</div>

		<div class="space-y-8 rounded-lg border p-8 shadow-lg">
			<div>
				<h2 class="mb-4 text-2xl font-semibold">What we access from GitHub</h2>
				<ul class="space-y-3 text-[var(--subtext)]">
					<li class="flex items-start gap-2">
						<span class="font-bold text-green-600">✓</span>
						<span>Public profile info (name, bio, avatar)</span>
					</li>
					<li class="flex items-start gap-2">
						<span class="font-bold text-green-600">✓</span>
						<span>Public repositories</span>
					</li>
					<li class="flex items-start gap-2">
						<span class="font-bold text-green-600">✓</span>
						<span>Public activity (commits, stars, PRs)</span>
					</li>
					<li class="flex items-start gap-2">
						<span class="font-bold text-red-600">✗</span>
						<span>Private repositories (never)</span>
					</li>
					<li class="flex items-start gap-2">
						<span class="font-bold text-red-600">✗</span>
						<span>Private emails (never)</span>
					</li>
					<li class="flex items-start gap-2">
						<span class="font-bold text-red-600">✗</span>
						<span>Organization data (never)</span>
					</li>
				</ul>
			</div>

			<hr />

			<div>
				<h2 class="mb-4 text-2xl font-semibold">What you control</h2>
				<p class="leading-relaxed text-[var(--subtext)]">
					You can override any GitHub data on your profile. We sync from GitHub as a convenience,
					but you're always in control of what displays on Gevy.
				</p>
			</div>

			<hr />

			<div>
				<h2 class="mb-4 text-2xl font-semibold">Data retention</h2>
				<p class="leading-relaxed text-[var(--subtext)]">
					We cache your GitHub data to reduce API calls. You can manually refresh it anytime, or it
					auto-updates when you log in.
				</p>
			</div>

			<div class="pt-4">
				<a
					href="/"
					class="inline-flex w-full items-center justify-center gap-2
          rounded-lg bg-[var(--text)] px-6 py-3 font-medium text-[var(--bg)]
          transition-colors hover:bg-[var(--subtext)]"
				>
					← Back to Home
				</a>
			</div>
		</div>
	</div>
</div>
