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

function buildMissingRequiredFieldErrors(editValues = {}) {
  return Object.entries(editValues)
    .filter(([, value]) => value?.required)
    .filter(([, value]) => value?.current === null || value?.current === undefined || value?.current === '')
    .reduce((result, [fieldName, value]) => {
      result[fieldName] = `${value?.label || fieldName} wajib diisi.`
      return result
    }, {})
}

function normalizeFieldMatchValue(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
}

function extractFieldErrors(message, editValues = {}) {
  if (!message) return {}

  const entries = Object.entries(editValues || {})
  if (entries.length === 0) return {}

  const result = {}
  const fieldMessageParts = String(message)
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean)

  fieldMessageParts.forEach((part) => {
    const separatorIndex = part.indexOf(':')
    if (separatorIndex <= 0) return

    const rawFieldName = part.slice(0, separatorIndex).trim()
    const fieldMessage = part.slice(separatorIndex + 1).trim() || part
    const normalizedRawFieldName = normalizeFieldMatchValue(rawFieldName)

    const matchedFieldEntry = entries.find(([fieldApiName, fieldValue]) => {
      const candidates = [
        fieldApiName,
        fieldValue?.label,
        fieldValue?.fieldInfo?.label,
      ]

      return candidates.some(
        (candidate) => candidate && normalizeFieldMatchValue(candidate) === normalizedRawFieldName
      )
    })

    if (!matchedFieldEntry) return
    result[matchedFieldEntry[0]] = fieldMessage
  })

  return result
}

function getControllerFieldName(fieldInfo = {}) {
  return (
    fieldInfo?.controllerName ||
    fieldInfo?.controllingField ||
    fieldInfo?.controllingFields?.[0] ||
    ''
  )
}

function normalizePicklistMeta(result, fieldApiName, fieldInfo = {}) {
  return {
    ...result,
    fieldApiName,
    controllerName: getControllerFieldName(fieldInfo),
    values: Array.isArray(result?.values) ? result.values : [],
    controllerValues: result?.controllerValues || {},
  }
}

function getFilteredPicklistValues(picklistMeta, controllerValue) {
  const options = Array.isArray(picklistMeta?.values) ? picklistMeta.values : []
  const controllerValues = picklistMeta?.controllerValues || {}
  const hasController = Boolean(picklistMeta?.controllerName) && Object.keys(controllerValues).length > 0

  if (!hasController) {
    return options
  }

  if (controllerValue === null || controllerValue === undefined || controllerValue === '') {
    return []
  }

  const controllerIndex = controllerValues[controllerValue]
  if (controllerIndex === null || controllerIndex === undefined) {
    return []
  }

  return options.filter((option) => Array.isArray(option?.validFor) && option.validFor.includes(controllerIndex))
}

function applyDependentValueCleanup(nextEditValues, changedFieldName, picklists) {
  const nextState = { ...nextEditValues }

  Object.values(picklists || {}).forEach((picklistMeta) => {
    if (picklistMeta?.controllerName !== changedFieldName) {
      return
    }

    const dependentFieldName = picklistMeta?.fieldApiName
    const dependentFieldState = nextState?.[dependentFieldName]
    if (!dependentFieldState) {
      return
    }

    const controllerValue = nextState?.[changedFieldName]?.current
    const allowedValues = getFilteredPicklistValues(picklistMeta, controllerValue)
    const currentValue = dependentFieldState?.current
    const isCurrentValueAllowed =
      currentValue === null ||
      currentValue === undefined ||
      currentValue === '' ||
      allowedValues.some((option) => option?.value === currentValue)

    if (isCurrentValueAllowed) {
      return
    }

    nextState[dependentFieldName] = {
      ...dependentFieldState,
      current: '',
      displayCurrent: '',
    }
  })

  return nextState
}

