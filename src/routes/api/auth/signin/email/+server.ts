import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals, url }) => {
	const formData = await request.formData();
	const email = formData.get('email') as string;
	const redirectUrl = (formData.get('redirectUrl') as string) || `${url.origin}/auth/callback`;

	if (!email) {
		throw redirect(303, '/?error=no_email');
	}

	const { error } = await locals.supabase.auth.signInWithOtp({
		email,
		options: {
			emailRedirectTo: redirectUrl
		}
	});

	if (error) {
		console.error('Email sign-in error:', error);
		throw redirect(303, `/?error=email_failed&email=${encodeURIComponent(email)}`);
	}

	throw redirect(303, `/?message=check-email&email=${encodeURIComponent(email)}`);
};
