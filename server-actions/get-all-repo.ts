'use server'

import { octokit } from '@/utils'

interface Params {
  limit: number
}

export interface RepoRes {
  repo: string
  src_files: {
    name: string
    path: string
    type: 'dir' | 'file' | 'submodule' | 'symlink'
  }[]
}

export const getAllRepo = async ({ limit }: Params): Promise<RepoRes[]> => {
  const repoRes = await octokit.request('GET /users/{username}/repos', {
    username: process.env.GITHUB_USERNAME!,
    type: 'owner',
    sort: 'updated',
    per_page: limit,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })

  if (repoRes.status != 200) {
    throw new Error('Failed to fetch repositories from GitHub')
  }

  const results = await Promise.all(
    repoRes.data.map((repo) => {
      return octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
        owner: process.env.GITHUB_USERNAME!,
        repo: repo.name,
        path: '',
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      })
    })
  )

  const success = results.filter((r) => r.status == 200)

  const contents = success.map((s) => {
    if (Array.isArray(s.data)) {
      const repo = s.data[0].url.split('/')[5]
      const files = s.data.filter(
        (c) => c.type == 'file' && c.name.endsWith('.md')
      )
      const src_files = files.map((f) => ({
        name: f.name,
        path: f.path,
        type: f.type
      }))
      return { repo, src_files }
    } else {
      const repo = s.data.url.split('/')[5]
      return {
        repo,
        src_files: [{ name: s.data.name, path: s.data.path, type: s.data.type }]
      }
    }
  })

  return contents
}
