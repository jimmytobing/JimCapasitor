import { useLocation, useNavigate } from 'react-router-dom'
import { getStoredUsername } from '../../shared/auth/session.js'
import UserAvatar from '../../shared/components/UserAvatar.jsx'
import { useJimPage } from './useJimPage.js'

export default function JimPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { cards, error, loadingMessage } = useJimPage()
  const storedUsername = getStoredUsername()

  function handleCardClick(item) {
    navigate(`/${item.id}`, {
      state: {
        from: location.pathname,
        objectApiName: 'Account',
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

      <section className="mx-auto mb-4 max-w-md rounded-3xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Stored Username</p>
        <p className="mt-2 select-text font-medium text-slate-900">{storedUsername || '-'}</p>
      </section>

      <div className="mx-auto flex max-w-md flex-col gap-4">
        {cards.map((item) => (
          <section key={item.id} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <button
              type="button"
              className="block w-full cursor-pointer text-left transition hover:bg-slate-50"
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
            </button>
            <p className="mt-3 select-text text-xs leading-4 text-red-400">{item.id}</p>
          </section>
        ))}
      </div>
    </main>
  )
}
