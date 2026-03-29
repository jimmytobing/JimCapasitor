import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import BottomStickyNav from '../../shared/components/BottomStickyNav.jsx'
import UserAvatar from '../../shared/components/UserAvatar.jsx'
import { fetchAccountContactsByCircleId } from '../../shared/services/index.js'
import { maskBackendName } from '../../shared/utils/branding.js'
import { chatThreads, circleTitles } from './chatData.js'

export default function ChatPage({ themeMode = 'default' }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const circleId = searchParams.get('circle')
  const isBlackTheme = themeMode === 'black'
  const [salesforceState, setSalesforceState] = useState({
    isLoading: false,
    error: '',
    threads: [],
  })
  const localThreads = useMemo(() => {
    if (!circleId) {
      return chatThreads.filter((thread) => thread.messages.length > 0)
    }
    return chatThreads.filter((thread) => thread.circles?.includes(circleId))
  }, [circleId])

  useEffect(() => {
    let isCancelled = false
    const accountName = circleId && circleTitles[circleId] ? circleTitles[circleId] : ''

    if (!accountName) {
      setSalesforceState({
        isLoading: false,
        error: '',
        threads: [],
      })
      return undefined
    }

    const loadCircleThreads = async () => {
      setSalesforceState({
        isLoading: true,
        error: '',
        threads: [],
      })

      try {
        const account = await fetchAccountContactsByCircleId(circleId, accountName)

        if (!account) {
          throw new Error(`Account ${accountName} tidak ditemukan di HypeZone.`)
        }

        const threads = account.contacts.map((contact, index) => {
          const displayName = contact.name || `Contact ${index + 1}`

          return {
            id: `sf-contact-${contact.id}`,
            salesforceContactId: contact.id,
            name: displayName,
            avatar: displayName.slice(0, 1),
            avatarTone: 'from-sky-400 to-cyan-500',
            preview: 'Contact dari HypeZone',
            time: '',
            inactive: false,
            messages: [],
            source: 'salesforce',
          }
        })

        if (isCancelled) return

        setSalesforceState({
          isLoading: false,
          error: '',
          threads,
        })
      } catch (error) {
        if (isCancelled) return

        setSalesforceState({
          isLoading: false,
          error: maskBackendName(error.message, `Gagal memuat chat ${accountName} dari HypeZone.`),
          threads: [],
        })
      }
    }

    loadCircleThreads()

    return () => {
      isCancelled = true
    }
  }, [circleId])

  const visibleThreads =
    circleId && circleTitles[circleId] && salesforceState.threads.length > 0
      ? salesforceState.threads
      : localThreads

  return (
    <div
      className={`h-screen overflow-y-auto hide-scrollbar ${
        isBlackTheme ? 'bg-[#050816] text-slate-100' : 'bg-[#edf2f7] text-slate-900'
      }`}
    >
      <div className="min-h-screen pb-28">
        <section className={`${isBlackTheme ? 'bg-transparent' : 'bg-white'} shadow-none`}>
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-800 px-5 pb-8 pt-[calc(1rem+env(safe-area-inset-top)+1rem)] text-white">
            <button
              className="text-sm font-medium text-white/80"
              onClick={() => navigate(circleId ? '/circle' : '/')}
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
            <div
              className={`rounded-3xl p-4 ${
                isBlackTheme
                  ? 'border border-white/10 bg-slate-950/80 shadow-[0_24px_80px_rgba(2,6,23,0.45)] backdrop-blur-xl'
                  : 'bg-white shadow-sm ring-1 ring-slate-100'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className={`text-base font-semibold ${isBlackTheme ? 'text-white' : 'text-slate-900'}`}>
                    Chat list
                  </h2>
                  <p className={`mt-1 text-sm ${isBlackTheme ? 'text-slate-300' : 'text-slate-500'}`}>
                    {circleId && circleTitles[circleId]
                      ? `Teman-teman di ${circleTitles[circleId]} dari HypeZone.`
                      : 'Pilih salah satu untuk masuk ke tampilan chat masing-masing.'}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    isBlackTheme
                      ? 'border border-white/10 bg-white/5 text-slate-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {visibleThreads.length} threads
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {circleId && circleTitles[circleId] && salesforceState.isLoading ? (
                  <div
                    className={`rounded-2xl p-4 text-sm ${
                      isBlackTheme
                        ? 'border border-cyan-500/20 bg-cyan-500/10 text-cyan-100'
                        : 'border border-sky-100 bg-sky-50 text-sky-700'
                    }`}
                  >
                    {`Mengambil daftar contact ${circleTitles[circleId]} dari HypeZone...`}
                  </div>
                ) : null}

                {circleId && circleTitles[circleId] && salesforceState.error ? (
                  <div
                    className={`rounded-2xl p-4 text-sm ${
                      isBlackTheme
                        ? 'border border-amber-500/20 bg-amber-500/10 text-amber-100'
                        : 'border border-amber-100 bg-amber-50 text-amber-700'
                    }`}
                  >
                    {salesforceState.error}
                  </div>
                ) : null}

                {visibleThreads.map((thread) => (
                  <div
                    key={thread.id}
                    className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left transition ${
                      isBlackTheme
                        ? thread.inactive
                          ? 'border border-white/10 bg-slate-900/90 shadow-[0_16px_40px_rgba(2,6,23,0.28)] hover:bg-slate-900'
                          : 'border border-white/10 bg-slate-950/80 shadow-[0_16px_40px_rgba(2,6,23,0.28)] hover:bg-slate-900/90'
                        : thread.inactive
                          ? 'shadow-sm ring-1 ring-slate-200 bg-slate-100 hover:bg-slate-200'
                          : 'shadow-sm ring-1 ring-slate-100 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <button
                      type="button"
                      className="h-14 w-14 shrink-0 overflow-hidden rounded-full shadow-sm"
                      onClick={() => navigate(`/memory-timeline/${thread.id}`)}
                    >
                      <UserAvatar
                        name={thread.name}
                        image={thread.avatarImage}
                        initial={thread.avatar}
                        tone={thread.avatarTone}
                      />
                    </button>
                    <button
                      type="button"
                      className="min-w-0 flex-1 text-left"
                      onClick={() => {
                        if (thread.source === 'salesforce') return
                        navigate(
                          circleId ? `/chat/${thread.id}?circle=${circleId}` : `/chat/${thread.id}`
                        )
                      }}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p
                          className={`truncate text-base font-semibold ${
                            isBlackTheme
                              ? thread.inactive
                                ? 'text-slate-400'
                                : 'text-white'
                              : thread.inactive
                                ? 'text-slate-500'
                                : 'text-slate-900'
                          }`}
                        >
                          {thread.name}
                        </p>
                        {thread.source === 'salesforce' ? (
                          <span
                            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                              isBlackTheme
                                ? 'border border-cyan-400/20 bg-cyan-400/10 text-cyan-100'
                                : 'bg-cyan-50 text-cyan-700'
                            }`}
                          >
                            HypeZone
                          </span>
                        ) : thread.inactive ? (
                          <span
                            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                              isBlackTheme
                                ? 'border border-white/10 bg-white/5 text-slate-300'
                                : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            inactive
                          </span>
                        ) : thread.time ? (
                          <span className={`text-xs font-medium ${isBlackTheme ? 'text-slate-300' : 'text-slate-400'}`}>
                            {thread.time}
                          </span>
                        ) : null}
                      </div>
                      {thread.preview ? (
                        <p className={`mt-1 truncate text-sm ${isBlackTheme ? 'text-slate-300' : 'text-slate-500'}`}>
                          {thread.preview}
                        </p>
                      ) : (
                        <p className={`mt-1 text-sm ${isBlackTheme ? 'text-slate-500' : 'text-slate-300'}`}> </p>
                      )}
                      {thread.source === 'salesforce' ? (
                        <p className={`mt-1 text-xs ${isBlackTheme ? 'text-cyan-200/80' : 'text-cyan-700'}`}>
                          Contact tampil dari HypeZone. Detail chat lokal belum dibuat.
                        </p>
                      ) : null}
                    </button>
                  </div>
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
