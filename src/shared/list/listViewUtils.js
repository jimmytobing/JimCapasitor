export const TITLE_FIELD_CANDIDATES = ['Name', 'Title', 'Name__c', 'Title__c']

export function formatObjectTitle(objectApiName = '') {
  return objectApiName.replace(/__/g, ' ').replace(/([a-z0-9])([A-Z])/g, '$1 $2')
}

export function buildListQuery(objectApiName, titleFieldName) {
  return `SELECT Id, ${titleFieldName} FROM ${objectApiName} LIMIT 5`
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
