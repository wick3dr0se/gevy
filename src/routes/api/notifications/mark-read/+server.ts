import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.session) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { notificationId } = await request.json();

		if (notificationId) {
			// Mark single notification as read
			const { error } = await locals.supabase
				.from('notifications')
				.update({ is_read: true })
				.eq('id', notificationId)
				.eq('user_id', locals.session.user.id);

			if (error) {
				console.error('Error marking notification as read:', error);
				return json({ error: 'Failed to mark as read' }, { status: 500 });
			}
		} else {
			// Mark all notifications as read
			const { error } = await locals.supabase
				.from('notifications')
				.update({ is_read: true })
				.eq('user_id', locals.session.user.id)
				.eq('is_read', false);

			if (error) {
				console.error('Error marking all notifications as read:', error);
				return json({ error: 'Failed to mark all as read' }, { status: 500 });
			}
		}

		return json({ success: true });
	} catch (err) {
		console.error('Unexpected error:', err);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
