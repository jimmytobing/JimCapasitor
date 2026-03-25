import { useEffect, useMemo, useState } from 'react'
import {
  deleteUiRecord,
  fetchPicklistValues,
  fetchRecordUi,
  updateRecord,
} from '../../shared/services/salesforce.js'
import { buildRecordUpdatePayload, mapRecordUiToLayoutModel } from './vinaRecordUi.js'

function mergeEditValueState(currentState, fieldName, nextValue) {
  return {
    ...currentState,
    [fieldName]: {
      ...currentState[fieldName],
      current: nextValue,
    },
  }
}

export function useVinaRecordPage(recordId, showToast) {
  const notify = typeof showToast === 'function' ? showToast : () => {}
  const [mode, setMode] = useState('View')
  const [recordView, setRecordView] = useState(null)
  const [editValues, setEditValues] = useState({})
  const [picklists, setPicklists] = useState({})
  const [error, setError] = useState('')
  const [loadingMessage, setLoadingMessage] = useState('Mengambil detail record dari Salesforce...')
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    let isMounted = true

    void (async () => {
      setLoadingMessage('Mengambil detail record dari Salesforce...')
      setError('')

      try {
        const response = await fetchRecordUi(recordId)
        if (!isMounted) return

        const model = mapRecordUiToLayoutModel(recordId, response)
        setRecordView(model)
        setEditValues(model.editValues)
        setMode('View')
      } catch (err) {
        if (!isMounted) return
        setRecordView(null)
        setEditValues({})
        setError(err.message || 'Gagal mengambil detail record.')
      } finally {
        if (isMounted) {
          setLoadingMessage('')
        }
      }
    })()

    return () => {
      isMounted = false
    }
  }, [recordId])

  const activeSections = useMemo(() => {
    return recordView?.layouts?.Full?.[mode] || []
  }, [mode, recordView])

  async function ensurePicklist(url, objectApiName, currentRecordTypeId, fieldApiName) {
    if (!url || picklists[url]) return

    try {
      const result = await fetchPicklistValues(objectApiName, currentRecordTypeId, fieldApiName)
      setPicklists((current) => ({
        ...current,
        [url]: result,
      }))
    } catch (err) {
      setError(err.message || 'Gagal mengambil picklist.')
    }
  }

  function updateFieldValue(fieldName, nextValue) {
    setEditValues((current) => mergeEditValueState(current, fieldName, nextValue))
  }

  function enterEditMode() {
    setMode('Edit')
  }

  function cancelEditMode() {
    if (!recordView) return
    setEditValues(recordView.editValues)
    setMode('View')
  }

  async function saveRecord() {
    const payload = buildRecordUpdatePayload(editValues)

    if (!Object.keys(payload.fields).length) {
      notify('Belum ada perubahan yang perlu disimpan.')
      setMode('View')
      return true
    }

    try {
      setIsSaving(true)
      setError('')
      await updateRecord(recordView?.apiName || 'Account', recordId, payload.fields)
      const refreshed = await fetchRecordUi(recordId)
      const model = mapRecordUiToLayoutModel(recordId, refreshed)
      setRecordView(model)
      setEditValues(model.editValues)
      setMode('View')
      notify('Perubahan record berhasil disimpan.')
      return true
    } catch (err) {
      setError(err.message || 'Gagal menyimpan record.')
      return false
    } finally {
      setIsSaving(false)
    }
  }

  async function deleteRecord() {
    try {
      setIsDeleting(true)
      setError('')
      await deleteUiRecord(recordId)
      notify('Record berhasil dihapus.')
      return true
    } catch (err) {
      setError(err.message || 'Gagal menghapus record.')
      return false
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    activeSections,
    editValues,
    ensurePicklist,
    error,
    isDeleting,
    isSaving,
    loadingMessage,
    mode,
    picklists,
    recordView,
    setMode,
    enterEditMode,
    cancelEditMode,
    updateFieldValue,
    saveRecord,
    deleteRecord,
  }
}
