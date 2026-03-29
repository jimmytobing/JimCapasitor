import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import BottomStickyNav from '../../shared/components/BottomStickyNav.jsx'
import UserAvatar from '../../shared/components/UserAvatar.jsx'
import { buildAvatarProfile } from '../../shared/data/avatarDirectory.js'
import {
  createFeedElementComment,
  createRecordFeedElement,
  createRecordFeedElementWithSegments,
  escapeSoqlValue,
  fetchFeedElementComments,
  fetchRecordFeedElements,
  getRecords,
  sendSalesforceBinaryRequest,
  uploadFileToRecord,
  uploadInlineImageToRecord,
} from '../../shared/services/index.js'
import { maskBackendName } from '../../shared/utils/branding.js'

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

function normalizePhotoUrl(photoUrl) {
  if (!photoUrl) return null
  if (/^https?:\/\//i.test(photoUrl)) return photoUrl

  return `https://sfcapacitor-dev-ed.develop.my.salesforce.com/${photoUrl.replace(/^\/+/, '')}`
}

function deriveToneTheme(avatarTone = '') {
  const tone = String(avatarTone || '')

  if (/(pink|rose|fuchsia)/.test(tone)) {
    return {
      pageBg: 'bg-[linear-gradient(180deg,#fff1f2_0%,#ffe4e6_36%,#fff7ed_100%)]',
      headerBg: 'bg-gradient-to-br from-rose-700 via-pink-600 to-orange-400',
      statsPanel: 'bg-white/12',
      primaryButton: 'bg-white text-rose-700',
      secondaryButton: 'bg-white/10 text-white ring-1 ring-white/20',
      actionAccent: 'text-rose-500',
    }
  }

  if (/(purple|violet)/.test(tone)) {
    return {
      pageBg: 'bg-[linear-gradient(180deg,#f5f3ff_0%,#ede9fe_36%,#f8fafc_100%)]',
      headerBg: 'bg-gradient-to-br from-violet-800 via-purple-700 to-fuchsia-600',
      statsPanel: 'bg-white/12',
      primaryButton: 'bg-white text-violet-700',
      secondaryButton: 'bg-white/10 text-white ring-1 ring-white/20',
      actionAccent: 'text-violet-500',
    }
  }

  if (/(sky|blue|indigo)/.test(tone)) {
    return {
      pageBg: 'bg-[linear-gradient(180deg,#eff6ff_0%,#dbeafe_36%,#f8fafc_100%)]',
      headerBg: 'bg-gradient-to-br from-sky-800 via-blue-700 to-indigo-700',
      statsPanel: 'bg-white/12',
      primaryButton: 'bg-white text-blue-700',
      secondaryButton: 'bg-white/10 text-white ring-1 ring-white/20',
      actionAccent: 'text-blue-500',
    }
  }

  if (/(teal|emerald)/.test(tone)) {
    return {
      pageBg: 'bg-[linear-gradient(180deg,#ecfdf5_0%,#d1fae5_36%,#f8fafc_100%)]',
      headerBg: 'bg-gradient-to-br from-emerald-800 via-teal-700 to-cyan-700',
      statsPanel: 'bg-white/12',
      primaryButton: 'bg-white text-emerald-700',
      secondaryButton: 'bg-white/10 text-white ring-1 ring-white/20',
      actionAccent: 'text-emerald-500',
    }
  }

  return {
    pageBg: 'bg-[linear-gradient(180deg,#f8fafc_0%,#e2e8f0_36%,#f8fafc_100%)]',
    headerBg: 'bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900',
    statsPanel: 'bg-white/10',
    primaryButton: 'bg-white text-slate-800',
    secondaryButton: 'bg-white/10 text-white ring-1 ring-white/20',
    actionAccent: 'text-slate-500',
  }
}

function AuthenticatedFeedImage({ src, alt, className = '' }) {
  const [resolvedSrc, setResolvedSrc] = useState('')
  const [currentSrc, setCurrentSrc] = useState(src)
  const [isLoadingHd, setIsLoadingHd] = useState(false)

  useEffect(() => {
    setCurrentSrc(src)
  }, [src])

  useEffect(() => {
    let active = true
    let objectUrl = ''

    async function loadImage() {
      if (!currentSrc) {
        setResolvedSrc('')
        return
      }

      if (!/^https?:\/\/.+salesforce\.com\//i.test(currentSrc)) {
        setResolvedSrc(currentSrc)
        return
      }

      try {
        const blob = await sendSalesforceBinaryRequest(currentSrc)
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
  }, [currentSrc])

  async function handleGetHd() {
    if (!alt?.fullImageUrl || alt.fullImageUrl === currentSrc || isLoadingHd) {
      return
    }

    setIsLoadingHd(true)
    try {
      setCurrentSrc(alt.fullImageUrl)
    } finally {
      setIsLoadingHd(false)
    }
  }

  return (
    <div className={`relative h-full w-full ${className}`.trim()}>
      {alt?.fullImageUrl && alt.fullImageUrl !== currentSrc ? (
        <button
          type="button"
          className="absolute right-3 top-3 z-10 rounded-full bg-slate-950/75 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm"
          onClick={() => void handleGetHd()}
          disabled={isLoadingHd}
        >
          {isLoadingHd ? 'Loading...' : 'Get HD'}
        </button>
      ) : null}

      {resolvedSrc ? (
        <img
          src={resolvedSrc}
          alt={typeof alt === 'string' ? alt : alt?.title || 'Feed image'}
          className="h-full w-full object-cover"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="h-full w-full animate-pulse bg-slate-200" />
      )}
    </div>
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
            <span>{file ? file.name : 'Tambah foto untuk lampiran HypeZone'}</span>
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
            Jika memilih foto, file akan di-upload ke contact ini sebagai lampiran HypeZone. Jika
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
  avatarImage,
  avatarTone,
  contactId,
  fallbackName,
  loadingCommentsForId,
  onOpenContactRecord,
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
    <article className="overflow-hidden border-y border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
      <div className="relative">
        {firstAttachment ? (
          <div className="aspect-[4/5] overflow-hidden bg-slate-100">
            <AuthenticatedFeedImage
              src={firstAttachment.imageUrl}
              alt={firstAttachment}
              className="h-full w-full"
            />
          </div>
        ) : (
          <div className="relative aspect-[4/5] overflow-hidden bg-[linear-gradient(160deg,#fef08a_0%,#f9a8d4_48%,#93c5fd_100%)] px-6 py-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.48)_0%,rgba(255,255,255,0)_36%)]" />
            <div className="absolute -left-6 top-8 h-24 w-24 rounded-full bg-white/25 blur-2xl" />
            <div className="absolute right-2 top-14 h-16 w-16 rounded-full bg-fuchsia-200/40 blur-2xl" />
            <div className="absolute bottom-8 left-10 h-20 w-20 rounded-full bg-sky-200/45 blur-3xl" />
            <div className="absolute bottom-10 right-8 h-24 w-24 rounded-full bg-amber-200/35 blur-3xl" />
            <div className="relative flex h-full items-center justify-center">
              <div className="relative w-full max-w-[82%] rotate-[-4deg] rounded-[1.4rem_1.1rem_1.5rem_1.2rem] bg-[#fff278] px-6 py-8 shadow-[0_24px_50px_rgba(131,24,67,0.22)] ring-2 ring-white/45">
                <div className="absolute -left-3 top-5 h-6 w-6 rounded-full bg-fuchsia-400 shadow-[0_6px_14px_rgba(190,24,93,0.35)] ring-4 ring-pink-100/80" />
                <div className="absolute right-6 top-0 h-7 w-24 -translate-y-1/2 rotate-[8deg] rounded-full bg-white/55 shadow-[0_10px_18px_rgba(15,23,42,0.14)] backdrop-blur-sm" />
                <div className="absolute inset-0 rounded-[1.4rem_1.1rem_1.5rem_1.2rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.34)_0%,rgba(255,255,255,0)_26%,rgba(249,168,212,0.08)_100%)]" />
                <div className="absolute left-4 top-4 h-3 w-3 rounded-full bg-rose-300/70" />
                <div className="absolute right-5 top-10 h-2.5 w-2.5 rounded-full bg-sky-300/80" />
                <div className="absolute bottom-5 left-6 h-2.5 w-2.5 rounded-full bg-orange-300/80" />
                <div className="absolute inset-x-0 top-9 border-t border-amber-300/45" />
                <div className="absolute inset-x-0 top-[5.5rem] border-t border-amber-300/30" />
                <div className="absolute inset-x-0 top-[8rem] border-t border-amber-300/25" />
                <div className="relative">
                  <p className="whitespace-pre-wrap text-lg font-bold leading-8 text-slate-800">
                    {post.text || 'Belum ada caption di post ini.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-950/70 via-slate-950/35 to-transparent" />

        <div className="absolute left-4 top-4 flex items-center gap-3">
          <button
            type="button"
            className="h-12 w-12 overflow-hidden rounded-full ring-2 ring-white/70 ring-offset-2 ring-offset-transparent"
            onClick={() => onOpenContactRecord(contactId)}
            aria-label={`Open ${displayName}`}
            title={displayName}
          >
            <UserAvatar
              name={displayName}
              image={avatarImage}
              initial={displayName.slice(0, 1).toUpperCase()}
              tone={avatarTone}
            />
          </button>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white drop-shadow-sm">{displayName}</p>
            <p className="truncate text-xs text-white/85 drop-shadow-sm">
              Post {post.createdDate ? `• ${formatPostDate(post.createdDate)}` : ''}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="absolute right-3 top-3 rounded-full bg-slate-950/45 p-2 text-white backdrop-blur-sm"
        >
          <span className="text-lg leading-none">...</span>
        </button>
      </div>

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
                  <button
                    type="button"
                    className="h-9 w-9 overflow-hidden rounded-full"
                    onClick={() => onOpenContactRecord(contactId)}
                    aria-label={`Open ${displayName}`}
                    title={displayName}
                  >
                    <UserAvatar
                      name={displayName}
                      image={avatarImage}
                      initial={displayName.slice(0, 1).toUpperCase()}
                      tone={avatarTone}
                    />
                  </button>
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
  const [contactProfile, setContactProfile] = useState(() =>
    person ? buildAvatarProfile(person) : null
  )
  const fallbackName = contactProfile?.name || person?.name || 'No Name'
  const fallbackStatus = person?.status || 'No Status'
  const toneTheme = deriveToneTheme(contactProfile?.avatarTone)

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
          error: maskBackendName(error?.message, 'Gagal mengambil feed post dari HypeZone.'),
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
    let active = true

    async function loadContactProfile() {
      if (person) {
        setContactProfile(buildAvatarProfile(person))
        return
      }

      if (!contactId) {
        setContactProfile(null)
        return
      }

      try {
        const safeContactId = escapeSoqlValue(contactId)
        const records = await getRecords(
          `SELECT Id, Name, Title, Email, Phone, GenderIdentity, Photo__c FROM Contact WHERE Id = '${safeContactId}' LIMIT 1`
        )

        if (!active) return

        const record = records[0]
        if (!record) {
          setContactProfile(
            buildAvatarProfile({
              id: contactId,
              name: 'No Name',
            })
          )
          return
        }

        setContactProfile(
          buildAvatarProfile({
            id: record.Id || contactId,
            name: record.Name || 'No Name',
            gender: record.GenderIdentity || '',
            avatarImage: normalizePhotoUrl(record.Photo__c),
          })
        )
      } catch {
        if (!active) return

        setContactProfile(
          buildAvatarProfile({
            id: contactId,
            name: person?.name || 'No Name',
          })
        )
      }
    }

    void loadContactProfile()

    return () => {
      active = false
    }
  }, [contactId, person])

  function openContactRecord(id) {
    if (!id) {
      return
    }

    navigate(`/${id}`, {
      state: {
        from: `/circle/contact/${contactId}/posts`,
        objectApiName: 'Contact',
      },
    })
  }

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

  const headerPostCount = useMemo(() => {
    if (state.loading) return '...'
    return String(state.feed.length)
  }, [state.feed.length, state.loading])

  return (
    <div className={`min-h-screen ${toneTheme.pageBg}`}>
      <div className="min-h-screen pb-28">
        <section className="pb-6">
          <div className={`${toneTheme.headerBg} px-5 pb-5 pt-[calc(1rem+env(safe-area-inset-top)+1rem)] text-white shadow-[0_24px_60px_rgba(15,23,42,0.28)]`}>
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
              <button
                type="button"
                className="h-16 w-16 overflow-hidden rounded-full ring-4 ring-white/15"
                onClick={() => openContactRecord(contactId)}
                aria-label={`Open ${fallbackName}`}
                title={fallbackName}
              >
                <UserAvatar
                  name={fallbackName}
                  image={contactProfile?.avatarImage}
                  initial={fallbackName.slice(0, 1).toUpperCase()}
                  tone={contactProfile?.avatarTone || 'from-rose-500 via-orange-400 to-amber-300'}
                />
              </button>
              <div className="min-w-0 flex-1 self-center">
                <p className="truncate text-lg font-semibold leading-tight">{fallbackName}</p>
                <div className={`mt-1 grid w-full grid-cols-3 gap-2 rounded-[0.875rem] px-0 py-1.5 text-left ${toneTheme.statsPanel}`}>
                  <div>
                    <p className="text-[11px] font-semibold leading-none text-white">{headerPostCount}</p>
                    <p className="mt-0.5 text-[8px] uppercase tracking-[0.12em] text-white/60">Posts</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold leading-none text-white">1,6M</p>
                    <p className="mt-0.5 text-[8px] uppercase tracking-[0.12em] text-white/60">Followers</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold leading-none text-white">1,3K</p>
                    <p className="mt-0.5 text-[8px] uppercase tracking-[0.12em] text-white/60">Following</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <p className="truncate text-sm text-white/75">{fallbackStatus}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.24em] text-white/50">{circleTitle}</p>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <button
                type="button"
                className={`rounded-full px-4 py-1.5 text-xs font-semibold shadow-sm ${toneTheme.primaryButton}`}
                onClick={() => notify(`Follow ${fallbackName}`)}
              >
                Follow
              </button>
              <button
                type="button"
                className={`rounded-full px-4 py-1.5 text-xs font-semibold backdrop-blur-sm ${toneTheme.secondaryButton}`}
                onClick={() => notify(`Message ${fallbackName}`)}
              >
                Message
              </button>
            </div>
          </div>
        </section>

        <section className="space-y-4 pb-6">
          {state.loading ? (
            <div className="space-y-4 px-3">
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

          {state.error ? (
            <div className="mx-3 rounded-[2rem] border border-rose-200 bg-rose-50 px-5 py-6 text-sm leading-6 text-rose-700 shadow-sm">
              {state.error}
            </div>
          ) : null}

          {!state.loading && !state.error && state.feed.length === 0 ? (
            <div className="mx-3 rounded-[2rem] border border-dashed border-orange-200 bg-white/85 px-5 py-8 text-center shadow-sm">
              <p className="text-lg font-semibold text-slate-900">Belum ada post</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Belum ada post untuk contact ini. Minta dia untuk mengunakan tombol New Post untuk menambahkan update
                baru atau upload foto ke HypeZone.
              </p>
            </div>
          ) : null}

          {!state.loading && state.feed.length > 0
            ? state.feed.map((post) => (
                <PostCard
                  avatarImage={contactProfile?.avatarImage}
                  avatarTone={contactProfile?.avatarTone || 'from-slate-700 to-slate-900'}
                  contactId={contactId}
                  key={post.id || `${contactId}-${post.createdDate}`}
                  fallbackName={fallbackName}
                  loadingCommentsForId={loadingCommentsForId}
                  onOpenContactRecord={openContactRecord}
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
