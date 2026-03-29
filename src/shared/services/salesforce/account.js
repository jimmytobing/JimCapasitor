import { escapeSoqlValue, getRecord, getRecords } from './query.js'

const ACCOUNT_CONTACT_FIELDS =
  'SELECT Id, Name, App_Circle_ID__c, (SELECT Id, FirstName, LastName, Name FROM Contacts ORDER BY Name ASC) FROM Account'

function mapContact(contactRecord, index) {
  if (!contactRecord) {
    return null
  }

  return {
    id: contactRecord.Id || `contact-${index + 1}`,
    firstName: contactRecord.FirstName || '',
    lastName: contactRecord.LastName || '',
    name:
      contactRecord.Name ||
      [contactRecord.FirstName, contactRecord.LastName].filter(Boolean).join(' ') ||
      `Contact ${index + 1}`,
  }
}

function mapAccountContacts(accountRecord, fallbackName = 'Account') {
  if (!accountRecord) {
    return null
  }

  const contactRecords = Array.isArray(accountRecord?.Contacts?.records)
    ? accountRecord.Contacts.records
    : []

  return {
    id: accountRecord.Id || '',
    name: accountRecord.Name || fallbackName,
    circleId: accountRecord.App_Circle_ID__c || '',
    contacts: contactRecords.map(mapContact).filter(Boolean),
  }
}

function mapAccountContactsCollection(records = []) {
  return records
    .map((record, index) => mapAccountContacts(record, record?.Name || `Account ${index + 1}`))
    .filter(Boolean)
}

export async function fetchAccountsWithContacts() {
  const records = await getRecords(`${ACCOUNT_CONTACT_FIELDS} ORDER BY Name ASC LIMIT 200`)
  return mapAccountContactsCollection(records)
}

export async function fetchAccountContactsByName(accountName) {
  const safeAccountName = typeof accountName === 'string' ? accountName.trim() : ''

  if (!safeAccountName) {
    return null
  }

  const record = await getRecord(
    `${ACCOUNT_CONTACT_FIELDS} WHERE Name = '${escapeSoqlValue(safeAccountName)}' LIMIT 1`
  )

  return mapAccountContacts(record, safeAccountName)
}

export async function fetchAccountContactsByCircleId(circleId, fallbackAccountName = '') {
  const safeCircleId = typeof circleId === 'string' ? circleId.trim() : ''
  const safeFallbackName =
    typeof fallbackAccountName === 'string' ? fallbackAccountName.trim() : ''

  if (!safeCircleId && !safeFallbackName) {
    return null
  }

  if (safeCircleId) {
    const recordByCircleId = await getRecord(
      `${ACCOUNT_CONTACT_FIELDS} WHERE App_Circle_ID__c = '${escapeSoqlValue(safeCircleId)}' LIMIT 1`
    )

    if (recordByCircleId) {
      return mapAccountContacts(recordByCircleId, safeFallbackName || safeCircleId)
    }
  }

  if (safeFallbackName) {
    return fetchAccountContactsByName(safeFallbackName)
  }

  return null
}
