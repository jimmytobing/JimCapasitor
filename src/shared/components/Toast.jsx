export default function Toast({ message, visible }) {
  if (!visible) return null

  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 rounded-lg bg-black px-4 py-2 text-sm text-white shadow"
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  )
}
