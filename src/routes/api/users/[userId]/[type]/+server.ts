import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params, locals }) => {
	const userId = params.userId;
	const type = params.type;

	if (!userId || (type !== 'followers' && type !== 'following')) {
		return json({ error: 'Invalid request' }, { status: 400 });
	}

	if (!locals.session) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		let query;

		if (type === 'followers') {
			// Get users who follow this user
			query = locals.supabase
				.from('follows')
				.select(
					`
          follower_id,
          profiles!follows_follower_id_fkey (
            id,
            username,
            display_name,
            avatar_url,
            github_username,
            github_avatar_url,
            bio
          )
        `
				)
				.eq('following_id', userId);
		} else {
			// Get users this user follows
			query = locals.supabase
				.from('follows')
				.select(
					`
          following_id,
          profiles!follows_following_id_fkey (
            id,
            username,
            display_name,
            avatar_url,
            github_username,
            github_avatar_url,
            bio
          )
        `
				)
				.eq('follower_id', userId);
		}

		const { data, error } = await query;

		if (error) {
			console.error('Error fetching followers/following:', error);
			return json({ error: 'Failed to fetch' }, { status: 500 });
		}

		// Extract profiles from the join
		const users = data?.map((item: any) => item.profiles).filter(Boolean) || [];

		console.log('API returning users:', { type, count: users.length });

		return json({ users });
	} catch (error) {
		console.error('Error:', error);
		return json({ error: 'Internal error' }, { status: 500 });
	}
};
