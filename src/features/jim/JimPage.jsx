import { useJimPage } from './useJimPage.js'

export default function JimPage() {
  const { cards, error, loadingMessage } = useJimPage()

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      {loadingMessage ? (
        <section className="mx-auto mb-4 max-w-md rounded-3xl border border-sky-100 bg-sky-50 p-4 text-sm text-sky-700 shadow-sm">
          {loadingMessage}
        </section>
      ) : null}

      {error ? (
        <section className="mx-auto mb-4 max-w-md rounded-3xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700 shadow-sm">
          {error}
        </section>
      ) : null}

      <div className="mx-auto flex max-w-md flex-col gap-4">
        {cards.map((item) => (
          <section
            key={item.title}
            className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                {item.avatarInitial}
              </div>
              <h2 className="text-xl font-semibold text-slate-900">{item.title}</h2>
            </div>
            <p className="mt-3 text-base leading-7 text-slate-700">{item.content}</p>
          </section>
        ))}
      </div>
    </main>
  )
}
