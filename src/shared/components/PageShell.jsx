export default function PageShell({ children, className = '' }) {
  return (
    <div
      className={`mx-auto max-w-[420px] space-y-4 p-4 pt-[calc(1rem+env(safe-area-inset-top))] pb-[calc(4rem+env(safe-area-inset-bottom))] ${className}`}
    >
      {children}
    </div>
  )
}
