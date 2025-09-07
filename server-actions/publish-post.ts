'use server'

import { Draft } from '@/components/draft-card'
import { toBase64 } from '@/utils'
import { Octokit } from 'octokit'

export const publishPosts = async (drafts: Draft[], commitMsg: string) => {
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN!
  })

  const faildIndices: number[] = []
  const results = await Promise.all(
    drafts.map((draft) => {
      const titleArray = draft.title.trim().split(' ')
      const path =
        (titleArray.length > 3 ? titleArray.slice(0, 3) : titleArray)
          .join('_')
          .toUpperCase() + '.md'
      return octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
        owner: process.env.GITHUB_USERNAME!,
        repo: process.env.GITHUB_REPO!,
        path: path,
        message: commitMsg,
        committer: {
          name: process.env.COMMITTER_NAME!,
          email: process.env.COMMITTER_EMAIL!
        },
        content: toBase64(draft.title + '\n\n' + draft.content),
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      })
    })
  )
  for (let i = 0; i < results.length; i++) {
    if (results[i].status != 201) {
      faildIndices.push(i)
    }
  }

  if (results.every((r) => r.status != 201)) {
    throw new Error('No post is commited due to unexpected error')
  }

  return faildIndices
}
