'use client'

import { useEffect } from 'react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function MarkdownError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Markdown page error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-6">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01"
              />
            </svg>
          </div>
        </div>

        {/* Main Error Message */}
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold text-gray-100 tracking-tight">
            Content Unavailable
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed max-w-lg mx-auto">
            The requested markdown content could not be loaded. This may be due
            to a network issue, invalid content format, or the file may no
            longer exist.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
          <button
            onClick={reset}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-100 text-sm font-medium rounded-md border border-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-gray-950"
          >
            Try Again
          </button>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 text-gray-400 hover:text-gray-300 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-gray-950 rounded-md"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}
