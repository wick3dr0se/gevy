import { redirect } from '@sveltejs/kit';
import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ params, locals }) => {
	if (!locals.session) {
		throw redirect(303, '/');
	}

	const postId = params.postId;

	if (!postId) {
		throw redirect(303, '/dashboard');
	}

	// Get current user profile
	const { data: profile } = await locals.supabase
		.from('profiles')
		.select('*')
		.eq('id', locals.session.user.id)
		.single();

	if (!profile) {
		throw redirect(303, '/');
	}

	// Get the post with author profile
	const { data: post, error: postError } = await locals.supabase
		.from('posts')
		.select('*, profiles (*)')
		.eq('id', postId)
		.single();

	if (postError || !post) {
		throw redirect(303, '/dashboard');
	}

	// Get post metadata (likes, comments count)
	const [{ data: likeCounts }, { data: userLikes }, { data: commentCounts }] = await Promise.all([
		locals.supabase.from('post_likes').select('post_id').eq('post_id', postId),
		locals.supabase
			.from('post_likes')
			.select('post_id')
			.eq('post_id', postId)
			.eq('user_id', locals.session.user.id),
		locals.supabase.from('comments').select('post_id').eq('post_id', postId)
	]);

	const postWithMeta = {
		...post,
		likes_count: likeCounts?.length || 0,
		comments_count: commentCounts?.length || 0,
		is_liked: (userLikes?.length || 0) > 0
	};

	// Get comments with author profiles
	const { data: comments } = await locals.supabase
		.from('comments')
		.select('*, profiles (*)')
		.eq('post_id', postId)
		.order('created_at', { ascending: true });

	return {
		profile,
		post: postWithMeta,
		comments: comments || []
	};
};
