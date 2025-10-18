import type { APIRoute } from 'astro';
import { createServerSupabaseClient } from '../../../lib/supabase';

export const POST: APIRoute = async ({ cookies, redirect }) => {
    const supabase = createServerSupabaseClient(cookies);
    await supabase.auth.signOut();
    return redirect('/');
};