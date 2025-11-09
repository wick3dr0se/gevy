import { redirect } from '@sveltejs/kit';
import type { ServerLoad } from '@sveltejs/kit';
import { getProfileWithSync } from '$lib/queries/profile';
import { getPostsWithMetadata } from '$lib/queries/posts';

export const load: ServerLoad = async ({ locals, params }) => {
	// Check auth
	if (!locals.session) {
		throw redirect(303, '/');
	}

	const { username } = params;

	if (!username) {
		throw redirect(303, '/dashboard');
	}

	// Get current user's profile
	const { data: currentUserProfile } = await locals.supabase
		.from('profiles')
		.select('*')
		.eq('id', locals.session.user.id)
		.single();

	if (!currentUserProfile) {
		throw redirect(303, '/');
	}

	// Get profile with GitHub sync
	const profile = await getProfileWithSync(
		locals.supabase,
		username,
		locals.session.provider_token ?? undefined
	);

	if (!profile) {
		throw redirect(303, '/dashboard');
	}

	const isOwnProfile = profile.id === locals.session.user.id;

	// Check if following
	const { data: followData } = await locals.supabase
		.from('follows')
		.select('id')
		.eq('follower_id', locals.session.user.id)
		.eq('following_id', profile.id)
		.single();

	const isFollowing = !!followData;

	// Get posts with metadata
	const postsWithMeta = await getPostsWithMetadata(
		locals.supabase,
		profile.id,
		locals.session.user.id
	);

	return {
		currentUserProfile,
		profile,
		isOwnProfile,
		isFollowing,
		posts: postsWithMeta
	};
};
