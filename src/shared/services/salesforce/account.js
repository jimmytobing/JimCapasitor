import { escapeSoqlValue, getRecord, getRecords } from './query.js'

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
    contacts: contactRecords.map(mapContact).filter(Boolean),
  }
}

function mapAccountContactsCollection(records = []) {
  return records
    .map((record, index) => mapAccountContacts(record, record?.Name || `Account ${index + 1}`))
    .filter(Boolean)
}

export async function fetchAccountsWithContacts() {
  const records = await getRecords(
    'SELECT Id, Name, (SELECT Id, FirstName, LastName, Name FROM Contacts ORDER BY Name ASC) FROM Account ORDER BY Name ASC LIMIT 200'
  )
  return mapAccountContactsCollection(records)
}

export async function fetchAccountContactsByName(accountName) {
  const safeAccountName = typeof accountName === 'string' ? accountName.trim() : ''

  if (!safeAccountName) {
    return null
  }

  const record = await getRecord(
    `SELECT Id, Name, (SELECT Id, FirstName, LastName, Name FROM Contacts ORDER BY Name ASC) FROM Account WHERE Name = '${escapeSoqlValue(safeAccountName)}' LIMIT 1`
  )

  return mapAccountContacts(record, safeAccountName)
}
