import type { PostWithProfile, PostWithMetadata } from "../supabase";

async function enrichPostsWithMetadata(
  supabase: any,
  posts: PostWithProfile[],
  currentUserId: string,
): Promise<PostWithMetadata[]> {
  if (!posts || posts.length === 0) return [];

  const postIds = posts.map((p) => p.id);

  // Fetch all metadata in parallel with bulk queries
  const [{ data: likeCounts }, { data: userLikes }, { data: commentCounts }] =
    await Promise.all([
      supabase.from("post_likes").select("post_id").in("post_id", postIds),
      supabase
        .from("post_likes")
        .select("post_id")
        .in("post_id", postIds)
        .eq("user_id", currentUserId),
      supabase.from("comments").select("post_id").in("post_id", postIds),
    ]);

  // Build lookup maps for O(1) access
  const likesMap = new Map<string, number>();
  likeCounts?.forEach((like: any) => {
    likesMap.set(like.post_id, (likesMap.get(like.post_id) || 0) + 1);
  });

  const userLikedSet = new Set(userLikes?.map((l: any) => l.post_id) || []);

  const commentsMap = new Map<string, number>();
  commentCounts?.forEach((c: any) => {
    commentsMap.set(c.post_id, (commentsMap.get(c.post_id) || 0) + 1);
  });

  // Merge metadata with posts
  return posts.map((post) => ({
    ...post,
    likes_count: likesMap.get(post.id) || 0,
    comments_count: commentsMap.get(post.id) || 0,
    is_liked: userLikedSet.has(post.id),
  }));
}

// Get posts for a specific author with metadata
export async function getPostsWithMetadata(
  supabase: any,
  authorId: string,
  currentUserId: string,
): Promise<PostWithMetadata[]> {
  const { data: posts } = await supabase
    .from("posts")
    .select("*, profiles (*)")
    .eq("author_id", authorId)
    .order("created_at", { ascending: false })
    .limit(20);

  return enrichPostsWithMetadata(supabase, posts || [], currentUserId);
}

// Get feed posts (from followed users + own posts) with metadata
export async function getFeedPosts(
  supabase: any,
  userId: string,
  limit = 20,
): Promise<PostWithMetadata[]> {
  // Get following IDs
  const { data: following } = await supabase
    .from("follows")
    .select("following_id")
    .eq("follower_id", userId);

  const followingIds = following?.map((f: any) => f.following_id) || [];
  followingIds.push(userId); // Include own posts

  // Get posts from followed users
  const { data: posts } = await supabase
    .from("posts")
    .select("*, profiles (*)")
    .in("author_id", followingIds)
    .order("created_at", { ascending: false })
    .limit(limit);

  return enrichPostsWithMetadata(supabase, posts || [], userId);
}

// Get all public posts with metadata
export async function getAllPosts(
  supabase: any,
  currentUserId: string,
  limit = 50,
): Promise<PostWithMetadata[]> {
  const { data: posts } = await supabase
    .from("posts")
    .select("*, profiles (*)")
    .order("created_at", { ascending: false })
    .limit(limit);

  return enrichPostsWithMetadata(supabase, posts || [], currentUserId);
}
