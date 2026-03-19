import { useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import BottomStickyNav from '../../shared/components/BottomStickyNav.jsx'
import { chatThreads, circleTitles } from './chatData.js'

export default function ChatPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const circleId = searchParams.get('circle')

  const visibleThreads = useMemo(() => {
    if (!circleId) {
      return chatThreads.filter((thread) => thread.messages.length > 0)
    }
    return chatThreads.filter((thread) => thread.circles?.includes(circleId))
  }, [circleId])

  return (
    <div className="h-screen overflow-y-auto bg-[#edf2f7] hide-scrollbar">
      <div className="min-h-screen pb-28">
        <section className="bg-white shadow-none">
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-800 px-5 pb-8 pt-[calc(1rem+env(safe-area-inset-top)+1rem)] text-white">
            <button
              className="text-sm font-medium text-white/80"
              onClick={() => navigate(circleId ? '/circle-squad' : '/')}
            >
              {'< Back'}
            </button>
            <h1 className="text-2xl font-semibold">Chat</h1>
            <p className="mt-2 max-w-[24rem] text-sm leading-6 text-white/85">
              {circleId && circleTitles[circleId]
                ? `List chat untuk ${circleTitles[circleId]}. Klik salah satu untuk buka percakapan.`
                : 'Mulai dari list chat, lalu buka percakapan untuk lihat tek-tokan yang panjang.'}
            </p>
          </div>

          <div className="space-y-4 p-3">
            <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">Chat list</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {circleId && circleTitles[circleId]
                      ? `Teman-teman di ${circleTitles[circleId]}.`
                      : 'Pilih salah satu untuk masuk ke tampilan chat masing-masing.'}
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {visibleThreads.length} threads
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {visibleThreads.map((thread) => (
                  <button
                    key={thread.id}
                    className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left shadow-sm ring-1 transition ${
                      thread.inactive
                        ? 'bg-slate-100 ring-slate-200 hover:bg-slate-200'
                        : 'bg-slate-50 ring-slate-100 hover:bg-slate-100'
                    }`}
                    onClick={() =>
                      navigate(
                        circleId ? `/chat/${thread.id}?circle=${circleId}` : `/chat/${thread.id}`
                      )
                    }
                  >
                    <div
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${thread.avatarTone} text-base font-semibold text-white shadow-sm`}
                    >
                      {thread.avatar}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p
                          className={`truncate text-base font-semibold ${
                            thread.inactive ? 'text-slate-500' : 'text-slate-900'
                          }`}
                        >
                          {thread.name}
                        </p>
                        {thread.inactive ? (
                          <span className="rounded-full bg-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                            inactive
                          </span>
                        ) : thread.time ? (
                          <span className="text-xs font-medium text-slate-400">{thread.time}</span>
                        ) : null}
                      </div>
                      {thread.preview ? (
                        <p className="mt-1 truncate text-sm text-slate-500">{thread.preview}</p>
                      ) : (
                        <p className="mt-1 text-sm text-slate-300"> </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
      <BottomStickyNav />
    </div>
  )
}
