import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/private';
import type { RequestEvent } from '@sveltejs/kit';

const SUPABASE_URL = env.SUPABASE_URL;
const SUPABASE_ANON_KEY = env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
	throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env file');
}

// Browser client (public)
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Server client with cookies (for auth)
export function createServerSupabaseClient(event: RequestEvent) {
	return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
		auth: {
			flowType: 'pkce',
			detectSessionInUrl: true,
			persistSession: true,
			autoRefreshToken: false,
			storage: {
				getItem: (key) => {
					return event.cookies.get(key) || null;
				},
				setItem: (key, value) => {
					event.cookies.set(key, value, {
						path: '/',
						maxAge: 60 * 60 * 24 * 7, // 7 days
						sameSite: 'lax',
						secure: true,
						httpOnly: true
					});
				},
				removeItem: (key) => {
					event.cookies.delete(key, { path: '/' });
				}
			}
		}
	});
}

// Service role client (admin operations)
export function createServiceSupabaseClient() {
	const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
	if (!serviceKey) {
		throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
	}
	return createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
		auth: {
			persistSession: false,
			autoRefreshToken: false
		},
		global: {
			headers: {
				Authorization: `Bearer ${serviceKey}`
			}
		}
	});
}

// Types
export interface Profile {
	id: string;
	username: string | null;
	display_name: string | null;
	bio: string | null;
	avatar_url: string | null;
	cover_image_url: string | null;
	website_url: string | null;
	theme: string;
	followers_count: number;
	following_count: number;
	// GH data
	github_username: string;
	github_id: number;
	github_avatar_url: string | null;
	github_name: string | null;
	github_bio: string | null;
	github_location: string | null;
	github_blog: string | null;
	twitter_username: string | null;
	github_public_repos: number;
	github_followers_count: number;
	github_following_count: number;
	// Cached GH data
	repos: GitHubRepo[] | null;
	readme_html: string | null;
	readme_markdown: string | null;
	github_synced_at: string;
	created_at: string;
	updated_at: string;
}

export interface Project {
	id: string;
	owner_id: string;
	name: string;
	slug: string;
	description: string | null;
	cover_image_url: string | null;
	tags: string[] | null;
	linked_github_repo: string | null;
	github_repo_data: any | null;
	is_public: boolean;
	created_at: string;
	updated_at: string;
}

export interface ProjectWithOwner extends Project {
	profiles: Profile;
}

export interface Post {
	id: string;
	author_id: string;
	content: string;
	project_id: string | null;
	tags: string[] | null;
	linked_github_commit_url: string | null;
	linked_github_pr_url: string | null;
	created_at: string;
	updated_at: string;
}

export interface PostWithProfile extends Post {
	profiles: Profile;
	projects?: Project;
}

export interface PostWithMetadata extends PostWithProfile {
	likes_count: number;
	comments_count: number;
	is_liked: boolean;
}

export interface Comment {
	id: string;
	post_id: string;
	author_id: string;
	content: string;
	created_at: string;
	updated_at: string;
}

export interface CommentWithProfile extends Comment {
	profiles: Profile;
}

export interface Follow {
	id: string;
	follower_id: string;
	following_id: string;
	created_at: string;
}

export interface ProjectFollow {
	id: string;
	user_id: string;
	project_id: string;
	created_at: string;
}

export interface PostLike {
	id: string;
	post_id: string;
	user_id: string;
	created_at: string;
}

export interface Notification {
	id: string;
	user_id: string;
	type: 'like' | 'comment' | 'follow';
	actor_id: string;
	post_id: string | null;
	comment_id: string | null;
	is_read: boolean;
	created_at: string;
}

export interface NotificationWithActor extends Notification {
	actor: Profile;
	post?: Post;
}

export interface GitHubRepo {
	id?: string;
	profile_id?: string;
	github_repo_id: number;
	name: string;
	full_name: string;
	description: string | null;
	html_url: string;
	stargazers_count: number;
	forks_count: number;
	language: string | null;
	updated_at?: string;
	synced_at?: string;
}
