export interface GitHubUser {
    login: string;
    id: number;
    avatar_url: string;
    name: string;
    bio: string;
    public_repos: number;
    followers: number;
    following: number;
    html_url: string;
    location?: string;
    blog?: string;
    twitter_username?: string;
}

export interface GitHubRepo {
    id: number;
    name: string;
    full_name: string;
    description: string;
    html_url: string;
    stargazers_count: number;
    forks_count: number;
    language: string;
    updated_at: string;
}

export interface GitHubEvent {
    id: string;
    type: string;
    actor: {
        login: string;
        avatar_url: string;
    };
    repo: {
        name: string;
        url: string;
    };
    payload: any;
    created_at: string;
}

export class GitHubAPI {
    private token: string;

    constructor(token: string) {
        this.token = token;
    }

    private async fetch(endpoint: string) {
        const response = await fetch(`https://api.github.com${endpoint}`, {
            headers: {
                Authorization: `Bearer ${this.token}`,
                Accept: 'application/vnd.github.v3+json',
            },
        });

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.statusText}`);
        }

        return response.json();
    }

    async getUser(username?: string): Promise<GitHubUser> {
        const endpoint = username ? `/users/${username}` : '/user';
        return this.fetch(endpoint);
    }

    async getRepos(username: string, limit = 6): Promise<GitHubRepo[]> {
        return this.fetch(`/users/${username}/repos?sort=updated&per_page=${limit}`);
    }

    async getActivity(username: string, limit = 20): Promise<GitHubEvent[]> {
        return this.fetch(`/users/${username}/events/public?per_page=${limit}`);
    }
}

export function formatEventDescription(event: GitHubEvent): string {
    const repo = event.repo.name;

    switch (event.type) {
        case 'PushEvent':
            const commits = event.payload.commits?.length || 0;
            return `Pushed ${commits} commit${commits > 1 ? 's' : ''} to ${repo}`;
        case 'CreateEvent':
            return `Created ${event.payload.ref_type} in ${repo}`;
        case 'WatchEvent':
            return `Starred ${repo}`;
        case 'ForkEvent':
            return `Forked ${repo}`;
        case 'PullRequestEvent':
            return `${event.payload.action} pull request in ${repo}`;
        case 'IssuesEvent':
            return `${event.payload.action} issue in ${repo}`;
        case 'IssueCommentEvent':
            return `Commented on issue in ${repo}`;
        case 'PullRequestReviewEvent':
            return `Reviewed pull request in ${repo}`;
        default:
            return `Activity in ${repo}`;
    }
}