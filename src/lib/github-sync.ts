import { GitHubAPI } from './github'
import { supabase, type Profile } from './supabase'
import { marked } from 'marked'

export async function syncGitHubProfile(userId: string, providerToken: string) {
    const github = new GitHubAPI(providerToken)
    const githubUser = await github.getUser()

    let repos: any[] = []
    let readmeHtml: string | null = null
    let markdown: string | null = null  // <-- declare here

    try {
        repos = await github.getRepos(githubUser.login, 6)
    } catch (e) {
        console.warn('Failed to fetch repos', e)
    }

    try {
        const readmeResponse = await github.getReadme(githubUser.login)
        markdown = Buffer.from(readmeResponse.content, 'base64').toString('utf-8')
        readmeHtml = await marked.parse(markdown)
    } catch (e) {
        console.warn('Failed to fetch README', e)
    }

    await supabase.from('profiles').update({
        avatar_url: githubUser.avatar_url,
        name: githubUser.name,
        bio: githubUser.bio,
        public_repos: githubUser.public_repos,
        followers_count: githubUser.followers,
        following_count: githubUser.following,
        repos,
        readme_html: readmeHtml,
        readme_markdown: markdown,
        updated_at: new Date().toISOString(),
        github_synced_at: new Date().toISOString(),
    }).eq('id', userId)
}

export function shouldSyncProfile(profile: Profile): boolean {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    return !profile.updated_at || new Date(profile.updated_at) < oneHourAgo
}
