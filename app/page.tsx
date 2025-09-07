import { PostForm } from '@/components/post-form'
import { RepoList } from '@/components/repo-list'
import { getAllRepo } from '@/server-actions/get-all-repo'

export default async function Home() {
  const repoContents = await getAllRepo({ limit: 10 })

  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <PostForm />
        <RepoList repoContents={repoContents} />
        <div className="py-10" />
      </div>
    </main>
  )
}
