import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Profile } from '$lib/supabase';
import { getFeedPosts } from '$lib/queries/posts';

export const load: PageServerLoad = async ({ locals }) => {
	// Check if user is authenticated
	if (!locals.session) {
		throw redirect(303, '/');
	}

	const userId = locals.session.user.id;

	// Fetch user profile
	let profile: Profile | null = null;

	const { data: profileData, error: profileError } = await locals.supabase
		.from('profiles')
		.select('*')
		.eq('id', userId)
		.single();

	if (profileError) {
		console.error('Profile fetch error:', profileError);

		// Wait a moment and retry (race condition with trigger)
		await new Promise((resolve) => setTimeout(resolve, 1000));

		const { data: retryProfile, error: retryError } = await locals.supabase
			.from('profiles')
			.select('*')
			.eq('id', userId)
			.single();

		if (retryError || !retryProfile) {
			console.error('Profile still not found after retry:', retryError);
			throw redirect(303, '/error?message=profile_not_found');
		}

		profile = retryProfile;
	} else {
		profile = profileData;
	}

	if (!profile) {
		throw redirect(303, '/error?message=profile_not_found');
	}

	// Fetch feed posts
	const posts = await getFeedPosts(locals.supabase, userId);

	return {
		profile,
		posts
	};
};