export function useHzRecordPage(objectApiName, recordId, showToast) {
  const notify = typeof showToast === 'function' ? showToast : () => {}
  const isCreateMode = !recordId
  const [mode, setMode] = useState('View')
  const [recordView, setRecordView] = useState(null)
  const [editValues, setEditValues] = useState({})
  const [picklists, setPicklists] = useState({})
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
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
      setFieldErrors({})

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
        setFieldErrors({})
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

  const dirtyFieldsCount = useMemo(
    () =>
      Object.values(editValues || {}).filter((value) => value?.original !== value?.current).length,
    [editValues]
  )

  const resolvedPicklists = useMemo(() => {
    return Object.entries(picklists || {}).reduce((result, [url, picklistMeta]) => {
      const controllerName = picklistMeta?.controllerName || ''
      const controllerValue = controllerName ? editValues?.[controllerName]?.current : undefined
      const options = getFilteredPicklistValues(picklistMeta, controllerValue)
      const disabled =
        Boolean(controllerName) &&
        (controllerValue === null || controllerValue === undefined || controllerValue === '')

      result[url] = {
        ...picklistMeta,
        values: options,
        disabled,
      }

      return result
    }, {})
  }, [editValues, picklists])

  async function ensurePicklist(url, objectApiName, currentRecordTypeId, fieldApiName, fieldInfo) {
    if (!url || picklists[url]) return

    try {
      const result = await fetchPicklistValues(objectApiName, currentRecordTypeId, fieldApiName)
      setPicklists((current) => ({
        ...current,
        [url]: normalizePicklistMeta(result, fieldApiName, fieldInfo),
      }))
    } catch (err) {
      setError(err.message || 'Gagal mengambil picklist.')
      setFieldErrors({})
    }
  }

  function updateFieldValue(fieldName, nextValue) {
    setFieldErrors((current) => {
      if (!current[fieldName]) return current

      const nextErrors = { ...current }
      delete nextErrors[fieldName]
      return nextErrors
    })
    setEditValues((current) => {
      const nextState = mergeEditValueState(current, fieldName, nextValue)
      return applyDependentValueCleanup(nextState, fieldName, picklists)
    })
  }

  function updateLookupValue(fieldName, nextValue, displayValue = '') {
    setFieldErrors((current) => {
      if (!current[fieldName]) return current

      const nextErrors = { ...current }
      delete nextErrors[fieldName]
      return nextErrors
    })
    setEditValues((current) =>
      applyDependentValueCleanup(
        mergeEditValueState(current, fieldName, nextValue, {
          displayCurrent: displayValue,
        }),
        fieldName,
        picklists
      )
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
    setFieldErrors({})
    setMode(isCreateMode ? 'Create' : 'View')
  }

  async function saveRecord() {
    if (isCreateMode) {
      return false
    }

    const missingRequiredFields = collectMissingRequiredFields(editValues)
    if (missingRequiredFields.length > 0) {
      setError(`Field wajib belum diisi: ${missingRequiredFields.join(', ')}`)
      setFieldErrors(buildMissingRequiredFieldErrors(editValues))
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
      setFieldErrors({})
      await updateRecord(recordView?.apiName || 'Account', recordId, payload.fields)
      const refreshed = await fetchRecordUi(recordId)
      const model = mapRecordUiToLayoutModel(recordId, refreshed)
      setRecordView(model)
      setEditValues(model.editValues)
      setMode('View')
      notify('Perubahan record berhasil disimpan.')
      return true
    } catch (err) {
      const nextError = err.message || 'Gagal menyimpan record.'
      setError(nextError)
      setFieldErrors(extractFieldErrors(nextError, editValues))
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
      setFieldErrors(buildMissingRequiredFieldErrors(editValues))
      return null
    }

    try {
      setIsSaving(true)
      setError('')
      setFieldErrors({})

      const payload = buildCreateRecordPayload(objectApiName, editValues)
      const result = await createUiRecord(payload)
      const createdRecordId = result?.id || result?.record?.id || result?.recordId || ''

      if (!createdRecordId) {
        throw new Error('Record berhasil dibuat, tetapi Salesforce tidak mengembalikan record id.')
      }

      notify(`${objectApiName} berhasil dibuat.`)
      return createdRecordId
    } catch (err) {
      const nextError = err.message || `Gagal membuat ${objectApiName}.`
      setError(nextError)
      setFieldErrors(extractFieldErrors(nextError, editValues))
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
      setFieldErrors({})
      await deleteUiRecord(recordId)
      notify('Record berhasil dihapus.')
      return true
    } catch (err) {
      setError(err.message || 'Gagal menghapus record.')
      setFieldErrors({})
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
    fieldErrors,
    isCreateMode,
    isDeleting,
    isSaving,
    loadingMessage,
    mode,
    dirtyFieldsCount,
    picklists: resolvedPicklists,
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
