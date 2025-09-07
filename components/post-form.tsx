'use client'

import { usePersist } from '@/hooks/use-persist'
import { publishPosts } from '@/server-actions/publish-post'
import { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'
import { type Draft, DraftCard } from './draft-card'
import { useRouter } from 'next/navigation'

type Tool = 'H' | 'B' | 'I' | 'Q' | 'C' | 'L'

export function PostForm() {
  const [drafts, setDrafts] = usePersist<Draft[]>({
    key: 'draft',
    def: []
  })
  const [preview, setPreview] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [updateId, setUpdateId] = useState<string | null>(null)
  const [commitMsg, setCommitMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()
  const handleSaveDraft = () => {
    if (updateId == null) {
      // create
      setDrafts((prev) => [
        ...prev,
        { id: crypto.randomUUID(), title, content }
      ])
    } else {
      // update
      setDrafts((prev) =>
        prev.map((d) =>
          d.id == updateId ? { id: updateId, title, content } : d
        )
      )
    }
    toast.success('A new post saved locally')
    // reset everything
    handleReset()
  }

  const handleReset = () => {
    setUpdateId(null)
    setTitle('')
    setContent('')
  }

  const handleUpdateDraft = (post: Draft) => {
    setTitle(post.title)
    setContent(post.content)
    setUpdateId(post.id)
  }

  const handleInsertSyntax = (tool: Tool) => {
    const textarea = textareaRef.current!
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const before = content.slice(0, start)
    const selection = content.slice(start, end)
    const after = content.slice(end)

    let newContent = ''
    if (tool == 'H') {
      const split = before.split('\n')
      split[split.length - 1] = '### ' + split[split.length - 1]
      newContent = split.join('\n') + after
      setContent(newContent)
      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4
        textarea.focus()
      })
    } else if (tool == 'B') {
      newContent = before + '**' + selection + '**' + after
      setContent(newContent)
      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd =
          start + 2 + selection.length
        textarea.focus()
      })
    } else if (tool == 'I') {
      newContent = before + '_' + selection + '_' + after
      setContent(newContent)
      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd =
          start + 1 + selection.length
        textarea.focus()
      })
    } else if (tool == 'Q') {
      const row = before.split('\n').length
      const split = content.split('\n')
      let cusor = 0
      for (let i = 0; i < row; i++) {
        cusor += split[i].length
      }
      split.splice(row, 0, '> ')
      newContent = split.join('\n')
      setContent(newContent)
      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = cusor + 4
        textarea.focus()
      })
    }
  }

  const handleCommit = async () => {
    setIsLoading(true)
    try {
      const faildIndices = await publishPosts(drafts, commitMsg)
      setDrafts((prev) => prev.filter((_, i) => faildIndices.includes(i)))
      setCommitMsg('')
      toast.success('Successfully publish')
      router.refresh()
    } catch (error) {
      console.log(error)
      toast.error('Something went wrong!')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-4 md:py-10">
      <div>
        <h1 className="uppercase text-[#eee7e7] font-semibold text-2xl">
          {updateId ? 'Update Post' : 'Add new post'}
        </h1>
      </div>
      <div className="border border-[#3d444d] rounded-md mt-4">
        <div className="bg-[#262c36] rounded-tl-md rounded-tr-md grid grid-cols-[auto_1fr] items-center">
          <div className="flex items-center">
            <button
              onClick={() => {
                setPreview(false)
              }}
              className={`text-sm font-medium py-2 px-3 text-[#ddd6d6] rounded-tl-md ${
                preview
                  ? 'bg-[#262c36] border-b border-r border-[#3d444d] rounded-br-md'
                  : 'bg-[#212830]'
              }`}
              type="button"
            >
              Write
            </button>
            <button
              onClick={() => {
                setPreview(true)
              }}
              className={`text-sm font-medium py-2 px-3 text-[#ddd6d6] ${
                preview
                  ? 'bg-[#212830]'
                  : 'border-b border-l border-[#3d444d] rounded-bl-md'
              }`}
              type="button"
            >
              Preview
            </button>
          </div>
          <div
            className={`text-[#dcdcdc] flex justify-end items-center border-b border-[#3d444d] h-full ${
              preview ? 'border-b border-l border-[#3d444d] rounded-bl-md' : ''
            }`}
          >
            {!preview && (
              <div className="flex items-center mr-2 [&>button]:px-2 [&>button]:py-1 [&>button]:hover:bg-white/5 [&>button]:rounded-md">
                <button
                  onClick={handleInsertSyntax.bind(null, 'H')}
                  type="button"
                >
                  <svg
                    fill="currentColor"
                    aria-hidden="true"
                    height="16"
                    viewBox="0 0 16 16"
                    version="1.1"
                    width="16"
                    data-view-component="true"
                    className="octicon octicon-heading Button-visual"
                  >
                    <path d="M3.75 2a.75.75 0 0 1 .75.75V7h7V2.75a.75.75 0 0 1 1.5 0v10.5a.75.75 0 0 1-1.5 0V8.5h-7v4.75a.75.75 0 0 1-1.5 0V2.75A.75.75 0 0 1 3.75 2Z"></path>
                  </svg>
                </button>
                <button
                  onClick={handleInsertSyntax.bind(null, 'B')}
                  type="button"
                >
                  <svg
                    fill="currentColor"
                    aria-hidden="true"
                    height="16"
                    viewBox="0 0 16 16"
                    version="1.1"
                    width="16"
                    data-view-component="true"
                    className="octicon octicon-bold Button-visual"
                  >
                    <path d="M4 2h4.5a3.501 3.501 0 0 1 2.852 5.53A3.499 3.499 0 0 1 9.5 14H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Zm1 7v3h4.5a1.5 1.5 0 0 0 0-3Zm3.5-2a1.5 1.5 0 0 0 0-3H5v3Z"></path>
                  </svg>
                </button>
                <button
                  onClick={handleInsertSyntax.bind(null, 'I')}
                  type="button"
                >
                  <svg
                    fill="currentColor"
                    aria-hidden="true"
                    height="16"
                    viewBox="0 0 16 16"
                    version="1.1"
                    width="16"
                    data-view-component="true"
                    className="octicon octicon-italic Button-visual"
                  >
                    <path d="M6 2.75A.75.75 0 0 1 6.75 2h6.5a.75.75 0 0 1 0 1.5h-2.505l-3.858 9H9.25a.75.75 0 0 1 0 1.5h-6.5a.75.75 0 0 1 0-1.5h2.505l3.858-9H6.75A.75.75 0 0 1 6 2.75Z"></path>
                  </svg>
                </button>
                <button
                  onClick={handleInsertSyntax.bind(null, 'Q')}
                  type="button"
                >
                  <svg
                    fill="currentColor"
                    aria-hidden="true"
                    height="16"
                    viewBox="0 0 16 16"
                    version="1.1"
                    width="16"
                    data-view-component="true"
                    className="octicon octicon-quote Button-visual"
                  >
                    <path d="M1.75 2.5h10.5a.75.75 0 0 1 0 1.5H1.75a.75.75 0 0 1 0-1.5Zm4 5h8.5a.75.75 0 0 1 0 1.5h-8.5a.75.75 0 0 1 0-1.5Zm0 5h8.5a.75.75 0 0 1 0 1.5h-8.5a.75.75 0 0 1 0-1.5ZM2.5 7.75v6a.75.75 0 0 1-1.5 0v-6a.75.75 0 0 1 1.5 0Z"></path>
                  </svg>
                </button>
                <button
                  onClick={handleInsertSyntax.bind(null, 'C')}
                  type="button"
                >
                  <svg
                    fill="currentColor"
                    aria-hidden="true"
                    height="16"
                    viewBox="0 0 16 16"
                    version="1.1"
                    width="16"
                    data-view-component="true"
                    className="octicon octicon-code Button-visual"
                  >
                    <path d="m11.28 3.22 4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734L13.94 8l-3.72-3.72a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215Zm-6.56 0a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042L2.06 8l3.72 3.72a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L.47 8.53a.75.75 0 0 1 0-1.06Z"></path>
                  </svg>
                </button>
                <button
                  onClick={handleInsertSyntax.bind(null, 'L')}
                  type="button"
                >
                  <svg
                    fill="currentColor"
                    aria-hidden="true"
                    height="16"
                    viewBox="0 0 16 16"
                    version="1.1"
                    width="16"
                    data-view-component="true"
                    className="octicon octicon-link Button-visual"
                  >
                    <path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path>
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
        {preview ? (
          <div className="p-2">
            <div className="markdown-body rounded-md p-2 lg:p-4">
              <Markdown
                rehypePlugins={[rehypeRaw, rehypeSanitize]}
                remarkPlugins={[remarkGfm]}
              >
                {content ? content : 'Nothing to preview'}
              </Markdown>
            </div>
          </div>
        ) : (
          <div className="p-2 space-y-2">
            <input
              value={title}
              onChange={(ev) => setTitle(ev.target.value)}
              placeholder="Post title"
              className="border border-[#3d444d] w-full h-10 focus:outline-none focus:border-transparent rounded-md focus:ring-2 focus:ring-[#316dca] text-[#dcdcdc] p-2 text-sm font-medium block"
              name="post-title"
            />
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(ev) => setContent(ev.target.value)}
              name="post-content"
              className="resize-none field-sizing-content border border-[#3d444d] w-full min-h-60 focus:outline-none focus:border-transparent rounded-md focus:ring-2 focus:ring-[#316dca] text-[#dcdcdc] p-2 text-sm font-medium block max-h-[calc(100vh-300px)]"
              placeholder="Write your content here"
              required
            />
          </div>
        )}

        <div className="text-[#dcdcdc] flex items-center gap-1 p-2 pt-0">
          <svg
            aria-hidden="true"
            height="16"
            viewBox="0 0 16 16"
            version="1.1"
            width="16"
            fill="currentColor"
            data-view-component="true"
            className="octicon octicon-markdown"
          >
            <path d="M14.85 3c.63 0 1.15.52 1.14 1.15v7.7c0 .63-.51 1.15-1.15 1.15H1.15C.52 13 0 12.48 0 11.84V4.15C0 3.52.52 3 1.15 3ZM9 11V5H7L5.5 7 4 5H2v6h2V8l1.5 1.92L7 8v3Zm2.99.5L14.5 8H13V5h-2v3H9.5Z" />
          </svg>
          <p className="text-xs font-medium">Markdown is supported</p>
        </div>
      </div>
      <div className="mt-2 flex justify-end items-center gap-2">
        {updateId != null && (
          <button
            onClick={handleReset}
            className="capitalize text-sm rounded-md text-[#2d2d2d] font-semibold bg-[#a07777] hover:bg-[#cb7070] py-[6px] px-[10px] cursor-pointer transition-colors disabled:bg-gray-500"
          >
            Cancel
          </button>
        )}

        <button
          onClick={handleSaveDraft}
          disabled={title.trim() == '' || content.trim() == ''}
          className="capitalize text-sm rounded-md text-[#2d2d2d] font-semibold bg-green-600 hover:bg-green-500 py-[6px] px-[10px] cursor-pointer transition-colors disabled:bg-gray-500"
        >
          Save To Draft
        </button>
      </div>
      {drafts.length > 0 && (
        <div className="mt-8">
          <h1 className="uppercase text-[#eee7e7] font-semibold text-2xl">
            All drafts
          </h1>
          <div className="text-[#eee7e7] space-y-4 mt-4">
            {drafts.map((draft) => (
              <DraftCard
                key={draft.id}
                draft={draft}
                onDelete={() => {
                  setDrafts((prev) => prev.filter((d) => d.id != draft.id))
                }}
                onUpdate={handleUpdateDraft.bind(null, draft)}
              />
            ))}
          </div>
        </div>
      )}
      {drafts.length > 0 && (
        <div className="mt-2 grid grid-cols-[1fr_auto] items-center gap-2">
          <input
            value={commitMsg}
            onChange={(ev) => setCommitMsg(ev.target.value)}
            placeholder="Write a commit message to publish all"
            className="border border-[#3d444d] h-8 focus:outline-none focus:border-transparent rounded-md focus:ring-2 focus:ring-[#316dca] text-[#dcdcdc] p-2 text-sm font-medium block"
            name="commit-massage"
          />
          <button
            onClick={handleCommit}
            disabled={commitMsg.trim() == ''}
            className="capitalize text-sm rounded-md text-[#2d2d2d] font-semibold bg-green-600 hover:bg-green-500 py-[6px] px-[10px] cursor-pointer transition-colors disabled:bg-gray-500"
          >
            {isLoading ? 'Loading...' : 'Publish All'}
          </button>
        </div>
      )}
    </div>
  )
}
