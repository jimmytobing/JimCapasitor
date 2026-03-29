import {
  buildUiField,
  getEffectiveFieldApiName,
  resolveFieldLabel,
  toDisplayString,
} from '../fieldUtils/fieldUtils.js'

function normalizeFieldComponent(component, item, record, objectInfo, recordTypeId, modeType) {
  const rawFieldApiName = component?.apiName
  const effectiveFieldApiName = getEffectiveFieldApiName(component, objectInfo, modeType)
  const uiField = buildUiField(effectiveFieldApiName, record, objectInfo)

  if (!rawFieldApiName || !uiField) {
    return null
  }

  const isPicklist =
    uiField.dataType === 'Picklist' || uiField.dataType === 'Multipicklist'
  const resolvedLabel = resolveFieldLabel(
    item,
    component,
    uiField,
    effectiveFieldApiName,
    modeType
  )

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
    subtitle: item?.attributes?.type || 'HypeZone Record',
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
    throw new Error('Metadata layout HypeZone tidak lengkap.')
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
    throw new Error('Create defaults HypeZone tidak lengkap.')
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
