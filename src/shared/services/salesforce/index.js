export {
  ensureSalesforceConnection,
  getSalesforceConnectionSummary,
  sendSalesforceBinaryRequest,
  testSalesforceConnection,
} from './client.js'

export {
  createFeedElementComment,
  createRecordFeedElement,
  createRecordFeedElementWithSegments,
  fetchFeedElementComments,
  fetchContentVersion,
  fetchRecordFeedElements,
  uploadInlineImageToRecord,
  uploadFileToRecord,
} from './chatter.js'

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
