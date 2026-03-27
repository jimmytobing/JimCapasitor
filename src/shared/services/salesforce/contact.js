import { sendSalesforceRequest } from './client.js'
import { escapeSoqlValue, getRecord } from './query.js'

function splitDisplayName(profile) {
  const givenName = typeof profile?.givenName === 'string' ? profile.givenName.trim() : ''
  const familyName = typeof profile?.familyName === 'string' ? profile.familyName.trim() : ''

  if (givenName || familyName) {
    return {
      firstName: givenName,
      lastName: familyName || givenName || 'Google User',
    }
  }

  const fullName = typeof profile?.name === 'string' ? profile.name.trim() : ''
  if (!fullName) {
    return {
      firstName: '',
      lastName: 'Google User',
    }
  }

  const parts = fullName.split(/\s+/).filter(Boolean)
  if (parts.length === 1) {
    return {
      firstName: '',
      lastName: parts[0],
    }
  }

  return {
    firstName: parts.slice(0, -1).join(' '),
    lastName: parts.at(-1) || 'Google User',
  }
}

function compactRecordFields(payload) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== '' && value != null)
  )
}

function buildGoogleDescription(profile) {
  const details = [
    'Created automatically from Google Sign-In.',
    profile?.email ? `Email: ${profile.email}` : '',
    profile?.locale ? `Locale: ${profile.locale}` : '',
    typeof profile?.emailVerified === 'boolean'
      ? `Email Verified: ${profile.emailVerified ? 'Yes' : 'No'}`
      : '',
    profile?.googleId ? `Google ID: ${profile.googleId}` : '',
  ].filter(Boolean)

  return details.join(' | ')
}

export function buildContactPayloadFromGoogleProfile(profile) {
  const { firstName, lastName } = splitDisplayName(profile)

  return compactRecordFields({
    FirstName: firstName,
    LastName: lastName || 'Google User',
    Email: profile?.email || '',
    App_User_ID__c: profile?.username || profile?.email || '',
    Photo__c: profile?.avatarUrl || '',
    Description: buildGoogleDescription(profile),
  })
}

export async function findContactByIdentity({ username = '', email = '', id = '' } = {}) {
  const candidateQueries = []

  if (id) {
    candidateQueries.push(`SELECT FIELDS(ALL) FROM Contact WHERE Id = '${escapeSoqlValue(id)}' LIMIT 1`)
  }

  if (username) {
    candidateQueries.push(
      `SELECT FIELDS(ALL) FROM Contact WHERE App_User_ID__c = '${escapeSoqlValue(username)}' LIMIT 1`
    )
  }

  if (email) {
    candidateQueries.push(
      `SELECT FIELDS(ALL) FROM Contact WHERE Email = '${escapeSoqlValue(email)}' LIMIT 1`
    )
  }

  for (const query of candidateQueries) {
    const record = await getRecord(query)
    if (record) return record
  }

  return null
}

export async function createContact(payload) {
  const response = await sendSalesforceRequest('sobjects/Contact', {
    method: 'POST',
    data: payload,
  })

  if (!response?.id) {
    throw new Error('Salesforce berhasil menerima create Contact, tapi tidak mengembalikan Id.')
  }

  return findContactByIdentity({ id: response.id })
}

export async function updateContact(id, payload) {
  if (!id) {
    throw new Error('Contact Id wajib ada untuk update Salesforce Contact.')
  }

  await sendSalesforceRequest(`sobjects/Contact/${id}`, {
    method: 'PATCH',
    data: payload,
  })

  return findContactByIdentity({ id })
}

export async function ensureContactFromGoogleProfile(profile) {
  const payload = buildContactPayloadFromGoogleProfile(profile)
  const existingContact = await findContactByIdentity({
    username: profile?.username || '',
    email: profile?.email || '',
  })

  if (existingContact) {
    const updatedContact = await updateContact(existingContact.Id, payload)

    return {
      contact: updatedContact,
      created: false,
      updated: true,
    }
  }

  const createdContact = await createContact(payload)

  return {
    contact: createdContact,
    created: true,
    updated: false,
  }
}
