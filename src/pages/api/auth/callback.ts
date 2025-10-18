import type { APIRoute } from 'astro';
import { createServerSupabaseClient } from '../../../lib/supabase';

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
    const code = url.searchParams.get('code');

    if (!code) {
        return redirect('/?error=no_code');
    }

    const supabase = createServerSupabaseClient(cookies);

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
        console.error('Session error:', error);
        return redirect('/?error=session_failed');
    }

    // Get GitHub user data and create/update profile
    const providerToken = data.session?.provider_token;

    if (providerToken) {
        try {
            const githubResponse = await fetch('https://api.github.com/user', {
                headers: {
                    Authorization: `Bearer ${providerToken}`,
                    Accept: 'application/vnd.github.v3+json',
                },
            });

            const githubUser = await githubResponse.json();

            // Upsert profile
            await supabase.from('profiles').upsert({
                id: data.session.user.id,
                github_username: githubUser.login,
                github_id: githubUser.id,
                avatar_url: githubUser.avatar_url,
                name: githubUser.name,
                bio: githubUser.bio,
                location: githubUser.location,
                blog: githubUser.blog,
                twitter_username: githubUser.twitter_username,
                public_repos: githubUser.public_repos,
                followers_count: githubUser.followers,
                following_count: githubUser.following,
            });
        } catch (error) {
            console.error('Profile creation error:', error);
        }
    }

    return redirect('/dashboard');
};
