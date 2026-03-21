import { useLoginPage } from './useLoginPage.js'

export default function LoginPage() {
  const {
    username,
    setUsername,
    password,
    setPassword,
    status,
    isReady,
    isLoading,
    handleGoogleLogin,
    handleFakeLogin,
  } = useLoginPage()

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050816] px-5 py-8 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_transparent_28%),radial-gradient(circle_at_bottom,_rgba(249,115,22,0.2),_transparent_34%),linear-gradient(180deg,_#050816_0%,_#10162f_48%,_#050816_100%)]" />
      <div className="absolute -left-12 top-20 h-36 w-36 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="absolute -right-10 top-32 h-44 w-44 rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="absolute bottom-16 left-8 h-28 w-28 rounded-full bg-orange-400/20 blur-3xl" />

      <section className="relative z-10 w-full max-w-sm overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 shadow-[0_24px_80px_rgba(15,23,42,0.45)] backdrop-blur-xl">
        <div className="border-b border-white/10 bg-gradient-to-r from-cyan-400/90 via-sky-500/90 to-fuchsia-500/90 px-6 pb-16 pt-6 text-slate-950">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-black/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-950">
              HypeZone Mode
            </span>
            <span className="rounded-full bg-white/30 px-3 py-1 text-xs font-semibold text-slate-950">
              Fake Auth
            </span>
          </div>

          <div className="mt-6 max-w-[16rem]">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-950/70">
              Login Gate
            </p>
            <h1 className="mt-3 text-4xl font-black leading-none text-slate-950">
              Back to your zone.
            </h1>
            <p className="mt-4 text-sm leading-6 text-slate-950/75">
              Masuk dulu buat lanjut ke app. Sekarang masih fake auth, jadi username dan password
              bebas untuk testing.
            </p>
          </div>
        </div>

        <div className="-mt-10 px-5 pb-6">
          <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/90 p-5 shadow-2xl shadow-black/30">
            <div className="flex items-start gap-4">
              <div className="install-float flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-cyan-400 to-fuchsia-500 text-2xl font-black text-white shadow-lg shadow-cyan-500/20">
                in
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
                  Sign In
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Pakai fake credential dulu untuk test flow masuk ke Home tanpa backend auth.
                </p>
              </div>
            </div>

            <form onSubmit={handleFakeLogin} className="mt-5 space-y-4">
              <div className="space-y-2 text-left">
                <label htmlFor="username" className="block text-sm font-medium text-slate-300">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="Enter your username"
                  className="w-full rounded-[1.2rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/60 focus:bg-white/10"
                />
              </div>

              <div className="space-y-2 text-left">
                <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-[1.2rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/60 focus:bg-white/10"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-[1.4rem] bg-gradient-to-r from-cyan-400 via-sky-500 to-fuchsia-500 px-5 py-4 text-base font-black uppercase tracking-[0.2em] text-slate-950 shadow-[0_18px_40px_rgba(59,130,246,0.35)] transition active:scale-[0.98]"
              >
                Login Now
              </button>
            </form>

            <div className="my-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs font-medium uppercase tracking-[0.24em] text-slate-500">
                or
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={!isReady || isLoading}
              className="flex w-full items-center justify-center gap-3 rounded-[1.2rem] border border-white/10 bg-white/5 px-5 py-4 text-base font-semibold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-bold text-[#4285F4]">
                G
              </span>
              <span>{isLoading ? 'Connecting...' : 'Continue with Google'}</span>
            </button>

            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6 text-slate-300">
              Untuk test ulang login page, buka URL dengan <span className="font-semibold text-cyan-300">?resetAuth=1</span>
            </div>

            {status ? (
              <div className="mt-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm leading-6 text-cyan-100">
                {status}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  )
}
