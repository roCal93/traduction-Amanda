import { draftMode } from 'next/headers'
import Link from 'next/link'

export async function DraftModeIndicator() {
  const { isEnabled } = await draftMode()

  if (!isEnabled) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-yellow-400 text-black px-4 py-2 rounded-lg shadow-lg flex items-center gap-3">
      <span className="font-semibold">📝 Mode Preview</span>
      <Link
        href="/api/draft/disable"
        className="bg-black text-white px-3 py-1 rounded text-sm hover:bg-gray-800 transition"
      >
        Quitter
      </Link>
    </div>
  )
}
