'use client'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-gray-300 font-sans antialiased">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center space-y-6">
            {/* Error Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
            </div>

            {/* Error Content */}
            <div className="space-y-3">
              <h1 className="text-xl font-semibold text-gray-100 tracking-tight">
                Something went wrong
              </h1>

              <p className="text-sm text-gray-400 leading-relaxed">
                We encountered an unexpected error while processing your
                request. Our team has been notified and is working to resolve
                the issue.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={reset}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
