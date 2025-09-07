'use server'

import { octokit } from '@/utils'

interface Props {
  repo: string
  path: string
}

export const getMarkdown = async ({ repo, path }: Props) => {
  const res = await octokit.request(
    'GET /repos/{owner}/{repo}/contents/{path}',
    {
      owner: process.env.GITHUB_USERNAME!,
      repo,
      path,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    }
  )

  if (res.status != 200) {
    throw new Error('Failed to fetch data from GitHub')
  }

  return res.data as { content: string }
}
