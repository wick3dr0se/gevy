import type { RequestHandler } from '@sveltejs/kit';
import { createServerSupabaseClient } from '$lib/supabase';
import { Filter } from 'bad-words';

const filter = new Filter();
const USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,20}$/;
const RESERVED = ['admin', 'mod', 'gevy', 'support', 'api', 'root'];

export const POST: RequestHandler = async (event) => {
	const supabase = createServerSupabaseClient(event);
	const {
		data: { user }
	} = await supabase.auth.getUser();

	if (!user) {
		return new Response('Unauthorized', { status: 401 });
	}

	const formData = await event.request.formData();
	const username = formData.get('username')?.toString().trim();
	const display_name = formData.get('display_name')?.toString().trim();
	const bio = formData.get('bio')?.toString().trim();

	// Get current profile
	const { data: currentProfile } = await supabase
		.from('profiles')
		.select('username')
		.eq('id', user.id)
		.single();

	const redirectTo = `/profile/${username || currentProfile?.username}`;

	// Validate username if changed
	if (username && username !== currentProfile?.username) {
		if (!USERNAME_REGEX.test(username)) {
			return Response.redirect(`${redirectTo}?error=invalid_format`);
		}

		if (RESERVED.includes(username.toLowerCase())) {
			return Response.redirect(`${redirectTo}?error=reserved`);
		}

		if (filter.isProfane(username)) {
			return Response.redirect(`${redirectTo}?error=inappropriate`);
		}

		// Check uniqueness
		const { data: existing } = await supabase
			.from('profiles')
			.select('id')
			.eq('username', username)
			.neq('id', user.id)
			.single();

		if (existing) {
			return Response.redirect(`${redirectTo}?error=taken`);
		}
	}

	// Validate display name
	if (display_name && filter.isProfane(display_name)) {
		return Response.redirect(`${redirectTo}?error=inappropriate_display_name`);
	}

	// Validate bio
	if (bio && filter.isProfane(bio)) {
		return Response.redirect(`${redirectTo}?error=inappropriate_bio`);
	}

	// Update profile
	const updates: any = {};
	if (username) updates.username = username;
	if (display_name !== undefined) updates.display_name = display_name || null;
	if (bio !== undefined) updates.bio = bio || null;

	const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);

	if (error) {
		console.error('Profile update error:', error);
		return Response.redirect(`${redirectTo}?error=failed`);
	}

	const baseUrl = event.url.origin;
	return Response.redirect(
		new URL(`/profile/${username || currentProfile?.username}?success=updated`, baseUrl)
	);
};
