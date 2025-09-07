import { useState } from 'react'
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'

export interface Draft {
  id: string
  title: string
  content: string
}

export function DraftCard({
  draft: { title, content },
  onDelete,
  onUpdate
}: {
  draft: Draft
  onDelete: () => void
  onUpdate: () => void
}) {
  const [isExpand, setIsExpand] = useState(false)

  return (
    <div className="border border-[#3d444d] rounded-md p-2 transition-all">
      <div className="grid grid-cols-[1fr_auto]">
        <div className="cursor-pointer flex items-center">
          <button
            onClick={() => {
              setIsExpand((prev) => !prev)
            }}
            className="flex items-center w-full h-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={
                isExpand
                  ? 'rotate-90 transition-transform'
                  : 'transition-transform'
              }
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M9 6l6 6l-6 6" />
            </svg>
            <h2 className="text-sm font-medium">{title}</h2>
          </button>
        </div>
        <div className="text-[#c1c1c1] flex items-center [&>button]:rounded-md [&>button]:p-1 [&>button]:hover:bg-white/5">
          <button onClick={onUpdate} type="button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon-pencil"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
              <path d="M13.5 6.5l4 4" />
            </svg>
          </button>
          <button onClick={onDelete} type="button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon-trash"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M4 7l16 0" />
              <path d="M10 11l0 6" />
              <path d="M14 11l0 6" />
              <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
              <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
            </svg>
          </button>
        </div>
      </div>
      {isExpand && (
        <div className="mt-2">
          <div className="markdown-body rounded-md p-2 lg:p-4">
            <Markdown
              rehypePlugins={[rehypeRaw, rehypeSanitize]}
              remarkPlugins={[remarkGfm]}
            >
              {content}
            </Markdown>
          </div>
        </div>
      )}
    </div>
  )
}
