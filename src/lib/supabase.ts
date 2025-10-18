import { createClient } from '@supabase/supabase-js';
import type { AstroCookies } from 'astro';

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client with cookie-based session
export function createServerSupabaseClient(cookies: AstroCookies) {
    return createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            flowType: 'pkce',
            detectSessionInUrl: true,
            persistSession: true,
            storage: {
                getItem: (key) => {
                    const cookie = cookies.get(key);
                    return cookie?.value || null;
                },
                setItem: (key, value) => {
                    cookies.set(key, value, {
                        path: '/',
                        maxAge: 60 * 60 * 24 * 7, // 7 days
                        sameSite: 'lax',
                        secure: import.meta.env.PROD,
                    });
                },
                removeItem: (key) => {
                    cookies.delete(key, { path: '/' });
                },
            },
        },
    });
}

// Database types
export interface Profile {
    id: string;
    github_username: string;
    github_id: number;
    avatar_url: string | null;
    name: string | null;
    bio: string | null;
    location: string | null;
    blog: string | null;
    twitter_username: string | null;
    public_repos: number;
    followers_count: number;
    following_count: number;
    created_at: string;
    updated_at: string;
    github_synced_at: string;
}

export interface Post {
    id: string;
    author_id: string;
    content: string;
    created_at: string;
    updated_at: string;
    profiles: Profile;
    likes_count?: number;
    comments_count?: number;
    is_liked?: boolean;
}

export interface Comment {
    id: string;
    post_id: string;
    author_id: string;
    content: string;
    created_at: string;
    updated_at: string;
    profiles: Profile;
}

export interface Follow {
    id: string;
    follower_id: string;
    following_id: string;
    created_at: string;
}