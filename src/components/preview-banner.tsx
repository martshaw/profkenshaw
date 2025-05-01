"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"

interface PreviewBannerProps {
  isDraft?: boolean
}

export default function PreviewBanner({ isDraft }: PreviewBannerProps) {
  const pathname = usePathname()

  if (!isDraft) return null

  return (
    <div className="bg-blue-600 text-white py-2 px-4 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-14-14zM2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm10-2a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V5a1 1 0 00-1-1h-4z"
            clipRule="evenodd"
          />
        </svg>
        <span className="font-semibold">Preview Mode</span>
      </div>
      <Link
        href={`/api/disable-draft?path=${encodeURIComponent(pathname)}`}
        className="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium hover:bg-blue-50 transition-colors"
      >
        Exit Preview
      </Link>
    </div>
  )
}
