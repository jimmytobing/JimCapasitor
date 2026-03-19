import { useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { chatThreads, circleTitles } from './chatData.js'

export default function ChatDetailPage() {
  const navigate = useNavigate()
  const { threadId } = useParams()
  const [searchParams] = useSearchParams()
  const [draft, setDraft] = useState('')
  const circleId = searchParams.get('circle')

  const thread = useMemo(
    () => chatThreads.find((item) => item.id === threadId) ?? null,
    [threadId]
  )

  if (!thread) {
    return (
      <div className="min-h-screen bg-[#edf2f7] p-4 pt-[calc(1rem+env(safe-area-inset-top))]">
        <button className="text-sm font-medium text-slate-600" onClick={() => navigate('/chat')}>
          {'< Back'}
        </button>
        <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm">Chat tidak ditemukan.</div>
      </div>
    )
  }

  return (
    <div className="h-screen overflow-y-auto bg-[#edf2f7] hide-scrollbar">
      <div className="min-h-screen">
        <section className="bg-white shadow-none">
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-800 px-5 pb-6 pt-[calc(1rem+env(safe-area-inset-top)+1rem)] text-white">
            <button
              className="text-sm font-medium text-white/80"
              onClick={() => navigate(circleId ? `/chat?circle=${circleId}` : '/chat')}
            >
              {'< Back'}
            </button>
            <div className="mt-3 flex items-center gap-3">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${thread.avatarTone} text-sm font-semibold text-white`}
              >
                {thread.avatar}
              </div>
              <div>
                <h1 className="text-xl font-semibold">{thread.name}</h1>
                <p className="text-sm text-white/75">
                  {thread.inactive
                    ? 'member non-aktif'
                    : thread.time
                      ? `last seen ${thread.time}`
                      : 'belum ada chat'}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 bg-[#e5ddd5] p-3 pb-36">
            {thread.messages.length === 0 && (
              <div className="rounded-2xl bg-white p-4 text-center text-sm text-slate-500 shadow-sm">
                Belum ada chat terakhir
                {circleId && circleTitles[circleId] ? ` di ${circleTitles[circleId]}` : ''}.
              </div>
            )}
            {thread.messages.map((message) => {
              const isMe = message.from === 'me'
              return (
                <div
                  key={message.id}
                  className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  {!isMe && (
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${thread.avatarTone} text-xs font-semibold text-white shadow-sm`}
                    >
                      {thread.avatar}
                    </div>
                  )}
                  <div
                    className={`max-w-[78%] rounded-[20px] px-4 py-3 shadow-sm ${
                      isMe
                        ? 'rounded-br-md bg-[#dcf8c6] text-slate-800'
                        : 'rounded-bl-md bg-white text-slate-800'
                    }`}
                  >
                    {!isMe && <p className="mb-1 text-xs font-semibold text-sky-700">{thread.name}</p>}
                    <p className="text-sm leading-6">{message.text}</p>
                    <p className="mt-1 text-right text-[11px] text-slate-400">{message.time}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="fixed bottom-0 left-0 right-0 z-40 w-full border-t border-slate-200 bg-white px-3 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-8px_20px_rgba(0,0,0,0.08)]">
            <div className="mx-3 flex items-end gap-2">
              <button
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-lg text-slate-600"
                aria-label="Attachment"
                type="button"
              >
                📎
              </button>
              <button
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-lg text-slate-600"
                aria-label="Photo"
                type="button"
              >
                📷
              </button>
              <div className="flex-1 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-2">
                <input
                  className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  placeholder="Ketik pesan..."
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                />
              </div>
              <button
                className="rounded-full bg-blue-600 px-4 py-3 text-sm font-semibold text-white"
                type="button"
              >
                Send
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
