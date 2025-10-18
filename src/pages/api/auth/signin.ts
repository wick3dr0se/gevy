import type { APIRoute } from 'astro';
import { createServerSupabaseClient } from '../../../lib/supabase';

export const GET: APIRoute = async ({ cookies, url }) => {
    const supabase = createServerSupabaseClient(cookies);

    // Use the current origin to build callback URL dynamically
    const redirectTo = `${url.origin}/api/auth/callback`;

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
            redirectTo,
            scopes: 'read:user repo'
        }
    });

    if (error) {
        console.error('OAuth error:', error);
        return new Response('OAuth failed', { status: 500 });
    }

    return new Response(null, {
        status: 302,
        headers: { Location: data.url },
    });
};