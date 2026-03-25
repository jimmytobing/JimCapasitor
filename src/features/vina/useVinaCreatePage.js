import { useEffect, useMemo, useState } from 'react'
import {
  createUiRecord,
  fetchCreateDefaults,
  fetchPicklistValues,
} from '../../shared/services/salesforce.js'
import {
  buildCreateRecordPayload,
  mapCreateDefaultsToLayoutModel,
} from './vinaRecordUi.js'

function mergeEditValueState(currentState, fieldName, nextValue) {
  return {
    ...currentState,
    [fieldName]: {
      ...currentState[fieldName],
      current: nextValue,
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

export function useVinaCreatePage(objectApiName, showToast) {
  const notify = typeof showToast === 'function' ? showToast : () => {}
  const [recordView, setRecordView] = useState(null)
  const [editValues, setEditValues] = useState({})
  const [picklists, setPicklists] = useState({})
  const [error, setError] = useState('')
  const [loadingMessage, setLoadingMessage] = useState(`Mengambil create defaults ${objectApiName}...`)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    let isMounted = true

    void (async () => {
      setLoadingMessage(`Mengambil create defaults ${objectApiName}...`)
      setError('')

      try {
        const response = await fetchCreateDefaults(objectApiName)
        if (!isMounted) return

        const model = mapCreateDefaultsToLayoutModel(response, objectApiName)
        setRecordView(model)
        setEditValues(model.editValues)
      } catch (err) {
        if (!isMounted) return
        setRecordView(null)
        setEditValues({})
        setError(err.message || `Gagal mengambil create defaults ${objectApiName}.`)
      } finally {
        if (isMounted) {
          setLoadingMessage('')
        }
      }
    })()

    return () => {
      isMounted = false
    }
  }, [objectApiName])

  const activeSections = useMemo(() => {
    return recordView?.layouts?.Full?.Create || []
  }, [recordView])

  async function ensurePicklist(url, objectName, currentRecordTypeId, fieldApiName) {
    if (!url || picklists[url]) return

    try {
      const result = await fetchPicklistValues(objectName, currentRecordTypeId, fieldApiName)
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

  async function createRecord() {
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

  return {
    activeSections,
    createRecord,
    editValues,
    ensurePicklist,
    error,
    isSaving,
    loadingMessage,
    picklists,
    recordView,
    updateFieldValue,
  }
}
