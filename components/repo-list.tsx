'use client'

import { RepoRes } from '@/server-actions/get-all-repo'
import Link from 'next/link'
import { useState } from 'react'

export function RepoList({ repoContents }: { repoContents: RepoRes[] }) {
  return (
    <div className="max-w-3xl mx-auto mt-2">
      <div>
        <h1 className="uppercase text-[#eee7e7] font-semibold text-2xl">
          Repositories
        </h1>
      </div>
      <div className="text-[#eee7e7] space-y-4 mt-4">
        {repoContents.map((rc) => {
          return <RepoCard key={rc.repo} {...rc} />
        })}
      </div>
    </div>
  )
}

function RepoCard({ repo, src_files }: RepoRes) {
  const [isExpand, setIsExpand] = useState(false)
  return (
    <div className="border border-[#3d444d] rounded-md  transition-all">
      <div
        onClick={() => {
          setIsExpand((prev) => !prev)
        }}
        className="cursor-pointer grid grid-cols-[1fr_auto] p-2"
      >
        <div className="grid grid-cols-[auto_1fr] items-center gap-1 w-full h-full">
          <svg
            fill="currentColor"
            aria-hidden="true"
            height="16"
            viewBox="0 0 16 16"
            version="1.1"
            width="16"
            data-view-component="true"
            className="octicon octicon-repo UnderlineNav-octicon size-4"
          >
            <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"></path>
          </svg>
          <h2 className="text-sm font-medium">{repo}</h2>
        </div>
        <div>
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
        </div>
      </div>

      {isExpand && (
        <div className="flex flex-col gap-1 p-2">
          {src_files.map((sf) => (
            <Link
              key={sf.name}
              href={`/${repo}/${sf.path}`}
              className="text-blue-400 flex items-center gap-1"
            >
              <svg
                aria-hidden="true"
                focusable="false"
                className="octicon octicon-file color-fg-muted"
                viewBox="0 0 16 16"
                width="16"
                height="16"
                fill="currentColor"
                display="inline-block"
                overflow="visible"
              >
                <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 9 4.25V1.5Zm6.75.062V4.25c0 .138.112.25.25.25h2.688l-.011-.013-2.914-2.914-.013-.011Z"></path>
              </svg>
              {sf.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
