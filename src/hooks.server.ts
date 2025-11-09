import { createServerSupabaseClient } from '$lib/supabase';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const supabase = createServerSupabaseClient(event);

	// Get session from Supabase
	const {
		data: { session }
	} = await supabase.auth.getSession();

	// Make session and supabase available to all routes
	event.locals.supabase = supabase;
	event.locals.session = session;

	return resolve(event);
};
