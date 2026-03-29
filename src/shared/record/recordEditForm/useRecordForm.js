import { useEffect, useMemo, useState } from 'react'
import {
  createUiRecord,
  deleteUiRecord,
  fetchCreateDefaults,
  fetchPicklistValues,
  fetchRecordUi,
  searchLookupRecords,
  updateRecord,
} from '../../services/index.js'
import {
  buildCreateRecordPayload,
  buildRecordUpdatePayload,
  mapCreateDefaultsToLayoutModel,
  mapRecordUiToLayoutModel,
} from './hzRecordUi.js'
import {
  applyDependentValueCleanup,
  getFilteredPicklistValues,
  normalizePicklistMeta,
} from '../fieldDependencyManager/index.js'
import {
  buildMissingRequiredErrorMessage,
  buildMissingRequiredFieldErrors,
  clearFieldError,
  collectMissingRequiredFields,
  extractFieldErrors,
  mergeEditValueState,
} from '../recordEditUtils/index.js'
import { maskBackendName } from '../../utils/branding.js'

function getLoadingMessage(isCreateMode, objectApiName) {
  return isCreateMode
    ? `Mengambil create defaults ${objectApiName}...`
    : 'Mengambil detail record dari HypeZone...'
}

function buildComponentLookup(sections = []) {
  const componentLookup = new Map()

  sections.forEach((section) => {
    section?.rows?.forEach((row) => {
      row?.items?.forEach((item) => {
        item?.values?.forEach((component) => {
          const keys = [component?.rawField, component?.field].filter(Boolean)

          keys.forEach((key) => {
            if (!componentLookup.has(key)) {
              componentLookup.set(key, component)
            }
          })
        })
      })
    })
  })

  return componentLookup
}

function buildSectionLookup(sections = []) {
  return new Map(
    sections.map((section) => [section?.heading || '', section])
  )
}

function shouldUseEditItem(viewItem, editItem) {
  if (!editItem) {
    return false
  }

  if ((viewItem?.label || '') === (editItem?.label || '')) {
    return true
  }

  const viewRawFields = new Set(
    (viewItem?.values || []).map((component) => component?.rawField).filter(Boolean)
  )

  return (editItem?.values || []).some((component) => viewRawFields.has(component?.rawField))
}

function mergeEditSectionsWithViewStructure(viewSections = [], editSections = []) {
  if (!viewSections.length) {
    return editSections
  }

  const editComponentLookup = buildComponentLookup(editSections)
  const editSectionLookup = buildSectionLookup(editSections)

  return viewSections.map((section) => {
    const editSection = editSectionLookup.get(section?.heading || '')

    return {
      ...section,
      rows: (section?.rows || []).map((row, rowIndex) => ({
        ...row,
        items: (row?.items || []).map((item, itemIndex) => {
          const editItem = editSection?.rows?.[rowIndex]?.items?.[itemIndex]

          if (shouldUseEditItem(item, editItem)) {
            return editItem
          }

          return {
            ...item,
            values: (item?.values || []).map((component) => {
              const mergedComponent =
                editComponentLookup.get(component?.rawField) || editComponentLookup.get(component?.field)

              return mergedComponent ? { ...component, ...mergedComponent } : component
            }),
          }
        }),
      })),
    }
  })
}

export function useRecordForm(objectApiName, recordId, showToast) {
  const notify = typeof showToast === 'function' ? showToast : () => {}
  const isCreateMode = !recordId
  const [mode, setMode] = useState('View')
  const [recordView, setRecordView] = useState(null)
  const [editValues, setEditValues] = useState({})
  const [picklists, setPicklists] = useState({})
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [loadingMessage, setLoadingMessage] = useState(
    getLoadingMessage(isCreateMode, objectApiName)
  )
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    let isMounted = true

    void (async () => {
      setLoadingMessage(getLoadingMessage(isCreateMode, objectApiName))
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
          maskBackendName(
            err.message,
            isCreateMode
              ? `Gagal mengambil create defaults ${objectApiName}.`
              : 'Gagal mengambil detail record.'
          )
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

    if (mode === 'Edit') {
      return mergeEditSectionsWithViewStructure(
        recordView?.layouts?.Full?.View || [],
        recordView?.layouts?.Full?.Edit || []
      )
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

  async function ensurePicklist(url, targetObjectApiName, currentRecordTypeId, fieldApiName, fieldInfo) {
    if (!url || picklists[url]) return

    try {
      const result = await fetchPicklistValues(
        targetObjectApiName,
        currentRecordTypeId,
        fieldApiName
      )

      setPicklists((current) => ({
        ...current,
        [url]: normalizePicklistMeta(result, fieldApiName, fieldInfo),
      }))
    } catch (err) {
      setError(maskBackendName(err.message, 'Gagal mengambil picklist.'))
      setFieldErrors({})
    }
  }

  function updateFieldValue(fieldName, nextValue) {
    setFieldErrors((current) => clearFieldError(current, fieldName))
    setEditValues((current) => {
      const nextState = mergeEditValueState(current, fieldName, nextValue)
      return applyDependentValueCleanup(nextState, fieldName, picklists)
    })
  }

  function updateLookupValue(fieldName, nextValue, displayValue = '') {
    setFieldErrors((current) => clearFieldError(current, fieldName))
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

  function resetFieldValue(fieldName) {
    setFieldErrors((current) => clearFieldError(current, fieldName))
    setEditValues((current) => {
      const fieldState = current?.[fieldName]
      if (!fieldState) {
        return current
      }

      const nextState = mergeEditValueState(current, fieldName, fieldState.original, {
        displayCurrent: fieldState.displayOriginal,
      })

      return applyDependentValueCleanup(nextState, fieldName, picklists)
    })
  }

  async function searchLookupOptions(component, searchTerm) {
    const targetObjectApiName =
      component?.referenceTargetApiName || component?.referenceTargetApiNames?.[0] || ''

    if (!targetObjectApiName) {
      return []
    }

    return searchLookupRecords(targetObjectApiName, searchTerm, { limit: 8 })
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
      setError(buildMissingRequiredErrorMessage(editValues))
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

      await updateRecord(recordView?.apiName || objectApiName || 'Account', recordId, payload.fields)

      const refreshed = await fetchRecordUi(recordId)
      const model = mapRecordUiToLayoutModel(recordId, refreshed)

      setRecordView(model)
      setEditValues(model.editValues)
      setMode('View')
      notify('Perubahan record berhasil disimpan.')
      return true
    } catch (err) {
      const nextError = maskBackendName(err.message, 'Gagal menyimpan record.')
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
      setError(buildMissingRequiredErrorMessage(editValues))
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
        throw new Error('Record berhasil dibuat, tetapi HypeZone tidak mengembalikan record id.')
      }

      notify(`${objectApiName} berhasil dibuat.`)
      return createdRecordId
    } catch (err) {
      const nextError = maskBackendName(err.message, `Gagal membuat ${objectApiName}.`)
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
      setError(maskBackendName(err.message, 'Gagal menghapus record.'))
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
    resetFieldValue,
    saveRecord,
    deleteRecord,
  }
}
