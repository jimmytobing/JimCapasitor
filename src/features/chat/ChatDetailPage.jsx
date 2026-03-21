import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import UserAvatar from '../../shared/components/UserAvatar.jsx'
import { circleTitles } from './chatData.js'
import { useChatDetailData } from './useChatDetailData.js'

export default function ChatDetailPage({ themeMode = 'default' }) {
  const navigate = useNavigate()
  const { threadId } = useParams()
  const [searchParams] = useSearchParams()
  const circleId = searchParams.get('circle')
  const isBlackTheme = themeMode === 'black'
  const { draft, setDraft, thread } = useChatDetailData(threadId)

  if (!thread) {
    return (
      <div
        className={`min-h-screen p-4 pt-[calc(1rem+env(safe-area-inset-top))] ${
          isBlackTheme ? 'bg-[#050816] text-slate-100' : 'bg-[#edf2f7] text-slate-900'
        }`}
      >
        <button
          className={`text-sm font-medium ${isBlackTheme ? 'text-slate-300' : 'text-slate-600'}`}
          onClick={() => navigate('/chat')}
        >
          {'< Back'}
        </button>
        <div
          className={`mt-4 rounded-2xl p-4 ${
            isBlackTheme
              ? 'border border-white/10 bg-slate-950/80 shadow-[0_24px_80px_rgba(2,6,23,0.45)] backdrop-blur-xl'
              : 'bg-white shadow-sm'
          }`}
        >
          Chat tidak ditemukan.
        </div>
      </div>
    )
  }

  return (
    <div
      className={`h-screen overflow-y-auto hide-scrollbar ${
        isBlackTheme ? 'bg-[#050816] text-slate-100' : 'bg-[#edf2f7] text-slate-900'
      }`}
    >
      <div className="min-h-screen">
        <section className={`${isBlackTheme ? 'bg-transparent' : 'bg-white'} shadow-none`}>
          <div className="sticky top-0 z-30 bg-gradient-to-r from-slate-900 via-slate-800 to-blue-800 px-5 pb-6 pt-[calc(1rem+env(safe-area-inset-top)+1rem)] text-white shadow-sm">
            <button
              className="text-sm font-medium text-white/80"
              onClick={() => navigate(circleId ? `/chat?circle=${circleId}` : '/chat')}
            >
              {'< Back'}
            </button>
            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                className="h-12 w-12 overflow-hidden rounded-full"
                onClick={() => navigate(`/memory-timeline/${thread.id}`)}
              >
                <UserAvatar
                  name={thread.name}
                  image={thread.avatarImage}
                  initial={thread.avatar}
                  tone={thread.avatarTone}
                />
              </button>
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

          <div className={`space-y-3 p-3 pb-36 ${isBlackTheme ? 'bg-[#050816]' : 'bg-[#e5ddd5]'}`}>
            {thread.messages.length === 0 && (
              <div
                className={`rounded-2xl p-4 text-center text-sm ${
                  isBlackTheme
                    ? 'border border-white/10 bg-slate-950/80 text-slate-300 shadow-[0_16px_40px_rgba(2,6,23,0.28)]'
                    : 'bg-white text-slate-500 shadow-sm'
                }`}
              >
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
                    <button
                      type="button"
                      className="h-9 w-9 shrink-0 overflow-hidden rounded-full shadow-sm"
                      onClick={() => navigate(`/memory-timeline/${thread.id}`)}
                    >
                      <UserAvatar
                        name={thread.name}
                        image={thread.avatarImage}
                        initial={thread.avatar}
                        tone={thread.avatarTone}
                      />
                    </button>
                  )}
                  <div
                    className={`max-w-[78%] rounded-[20px] px-4 py-3 ${
                      isMe
                        ? isBlackTheme
                          ? 'rounded-br-md border border-[#2fa96b]/50 bg-[linear-gradient(180deg,rgba(255,255,255,0.16),rgba(255,255,255,0.04)),linear-gradient(135deg,rgba(16,109,57,0.92),rgba(11,107,58,0.78))] text-white shadow-[0_16px_40px_rgba(2,6,23,0.28)] backdrop-blur-xl'
                          : 'rounded-br-md bg-[#dcf8c6] text-slate-800 shadow-sm'
                        : isBlackTheme
                          ? 'rounded-bl-md border border-white/10 bg-slate-950/85 text-slate-100 shadow-[0_16px_40px_rgba(2,6,23,0.28)]'
                          : 'rounded-bl-md bg-white text-slate-800 shadow-sm'
                    }`}
                  >
                    {!isMe && (
                      <p className={`mb-1 text-xs font-semibold ${isBlackTheme ? 'text-cyan-300' : 'text-sky-700'}`}>
                        {thread.name}
                      </p>
                    )}
                    <p className="text-sm leading-6">{message.text}</p>
                    <p
                      className={`mt-1 text-right text-[11px] ${
                        isMe
                          ? isBlackTheme
                            ? 'text-white/70'
                            : 'text-slate-500'
                          : isBlackTheme
                            ? 'text-slate-300'
                            : 'text-slate-400'
                      }`}
                    >
                      {message.time}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          <div
            className={`fixed bottom-0 left-1/2 z-40 w-full max-w-sm -translate-x-1/2 px-3 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] ${
              isBlackTheme
                ? 'border-t border-white/10 bg-slate-950/95 shadow-[0_-8px_20px_rgba(0,0,0,0.28)] backdrop-blur-xl'
                : 'border-t border-slate-200 bg-white shadow-[0_-8px_20px_rgba(0,0,0,0.08)]'
            }`}
          >
            <div className="mx-3 flex items-end gap-2">
              <button
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg ${
                  isBlackTheme
                    ? 'border border-white/10 bg-white/5 text-slate-200'
                    : 'bg-slate-100 text-slate-600'
                }`}
                aria-label="Attachment"
                type="button"
              >
                📎
              </button>
              <button
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg ${
                  isBlackTheme
                    ? 'border border-white/10 bg-white/5 text-slate-200'
                    : 'bg-slate-100 text-slate-600'
                }`}
                aria-label="Photo"
                type="button"
              >
                📷
              </button>
              <div
                className={`flex-1 rounded-3xl px-4 py-2 ${
                  isBlackTheme
                    ? 'border border-white/10 bg-white/5'
                    : 'border border-slate-200 bg-slate-50'
                }`}
              >
                <input
                  className={`w-full bg-transparent text-sm outline-none ${
                    isBlackTheme
                      ? 'text-slate-100 placeholder:text-slate-500'
                      : 'text-slate-800 placeholder:text-slate-400'
                  }`}
                  placeholder="Ketik pesan..."
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                />
              </div>
              <button
                className={`rounded-full px-4 py-3 text-sm font-semibold ${
                  isBlackTheme
                    ? 'bg-cyan-400 text-slate-950'
                    : 'bg-blue-600 text-white'
                }`}
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
