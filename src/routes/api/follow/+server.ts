import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.session) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const body = await request.json();
	const { followingId, isFollowing } = body;

	if (!followingId || followingId === locals.session.user.id) {
		return json({ error: 'Invalid request' }, { status: 400 });
	}

	// If isFollowing is passed, use it to determine action
	// Otherwise, check current state
	let shouldUnfollow = isFollowing;

	if (shouldUnfollow === undefined) {
		// Check if already following
		const { data: existingFollow } = await locals.supabase
			.from('follows')
			.select('id')
			.eq('follower_id', locals.session.user.id)
			.eq('following_id', followingId)
			.single();

		shouldUnfollow = !!existingFollow;
	}

	let newFollowingState = false;

	if (shouldUnfollow) {
		// Unfollow
		await locals.supabase
			.from('follows')
			.delete()
			.eq('follower_id', locals.session.user.id)
			.eq('following_id', followingId);
		newFollowingState = false;
	} else {
		// Follow
		await locals.supabase.from('follows').insert({
			follower_id: locals.session.user.id,
			following_id: followingId
		});
		newFollowingState = true;
	}

	// Get updated follower count from database
	const { data: profile } = await locals.supabase
		.from('profiles')
		.select('followers_count')
		.eq('id', followingId)
		.single();

	return json({
		isFollowing: newFollowingState,
		followersCount: profile?.followers_count || 0
	});
};
