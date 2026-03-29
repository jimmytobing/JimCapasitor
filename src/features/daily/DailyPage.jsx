import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAuthContact, getAuthSession, setAuthSession } from '../../shared/auth/session.js'
import BottomStickyNav from '../../shared/components/BottomStickyNav.jsx'
import {
  createRichTextFeedItem,
  findContactByIdentity,
  updateContact,
} from '../../shared/services/index.js'
import { maskBackendName } from '../../shared/utils/branding.js'
import { friendsSeed, moodOptions } from './dailyData.js'

function findMoodId(value) {
  const normalizedValue = String(value || '').trim().toLowerCase()

  if (!normalizedValue) {
    return ''
  }

  const matchedMood = moodOptions.find(
    (mood) =>
      mood.id.toLowerCase() === normalizedValue || mood.label.toLowerCase() === normalizedValue
  )

  return matchedMood?.id || ''
}

function buildStoredContact(contact = {}, fallback = {}) {
  return {
    id: contact?.Id || fallback?.id || '',
    name: contact?.Name || fallback?.name || '',
    email: contact?.Email || fallback?.email || '',
    username: contact?.App_User_ID__c || fallback?.username || '',
    mood: contact?.Mood__c || fallback?.mood || '',
  }
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function buildMoodFeedHtml(mood, options = {}) {
  const frame = mood.frame || '╔ DAILY MOOD CHECK-IN ╗'
  const divider = mood.divider || '• • •'
  const defaultQuickNote = mood.quickNote || 'Quick note: Respon cepat boleh, drama jangan dulu.'
  const quickNote = String(options.quickNote || defaultQuickNote).trim() || defaultQuickNote
  const subtext = String(options.subtext || mood.subtext).trim() || mood.subtext
  const sections = [
    `<p><b>${escapeHtml(frame)}</b></p>`,
    `<p><b>${escapeHtml(`${mood.emoji} ${mood.label}`.toUpperCase())}</b></p>`,
    `<p><i>${escapeHtml(mood.headline)}</i></p>`,
    `<p>${escapeHtml(divider)}</p>`,
    `<p>${escapeHtml(`Hari ini aku lagi merasa ${mood.label}.`)}</p>`,
    `<p>${escapeHtml(subtext)}</p>`,
    '<p>────────</p>',
    `<p><b>${escapeHtml(quickNote)}</b></p>`,
  ]

  return sections.join('')
}

function MoodComposerModal({
  draftQuickNote,
  draftSubtext,
  isSaving,
  mood,
  onClose,
  onDraftQuickNoteChange,
  onDraftSubtextChange,
  onSubmit,
}) {
  if (!mood) {
    return null
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-slate-950/55 px-4 pb-4 pt-16 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-[2rem] bg-white p-5 shadow-[0_30px_90px_rgba(15,23,42,0.38)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              Mood Editor
            </p>
            <h2 className="mt-1 text-lg font-semibold text-slate-900">
              {mood.emoji} {mood.label}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">{mood.headline}</p>
          </div>
          <button
            type="button"
            className="rounded-full px-3 py-2 text-sm font-medium text-slate-500"
            onClick={onClose}
            disabled={isSaving}
          >
            Close
          </button>
        </div>

        <form className="mt-4 space-y-4" onSubmit={onSubmit}>
          <div className={`rounded-[1.5rem] bg-gradient-to-r ${mood.accent} px-4 py-4 text-white`}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/75">
              Preview
            </p>
            <p className="mt-3 text-sm font-semibold">{mood.headline}</p>
            <p className="mt-2 text-sm text-white/90">Hari ini aku lagi merasa {mood.label}.</p>
            <p className="mt-2 text-sm text-white/80">{draftSubtext.trim() || mood.subtext}</p>
            <div className="mt-4 rounded-2xl bg-white/14 px-4 py-3 text-xs leading-5 text-white/90 ring-1 ring-white/16">
              {draftQuickNote.trim() || mood.quickNote || 'Quick note: Respon cepat boleh, drama jangan dulu.'}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-800" htmlFor="mood-subtext">
              Edit subtext sebelum dipost
            </label>
            <textarea
              id="mood-subtext"
              className="mt-2 min-h-28 w-full resize-none rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-800 outline-none placeholder:text-slate-400"
              placeholder="Tulis detail singkat tentang perasaanmu hari ini..."
              value={draftSubtext}
              onChange={onDraftSubtextChange}
              disabled={isSaving}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-800" htmlFor="mood-quick-note">
              Edit quick note
            </label>
            <textarea
              id="mood-quick-note"
              className="mt-2 min-h-20 w-full resize-none rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-800 outline-none placeholder:text-slate-400"
              placeholder="Tulis catatan singkat penutup untuk card mood ini..."
              value={draftQuickNote}
              onChange={onDraftQuickNoteChange}
              disabled={isSaving}
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-slate-300"
            disabled={isSaving}
          >
            {isSaving ? 'Posting...' : 'Simpan dan Post'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function DailyPage({ showToast }) {
  const navigate = useNavigate()
  const notify = typeof showToast === 'function' ? showToast : () => {}
  const [selectedMood, setSelectedMood] = useState('happy')
  const moodCount = moodOptions.length
  const [isSavingMood, setIsSavingMood] = useState(false)
  const [error, setError] = useState('')
  const [editorMoodId, setEditorMoodId] = useState('')
  const [draftQuickNote, setDraftQuickNote] = useState('')
  const [draftSubtext, setDraftSubtext] = useState('')

  const moodById = Object.fromEntries(moodOptions.map((mood) => [mood.id, mood]))
  const selectedMoodData = moodById[selectedMood]
  const editorMood = moodById[editorMoodId] || null
  const friends = friendsSeed.map((friend, index) =>
    index === 0 ? { ...friend, moodId: selectedMood } : friend
  )

  useEffect(() => {
    const savedMoodId = findMoodId(getAuthContact()?.mood)

    if (savedMoodId) {
      setSelectedMood(savedMoodId)
    }
  }, [])

  async function resolveLoginContact() {
    const session = getAuthSession()
    const storedContact = getAuthContact()

    if (storedContact?.id) {
      return storedContact
    }

    const username = typeof session?.username === 'string' ? session.username.trim() : ''
    const email = typeof session?.email === 'string' ? session.email.trim() : ''
    const googleId = typeof session?.googleId === 'string' ? session.googleId.trim() : ''

    if (!username && !email && !googleId) {
      throw new Error('Contact login belum ditemukan di session.')
    }

    const record = await findContactByIdentity({ username, email, googleId })

    if (!record?.Id) {
      throw new Error('Contact login tidak ditemukan di HypeZone.')
    }

    const nextStoredContact = buildStoredContact(record)
    setAuthSession({
      ...(session || {}),
      contact: nextStoredContact,
    })

    return nextStoredContact
  }

  function openMoodEditor(mood) {
    if (isSavingMood) {
      return
    }

    setEditorMoodId(mood.id)
    setDraftSubtext(mood.subtext)
    setDraftQuickNote(mood.quickNote || 'Quick note: Respon cepat boleh, drama jangan dulu.')
    setError('')
  }

  function closeMoodEditor() {
    if (isSavingMood) {
      return
    }

    setEditorMoodId('')
    setDraftQuickNote('')
    setDraftSubtext('')
  }

  async function handleMoodSubmit(event) {
    event.preventDefault()

    if (isSavingMood || !editorMood) {
      return
    }

    const trimmedSubtext = draftSubtext.trim() || editorMood.subtext
    const trimmedQuickNote =
      draftQuickNote.trim() ||
      editorMood.quickNote ||
      'Quick note: Respon cepat boleh, drama jangan dulu.'

    if (isSavingMood) {
      return
    }

    setIsSavingMood(true)
    setError('')

    try {
      const session = getAuthSession()
      const loginContact = await resolveLoginContact()

      if (!loginContact?.id) {
        throw new Error('Contact login tidak punya Id yang valid.')
      }

      const updatedContact = await updateContact(loginContact.id, {
        Mood__c: editorMood.label,
      })

      await createRichTextFeedItem(loginContact.id, buildMoodFeedHtml({
        ...editorMood,
      }, {
        subtext: trimmedSubtext,
        quickNote: trimmedQuickNote,
      }))

      const nextStoredContact = buildStoredContact(updatedContact, {
        ...loginContact,
        mood: editorMood.label,
      })

      setAuthSession({
        ...(session || {}),
        contact: nextStoredContact,
      })

      setSelectedMood(editorMood.id)
      setEditorMoodId('')
      setDraftQuickNote('')
      setDraftSubtext('')
      notify(`Mood hari ini tersimpan: ${editorMood.emoji} ${editorMood.label}`)
    } catch (err) {
      const message = maskBackendName(err.message, 'Gagal menyimpan mood harian.')
      setError(message)
      notify(message)
    } finally {
      setIsSavingMood(false)
    }
  }

  return (
    <div className="h-screen bg-[#edf2f7] overflow-y-auto hide-scrollbar">
      <div className="min-h-screen pb-28">
        <section className="overflow-hidden bg-white shadow-none">
          <div className={`bg-gradient-to-r ${selectedMoodData.accent} px-5 pb-8 pt-[calc(1rem+env(safe-area-inset-top)+1rem)] text-white`}>
            <button
              className="text-sm font-medium text-white/80"
              onClick={() => navigate('/')}
            >
              {'< Back'}
            </button>
            <h1 className="mt-1 text-2xl font-semibold">Daily Check-in</h1>
            <p className="mt-2 max-w-[24rem] text-sm leading-6 text-white/90">
              Pilih mood hari ini, lalu biarkan teman lihat dan kasih respon cepat.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm">
              <span className="text-lg">{selectedMoodData.emoji}</span>
              <span>Mood kamu hari ini: {selectedMoodData.label}</span>
            </div>
          </div>

          <div className="space-y-5 p-3">
            <div className="rounded-3xl bg-white p-2 shadow-sm">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Pilih mood hari ini</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Ada {moodCount} mood yang bisa kamu pilih untuk status harianmu.
                </p>
              </div>

              {error ? (
                <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                  {error}
                </div>
              ) : null}

              <div className="mt-4 grid grid-cols-2 gap-3">
                {moodOptions.map((mood) => {
                  const isActive = selectedMood === mood.id
                  return (
                    <button
                      key={mood.id}
                      className={`rounded-2xl border px-4 py-4 text-left shadow-sm transition ${
                        isActive
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 bg-slate-50 text-slate-700'
                      } ${isSavingMood ? 'cursor-wait opacity-70' : ''}`}
                      onClick={() => openMoodEditor(mood)}
                      disabled={isSavingMood}
                    >
                      <div className="text-2xl">{mood.emoji}</div>
                      <div className="mt-3 text-sm font-semibold">{mood.label}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="rounded-3xl bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">Mood teman hari ini</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Status ini bikin interaksi lebih sering dan terasa personal.
                  </p>
                </div>
                <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500 shadow-sm">
                  {friends.length} online
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {friends.map((friend) => {
                  const mood = moodById[friend.moodId]
                  return (
                    <div
                      key={friend.name}
                      className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-base font-semibold text-slate-900">
                            {friend.name} - {mood.emoji} {mood.label}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            Kamu bisa langsung merespon mood ini.
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                          aktif
                        </span>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <button
                          className="flex-1 rounded-xl bg-amber-100 px-3 py-2 text-sm font-medium text-amber-700"
                          onClick={() => notify(`Sticker terkirim ke ${friend.name}`)}
                        >
                          Kirim sticker
                        </button>
                        <button
                          className="flex-1 rounded-xl bg-emerald-100 px-3 py-2 text-sm font-medium text-emerald-700"
                          onClick={() => notify(`Semangat terkirim ke ${friend.name}`)}
                        >
                          Kirim semangat
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      </div>
      <MoodComposerModal
        mood={editorMood}
        draftQuickNote={draftQuickNote}
        draftSubtext={draftSubtext}
        isSaving={isSavingMood}
        onClose={closeMoodEditor}
        onDraftQuickNoteChange={(event) => setDraftQuickNote(event.target.value)}
        onDraftSubtextChange={(event) => setDraftSubtext(event.target.value)}
        onSubmit={(event) => void handleMoodSubmit(event)}
      />
      <BottomStickyNav />
    </div>
  )
}
