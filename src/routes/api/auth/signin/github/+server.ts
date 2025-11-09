import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals }) => {
	const redirectUrl = url.searchParams.get('redirectUrl') || `${url.origin}/auth/callback`;

	const { data, error } = await locals.supabase.auth.signInWithOAuth({
		provider: 'github',
		options: {
			redirectTo: redirectUrl
		}
	});

	if (error) {
		console.error('GitHub OAuth error:', error);
		throw redirect(303, '/?error=oauth_failed');
	}

	if (data.url) {
		throw redirect(303, data.url);
	}

	throw redirect(303, '/');
};
