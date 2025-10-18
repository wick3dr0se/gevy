import type { APIRoute } from 'astro';
import { createServerSupabaseClient } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
    const supabase = createServerSupabaseClient(cookies);
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        return redirect('/');
    }

    const formData = await request.formData();
    const content = formData.get('content')?.toString();

    if (!content || content.trim().length === 0) {
        return redirect('/dashboard?error=empty_post');
    }

    const { error } = await supabase.from('posts').insert({
        author_id: session.user.id,
        content: content.trim(),
    });

    if (error) {
        console.error('Post creation error:', error);
        return redirect('/dashboard?error=post_failed');
    }

    return redirect('/dashboard');
};