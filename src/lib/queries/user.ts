export function getAvatarUrl(user: {
  username?: string | null;
  github_username?: string | null;
  avatar_url?: string | null;
  github_avatar_url?: string | null;
}) {
  return (
    user.avatar_url ??
    (user.username
      ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`
      : (user.github_avatar_url ?? "/default-avatar.svg"))
  );
}

export function getDisplayName(user: {
  display_name?: string | null;
  username?: string | null;
  github_username?: string | null;
}) {
  return user.display_name || user.username || user.github_username || "User";
}

export function getProfileLink(user: {
  username?: string | null;
  github_username?: string | null;
}) {
  return `/profile/${user.username || user.github_username}`;
}

export function getProfileHandle(user: {
  github_username?: string | null;
  username?: string | null;
}) {
  return `@${user.username}`;
}
