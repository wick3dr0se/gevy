import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.session)
		return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

	const { postId } = await request.json();
	if (!postId) return new Response(JSON.stringify({ error: 'Bad request' }), { status: 400 });

	const { data: existingLike } = await locals.supabase
		.from('post_likes')
		.select('id')
		.eq('post_id', postId)
		.eq('user_id', locals.session.user.id)
		.single();

	let is_liked: boolean;
	if (existingLike) {
		await locals.supabase.from('post_likes').delete().eq('id', existingLike.id);
		is_liked = false;
	} else {
		await locals.supabase
			.from('post_likes')
			.insert({ post_id: postId, user_id: locals.session.user.id });
		is_liked = true;
	}

	return new Response(JSON.stringify({ is_liked }), { status: 200 });
};
