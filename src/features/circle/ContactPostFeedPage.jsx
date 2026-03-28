import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import BottomStickyNav from '../../shared/components/BottomStickyNav.jsx'
import UserAvatar from '../../shared/components/UserAvatar.jsx'
import { fetchRecordFeedElements } from '../../shared/services/index.js'

function formatPostDate(value) {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function PostCard({ post, fallbackName }) {
  const [showComments, setShowComments] = useState(false)
  const displayName = fallbackName || 'Contact'
  const firstAttachment = post.attachments[0]
  const visibleComments = post.comments || []
  const hasCommentItems = visibleComments.length > 0

  return (
    <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
      <div className="flex items-center gap-3 px-4 py-4">
        <div className="h-12 w-12 overflow-hidden rounded-full ring-2 ring-rose-200 ring-offset-2 ring-offset-white">
          <UserAvatar
            name={displayName}
            initial={displayName.slice(0, 1).toUpperCase()}
            tone="from-rose-500 via-orange-400 to-amber-300"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900">{displayName}</p>
          <p className="truncate text-xs text-slate-500">
            Post {post.createdDate ? `• ${formatPostDate(post.createdDate)}` : ''}
          </p>
        </div>
        <button type="button" className="rounded-full p-2 text-slate-400">
          <span className="text-lg leading-none">...</span>
        </button>
      </div>

      {firstAttachment ? (
        <div className="aspect-square overflow-hidden bg-slate-100">
          <img
            src={firstAttachment.imageUrl}
            alt={firstAttachment.title}
            className="h-full w-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        <div className="bg-[linear-gradient(160deg,#fef3c7_0%,#fff7ed_52%,#ffe4e6_100%)] px-5 py-10">
          <div className="rounded-[1.75rem] bg-white/70 p-5 shadow-sm backdrop-blur">
            <p className="text-lg font-semibold leading-8 text-slate-900">
              {post.text || 'Belum ada caption di post ini.'}
            </p>
          </div>
        </div>
      )}

      <div className="px-4 py-4">
        <div className="flex items-center gap-4 text-slate-900">
          <span className="text-xl">♡</span>
          <span className="text-xl">💬</span>
          <span className="text-xl">↗</span>
          <span className="ml-auto text-xl">🔖</span>
        </div>
        <p className="mt-3 text-sm font-semibold text-slate-900">{post.likesCount} likes</p>
        {post.text ? <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{post.text}</p> : null}
        <button
          type="button"
          className={`mt-3 text-sm ${
            post.commentsCount > 0 ? 'font-medium text-slate-600' : 'text-slate-400'
          }`}
          onClick={() => {
            if (post.commentsCount > 0) {
              setShowComments((current) => !current)
            }
          }}
        >
          {post.commentsCount > 0
            ? showComments
              ? `Sembunyikan ${post.commentsCount} komentar`
              : `Lihat ${post.commentsCount} komentar`
            : 'Belum ada komentar'}
        </button>

        {showComments ? (
          hasCommentItems ? (
            <div className="mt-4 space-y-3 rounded-[1.5rem] bg-slate-50 p-4">
              {visibleComments.map((comment) => (
                <div key={comment.id || `${post.id}-${comment.createdDate}`} className="flex gap-3">
                  <div className="h-9 w-9 overflow-hidden rounded-full">
                    <UserAvatar
                      name={displayName}
                      initial={displayName.slice(0, 1).toUpperCase()}
                      tone="from-slate-700 to-slate-900"
                    />
                  </div>
                  <div className="min-w-0 flex-1 rounded-2xl bg-white px-3 py-2 shadow-sm">
                    <p className="text-xs font-semibold text-slate-900">{displayName}</p>
                    {comment.text ? (
                      <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                        {comment.text}
                      </p>
                    ) : (
                      <p className="mt-1 text-sm text-slate-400">Komentar kosong.</p>
                    )}
                    <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-slate-400">
                      {formatPostDate(comment.createdDate)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-[1.25rem] bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-700">
              Jumlah komentar ada, tetapi isi komentarnya belum ikut dikirim di respons feed ini.
            </div>
          )
        ) : null}
      </div>
    </article>
  )
}

export default function ContactPostFeedPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { contactId = '' } = useParams()
  const [state, setState] = useState({
    loading: true,
    error: '',
    feed: [],
  })

  const person = location.state?.person || null
  const circleTitle = location.state?.circleTitle || 'Circle'
  const fallbackName = person?.name || 'Contact'
  const fallbackStatus = person?.status || 'Member aktif'

  useEffect(() => {
    let active = true

    void (async () => {
      setState({
        loading: true,
        error: '',
        feed: [],
      })

      try {
        const result = await fetchRecordFeedElements(contactId)

        if (!active) return

        setState({
          loading: false,
          error: '',
          feed: result.items,
        })
      } catch (error) {
        if (!active) return

        setState({
          loading: false,
          error: error?.message || 'Gagal mengambil feed post dari Salesforce.',
          feed: [],
        })
      }
    })()

    return () => {
      active = false
    }
  }, [contactId])

  const headerSubtitle = useMemo(() => {
    if (state.loading) return 'Mengambil post terbaru dari Chatter...'
    if (state.error) return state.error
    if (state.feed.length === 0) return 'Belum ada post untuk contact ini.'
    return `${state.feed.length} post ditemukan dari feed Chatter.`
  }, [state.error, state.feed.length, state.loading])

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff7ed_0%,#fff1f2_36%,#f8fafc_100%)]">
      <div className="mx-auto min-h-screen w-full max-w-sm pb-28">
        <section className="px-4 pb-6 pt-[calc(1rem+env(safe-area-inset-top)+1rem)]">
          <div className="rounded-[2rem] bg-[#101828] px-5 pb-5 pt-4 text-white shadow-[0_24px_60px_rgba(15,23,42,0.28)]">
            <button
              type="button"
              className="text-sm font-medium text-white/70"
              onClick={() => navigate('/circle')}
            >
              {'< Back'}
            </button>

            <div className="mt-5 flex items-center gap-4">
              <div className="h-16 w-16 overflow-hidden rounded-full ring-4 ring-white/15">
                <UserAvatar
                  name={fallbackName}
                  initial={fallbackName.slice(0, 1).toUpperCase()}
                  tone="from-rose-500 via-orange-400 to-amber-300"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xl font-semibold">{fallbackName}</p>
                <p className="mt-1 truncate text-sm text-white/75">{fallbackStatus}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.24em] text-white/50">{circleTitle}</p>
              </div>
            </div>

            <div className="mt-5 rounded-[1.5rem] bg-white/10 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.24em] text-white/55">Post Feed</p>
              <p className="mt-2 text-sm leading-6 text-white/85">{headerSubtitle}</p>
            </div>
          </div>
        </section>

        <section className="space-y-4 px-4 pb-6">
          {state.loading ? (
            <div className="space-y-4">
              {[0, 1].map((item) => (
                <div
                  key={item}
                  className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 animate-pulse rounded-full bg-slate-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-28 animate-pulse rounded-full bg-slate-200" />
                      <div className="h-3 w-20 animate-pulse rounded-full bg-slate-100" />
                    </div>
                  </div>
                  <div className="mt-4 aspect-square animate-pulse rounded-[1.5rem] bg-slate-100" />
                </div>
              ))}
            </div>
          ) : null}

          {!state.loading && !state.error && state.feed.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-orange-200 bg-white/85 px-5 py-8 text-center shadow-sm">
              <p className="text-lg font-semibold text-slate-900">Belum ada post</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Endpoint Chatter untuk record ini belum mengembalikan feed item. Begitu ada post,
                tampilannya akan muncul di sini seperti feed Instagram.
              </p>
            </div>
          ) : null}

          {!state.loading && state.error ? (
            <div className="rounded-[2rem] border border-rose-200 bg-rose-50 px-5 py-6 text-sm leading-6 text-rose-700 shadow-sm">
              {state.error}
            </div>
          ) : null}

          {!state.loading && state.feed.length > 0
            ? state.feed.map((post) => (
                <PostCard key={post.id || `${contactId}-${post.createdDate}`} post={post} fallbackName={fallbackName} />
              ))
            : null}
        </section>
      </div>

      <BottomStickyNav />
    </div>
  )
}
