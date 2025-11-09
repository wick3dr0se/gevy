import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

const handler: RequestHandler = async ({ locals, cookies }) => {
	const { error } = await locals.supabase.auth.signOut();

	if (error) {
		console.error('Logout error:', error);
	}

	// Force clear all auth cookies
	const projectRef = env.SUPABASE_URL?.match(/https:\/\/(.+?)\.supabase\.co/)?.[1];

	if (projectRef) {
		cookies.delete(`sb-${projectRef}-auth-token`, { path: '/' });
		cookies.delete(`sb-${projectRef}-auth-token.0`, { path: '/' });
		cookies.delete(`sb-${projectRef}-auth-token.1`, { path: '/' });
	}

	// Also delete generic cookie names
	cookies.delete('sb-access-token', { path: '/' });
	cookies.delete('sb-refresh-token', { path: '/' });

	throw redirect(303, '/?logout=true');
};

export const GET = handler;
export const POST = handler;
