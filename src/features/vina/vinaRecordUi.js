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

  return {
    label: component.label || item.label || fieldInfo.label || fieldApiName,
    field: fieldApiName,
    fieldInfo,
    value: rawValue,
    displayValue: displayValue || '',
    editableForUpdate: Boolean(item?.editableForUpdate),
    editableForNew: Boolean(item?.editableForNew),
    isNull: rawValue === null || rawValue === undefined || displayValue === '',
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
  const title =
    titleValue?.displayValue ||
    toDisplayString(titleValue?.value, objectInfo?.fields?.[titleFieldName]) ||
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

export function buildRecordUpdatePayload(editValues) {
  const fields = {}

  Object.entries(editValues || {}).forEach(([fieldName, value]) => {
    if (value?.original !== value?.current) {
      fields[fieldName] = value?.current
    }
  })

  return { fields }
}
