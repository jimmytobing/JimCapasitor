import { useNavigate } from 'react-router-dom'
import UserAvatar from '../../shared/components/UserAvatar.jsx'
import { useJimPage } from './useJimPage.js'

export default function JimPage() {
  const navigate = useNavigate()
  const { cards, error, loadingMessage } = useJimPage()

  function handleCardClick(item) {
    navigate('/jim/edit', {
      state: {
        record: item,
      },
    })
  }

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
            key={item.id}
            className="cursor-pointer rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
            onClick={() => handleCardClick(item)}
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-full">
                <UserAvatar
                  name={item.title}
                  initial={item.avatarInitial}
                  tone="from-slate-700 to-slate-900"
                />
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
