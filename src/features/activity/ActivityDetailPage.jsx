import { useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import BottomStickyNav from '../../shared/components/BottomStickyNav.jsx'
import {
  activityTypeById,
  findActivityEntry,
  predefinedActionOptionsByCategory,
} from './activityData.js'

const circleOptions = [
  {
    id: 'best-friend',
    title: 'Best Friend',
    emoji: '💛',
    members: ['Jimmy', 'Bayu', 'Angga', 'Vina'],
  },
  {
    id: 'school-friend',
    title: 'School Friend',
    emoji: '🎒',
    members: ['Jimmy', 'Bayu', 'Angga', 'Vina', 'Joshua', 'Ryan'],
  },
  {
    id: 'game-friend',
    title: 'Game Friend',
    emoji: '🎮',
    members: ['Joshua', 'Bayu', 'Ryan', 'Jimmy'],
  },
  {
    id: 'secret-circle',
    title: 'Secret Circle',
    emoji: '🔒',
    members: ['Jimmy', 'Vina', 'Nadia'],
  },
]

const statusClassByLabel = {
  'belum ada': 'bg-rose-100 text-rose-700',
  'sudah ada': 'bg-emerald-100 text-emerald-700',
}

export function ActivityTypePage({ showToast }) {
  const navigate = useNavigate()
  const { activityId } = useParams()
  const notify = typeof showToast === 'function' ? showToast : () => {}
  const activity = activityTypeById[activityId]

  if (!activity) {
    return <Navigate to="/activity" replace />
  }

  return (
    <div className="h-screen bg-[#edf2f7] overflow-y-auto hide-scrollbar">
      <div className="min-h-screen pb-28">
        <section className="overflow-hidden bg-white shadow-none">
          <div className={`bg-gradient-to-r ${activity.accent} px-5 pb-8 pt-[calc(1rem+env(safe-area-inset-top)+1rem)] text-white`}>
            <button
              className="text-sm font-medium text-white/80"
              onClick={() => navigate('/activity')}
            >
              {'< Back'}
            </button>
            <div className="mt-4 flex items-start gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white/20 text-3xl backdrop-blur-sm">
                {activity.emoji}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/75">
                  {activity.shortLabel}
                </p>
                <h1 className="mt-1 text-2xl font-semibold">{activity.title}</h1>
              </div>
            </div>
            <p className="mt-3 max-w-[24rem] text-sm leading-6 text-white/90">
              {activity.description}
            </p>
          </div>

          <div className="space-y-4 p-3">
            <div className="rounded-3xl bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">Active Activity</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Activity aktif dikelompokkan berdasarkan activity category. Pilih salah satu
                    untuk buka detailnya.
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white"
                  onClick={() => navigate(`/activity/${activity.id}/edit-category`)}
                >
                  Edit
                </button>
              </div>
            </div>

            {activity.activeGroups.map((group) => (
              <div key={group.category} className="rounded-3xl bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">{group.category}</h2>
                    <p className="mt-1 text-sm text-slate-500">{group.items.length} activity aktif</p>
                  </div>
                  <button
                    type="button"
                    className="rounded-full bg-sky-600 px-3 py-1 text-xs font-semibold text-white"
                    onClick={() => navigate(`/activity/${activity.id}/new?category=${encodeURIComponent(group.category)}`)}
                    aria-label={`Tambah activity untuk ${group.category}`}
                  >
                    +
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className="w-full rounded-2xl bg-slate-50 p-4 text-left transition hover:bg-slate-100"
                      onClick={() => {
                        notify(item.title)
                        navigate(`/activity/${activity.id}/${item.id}`)
                      }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-base font-semibold text-slate-900">{item.title}</p>
                          <p className="mt-1 text-sm leading-6 text-slate-600">
                            {item.description || 'Buka detail activity ini untuk lihat info lengkap.'}
                          </p>
                        </div>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500 shadow-sm">
                          Detail
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.time && (
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
                            {item.time}
                          </span>
                        )}
                        {item.location && (
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
                            {item.location}
                          </span>
                        )}
                        {item.participants && (
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
                            {item.participants.length} peserta
                          </span>
                        )}
                        {item.needs && (
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
                            {item.needs.length} kebutuhan
                          </span>
                        )}
                        {item.options && (
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
                            {item.options.length} pilihan
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <BottomStickyNav onAction={notify} />
    </div>
  )
}

export default function ActivityDetailPage({ showToast }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { activityId, entryId } = useParams()
  const notify = typeof showToast === 'function' ? showToast : () => {}
  const isNewRecord = entryId === 'new' || location.pathname.endsWith('/new')
  const query = new URLSearchParams(location.search)
  const selectedCategory = query.get('category') || ''
  const [draftForm, setDraftForm] = useState({
    title: '',
    description: '',
    category: selectedCategory,
    time: '',
    location: '',
    circleId: 'school-friend',
    participants: [],
    needs: [{ name: '', ready: false }],
  })

  const updateDraftField = (field) => (event) => {
    setDraftForm((current) => ({
      ...current,
      [field]: event.target.value,
    }))
  }
  const selectedCircle =
    circleOptions.find((circle) => circle.id === draftForm.circleId) || circleOptions[0]

  const toggleParticipant = (member) => {
    setDraftForm((current) => ({
      ...current,
      participants: current.participants.includes(member)
        ? current.participants.filter((item) => item !== member)
        : [...current.participants, member],
    }))
  }

  const updateNeedRow = (index, field, value) => {
    setDraftForm((current) => ({
      ...current,
      needs: current.needs.map((need, needIndex) =>
        needIndex === index ? { ...need, [field]: value } : need
      ),
    }))
  }

  const addNeedRow = () => {
    setDraftForm((current) => ({
      ...current,
      needs: [...current.needs, { name: '', ready: false }],
    }))
  }
  const match = isNewRecord ? null : findActivityEntry(activityId, entryId)

  if (isNewRecord) {
    const activity = activityTypeById[activityId]
    if (!activity) {
      return <Navigate to="/activity" replace />
    }

    return (
      <div className="h-screen bg-[#edf2f7] overflow-y-auto hide-scrollbar">
        <div className="min-h-screen pb-28">
          <section className="overflow-hidden bg-white shadow-none">
            <div className={`bg-gradient-to-r ${activity.accent} px-5 pb-8 pt-[calc(1rem+env(safe-area-inset-top)+1rem)] text-white`}>
              <button
                className="text-sm font-medium text-white/80"
                onClick={() => navigate(`/activity/${activityId}`)}
              >
                {'< Back'}
              </button>
              <div className="mt-4 flex items-start gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white/20 text-3xl backdrop-blur-sm">
                  {activity.emoji}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/75">
                    New Activity
                  </p>
                  <h1 className="mt-1 text-2xl font-semibold">Buat Activity Baru</h1>
                </div>
              </div>
              <p className="mt-3 max-w-[24rem] text-sm leading-6 text-white/90">
                Halaman detail ini sedang dalam edit mode untuk menambahkan activity baru.
              </p>
            </div>

            <div className="space-y-4 p-3">
              <div className="rounded-3xl bg-white p-4 shadow-sm">
                <h2 className="text-base font-semibold text-slate-900">Draft Activity</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Isi field di bawah untuk menyiapkan activity baru sesuai category yang kamu pilih.
                </p>
              </div>

              <div className="rounded-3xl bg-white p-4 shadow-sm">
                <div className="mt-3 space-y-3">
                  <label className="block rounded-2xl bg-slate-50 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Activity Category
                    </p>
                    <input
                      type="text"
                      value={draftForm.category}
                      readOnly
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-800 outline-none"
                      placeholder="Contoh: PR Sulit"
                    />
                  </label>
                  <label className="block rounded-2xl bg-slate-50 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Judul
                    </p>
                    <input
                      type="text"
                      value={draftForm.title}
                      onChange={updateDraftField('title')}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400"
                      placeholder="Contoh: Study Group Matematika"
                    />
                  </label>
                  <label className="block rounded-2xl bg-slate-50 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Deskripsi
                    </p>
                    <textarea
                      value={draftForm.description}
                      onChange={updateDraftField('description')}
                      rows="3"
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400"
                      placeholder="Contoh: Butuh bahas latihan soal dan kisi-kisi bab terakhir."
                    />
                  </label>
                  <label className="block rounded-2xl bg-slate-50 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Waktu
                    </p>
                    <input
                      type="text"
                      value={draftForm.time}
                      onChange={updateDraftField('time')}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400"
                      placeholder="Contoh: Hari ini jam 19:00"
                    />
                  </label>
                  <label className="block rounded-2xl bg-slate-50 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Lokasi
                    </p>
                    <input
                      type="text"
                      value={draftForm.location}
                      onChange={updateDraftField('location')}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400"
                      placeholder="Contoh: Cafe dekat sekolah"
                    />
                  </label>
                  <div className="rounded-2xl bg-slate-50 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Circle
                    </p>
                    <div className="mt-2 grid gap-2">
                      {circleOptions.map((circle) => {
                        const isActive = draftForm.circleId === circle.id
                        return (
                          <button
                            key={circle.id}
                            type="button"
                            className={`rounded-2xl border px-3 py-3 text-left text-sm transition ${
                              isActive
                                ? 'border-sky-500 bg-sky-50 text-sky-900'
                                : 'border-slate-200 bg-white text-slate-700'
                            }`}
                            onClick={() =>
                              setDraftForm((current) => ({
                                ...current,
                                circleId: circle.id,
                                participants: current.participants.filter((member) =>
                                  circle.members.includes(member)
                                ),
                              }))
                            }
                          >
                            <span className="font-semibold">
                              {circle.emoji} {circle.title}
                            </span>
                            <span className="mt-1 block text-xs text-slate-500">
                              {circle.members.length} member siap dipilih
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Peserta
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      Pilih peserta dari circle: {selectedCircle.emoji} {selectedCircle.title}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedCircle.members.map((member) => {
                        const isSelected = draftForm.participants.includes(member)
                        return (
                          <button
                            key={member}
                            type="button"
                            className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                              isSelected
                                ? 'bg-sky-600 text-white'
                                : 'bg-white text-slate-700 ring-1 ring-slate-200'
                            }`}
                            onClick={() => toggleParticipant(member)}
                          >
                            {member}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Kebutuhan
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      Tambahkan daftar kebutuhan dan tandai mana yang sudah ada.
                    </p>
                    <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                      <div className="grid grid-cols-[1fr_110px] gap-3 border-b border-slate-200 bg-slate-100 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        <span>Nama Barang</span>
                        <span>Sudah Ada</span>
                      </div>
                      <div className="space-y-0">
                        {draftForm.needs.map((need, index) => (
                          <div
                            key={`need-row-${index}`}
                            className="grid grid-cols-[1fr_110px] gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0"
                          >
                            <input
                              type="text"
                              value={need.name}
                              onChange={(event) =>
                                updateNeedRow(index, 'name', event.target.value)
                              }
                              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400"
                              placeholder="Contoh: Karton"
                            />
                            <button
                              type="button"
                              className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${
                                need.ready ? 'bg-emerald-500' : 'bg-slate-200'
                              }`}
                              onClick={() => updateNeedRow(index, 'ready', !need.ready)}
                              aria-pressed={need.ready}
                              aria-label={`Toggle status kebutuhan ${index + 1}`}
                            >
                              <span
                                className={`absolute h-5 w-5 rounded-full bg-white transition ${
                                  need.ready ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="mt-3 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                      onClick={addNeedRow}
                    >
                      + Add Kebutuhan
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-slate-900 p-4 text-white shadow-sm">
                <h2 className="text-base font-semibold">Aksi Cepat</h2>
                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    className="flex-1 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900"
                    onClick={() => {
                      notify(`Simpan draft activity baru untuk ${activity.title}`)
                      navigate(`/activity/${activityId}`)
                    }}
                  >
                    Simpan Draft
                  </button>
                  <button
                    type="button"
                    className="flex-1 rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white ring-1 ring-white/15"
                    onClick={() => notify(`Preview activity baru untuk ${activity.title}`)}
                  >
                    Preview
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
        <BottomStickyNav onAction={notify} />
      </div>
    )
  }

  if (!match) {
    return <Navigate to={activityId ? `/activity/${activityId}` : '/activity'} replace />
  }

  const { activity, group, entry } = match
  const detailActionOptions = predefinedActionOptionsByCategory[group.category] || []
  const missingNeeds = (entry.needs || []).filter((need) => need.status === 'belum ada')

  return (
    <div className="h-screen bg-[#edf2f7] overflow-y-auto hide-scrollbar">
      <div className="min-h-screen pb-28">
        <section className="overflow-hidden bg-white shadow-none">
          <div className={`bg-gradient-to-r ${activity.accent} px-5 pb-8 pt-[calc(1rem+env(safe-area-inset-top)+1rem)] text-white`}>
            <button
              className="text-sm font-medium text-white/80"
              onClick={() => navigate(`/activity/${activityId}`)}
            >
              {'< Back'}
            </button>
            <div className="mt-4 flex items-start gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white/20 text-3xl backdrop-blur-sm">
                {activity.emoji}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/75">
                  {group.category}
                </p>
                <h1 className="mt-1 text-2xl font-semibold">{entry.title}</h1>
              </div>
            </div>
            <p className="mt-3 max-w-[24rem] text-sm leading-6 text-white/90">
              {activity.description}
            </p>
          </div>

          <div className="space-y-4 p-3">
            <div className="rounded-3xl bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Deskripsi
              </p>
              <p className="mt-2 text-base font-semibold text-slate-900">{entry.title}</p>
              {entry.description && (
                <p className="mt-2 text-sm leading-6 text-slate-600">{entry.description}</p>
              )}
            </div>

            {entry.time && (
              <div className="rounded-3xl bg-white p-4 shadow-sm">
                <h2 className="text-base font-semibold text-slate-900">Waktu</h2>
                <p className="mt-2 text-sm text-slate-600">{entry.time}</p>
              </div>
            )}

            {entry.location && (
              <div className="rounded-3xl bg-white p-4 shadow-sm">
                <h2 className="text-base font-semibold text-slate-900">Lokasi</h2>
                <p className="mt-2 text-sm text-slate-600">{entry.location}</p>
              </div>
            )}

            {entry.participants && (
              <div className="rounded-3xl bg-white p-4 shadow-sm">
                <h2 className="text-base font-semibold text-slate-900">Peserta</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {entry.participants.map((participant) => (
                    <span
                      key={participant}
                      className="rounded-full bg-sky-50 px-3 py-2 text-sm font-medium text-sky-700"
                    >
                      {participant}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {entry.needs && (
              <div className="rounded-3xl bg-white p-4 shadow-sm">
                <h2 className="text-base font-semibold text-slate-900">Kebutuhan</h2>
                <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <div className="grid grid-cols-[1fr_120px] gap-3 border-b border-slate-200 bg-slate-100 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    <span>Nama Barang</span>
                    <span>Status</span>
                  </div>
                  <div className="space-y-0">
                    {entry.needs.map((need) => (
                      <div
                        key={need.label}
                        className="grid grid-cols-[1fr_120px] gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0"
                      >
                        <span className="text-sm font-medium text-slate-800">{need.label}</span>
                        <span
                          className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                            statusClassByLabel[need.status] || 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {need.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                {missingNeeds.length > 0 && (
                  <button
                    type="button"
                    className="mt-3 w-full rounded-2xl bg-amber-300 px-4 py-3 text-sm font-semibold text-slate-900"
                    onClick={() =>
                      notify(
                        `Nitip ke HypeZone untuk ${missingNeeds.map((need) => need.label).join(', ')}`
                      )
                    }
                  >
                    Nitip ke HypeZone
                  </button>
                )}
              </div>
            )}

            {detailActionOptions.length > 0 && (
              <div className="rounded-3xl bg-white p-4 shadow-sm">
                <h2 className="text-base font-semibold text-slate-900">Aksi Sesuai Category</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Tombol aksi ini disesuaikan dengan activity category: {group.category}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {detailActionOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className="rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700 transition hover:bg-violet-200"
                      onClick={() => notify(`${option} - ${entry.title}`)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-3xl bg-slate-900 p-4 text-white shadow-sm">
              <h2 className="text-base font-semibold">Aksi Cepat</h2>
              <p className="mt-2 text-sm leading-6 text-white/75">
                Pakai format ini untuk bikin activity yang jelas dan gampang direspon teman.
              </p>
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  className="flex-1 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900"
                  onClick={() => notify(entry.cta)}
                >
                  {entry.cta}
                </button>
                <button
                  type="button"
                  className="flex-1 rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white ring-1 ring-white/15"
                  onClick={() => notify(`Share ${entry.title}`)}
                >
                  Share ke Circle
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
      <BottomStickyNav onAction={notify} />
    </div>
  )
}
