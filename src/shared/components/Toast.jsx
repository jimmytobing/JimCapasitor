export default function Toast({ message, visible }) {
  if (!visible) return null

  return (
    <div
      className="fixed top-[calc(1rem+env(safe-area-inset-top))] left-1/2 z-50 -translate-x-1/2 rounded-lg bg-black px-4 py-2 text-sm text-white shadow"
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  )
}
