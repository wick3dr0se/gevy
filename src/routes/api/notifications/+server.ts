import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.session) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		// Get notifications with actor profiles and post info
		const { data: notifications, error } = await locals.supabase
			.from('notifications')
			.select(
				`
        *,
        actor:profiles!notifications_actor_id_fkey (
          id,
          username,
          display_name,
          avatar_url,
          github_avatar_url
        ),
        post:posts (
          id,
          content
        )
      `
			)
			.eq('user_id', locals.session.user.id)
			.order('created_at', { ascending: false })
			.limit(20);

		if (error) {
			console.error('Error fetching notifications:', error);
			return json({ error: 'Failed to fetch notifications' }, { status: 500 });
		}

		// Get unread count
		const { count: unreadCount } = await locals.supabase
			.from('notifications')
			.select('*', { count: 'exact', head: true })
			.eq('user_id', locals.session.user.id)
			.eq('is_read', false);

		return json({
			notifications: notifications || [],
			unreadCount: unreadCount || 0
		});
	} catch (err) {
		console.error('Unexpected error:', err);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
