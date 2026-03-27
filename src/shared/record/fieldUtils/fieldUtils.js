const LOCALIZED_FIELD_TYPES = new Set(['Multipicklist', 'Picklist', 'Currency', 'Date', 'DateTime'])
const VIEW_LIKE_MODES = new Set(['View', 'Readonly'])

export function toDisplayString(value, fieldInfo) {
  if (value === null || value === undefined) return ''

  if (value instanceof Date && !Number.isNaN(value.valueOf())) {
    return value.toLocaleString('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  }

  if (fieldInfo?.dataType === 'Boolean') {
    return value ? 'True' : 'False'
  }

  if (Array.isArray(value)) {
    return value.join(', ')
  }

  return String(value)
}

export function formatDateValue(rawValue, fieldInfo) {
  if (!rawValue) return ''

  const parsed = new Date(rawValue)
  if (Number.isNaN(parsed.valueOf())) {
    return String(rawValue)
  }

  if (fieldInfo?.dataType === 'Date') {
    return parsed.toLocaleDateString('id-ID', { dateStyle: 'medium' })
  }

  return parsed.toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export function isLocalizedFieldType(fieldType) {
  return LOCALIZED_FIELD_TYPES.has(fieldType)
}

export function isPersonAccount(record) {
  if (!record || (record.apiName !== 'Account' && record.apiName !== 'PersonAccount')) {
    return false
  }

  return Boolean(record?.fields?.IsPersonAccount?.value)
}

export function getCompoundFields(fieldApiName, record, objectInfo) {
  return Object.keys(objectInfo?.fields || {}).filter(
    (key) =>
      key !== fieldApiName &&
      record?.fields?.[key] &&
      objectInfo?.fields?.[key]?.compoundFieldName === fieldApiName
  )
}

export function isCompoundField(fieldApiName, objectInfo, personAccount = false) {
  const fieldInfo = objectInfo?.fields?.[fieldApiName]
  if (!fieldInfo || fieldInfo.compound === false) {
    return false
  }

  return Object.keys(objectInfo?.fields || {}).some((key) => {
    const candidate = objectInfo.fields[key]
    if (key === fieldApiName || candidate?.compoundFieldName !== fieldApiName) {
      return false
    }

    if (objectInfo.apiName === 'Account' && candidate.compoundFieldName === 'Name' && !personAccount) {
      return false
    }

    return true
  })
}

export function dedupeReferenceTargets(referenceTargets = []) {
  return referenceTargets.filter(
    (referenceTarget, index) =>
      referenceTarget?.apiName &&
      referenceTargets.findIndex((item) => item?.apiName === referenceTarget.apiName) === index
  )
}

export function extractReferenceTargets(fieldInfo) {
  const infoTargets = Array.isArray(fieldInfo?.referenceToInfos)
    ? fieldInfo.referenceToInfos.map((referenceInfo) => ({
        apiName:
          referenceInfo?.apiName ||
          referenceInfo?.objectApiName ||
          referenceInfo?.referenceTo ||
          '',
        nameFields: Array.isArray(referenceInfo?.nameFields) ? referenceInfo.nameFields : [],
      }))
    : []
  const legacyTargets = Array.isArray(fieldInfo?.referenceTo)
    ? fieldInfo.referenceTo.map((apiName) => ({
        apiName,
        nameFields: [],
      }))
    : []

  return dedupeReferenceTargets([...infoTargets, ...legacyTargets])
}

export function readRelatedDisplayValue(relatedValue, fallbackDisplayValue = '', nameFields = []) {
  const relatedFields = relatedValue?.fields

  if (!relatedFields || typeof relatedFields !== 'object') {
    return fallbackDisplayValue || ''
  }

  if (relatedFields.Name?.displayValue || relatedFields.Name?.value) {
    return relatedFields.Name.displayValue || String(relatedFields.Name.value)
  }

  if (nameFields.length > 0) {
    const joinedName = nameFields
      .map((nameField) => relatedFields?.[nameField]?.displayValue || relatedFields?.[nameField]?.value || '')
      .filter(Boolean)
      .join(' ')
      .trim()

    if (joinedName) {
      return joinedName
    }
  }

  const namedField = Object.entries(relatedFields).find(
    ([fieldName, fieldValue]) =>
      fieldName !== 'Id' && (fieldValue?.displayValue || fieldValue?.value)
  )

  if (namedField) {
    return namedField[1]?.displayValue || String(namedField[1]?.value || '')
  }

  return fallbackDisplayValue || ''
}

export function normalizeScalarDisplayValue(rawValue, displayValue, fieldInfo) {
  if (displayValue !== null && displayValue !== undefined && displayValue !== '') {
    return displayValue
  }

  if (rawValue === null || rawValue === undefined) {
    return ''
  }

  if (fieldInfo?.dataType === 'Date' || fieldInfo?.dataType === 'DateTime') {
    return formatDateValue(rawValue, fieldInfo)
  }

  return toDisplayString(rawValue, fieldInfo)
}

export function getLocationValue(fieldApiName, record, objectInfo) {
  const constituentFields = getCompoundFields(fieldApiName, record, objectInfo)
  const longitudeField = constituentFields.find((key) => /Longitude/i.test(key))
  const latitudeField = constituentFields.find((key) => /Latitude/i.test(key))

  return {
    latitude: latitudeField ? record?.fields?.[latitudeField]?.value ?? null : null,
    longitude: longitudeField ? record?.fields?.[longitudeField]?.value ?? null : null,
  }
}

export function normalizeCompoundChildKey(fieldApiName, childField, fieldInfo) {
  if (fieldInfo?.dataType === 'Address') {
    const prefix = fieldApiName.replace(/Address$/, '')
    return prefix ? childField.replace(prefix, '') : childField
  }

  return childField
}

export function getCompoundFieldData(fieldApiName, record, fieldInfo, objectInfo) {
  if (fieldInfo?.dataType === 'Location') {
    return {
      value: getLocationValue(fieldApiName, record, objectInfo),
    }
  }

  const compoundFields = getCompoundFields(fieldApiName, record, objectInfo)
  const value = {}
  const displayValue = {}

  compoundFields.forEach((childField) => {
    const childFieldInfo = objectInfo?.fields?.[childField]
    const childRecordField = record?.fields?.[childField]
    if (!childFieldInfo || !childRecordField) return

    const normalizedChildKey = normalizeCompoundChildKey(fieldApiName, childField, fieldInfo)

    value[normalizedChildKey] = childRecordField.value

    if (isLocalizedFieldType(childFieldInfo.dataType)) {
      displayValue[normalizedChildKey] = childRecordField.displayValue
    } else if (childRecordField.displayValue !== undefined && childRecordField.displayValue !== null) {
      displayValue[normalizedChildKey] = childRecordField.displayValue
    }
  })

  return {
    value,
    displayValue,
  }
}

export function buildUiField(fieldApiName, record, objectInfo) {
  const fieldInfo = objectInfo?.fields?.[fieldApiName]
  if (!fieldInfo) {
    return null
  }

  const result = {
    ...fieldInfo,
    type: fieldInfo.dataType,
    value: null,
    displayValue: '',
  }

  const personAccount = isPersonAccount(record)
  const referenceTargets = extractReferenceTargets(fieldInfo)

  if (fieldInfo.reference) {
    const relatedValue = fieldInfo.relationshipName
      ? record?.fields?.[fieldInfo.relationshipName]?.value
      : null
    const rawValue = record?.fields?.[fieldApiName]?.value ?? null
    const rawDisplayValue = record?.fields?.[fieldApiName]?.displayValue ?? ''
    const displayValue = readRelatedDisplayValue(
      relatedValue,
      rawDisplayValue,
      referenceTargets[0]?.nameFields || []
    )

    result.value = rawValue
    result.displayValue = displayValue
    result.referenceRecordId = rawValue
    result.referenceRecord = relatedValue || null
    result.referenceTargetApiName =
      relatedValue?.apiName ||
      relatedValue?.attributes?.type ||
      referenceTargets[0]?.apiName ||
      ''
    result.referenceTargetApiNames = referenceTargets.map((referenceTarget) => referenceTarget.apiName)
    return result
  }

  if (isCompoundField(fieldApiName, objectInfo, personAccount)) {
    const compoundData = getCompoundFieldData(fieldApiName, record, fieldInfo, objectInfo)
    result.value = compoundData.value
    result.displayValue = compoundData.displayValue
    result.isCompoundField = true
    result.compoundConstituentFields = getCompoundFields(fieldApiName, record, objectInfo)
    return result
  }

  const recordField = record?.fields?.[fieldApiName]
  result.value = recordField?.value ?? null

  if (isLocalizedFieldType(fieldInfo.dataType)) {
    result.displayValue = recordField?.displayValue ?? ''
  } else {
    result.displayValue = normalizeScalarDisplayValue(
      recordField?.value,
      recordField?.displayValue,
      fieldInfo
    )
  }

  return result
}

export function getEffectiveFieldApiName(component, objectInfo, modeType) {
  const fieldApiName = component?.apiName || ''
  const fieldInfo = objectInfo?.fields?.[fieldApiName]
  if (!fieldInfo) {
    return fieldApiName
  }

  if (!VIEW_LIKE_MODES.has(modeType)) {
    return fieldApiName
  }

  return fieldInfo.compoundFieldName || fieldApiName
}

export function resolveFieldLabel(item, component, uiField, effectiveFieldApiName, modeType) {
  if (VIEW_LIKE_MODES.has(modeType)) {
    return item?.label || component?.label || uiField.label || effectiveFieldApiName
  }

  return component?.label || uiField.label || item?.label || effectiveFieldApiName
}
