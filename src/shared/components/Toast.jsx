export default function Toast({ message, visible }) {
  if (!visible) return null

  return (
    <div
      className="fixed left-1/2 top-[calc(1rem+env(safe-area-inset-top))] z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-lg bg-black px-4 py-2 text-center text-sm text-white shadow"
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  )
}
