import { useEffect, useMemo, useState } from 'react'
import {
  createUiRecord,
  deleteUiRecord,
  fetchCreateDefaults,
  fetchPicklistValues,
  fetchRecordUi,
  searchLookupRecords,
  updateRecord,
} from '../services/salesforce.js'
import {
  buildCreateRecordPayload,
  buildRecordUpdatePayload,
  mapCreateDefaultsToLayoutModel,
  mapRecordUiToLayoutModel,
} from './hzRecordUi.js'

function mergeEditValueState(currentState, fieldName, nextValue, extras = {}) {
  return {
    ...currentState,
    [fieldName]: {
      ...currentState[fieldName],
      current: nextValue,
      ...extras,
    },
  }
}

function collectMissingRequiredFields(editValues = {}) {
  return Object.values(editValues)
    .filter((value) => value?.required)
    .filter((value) => value?.current === null || value?.current === undefined || value?.current === '')
    .map((value) => value?.label || '')
    .filter(Boolean)
}

export function useHzRecordPage(objectApiName, recordId, showToast) {
  const notify = typeof showToast === 'function' ? showToast : () => {}
  const isCreateMode = !recordId
  const [mode, setMode] = useState('View')
  const [recordView, setRecordView] = useState(null)
  const [editValues, setEditValues] = useState({})
  const [picklists, setPicklists] = useState({})
  const [error, setError] = useState('')
  const [loadingMessage, setLoadingMessage] = useState(
    isCreateMode
      ? `Mengambil create defaults ${objectApiName}...`
      : 'Mengambil detail record dari Salesforce...'
  )
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    let isMounted = true

    void (async () => {
      setLoadingMessage(
        isCreateMode
          ? `Mengambil create defaults ${objectApiName}...`
          : 'Mengambil detail record dari Salesforce...'
      )
      setError('')

      try {
        const response = isCreateMode
          ? await fetchCreateDefaults(objectApiName)
          : await fetchRecordUi(recordId)
        if (!isMounted) return

        const model = isCreateMode
          ? mapCreateDefaultsToLayoutModel(response, objectApiName)
          : mapRecordUiToLayoutModel(recordId, response)
        setRecordView(model)
        setEditValues(model.editValues)
        setMode(isCreateMode ? 'Create' : 'View')
      } catch (err) {
        if (!isMounted) return
        setRecordView(null)
        setEditValues({})
        setError(
          err.message ||
            (isCreateMode
              ? `Gagal mengambil create defaults ${objectApiName}.`
              : 'Gagal mengambil detail record.')
        )
      } finally {
        if (isMounted) {
          setLoadingMessage('')
        }
      }
    })()

    return () => {
      isMounted = false
    }
  }, [isCreateMode, objectApiName, recordId])

  const activeSections = useMemo(() => {
    if (isCreateMode) {
      return recordView?.layouts?.Full?.Create || []
    }

    return recordView?.layouts?.Full?.[mode] || []
  }, [isCreateMode, mode, recordView])

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

  function updateLookupValue(fieldName, nextValue, displayValue = '') {
    setEditValues((current) =>
      mergeEditValueState(current, fieldName, nextValue, {
        displayCurrent: displayValue,
      })
    )
  }

  async function searchLookupOptions(component, searchTerm) {
    const targetObjectApiName =
      component?.referenceTargetApiName || component?.referenceTargetApiNames?.[0] || ''

    if (!targetObjectApiName) {
      return []
    }

    return searchLookupRecords(targetObjectApiName, searchTerm, {
      limit: 8,
    })
  }

  function enterEditMode() {
    if (isCreateMode) return
    setMode('Edit')
  }

  function cancelEditMode() {
    if (!recordView) return
    setEditValues(recordView.editValues)
    setMode(isCreateMode ? 'Create' : 'View')
  }

  async function saveRecord() {
    if (isCreateMode) {
      return false
    }

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

  async function createRecord() {
    if (!isCreateMode) {
      return null
    }

    const missingRequiredFields = collectMissingRequiredFields(editValues)
    if (missingRequiredFields.length > 0) {
      setError(`Field wajib belum diisi: ${missingRequiredFields.join(', ')}`)
      return null
    }

    try {
      setIsSaving(true)
      setError('')

      const payload = buildCreateRecordPayload(objectApiName, editValues)
      const result = await createUiRecord(payload)
      const createdRecordId = result?.id || result?.record?.id || result?.recordId || ''

      if (!createdRecordId) {
        throw new Error('Record berhasil dibuat, tetapi Salesforce tidak mengembalikan record id.')
      }

      notify(`${objectApiName} berhasil dibuat.`)
      return createdRecordId
    } catch (err) {
      setError(err.message || `Gagal membuat ${objectApiName}.`)
      return null
    } finally {
      setIsSaving(false)
    }
  }

  async function deleteRecord() {
    if (isCreateMode) {
      return false
    }

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
    createRecord,
    editValues,
    ensurePicklist,
    error,
    isCreateMode,
    isDeleting,
    isSaving,
    loadingMessage,
    mode,
    picklists,
    recordView,
    searchLookupOptions,
    setMode,
    enterEditMode,
    cancelEditMode,
    updateFieldValue,
    updateLookupValue,
    saveRecord,
    deleteRecord,
  }
}
