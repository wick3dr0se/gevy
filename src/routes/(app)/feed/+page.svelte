<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import CreatePost from '$lib/components/posts/CreatePost.svelte';
	import PostList from '$lib/components/posts/PostList.svelte';
	import type { Profile, PostWithMetadata } from '$lib/supabase';

	export let data: {
		profile: Profile;
		posts: PostWithMetadata[];
	};
</script>

<svelte:head>
	<title>Feed - Gevy</title>
</svelte:head>

<Header user={data.profile} />

<main class="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
	<div class="space-y-6">
		<CreatePost user={data.profile} />
		<PostList posts={data.posts} currentUserId={data.profile.id} />
	</div>
</main>
