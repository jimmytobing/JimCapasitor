export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <section className="w-full max-w-sm rounded-[2rem] bg-white/85 p-8 text-center shadow-xl shadow-slate-300/40 ring-1 ring-white/70 backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Home</p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-950">Welcome to WPA App</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Your Progressive Web App shell is installed and ready for the next feature pass.
        </p>
      </section>
    </main>
  )
}
