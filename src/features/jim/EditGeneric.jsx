import { useEffect, useState } from 'react'
import { createFormChangeHandler } from '../../shared/utils/forms.js'
import { escapeSoqlValue, getRecord, updateRecord } from '../../shared/services/salesforce.js'

function mapRecordToForm(record) {
  return Object.entries(record || {}).reduce((current, [field, value]) => {
    if (field === 'attributes') {
      return current
    }

    return {
      ...current,
      [field]: value || '',
    }
  }, {})
}

function buildPayload(formState) {
  return Object.entries(formState || {}).reduce((current, [field, value]) => {
    if (field === 'Id' || field === 'attributes') {
      return current
    }

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
  recordId,
  soql,
  requiredFields = [],
}) {
  const notify = typeof showToast === 'function' ? showToast : () => {}
  const normalizedRecordId = typeof recordId === 'string' ? recordId.trim() : ''
  //---
  const [formState, setFormState] = useState({})
  const [message, setMessage] = useState('load data')
  const [error, setError] = useState('')
  const [loadingInProgress, setLoadingInProgress] = useState(true)
  const [savingInProgress, setSavingInProgress] = useState(false)
  //---
  const handleChange = createFormChangeHandler(setFormState)
  const editableFields = Object.entries(formState).filter(([name]) => name !== 'Id')
  const canShowSaveButton = !loadingInProgress && editableFields.length > 0

  useEffect(() => {
    let isMounted = true

    void (async () => {
      setLoadingInProgress(true)
      setMessage('load data')
      setError('')

      //await wait(1000)
      //if (!isMounted) return

      try {
        if (!normalizedRecordId) {
          setLoadingInProgress(false)
          setMessage('')
          setError('Id tidak di pass.')
          return
        }

        const record = await getRecord(soql)
        if (!isMounted) return

        if (!record) {
          setLoadingInProgress(false)
          setMessage('')
          setError('Data tidak ditemukan.')
          return
        }else{
          setFormState(mapRecordToForm(record))
        }

      } catch (err) {
        if (!isMounted) return
        setLoadingInProgress(false)
        setMessage('')
        setError(err.message || 'Gagal mengambil data.')
        return
      }

      if (!isMounted) return
      setLoadingInProgress(false)
      setMessage('')
      setError('')
    })()

    return () => {
      isMounted = false
    }
  }, [normalizedRecordId, soql])

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    setError('')

    const payload = buildPayload(formState)

    if (!normalizedRecordId) {
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
      setSavingInProgress(true)
      const safeId = escapeSoqlValue(normalizedRecordId)
      await updateRecord(objectName, safeId, payload)
      await wait(1000)
      notify('data updated')
    } catch (err) {
      setError(err.message || 'Gagal menyimpan perubahan.')
    } finally {
      setSavingInProgress(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <section className="bg-white shadow-none">
        <div className="space-y-4 p-3 pb-8">
          <form
            className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100"
            onSubmit={(event) => void handleSubmit(event)}
          >
            {message ? (
              <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-700">
                {message}
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
                    disabled={loadingInProgress || savingInProgress}
                  />
                </div>
              ))}

              {canShowSaveButton ? (
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
                  disabled={loadingInProgress || savingInProgress}
                >
                  {savingInProgress ? 'Saving...' : 'Save changes'}
                </button>
              ) : null}
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}
