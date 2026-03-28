import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import BottomStickyNav from '../../shared/components/BottomStickyNav.jsx'
import UserAvatar from '../../shared/components/UserAvatar.jsx'
import {
  createFeedElementComment,
  createRecordFeedElement,
  createRecordFeedElementWithSegments,
  fetchFeedElementComments,
  fetchRecordFeedElements,
  sendSalesforceBinaryRequest,
  uploadFileToRecord,
  uploadInlineImageToRecord,
} from '../../shared/services/index.js'

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

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : ''
      const base64Data = result.includes(',') ? result.split(',')[1] : result
      resolve(base64Data)
    }

    reader.onerror = () => {
      reject(new Error('Gagal membaca file gambar.'))
    }

    reader.readAsDataURL(file)
  })
}

function AuthenticatedFeedImage({ src, alt, className = '' }) {
  const [resolvedSrc, setResolvedSrc] = useState('')

  useEffect(() => {
    let active = true
    let objectUrl = ''

    async function loadImage() {
      if (!src) {
        setResolvedSrc('')
        return
      }

      if (!/^https?:\/\/.+salesforce\.com\//i.test(src)) {
        setResolvedSrc(src)
        return
      }

      try {
        const blob = await sendSalesforceBinaryRequest(src)
        if (!active) return
        objectUrl = URL.createObjectURL(blob)
        setResolvedSrc(objectUrl)
      } catch {
        if (!active) return
        setResolvedSrc('')
      }
    }

    void loadImage()

    return () => {
      active = false
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [src])

  if (!resolvedSrc) {
    return <div className={`h-full w-full animate-pulse bg-slate-200 ${className}`.trim()} />
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      className={`h-full w-full object-cover ${className}`.trim()}
      loading="lazy"
      referrerPolicy="no-referrer"
    />
  )
}

function ComposerModal({
  caption,
  file,
  filePreview,
  isSubmitting,
  onCaptionChange,
  onClose,
  onFileChange,
  onSubmit,
}) {
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-slate-950/55 px-4 pb-4 pt-16 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-[2rem] bg-white p-5 shadow-[0_30px_90px_rgba(15,23,42,0.38)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              Create Post
            </p>
            <h2 className="mt-1 text-lg font-semibold text-slate-900">New Post</h2>
          </div>
          <button
            type="button"
            className="rounded-full px-3 py-2 text-sm font-medium text-slate-500"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Close
          </button>
        </div>

        <form className="mt-4 space-y-4" onSubmit={onSubmit}>
          <textarea
            className="min-h-32 w-full resize-none rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-800 outline-none placeholder:text-slate-400"
            placeholder="Tulis caption atau update baru di sini..."
            value={caption}
            onChange={onCaptionChange}
            disabled={isSubmitting}
          />

          <label className="flex cursor-pointer items-center justify-between rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm text-slate-600">
            <span>{file ? file.name : 'Tambah foto untuk Salesforce File'}</span>
            <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
              Choose
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFileChange}
              disabled={isSubmitting}
            />
          </label>

          {filePreview ? (
            <div className="overflow-hidden rounded-[1.5rem] bg-slate-100">
              <img
                src={filePreview}
                alt={file?.name || 'Preview'}
                className="h-56 w-full object-cover"
              />
            </div>
          ) : null}

          <p className="text-xs leading-5 text-slate-500">
            Jika memilih foto, file akan di-upload ke Contact ini sebagai Salesforce File. Jika
            caption diisi juga, caption akan dikirim sebagai post teks terpisah.
          </p>

          <button
            type="submit"
            className="w-full rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Posting...' : 'Publish'}
          </button>
        </form>
      </div>
    </div>
  )
}

function PostCard({
  fallbackName,
  loadingCommentsForId,
  onCreateComment,
  onLoadComments,
  pendingCommentForId,
  post,
}) {
  const [commentText, setCommentText] = useState('')
  const [showCommentComposer, setShowCommentComposer] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const displayName = fallbackName || 'Contact'
  const firstAttachment = post.attachments[0]
  const visibleComments = post.comments || []
  const hasCommentItems = visibleComments.length > 0
  const isCommentSubmitting = pendingCommentForId === post.id
  const isCommentsLoading = loadingCommentsForId === post.id

  useEffect(() => {
    if (!showComments || hasCommentItems || post.commentsCount === 0) {
      return
    }

    void onLoadComments(post.id, post.commentsUrl)
  }, [hasCommentItems, onLoadComments, post.commentsCount, post.commentsUrl, post.id, showComments])

  async function handleCommentSubmit(event) {
    event.preventDefault()
    const trimmedText = commentText.trim()

    if (!trimmedText) {
      return
    }

    const success = await onCreateComment(post.id, trimmedText)

    if (success) {
      setCommentText('')
      setShowComments(true)
      setShowCommentComposer(false)
    }
  }

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
          <AuthenticatedFeedImage
            src={firstAttachment.imageUrl}
            alt={firstAttachment.title}
            className="h-full w-full"
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
          <button type="button" className="text-xl">
            ♡
          </button>
          <button
            type="button"
            className="text-xl"
            onClick={() => setShowCommentComposer((current) => !current)}
          >
            💬
          </button>
          <button type="button" className="text-xl">
            ↗
          </button>
          <button type="button" className="ml-auto text-xl">
            🔖
          </button>
        </div>

        <p className="mt-3 text-sm font-semibold text-slate-900">{post.likesCount} likes</p>
        {post.text ? <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{post.text}</p> : null}

        <div className="mt-3 flex items-center gap-3">
          <button
            type="button"
            className={`text-sm ${
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

          <button
            type="button"
            className="text-sm font-medium text-rose-500"
            onClick={() => setShowCommentComposer((current) => !current)}
          >
            New Comment
          </button>
        </div>

        {showCommentComposer ? (
          <form className="mt-4 space-y-3" onSubmit={(event) => void handleCommentSubmit(event)}>
            <textarea
              className="min-h-24 w-full resize-none rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-800 outline-none"
              placeholder="Tulis komentar baru..."
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              disabled={isCommentSubmitting}
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                disabled={isCommentSubmitting}
              >
                {isCommentSubmitting ? 'Sending...' : 'Send Comment'}
              </button>
            </div>
          </form>
        ) : null}

        {showComments ? (
          isCommentsLoading ? (
            <div className="mt-4 rounded-[1.25rem] bg-slate-50 px-4 py-3 text-sm text-slate-500">
              Mengambil komentar...
            </div>
          ) : hasCommentItems ? (
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

export default function ContactPostFeedPage({ showToast }) {
  const navigate = useNavigate()
  const location = useLocation()
  const notify = typeof showToast === 'function' ? showToast : () => {}
  const { contactId = '' } = useParams()
  const [state, setState] = useState({
    loading: true,
    error: '',
    feed: [],
  })
  const [composerCaption, setComposerCaption] = useState('')
  const [composerFile, setComposerFile] = useState(null)
  const [composerFilePreview, setComposerFilePreview] = useState('')
  const [isComposerOpen, setIsComposerOpen] = useState(false)
  const [isSubmittingPost, setIsSubmittingPost] = useState(false)
  const [pendingCommentForId, setPendingCommentForId] = useState('')
  const [loadingCommentsForId, setLoadingCommentsForId] = useState('')

  const person = location.state?.person || null
  const circleTitle = location.state?.circleTitle || 'Circle'
  const fallbackName = person?.name || 'Contact'
  const fallbackStatus = person?.status || 'Member aktif'

  useEffect(() => {
    let active = true

    async function loadFeed() {
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
    }

    void loadFeed()

    return () => {
      active = false
    }
  }, [contactId])

  useEffect(() => {
    if (!composerFile) {
      setComposerFilePreview('')
      return undefined
    }

    const nextPreview = URL.createObjectURL(composerFile)
    setComposerFilePreview(nextPreview)

    return () => {
      URL.revokeObjectURL(nextPreview)
    }
  }, [composerFile])

  async function refreshFeed() {
    const result = await fetchRecordFeedElements(contactId)
    setState({
      loading: false,
      error: '',
      feed: result.items,
    })
  }

  function resetComposer() {
    setComposerCaption('')
    setComposerFile(null)
    setComposerFilePreview('')
    setIsComposerOpen(false)
  }

  async function handleCreatePost(event) {
    event.preventDefault()

    const trimmedCaption = composerCaption.trim()

    if (!trimmedCaption && !composerFile) {
      setState((current) => ({
        ...current,
        error: 'Isi post atau pilih foto terlebih dahulu.',
      }))
      return
    }

    setIsSubmittingPost(true)
    setState((current) => ({
      ...current,
      error: '',
    }))

    try {
      if (composerFile && trimmedCaption) {
        const base64Data = await fileToBase64(composerFile)

        try {
          const inlineImage = await uploadInlineImageToRecord(contactId, {
            fileName: composerFile.name,
            base64Data,
            title: composerFile.name.replace(/\.[^.]+$/, '') || composerFile.name,
            description: trimmedCaption,
          })

          await createRecordFeedElementWithSegments(contactId, [
            {
              type: 'InlineImage',
              fileId: inlineImage.fileId,
              altText: inlineImage.title,
            },
            {
              type: 'Text',
              text: trimmedCaption,
            },
          ])
        } catch {
          await uploadFileToRecord(contactId, {
            fileName: composerFile.name,
            base64Data,
            title: composerFile.name.replace(/\.[^.]+$/, '') || composerFile.name,
            description: trimmedCaption,
          })

          await createRecordFeedElement(contactId, trimmedCaption)
        }
      } else if (composerFile) {
        const base64Data = await fileToBase64(composerFile)
        await uploadFileToRecord(contactId, {
          fileName: composerFile.name,
          base64Data,
          title: composerFile.name.replace(/\.[^.]+$/, '') || composerFile.name,
          description: trimmedCaption,
        })
      }

      if (trimmedCaption && !composerFile) {
        await createRecordFeedElement(contactId, trimmedCaption)
      }

      resetComposer()
      await refreshFeed()
      notify(composerFile ? 'Post dan file berhasil dikirim' : 'Post berhasil dibuat')
    } catch (error) {
      setState((current) => ({
        ...current,
        error: error?.message || 'Gagal membuat post baru.',
      }))
    } finally {
      setIsSubmittingPost(false)
    }
  }

  async function handleCreateComment(feedElementId, text) {
    setPendingCommentForId(feedElementId)
    setState((current) => ({
      ...current,
      error: '',
    }))

    try {
      await createFeedElementComment(feedElementId, text)
      await refreshFeed()
      notify('Komentar berhasil dikirim')
      return true
    } catch (error) {
      setState((current) => ({
        ...current,
        error: error?.message || 'Gagal membuat komentar.',
      }))
      return false
    } finally {
      setPendingCommentForId('')
    }
  }

  async function handleLoadComments(feedElementId, commentsUrl) {
    if (!feedElementId || loadingCommentsForId === feedElementId) {
      return
    }

    setLoadingCommentsForId(feedElementId)

    try {
      const result = await fetchFeedElementComments(feedElementId, commentsUrl)
      setState((current) => ({
        ...current,
        feed: current.feed.map((post) =>
          post.id === feedElementId
            ? {
                ...post,
                comments: result.items,
                commentsCount: result.total || post.commentsCount,
              }
            : post
        ),
      }))
    } catch (error) {
      setState((current) => ({
        ...current,
        error: error?.message || 'Gagal mengambil komentar.',
      }))
    } finally {
      setLoadingCommentsForId('')
    }
  }

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
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                className="text-sm font-medium text-white/70"
                onClick={() => navigate('/circle')}
              >
                {'< Back'}
              </button>
              <button
                type="button"
                className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm"
                onClick={() => setIsComposerOpen(true)}
              >
                New Post
              </button>
            </div>

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
                Belum ada post untuk contact ini. Gunakan tombol New Post untuk menambahkan update
                baru atau upload foto ke Salesforce Files.
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
                <PostCard
                  key={post.id || `${contactId}-${post.createdDate}`}
                  fallbackName={fallbackName}
                  loadingCommentsForId={loadingCommentsForId}
                  onCreateComment={handleCreateComment}
                  onLoadComments={handleLoadComments}
                  pendingCommentForId={pendingCommentForId}
                  post={post}
                />
              ))
            : null}
        </section>
      </div>

      {isComposerOpen ? (
        <ComposerModal
          caption={composerCaption}
          file={composerFile}
          filePreview={composerFilePreview}
          isSubmitting={isSubmittingPost}
          onCaptionChange={(event) => setComposerCaption(event.target.value)}
          onClose={() => {
            if (!isSubmittingPost) {
              resetComposer()
            }
          }}
          onFileChange={(event) => setComposerFile(event.target.files?.[0] || null)}
          onSubmit={(event) => void handleCreatePost(event)}
        />
      ) : null}

      <BottomStickyNav />
    </div>
  )
}
