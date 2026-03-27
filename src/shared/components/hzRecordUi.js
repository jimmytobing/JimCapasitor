const LOCALIZED_FIELD_TYPES = new Set(['Multipicklist', 'Picklist', 'Currency', 'Date', 'DateTime'])
const VIEW_LIKE_MODES = new Set(['View', 'Readonly'])

function toDisplayString(value, fieldInfo) {
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

function formatDateValue(rawValue, fieldInfo) {
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

function isLocalizedFieldType(fieldType) {
  return LOCALIZED_FIELD_TYPES.has(fieldType)
}

function isPersonAccount(record) {
  if (!record || (record.apiName !== 'Account' && record.apiName !== 'PersonAccount')) {
    return false
  }

  return Boolean(record?.fields?.IsPersonAccount?.value)
}

function getCompoundFields(fieldApiName, record, objectInfo) {
  return Object.keys(objectInfo?.fields || {}).filter(
    (key) =>
      key !== fieldApiName &&
      record?.fields?.[key] &&
      objectInfo?.fields?.[key]?.compoundFieldName === fieldApiName
  )
}

function isCompoundField(fieldApiName, objectInfo, personAccount = false) {
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

function dedupeReferenceTargets(referenceTargets = []) {
  return referenceTargets.filter(
    (referenceTarget, index) =>
      referenceTarget?.apiName &&
      referenceTargets.findIndex((item) => item?.apiName === referenceTarget.apiName) === index
  )
}

function extractReferenceTargets(fieldInfo) {
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

function readRelatedDisplayValue(relatedValue, fallbackDisplayValue = '', nameFields = []) {
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

function normalizeScalarDisplayValue(rawValue, displayValue, fieldInfo) {
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

function getLocationValue(fieldApiName, record, objectInfo) {
  const constituentFields = getCompoundFields(fieldApiName, record, objectInfo)
  const longitudeField = constituentFields.find((key) => /Longitude/i.test(key))
  const latitudeField = constituentFields.find((key) => /Latitude/i.test(key))

  return {
    latitude: latitudeField ? record?.fields?.[latitudeField]?.value ?? null : null,
    longitude: longitudeField ? record?.fields?.[longitudeField]?.value ?? null : null,
  }
}

function getCompoundFieldData(fieldApiName, record, fieldInfo, objectInfo) {
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

    value[childField] = childRecordField.value

    if (isLocalizedFieldType(childFieldInfo.dataType)) {
      displayValue[childField] = childRecordField.displayValue
    } else if (childRecordField.displayValue !== undefined && childRecordField.displayValue !== null) {
      displayValue[childField] = childRecordField.displayValue
    }
  })

  return {
    value,
    displayValue,
  }
}

function buildUiField(fieldApiName, record, objectInfo) {
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

function getEffectiveFieldApiName(component, objectInfo, modeType) {
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

function normalizeFieldComponent(component, item, record, objectInfo, recordTypeId, modeType) {
  const rawFieldApiName = component?.apiName
  const effectiveFieldApiName = getEffectiveFieldApiName(component, objectInfo, modeType)
  const uiField = buildUiField(effectiveFieldApiName, record, objectInfo)

  if (!rawFieldApiName || !uiField) {
    return null
  }

  const isPicklist =
    uiField.dataType === 'Picklist' || uiField.dataType === 'Multipicklist'
  const resolvedLabel = item?.label || component?.label || uiField.label || effectiveFieldApiName

  return {
    label: resolvedLabel,
    field: effectiveFieldApiName,
    rawField: rawFieldApiName,
    fieldInfo: uiField,
    value: uiField.value,
    displayValue: uiField.displayValue,
    editableForUpdate: Boolean(item?.editableForUpdate),
    editableForNew: Boolean(item?.editableForNew),
    required: Boolean(item?.required),
    isNull:
      uiField.value === null ||
      uiField.value === undefined ||
      uiField.displayValue === '',
    isLookup: Boolean(uiField.reference),
    isCompoundField: Boolean(uiField.isCompoundField),
    referenceRecordId: uiField.referenceRecordId || '',
    referenceRecord: uiField.referenceRecord || null,
    referenceTargetApiName: uiField.referenceTargetApiName || '',
    referenceTargetApiNames: uiField.referenceTargetApiNames || [],
    lookupDisplayValue: uiField.displayValue || '',
    picklistUrl: isPicklist
      ? `/ui-api/object-info/${objectInfo.apiName}/picklist-values/${recordTypeId}/${effectiveFieldApiName}`
      : null,
  }
}

function mapLayoutItem(item, record, objectInfo, recordTypeId, modeType) {
  const dedupedValues = []
  const seenFields = new Set()

  ;(item?.layoutComponents || [])
    .filter((component) => component?.componentType === 'Field')
    .forEach((component) => {
      const normalized = normalizeFieldComponent(
        component,
        item,
        record,
        objectInfo,
        recordTypeId,
        modeType
      )

      if (!normalized || seenFields.has(normalized.field)) {
        return
      }

      seenFields.add(normalized.field)
      dedupedValues.push(normalized)
    })

  const firstReference = dedupedValues.find((value) => value?.isLookup && value?.referenceRecordId)

  return {
    label: item?.label || '',
    values: dedupedValues,
    linkId: firstReference?.referenceRecordId || '',
    linkText: firstReference?.lookupDisplayValue || '',
    customLinkUrl: null,
    customText: '',
  }
}

function mapLayoutRow(layoutRow, record, objectInfo, recordTypeId, modeType) {
  return {
    items: (layoutRow?.layoutItems || []).map((item) =>
      mapLayoutItem(item, record, objectInfo, recordTypeId, modeType)
    ),
  }
}

function mapLayoutSection(section, record, objectInfo, recordTypeId, modeType) {
  return {
    heading: section?.heading || '',
    useHeading: Boolean(section?.useHeading),
    rows: (section?.layoutRows || []).map((row) =>
      mapLayoutRow(row, record, objectInfo, recordTypeId, modeType)
    ),
  }
}

function buildEditValues(layouts) {
  const editValues = {}

  Object.values(layouts).forEach((layoutModes) => {
    const editSections = layoutModes?.Edit || layoutModes?.Create || []

    editSections.forEach((section) => {
      section.rows.forEach((row) => {
        row.items.forEach((item) => {
          item.values.forEach((value) => {
            editValues[value.field] = {
              original: value.value,
              current: value.value,
              fieldInfo: value.fieldInfo,
              picklistUrl: value.picklistUrl,
              label: value.label,
              required: value.required,
              displayOriginal: value.lookupDisplayValue || value.displayValue || '',
              displayCurrent: value.lookupDisplayValue || value.displayValue || '',
            }
          })
        })
      })
    })
  })

  return editValues
}

export function mapRecentItemsToCards(recentItems = []) {
  return recentItems.map((item, index) => ({
    id: item?.Id || `recent-${index + 1}`,
    title: item?.Name || item?.CaseNumber || item?.attributes?.type || `Record ${index + 1}`,
    subtitle: item?.attributes?.type || 'Salesforce Record',
    meta: item?.CaseNumber ? `Case ${item.CaseNumber}` : item?.LastViewedDate || '',
    objectType: item?.attributes?.type || '',
    raw: item,
  }))
}

export function mapRecordUiToLayoutModel(recordId, recordView) {
  const record = recordView?.records?.[recordId]

  if (!record) {
    throw new Error('Record tidak ditemukan pada response UI API.')
  }

  const apiName = record.apiName
  const objectInfo = recordView?.objectInfos?.[apiName]
  const entityLayout = recordView?.layouts?.[apiName]

  if (!objectInfo || !entityLayout) {
    throw new Error('Metadata layout Salesforce tidak lengkap.')
  }

  const recordTypeId =
    record?.recordTypeInfo?.recordTypeId || Object.keys(entityLayout)[0] || '012000000000000AAA'
  const recordTypeLayouts = entityLayout?.[recordTypeId] || entityLayout?.[Object.keys(entityLayout)[0]]

  if (!recordTypeLayouts) {
    throw new Error('Layout record type tidak tersedia.')
  }

  const layouts = {}

  Object.entries(recordTypeLayouts).forEach(([layoutType, layoutModes]) => {
    layouts[layoutType] = {}

    Object.entries(layoutModes || {}).forEach(([modeType, layoutRep]) => {
      layouts[layoutType][modeType] = (layoutRep?.sections || []).map((section) =>
        mapLayoutSection(section, record, objectInfo, recordTypeId, modeType)
      )
    })
  })

  const titleFieldName = objectInfo?.nameFields?.[0] || 'Name'
  const titleValue = record?.fields?.[titleFieldName]
  const lastNameValue = record?.fields?.LastName
  const title =
    titleValue?.displayValue ||
    toDisplayString(titleValue?.value, objectInfo?.fields?.[titleFieldName]) ||
    lastNameValue?.displayValue ||
    toDisplayString(lastNameValue?.value, objectInfo?.fields?.LastName) ||
    recordId

  return {
    recordId,
    apiName,
    title,
    objectInfo,
    recordTypeId,
    layouts,
    editValues: buildEditValues(layouts),
    rawRecord: record,
  }
}

export function mapCreateDefaultsToLayoutModel(defaults, objectApiName) {
  const objectInfo = defaults?.objectInfo || defaults?.objectInfos?.[objectApiName]
  const record = defaults?.record
  const layout = defaults?.layout

  if (!objectInfo || !record || !layout) {
    throw new Error('Create defaults Salesforce tidak lengkap.')
  }

  const recordTypeId =
    record?.recordTypeInfo?.recordTypeId ||
    layout?.recordTypeId ||
    objectInfo?.defaultRecordTypeId ||
    '012000000000000AAA'

  const layoutType = layout?.layoutType || 'Full'
  const modeType = layout?.mode || 'Create'
  const sections = (layout?.sections || []).map((section) =>
    mapLayoutSection(section, record, objectInfo, recordTypeId, modeType)
  )
  const layouts = {
    [layoutType]: {
      [modeType]: sections,
    },
  }

  return {
    recordId: '',
    apiName: objectInfo.apiName || objectApiName,
    title: `New ${objectInfo.label || objectApiName}`,
    objectInfo,
    recordTypeId,
    layouts,
    editValues: buildEditValues(layouts),
    rawRecord: record,
  }
}

export function buildRecordUpdatePayload(editValues) {
  const fields = {}

  Object.entries(editValues || {}).forEach(([fieldName, value]) => {
    if (value?.original !== value?.current) {
      fields[fieldName] = value?.current
    }
  })

  return { fields }
}

export function buildCreateRecordPayload(apiName, editValues) {
  const fields = {}

  Object.entries(editValues || {}).forEach(([fieldName, value]) => {
    const currentValue = value?.current

    if (currentValue === null || currentValue === undefined || currentValue === '') {
      return
    }

    fields[fieldName] = currentValue
  })

  return {
    apiName,
    fields,
  }
}
