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

function readRelatedDisplayValue(relatedValue, fallbackDisplayValue = '') {
  const relatedFields = relatedValue?.fields

  if (!relatedFields || typeof relatedFields !== 'object') {
    return fallbackDisplayValue || ''
  }

  if (relatedFields.Name?.displayValue || relatedFields.Name?.value) {
    return relatedFields.Name.displayValue || String(relatedFields.Name.value)
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

function normalizeFieldComponent(component, item, record, objectInfo, recordTypeId) {
  const fieldApiName = component?.apiName
  const fieldInfo = objectInfo?.fields?.[fieldApiName]
  const recordField = record?.fields?.[fieldApiName]

  if (!fieldApiName || !fieldInfo || !recordField) {
    return null
  }

  let displayValue = recordField.displayValue
  const rawValue = recordField.value

  if (!displayValue && rawValue !== null && rawValue !== undefined) {
    if (fieldInfo.dataType === 'Date' || fieldInfo.dataType === 'DateTime') {
      displayValue = formatDateValue(rawValue, fieldInfo)
    } else {
      displayValue = toDisplayString(rawValue, fieldInfo)
    }
  }

  const isPicklist =
    fieldInfo.dataType === 'Picklist' || fieldInfo.dataType === 'Multipicklist'
  const referenceTargets = extractReferenceTargets(fieldInfo)
  const relatedValue = fieldInfo.relationshipName
    ? record?.fields?.[fieldInfo.relationshipName]?.value
    : null
  const lookupDisplayValue = fieldInfo.reference
    ? readRelatedDisplayValue(relatedValue, displayValue || '')
    : ''
  const resolvedDisplayValue = lookupDisplayValue || displayValue || ''
  const currentReferenceTargetApiName =
    relatedValue?.apiName ||
    relatedValue?.attributes?.type ||
    referenceTargets[0]?.apiName ||
    ''
  const resolvedLabel = fieldInfo.reference
    ? item.label || component.label || fieldInfo.label || fieldApiName
    : component.label || item.label || fieldInfo.label || fieldApiName

  return {
    label: resolvedLabel,
    field: fieldApiName,
    fieldInfo,
    value: rawValue,
    displayValue: resolvedDisplayValue,
    editableForUpdate: Boolean(item?.editableForUpdate),
    editableForNew: Boolean(item?.editableForNew),
    required: Boolean(item?.required),
    isNull: rawValue === null || rawValue === undefined || displayValue === '',
    isLookup: Boolean(fieldInfo.reference),
    lookupDisplayValue,
    referenceTargetApiName: currentReferenceTargetApiName,
    referenceTargetApiNames: referenceTargets.map((referenceTarget) => referenceTarget.apiName),
    picklistUrl: isPicklist
      ? `/ui-api/object-info/${objectInfo.apiName}/picklist-values/${recordTypeId}/${fieldApiName}`
      : null,
  }
}

function extractReferenceMeta(values, objectInfo, record) {
  let linkId = ''
  let linkText = ''

  values.forEach((value) => {
    const fieldInfo = objectInfo?.fields?.[value.field]
    if (!fieldInfo?.reference || !fieldInfo.relationshipName) return

    const relatedValue = record?.fields?.[fieldInfo.relationshipName]?.value
    const relatedId = relatedValue?.fields?.Id?.value
    const relatedName = relatedValue?.fields?.Name?.value

    if (relatedId && relatedName) {
      linkId = relatedId
      linkText = relatedName
    }
  })

  return { linkId, linkText }
}

function mapLayoutItem(item, record, objectInfo, recordTypeId) {
  const values = (item?.layoutComponents || [])
    .filter((component) => component?.componentType === 'Field')
    .map((component) => normalizeFieldComponent(component, item, record, objectInfo, recordTypeId))
    .filter(Boolean)

  const { linkId, linkText } = extractReferenceMeta(values, objectInfo, record)

  return {
    label: item?.label || '',
    values,
    linkId,
    linkText,
    customLinkUrl: null,
    customText: '',
  }
}

function mapLayoutRow(layoutRow, record, objectInfo, recordTypeId) {
  return {
    items: (layoutRow?.layoutItems || []).map((item) =>
      mapLayoutItem(item, record, objectInfo, recordTypeId)
    ),
  }
}

function mapLayoutSection(section, record, objectInfo, recordTypeId) {
  return {
    heading: section?.heading || '',
    useHeading: Boolean(section?.useHeading),
    rows: (section?.layoutRows || []).map((row) =>
      mapLayoutRow(row, record, objectInfo, recordTypeId)
    ),
  }
}

function buildEditValues(layouts) {
  const editValues = {}

  Object.values(layouts).forEach((layoutModes) => {
    const editSections = layoutModes?.Edit || []

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
        mapLayoutSection(section, record, objectInfo, recordTypeId)
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
    mapLayoutSection(section, record, objectInfo, recordTypeId)
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
