export {
  ensureSalesforceConnection,
  getSalesforceConnectionSummary,
  testSalesforceConnection,
} from './client.js'

export {
  createUiRecord,
  deleteUiRecord,
  fetchCreateDefaults,
  fetchPicklistValues,
  fetchRecentItems,
  fetchRecordUi,
  updateUiRecord,
} from './uiApi.js'

export {
  escapeSoqlValue,
  fetchSampleAccounts,
  getRecord,
  getRecordG,
  getRecords,
  getRecordsG,
  querySalesforceGraphQL,
  querySalesforceSoql,
  searchLookupRecords,
  updateRecord,
} from './query.js'

export {
  fetchAccountContactsByName,
  fetchAccountsWithContacts,
} from './account.js'

export { fetchAccountsContactsAndFeedItems } from './accountContactFeed.js'

export {
  ensureContactFromGoogleProfile,
  findContactByIdentity,
  updateContact,
} from './contact.js'
