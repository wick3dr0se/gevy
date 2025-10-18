import type { APIRoute } from 'astro';
import { createServerSupabaseClient } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
    const supabase = createServerSupabaseClient(cookies);
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        return new Response('Unauthorized', { status: 401 });
    }

    const formData = await request.formData();
    const postId = formData.get('postId')?.toString();

    if (!postId) {
        return new Response('Bad Request', { status: 400 });
    }

    // Check if already liked
    const { data: existingLike } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', session.user.id)
        .single();

    if (existingLike) {
        // Unlike
        await supabase
            .from('post_likes')
            .delete()
            .eq('post_id', postId)
            .eq('user_id', session.user.id);
    } else {
        // Like
        await supabase.from('post_likes').insert({
            post_id: postId,
            user_id: session.user.id,
        });
    }

    // Redirect back to referrer or dashboard
    const referer = request.headers.get('referer') || '/dashboard';
    return redirect(referer);
};

