export default function Loading() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'rgba(255, 216, 216, 0.31)' }}
    >
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="flex gap-2">
          <div
            className="w-3 h-3 rounded-full animate-bounce"
            style={{ backgroundColor: '#F88379', animationDelay: '0ms' }}
          />
          <div
            className="w-3 h-3 rounded-full animate-bounce"
            style={{ backgroundColor: '#C5E1A5', animationDelay: '150ms' }}
          />
          <div
            className="w-3 h-3 rounded-full animate-bounce"
            style={{ backgroundColor: '#FFFACD', animationDelay: '300ms' }}
          />
        </div>
      </div>
    </div>
  )
}
