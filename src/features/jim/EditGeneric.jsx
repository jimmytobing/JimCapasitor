import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { createFormChangeHandler } from '../../shared/utils/forms.js'
import { escapeSoqlValue, getRecord, updateRecord } from '../../shared/services/salesforce.js'

function createEmptyRecord(fields) {
  return Object.fromEntries(fields.map((field) => [field, '']))
}

function mapLocationRecord(record, fields) {
  const baseRecord = createEmptyRecord(fields)

  return fields.reduce((current, field) => {
    if (field === 'Id') {
      return {
        ...current,
        Id: record?.Id || record?.id || '',
      }
    }

    return {
      ...current,
      [field]: record?.[field] || '',
    }
  }, baseRecord)
}

function mapRecordToForm(record, fields) {
  return fields.reduce((current, field) => {
    return {
      ...current,
      [field]: record?.[field] || '',
    }
  }, createEmptyRecord(fields))
}

function buildPayload(formState, fields) {
  return fields
    .filter((field) => field !== 'Id')
    .reduce((current, field) => {
      const value = formState?.[field]

      return {
        ...current,
        [field]: typeof value === 'string' ? value.trim() : value || '',
      }
    }, {})
}

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

export default function EditGeneric({
  showToast,
  objectName,
  fields,
  redirectPath,
  requiredFields = [],
}) {
  const location = useLocation()
  const navigate = useNavigate()
  const notify = typeof showToast === 'function' ? showToast : () => {}
  const recordPass = mapLocationRecord(location.state?.record, fields)
  const recordPassId = typeof recordPass?.Id === 'string' ? recordPass.Id.trim() : ''
  const fieldsKey = fields.join(',')
  const [formState, setFormState] = useState(() => createEmptyRecord(fields))
  const [loadingMessage, setLoadingMessage] = useState('load data')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const handleChange = createFormChangeHandler(setFormState)
  const editableFields = Object.entries(formState).filter(([name]) => name !== 'Id')

  useEffect(() => {
    let isMounted = true

    void (async () => {
      setLoadingMessage('load data')
      setError('')

      await wait(1000)
      if (!isMounted) return

      try {
        if (!recordPassId) {
          setLoadingMessage('')
          setError('Id tidak di pass.')
          return
        }

        const safeId = escapeSoqlValue(recordPassId)
        const query = `SELECT ${fields.join(', ')} FROM ${objectName} WHERE Id = '${safeId}' LIMIT 1`
        const record = await getRecord(query)

        if (!isMounted) return

        if (!record) {
          setLoadingMessage('')
          setError('Data tidak ditemukan.')
          return
        }

        setFormState(mapRecordToForm(record, fields))
      } catch (err) {
        if (!isMounted) return
        setLoadingMessage('')
        setError(err.message || 'Gagal mengambil data.')
        return
      }

      if (!isMounted) return
      setLoadingMessage('')
      setError('')
    })()

    return () => {
      isMounted = false
    }
  }, [fieldsKey, objectName, recordPassId])

  async function handleSubmit(event) {
    event.preventDefault()
    setLoadingMessage('')
    setError('')

    const payload = buildPayload(formState, fields)

    if (!recordPassId) {
      setError('Id tidak di pass.')
      return
    }

    for (const field of requiredFields) {
      if (!payload[field]) {
        setError(`${field} wajib diisi.`)
        return
      }
    }

    try {
      setIsSaving(true)
      const safeId = escapeSoqlValue(recordPassId)
      await updateRecord(objectName, safeId, payload)
      await wait(1000)
      notify('data updated')
      navigate(redirectPath)
    } catch (err) {
      setError(err.message || 'Gagal menyimpan perubahan.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <section className="bg-white shadow-none">
        <div className="space-y-4 p-3 pb-8">
          <button className="bg-black" onClick={() => navigate(redirectPath)}>
            {'< Back'}
          </button>
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
              {editableFields.map(([name, value]) => (
                <div key={name}>
                  <label className="text-sm font-semibold text-slate-800" htmlFor={name}>
                    {name}
                  </label>
                  <input
                    id={name}
                    name={name}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none"
                    value={value}
                    onChange={handleChange}
                    disabled={Boolean(loadingMessage) || isSaving}
                  />
                </div>
              ))}

              <button
                type="submit"
                className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
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
