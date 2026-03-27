import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAuthSession, getStoredUsername } from '../../shared/auth/session.js'
import { findContactByIdentity, updateContact } from '../../shared/services/index.js'
import { createFormChangeHandler } from '../../shared/utils/forms.js'

function splitName(fullName) {
  const normalizedName = typeof fullName === 'string' ? fullName.trim() : ''
  const parts = normalizedName.split(/\s+/).filter(Boolean)

  if (parts.length <= 1) {
    return {
      firstName: '',
      lastName: normalizedName,
    }
  }

  return {
    firstName: parts.slice(0, -1).join(' '),
    lastName: parts.at(-1) || '',
  }
}

function createEmptyForm() {
  return {
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    birthdate: '',
    hobby: '',
    description: '',
  }
}

function normalizeNullableValue(value) {
  const trimmedValue = typeof value === 'string' ? value.trim() : ''
  return trimmedValue ? trimmedValue : null
}

function buildContactPayload(formState) {
  const { firstName, lastName } = splitName(formState.fullName)

  return {
    FirstName: normalizeNullableValue(firstName),
    LastName: normalizeNullableValue(lastName),
    Email: normalizeNullableValue(formState.email),
    Phone: normalizeNullableValue(formState.phone),
    GenderIdentity: normalizeNullableValue(formState.gender),
    Birthdate: normalizeNullableValue(formState.birthdate),
    Hobby__c: normalizeNullableValue(formState.hobby),
    Description: normalizeNullableValue(formState.description),
  }
}

export default function EditUserProfilePage({ showToast }) {
  const navigate = useNavigate()
  const notify = typeof showToast === 'function' ? showToast : () => {}
  const [contactId, setContactId] = useState('')
  const [formState, setFormState] = useState(createEmptyForm)
  const [loadingMessage, setLoadingMessage] = useState('Loading Salesforce...')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    let isMounted = true

    void (async () => {
      setLoadingMessage('Loading Salesforce...')
      setError('')

      try {
        const session = getAuthSession()
        const username = getStoredUsername()
        const email = typeof session?.email === 'string' ? session.email.trim() : ''

        if (!username && !email) {
          throw new Error('Username login belum ditemukan di session.')
        }

        const record = await findContactByIdentity({ username, email })

        if (!record?.Id) {
          throw new Error(
            `Contact untuk session login '${username || email}' tidak ditemukan di Salesforce.`
          )
        }

        if (!isMounted) return

        setContactId(record.Id)
        setFormState({
          fullName: record.Name || [record.FirstName, record.LastName].filter(Boolean).join(' '),
          email: record.Email || email || '',
          phone: record.Phone || record.MobilePhone || '',
          gender: record.GenderIdentity || '',
          birthdate: record.Birthdate || '',
          hobby: record.Hobby__c || '',
          description: record.Description || '',
        })
      } catch (err) {
        if (!isMounted) return
        setError(err.message || 'Gagal mengambil data profile.')
      } finally {
        if (!isMounted) return
        setLoadingMessage('')
      }
    })()

    return () => {
      isMounted = false
    }
  }, [])

  const handleChange = createFormChangeHandler(setFormState)

  async function handleSubmit(event) {
    event.preventDefault()

    const trimmedName = formState.fullName.trim()
    const { lastName } = splitName(trimmedName)

    if (!trimmedName || !lastName) {
      setError('Nama wajib diisi agar LastName Contact tetap valid di Salesforce.')
      return
    }

    if (!contactId) {
      setError('Contact Id tidak ditemukan. Muat ulang halaman lalu coba lagi.')
      return
    }

    setIsSaving(true)
    setError('')

    try {
      await updateContact(contactId, buildContactPayload(formState))
      notify('Profile data updated')
      navigate('/user-profile')
    } catch (err) {
      setError(err.message || 'Gagal menyimpan perubahan profile.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#edf2f7]">
      <section className="bg-white shadow-none">
        <div className="bg-gradient-to-r from-rose-700 via-pink-600 to-orange-400 px-5 pb-8 pt-[calc(1rem+env(safe-area-inset-top)+1rem)] text-white">
          <button
            className="text-sm font-medium text-white/80"
            onClick={() => navigate('/user-profile')}
          >
            {'< Back'}
          </button>
          <h1 className="mt-1 text-2xl font-semibold">Change Data Detail</h1>
          <p className="mt-2 max-w-[24rem] text-sm leading-6 text-white/90">
            Ubah data Contact user yang sedang login lalu simpan langsung ke Salesforce.
          </p>
        </div>

        <div className="space-y-4 p-3 pb-8">
          <form
            className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100"
            onSubmit={(event) => void handleSubmit(event)}
          >
            {loadingMessage ? (
              <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-700">
                {loadingMessage}
              </div>
            ) : null}

            {error ? (
              <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                {error}
              </div>
            ) : null}

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-800" htmlFor="fullName">
                  Nama
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none"
                  value={formState.fullName}
                  onChange={handleChange}
                  disabled={Boolean(loadingMessage) || isSaving}
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-800" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none"
                  value={formState.email}
                  onChange={handleChange}
                  disabled={Boolean(loadingMessage) || isSaving}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold text-slate-800" htmlFor="phone">
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none"
                    value={formState.phone}
                    onChange={handleChange}
                    disabled={Boolean(loadingMessage) || isSaving}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-800" htmlFor="gender">
                    Gender
                  </label>
                  <input
                    id="gender"
                    name="gender"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none"
                    value={formState.gender}
                    onChange={handleChange}
                    disabled={Boolean(loadingMessage) || isSaving}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-800" htmlFor="birthdate">
                  Birthdate
                </label>
                <input
                  id="birthdate"
                  name="birthdate"
                  type="date"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none"
                  value={formState.birthdate}
                  onChange={handleChange}
                  disabled={Boolean(loadingMessage) || isSaving}
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-800" htmlFor="hobby">
                  Hobi
                </label>
                <textarea
                  id="hobby"
                  name="hobby"
                  className="mt-2 min-h-24 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none"
                  value={formState.hobby}
                  onChange={handleChange}
                  disabled={Boolean(loadingMessage) || isSaving}
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-800" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="mt-2 min-h-28 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none"
                  value={formState.description}
                  onChange={handleChange}
                  disabled={Boolean(loadingMessage) || isSaving}
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-pink-600 px-4 py-4 text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:bg-pink-300"
                disabled={Boolean(loadingMessage) || isSaving}
              >
                {isSaving ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}
