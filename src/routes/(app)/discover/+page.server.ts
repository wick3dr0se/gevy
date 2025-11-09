import { createServerSupabaseClient } from '$lib/supabase';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const supabase = createServerSupabaseClient(event);

	const {
		data: { session }
	} = await supabase.auth.getSession();

	if (!session) throw redirect(302, '/');

	const { data: currentUserProfile } = await supabase
		.from('profiles')
		.select('*')
		.eq('id', session.user.id)
		.single();

	const { data: profiles } = await supabase
		.from('profiles')
		.select('*')
		.neq('id', session.user.id)
		.order('created_at', { ascending: false })
		.limit(50);

	const { data: following } = await supabase
		.from('follows')
		.select('following_id')
		.eq('follower_id', session.user.id);

	const followingIds = new Set(following?.map((f) => f.following_id) || []);

	return {
		currentUserProfile,
		profiles,
		followingIds: Array.from(followingIds)
	};
};
