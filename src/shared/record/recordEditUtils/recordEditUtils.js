export function mergeEditValueState(currentState, fieldName, nextValue, extras = {}) {
  return {
    ...currentState,
    [fieldName]: {
      ...currentState[fieldName],
      current: nextValue,
      ...extras,
    },
  }
}

export function clearFieldError(currentErrors = {}, fieldName) {
  if (!currentErrors[fieldName]) {
    return currentErrors
  }

  const nextErrors = { ...currentErrors }
  delete nextErrors[fieldName]
  return nextErrors
}

export function collectMissingRequiredFields(editValues = {}) {
  return Object.values(editValues)
    .filter((value) => value?.required)
    .filter((value) => value?.current === null || value?.current === undefined || value?.current === '')
    .map((value) => value?.label || '')
    .filter(Boolean)
}

export function buildMissingRequiredFieldErrors(editValues = {}) {
  return Object.entries(editValues)
    .filter(([, value]) => value?.required)
    .filter(([, value]) => value?.current === null || value?.current === undefined || value?.current === '')
    .reduce((result, [fieldName, value]) => {
      result[fieldName] = `${value?.label || fieldName} wajib diisi.`
      return result
    }, {})
}

export function buildMissingRequiredErrorMessage(editValues = {}) {
  const missingRequiredFields = collectMissingRequiredFields(editValues)

  if (missingRequiredFields.length === 0) {
    return ''
  }

  return `Field wajib belum diisi: ${missingRequiredFields.join(', ')}`
}

export function normalizeFieldMatchValue(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
}

export function extractFieldErrors(message, editValues = {}) {
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
