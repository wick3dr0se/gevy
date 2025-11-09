import { redirect } from '@sveltejs/kit';
import type { ServerLoad } from '@sveltejs/kit';
import { getAllPosts } from '$lib/queries/posts';

export const load: ServerLoad = async ({ locals }) => {
	if (!locals.session) {
		throw redirect(303, '/');
	}

	const { data: profile } = await locals.supabase
		.from('profiles')
		.select('*')
		.eq('id', locals.session.user.id)
		.single();

	if (!profile) {
		throw redirect(303, '/');
	}

	// Get all public posts with metadata (using bulk queries - much faster!)
	const posts = await getAllPosts(locals.supabase, locals.session.user.id);

	return {
		profile,
		posts
	};
};
