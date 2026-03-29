export const TITLE_FIELD_CANDIDATES = ['Name', 'Title', 'Name__c', 'Title__c']

function sanitizeSoqlIdentifier(value, label = 'identifier') {
  const normalizedValue = String(value || '').trim()

  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(normalizedValue)) {
    throw new Error(`Data ${label} tidak valid.`)
  }

  return normalizedValue
}

function escapeSoqlValue(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

export function buildWhereClause(filters = []) {
  if (!Array.isArray(filters) || filters.length === 0) {
    return ''
  }

  const conditions = filters
    .map(({ field, value }) => {
      const safeField = sanitizeSoqlIdentifier(field, 'field')
      const safeValue = String(value ?? '').trim()

      return `${safeField} = '${escapeSoqlValue(safeValue)}'`
    })
    .filter(Boolean)

  return conditions.length > 0 ? ` WHERE ${conditions.join(' AND ')}` : ''
}

export function formatObjectTitle(objectApiName = '') {
  return objectApiName.replace(/__/g, ' ').replace(/([a-z0-9])([A-Z])/g, '$1 $2')
}

export function buildListQuery(objectApiName, titleFieldName, filters = []) {
  const safeObjectApiName = sanitizeSoqlIdentifier(objectApiName, 'object api name')
  const safeTitleFieldName = sanitizeSoqlIdentifier(titleFieldName, 'title field')
  const whereClause = buildWhereClause(filters)

  return `SELECT Id, ${safeTitleFieldName} FROM ${safeObjectApiName}${whereClause} order by LastModifiedDate DESC LIMIT 5`
}

export function buildFiltersFromSearchParams(searchParams) {
  if (!searchParams || typeof searchParams.entries !== 'function') {
    return []
  }

  return Array.from(searchParams.entries())
    .map(([field, value]) => ({
      field: String(field || '').trim(),
      value: String(value ?? '').trim(),
    }))
    .filter(({ field, value }) => field && value)
}

export function resolveRecordTitle(record, titleFieldName, objectApiName, index) {
  const preferredTitle =
    record?.[titleFieldName] ||
    TITLE_FIELD_CANDIDATES.map((fieldName) => record?.[fieldName]).find(Boolean)

  return preferredTitle || `${objectApiName} ${index + 1}`
}

export function mapRecordsToCards(records, objectApiName, titleFieldName) {
  return records.map((record, index) => ({
    id: record?.Id || `${objectApiName}-${index + 1}`,
    title: resolveRecordTitle(record, titleFieldName, objectApiName, index),
    meta: record?.Id || 'Tanpa Id',
    objectType: objectApiName,
    raw: record,
  }))
}
