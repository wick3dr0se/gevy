import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals }) => {
  const code = url.searchParams.get('code');

  if (!code) {
    throw redirect(303, '/?error=no_code');
  }

  const { data, error } = await locals.supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('Session exchange error:', error);
    throw redirect(303, '/?error=session_failed');
  }

  const user = data.session?.user;
  if (!user) {
    throw redirect(303, '/?error=no_user');
  }

  // Check if profile exists
  const { data: existingProfile } = await locals.supabase
    .from('profiles')
    .select('id, avatar_url, username')
    .eq('id', user.id)
    .single();

  if (!existingProfile) {
    console.warn('Profile missing despite trigger — this should rarely happen');
    throw redirect(303, '/?error=no_profile');
  }

  // Set default avatar if missing
  if (!existingProfile.avatar_url) {
    await locals.supabase
      .from('profiles')
      .update({
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${existingProfile.username}`
      })
      .eq('id', user.id);
  }

  // GitHub OAuth sync
  const providerToken = data.session?.provider_token;
  if (providerToken) {
    try {
      const githubRes = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${providerToken}`,
          Accept: 'application/vnd.github.v3+json'
        }
      });

      if (githubRes.ok) {
        const githubUser = await githubRes.json();
        await locals.supabase
          .from('profiles')
          .update({
            username: githubUser.login,
            github_username: githubUser.login,
            github_id: githubUser.id,
            github_name: githubUser.name,
            github_bio: githubUser.bio,
            github_location: githubUser.location,
            github_blog: githubUser.blog,
            twitter_username: githubUser.twitter_username,
            github_public_repos: githubUser.public_repos,
            github_followers_count: githubUser.followers,
            github_following_count: githubUser.following
          })
          .eq('id', user.id);
      }
    } catch (err) {
      console.error('GitHub profile sync failed:', err);
    }
  }

  throw redirect(303, '/auth-success');
};
