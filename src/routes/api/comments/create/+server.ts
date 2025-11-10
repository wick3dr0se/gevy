import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.session) {
		throw redirect(303, '/');
	}

	const formData = await request.formData();
	const postId = formData.get('postId')?.toString();
	const content = formData.get('content')?.toString();

	if (!postId || !content || content.trim().length === 0) {
		throw redirect(303, `/post/${postId}?error=empty_comment`);
	}

	const { error } = await locals.supabase.from('comments').insert({
		post_id: postId,
		author_id: locals.session.user.id,
		content: content.trim()
	});

	if (error) {
		console.error('Comment creation error:', error);
		throw redirect(303, `/post/${postId}?error=comment_failed`);
	}

	throw redirect(303, `/post/${postId}`);
};
