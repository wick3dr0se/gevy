import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.session) {
		return new Response(JSON.stringify({ error: 'Not logged in' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	let payload: { content?: string };
	try {
		payload = await request.json();
	} catch {
		return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const content = (payload.content || '').trim();
	if (!content) {
		return new Response(JSON.stringify({ error: 'Post content is empty' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const { data: post, error } = await locals.supabase
		.from('posts')
		.insert([{ author_id: locals.session.user.id, content }])
		.select('*')
		.single();

	if (error) {
		console.error('Post creation error:', error);
		return new Response(JSON.stringify({ error: error.message }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	return new Response(JSON.stringify({ post }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	});
};
