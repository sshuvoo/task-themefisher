import { getMarkdown } from '@/server-actions/get-markdown'
import { fromBase64 } from '@/utils'
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'

type Params = Promise<{ repo: string; path: string }>

export default async function Page({ params }: { params: Params }) {
  const { repo, path } = await params

  const data = await getMarkdown({ repo, path })
  const content = fromBase64(data.content || '')

  return (
    <main className="bg-[#212830] min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="markdown-body p-2 sm:p-6 md:p-8 lg:p-12 xl:p-16">
          <Markdown
            rehypePlugins={[rehypeRaw, rehypeSanitize]}
            remarkPlugins={[remarkGfm]}
          >
            {content}
          </Markdown>
        </div>
      </div>
    </main>
  )
}
