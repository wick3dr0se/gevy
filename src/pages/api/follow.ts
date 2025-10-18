import type { APIRoute } from 'astro';
import { createServerSupabaseClient } from '../../lib/supabase';

export const POST: APIRoute = async ({ request, cookies }) => {
    const supabase = createServerSupabaseClient(cookies);
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const { followingId } = await request.json();

    if (!followingId || followingId === session.user.id) {
        return new Response(JSON.stringify({ error: 'Invalid request' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // Check if already following
    const { data: existingFollow } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', session.user.id)
        .eq('following_id', followingId)
        .single();

    let isFollowing = false;

    if (existingFollow) {
        // Unfollow
        await supabase
            .from('follows')
            .delete()
            .eq('follower_id', session.user.id)
            .eq('following_id', followingId);
        isFollowing = false;
    } else {
        // Follow
        await supabase.from('follows').insert({
            follower_id: session.user.id,
            following_id: followingId,
        });
        isFollowing = true;
    }

    return new Response(JSON.stringify({ isFollowing }), {
        headers: { 'Content-Type': 'application/json' }
    });
};
