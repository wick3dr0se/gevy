import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const isLoggingOut = url.searchParams.get('logout');

	if (locals.session && !isLoggingOut) {
		throw redirect(303, '/dashboard');
	}

	return {};
};
